import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-add-homepage',
  templateUrl: './add-homepage.component.html',
  styleUrls: ['./add-homepage.component.scss']
})
export class AddHomepageComponent implements OnInit {
  submitted = false;
  websiteSettingForm: FormGroup
  userData: any;
  webSetting: any;
  logo: any;
  image: any;
  AllWebsettings: any;
  passData:string
  editData: any;
  id:any;
  websitePage: any;
  showimage: boolean =true;
  errorMessage: any;
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

  constructor(private fb: FormBuilder, private dataService: DataService,private logger: ConsoleService,public api: ApiService,private notification: NotificationService,private route: ActivatedRoute,private router: Router,
    private toastr: ToastrService,) {

	this.id=1;
   if (this.id) {
		this.getHomepageDetail();

   }
}
  ngOnInit(): void {
    this.createForm();

  }


  createForm() {
    this.websiteSettingForm = this.fb.group({
      website_logo: ['', [Validators.required]],
      website_logo_white: ['', [Validators.required]],
      website_about: ['', [Validators.required]],
      address: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.websiteSettingForm.controls;
  }

  getHomepageDetail(){
    this.dataService.getRequest('website/website_settings/details/'+ this.id +'/').subscribe((result:any)=>{
     this.websitePage=result
      this.websiteSettingForm.controls['website_about'].setValue(result.website_about);

      this.websiteSettingForm.controls['address'].setValue(result.address);
      this.websiteSettingForm.controls['contact'].setValue(result.contact);
      this.websiteSettingForm.controls['email'].setValue(result.email);
      this.websiteSettingForm.controls['website_logo'].setValue(result.website_logo);
      this.websiteSettingForm.controls['website_logo_white'].setValue(result.website_logo_white);

    });
  }

  selectLogoFile(event: any) {
    this.logo = event.target.files[0]
  }

  onselectImage(event: any) {

    this.image = event.target.files[0]
  }

  submitWebsiteSettingData(data: any) {

    this.submitted = true;
    this.isLoading$ = true

    if(this.id){

      this.showimage=false
      const formData = new FormData()
      if(this.logo !=null){
      formData.append('website_logo', this.logo)
    }
    if(this.image !=null){
      formData.append('website_logo_white', this.image)
    }
      formData.append('website_about', data.website_about)
      formData.append('address', data.address)
      formData.append('contact', data.contact)
      formData.append('email', data.email)
      formData.append('user', this.api.userid.user_id)

      this.dataService.putRequest('website/website_settings/details/'+ this.id +'/', formData).subscribe((data: any) => {
        this.webSetting = data;
		setTimeout(()=> {
			this.toastr.success('Website Setting Updated Successfully!');
		 }, 500);
		 setTimeout(()=> {
			this.getHomepageDetail();

		}, 1000);


        this.isLoading$ = false
        this.websiteSettingForm.reset()
        this.submitted = false

      },error => {
        this.errorMessage = error.error ? error.error.Message : error.Message;
        if (!this.errorMessage)
          this.errorMessage = error.error.error;
        this.toastr.error("Internal server error");

     });
    }
    else{
      if (this.websiteSettingForm.valid) {

    const formData = new FormData()
    formData.append('website_logo', this.logo)
    formData.append('website_logo_white', this.image)
    formData.append('website_about', data.website_about)
    formData.append('address', data.address)
    formData.append('contact', data.contact)
    formData.append('email', data.email)
    formData.append('user', this.api.userid.user_id)
    formData.append('website_menu', this.api.userid.user_id)

    this.dataService.postRequest('website/website_settings/', formData).subscribe((data: any) => {
      this.webSetting = data;
	  setTimeout(()=> {
        this.toastr.success('Website Setting Added Successfully!');
     }, 500);
     setTimeout(()=> {
      this.router.navigateByUrl('website/edit-home/{{websetting.id}}');
    }, 1000);
      this.isLoading$ = false
      this.websiteSettingForm.reset()
      this.submitted = false
    },error => {
      this.errorMessage = error.error ? error.error.Message : error.Message;
      if (!this.errorMessage)
        this.errorMessage = error.error.error;
      this.toastr.error("Internal server error");

   })
  }

  }
}
numberOnly(event:any): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;

}

}
