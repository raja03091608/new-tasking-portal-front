import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "../../../service/notification.service";
import { ConfirmationDialogComponent } from "../../../confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "../../../../environments/language";
import { Router } from '@angular/router';
import { ConsoleService } from "../../../service/console.service";
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HostListener,ComponentRef,EventEmitter,Output,ViewContainerRef  } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

declare function closeModal(selector):any;
declare function openModal(selector):any;
declare function triggerClick(selector):any;
declare var moment:any;
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  providers:[DatePipe]
})
export class ProjectComponent implements OnInit {


  displayedColumns: string[] = [
    "title",
    "lead_by",
    "project_description",
    "image",
    // "view",
    "edit",
    "delete",

  ];
  dataSource: MatTableDataSource<any>;

  country: any;
  image: any;
  public crudName = "Add";
  public countryList = [];
  filterValue:any;
  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;
  showError=false;
  environment=environment.API_URL;


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


  public permission={
    add:true,
    edit:true,
    view:true,
    delete:true,
  };

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  projectData=[]as any;


  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private viewcontainerref : ViewContainerRef , private logger:ConsoleService,public datepipe:DatePipe) {

  }

  public editForm = new FormGroup({
    id: new FormControl(""),
    title: new FormControl("", [
      Validators.required,
      Validators.pattern("[a-zA-Z ]+"),
    ]),
    project_description: new FormControl(""),
    image: new FormControl(""),
    lead_by: new FormControl(""),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),
    status: new FormControl(""),
    start_date:new FormControl(''),
    end_date:new FormControl(""),
  });
   status = this.editForm.value.status;
   ImageUrl:any;
   start_date: string;
   end_date: string ;
  populate(data) {
    // this.editForm.patchValue(data);
    this.editForm.patchValue({modified_by:this.api.userid.user_id,
      title:data.title,project_description:data.project_description,
      start_date:data.start_date,end_date:data.end_date,lead_by:data.lead_by,
      id:data.id,
    });

    if (data ? data.image : "") {
      var img_link = data.image;
      var trim_img = img_link.substring(1)
      this.ImageUrl = environment.MEDIA_URL; + trim_img;

	  }
  }

  initForm() {
    this.editForm.patchValue({
      status: "1",
    });
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
     this.getProject();
     this.getAccess();
  }
  //trim_img:any;
  ImgUrl:any;
  con:any;
  id:any;
  getProject() {
    this.api
      .getAPI(environment.API_URL + "transaction/project-status")
      .subscribe((res) => {

        this.dataSource = new MatTableDataSource(res.data);
        this.projectData=res.data;

        this.countryList = res.data;
		this.con=this.countryList[0];

        this.dataSource.paginator = this.pagination;
		var Img=environment.MEDIA_URL;
		this.ImgUrl = Img.substring(0,Img.length-1) ;
      });

  }

  create() {
    this.crudName = "Add";
    this.isReadonly=false;
    this.editForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    // element.checked = true;
    openModal('#crud-countries');
  }

  editOption(country) {
    this.isReadonly=false;
    this.editForm.enable();
    this.crudName = "Edit";
    this.populate(country);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    // if(this.editForm.value.status == "1") {
    //  element.checked = true;
    // }
    // else {
    //  element.checked = false;
    // }
    openModal('#crud-countries');


  }

  onView(country) {
    this.crudName = 'View';
    this.isReadonly=true;
    this.editForm.disable();
    this.populate(country);

    // var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    // if(this.editForm.value.status == "1") {
    //  element.checked = true;
    // }
    // else {
    //  element.checked = false;
    // }
    openModal('#crud-countries');
  }

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "transaction/project-status/crud", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn('Project '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getProject();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  onSubmit() {
    this.showError=true;
    this.editForm.patchValue({start_date:this.datepipe.transform(this.start_date,'yyyy-MM-dd')});
    this.editForm.patchValue({end_date:this.datepipe.transform(this.end_date,'yyyy-MM-dd')});


    this.editForm.value.created_by = this.api.userid.user_id;
    // this.editForm.value.status = this.editForm.value.status==true ? "1" : "2";
    const formData = new FormData();
    formData.append('title', this.editForm.value.title);
    formData.append('project_description', this.editForm.value.project_description);
    formData.append('lead_by', this.editForm.value.lead_by);
    formData.append('start_date', this.editForm.value.start_date);
    formData.append('end_date', this.editForm.value.end_date);
    formData.append('id', this.editForm.value.id);
	if(this.imgToUpload !=null){
		formData.append('image', this.imgToUpload)
	  }


     if (this.editForm.valid) {
      //formData.append('id', this.editForm.value.id);

      this.api
        .postAPI(
          environment.API_URL + "transaction/project-status/crud",
          formData,


        )
        .subscribe((res) => {
          // this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getProject();
            this.closebutton.nativeElement.click();
          } else if(res.status==environment.ERROR_CODE) {
            this.error_msg=true;
            this.ErrorMsg=res.message;
            setTimeout(()=> {
              this.error_msg = false;
           }, 2000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
    // closeModal('#crud-countries');
  }



  getAccess() {
    // this.moduleAccess=this.api.getPageAction();
    if(this.moduleAccess)
    {
      let addPermission=(this.moduleAccess).filter(function(access){ if(access.code=='ADD') return access.status; }).map(function(obj) {return obj.status;});
      let editPermission=(this.moduleAccess).filter(function(access){ if(access.code=='EDIT') { return access.status;} }).map(function(obj) {return obj.status;});;
      let viewPermission=(this.moduleAccess).filter(function(access){ if(access.code=='VIW') { return access.status;} }).map(function(obj) {return obj.status;});;
      let deletePermission=(this.moduleAccess).filter(function(access){ if(access.code=='DEL') { return access.status;} }).map(function(obj) {return obj.status;});;
      this.permission.add=addPermission.length>0?addPermission[0]:false;
      this.permission.edit=editPermission.length>0?editPermission[0]:false;;
      this.permission.view=viewPermission.length>0?viewPermission[0]:false;;
      this.permission.delete=deletePermission.length>0?deletePermission[0]:false;;
    }

  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if(this.filterValue){
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getProject();
    }
  }

  imgToUpload: File | null = null;
  onImageHandler(event) {
    //// console.logevent,event.target.files[0])
    if (event.target.files.length > 0) {
      this.imgToUpload= event.target.files[0];
     };

    }
	cancelmodal(){
		closeModal('#crud-countries');
	  }

    gridColumns=[
      { field: 'title', header: ' Title', filter: true, filterMatchMode: 'contains' },
      { field: 'lead_by', header: 'Lead By	', filter: true, filterMatchMode: 'contains' },
      { field: 'project_description', header: 'Description', filter: true, filterMatchMode: 'contains' },
      { field: 'image', header: 'Image', filter: true, filterMatchMode: 'contains' },
      // { field: 'authority_permission', header: 'Authority Permission', filter: true, filterMatchMode: 'contains' },
    ]
    exportData:any;
    filterData:any;
    handleFilter(filterValue: any) {
      
      this.filterData = filterValue;
      // // console.log'Filter triggered with value:', filterValue);
    }
    handlePagination(pageEvent: any) {
      // // console.log'Pagination triggered with event:', pageEvent);
    }
  
    openCurrentStatus(country){
      // this.id=country.id;
      //   // console.log'tasking country',country)
      //   this.taskname = country.task_name;
      //   this.tasknumber = country.task_number_dee;
      //   // this.selectedTrial=tasking;
      //   openModal('#trial-status-modal');
      // this.getComments();
      }
  
      UploadReceipt(country) {
        // this.id=country.id;
        // window.open(environment.API_URL+"transaction/approved_all_task_view/"+ this.id)
      }
    
      completedtask(country) {
        // this.id=country.id;
        // openModal('#completedTask-modal');
      }
      taskid:any;
      opentask(country:any){
        // // console.log'countyryry',country);
        // this.resetexportform();
        // this.exportform.reset();
        openModal('#export');
        this.taskid = country.id;
    
      }
  
  
}

