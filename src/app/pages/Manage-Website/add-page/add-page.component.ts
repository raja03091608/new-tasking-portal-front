import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../service/data.service';
import { ConsoleService } from "../../../service/console.service";
import { NotificationService } from "../../../service/notification.service";
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss']
})
export class AddPageComponent implements OnInit {
  submitted = false;
  addPageForm:FormGroup
  userData: any;
  selectedFile: any;
  pageDetails: any;
  allPageDetails: any;
  id:any;
  errorMessage: any;
  pageDetailsImage: any;
  showImage: boolean = false;
  isLoading$:boolean = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: '10rem',
      minHeight: '5rem',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter description here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize','toggleEditorMode','customClasses']
    ]

};

  constructor(private fb:FormBuilder,private dataService:DataService,private router: Router,
    private toastr: ToastrService, private route:ActivatedRoute,private logger: ConsoleService,public api: ApiService,private notification: NotificationService) {
		this.route.queryParams.subscribe(params => {
			this.id = atob(params['id']);
		   // Print the parameter to the console.
		   if (this.id) {
				this.getPageDetail();
				this.showImage = true;


          this.addPageForm=this.fb.group({
            page_title:['',[Validators.required]],
            page_content:['',[Validators.required]],
            page_status:['',[Validators.required]],
            page_featured_image:[''],
            page_slug:['',[Validators.required]]

          })
        }
      });
     }

  ngOnInit(): void {
    // let currentUser = localStorage.getItem('currentUser');
    // this.userData = JSON.parse(currentUser || '{}');
    if(!this.id){
      this.createForm();
    }

    this.getAllPages();
  }

  getPageDetail(){
    this.dataService.getRequest('website/pages/edite/'+ this.id +'/').subscribe((result:any)=>{
      this.pageDetailsImage = result.page_featured_image
      this.addPageForm.controls['page_title'].setValue(result.page_title);
      this.addPageForm.controls['page_content'].setValue(result.page_content);
      this.addPageForm.controls['page_status'].setValue(result.page_status);
      this.addPageForm.controls['page_slug'].setValue(result.page_slug);
      this.addPageForm.controls['page_featured_image'].setValue(result.page_featured_image);

    },error => {
      this.errorMessage = error.error ? error.error.Message : error.Message;
      if (!this.errorMessage)
        this.errorMessage = error.error.error;
     this.toastr.error("Data Not Found");
   });
  }

  createForm(){
    this.addPageForm=this.fb.group({
      page_title:['',[Validators.required]],
      page_content:['',[Validators.required]],
      page_status:['',[Validators.required]],
      page_featured_image:['',[Validators.required]],
      page_slug:['',[Validators.required]]

    })
  }
  get f(): { [key: string]: AbstractControl } {
    return this.addPageForm.controls;
  }
  onSelectFile(event:any){
    this.selectedFile=event.target.files[0]
  }



  submitPageData(data:any){
    this.submitted = true;
    this.isLoading$ = true
   if(this.id){
      const formData= new FormData()
    formData.append('page_title',data.page_title)
    formData.append('page_content',data.page_content)
    formData.append('page_status',data.page_status)
    formData.append('page_slug',data.page_slug)
    formData.append('user',this.api.userid.user_id)
    formData.append('id',this.id )
    if(this.selectedFile != null){
      formData.append('page_featured_image',this.selectedFile)

    }
    this.dataService.putRequest('website/pages/edite/'+ this.id +'/',formData).subscribe((data:any)=>{
      this.pageDetails=data;
      setTimeout(()=> {
        this.toastr.success('Page Updated Successfully!');
     }, 500);
     setTimeout(()=> {
      this.router.navigateByUrl('/website/pages');
   }, 1000);

      this.isLoading$ = false
      this.submitted =false
      this.showImage = false
    },error => {
      this.errorMessage = error.error ? error.error.Message : error.Message;
      if (!this.errorMessage)
        this.errorMessage = error.error.error;
      this.toastr.error("Internal server error");

   })
  }
 else{
  if (this.addPageForm.valid) {
    const formData= new FormData()
    formData.append('page_title',data.page_title)
    formData.append('page_content',data.page_content)
    formData.append('page_status',data.page_status)
    formData.append('page_featured_image',this.selectedFile)
    formData.append('page_slug',data.page_slug)
    formData.append('user',this.api.userid.user_id)
    formData.append('id',"")
    this.dataService.postRequest('website/pages/',formData).subscribe((data:any)=>{
      this.pageDetails=data;
      setTimeout(()=> {
        this.toastr.success('Page Added Successfully!');
     }, 500);
     setTimeout(()=> {
      this.router.navigateByUrl('/website/pages');
    }, 1000);

      this.isLoading$ = false
      this.submitted =false
      this.addPageForm.reset()
    },error => {
      this.errorMessage = error.error ? error.error.Message : error.Message;
      if (!this.errorMessage)
        this.errorMessage = error.error.error;
      this.toastr.error("Internal server error");

   })
  }
  }
}

  getAllPages(){
    this.dataService.getRequest('website/pages/').subscribe((data:any)=>{
      this.allPageDetails=data;

    })
  }

}
