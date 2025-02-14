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
import { DatePipe } from '@angular/common';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-announcements',
  templateUrl: './add-announcements.component.html',
  styleUrls: ['./add-announcements.component.scss'],
  providers:[DatePipe]

})
export class AddAnnouncementsComponent implements OnInit {


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
	isLoading$:boolean = false
	date: string;
	constructor(private fb:FormBuilder,private dataService:DataService,private router: Router,
	  private toastr: ToastrService, private route:ActivatedRoute,private logger: ConsoleService,public api: ApiService,private notification: NotificationService,public datepipe:DatePipe) {
		this.route.queryParams.subscribe(params => {
			this.id = atob(params['id']);
		   if (this.id) {
				this.getPageDetail();
				this.showImage = true;

			this.addPageForm=this.fb.group({
			title:['',[Validators.required]],
			description:['',[Validators.required]],
			  date:['',[Validators.required]]


			})
		  }
		});

	   }

	ngOnInit(): void {
	  if(!this.id){
		this.createForm();
	  }

	  this.getAllannouncement();
	}

	getPageDetail(){
	  this.dataService.getRequest('website/announcement/'+ this.id +'/').subscribe((result:any)=>{

		this.addPageForm.controls['title'].setValue(result.title);
		this.addPageForm.controls['description'].setValue(result.description);
		this.addPageForm.controls['date'].setValue(result.date);


	  },error => {
		this.errorMessage = error.error ? error.error.Message : error.Message;
		if (!this.errorMessage)
		  this.errorMessage = error.error.error;
	   this.toastr.error("Data Not Found");
	 });
	}

	createForm(){
	  this.addPageForm=this.fb.group({
		title:['',[Validators.required]],
		description:['',[Validators.required]],
		date:['',[Validators.required]],


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
		this.addPageForm.patchValue({date:this.datepipe.transform(this.date,'yyyy-MM-dd')});
		const formData= new FormData()
	  formData.append('title',data.title)
	  formData.append('description',data.description)
	  formData.append('date',this.addPageForm.value.date)
	  formData.append('created_ip',"192.168.1.37");




	  formData.append('id',this.id )

	  this.dataService.putRequest('website/announcement/'+ this.id +'/',formData).subscribe((data:any)=>{
		this.pageDetails=data;
		setTimeout(()=> {
		  this.toastr.success('Announcement Updated Successfully!');
	   }, 500);
	   setTimeout(()=> {
		this.router.navigateByUrl('/website/announcement');
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
		//this.addPageForm.value.created_ip="192.168.1.37";
		this.addPageForm.patchValue({date:this.datepipe.transform(this.date,'yyyy-MM-dd')});
	  const formData= new FormData()
	  formData.append('title',data.title)
	  formData.append('description',data.description)
	  formData.append('date',this.addPageForm.value.date)
	  formData.append('created_ip',"192.168.1.37");




	  formData.append('id',"")
	  this.api
        .postAPI(
          environment.API_URL + 'website/announcement/crud',formData).subscribe((data:any)=>{
		this.pageDetails=data;
		setTimeout(()=> {
		  this.toastr.success('Page Added Successfully!');
	   }, 500);
	   setTimeout(()=> {
		this.router.navigateByUrl('/website/announcement');
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

	getAllannouncement(){
	  this.dataService.getRequest('website/announcement/').subscribe((data:any)=>{
		this.allPageDetails=data;

	  })
	}

  }



