import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private router: Router) {}

  login() {
    if (this.username === 'admin' && this.password === 'Seguridad2026*') {
      this.error = '';
      this.router.navigate(['/admin']);
    } else {
      this.error = 'Usuario o contraseña incorrectos';
    }
  }
}
