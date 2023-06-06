import {
  Component, OnInit, Input, Output, ElementRef,
  ViewChildren, QueryList, EventEmitter, ChangeDetectionStrategy
} from '@angular/core';
import { Ambit, Deures_activitat } from 'src/app/shared/models/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { navigateToAnchor, navigateToAnchWithQueryPar, serialize } from 'src/app/shared/utility/navigation';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {

  //Per saltar al final quan es vol veure com es va fer un exercici
  @ViewChildren('tableRef') tableRef: QueryList<ElementRef>;
  @Output() scrollToParentDiv = new EventEmitter<void>();

  //Valors per a taula
  displayedColumns: string[] = ['nom', 'punts', 'errors', 'data', "revisar", "repetir"];
  dataSource = [];

  @Input() historial: any[] = [];
  @Input() userIsTeacher: boolean;

  constructor(private location: Location, private router: Router, private route: ActivatedRoute,
  private datePipe: DatePipe) { }

  ngOnInit() {
    //s'adapta array d'historial a array per a taula (dataSource)
    this.historial.forEach((x, i) => {
      //Si l'usuari és un professor que mira historial d'alumne, només veu deures
      //En realitat, això no caldrà quan a la db només hi hagi objectes ben formatejats
      if (!(this.userIsTeacher == true && x.is_deures == 0)) {
        let obj = {
          nom: x.subtema || x.ambit, ambit: x.ambit, punts: x.punts, errors: x.num_errors,
          data: x.completed_at, revisar: "Revisa'l", idAct: x.activitat_id, repetir: "Torna'l a fer",
          resposta: x.resp_usuari, is_deures: x['is_deures']
        }
        this.dataSource.push(obj);
      }
    });
    
    if (this.userIsTeacher == true) {
      this.displayedColumns.pop();
    }
  }

  scrollToBottom(): void {
    this.scrollToParentDiv.emit();
  }

    //funció per evitar que les dates amb només 0 (per defecte a db) donin error
  formatDate(date: string): string {
  if (date === '0000-00-00 00:00:00') {
    return 'no hi ha data';
  } else {
    return this.datePipe.transform(date, 'medium');
  }
}

getTextColor(element: any): string {
  if (element.ambit == 'ortografia') {
    return 'text-ortografia-600';
  } else if (element.ambit == 'gramàtica') {
    return 'text-gramàtica-600';
  } else if (element.ambit == 'dialectes') {
    return 'text-dialectes-600';
  } else if (element.ambit == 'literatura') {
    return 'text-literatura-600';
  } else {
    return 'inherit';
  }
}

  // navigateToRouterOutlet(idAct: string, respuesta: string) {
    // navigateToAnchor(idAct, 'exFrame')
  // const fragment = 'exFrame';
  // const ruta = ['user', 'history', 'ex', parseInt(idAct, 10).toString()];
  // const queryParams = { param: respuesta };
  // this.router.navigate(ruta, { queryParams, fragment: fragment });

  //   navigateToAnchor('user/history/ex/'+parseInt(idAct, 10).toString(), fragment, this.router, this.location);
//     let par = respuesta.replace(/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$3":')
//     let obj = {
//     path: `user/history/ex/${idAct}`,
//     fragment: 'exFrame',
//     queryParams: { param: JSON.parse(par) }
//     }
    
//     console.log(par)
//     console.log(obj)
    
//   navigateToAnchWithQueryPar(
//   obj,
//   this.router,
//   this.location
// );
  // }


}
