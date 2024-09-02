import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, FormArray } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "../../../service/notification.service";
import { ConfirmationDialogComponent } from "../../../confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "../../../../environments/language";
import { Router } from '@angular/router';
import { ConsoleService } from "../../../service/console.service";
import { MatTableModule } from "@angular/material/table";

import { of } from 'rxjs';

declare function closeModal(selector):any;
declare function openModal(selector):any;
declare function triggerClick(selector):any;
declare var moment:any;
declare var inArray:any;

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {

  displayedColumns: string[] = [
    "name",
    "code",
    "status",
    "view",
    "edit",
    "delete",

  ];
  dataSource: MatTableDataSource<any>;
  inArray=inArray;
  country: any;
  public crudName = "Add";
  public countryList = [];
  // public depList = [];
  filterValue:any;
  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;
  showError=false;
  importname:any;
  // public permission={
  //   add:false,
  //   edit:false,
  //   view:true,
  //   delete:false,
  // };

  public permission={
    add:true,
    edit:true,
    view:true,
    delete:true,
  };

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService, private formBuilder: FormBuilder) {
    this.getDepartment();
  }

  docForm!: FormGroup;
  items!: FormArray;



  public editForm = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [
      Validators.required,
    ]),
    code: new FormControl("", [Validators.required]),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),
    sequence : new FormControl("", [Validators.pattern("^[0-9]*$")]),
    status: new FormControl("", [Validators.required]),
    process: new FormControl(""),
  });
   status = this.editForm.value.status;

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  // Error = (controlName: string, errorName: string) => {
  //   return this.docForm.controls[controlName].hasError(errorName);
  // };

  populate(data) {
    this.editForm.patchValue(data);
    this.editForm.patchValue({modified_by:this.api.userid.user_id});
    this.items = this.docForm.get('items') as FormArray;
    this.clearFormArray(this.items);

    this.editForm.patchValue({id:data.id,name:data.name,code:data.code,created_by:data.created_by,modified_by:this.api.userid.user_id,status:data.status});
    this.editForm.patchValue({process: data.process.id})
    // let actions = data.user_designation.map(function(a){console.log('testa',a.user_role_id);return a.user_role_id;});
    // this.editForm.patchValue({id:actions});
    if(data.user_designation.length>0)
    {
      // let id = '';
      let name ='';
      let  code = '';
      //console.log('ship_id',ship_id);
      for(let i=0;i<data.user_designation.length;i++)
      {


        code = data.user_designation[i].code;
        name = data.user_designation[i].name;
        this.items.push(this.formBuilder.group({name:name , code:code}));

      }

    }
    else
    {
      this.items = this.docForm.get('items') as FormArray;
      this.items.push(this.formBuilder.group({name: '', code:''}));
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

    this.getAccess();
    this.getProcess();
    this.getProcesslist();
  }

  getDepartment() {
    this.api
      .getAPI(environment.API_URL + "access/access_user_roles")
      .subscribe((res) => {
        // let load_data ='Please Wait...'
        // this.dataSource = new MatTableDataSource(res.data);
        // if(res.status==environment.SUCCESS_CODE){
        this.dataSource = new MatTableDataSource(res.data);

        this.countryList = res.data;

        this.dataSource.paginator = this.pagination;
        // }

      });
  }

  processList = [];
  getProcess() {

    this.api
      .getAPI(environment.API_URL + "access/designation")
      .subscribe((res) => {
        this.processList = res.data;

        this.docForm = new FormGroup({
          items: new FormArray([]),

        });
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
    this.items = this.docForm.get('items') as FormArray;
    this.clearFormArray(this.items);
    this.items.push(this.formBuilder.group({name: '',code:''}));
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

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "access/access_user_roles/crud", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn('User Role'+language[environment.DEFAULT_LANG].deleteMsg);
            this.getDepartment();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  onSubmit() {
    let user_designation ={'user_designation':this.items.value}
    this.showError=true;
     if (this.editForm.valid) {
      this.editForm.value.created_by = this.api.userid.user_id;
      // this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
      if(this.editForm.value.status){
        if(this.editForm.value.status=="1")
          this.editForm.value.status="1"
      }
      else{
        this.editForm.value.status="2"
      }
       let formVal={
        ...this.editForm.value,
        ...user_designation

       }

      if (formVal.name!='' && formVal.name!=null)

        this.api
          .postAPI(
            environment.API_URL + "access/access_user_roles/crud",

            // this.editForm.value,
            formVal
          )
          .subscribe((res) => {
            //this.error= res.status;
            if(res.status==environment.SUCCESS_CODE){
              this.notification.success(res.message);
              this.getDepartment();
              this.closebutton.nativeElement.click();
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

    //closeModal('#crud-countries');
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
      this.getDepartment();
    }
  }
  cancelmodal(){
	closeModal('#crud-countries');
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      name: '',
      code:'',
    });
  }

  addMore(): void {
    this.items = this.docForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  removeItem(i): void {
    this.items.removeAt(i);
  }

  UserGroup: any;
  processChange(process_id) {
    if (process_id) {
      this.getUserRoles(process_id);
      if (process_id == 3) {
        this.Task = true;
      }
      else {
        this.Task = false;
      }
      if (process_id == 2) {
        this.UserGroup = true;
      }
      else {
        this.UserGroup = false;
      }
    }
  }

  Task: any;
  UserList:any;
  getUserRoles(process_id = '') {
    let searchString = '?status=1';
    searchString += process_id ? '&process_id=' + process_id : '';
    this.api
      .getAPI(environment.API_URL + "access/access_user_roles" + searchString)
      .subscribe((res) => {
        this.UserList = res.data;
      });

  }
  processview = [];
  getProcesslist() {
    this.api
      .getAPI(environment.API_URL + "access/process")
      .subscribe((res) => {
        this.processview = res.data;
      });
  }


}
