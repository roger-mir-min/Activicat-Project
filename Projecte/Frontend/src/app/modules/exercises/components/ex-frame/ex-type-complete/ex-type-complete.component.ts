import {
  Component, OnInit, AfterViewInit, Input, Output, EventEmitter,
  ViewChildren, QueryList, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AccountService } from 'src/app/shared/services/account.service';
import { Activitat } from 'src/app/shared/models/interfaces';
import { SimpleChanges } from '@angular/core';
import { User } from 'src/app/shared/models/interfaces';
import { Deures_activitatsService } from 'src/app/shared/services/deures_activitats.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-ex-type-complete',
  templateUrl: './ex-type-complete.component.html',
  styleUrls: ['./ex-type-complete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExTypeCompleteComponent implements OnInit, OnChanges, AfterViewInit {

  user: User | null;
  
  //Variables d'exercici
  id: number;
  @Input() token: number;
  @Input() exercise: Activitat;
  @Input() initValues: Object;
  @Input() nameOfRandom: string;
  @Output() exCompletedEvent = new EventEmitter<[number, number, boolean]>();
  isCompleted: boolean;
  isChecked: boolean;
  inputs: number;
  arrayLinies: string[];
  arrayParts: string[][];
  respostes: string[];
  inputColor: { [key: string]: string } = {};
  inputBorderColor: { [key: string]: string } = {};
  inputDisplay: { [key: string]: string } = {};
  @ViewChildren('inputElem') inputElements: QueryList<ElementRef>;

  exForm: FormGroup;

  exPoints: number = 0;
  errorNumber: number = 0;

  constructor(private fb: FormBuilder, private accService: AccountService,
    private deuresService: Deures_activitatsService, private AccountService: AccountService,
  private cdr: ChangeDetectorRef) { }
  
    //FUNCIONS PER CREAR EXERCICI
  
    //Funció per dividir text en frases
    splitText(inputString: string): string[] {
    return inputString.split("//");
    }
  
    //function to split the text string
  splitLinies(inputArrOfStrings: string[]): string[][] {
  let array = [];
  const pattern = /\[\[\]\]/g; // Regular expression to match "[[]]"
  inputArrOfStrings.forEach((linia) => {
  const splitLine = linia.split(pattern);
  array.push(splitLine);
  });
  return array;
}
  
  //Funció que compta inputs (separadors [[]])
  countInputOccurrences(inputString: string): number {
  const pattern = /\[\[\]\]/g; // Regular expression to match "[[]]"
  const matches = inputString.match(pattern);
  return matches ? matches.length : 0;
  }
  
  //funció per crear el form, s'executa a ngOnInit
  createForm() {
  // Create an empty FormGroup
  const formGroup: FormGroup = this.fb.group({});
  // Loop through your data and create a FormControl for each item
  for (let i = 0; i < this.inputs; i++) {
    const control = this.fb.control("");
    formGroup.addControl(i.toString(), control);
  };
  // Create a FormGroup with the formGroup object
  this.exForm = this.fb.group(formGroup.controls);
  }
  
  extractWords(inputString: string): string[] {
    const pattern = /\[\[(.*?)\]\]/g; // Regular expression to match "[[...]]"
    const matches = [...inputString.matchAll(pattern)];
    return matches.map(match => match[1]);
  }

  //FUNCIONS DE GESTIÓ DE L'EXERCICI

  //funció per comparar valors de formgroup amb array de respostes (val per activitats normal i historial)
  compareArrVal(formValue: FormGroup) {
    console.log("Comparant valors...")
    this.respostes.forEach((resposta, i: number) => {
      if (formValue[i] == resposta) {
        console.log("resposta correcta");
        this.exPoints = Math.round(this.exPoints + (this.exercise.punts / this.respostes.length));
        this.inputColor[i.toString()] = 'green';
        this.inputBorderColor[i.toString()] = 'green';
        this.inputDisplay[i.toString()] = 'none';
      } else {
        // Here, you would save the incorrect answer
        console.log("resposta incorrecta");
        console.log(formValue[i]);
        this.errorNumber++;
        this.inputColor[i.toString()] = 'red';
        this.inputBorderColor[i.toString()] = 'red';
        this.inputDisplay[i.toString()] = 'inline-block';
      }
      // Here, you would send exPoints and errArray to the service (maybe exercise reference?)
    });
    
    console.log('Points: ' + this.exPoints);
    console.log('Errors: ' + this.errorNumber);
  }

  //Function to initialize / reset the component
  initializeComponent() {
    console.log("function resetComponent in ex-type-complete");
    //get id from ex-frame component
    this.id = this.exercise.id_activitat;
    //aquí falta funció per reiniciar token? en principi no cal pq no es pot anar a ex següent ni anterior

    //canviar last activitat de user
    if (this.user) {
      this.accService.changeLastAct(this.id);
    }
    
    //get how many input ("[[]]") in text
    this.inputs = this.countInputOccurrences(this.exercise.text);
    //create form with as many formcontrols as inputs
    this.createForm();
    //get array of responses
    this.respostes = this.extractWords(this.exercise.resposta);
    //obtenir text dividit
    this.arrayLinies = this.splitText(this.exercise.text);
    //obtenir parts linies
    this.arrayParts = this.splitLinies(this.arrayLinies);
    //reiniciar isChecked, isCompleted, errorNumber i exPoints
    this.isChecked = false;
    this.isCompleted = false;
    this.errorNumber = 0;
    this.exPoints = 0;
    //reiniciar color dels inputs
    if (!this.initValues) {
      Object.values(this.exForm.value).map((x, i) => {
        this.inputColor[i.toString()] = 'black';
        this.inputBorderColor[i.toString()] = 'black';
      });
    }
    //Si hi ha valors inicials (historial), s'introdueixen i s'activa isCompleted/Checked to disable buttons
    if (this.initValues) {
      this.exForm.patchValue(this.initValues);
      this.isCompleted = true;
      this.isChecked = true;
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    //Quan es rep un nou exercici (perquè s'ha canviat d'exercici) es reinicia el component
    if (changes['exercise']) {
      this.initializeComponent();
      if (this.initValues) {
        this.compareArrVal(this.exForm.value);
      }
    }    
  }
  
  ngOnInit() {
    console.log("ex-type-complete component initialized");
    this.user = this.AccountService.currentUser;
  }

  //ajustem l'amplada dels inputs
  ngAfterViewInit(): void {
    if (this.initValues) {
      setTimeout(() => {
        this.inputElements.forEach((inputElem) => {
          this.adjustWidth(inputElem.nativeElement);
        });
      }, 0);
    }
  }

  
  //funció del botó de comprovar exercici
  check() {
    this.respostes.forEach((resposta, i: number) => {
      if (this.exForm.value[i] == resposta) {
        console.log("resposta correcta");
      } else {
        // Here, you would save the incorrect answer
        console.log("resposta incorrecta");
        this.errorNumber++;
      }
    });  
    console.log("Nombre d'errors:"+this.errorNumber);
    //disable check button
    this.isChecked = true;
    //sen data to parent component
    this.completedEx();
    //reset errorNumber before submit
    this.errorNumber = 0;
    }


  //Funció per quan es submiteja exercici
  submit(formValue: FormGroup) {
    // Compare the user's inputs with the correct answers, color inputs
    this.compareArrVal(formValue);
    //mark exercise as completed
    this.isChecked = true; // cal?
    this.isCompleted = true;
    this.exForm.disable();
    //send data to parent component
    this.completedEx();
    //store object to DB
    //unregistered user doing homework-->FUNCIONA
    if (!this.user && this.token) {
      //funció per crear usuari random amb nom donat i obtenir-ne id
        //posar id a usuari_id:
      this.accService.addRandomUser(this.nameOfRandom).pipe(first()).subscribe(response => {
        //aquí estaria millor switchMap
        this.deuresService.addDeuresActivitats({
          deure_id: this.token.toString(),
          activitat_id: this.exercise.id_activitat,
          usuari_id: response['user_id'], //això s'omple amb usuari creat ad hoc
          resp_usuari: JSON.stringify(formValue),
          is_deures: 1,
          is_completed: 1,
          punts: this.exPoints,
          num_errors: this.errorNumber,
          completed_at: new Date()
        });
      });
      //on desubscricriure unsubscr?
    }
    //registered user NOT doing homework-->FUNCIONA
    else if (this.user && !this.token) {
      this.deuresService.addDeuresActivitats({
        deure_id: null, //en principi s'ha de poder
        activitat_id: this.exercise.id_activitat,
        usuari_id: this.user.user_id,
        resp_usuari: JSON.stringify(formValue),
        is_deures: 0,
        is_completed: 1,
        punts: this.exPoints,
        num_errors: this.errorNumber,
        completed_at: new Date()
      });
    }
    //REGISTERED USER DOING HOMEWORK-->PENDENT-->CANVIAR A FUNCIÓ PUT (SHA DE CREAR A API)
      //
    else if (this.user && this.token) {
      this.deuresService.updateDeuresActivitats({//S'HA DE CANVIAR PER FUNCIÓ PUT
        deure_id: this.token,
        activitat_id: this.exercise.id_activitat,
        usuari_id: this.user.user_id,
        resp_usuari: JSON.stringify(formValue),
        punts: this.exPoints,
        num_errors: this.errorNumber,
        completed_at: new Date().toISOString().slice(0, 19)
      }).subscribe(res => { console.log(res); });
      //reset exercise errors and points after submit
      this.errorNumber = 0;
      this.exPoints = 0;
      //if it is last exercise, open modal or something

    }
  }
  //funció per enviar el nombre d'errors i si l'exercici està completat a ex-frame
  completedEx() {
    const arr: [number, number, boolean] = [this.errorNumber, this.exPoints, this.isCompleted];
    this.exCompletedEvent.emit(arr);
    console.log("S'envia resultats exercici (errors, punts, isCompleted)");
    console.log(arr);
  }
  
  //FUNCIONS DE CONTROL DEL TEMPLATE

  //Funció per a possibilitar el correcte desplegament del template (es calcula index global per poder
  //calcular on van inputs i solucions adjacents)
  getGlobalIndex(lineIndex: number, partIndex: number): number {
    // Create an array of the lines before the current line
    const linesBeforeCurrent = this.arrayParts.slice(0, lineIndex);
    // Calculate the total number of inputs in the lines before the current line, without including line breaks
    const inputsBeforeCurrent = linesBeforeCurrent.reduce((acc, line) => acc + line.length - 1, 0);
    // Return the global index by adding the partIndex and the total number of inputs in the lines before the current line
    return inputsBeforeCurrent + partIndex;
  }
  
  // Variables para hacer que la longitud de los inputs se adapte y tenga un límite máximo de 15 caracteres
inputText: string = '';
inputWidth: number = 32; // Ancho inicial del input en píxeles
maxInputWidth: number = 15 * 8; // Ancho máximo del input en píxeles (15 caracteres * 8 píxeles por caracter aproximadamente)

adjustWidth(target: EventTarget): void {
  const input = target as HTMLInputElement;
  const tmp = document.createElement('span');
  tmp.style.visibility = 'hidden';
  tmp.style.whiteSpace = 'pre';
  tmp.style.fontSize = getComputedStyle(input).fontSize;
  tmp.innerText = input.value;
  document.body.appendChild(tmp);

  // Establecer el ancho del input teniendo en cuenta el ancho máximo
  this.inputWidth = Math.min(this.maxInputWidth, Math.max(32, tmp.getBoundingClientRect().width + 2)); // Agrega 2 para el padding

  document.body.removeChild(tmp);
}

  
}
