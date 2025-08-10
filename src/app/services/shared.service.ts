import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { UserDetails } from '../constants/interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private userDetails!: UserDetails;

  public setUserDetails(userDetails : UserDetails)
  {
      this.userDetails = userDetails;
  }

  public getUserDetails() : UserDetails {
    return this.userDetails;
  }
}
