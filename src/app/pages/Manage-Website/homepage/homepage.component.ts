import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../service/data.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  deleteCourseRef:any;
  id:any;
  @ViewChild('template') template: ElementRef;
  AllWebsettings: any;
  errorMessage: any;

  constructor( private router: Router,private modalService: NgbModal,private dataService: DataService,private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  openDialog(node:any){
    this.id= node.id;
		this.deleteCourseRef = this.modalService.open(this.template);

  }


  deleteWebsite(){
    this.dataService.deleteRequest(`website_settings/details/`+this.id+'/').subscribe((data: any) => {
      this.deleteCourseRef = this.modalService.dismissAll();
      this.toastr.success('Website Detail Deleted Successfully!');

    },error => {
      this.errorMessage = error.error ? error.error.Message : error.Message;
      if (!this.errorMessage)
        this.errorMessage = error.error.error;
      this.toastr.error("Internal server error");

   });
   this.ngOnInit();
  }

  openpage(pid: any)
  {
	this.router.navigateByUrl("/website/edit-home/?id="+btoa(pid));
  }
}
