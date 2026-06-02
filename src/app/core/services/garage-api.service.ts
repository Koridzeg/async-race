import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  API_BASE_URL,
  API_PATHS,
  QUERY_PARAMS,
  TOTAL_COUNT_HEADER,
} from '../constants';
import { Car, CreateCarPayload, UpdateCarPayload } from '../models/car.model';
import { Paginated } from '../models/paginated.model';

@Injectable({ providedIn: 'root' })
export class GarageApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}${API_PATHS.garage}`;

  public getCars(page: number, limit: number): Observable<Paginated<Car>> {
    const params = new HttpParams()
      .set(QUERY_PARAMS.page, page)
      .set(QUERY_PARAMS.limit, limit);

    return this.http
      .get<Car[]>(this.url, { params, observe: 'response' })
      .pipe(map((response) => this.toPaginated(response)));
  }

  public getCar(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.url}/${id}`);
  }

  public createCar(payload: CreateCarPayload): Observable<Car> {
    return this.http.post<Car>(this.url, payload);
  }

  public updateCar(id: number, payload: UpdateCarPayload): Observable<Car> {
    return this.http.put<Car>(`${this.url}/${id}`, payload);
  }

  public deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  private toPaginated(response: HttpResponse<Car[] | null>): Paginated<Car> {
    const items = response.body ?? [];
    const totalHeader = response.headers.get(TOTAL_COUNT_HEADER);
    const total = totalHeader ? Number(totalHeader) : items.length;
    return { items, total };
  }
}