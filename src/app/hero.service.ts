import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Hero} from './hero';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from './message.service';
import {of} from 'rxjs/observable/of';

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

  private handleError<T> (operation = 'operation', result?: T) {
    return(error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add('HeroService [LOG]: ' + message);
  }

}
