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
@Component({
  selector: 'app-sponsoring-directorate',
  templateUrl: './sponsoring-directorate.component.html',
  styleUrls: ['./sponsoring-directorate.component.scss']
})
export class SponsoringDirectorateComponent implements OnInit {
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild(FormGroupDirective) formGroupDirectiveRank: FormGroupDirective;

  public crudName = "Add";
  isReadonly=false;
  public initiatorList = [];
  ErrorMsg:any;
  error_msg=false;
  showError=false;
  moduleAccess:any;
  filterValue:any;
  public permission={
    add:true,
    edit:true,
    view:true,
    delete:true,
  };

  displayedColumns: string[] = [
    "name",
    "description",
    "skip_apso",
    "status",
    "view",
    "edit",
    "delete",

  ];
  sponSoringData=[]as any;
  totalCounts: any;

  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private viewcontainerref : ViewContainerRef , private logger:ConsoleService) { }

  public editForm = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [
      Validators.required,
      Validators.pattern("[a-zA-Z ]+"),
    ]),
    description: new FormControl(""),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),
   
    
    status: new FormControl("", [Validators.required]),
    skip_apso: new FormControl(""),

  });


  populate(data){
    this.editForm.patchValue(data);
    
  }

  initForm() {
    this.editForm.patchValue({
      status: "1",
      skip_apso:"2"
    });
  }
  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
    this.getInititator();
    this.getAccess();
    this.getUser()
  }

  create(){
    this.crudName = "Add";
    this.isReadonly=false;
    this.editForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    element.checked = true;
    var element1 = <HTMLInputElement>document.getElementById("exampleCheck2");
    element1.checked = false;
    openModal('#crud-countries');

  }
  editOption(initator) {
    this.isReadonly=false;
    this.editForm.enable();
    this.crudName = "Edit";
    this.populate(initator);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    var element1 = <HTMLInputElement> document.getElementById("exampleCheck2");
    if(this.editForm.value.status == "1") {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
    if(this.editForm.value.skip_apso == "1") {
      element1.checked = true;
     }
     else {
      element1.checked = false;
     }
    openModal('#crud-countries');
  }
  onView(initator) {
    this.crudName = 'View';
    this.isReadonly=true;
    this.editForm.disable();
    this.populate(initator);

    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    var element1 = <HTMLInputElement> document.getElementById("exampleCheck2");
    if(this.editForm.value.status == "1") {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
    if(this.editForm.value.skip_apso == "1") {
      element1.checked = true;
     }
     else {
      element1.checked = false;
     }

    openModal('#crud-countries');
  }
userList=[]
  getUser() {
    this.userList=[]
    this.api
      .getAPI(environment.API_URL + "master/department")
      .subscribe((res) => {
      this.userList=res?.data;
        
      });
  }
  url:string;
  getInititator() {
    this.sponSoringData=[]
    this.api
      .getAPI(environment.API_URL + "master/sponsoring_directorate?limit_start=0&limit_end=10")
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.sponSoringData= res.data;
        this. initiatorList= res.data;
        this.dataSource.paginator = this.pagination;
      });
  }

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "master/sponsoring_directorate/crud", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn('Tasking group '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getInititator();

          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
    });
  }

  onSubmit() {
    this.showError=true;
     if (this.editForm.valid) {
      this.editForm.value.created_by = this.api.userid.user_id;
      if(this.editForm.value.status){
        if(this.editForm.value.status=="1")
          this.editForm.value.status="1"
      }
      else{
        this.editForm.value.status="2"
      }
      if(this.editForm.value.skip_apso){
        if(this.editForm.value.skip_apso=="1")
          this.editForm.value.skip_apso="1"
      }
      else{
        this.editForm.value.skip_apso="2"
      }
      this.api
        .postAPI(
          environment.API_URL + "master/sponsoring_directorate/crud",

          this.editForm.value
        )
        .subscribe((res) => {
          if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            this.getInititator();
            this.closebutton.nativeElement.click();
            this.showError=false;
          } else if(res.status==environment.ERROR_CODE) {
            this.error_msg=false;
            this.ErrorMsg=res.message;
            setTimeout(()=> {
              this.error_msg = true;
           }, 2000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
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
      this.getInititator();
    }
  }
  cancelmodal(){
    this.showError=false;
	  closeModal('#crud-countries');
  }
  gridColumns=[
    { field: 'name', header: ' Name', filter: true, filterMatchMode: 'contains' },
    { field: 'description', header: 'Description', filter: true, filterMatchMode: 'contains' },
    { field: 'skip_apso', header: 'Skip Apso', filter: true, filterMatchMode: 'contains' },
  ]
  exportData:any;
  filterData:any;
  handleFilter(filterValue: any) {
    
    this.filterData = filterValue;
    // // console.log'Filter triggered with value:', filterValue);
  }
  handlePagination(pageEvent: any) {
  }
  openCurrentStatus(country){
   
    }

    UploadReceipt(country) {
    }
  
    completedtask(country) {
    }
    taskid:any;
    opentask(country:any){
      openModal('#export');
      this.taskid = country.id;
  
    }

}
