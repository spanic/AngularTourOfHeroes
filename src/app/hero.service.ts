import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Hero} from './hero';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from './message.service';
import {of} from 'rxjs/observable/of';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class HeroService {

  private heroesURL = 'api/heroes';

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService
  ) { }

  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(this.heroesURL)
      .pipe(
        tap(() => this.log('fetched Heroes')),
        catchError(this.handleError('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesURL}/${id}`;
    return this.httpClient.get<Hero>(url)
      .pipe(
        tap(() => this.log(`fetched Hero with id: ${id}`)),
        catchError(this.handleError<Hero>(`getHero(${id})`))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.httpClient.put(this.heroesURL, hero, httpOptions)
      .pipe(
        tap(() => this.log(`updated Hero with id: ${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  addHero(hero: Hero): Observable<any> {
    return this.httpClient.post(this.heroesURL, hero, httpOptions)
      .pipe(
        tap(() => this.log(`added Hero with id: ${hero.id}, name: ${hero.name}`)),
        catchError(this.handleError<any>('addHero'))
      );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesURL}/${id}`;
    return this.httpClient.delete<Hero>(url, httpOptions)
      .pipe(
        tap(() => this.log(`deleted Hero with id: ${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  searchHeroes(term: String): Observable<Hero[]> {
    if (!term.trim()) { return of([]); }
    return this.httpClient.get<Hero[]>(`${this.heroesURL}/?name=${term}`)
      .pipe(
        tap(() => this.log(`found Heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return(error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

}
