import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AmbitName } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class OpenAmbitService {
  private selectedAmbitSource = new BehaviorSubject<string>(null);
  selectedAmbit$ = this.selectedAmbitSource.asObservable();

  selectAmbit(ambit: AmbitName) {
    this.selectedAmbitSource.next(ambit);
  }
}

