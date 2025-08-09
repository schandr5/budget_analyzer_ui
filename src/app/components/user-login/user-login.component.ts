import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})

export class UserLoginComponent {
  fb = inject(FormBuilder);
  loginForm: FormGroup = this.fb.group({ 
    userName: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private userService: UserService,
    private sharedService: SharedService,
    private router : Router) {  }

  onLogin(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      console.log('Trying to login user');
      this.userService.loginUser(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('User login completed successfully' + res.name);
          this.sharedService.setUserDetails(res);
          this.router.navigate(['/set-budget']);
        },
        error: (err) => {
          console.log('User login failed');
        }
      });
    }
  }
}