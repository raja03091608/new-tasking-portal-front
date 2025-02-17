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
  totolCounts: any;
  totalCounts: any;
  searchValue: string;
  totaleRecords: any;
  tableDataSource: MatTableDataSource<any, MatPaginator>;

  constructor(public api: ApiService, private notification: NotificationService,
    private dialog: MatDialog, private router: Router, private elementref: ElementRef, private logger: ConsoleService) {

      this.token_detail=this.api.decryptData(localStorage.getItem('token-detail'));
      this.allocateForm = new FormGroup({
        id: new FormControl(""),
          tasking_group: new FormControl(""),
        tasking_user: new FormControl(""),
        created_by:new FormControl(""),
        created_role : new FormControl(this.token_detail.role_id),
        });

  }


  populate(data) {
    this.allocateForm.patchValue(data);
  }

  initForm() {
  }

  Error = (controlName: string, errorName: string) => {
    return this.allocateForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
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
gridColumns=[
  { field: 'task_name', header: ' Task Name', filter: true, filterMatchMode: 'contains' },

    { field: 'task_number_dee', header: ' Task Number', filter: true, filterMatchMode: 'contains' },
    { field: 'task_description', header: ' Task Description', filter: true, filterMatchMode: 'contains' },
    { field: 'cost_implication', header: ' Cost Implication', filter: true, filterMatchMode: 'contains' },
    { field: 'sponsoring_directorate', header: ' Sponsoring Directorate', filter: true, filterMatchMode: 'contains' },
    { field: 'time_frame_for_completion_month', header: 'Time Frame for Completion', filter: true, filterMatchMode: 'contains' },

  ]
  usersList=[]
  getTaskingUser(event){
    this.api.getAPI(environment.API_URL+`api/auth/users?tasking_id=${event?.value}`).subscribe(res => {
        this.usersList=res.data
    })
  }
  handlePagination(event: any) {
    this.page=event.page+1;
   this.getTasking();
   this.currentPage=event.page;
   this.pageSize = event.rows;
 }
pageSize=10;
currentPage=0;
  page=1;
  getTasking() {
    this.countryList = [];
    if (this.token_detail.role_id == 3) {
      this.api
      this.api.getAPI(`${environment.API_URL}transaction/allocate/status?created_by=${this.token_detail.user_id}&page=${this.page}`)
        .subscribe((res) => {
          this.countryList = res.results.data || []; // Handle undefined results safely
          this.totaleRecords = res.count; // Ensure count is defined
          this.currentPage=this.page-1;
          if (res.status == environment.SUCCESS_CODE) {
            if (this.dataSourcelist) {
            //   this.dataSourcelist.data = this.countryList;
            //   this.dataSourcelist.paginator = this.pagination;
            // //  this.countryList = res.data || []; // Handle undefined results safely

            }
          }
        });
    } else {
      this.api.getAPI(`${environment.API_URL}transaction/allocate/status?page=${this.page}`)
  .subscribe((res) => {
    this.countryList = res.results.data || []; // Handle undefined results safely
    this.totaleRecords = res.count; // Ensure count is defined
    this.currentPage=this.page-1;
    if (res.results?.status === environment.SUCCESS_CODE) {

      if (this.dataSourcelist) {
        // this.dataSourcelist.data = this.countryList;
        // this.dataSourcelist.paginator = this.pagination;
      }
    }
  });
    }
  }
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
    
    this.task_name = country.task_number_dee;
    this.task_Desc = country.task_description;
    setTimeout(()=>{
      this.allocateForm.patchValue({tasking_group:country.assigned_tasking_group?country.assigned_tasking_group.tasking_group?.id:'',
        tasking_user:country.assigned_tasking_group?country.assigned_tasking_group.tasking_user:''
      });
    },500);
    this.id = country.id;
    if(country.assigned_tasking_group)
        this.getTaskingUser({value:country.assigned_tasking_group.tasking_group?.id})

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
            }, 200);
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
  onSearch(searchText: string) {
    if (!searchText.trim()) {
      this.countryList = []; // Agar empty ho to data clear kar do
      return;
    }
    this.countryList = []; // Pehle ka data clear karo

    this.api.getAPI(`${environment.API_URL}transaction/allocate/status?search=${searchText}`).subscribe(
      (res) => {
        if (res && res.results && res.results.data && res.results.data.length > 0) {
          this.countryList = res.results.data;
          this.totaleRecords = res.count;
        } else {
          this.countryList = []; // No data found
          this.getTasking();

        }
        this.updateTable(); // Update the table data after API call
      },
    );
  }
  
  updateTable() {
    this.tableDataSource = new MatTableDataSource(this.countryList);
  }
  
 
  
  clearFields() {
    this.searchValue = '';
    this.getTasking();
   
  }
}
