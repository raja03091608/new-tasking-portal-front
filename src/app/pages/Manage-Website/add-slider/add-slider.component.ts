import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../service/data.service';
import { ConsoleService } from "../../../service/console.service";
import { NotificationService } from "../../../service/notification.service";
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { Router } from '@angular/router'
import { AngularEditorConfig } from '@kolkov/angular-editor';

declare function closeModal(selector):any;

@Component({
  selector: 'app-add-slider',
  templateUrl: './add-slider.component.html',
  styleUrls: ['./add-slider.component.scss']
})
export class AddSliderComponent implements OnInit {
  add_slider: FormGroup
  custom: boolean = false
  public files: any[] = [];
  selectedFile: any;
  fileName: '';
  thumbnail!: File;
  userData: any;
  id: any;
  submitted: boolean= false;
  errorMessage: any;
  showImage: boolean = false;
  SilderDetails: any;
  isLoading$:boolean = false
  data: any;
  showError=true;

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

  @ViewChild("closebutton") closebutton;

  slide=[{id:1,name:"Home"},{id:2,name:"Task Group"},{id:3,name:"Image Gallery"}];

  constructor(private router: Router,private fb: FormBuilder,private logger: ConsoleService,public api: ApiService,private notification: NotificationService, private dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute) {
		this.route.queryParams.subscribe(params => {
			this.id = atob(params['id']);
		   // Print the parameter to the console.
		   if (this.id) {
				this.getSliderDetail();
				this.showImage = true;
		   }
	   });
  }
  ngOnInit(): void {
    this.createSliderForm();
    // let currentUser = localStorage.getItem('currentUser');
    // this.userData = JSON.parse(currentUser || '{}');

  }

  selectOnFile(event: any) {
    this.showError=false;
    this.selectedFile = event.target.files[0];

  }

  // public createSliderForm = new FormGroup({
  //   id: new FormControl(""),
  //   title:new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z]+")]),
  //   description: new FormControl(''),
  //   image: new FormControl("",[Validators.required]),
  //   redirect: new FormControl(""),
  //   slider_type: new FormControl('', [Validators.required]),
  //   slider_link:new FormControl(""),

  // });
  createSliderForm() {
    this.add_slider = this.fb.group({
      title: ['', [Validators.required,Validators.pattern("[a-zA-Z]+")]],
      description: [''],
      image: ['', [Validators.required]],
      redirect: [''],
      slider_type: ['', [Validators.required]],
      slider_link: [''],

    })
  }
  get f(): { [key: string]: AbstractControl } {
    return this.add_slider.controls;
  }

  getSliderDetail() {
    this.dataService.getRequest('website/sliders/details/' + this.id + '/').subscribe((result: any) => {
      this.SilderDetails = result.image
      this.add_slider.controls['title'].setValue(result.title);
      this.add_slider.controls['description'].setValue(result.description);
      this.add_slider.controls['slider_link'].setValue(result.slider_link);
      this.add_slider.controls['redirect'].setValue(result.redirect);
      this.add_slider.controls['slider_type'].setValue(result.slider_type);
      this.add_slider.controls['image'].setValue(result.image);



    },error => {
      this.errorMessage = error.error ? error.error.Message : error.Message;
      if (!this.errorMessage)
        this.errorMessage = error.error.error;
     this.toastr.error("Data Not Found");
   });
  }
  checkValue(event: any) {


    this.custom = event.target.checked
  }
  sliderDetails:any;
  submitSliderData(data:any) {
    // // console.log"DATA",data);
    this.submitted = true;
    this.isLoading$ = true
    if (this.id) {
      const formData = new FormData();
      formData.append('title',data.title)
      formData.append('description',data.description)
      formData.append('redirect',data.redirect)
      formData.append('slider_type',data.slider_type)
      formData.append('slider_link',data.slider_link)
        formData.append('user',this.api.userid.user_id)
      if(this.selectedFile !=null){
        formData.append('image', this.selectedFile)
      }

      // // console.logformData, '=========>', formData)
      this.dataService.putRequest('website/sliders/details/' + this.id + '/', formData).subscribe((data:any) => {
        this.sliderDetails=data;
        // // console.logdata, 'post======>');
        setTimeout(()=> {
          this.toastr.success('Slider Updated Successfully!');
       }, 500);
       setTimeout(()=> {
        this.router.navigateByUrl('/website/slider');
      }, 1000);

        this.showImage =false
        this.add_slider.reset()
        this.submitted = false
        this.isLoading$ = false
      },error => {
        this.errorMessage = error.error ? error.error.Message : error.Message;
        if (!this.errorMessage)
          this.errorMessage = error.error.error;
        this.toastr.error("Internal server error");
        this.isLoading$ = false

      })
    }


    // else {
    //   if (this.add_slider.invalid) {

    //   let formData = new FormData();
    //   formData.append('title', data.title)
    //   formData.append('description', data.description)
    //   formData.append('image', this.selectedFile)
    //   formData.append('redirect', data.redirect)
    //   formData.append('slider_type', data.slider_type)
    //   formData.append('slider_link', data.slider_link)
    //   formData.append('user', this.api.userid.user_id)
    //   // // console.logformData, '=========>', formData)
    //   this.dataService.postRequest('website/sliders/', formData).subscribe((data:any) => {
    //     // // console.logdata, 'post======>');
    //     this.sliderDetails=data;
    //     this.toastr.success('Slider Added Successfully!');
    //     this.add_slider.reset()
    //     this.submitted = false
    //     this.isLoading$ = false

    //   },error => {
    //     this.errorMessage = error.error ? error.error.Message : error.Message;
    //     if (!this.errorMessage)
    //       this.errorMessage = error.error.error;
    //     this.toastr.error("Internal server error");
    //     this.isLoading$ = false

    //   })
    // }

    // }

    else{

      if (this.add_slider.valid) {
        this.showError=false;
        const formData= new FormData()
        formData.append('title', data.title)
        formData.append('description', data.description)
        formData.append('image', this.selectedFile)
        formData.append('redirect', data.redirect)
        formData.append('slider_type', data.slider_type)
        formData.append('slider_link', data.slider_link)
        formData.append('user', this.api.userid.user_id)
        formData.append('id',"")
        this.dataService.postRequest('website/sliders/add',formData).subscribe((data:any)=>{
          this.sliderDetails=data;
          setTimeout(()=> {
            this.toastr.success('Slider Added Successfully!');
         }, 500);
         setTimeout(()=> {
          this.router.navigateByUrl('/website/slider');
        }, 1000);

          this.isLoading$ = false
          this.submitted =false
          this.add_slider.reset()
        },error => {
          this.errorMessage = error.error ? error.error.Message : error.Message;
          if (!this.errorMessage)
            this.errorMessage = error.error.error;
          this.toastr.error("Internal server error");

       })
      }
      }

  }
  cancelmodal(){
    closeModal('#add_slider');
  }
}
