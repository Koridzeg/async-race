import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';

import { Car } from '../../core/models/car.model';
import { randomCars } from '../../core/utils/random.util';
import { CarFormComponent, CarFormValue } from '../../shared/car-form/car-form.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { RaceControlsComponent } from '../../shared/race-controls/race-controls.component';
import { RaceTrackComponent } from '../../shared/race-track/race-track.component';
import { GarageStore } from '../../store/garage-store.service';
import { CarStatus, RaceStore } from '../../store/race-store.service';

const RANDOM_BATCH_SIZE = 100;
const ANIMATING_STATUSES: readonly CarStatus[] = ['driving', 'finished', 'broken'];
interface CarRenderState {
  duration: number;
  isDriving: boolean;
  isBroken: boolean;
  canStart: boolean;
  canStop: boolean;
}

const IDLE_STATE: CarRenderState = {
  duration: 0,
  isDriving: false,
  isBroken: false,
  canStart: true,
  canStop: false,
};

@Component({
  selector: 'ar-garage',
  standalone: true,
  imports: [CarFormComponent, RaceControlsComponent, RaceTrackComponent, PaginationComponent],
  templateUrl: './garage.component.html',
  styleUrl: './garage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GarageComponent implements OnInit {
  public readonly garage = inject(GarageStore);
  public readonly race = inject(RaceStore);

  public readonly editingCar = signal<Car | null>(null);

  public readonly editingInitialValue = computed<CarFormValue | null>(() => {
    const c = this.editingCar();
    return c ? { name: c.name, color: c.color } : null;
  });

  public ngOnInit(): void {
    if (this.garage.cars().length === 0) {
      this.garage.load();
    }
  }

public renderStateFor(carId: number): CarRenderState {
  const state = this.race.carStates().get(carId);
  if (!state) return IDLE_STATE;

  return {
    duration: state.duration,
    isDriving: ANIMATING_STATUSES.includes(state.status),
    isBroken: state.status === 'broken',
    canStart: state.status === 'idle' || state.status === 'broken',
    canStop: state.status !== 'idle' && state.status !== 'starting',
  };
}

  public onCreate(value: CarFormValue): void {
    this.garage.createCar(value);
  }

  public onUpdate(value: CarFormValue): void {
    const target = this.editingCar();
    if (!target) return;
    this.garage.updateCar(target.id, value);
    this.editingCar.set(null);
  }

  public onCancelEdit(): void {
    this.editingCar.set(null);
  }

  public onSelect(id: number): void {
    const car = this.garage.cars().find((c) => c.id === id);
    if (car) this.editingCar.set(car);
  }

  public onRemove(id: number): void {
    this.garage.deleteCar(id);
    if (this.editingCar()?.id === id) this.editingCar.set(null);
  }

  public onStartEngine(id: number): void {
    const car = this.garage.cars().find((c) => c.id === id);
    if (car) this.race.startCar(car);
  }

  public onStopEngine(id: number): void {
    this.race.stopCar(id);
  }

  public onStartRace(): void {
    this.race.startRace(this.garage.cars());
  }

  public onResetRace(): void {
    this.race.resetRace(this.garage.cars().map((c) => c.id));
  }

  public onGenerateRandom(): void {
    this.garage.createMany(randomCars(RANDOM_BATCH_SIZE));
  }

  public onPageChange(page: number): void {
    this.race.resetRace(this.garage.cars().map((c) => c.id));
    this.garage.goToPage(page);
  }
}