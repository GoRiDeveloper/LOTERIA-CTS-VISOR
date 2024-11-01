import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DirectoriosServicesService } from 'src/app/services/directorios-services.service';
import { UsersService } from 'src/app/services/users.service';
import * as CryptoJS from 'crypto-js';
import { StoreService } from 'src/app/store.service';
@Component({
  selector: 'app-navbar-top-admin',
  templateUrl: './navbar-top-admin.component.html',
  styleUrls: ['./navbar-top-admin.component.css']
})
export class NavbarTopAdminComponent implements OnInit {
  public dependencies:any;
  userData:any;
  public isCollapsedCentral = true;
  public isCollapsedExpediente = true;
  public userInfo:any;

  
  constructor(private _directoriosService:DirectoriosServicesService,
              private modalService:NgbModal,
              private _router:Router,
              private _userService:UsersService,
              private offcanvasService: NgbOffcanvas,
             ) { }


  open(content:any){
    this.modalService.open(content, { size:'md', centered:true})
  }


  ngOnInit(): void {
    let bytes  = CryptoJS.AES.decrypt(localStorage.getItem('data')|| '' ,localStorage.getItem('token') || '' );
    this.userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));    
  }
  


}
