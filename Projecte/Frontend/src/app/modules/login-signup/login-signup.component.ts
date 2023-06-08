import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginSignupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
