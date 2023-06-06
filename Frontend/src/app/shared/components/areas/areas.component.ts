import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { navigateToAnchor } from 'src/app/shared/utility/navigation';
import { OpenAmbitService } from '../../services/open-ambit.service';
import { AmbitName } from '../../models/interfaces';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreasComponent implements OnInit{

  constructor(private router: Router, private location: Location, private ambitService: OpenAmbitService, private cd: ChangeDetectorRef) { }


  ngOnInit() {}

  onAnchorClick(path: string, fragment: string, ambit: AmbitName) {
  this.ambitService.selectAmbit(ambit);
  navigateToAnchor(path, fragment, this.router, this.location);
}

}
