import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

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

  constructor(private userService: UserService) {  }

  onLogin(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      console.log('Trying to login user');
      this.userService.loginUser(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('User login completed successfully' + res.name);
        },
        error: (err) => {
          console.log('User login failed');
        }
      });
    }
  }
}