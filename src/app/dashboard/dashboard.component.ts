import { Component, OnInit } from '@angular/core';
import {Hero} from '../Hero';
import {HeroService} from '../hero.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(
    private router: Router,
    private heroService: HeroService
  ) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    /*this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes.slice(1,5));*/
    this.heroService.getHeroes().toPromise()
      .then(
        heroes => this.heroes = heroes.slice(0,4),
        error => {
          this.router.navigate(['login']);
          console.error('An error occurred in dashboard component, navigating to login: ', error);
        }
      );
  }
}
