import { Routes } from '@angular/router';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';

export const routes: Routes = [
  { path: '', component: UserRegistrationComponent },
  { path: 'login', component: UserLoginComponent}
];
