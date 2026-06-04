import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ar-race-controls',
  standalone: true,
  templateUrl: './race-controls.component.html',
  styleUrl: './race-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceControlsComponent {
  @Input() public isRacing = false;
  @Input() public canReset = false;

  @Output() public readonly startRace = new EventEmitter<void>();
  @Output() public readonly resetRace = new EventEmitter<void>();
  @Output() public readonly generateRandom = new EventEmitter<void>();
}
