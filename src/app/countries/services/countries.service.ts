import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { Country } from '../interfaces/country';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {


  private urlApi: string = 'https://restcountries.com/v3.1';

  constructor( private http: HttpClient ) { }

  searchCountryByAlphaCode( code:string ): Observable<Country | null> {
    // https://restcountries.com/v3.1/alpha/{code}
    const url = `${ this.urlApi }/alpha/${ code }`;
    return this.http.get<Country[]>( url )
      .pipe(
        map( countries => countries.length > 0 ? countries[0]: null),
        catchError( error => {
          console.log(error);
          return of(null);
        })
      );
  }

  searchCapital( term: string ): Observable<Country[]> {
    const url = `${ this.urlApi }/capital/${ term }`;
    return this.http.get<Country[]>( url )
      .pipe(
        catchError( error => {
          console.log(error);
          return of([]);
        })
      );
  }

  searchCountry( term:String ): Observable<Country[]> {
    // https://restcountries.com/v3.1/name/ecua?fullText=false
    const url = `${ this.urlApi }/name/${ term }?fullText=false`;
    return this.http.get<Country[]>( url )
      .pipe(
        catchError( error => {
          console.log(error);
          return of([]);
        })
      );
  }

  searchRegion( term:String ): Observable<Country[]> {
    //https://restcountries.com/v3.1/region/{region}
    const url = `${ this.urlApi }/region/${ term }`;
    return this.http.get<Country[]>( url )
      .pipe(
        catchError( error => {
          console.log(error);
          return of([]);
        })
      );
  }

}
