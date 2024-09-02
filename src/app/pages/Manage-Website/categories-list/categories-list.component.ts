import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../service/data.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  deleteCourseRef:any;
  categories:any;
  id:any;
  totaljobs:any
  p:any=0;

  @ViewChild('template') template: ElementRef;
  errorMessage: any;

  constructor( private modalService: NgbModal, private apiService: DataService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(){
    this.apiService.getRequest('category/cbj/').subscribe((result:any)=>{
      if(!result.length)this.toastr.error("Data Not Found")
      // console.log(result);
      this.categories= result;
      this.totaljobs=result.length
    },error => {
      this.errorMessage = error.error ? error.error.Message : error.Message;
      if (!this.errorMessage)
        this.errorMessage = error.error.error;
     this.toastr.error("Data Not Found");
   });
  }

  openDialog(node:any){
    this.id= node.id;
		this.deleteCourseRef = this.modalService.open(this.template);
  }

  deleteCategory(){
    this.apiService.deleteRequest('category/cbj/details/'+ this.id +'/').subscribe((result:any)=>{
        this.toastr.success('Category Deleted Successfully!');
        this.deleteCourseRef = this.modalService.dismissAll();
        this.getCategories();
    },error => {
      this.errorMessage = error.error ? error.error.Message : error.Message;
      if (!this.errorMessage)
        this.errorMessage = error.error.error;
      this.toastr.error("Internal server error");

   });
  }
}
