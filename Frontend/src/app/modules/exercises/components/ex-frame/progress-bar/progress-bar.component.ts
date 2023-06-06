import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  @Input() valor: number;

  constructor() { }

  ngOnInit() {
  }

}
