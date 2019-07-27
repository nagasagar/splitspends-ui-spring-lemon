import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { AlertService, AuthenticationService } from '../_services';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {

  private authWindow: Window;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  socialLogin = false;
  serverUrl: String;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
    if (window.addEventListener) {
      window.addEventListener('message', this.handleMessage.bind(this), false);
    } else {
      (<any>window).attachEvent('onmessage', this.handleMessage.bind(this));
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(event) {
    event.preventDefault();
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        error => {
          this.alertService.error(error, true);
          this.loading = false;
        });
  }
  public socialSignIn(socialPlatform: string) {
    // let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      this.launchFbLogin();
      console.log('Login with FB');
    } else if (socialPlatform === 'google') {
      this.launchGoogleLogin();
      console.log('Login with GOOGLE');
    }
  }
  public launchFbLogin() {
    this.socialLogin = true;
    this.authWindow = window.open(environment.apiUrl + '/oauth2/authorization/facebook', '_blank',
      'height=700,width=700,status=yes,toolbar=no,menubar=no,location=no');
  }

  public launchGoogleLogin() {
    this.socialLogin = true;
    this.authWindow = window.open(environment.apiUrl + '/oauth2/authorization/google', '_blank',
      'height=700,width=700,status=yes,toolbar=no,menubar=no,location=no');
  }

  handleMessage(event: Event) {
    const message = event as MessageEvent;
    // Only trust messages from the below origin.
    if (message.origin !== environment.serverUrl) {
      return;
    }
    if (!this.socialLogin) {
      return;
    }
    this.authWindow.close();
    this.socialLogin = false;
    const result = JSON.parse(message.data);
    if (result.status) {
      this.authenticationService.socialLogin(result.token)
      .pipe(first())
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
    } else {
      this.alertService.error(result.error);
          this.loading = false;
    }
  }

}
