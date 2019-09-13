import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  hide = true;
  loading = false;
  returnUrl: string;
  error = '';
  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {


  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    console.log(this.loginForm);
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }
  getErrorMessage() {
    return this.loginForm.controls.email.hasError('required') ? 'You must enter a value' :
      (this.loginForm.controls.email.hasError('email') ? 'Not a valid email' : '');
  }

  onSubmit() {

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });


  }

}
