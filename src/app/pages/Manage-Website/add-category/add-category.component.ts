import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../service/data.service';


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})

export class AddCategoryComponent implements OnInit {

  categories: any;
  categoryForm: FormGroup
  allCategory: any;
  id: any;
  submitted: boolean=false;
  errorMessage: any;
  isLoading$ :boolean = false

  constructor(private apiService: DataService, private fb: FormBuilder, private toastr: ToastrService,
    private route: ActivatedRoute) {
    this.route.params.subscribe((params:any) => {
      this.id = params.id;
      if (params.id) {
        this.getCategoryDetail();
      }
    });
  }

  ngOnInit(): void {
    this.createCategory();
    this.getCategoryType();
  }

  getCategoryDetail() {

    this.apiService.getRequest('category/cbj/details/' + this.id + '/').subscribe((result: any) => {
      this.categoryForm.controls['name'].setValue(result.name);
      this.categoryForm.controls['slug'].setValue(result.slug);
      this.categoryForm.controls['cate_type'].setValue(result.cate_type);
      this.categoryForm.controls['status'].setValue(result.status);

    },error => {
      this.errorMessage = error.error ? error.error.Message : error.Message;
      if (!this.errorMessage)
        this.errorMessage = error.error.error;
       this.toastr.error("Data Not Found");
   });

  }

  getCategoryType() {
    this.apiService.getRequest('category-type/cbj/').subscribe((result: any) => {
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

  createCategory() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      cate_type: ['', [Validators.required]],
      status: ['', [Validators.required]],
    })
  }
  get f(): { [key: string]: AbstractControl } {
    return this.categoryForm.controls;
  }

  submitCategoryData(data: any) {
    this.submitted = true;
    this.isLoading$ = true

      if (this.id) {
        const formData = new FormData()

        formData.append('name', data.name)
        formData.append('slug', data.slug)
        formData.append('cate_type', data.cate_type)
        formData.append('status', data.status)

        this.apiService.putRequest('category/cbj/details/' + this.id + '/', formData).subscribe((data: any) => {
          this.allCategory = data;
          this.toastr.success('Category Updated Successfully!');
          this.isLoading$ = false
          this.categoryForm.reset()
          this.submitted =false
        },error => {
          this.errorMessage = error.error ? error.error.Message : error.Message;
          if (!this.errorMessage)
            this.errorMessage = error.error.error;
          this.toastr.error("Internal server error");
       });
      }
      else {
        if(this.categoryForm.valid){
        const formData = new FormData()

        formData.append('name', data.name)
        formData.append('slug', data.slug)
        formData.append('cate_type', data.cate_type)
        formData.append('status', data.status)

        this.apiService.postRequest('category/cbj/', formData).subscribe((data: any) => {
          this.allCategory = data;
          this.toastr.success('Category Added Successfully!');
          this.isLoading$ = false
          this.categoryForm.reset()
          this.submitted =false

        },error => {
          this.errorMessage = error.error ? error.error.Message : error.Message;
          if (!this.errorMessage)
            this.errorMessage = error.error.error;
          this.toastr.error("Internal server error");
       })
      }
    }
  }
}
