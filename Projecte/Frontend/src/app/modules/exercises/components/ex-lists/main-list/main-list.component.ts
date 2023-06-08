import { Activitat, Ambit } from 'src/app/shared/models/interfaces';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { ExercisesService } from 'src/app/shared/services/exercises.service';

@Component({
  selector: 'app-main-list',
  templateUrl: './main-list.component.html',
  styleUrls: ['./main-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainListComponent implements OnInit {
  
  arrAct: Activitat[];
  ambits: Map<string, Ambit> = new Map();

  constructor(private exService: ExercisesService, private location: Location, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getLists();
  }

  async getLists() {
    this.arrAct = await this.exService.getActivitatList();
    this.buildHierarchy(this.arrAct);
    this.cdr.markForCheck();
  }

  buildHierarchy(activitats: Activitat[]): void {
    activitats.forEach((activitat) => {
      let ambit = this.ambits.get(activitat.ambit);
      if (!ambit) {
        ambit = { nom: activitat.ambit, temes: new Map() };
        this.ambits.set(activitat.ambit, ambit);
      }

      let tema = ambit.temes.get(activitat.tema || '');
      if (!tema) {
        tema = { nom: activitat.tema || '', subtemes: new Map() };
        ambit.temes.set(activitat.tema || '', tema);
      }

      let subtema = tema.subtemes.get(activitat.subtema || '');
      if (!subtema) {
        subtema = [];
        tema.subtemes.set(activitat.subtema || '', subtema);
      }

      subtema.push(activitat);
    });
  }
}
