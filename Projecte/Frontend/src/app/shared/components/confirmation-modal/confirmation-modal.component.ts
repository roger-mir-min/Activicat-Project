import {
  Component, EventEmitter, Injectable, Input,
  OnInit, Output, TemplateRef, ElementRef, ViewChild, ChangeDetectionStrategy,
  ChangeDetectorRef, SimpleChanges
} from '@angular/core';
import { AccountService } from '../../services/account.service';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  providers: [NgbModalConfig, NgbModal],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@Injectable()
export class ConfirmationModalComponent implements OnInit {
  @ViewChild('confirmationModal') private modalContent!: TemplateRef<ConfirmationModalComponent>
  @ViewChild('passInput') passInput: ElementRef;
  @Output() newConfirmationEvent = new EventEmitter<[boolean, string]>();
  @Input() modalStyle: string;
  @Input() modalTitle: string;
  @Input() modalBody: string;
  @Input() modalButtonColor: string;
  @Input() successMessage: string;
  @Input() isInputModal: boolean = false;

  isAskForConfirmationModal: boolean = false;

  inputValue: string;

  private modalRef!: NgbModalRef;

  constructor(config: NgbModalConfig, private modalService: NgbModal, private accountService: AccountService,
  private cd: ChangeDetectorRef) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    console.log("Modal component initialized");
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(changes);
  }

  updateText(obj: { title?: string, body?: string, success?: string }) {
    this.modalTitle = obj.title;
    this.modalBody = obj.body;
    this.successMessage = obj.success;
  }

// confirmation-modal.component.ts
open(): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    this.isAskForConfirmationModal = !this.isAskForConfirmationModal;
    this.modalRef = this.modalService.open(this.modalContent, { size: 'sm' });
    this.modalRef.result.then((confirmation) => {
      console.log(confirmation);
      if (this.isInputModal) {
        this.checkPassword();
      } else if (!this.isInputModal && this.isAskForConfirmationModal == true) {
        this.newConfirmationEvent.emit([true, '']);
        // Canviar a modal de missatge (sense botonts)
      }
    }, (denial) => {
      console.log(denial);
      this.inputValue = '';
      this.isAskForConfirmationModal = false;
    });
  });
}
  
  //Quan hi ha input, es crida aquesta funció per
  //comprovar la contrasenya
  checkPassword() {
    this.accountService.login({
      inputEmail: this.accountService.currentUser.email.toString(),
      inputKey: this.inputValue
    }, true).subscribe({
      next: res => {
        this.newConfirmationEvent.emit([true, this.inputValue]);
        this.inputValue = '';
      },
      error: err => {
        console.log("Contrasenya incorrecta: " + err);
        this.newConfirmationEvent.emit([false, this.inputValue]);
        this.inputValue = '';
      }
    });
}


}
