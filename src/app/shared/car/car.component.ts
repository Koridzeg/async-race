import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ar-car',
  standalone: true,
  imports: [],
  templateUrl: './car.component.html',
  styleUrl: './car.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarComponent {
  @Input({ required: true }) public color!: string;
}
