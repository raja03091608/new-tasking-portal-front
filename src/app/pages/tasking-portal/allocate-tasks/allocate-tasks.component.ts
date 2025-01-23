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
import { formatDate } from "@angular/common";

declare function closeModal(selector): any;
declare function openModal(selector): any;

@Component({
  selector: 'app-allocate-tasks',
  templateUrl: './allocate-tasks.component.html',
  styleUrls: ['./allocate-tasks.component.scss']
})
export class AllocateTasksComponent implements OnInit {

  displayedColumns: string[] = [
    "task_number_dee",
    "task_description",
    // "file",
    "cost_implication",
    "sponsoring_directorate",
    "time_frame_for_completion",
    "status",
    "view",
  ];
  dataSource: MatTableDataSource<any>;
  dataSourcelist: MatTableDataSource<any>;

  country: any;
  image: any;
  taskingGroups: any;
  public crudName = "Add";
  public countryList = [];
  filterValue: any;
  isReadonly = false;
  moduleAccess: any;
  ErrorMsg: any;
  error_msg = false;

  public permission = {
    view: false,
    add: false,
    //delete:false,
  };
  token_detail:any;
  allocateForm:FormGroup;
  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(public api: ApiService, private notification: NotificationService,
    private dialog: MatDialog, private router: Router, private elementref: ElementRef, private logger: ConsoleService) {

      this.token_detail=this.api.decryptData(localStorage.getItem('token-detail'));
      this.allocateForm = new FormGroup({
        id: new FormControl(""),
          tasking_group: new FormControl(""),
        tasking: new FormControl(""),
        created_by:new FormControl(""),
        created_role : new FormControl(this.token_detail.role_id),
        });

  }


  populate(data) {
    //this.editForm.patchValue(data);
    this.allocateForm.patchValue(data);
  }

  initForm() {
    // this.allocateForm.patchValue({
    //   status: "1",
    // });
  }

  Error = (controlName: string, errorName: string) => {
    return this.allocateForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
    // this.getcreatedid();
    this.getTasking();
    this.getTaskingGroups();
    this.getAccess();


  }


  getTaskingGroups() {
    this.api
      .getAPI(environment.API_URL + "master/taskinggroups")
      .subscribe((res) => {
        this.taskingGroups = res.data;
      });
  }
  created_list:any;
  creList:any;
  // getcreatedid() {
  //   this.api
  //     .getAPI(environment.API_URL + "transaction/allocate/status")
  //     .subscribe((res) => {
  //       if(res.status==environment.SUCCESS_CODE){
  //         this.dataSource = new MatTableDataSource(res.data);
  //         this.created_list = res.data;
  //         this.dataSource.paginator = this.pagination;
  //         this.logger.log('countryds', this.created_list[0].created_by.id)
  //         this.creList=this.created_list[0].created_by.id
  //         // console.log'fdfd',this.creList)
  //         this.getTasking();

  //       }

  //     });
  // }

  getTasking() {
    if(this.token_detail.role_id==3){
      this.api
      .getAPI(environment.API_URL + "transaction/allocate/status?created_by="+this.token_detail.user_id)
      .subscribe((res) => {
        if(res.status==environment.SUCCESS_CODE){
          this.dataSourcelist = new MatTableDataSource(res.data);
          this.countryList = res.data;
          this.dataSourcelist.paginator = this.pagination;
        }

      });
    }
    else{
      this.api
      .getAPI(environment.API_URL + "transaction/allocate/status")
      .subscribe((res) => {
        if(res.status==environment.SUCCESS_CODE){
          this.dataSourcelist = new MatTableDataSource(res.data);
          this.countryList = res.data;
          this.dataSourcelist.paginator = this.pagination;
        }

      });

    }

  }
  //   this.api
  //     .postAPI(environment.API_URL + "transaction/trial/status",{'tasking_id':this.token_detail.tasking_id})
  //     .subscribe((res) => {
  //       this.dataSource = new MatTableDataSource(res.data);
  //       this.countryList = res.data;
  //       this.dataSource.paginator = this.pagination;
  //       this.logger.log('country', this.countryList)
  //     });

  // }
  getTrials() {
    this.api
      .getAPI(environment.API_URL + "transaction/trials/approval")
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.countryList = res.data;
        this.dataSource.paginator = this.pagination;
      });
  }

  id: any;
  task_name: any;
  task_Desc: any;

  updateallocate(country) {
    this.crudName = "Save";
    this.isReadonly = false;
    this.allocateForm.enable();
    this.populate(country);

    this.task_name = country.task_number_dee;
    this.task_Desc = country.task_description;
    setTimeout(()=>{
      this.allocateForm.patchValue({tasking_group:country.assigned_tasking_group?country.assigned_tasking_group.tasking_group_id:''});
    },500);
    this.id = country.id;
    let reset = this.formGroupDirective.resetForm();
    if (reset !== null) {
      this.initForm();
    }
	openModal('#crud-allocate');
  }


  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.postAPI(environment.API_URL + "transaction/tasking/crud", {
          id: id,
          status: 3,
        }).subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            this.notification.warn('tasking ' + language[environment.DEFAULT_LANG].deleteMsg);
            this.getTasking();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef = null;
    });
  }

  onallocateSubmit() {
    this.allocateForm.value.tasking = this.id;

    if (this.allocateForm.valid) {
      this.allocateForm.value.created_by = this.api.userid.user_id;
      // this.allocateForm.value.created_role = this.token_detail.tasking_id;

      //this.allocateForm.value.status = this.allocateForm.value.status == true ? 1 : 2;

      this.api
        .postAPI(
          environment.API_URL + "transaction/assigned-task/crud",

          this.allocateForm.value,

        )
        .subscribe((res) => {
          //this.error= res.status;
          if (res.status == environment.SUCCESS_CODE) {
            // this.logger.log('Formvalue',this.editForm.value);
            localStorage.setItem('allocate_Del',this.api.encryptData(res));
            this.notification.success(res.message);
            this.getTasking();
            this.closebutton.nativeElement.click();
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = true;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = false;
            }, 2000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
  }


  getAccess() {
    this.moduleAccess = this.api.getPageAction();
    if (this.moduleAccess) {
      let addPermission=(this.moduleAccess).filter(function(access){ if(access.code=='ADD') return access.status; }).map(function(obj) {return obj.status;});
      let viewPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'VIW') { return access.status; } }).map(function (obj) { return obj.status; });
      this.permission.add=addPermission.length>0?addPermission[0]:false;
      this.permission.view = viewPermission.length > 0 ? viewPermission[0] : false;
      //this.permission.delete=deletePermission.length>0?deletePermission[0]:false;
    }

  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if (this.filterValue) {
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getTasking();
    }
  }
  cancelmodal(){
	closeModal('#crud-allocate');
  }


}
