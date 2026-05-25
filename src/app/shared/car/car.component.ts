import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ar-car',
  imports: [],
  templateUrl: './car.component.html',
  styleUrl: './car.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarComponent {
  @Input({ required: true }) public color!: string;
}
