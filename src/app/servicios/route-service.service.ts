import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class RouteService {
  private currentRouteSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRouteSubject.next(event.url);
      }
    });
  }

  getCurrentRoute(): BehaviorSubject<string> {
    return this.currentRouteSubject;
  }
}