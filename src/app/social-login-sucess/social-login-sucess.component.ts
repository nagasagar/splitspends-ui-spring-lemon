import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-social-login-sucess',
  templateUrl: './social-login-sucess.component.html',
  styleUrls: ['./social-login-sucess.component.css']
})
export class SocialLoginSucessComponent implements OnInit {


  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const message: any = {
        'status': '',
        'token': ''
      };
      if (params['token']) {
      message.status = true;
      message.token = params['token'];
    } else {
      message.status = false;
      message.error = params['error'];
      message.errorDescription = params['error_description'];
    }
    window.opener.postMessage(JSON.stringify(message), environment.serverUrl);
    });

  }

}
