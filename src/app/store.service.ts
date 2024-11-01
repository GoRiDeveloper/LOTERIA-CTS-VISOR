import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
 
  private isOpenCanvasUser = new BehaviorSubject<Boolean>(false);
  isOpenCanvasUser$ = this.isOpenCanvasUser.asObservable();

  constructor() { }
  

  handleCanvas(isOpen:boolean) {
    this.isOpenCanvasUser.next(isOpen);
  }

}
