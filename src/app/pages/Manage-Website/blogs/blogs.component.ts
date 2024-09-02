import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../service/data.service';


@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {

  deleteCourseRef:any;

  @ViewChild('template') template: ElementRef;
  blogs: any;
  id: string;
  errorMessage: any;

  constructor( private modalService: NgbModal,private apiService: DataService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getBlog()
  }
// category-blog/all/ api for get blog category

  openDialog(node:any){
    this.id = node.id
		this.deleteCourseRef = this.modalService.open(this.template);

  }
  getBlog(){
    this.apiService.getRequest('blog/').subscribe((result: any) => {
      this.blogs=result
      // console.log(result);
  },error => {
    this.errorMessage = error.error ? error.error.Message : error.Message;
    if (!this.errorMessage)
      this.errorMessage = error.error.error;
  this.toastr.error("Data Not Found");
 })
}
deletePage(){

  this.apiService.deleteRequest('blog/details/'+ this.id+'/').subscribe((result:any)=>{
    this.toastr.success('Blog Deleted Successfully!');
    this.deleteCourseRef = this.modalService.dismissAll();
    this.getBlog();
  },error => {
    this.errorMessage = error.error ? error.error.Message : error.Message;
    if (!this.errorMessage)
      this.errorMessage = error.error.error;
    this.toastr.error("Internal server error");

 });
}
}
