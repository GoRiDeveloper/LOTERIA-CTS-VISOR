import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor() {}

  setIsLoadingState(state: boolean) {
    this.isLoadingSubject.next(state);
  }

  getLoadingState(): boolean {
    return this.isLoadingSubject.value;
  }
}
