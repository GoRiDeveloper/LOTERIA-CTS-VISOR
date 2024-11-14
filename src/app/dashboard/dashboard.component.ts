import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this._authService.checkTokenExpiration();
    document.body.style.overflowY = 'auto';
  }
}
