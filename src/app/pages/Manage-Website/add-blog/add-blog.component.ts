import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../service/data.service';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss']
})
export class AddBlogComponent implements OnInit {
  submitted:boolean = true
  addBlogForm!:FormGroup
  userData: any;
  categories: any;
  image: any;
  errorMessage: any;
  constructor(private fb : FormBuilder,private apiService: DataService,private toastr: ToastrService) { }

  ngOnInit(): void {
    let currentUser = localStorage.getItem('currentUser');
    this.userData = JSON.parse(currentUser || '{}');
    this.getCategory();
    this.createForm();
  }
  getCategory() {
    this.apiService.getRequest('categories/').subscribe((result: any) => {
      if(!result.length)this.toastr.error("Data Not Found")
      this.categories = result;
      // // console.logresult);
    },error => {
      this.errorMessage = error.error ? error.error.Message : error.Message;
      if (!this.errorMessage)
        this.errorMessage = error.error.error;
      this.toastr.error("Data Not Found");
   });
  }
  onSelectFile(event:any){
    this.image = event.target.files[0]
  }
  createForm(){
    this.addBlogForm = this.fb.group({
      title:['',[Validators.required]],
      image:['',[Validators.required]],
      summery: ['',[Validators.required]],
      content: ['',[Validators.required]],
      pubdate: ['',[Validators.required]],
      slug: ['',[Validators.required]],
      category: ['',[Validators.required]]
    })
  }
  submitBlogData(data:any){
    const formData = new FormData()
    formData.append('title',data.title)
    formData.append('image',this.image)
    formData.append('summery',data.summery)
    formData.append('content',data.content)
    formData.append('pubdate',data.pubdate)
    formData.append('slug',data.slug)
    formData.append('user',this.userData.user_id)
    formData.append('category',this.addBlogForm.value.category)

    this.apiService.postRequest('blog/',formData).subscribe((result: any) => {
      this.toastr.success('Blog Added Successfully!');
    },error => {
      this.errorMessage = error.error ? error.error.Message : error.Message;
      if (!this.errorMessage)
        this.errorMessage = error.error.error;
      this.toastr.error("Internal server error");
   });
  }

}
