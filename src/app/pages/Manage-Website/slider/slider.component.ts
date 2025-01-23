import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../service/data.service';
import { ConsoleService } from "../../../service/console.service";
import { NotificationService } from "../../../service/notification.service";
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  deleteCourseRef:any;

  @ViewChild('template') template: ElementRef;
  allSlider: any;
  slider: any;
  id:any;
  totalslider:any
  errorMessage: any;
  p:any=0;

  constructor(private router: Router,private route: ActivatedRoute,private modalService: NgbModal,private dataService:DataService,private logger: ConsoleService,public api: ApiService,private notification: NotificationService,private toastr: ToastrService) {


}
  ngOnInit(): void {
    this.getAllSlider();
  }

  openDialog(node:any){
    this.id= node.id;
		this.deleteCourseRef = this.modalService.open(this.template);

  }
  getAllSlider(){
    this.api.getAPI(environment.API_URL +'website/sliders/').subscribe((data:any)=>{

      if(!data.length)this.toastr.error("Data Not Found")

      this.allSlider=data;
      this.totalslider=data.length
      // // console.logdata,"=======>",this.allSlider)
    },error => {
      this.errorMessage = error.error ? error.error.Message : error.Message;
      if (!this.errorMessage)
        this.errorMessage = error.error.error;
      this.toastr.error("Data Not Found");

   })
  }

deleteSlider(){
  this.dataService.deleteRequest('website/sliders/details/'+this.id+'/').subscribe((data)=>{

    this.toastr.success('Slider Deleted Successfully!');

    this.deleteCourseRef=this.modalService.dismissAll();
    // this.deleteCourseRef.close();
    this.router.navigateByUrl('/website/slider');
    this.getAllSlider();

  },error => {
    this.errorMessage = error.error ? error.error.Message : error.Message;
    if (!this.errorMessage)
      this.errorMessage = error.error.error;
    this.toastr.error("Internal server error");

 })
 this.ngOnInit();
}
openslider(pid: any)
{
  this.router.navigateByUrl("/website/edit-slider/?id="+btoa(pid));
}

}
