import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
})
export class DocumentsComponent {

  @ViewChild('template') template: ElementRef;
  documentRef:any;

  constructor(private modalService: NgbModal) {}

  openDocument(){
    this.documentRef= this.modalService.open(this.template);
  }
}
