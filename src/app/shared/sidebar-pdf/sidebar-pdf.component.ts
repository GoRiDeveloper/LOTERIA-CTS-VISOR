import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidebar-pdf',
  templateUrl: './sidebar-pdf.component.html',
  styleUrls: ['./sidebar-pdf.component.css']
})
export class SidebarPdfComponent implements OnInit {

  constructor(
    private offcanvasService: NgbOffcanvas,

  ) { }

  ngOnInit() {
    
  }


  openBackdrop(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {
      backdrop: true,
      ariaLabelledBy: 'modal-basic',
      animation: true,
    });
  }
}
