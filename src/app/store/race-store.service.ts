import { Injectable, computed, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import { Car } from '../core/models/car.model';
import { EngineApiService } from '../core/services/engine-api.service';
import { WinnersStore } from './winners-store.service';

const MS_PER_SECOND = 1000;
const TIME_DECIMALS = 2;

export type CarStatus = 'idle' | 'starting' | 'driving' | 'finished' | 'broken' | 'stopping';

export interface CarRaceState {
  status: CarStatus;
  duration: number;
}

export interface RaceWinner {
  id: number;
  name: string;
  time: number;
}

@Injectable({ providedIn: 'root' })
export class RaceStore {
  private readonly engineApi = inject(EngineApiService);
  private readonly winnersStore = inject(WinnersStore);

  private readonly _carStates = signal<Map<number, CarRaceState>>(new Map());
  public readonly carStates = this._carStates.asReadonly();

  private readonly _isRacing = signal(false);
  public readonly isRacing = this._isRacing.asReadonly();

  private readonly _winner = signal<RaceWinner | null>(null);
  public readonly winner = this._winner.asReadonly();

  public readonly hasActiveCars = computed(() =>
    Array.from(this._carStates().values()).some(
      (s) => s.status === 'starting' || s.status === 'driving' || s.status === 'stopping',
    ),
  );

  private readonly driveSubs = new Map<number, Subscription>();

  public startCar(car: Car): Promise<RaceWinner | null> {
    return new Promise<RaceWinner | null>((resolve) => {
      this.setCarState(car.id, { status: 'starting', duration: 0 });

      this.engineApi.start(car.id).subscribe({
        next: ({ velocity, distance }) => {
          const duration = distance / velocity;
          this.setCarState(car.id, { status: 'driving', duration });
          this.runDrive(car, duration, resolve);
        },
        error: () => {
          this.setCarState(car.id, { status: 'idle', duration: 0 });
          resolve(null);
        },
      });
    });
  }

  public stopCar(carId: number): void {
    this.cancelDrive(carId);
    this.setCarState(carId, { status: 'stopping', duration: 0 });

    this.engineApi.stop(carId).subscribe({
      next: () => this.setCarState(carId, { status: 'idle', duration: 0 }),
      error: () => this.setCarState(carId, { status: 'idle', duration: 0 }),
    });
  }

  public async startRace(cars: readonly Car[]): Promise<void> {
    if (this._isRacing()) {
      return;
    }
    this._isRacing.set(true);
    this._winner.set(null);

    let firstFinisher: RaceWinner | null = null;

    await Promise.all(
      cars.map(async (car) => {
        const result = await this.startCar(car);
        if (result && !firstFinisher) {
          firstFinisher = result;
          this._winner.set(result);
          this.winnersStore.recordWin(result.id, result.time);
        }
      }),
    );

    this._isRacing.set(false);
  }

  public resetRace(carIds: readonly number[]): void {
    this._winner.set(null);
    this._isRacing.set(false);
    carIds.forEach((id) => this.stopCar(id));
  }

  public forgetCar(carId: number): void {
    this.cancelDrive(carId);
    this._carStates.update((map) => {
      if (!map.has(carId)) return map;
      const next = new Map(map);
      next.delete(carId);
      return next;
    });
  }

  private runDrive(car: Car, duration: number, resolve: (w: RaceWinner | null) => void): void {
    const startedAt = performance.now();

    const sub = this.engineApi.drive(car.id).subscribe({
      next: () => {
        const elapsed = (performance.now() - startedAt) / MS_PER_SECOND;
        const time = Number(elapsed.toFixed(TIME_DECIMALS));
        this.setCarState(car.id, { status: 'finished', duration });
        this.driveSubs.delete(car.id);
        resolve({ id: car.id, name: car.name, time });
      },
      error: () => {
        this.setCarState(car.id, { status: 'broken', duration });
        this.driveSubs.delete(car.id);
        resolve(null);
      },
    });

    this.driveSubs.set(car.id, sub);
  }

  private cancelDrive(carId: number): void {
    const sub = this.driveSubs.get(carId);
    if (sub) {
      sub.unsubscribe();
      this.driveSubs.delete(carId);
    }
  }

  private setCarState(carId: number, state: CarRaceState): void {
    this._carStates.update((map) => {
      const next = new Map(map);
      next.set(carId, state);
      return next;
    });
  }
}
