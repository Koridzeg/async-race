import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

const FIRST_PAGE = 1;

@Component({
  selector: 'ar-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input({ required: true }) public page!: number;
  @Input({ required: true }) public totalPages!: number;
  @Input() public disabled = false;

  @Output() public readonly pageChange = new EventEmitter<number>();

  public get isFirstPage(): boolean {
    return this.page <= FIRST_PAGE;
  }

  public get isLastPage(): boolean {
    return this.page >= this.totalPages;
  }

  public prev(): void {
    if (!this.isFirstPage) {
      this.pageChange.emit(this.page - 1);
    }
  }

  public next(): void {
    if (!this.isLastPage) {
      this.pageChange.emit(this.page + 1);
    }
  }
}