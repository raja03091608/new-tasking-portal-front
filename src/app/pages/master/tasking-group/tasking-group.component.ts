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
import { HostListener,ComponentRef,EventEmitter,Output,ViewContainerRef  } from '@angular/core';

declare function closeModal(selector):any;
declare function openModal(selector):any;
declare function triggerClick(selector):any;
declare var moment:any;

@Component({
  selector: 'app-taskinggroup',
  templateUrl: './tasking-group.component.html',
  styleUrls: ['./tasking-group.component.scss']
})
export class TaskingGroupComponent implements OnInit {

	examples = [{
		id: 1, name: 'Test1', isSelected: false, isDisabled: true,
	  },
	  {
		id: 2, name: 'Test2', isSelected: true, isDisabled: false,
	  },
	  {
		id: 3, name: 'Test3', isDisabled: false,
	  }
	  ];
  displayedColumns: string[] = [
    "name",
    "code",
    "description",
    "image",
    "status",
    "view",
    "edit",
    "delete",
	"rank",

  ];
  displayedColumnslist: string[] = [
	"name",
	"rank",
	"image",
	"description",
	"tasking_group_type",
	"edit",
	"delete",

	];

  displayedColumnsview: string[] = [
	"name",
	"rank",
	"image",
	"tasking_group_type",
	"description",


	];

  dataSource: MatTableDataSource<any>;
  dataSourcelist: MatTableDataSource<any>;


  country: any;
  image: any;
  tasking_group_type:any;
  public crudName = "Add";
  public countryList = [];
  filterValue:any;
  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;
  showError=false;
  environment=environment.API_URL;



  public permission={
    add:true,
    edit:true,
    view:true,
    delete:true,
  };

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild(FormGroupDirective) formGroupDirectiveRank: FormGroupDirective;
  tasingGroupList= [] as any;


  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private viewcontainerref : ViewContainerRef , private logger:ConsoleService) {

  }
  public MileStoneForm = new FormGroup({
    id: new FormControl(""),
	name:new FormControl(""),
    rank:new FormControl(""),
	description:new FormControl(""),
	rank_image:new FormControl(""),
	tasking_group_type:new FormControl(""),

	status: new FormControl(""),
});


  public editForm = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [
      Validators.required,
      Validators.pattern("[a-zA-Z ]+"),
    ]),
    description: new FormControl(""),
    code: new FormControl("", [Validators.required]),
    image: new FormControl(""),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),
    sequence : new FormControl("", [Validators.pattern("^[0-9]*$")]),
    status: new FormControl("", [Validators.required]),
  });
   status = this.editForm.value.status;
   ImageUrl:any;
   rank_ImageUrl:any;
  populate(data) {
    this.editForm.patchValue(data);
    this.editForm.patchValue({modified_by:this.api.userid.user_id});
	if (data ? data.image : "") {
		var img_link = data.image;
		var trim_img = img_link.substring(1)
		this.ImageUrl = environment.MEDIA_URL + trim_img;
	  }
	  else{
		this.ImageUrl ="";
	}

  }
  rank_populate(data) {
	this.MileStoneForm.patchValue(data);

	if (data ? data.image : "") {

		var rank_img_link = data.image;
		var rank_trim_img = rank_img_link.substring(1)
		this.rank_ImageUrl = environment.MEDIA_URL + rank_trim_img;

	}else{
		this.rank_ImageUrl ="";
	}
  }


  initForm() {
    this.editForm.patchValue({
      status: "1",
    });
  }

  initRankForm(){
	this.MileStoneForm.patchValue({
		status: "1",
	  });
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
    this.getTaskinggroups();
    this.getAccess();
	  this.getRank;
	  this.getlookup();
  }
  //trim_img:any;
  ImgUrl:any;
  con:any;
  id:any;
  getTaskinggroups() {
    this.api
      .getAPI(environment.API_URL + "master/taskinggroups")
      .subscribe((res) => {

        this.dataSource = new MatTableDataSource(res.data);
        this.tasingGroupList=res.data;

        this.countryList = res.data;
		this.con=this.countryList[0];

        this.dataSource.paginator = this.pagination;
		// if (this.con ? this.con.image : "") {
		// 	var img_link = this.con.image;
		// 	var trim_img = img_link.substring(1)
		// 	this.ImgUrl = environment.MEDIA_URL; ;
		//   }
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
    element.checked = true;
    openModal('#crud-countries');
  }

  editOption(country) {
    this.isReadonly=false;
    this.editForm.enable();
    this.crudName = "Edit";
    this.populate(country);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == "1") {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
    openModal('#crud-countries');
  }

  onView(country) {
    this.crudName = 'View';
    this.isReadonly=true;
    this.editForm.disable();
    this.populate(country);

    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == "1") {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
    openModal('#crud-countries');
  }
  taskingID:any;
  openPopup(id) {
	this.taskingID=id;
    // this.getMileStone();
	openModal('#crud-milestone');
    setTimeout(()=> {
      this.getRank();
     }, 1000);



  }
  lookup: any;
  getlookup() {
    this.api
      .getAPI(environment.API_URL + "master/lookup")
      .subscribe((res) => {
        this.lookup = res.data;

      });
  }




  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "master/taskinggroups/crud", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn('Tasking group '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getTaskinggroups();

          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      // dialogRef=null;
    });
  }

  onSubmit() {

	  this.showcomments=true;
    this.editForm.value.created_by = this.api.userid.user_id;
    // this.editForm.value.status = this.editForm.value.status==true ? "1" : "2";
    if(this.editForm.value.status){
      if(this.editForm.value.status=="1")
        this.editForm.value.status="1"
    }
    else{
      this.editForm.value.status="2"
    }
    const formData = new FormData();
    formData.append('name', this.editForm.value.name);
    formData.append('description', this.editForm.value.description);
    formData.append('code', this.editForm.value.code);
    formData.append('sequence', this.editForm.value.sequence);
    formData.append('status', this.editForm.value.status);
    formData.append('id', this.editForm.value.id);

    // formData.append('image', this.imgToUpload);
    formData.append('created_by', this.editForm.value.created_by);
    formData.append('created_ip', this.editForm.value.created_ip);
    formData.append('modified_by', this.api.userid.user_id);
    formData.append('image', this.imgToUpload)

    // if(this.imgToUpload !=null){
    //   formData.append('image', this.imgToUpload)
    //   }

     if (this.editForm.valid) {
      //formData.append('id', this.editForm.value.id);
      this.api
        .postAPI(
          environment.API_URL + "master/taskinggroups/crud",
          formData,
        )
        .subscribe((res) => {
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getTaskinggroups();
            this.closebutton.nativeElement.click();
            this.showcomments=false;
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
  editOption1(milestone) {
	this.isReadonly=false;
	this.MileStoneForm.enable();
	this.crudName = "Edit";
	this.rank_populate(milestone);
	var element = <HTMLInputElement> document.getElementById("exampleCheck1");

	openModal('#crud-milestone');


  }
  onDelete1(id) {
	let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
	  width: '350px',
	  data: language[environment.DEFAULT_LANG].confirmMessage
	});
	dialogRef.afterClosed().subscribe(result => {
	  if(result) {
		this.api.postAPI(environment.API_URL + "master/tasking_rank/crud", {
		  id: id,
		  status: 3,
		}).subscribe((res)=>{
		  if(res.status==environment.SUCCESS_CODE) {
			this.notification.warn(' Tasking Rank '+language[environment.DEFAULT_LANG].deleteMsg);
			this.getRank();
		  } else {
			this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
		  }
		});
	  }
	  dialogRef=null;
	});
  }

  OnMileStoneSubmit()
  {
	this.showError=true;
  this.editForm.value.created_by = this.api.userid.user_id;
  if(this.editForm.value.status){
    if(this.editForm.value.status=="1")
      this.editForm.value.status="1"
  }
  else{
    this.editForm.value.status="2"
  }
  const formData = new FormData();
  formData.append('tasking_group', this.taskingID);
  formData.append('name', this.MileStoneForm.value.name);
  formData.append('description', this.MileStoneForm.value.description);
  formData.append('tasking_group_type', this.MileStoneForm.value.tasking_group_type);
  formData.append('rank', this.MileStoneForm.value.rank);
  formData.append('status', "1");
  formData.append('id', this.MileStoneForm.value.id);

  // formData.append('rank_image', this.imgToUpload1);

  if(this.imgToUpload1 !=null){
	  formData.append('image', this.imgToUpload1)
	}

   if (this.MileStoneForm.valid) {
	//formData.append('id', this.editForm.value.id);
	this.api
	  .postAPI(
		environment.API_URL + "master/tasking_rank/crud",
		formData,
	  )
	  .subscribe((res) => {
		if(res.status==environment.SUCCESS_CODE){
		  // this.logger.log('Formvalue',this.editForm.value);
		  this.notification.success(res.message);
		  this.getRank();
		  let resetrank = this.MileStoneForm.reset();
			if(resetrank!==null) {
				this.initRankForm();
			}
		}else if(res.status==environment.ERROR_CODE) {
		  this.error_msg=true;
		  this.ErrorMsg=res.message;
		  setTimeout(()=> {
			this.error_msg = false;
		 }, 1000);
		} else {
		  this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
		}

	  });
  }
  // closeModal('#crud-countries');
}


  getAccess() {
    this.moduleAccess=this.api.getPageAction();
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
      this.getTaskinggroups();
    }
  }

  imgToUpload: File | null = null;
  onImageHandler(event) {
    if (event.target.files.length > 0) {
      this.imgToUpload= event.target.files[0];
      // console.log("ghjgjhri",file);
      // this.form.patchValue({files:file});
     };

    }
	imgToUpload1: File | null = null;
	onImageHandler1(event) {
	  if (event.target.files.length > 0) {
		this.imgToUpload1= event.target.files[0];
		// console.log("ghjgjhri",file);
		// this.form.patchValue({files:file});
	   };

	  }
  showcomments=false;
	cancelmodal(){
    this.ImageUrl ="";
    this.showcomments=false;
		closeModal('#crud-countries');
	  }
  cancelmodal1(){
    this.rank=[];
    closeModal('#crud-milestone');
  }


	  rank:any;
	  getRank(){

		this.api
		  .getAPI(environment.API_URL + "master/tasking_rank?tasking_group="+this.taskingID)
		  .subscribe((res) => {
			this.dataSourcelist = new MatTableDataSource(res.data);

			this.rank = res.data;

		  });
	  }

    close(){
      this.taskingID='';
      this.rank_ImageUrl="";
      this.MileStoneForm.reset();
      closeModal('#crud-milestone');
      }


      
  

  gridColumns=[
    { field: 'name', header: 'Name', filter: true, filterMatchMode: 'contains' },
    { field: 'code', header: 'Code', filter: true, filterMatchMode: 'contains' },
    { field: 'description', header: 'Description', filter: true, filterMatchMode: 'contains' },
    { field: 'status', header: 'Staus', filter: true, filterMatchMode: 'contains' },
  
  ]
  exportData:any;
  filterData:any;
  handleFilter(filterValue: any) {
    
    this.filterData = filterValue;
    console.log('Filter triggered with value:', filterValue);
  }
  handlePagination(pageEvent: any) {
    console.log('Pagination triggered with event:', pageEvent);
  }

  openCurrentStatus(country){
    // this.id=country.id;
    //   console.log('tasking country',country)
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
      console.log('countyryry',country);
      // this.resetexportform();
      // this.exportform.reset();
      openModal('#export');
      this.taskid = country.id;
  
    }


}
