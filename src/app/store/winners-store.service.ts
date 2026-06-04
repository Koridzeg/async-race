import { Injectable, computed, inject, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Car } from '../core/models/car.model';
import { Winner, WinnerSortField, WinnerView, SortOrder } from '../core/models/winner.model';
import { GarageApiService } from '../core/services/garage-api.service';
import { WinnersApiService } from '../core/services/winners-api.service';

const PAGE_SIZE = 10;
const FIRST_PAGE = 1;

@Injectable({ providedIn: 'root' })
export class WinnersStore {
  private readonly winnersApi = inject(WinnersApiService);
  private readonly garageApi = inject(GarageApiService);

  private readonly _winners = signal<WinnerView[]>([]);
  private readonly _total = signal(0);
  private readonly _page = signal(FIRST_PAGE);
  private readonly _sort = signal<WinnerSortField>('id');
  private readonly _order = signal<SortOrder>('ASC');
  private readonly _loading = signal(false);

  public readonly winners = this._winners.asReadonly();
  public readonly total = this._total.asReadonly();
  public readonly page = this._page.asReadonly();
  public readonly sort = this._sort.asReadonly();
  public readonly order = this._order.asReadonly();
  public readonly loading = this._loading.asReadonly();

  public readonly pageSize = PAGE_SIZE;
  public readonly totalPages = computed(() => Math.max(1, Math.ceil(this._total() / PAGE_SIZE)));

  public load(): void {
    this._loading.set(true);
    this.winnersApi
      .getWinners({
        page: this._page(),
        limit: PAGE_SIZE,
        sort: this._sort(),
        order: this._order(),
      })
      .subscribe({
        next: (result) => this.hydrateWithCars(result.items, result.total),
        error: () => this._loading.set(false),
      });
  }

  public goToPage(page: number): void {
    const clamped = Math.max(FIRST_PAGE, Math.min(page, this.totalPages()));
    if (clamped === this._page()) return;
    this._page.set(clamped);
    this.load();
  }

  public toggleSort(field: WinnerSortField): void {
    if (this._sort() === field) {
      this._order.update((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      this._sort.set(field);
      this._order.set('ASC');
    }
    this.load();
  }

  public recordWin(carId: number, time: number): void {
    this.winnersApi.getWinner(carId).subscribe((existing) => {
      if (existing) {
        const bestTime = Math.min(existing.time, time);
        this.winnersApi
          .updateWinner(carId, { wins: existing.wins + 1, time: bestTime })
          .subscribe();
      } else {
        const newWinner: Winner = { id: carId, wins: 1, time };
        this.winnersApi.createWinner(newWinner).subscribe();
      }
    });
  }

  private hydrateWithCars(winners: Winner[], total: number): void {
    if (winners.length === 0) {
      this._winners.set([]);
      this._total.set(total);
      this._loading.set(false);
      return;
    }

    const carRequests = winners.map((w) =>
      this.garageApi.getCar(w.id).pipe(catchError(() => of<Car | null>(null))),
    );

    forkJoin(carRequests).subscribe({
      next: (cars) => {
        const views: WinnerView[] = winners.map((w, i) => {
          const car = cars[i] as Car | null;
          return {
            ...w,
            name: car?.name ?? '(deleted)',
            color: car?.color ?? '#888888',
          };
        });
        this._winners.set(views);
        this._total.set(total);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }
}
