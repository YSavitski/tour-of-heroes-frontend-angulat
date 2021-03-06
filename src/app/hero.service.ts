import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {Hero} from './Hero';
import {of} from 'rxjs/observable/of';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class HeroService {
  private heroesUrl = 'http://localhost:8080/heroes';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authenticationService: AuthenticationService
  ) { }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl, this.httpOptions)
      .pipe(
        tap(_ => this.log(`fetched heroes`)),
        catchError(this.handleError('getHeroes', []))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`update hero id=${hero.id}`)),
        catchError(this.handleError<any>(`updateHero`))
      )
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((hero: Hero) => this.log(`added hero with id=${hero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof  hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  searchHeroesByName(name: string): Observable<Hero[]> {
    if(!name.trim()) { return of([]); }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${name}`, this.httpOptions)
      .pipe(
        tap(_ => this.log(`found heroes matching "${name}"`)),
        catchError(this.handleError<Hero[]>('searchHeroesByName', []))
      );
  }

  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }
}
