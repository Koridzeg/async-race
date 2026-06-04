import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { CarComponent } from '../../shared/car/car.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { WinnersStore } from '../../store/winners-store.service';
import { WinnerSortField } from '../../core/models/winner.model';

@Component({
  selector: 'ar-winners',
  standalone: true,
  imports: [CarComponent, PaginationComponent],
  templateUrl: './winners.component.html',
  styleUrl: './winners.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnersComponent implements OnInit {
  public readonly store = inject(WinnersStore);

  public ngOnInit(): void {
    this.store.load();
  }

  public toggleSort(field: WinnerSortField): void {
    this.store.toggleSort(field);
  }

  public sortIcon(field: WinnerSortField): string {
    if (this.store.sort() !== field) return '';
    return this.store.order() === 'ASC' ? '▲' : '▼';
  }

  public rowNumber(index: number): number {
    return (this.store.page() - 1) * this.store.pageSize + index + 1;
  }
}