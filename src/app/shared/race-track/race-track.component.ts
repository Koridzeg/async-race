import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CarComponent } from '../car/car.component';

@Component({
  selector: 'ar-race-track',
  standalone: true,
  imports: [CarComponent],
  templateUrl: './race-track.component.html',
  styleUrl: './race-track.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceTrackComponent {
  @Input({ required: true }) public id!: number;
  @Input({ required: true }) public name!: string;
  @Input({ required: true }) public color!: string;

  @Input() public duration = 0;
  @Input() public isDriving = false;
  @Input() public isBroken = false;
  @Input() public canStart = true;
  @Input() public canStop = false;
  @Input() public actionsDisabled = false;

  @Output() public readonly startEngine = new EventEmitter<number>();
  @Output() public readonly stopEngine = new EventEmitter<number>();
  @Output() public readonly selectCar = new EventEmitter<number>();
  @Output() public readonly remove = new EventEmitter<number>();
}
