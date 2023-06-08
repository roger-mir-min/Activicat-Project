import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ExercisesService } from 'src/app/shared/services/exercises.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Activitat, User } from 'src/app/shared/models/interfaces';
import { navigateToAnchor } from 'src/app/shared/utility/navigation';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-ex-frame',
  templateUrl: './ex-frame.component.html',
  styleUrls: ['./ex-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExFrameComponent implements OnInit, AfterViewInit {

  user: User | null;
  id: number;
  token: number | null;
  exercise: Activitat;
  exType: string;
  // exType: "complete" | "select" | "click" | "chip" | "dragLine" | "dragClass"= "dragClass";
  thereIsPrevious: boolean;
  thereIsNext: boolean;
  exIsCompleted: boolean = false;
  seqPoints: number = 0;
  exPoints: number = 0;
  errorNumber: number;
  progBarPercentage: number;
  initialValues: Object;
  pointsStyle: Object;
  nameOfRandomIsEntered: boolean = true;
  nameOfRandom: string;

  subscription1: Subscription;
  subscription2: Subscription;

  constructor(private accService: AccountService, private exService: ExercisesService,
    private route: ActivatedRoute, private router: Router, private location: Location,
    private loaderService: LoaderService, private cdr: ChangeDetectorRef) { }


  ngOnInit() {
    console.log("ex-frame initialized");
    this.user = this.accService.currentUser;
    //if there are initialValues from previous exercise, reset them(?)
    if (this.initialValues) {
      this.initialValues = JSON.parse(this.route.snapshot.queryParams['param']);
    }
    //everytime params change, get it and
    this.subscription1 = this.route.params.subscribe(() => {
      this.token = null;
      this.getId();
      this.resetExercise(this.id);
      if (this.token && !this.user) {
        this.nameOfRandomIsEntered = false;
      }
      //if there are initValues as route param, get them(?)
      if (this.route.snapshot.queryParams['param']) {
        //fem que el nom de les keys dels paràmetres tinguin cometes per poder fer JSON.parse
        let invalidJson = this.route.snapshot.queryParams['param'];
      let correctedJson = invalidJson.replace(/(\{|\s*)(\d+)(\:)/g, '$1"$2"$3');
      this.initialValues = JSON.parse(correctedJson);
      }
    });
    
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  //get id --first number of queryparams --es pot passar a servei?
  getId() {
  const param = this.route.snapshot.paramMap.get('id');
  let nums = param.match(/^(\d+)[^\d]*?(\d+)/);
  
    //get id and (if there is token,) token
  if (nums) {
    this.id = parseInt(nums[1], 10);
    
    this.token = parseInt(nums[2], 10);
    console.log('token is: ' + this.token);
    
  } else {
    this.id = parseInt(param, 10);
  }
    console.log("id is: " + this.id);
}

  resetExercise(id: number) {
    console.log("resetExercise function...")
    //get exercise by id
    this.subscription2 = this.exService.getActivitatfromId(id).subscribe(ObsAct => {
      this.exercise = { ...ObsAct };
      //get type of exercise (to show the corresponding exercise component)
      this.exType = this.exercise.tipus;
      //if it isn't exercise number 1, show "go to previous" button
      this.isTherePrevious();
      //if it isn't last exercise of "subtema", show "go to next" button
      this.isThereNext();
      //restart exercice state
      this.exIsCompleted = false;
      this.errorNumber = -1;
      //Get progressbar percentage
      this.calculateProgBarPercentage();

      this.cdr.detectChanges();
    });
  }
  
  isTherePrevious() {
    if (this.exercise.number > 1) {
      this.thereIsPrevious = true;
    } else {
      this.thereIsPrevious = false;
    }
  }
  
  async isThereNext(){
      if (this.exercise.subtema && this.exercise.subtema != "") {
        let lastNumberOfSubtema: number = await this.exService.getLastNumberOfSubtema(this.exercise.subtema);
        if (this.exercise.number < lastNumberOfSubtema) {
          this.thereIsNext = true;
        } else {
          this.thereIsNext = false;
        }
      } else {
        this.thereIsNext = false;
      }
    }

  calculateProgBarPercentage() {
    this.exService.getPercentageOfSubtema(this.exercise, this.exIsCompleted)
    .then(percentage => {
          this.progBarPercentage = percentage;
        });
    }
  
  async navigateToPrevious() {
    let previousEx = await this.exService.getPreviousActivity(this.exercise.subtema, this.exercise.number);
    if (previousEx.id_activitat != 0) {
      this.router.navigate(['/ex', previousEx.id_activitat]);
      console.log("navigate to previous");
    }
}
  
async navigateToNext() {
  let nextEx = await this.exService.getNextActivity(this.exercise.subtema, this.exercise.number);
  if (nextEx.id_activitat != 0) {
    this.router.navigate(['/ex', nextEx.id_activitat]);
    console.log("navigate to next");
  }
}

  navigate() {
    navigateToAnchor("/main-list", this.exercise.ambit, this.router, this.location);
  }

  exCompleted(event: [number, number, boolean]) {
    this.errorNumber = event[0];
    this.exPoints = event[1];
    this.seqPoints += event[1];
    this.pointsStyle = { fontWeight: 'bold'};
    this.exIsCompleted = event[2];
    this.calculateProgBarPercentage();
    if (this.thereIsNext == false && event[2] == true) {
      this.loaderService.showAndHideGif();
    }
    //aquí faltaria enviar punts a NgRx?
    //if thereisnext == false, 
  }

  enterName(name: string) {
    this.nameOfRandomIsEntered = true;
    this.nameOfRandom = name;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }

}
