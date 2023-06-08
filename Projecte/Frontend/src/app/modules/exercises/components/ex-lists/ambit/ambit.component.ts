import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy, OnChanges, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ambit } from 'src/app/shared/models/interfaces';
import { OpenAmbitService } from 'src/app/shared/services/open-ambit.service';
import { take } from 'rxjs';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-ambit',
  templateUrl: './ambit.component.html',
  styleUrls: ['./ambit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmbitComponent implements OnInit, OnChanges, AfterViewInit{
  @ViewChild('ambitAccordion') ambitAccordion: NgbAccordion;
  @Input() ambitEntry: { key: string, value: Ambit };
  isOpen: boolean = false;
  className = "";

  //Potser millor amb un setter?
  ngOnChanges(changes: SimpleChanges): void {
     if (changes['ambitEntry'].currentValue.key == "ortografia") {
       this.className = "accordion-ortog";
    } else if(changes['ambitEntry'].currentValue.key == "literatura") {
      this.className = "accordion-lite";
    } else if(changes['ambitEntry'].currentValue.key == "dialectes") {
      this.className = "accordion-dial";
     } else if (changes['ambitEntry'].currentValue.key == "gramàtica") {
       this.className = "accordion-gram"
    }
  }
  
  constructor(private router: Router, private ambitService: OpenAmbitService) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.ambitService.selectedAmbit$.pipe(take(1)).subscribe(ambit => {
      if (ambit == this.ambitEntry.key) {
        this.ambitAccordion.expand(ambit);
      }
    });
  }

  navTo(path: string, id: number) {
    this.router.navigate([`/${path}`, id]);
  }

}
