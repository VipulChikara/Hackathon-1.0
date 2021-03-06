import { Component, OnInit, AfterContentInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticateService } from '../../Service/authentication.service';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterContentInit {
  invalidLogin: boolean;
  message = "Login";
  type = "beneficiary";
  id;
  constructor(private authService: AuthenticateService,
    private router: Router, private route: ActivatedRoute,
    private progressService: NgProgress, private titleService: Title) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')
    this.titleService.setTitle('Beneficiary Login');
    console.log(this.id)
  }

  ngAfterContentInit() {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.progressService.start();
          this.progressService.set(0.1);
          this.progressService.inc(0.2);
        }
        else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel
        ) {
          this.progressService.done();
        }
      });
  }

  loginb() {
    this.router.navigate(["user/" + this.id + "/login"])
  }

  logind() {
    this.router.navigate(["user/" + this.id + "/login-donor"])
  }

  registerb() {
    this.router.navigate(["user/" + this.id + "/register-beneficiary"])
  }

  change() {
    this.invalidLogin = false;
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.progressService.start();
    this.progressService.set(0.1);
    this.progressService.inc(0.2);
    this.authService.login(form.value, this.id).subscribe(
      response => {
        console.log(response)
        this.progressService.inc(0.3);
        this.progressService.done();
        let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl')
        if (response === null) {
          this.invalidLogin = true;
          return;
        } else {
          sessionStorage.setItem('token', response.token)
          if (this.authService.currentUser().status === 'approved') {
            this.router.navigate([returnUrl || '/product/all'])
          }
          else {
            this.router.navigate([returnUrl || '/product/verification'])
          }
        }
      },
      error => {
        this.progressService.inc(0.3);
        this.progressService.done();
        console.log(error)
        this.invalidLogin = true;
      }
    )
  }



}
