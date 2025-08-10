import { Routes } from '@angular/router';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { SetBudgetComponent } from './components/set-budget/set-budget.component';

export const routes: Routes = [
  { path: '', component: UserRegistrationComponent },
  { path: 'register', component: UserRegistrationComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'budget-setup', component: SetBudgetComponent }
];
