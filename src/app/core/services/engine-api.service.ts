import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL, API_PATHS, QUERY_PARAMS } from '../constants';
import { DriveResult, EngineState, EngineStatus } from '../models/enginge.model';

@Injectable({ providedIn: 'root' })
export class EngineApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}${API_PATHS.engine}`;

  public start(id: number): Observable<EngineState> {
    return this.patchEngine<EngineState>(id, 'started');
  }

  public stop(id: number): Observable<EngineState> {
    return this.patchEngine<EngineState>(id, 'stopped');
  }

  public drive(id: number): Observable<DriveResult> {
    return this.patchEngine<DriveResult>(id, 'drive');
  }

  private patchEngine<T>(id: number, status: EngineStatus): Observable<T> {
    const params = new HttpParams().set(QUERY_PARAMS.id, id).set(QUERY_PARAMS.status, status);
    return this.http.patch<T>(this.url, null, { params });
  }
}
