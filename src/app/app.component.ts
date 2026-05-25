import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CarComponent } from './shared/car/car.component';
import { RaceTrackComponent } from './shared/race-track/race-track.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CarComponent,RaceTrackComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'async-race';
}
