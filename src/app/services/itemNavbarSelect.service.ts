import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemNavbarSelect {
  private selectedItemIndexSubject = new BehaviorSubject<number | null>(null);

  selectedItemIndex$ = this.selectedItemIndexSubject.asObservable();

  setSelectedItemIndex(index: number) {
    this.selectedItemIndexSubject.next(index);
  }
}
