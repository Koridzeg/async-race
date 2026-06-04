import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface CarFormValue {
  name: string;
  color: string;
}

const NAME_MAX_LENGTH = 40;
const DEFAULT_COLOR = '#ff6b35';

@Component({
  selector: 'ar-car-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarFormComponent implements OnChanges {
  @Input() public mode: 'create' | 'edit' = 'create';
  @Input() public initialValue: CarFormValue | null = null;
  @Input() public disabled = false;

  @Output() public readonly submitForm = new EventEmitter<CarFormValue>();
  @Output() public readonly cancelEdit = new EventEmitter<void>();

  public name = '';
  public color: string = DEFAULT_COLOR;
  public readonly maxLength = NAME_MAX_LENGTH;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] && this.initialValue) {
      this.name = this.initialValue.name;
      this.color = this.initialValue.color;
    }
  }

  public onSubmit(): void {
    const trimmed = this.name.trim();
    if (!trimmed || this.disabled) {
      return;
    }
    this.submitForm.emit({ name: trimmed, color: this.color });
    if (this.mode === 'create') {
      this.reset();
    }
  }

  public onCancel(): void {
    this.cancelEdit.emit();
    this.reset();
  }

  private reset(): void {
    this.name = '';
    this.color = DEFAULT_COLOR;
  }
}
