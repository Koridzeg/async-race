import { Injectable, computed, inject, signal } from '@angular/core';

import { Car, CreateCarPayload, UpdateCarPayload } from '../core/models/car.model';
import { GarageApiService } from '../core/services/garage-api.service';
import { RaceStore } from './race-store.service';

const PAGE_SIZE = 7;
const FIRST_PAGE = 1;

@Injectable({ providedIn: 'root' })
export class GarageStore {
  private readonly api = inject(GarageApiService);
private readonly raceStore = inject(RaceStore);

  private readonly _cars = signal<Car[]>([]);
  private readonly _total = signal(0);
  private readonly _page = signal(FIRST_PAGE);
  private readonly _loading = signal(false);


  public readonly cars = this._cars.asReadonly();
  public readonly total = this._total.asReadonly();
  public readonly page = this._page.asReadonly();
  public readonly loading = this._loading.asReadonly();


  public readonly pageSize = PAGE_SIZE;
  public readonly totalPages = computed(() => Math.max(1, Math.ceil(this._total() / PAGE_SIZE)));
  public readonly isEmpty = computed(() => this._total() === 0);



  public load(): void {
    this._loading.set(true);
    this.api.getCars(this._page(), PAGE_SIZE).subscribe({
      next: (result) => {
        this._cars.set(result.items);
        this._total.set(result.total);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }

  public goToPage(page: number): void {
    const clamped = Math.max(FIRST_PAGE, Math.min(page, this.totalPages()));
    if (clamped === this._page()) {
      return;
    }
    this._page.set(clamped);
    this.load();
  }

  public createCar(payload: CreateCarPayload): void {
    this.api.createCar(payload).subscribe(() => this.load());
  }

  public updateCar(id: number, payload: UpdateCarPayload): void {
    this.api.updateCar(id, payload).subscribe(() => this.load());
  }

public deleteCar(id: number): void {
  this.raceStore.forgetCar(id);
  this.api.deleteCar(id).subscribe(() => {
    const remainingOnPage = this._cars().length - 1;
    if (remainingOnPage === 0 && this._page() > FIRST_PAGE) {
      this._page.update((p) => p - 1);
    }
    this.load();
  });
}

  public createMany(payloads: CreateCarPayload[]): void {

    let pending = payloads.length;
    if (pending === 0) {
      return;
    }
    payloads.forEach((p) => {
      this.api.createCar(p).subscribe({
        next: () => {
          pending -= 1;
          if (pending === 0) {
            this.load();
          }
        },
        error: () => {
          pending -= 1;
          if (pending === 0) {
            this.load();
          }
        },
      });
    });
  }
}