import { Component, Input, OnInit,ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators, FormGroupDirective  } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";

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

@Component({
  selector: 'app-task-block',
  templateUrl: './task-block.component.html',
  styleUrls: ['./task-block.component.scss']
})
export class TaskBlockComponent implements OnInit {
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) pagination: MatPaginator;
	@Input() modelData:any;
  //taskForm: FormGroup;
  //dataSource: MatTableDataSource<any>;

  country: any;
  image: any;
  public crudName = "Save";
  public countryList = [];
  filterValue:any;
  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;
  //moment=moment;
  showError=false;
  ImageUrl: string;



  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder,public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService) {

  }
  taskForm = new FormGroup({
    id: new FormControl(""),

	status: new FormControl(""),
    comment_status:new FormControl(""),
//   });
   sdForm : new FormGroup({
	sponsoring_directorate: new FormControl("",[Validators.required]),
    task_description: new FormControl(""),
    file: new FormControl("",),
  }),
weseeForm : new FormGroup({
      id: new FormControl(""),
      cost_implication: new FormControl(""),
     comments_of_wesee: new FormControl(""),
     time_frame_for_completion: new FormControl(""),
  }),
deeForm : new FormGroup({
     task_number_dee: new FormControl(""),
    comments_of_dee: new FormControl(""),
  }),
acomForm : new FormGroup({
	recommendation_of_acom_its:new FormControl(""),
}),
comForm : new FormGroup({
	approval_of_com: new FormControl(""),
})
});

status = this.taskForm.value.status;

  populate(data) {
    this.taskForm.get('sdForm').patchValue(data);
	//console.log('sdform',this.taskForm.get('sdForm').patchValue(data));
	this.taskForm.get('weseeForm').patchValue(data);
	this.taskForm.get('deeForm').patchValue(data);
	this.taskForm.get('acomForm').patchValue(data);
	this.taskForm.get('comForm').patchValue(data);
	//console.log('data',data);
	//console.log('data',data.file);
	if (data ? data.file : "") {
		var img_link = data.file;
		//var trim_img = img_link.substring(1)
		this.ImageUrl = img_link;
	  }

    // this.logger.info(data.status)
  }

  initForm() {
    this.taskForm.patchValue({
      status: "1",
    });

  }

  Error = (controlName: string, errorName: string) => {
    return this.taskForm.controls[controlName].hasError(errorName);
  };




  ngOnInit(): void {
	this.getTasking();
	//this.getAccess();

    //console.log(this.modelData.data);

    // if(this.modelData.data == 'view'){
    //   this.taskForm.disable();
    // }
  }
  id:any;
  list:any;
  openEdit(country) {
    this.isReadonly=false;
    this.taskForm.enable();
    this.crudName = "Edit";
	this.id=country.id;
    // this.logger.info(country);
    this.populate(country);
    this.list=country;
	//console.log('list',this.list.recommendation_of_acom_its);



	//if(this.api.userid.role_center[0].user_role.code!='Initiator')this.taskForm.get('sdForm').disable();
	if(this.api.userid.role_center[0].user_role.code!='Initiator')this.taskForm.get('sdForm').disable();
	if(this.api.userid.role_center[0].user_role.code!='WESEE')this.taskForm.get('weseeForm').disable();
	if(this.api.userid.role_center[0].user_role.code!='DEE')this.taskForm.get('deeForm').disable();
	if(this.api.userid.role_center[0].user_role.code!='ACOM')this.taskForm.get('acomForm').disable();
	if(this.api.userid.role_center[0].user_role.code!='APP')this.taskForm.get('comForm').disable();
   // openModal('#crud-countries');


  }


  getTasking() {

    this.api
      .getAPI(environment.API_URL + "transaction/tasking")
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.countryList = res.data;
        this.dataSource.paginator = this.pagination;
        // this.logger.log('country',this.countryList)

      });
  }


}
