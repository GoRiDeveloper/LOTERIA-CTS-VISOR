import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { DirectoriosServicesService } from 'src/app/services/directorios-services.service';
import { ErrorService } from '../../../../../services/error.service';

@Component({
  selector: 'app-menu-home',
  templateUrl: './menu-home.component.html',
  styleUrls: ['./menu-home.component.css'],
})
export class MenuHomeComponent implements OnInit {
  public dependency: any;
  userData: any;
  subDependecyName: any;
  subDependencies: any;
  filterDependeciesName: any;
  public isLoading: boolean = false;

  constructor(private _dependecyService: DirectoriosServicesService) {}

  ngOnInit(): void {
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem('data') || '',
      localStorage.getItem('token') || ''
    );
    this.userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    this.getDependecy();
  }

  getDependecy() {
    this._dependecyService.getDependecy().subscribe({
      next: (response) => {
        try {
          this.subDependencies = response;

          if (
            this.subDependencies.length > 0 &&
            this.subDependencies.length > 0
          ) {
            this.isLoading = false;
          }
        } catch (error) {
          console.error('Error procesando respuesta:', error);
        }
      },
      error: (err) => {
        console.log('Error en servicio:', err);
      },
    });
  }
}
