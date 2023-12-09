import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BingMapsService {
  private apiKey: string = 'Ag-XYhdiExTebzvha_lT6Ju49wQycTW5DYjlOgjyUAfwE1PbOAItrKZQ3OD95NwT'; // Replace with your API key

  constructor(private http: HttpClient) {}

  getCoordinates(address: string): Observable<any> {
    return this.http.get(`https://localhost:44387/getCoordinates`, { params: { address } });
  }
}
