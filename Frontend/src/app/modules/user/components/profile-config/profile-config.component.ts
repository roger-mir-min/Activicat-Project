import { Observable, BehaviorSubject, tap, switchMap } from 'rxjs';
import {
  Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,
  ViewChild, ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { navigateToAnchor } from 'src/app/shared/utility/navigation';
import { User } from 'src/app/shared/models/interfaces';
import { AccountService } from 'src/app/shared/services/account.service';
import { GroupsService } from 'src/app/shared/services/groups.service';
import { HttpClient } from '@angular/common/http';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { confValidator } from 'src/app/shared/utility/confirmKey';

type submitType = "nom" | "email" | "key";

@Component({
  selector: 'app-profile-config',
  templateUrl: './profile-config.component.html',
  styleUrls: ['./profile-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileConfigComponent implements OnInit {

  //Com que el segon modal també
  @ViewChild('confirmationModalLeave') private modalComponent!: ConfirmationModalComponent;
  modalStyle: string = 'modal-style-danger';
  modalTitle: string;
  modalBody: string;
  modalButtonColor = 'btn btn-danger';
  isInputModal = true;
  successMessage: string = 'Nom canviat correctament.';
  submitType: submitType;

  thereIsErrorNom = new BehaviorSubject(false);
  thereIsErrorNom$ = this.thereIsErrorNom.asObservable();

  async openModal(md: submitType) {
    if (md == 'nom') {
      this.modalTitle = 'Canviar nom';
      this.modalBody = `Segur que vols canviar el nom a ${this.nomForm.get('inputNom').value}?
      Escriu la contrasenya per confirmar:`;
    } else if(md == 'email'){
      this.modalTitle = 'Canviar adreça electrònica';
      this.modalBody = `Segur que vols canviar l'adreça de correu electrònic a
      ${this.emailForm.get('inputEmail').value}? Escriu la contrasenya per confirmar:`
    } else if (md == 'key') {
      this.modalTitle = 'Canviar contrasenya';
      this.modalBody = `Segur que vols canviar la contrasenya? La teva sessió acabarà i hauràs de tornar a entrar
      amb la nova contrasenya. Escriu la contrasenya antiga per confirmar:`
    }

    this.submitType = md;

  return await this.modalComponent.open();
}
  //aquest component s'ha de canviar: async pipes per facilitar onPush, funcions API
  //confirmar contrasenya, estil

  //usuari
  currentUser$: Observable<User>;

  //imatge
  imgForm: FormGroup;
  userImage$: Observable<string | ArrayBuffer>;
  updateImg = new BehaviorSubject<string|ArrayBuffer>("");
  updateImg$ = this.updateImg.asObservable();

  previewImage$: Observable<string | ArrayBuffer>;
  updatePreviewImg = new BehaviorSubject<string|ArrayBuffer>("");
  updatePreviewImg$ = this.updatePreviewImg.asObservable();

  //Forms per als ítems a canviar
  nomForm: FormGroup;
  emailForm: FormGroup;
  keyForm: FormGroup;

  //per facilitar l'obtenció dels valors dels input de key al tempalte
  get getEmail() {
    return this.emailForm.get("inputEmail");
  }
  get getKey() {
  return this.keyForm.get("inputKey");
  }  
  get getRepKey() {
  return this.keyForm.get("inputRepKey");
  }  

  constructor(private router: Router, private location: Location, private accountService: AccountService,
  private cdr: ChangeDetectorRef, private http: HttpClient, private fb: FormBuilder) {
    this.currentUser$ = this.accountService.currUser$;

    this.nomForm = this.fb.group({ inputNom: [""] });
    this.emailForm = this.fb.group({ inputEmail: ["", [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]] });
    this.keyForm = this.fb.group({
      inputKey: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      inputRepKey: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(20)]]
    }, { validators: confValidator('inputKey', 'inputRepKey') });
    this.imgForm = this.fb.group({ profileImage: [''] });

    this.userImage$ = this.updateImg$.pipe(switchMap(() => this.accountService.getUserImage()));
    this.previewImage$ = this.updatePreviewImg$;
  }

  ngOnInit() {
    console.log("profile-config component initialized");
    
    //mètode per obtenir imatge en començar
    this.updateImg.next(undefined);
  }

  onSubmit(boolAndKey: [boolean, string]) {
    if (boolAndKey[0] == true) {
      if (this.submitType == 'nom') {
        this.nomSubmit(boolAndKey[1]);
      } else if (this.submitType == 'email') {
        this.emailSubmit(boolAndKey[1]);
      } else if (this.submitType == 'key') {
        this.keySubmit();
      }
    } else if (boolAndKey[0] == false) {
      this.successMessage = "Contrasenya incorrecta.";
      this.resetInputs();
      this.modalComponent.open();
    }
  }

  resetInputs(): void {
    this.nomForm.get('inputNom').reset();
    this.emailForm.get('inputEmail').reset();
    this.keyForm.get('inputKey').reset();
  }

  //estaria bé que tinguessin retorn per poder validar
  nomSubmit(key: string) {
    this.accountService.changeNom(this.nomForm.get('inputNom').value).subscribe({
      next: response => {
        //update current user
        this.accountService.login({ inputEmail: this.accountService.currentUser.email, inputKey: key }, false).subscribe({
          next: res => {
            console.log(response);
            this.modalComponent.updateText({success:'Nom canviat amb èxit.'});
            this.resetInputs();
            this.modalComponent.open();
          },
          error: err => {
            this.modalComponent.updateText({success:'Nom canviat amb èxit, però error en reiniciar la sessió. Es tancarà la sessió.'});
            this.accountService.logout();
            console.error(err);
          }
        });
      },
      error: error => {
        console.error("Error en l'enregistrament del nom: " + JSON.stringify(error));
        this.modalComponent.updateText({success:'Error en intentar canviar el nom.'});
        this.resetInputs();
        this.modalComponent.open();
      }
    });
  }


  //modularitzar login
  emailSubmit(key: string) {
    const newEmail = this.emailForm.get('inputEmail').value;
    this.accountService.changeEmail(newEmail).subscribe({
      next: response => {
        this.accountService.login({ inputEmail: newEmail, inputKey: key }, false).subscribe({
          next: res => {
            this.modalComponent.updateText({success:'Adreça electrònica canviada amb èxit.'});
            this.resetInputs();
            this.modalComponent.open();
          }
          ,
          error: err => {
            this.modalComponent.updateText({success:"Email canviat amb èxit, però error en reiniciar l'usuari. Es tancarà la sessió."});
            this.accountService.logout();
            console.error(err);
          }
        });
      },
      error: error => {
        console.error("Error en l'enregistrament de l'email: " + JSON.stringify(error));
        this.modalComponent.updateText({success: "Error en intentar canviar l'adreça electrònica."});
        this.resetInputs();
        this.modalComponent.open();
      }
    });
  }

  keySubmit() {
    const key = this.keyForm.get('inputKey').value;
    this.accountService.changePassword(key).subscribe({
      next: response => {
        console.log("Contrasenya actualitzada.");
        this.modalComponent.updateText({ success: "Contrasenya actualitzada amb èxit. Torna a entrar amb la nova contrasenya." });
        this.modalComponent.open();
        this.accountService.logout(); //fem logout en comptes de login automàtic
      },
      error: error => {
        console.error("Error en intentar canviar la contrasenya: " + JSON.stringify(error));
        this.modalComponent.updateText({success: "Error en intentar canviar la contrasenya."});
        this.modalComponent.open();
      }
    });
  }

  //IMATGE BÉ --faltaria usar-hi més modals
onFileSelect(event) {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    this.imgForm.get('profileImage').setValue(file);
    
    // Create an instance of FileReader
    const reader = new FileReader();

    // Add an event listener for when the file has been loaded
    // Set the source of the image to the base64 string
    reader.onload = (event: any) => {
      this.updatePreviewImg.next(event.target.result);
    }

    // Read the contents of the file as a data URL
    reader.readAsDataURL(file);
  }
}


  onImgSubmit() {
    const formData = new FormData();
    if (this.imgForm.get('profileImage').value != "") {
      formData.append('profileImage', this.imgForm.get('profileImage').value);
      formData.append('user_id', this.accountService.currentUser.user_id.toString());

      this.accountService.postUserImage(this.accountService.currentUser.user_id.toString(), formData).subscribe((response) => {
        console.log(response);
        this.updateImg.next(undefined);
        this.updatePreviewImg.next("");
      });
    } else {
      console.log("Selecciona una imatge.")
    }
    
  }

}
