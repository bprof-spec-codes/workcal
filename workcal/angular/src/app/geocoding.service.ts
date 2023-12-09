import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BingMapsService {
  private apiKey: string = 'Ag-XYhdiExTebzvha_lT6Ju49wQycTW5DYjlOgjyUAfwE1PbOAItrKZQ3OD95NwT'; // Replace with your API key

  constructor(private httpClient: HttpClient) { }

  getCoordinatesForAddress(address: string): Observable<any> {
    const bingMapsUrl = `https://dev.virtualearth.net/REST/v1/Locations?query=${encodeURIComponent(address)}&key=${this.apiKey}`;

    return this.httpClient.get(bingMapsUrl);
  }
}
