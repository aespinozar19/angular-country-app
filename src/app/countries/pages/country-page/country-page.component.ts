import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country';


@Component({
  selector: 'countries-country-page',
  templateUrl: './country-page.component.html',
  styles: [
  ]
})
export class CountryPageComponent implements OnInit {

  public country?: Country;

  constructor(
    private activatedRouter: ActivatedRoute,
    private countriesServices: CountriesService,
    private router: Router
    ) {}

  ngOnInit(): void {
  this.activatedRouter.params
    .pipe(
      switchMap( ({ id }) => this.countriesServices.searchCountryByAlphaCode( id ) ),
    )
    .subscribe(  ( country ) => {
      if ( !country ) return this.router.navigateByUrl('')
      return this.country = country;
    });
  }

}
