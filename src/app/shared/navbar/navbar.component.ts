import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { state, trigger, style } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as CryptoJS from 'crypto-js';
import { ItemNavbarSelect } from 'src/app/services/itemNavbarSelect.service';
import { UsersService } from 'src/app/services/users.service';

const showBg = style({
  backgroundColor: 'red',
});
const hideBg = style({
  backgroundColor: 'transparent',
});

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('showBg', [state('showBg', showBg), state('hideBg', hideBg)]),
  ],
})
export class NavbarComponent implements OnInit {
  userData: any;
  selectedItemIndexSubject: number | null = null;

  constructor(
    private modalService: NgbModal,
    private _router: Router,
    private _userService: UsersService,
    private itemNavbarSelected: ItemNavbarSelect
  ) {}

  ngOnInit(): void {
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem('data') || '',
      localStorage.getItem('token') || ''
    );
    this.userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    this.itemNavbarSelected.selectedItemIndex$.subscribe((index) => {
      this.selectedItemIndexSubject = index;
    });

    // Desactivar active-route cuando está en /home/menu
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this._router.url === '/dashboard/home/menu') {
          this.selectedItemIndexSubject = null;
        }
      }
    });
  }

  // Activar clase para navbar item
  onItemClick(index: number): void {
    this.itemNavbarSelected.setSelectedItemIndex(index);
  }
  //

  open(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
      centered: true,
      windowClass: 'modal__window-background',
    });
  }

  openPopover(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
      centered: true,
      windowClass: 'modal__window-background',
    });
  }

  handleLogout() {
    // this._userService.logout().subscribe({
    //   next: (response) => {
    //     localStorage.clear();
    //     this.modalService.dismissAll();
    //     this._router.navigateByUrl('/');
    //   },
    // });
    localStorage.clear();
    this._router.navigateByUrl('/');
    this.modalService.dismissAll();
  }
}
