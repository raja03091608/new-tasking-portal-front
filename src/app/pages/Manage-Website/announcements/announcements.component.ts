import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../service/data.service';
import { ConsoleService } from "../../../service/console.service";
import { NotificationService } from "../../../service/notification.service";
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
  providers:[DatePipe]
})
export class AnnouncementsComponent implements OnInit {

	deleteCourseRef: any;
  id:any;
  @ViewChild('template') template: ElementRef;
  allPages: any;
  totalpage:any
  errorMessage: any;
  p:any=0;

  constructor(private router: Router,private modalService: NgbModal, private apiService: DataService,public api: ApiService,private notification: NotificationService, private dataService: DataService, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.getPagesList();
  }

  openDialog(node:any) {
    this.id= node.id;
    this.deleteCourseRef = this.modalService.open(this.template);

  }

  getPagesList() {
    this.api.getAPI(environment.API_URL +'website/announcement/').subscribe((data: any) => {
      if(!data.length)this.toastr.error("Data Not Found")
      this.allPages = data;
      this.totalpage=data.length
    },error => {
      this.errorMessage = error.error ? error.error.Message : error.Message;
      if (!this.errorMessage)
        this.errorMessage = error.error.error;
      this.toastr.error("Data Not Found");

   })
  }

  deletePage(){
    this.dataService.deleteRequest('website/announcement'+'/'+this.id+'/').subscribe((result:any)=>{
      this.toastr.success('Page Deleted Successfully!');
      this.deleteCourseRef = this.modalService.dismissAll();
      this.getPagesList();
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
	this.router.navigateByUrl("/website/edit-announcement/?id="+btoa(pid));
  }
  }


