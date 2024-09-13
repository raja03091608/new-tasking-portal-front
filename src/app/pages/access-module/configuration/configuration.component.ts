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

declare function closeModal(selector):any;
declare function openModal(selector):any;

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  displayedColumns: string[] = [
    "user_role",
    "department",
    "level",
    "status",
    "view",
    "edit",
    "delete",

  ];


  dataSource: MatTableDataSource<any>;

  country: any;
  public crudName = "Add";
  public countryList = [];
  // filterValue:any;
  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;

  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
  };



  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  configurationData=[]as any;

  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService) {

  }

  public editForm = new FormGroup({
    id: new FormControl(""),
    department: new FormControl("",[Validators.required]),
    user_role: new FormControl("",[Validators.required]),
    level: new FormControl("",[Validators.required]),
    status: new FormControl("", [Validators.required]),
	created_by:new FormControl(""),
  });
   status = this.editForm.value.status;
  populate(data) {
    this.editForm.patchValue(data);
    this.editForm.patchValue({department:data.department.id});
    this.editForm.patchValue({user_role:data.user_role.id});

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
     this.getApproval();
     this.getUserGroups();
     this.getUserRoles();
     this.getAccess();
  }
  userRoles:any;
  getUserRoles() {
    this.api
      .getAPI(environment.API_URL + "access/access_user_roles?status=1")
      .subscribe((res) => {
        this.userRoles = res.data;
      });
  }

  UserGroups:any;
  getUserGroups() {
    this.api
      .getAPI(environment.API_URL + "master/department?status=1")
      .subscribe((res) => {
        this.UserGroups = res.data;
      });
  }

  getApproval() {
    this.api
      .getAPI(environment.API_URL + "configuration/approvals")
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.configurationData=res.data;
        this.countryList = res.data;
        this.dataSource.paginator = this.pagination;

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
    openModal('#configuration');
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
    openModal('#configuration');
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
    openModal('#configuration');
  }

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "configuration/approvals/crud", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn('Approval '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getApproval();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  onSubmit() {
     if (this.editForm.valid) {
      this.editForm.value.created_by = this.api.userid.user_id;
      //this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "configuration/approvals/crud",
          this.editForm.value
        )
        .subscribe((res) => {
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            this.getApproval();
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

  filterValue:string;
applyFilter(event: Event) {
  this.filterValue = (event.target as HTMLInputElement).value;
  if(this.filterValue){
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  } else {
    this.getApproval();
  }
}
// applyFilter(event: Event) {
//   const filterValue = (event.target as HTMLInputElement).value;
//   this.dataSource.filter = filterValue.trim().toUpperCase();
// }



  cancelmodal(){
    closeModal('#configuration');
    }

    gridColumns=[
      { field: '  rowData?.user_role?.name ', header: ' user_role', filter: true, filterMatchMode: 'contains' },
      { field: 'last_name', header: 'Last Name', filter: true, filterMatchMode: 'contains' },
      { field: 'department.level', header: 'Level', filter: true, filterMatchMode: 'contains' },
      { field: 'status', header: 'Status', filter: true, filterMatchMode: 'contains' },
      // { field: 'authority_permission', header: 'Authority Permission', filter: true, filterMatchMode: 'contains' },
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
