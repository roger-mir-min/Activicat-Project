import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isLoadingSubj = new BehaviorSubject(false);
  isLoading$ = this.isLoadingSubj.asObservable();
  
  isLoadingGifSubj = new BehaviorSubject(false);
  isLoadingGif$ = this.isLoadingGifSubj.asObservable();
  
  showAndHidSpinner() {
    this.isLoadingSubj.next(true);
    setTimeout(() => { this.isLoadingSubj.next(false) }, 1000);
  }
  
  showAndHideGif() {
    this.isLoadingGifSubj.next(true);
    setTimeout(() => { this.isLoadingGifSubj.next(false) }, 1500);
  }
  

constructor() { }

}
