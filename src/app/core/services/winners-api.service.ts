import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { API_BASE_URL, API_PATHS, QUERY_PARAMS, TOTAL_COUNT_HEADER } from '../constants';
import { Paginated } from '../models/paginated.model';
import { SortOrder, Winner, WinnerSortField } from '../models/winner.model';

export interface GetWinnersOptions {
  page: number;
  limit: number;
  sort?: WinnerSortField;
  order?: SortOrder;
}

@Injectable({ providedIn: 'root' })
export class WinnersApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}${API_PATHS.winners}`;

  public getWinners(options: GetWinnersOptions): Observable<Paginated<Winner>> {
    let params = new HttpParams()
      .set(QUERY_PARAMS.page, options.page)
      .set(QUERY_PARAMS.limit, options.limit);

    if (options.sort) {
      params = params.set(QUERY_PARAMS.sort, options.sort);
    }
    if (options.order) {
      params = params.set(QUERY_PARAMS.order, options.order);
    }

    return this.http
      .get<Winner[]>(this.url, { params, observe: 'response' })
      .pipe(map((response) => this.toPaginated(response)));
  }

  /** Returns the winner, or null if not found (404). */
  public getWinner(id: number): Observable<Winner | null> {
    return this.http.get<Winner>(`${this.url}/${id}`).pipe(catchError(() => of(null)));
  }

  public createWinner(winner: Winner): Observable<Winner> {
    return this.http.post<Winner>(this.url, winner);
  }

  public updateWinner(id: number, payload: Omit<Winner, 'id'>): Observable<Winner> {
    return this.http.put<Winner>(`${this.url}/${id}`, payload);
  }

  public deleteWinner(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  private toPaginated(response: HttpResponse<Winner[] | null>): Paginated<Winner> {
    const items = response.body ?? [];
    const totalHeader = response.headers.get(TOTAL_COUNT_HEADER);
    const total = totalHeader ? Number(totalHeader) : items.length;
    return { items, total };
  }
}
