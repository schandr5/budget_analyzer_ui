import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css'
})
export class UserRegistrationComponent {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder,
    private userService: UserService) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get name() {
     return this.registrationForm.get('name');
  }

  get username() { 
    return this.registrationForm.get('userName');  
  }

  get password() { 
    return this.registrationForm.get('password');
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Trying to register user');
      this.userService.createUser(this.registrationForm.value).subscribe({
        next: (res) => {          
          console.log('Successfully registered the user' + res.name);
        },
        error: (err) => {
          console.log('Failed to register the user');
        }
      });
    }
  }
}
