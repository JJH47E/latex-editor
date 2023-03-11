import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private httpClient: HttpClient) { }

  public getJsonData<T>(fileName: string): Observable<T[]> {
    if (!fileName) {
      console.log('fileName not provided');
      return new Observable<T[]>();
    }
    return this.httpClient.get<T[]>(`assets/${fileName}.json`).pipe(shareReplay(1));
  }
}
