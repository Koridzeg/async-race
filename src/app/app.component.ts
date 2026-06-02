import { Component, OnInit, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { GarageApiService } from './core/services/garage-api.service';
import { Car } from './core/models/car.model';

@Component({
  selector: 'ar-root',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly api = inject(GarageApiService);

  public cars = signal<Car[]>([]);
  public total = signal(0);

  public ngOnInit(): void {
    this.load();
  }

  public createDummy(): void {
    this.api.createCar({ name: 'Test Car', color: '#3fb950' }).subscribe(() => this.load());
  }

  private load(): void {
    this.api.getCars(1, 7).subscribe((result) => {
      this.cars.set(result.items);
      this.total.set(result.total);
    });
  }
}