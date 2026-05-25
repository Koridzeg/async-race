import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CarComponent } from '../car/car.component';

@Component({
  selector: 'ar-race-track',
  imports: [CarComponent],
  templateUrl: './race-track.component.html',
  styleUrl: './race-track.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceTrackComponent {

  @Input({ required: true }) public color!: string;
  @Input({ required: true }) public name!: string;

  @Input() public duration = 0;

  @Input() public isDriving = false;

  @Input() public isBroken = false;
}
