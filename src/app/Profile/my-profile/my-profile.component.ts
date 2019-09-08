import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { AuthenticateService } from '../../Service/authentication.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpService } from '../../Service/http.service';
import { NgProgress } from 'ngx-progressbar';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit,AfterContentInit,OnDestroy {

  title = {
  };
  edit: boolean;
  profileSubs: Subscription;

  constructor(public authenticateService: AuthenticateService, private router: Router, 
    private httpService: HttpService, private progressService: NgProgress,
    private titleService:Title) { }

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

  ngOnInit() {
    this.titleService.setTitle('My Profile')
   this.profileSubs= this.httpService.getProfile().subscribe(res => {
      this.title = res['user']
      console.log(res['user'])
    })
  }
  onEdit() {
    this.edit = !this.edit;
  }
  errorshow = false;
  onSave(form: NgForm) {
    console.log(form.value);
    this.httpService.changeProfile(form.value).subscribe(res => {
      console.log(res)
      sessionStorage.setItem('token', res['token'])
      if (res['message'] === 0) {
        this.errorshow = true;
      }
    });
    if (this.errorshow === false) {
      this.edit = !this.edit;
    }
  }
  ngOnDestroy(){
    this.profileSubs.unsubscribe();
  }
}
