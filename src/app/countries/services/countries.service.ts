import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private urlApi: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital:    { term: '', countries: [] },
    byCountries:  { term: '', countries: [] },
    byRegion:     { region: '', countries: [] },
  }

  constructor( private http: HttpClient ) {
    console.log('CountriesService init');
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem( 'cacheStore', JSON.stringify( this.cacheStore ) );
  }

  private loadFromLocalStorage() {
    if ( !localStorage.getItem('cacheStore') ) return;

    this.cacheStore = JSON.parse( localStorage.getItem('cacheStore')! )
  }

  private getCountriesRequest ( url: string ): Observable<Country[]> {
    return this.http.get<Country[]>( url )
    .pipe(
      catchError( () => of([]) ),
      // delay( 2000 ),
    );
  }

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
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byCapital = {
          term: term,
          countries: countries
        } ),
        tap( () => this.saveToLocalStorage() ),
      );
    // return this.http.get<Country[]>( url )
    //   .pipe(
    //     catchError( error => {
    //       console.log(error);
    //       return of([]);
    //     })
    //   );
  }

  searchCountry( term:string ): Observable<Country[]> {
    // https://restcountries.com/v3.1/name/ecua?fullText=false
    const url = `${ this.urlApi }/name/${ term }?fullText=false`;
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byCountries = {
          term: term,
          countries: countries
        } ),
        tap( () => this.saveToLocalStorage() ),
      );
    // return this.http.get<Country[]>( url )
    //   .pipe(
    //     catchError( error => {
    //       console.log(error);
    //       return of([]);
    //     })
    //   );
  }

  searchRegion( region:Region ): Observable<Country[]> {
    //https://restcountries.com/v3.1/region/{region}
    const url = `${ this.urlApi }/region/${ region }`;
    return this.getCountriesRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byRegion = { region, countries }),
      tap( () => this.saveToLocalStorage() ),
    );
    // return this.http.get<Country[]>( url )
    //   .pipe(
    //     catchError( error => {
    //       console.log(error);
    //       return of([]);
    //     })
    //   );
  }

}
