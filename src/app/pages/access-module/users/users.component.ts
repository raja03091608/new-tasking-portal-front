import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, FormArray } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { NotificationService } from "../../../service/notification.service";
import { ConfirmationDialogComponent } from "../../../confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "../../../../environments/language";
import { Router } from '@angular/router';
import { ConsoleService } from "../../../service/console.service";
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

declare var inArray: any;

declare function closeModal(selector): any;
declare function openModal(selector): any;
declare function triggerClick(selector): any;
declare var moment: any;
@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

	

	dataSource: MatTableDataSource<any>;
	// inArray = inArray;
	user: any;
	crudName = "Add";
	UserList = [];
	filterValue: any;
	isReadonly = false;
	moduleAccess: any;
	ErrorMsg: any;
	error_msg = false;
	allSelected = false;
	allSelectedSAT = false;
	isPassword = false;
	importname: any;
	pageEvent: PageEvent;
	public permission = {
		add: true,
		edit: true,
		view: true,
		delete: true
		

	};

	
	@ViewChild(MatPaginator) pagination: MatPaginator;
	@ViewChild('select') select: MatSelect;
	@ViewChild('selectSAT') selectSAT: MatSelect;
	@ViewChild("closebutton") closebutton;
	@ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
	userData= [] as any;
	totalCounts: any;
	totaleRecords: any;
	
	constructor(public api: ApiService, private notification: NotificationService,
		private dialog: MatDialog, private router: Router, private elementref: ElementRef, private logger: ConsoleService,
		private formBuilder: FormBuilder
		,) {

	}
	docForm!: FormGroup;
	items!: FormArray;

	public deleteform = new FormGroup({
		user : new FormControl("", [
			Validators.required,
		]),

		status : new FormControl('', Validators.required),
	});

	public editForm = new FormGroup({
		id: new FormControl(""),
		first_name: new FormControl("", [
			Validators.required,
			Validators.pattern("[a-zA-Z ]+"),
		]),
		last_name: new FormControl(""),
		loginname: new FormControl('', Validators.required),
		email: new FormControl("", [Validators.required]),
		password: new FormControl(""),
		process: new FormControl('', ),
		unit: new FormControl('', ),
		department: new FormControl(''),
		tasking: new FormControl(''),
		user_role_id: new FormControl('', [Validators.required]),
		ad_user: new FormControl(""),
		
		rank_code: new FormControl(""),
		created_by: new FormControl(""),
		modified_by: new FormControl(""),
		status: new FormControl(""),
		signature: new FormControl(""),
		hrcdf_designation:new FormControl(""),

	});

	status = this.editForm.value.status;

	clearFormArray = (formArray: FormArray) => {
		while (formArray?.length !== 0) {
			formArray?.removeAt(0)
		}
	}


	populate(data) {
		this.editForm.patchValue({ id: data?.id, first_name: data?.first_name, last_name: data?.last_name, loginname: data?.loginname, email: data?.email, created_by: data?.created_by, modified_by: this.api?.userid?.user_id, status: data?.status, ad_user: data?.ad_user, hrcdf_designation: data?.hrcdf_designation,rank_code: data?.rankCode });
		setTimeout(() => {
			if (data.department != null) {
				this.editForm.patchValue({ department: data.department.id });
			}
			this.editForm.patchValue({ process: data.process.id });
			if (data.tasking != null) {
				this.editForm.patchValue({ tasking: data.tasking.id });
			}
			this.editForm.patchValue({ user_role_id: data?.roles[0]?.user_role?.id });

		}, 500);
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
		this.getProcess();
		this.getUnit()
		this.getDepartment();
		this.getAccess();
				this.getUserList();
		this.getDeletedUserList();
		this.getTasking();

	}




	refreshPaginator() {
		let pageIndex = 0;
		setTimeout((idx) => {
			this.pagination.pageIndex = 0;
			this.pagination._changePageSize(10);
		}, 0, pageIndex);
	}

	departmentList = [];
	getDepartment() {
		this.api.getAPI(`${environment.API_URL}master/department?status=1`)
  .subscribe((res) => {
    this.departmentList = res.results;
  });

	}
	
	

	taskingList = [];
	
	getTasking() {
		this.api.getAPI(environment.API_URL + "master/taskinggroups?status=1").subscribe((res) => {
			this.taskingList = res.data;
		});
	}
	UserGroup: any;
	taskingG=false
	processChange(process_id) {
		if (process_id) {
			this.getUserRoles(process_id);
			if (process_id == 1 ) {
				this.Task = false;
			}
			else {
				this.Task = true;
			}

		}
		if (process_id == 3) {
			this.taskingG = true;
		}else{
			this.taskingG = false;
			this.editForm.get('tasking').setValidators(null);

		}
	}

	param: any;
	currentPage = 0;
  pageSize = 10;
page=1;
	getUserList() {
		this.userData = [];
		this.api.displayLoading(true);
		this.api.getAPI(`${environment.API_URL}api/auth/users?order_type=desc&page=${this.page}`)
			.subscribe((res) => {
				this.totaleRecords = res.count; // Ensure count is defined
				this.currentPage=this.page-1;
				this.userData = res.results;
				this.api.displayLoading(false);
				if (res && res.results) {
					this.user = res.results;
				} else {
					this.userData = [];
					this.user = [];
				}
			}, (error) => {
				this.api.displayLoading(false);
				console.error("Error fetching user list:", error);
			});
	}
	

	
	deleted_users: any;
	getDeletedUserList() {
		this.api
			.getAPI(environment.API_URL + "api/auth/deleted/users")
			.subscribe((res) => {
				this.deleted_users = res.data;
			});
	}
	deleteusers: any;
	deletedstatus: any;
	closedelete() {
		closeModal('#deleteuser');
	}
	undeleteUser() {
		this.deleteform.value.user = this.deleteusers;
		this.deleteform.value.status = this.deletedstatus;
		let formval = { id: this.deleteform.value.user, status: this.deleteform.value.status };
		this.api.postAPI(environment.API_URL + "api/auth/deletedusers/crud", { deletedUser: formval })
			.subscribe((res) => {
				this.deleted_users = res.data;
				this.notification.success(res.message);
				closeModal('#deleteuser');
			});
		this.getDeletedUserList()


	}

	Task=true;
	getUserRoles(process_id = '') {
		let searchString = '?status=1';
		searchString += process_id ? '&process_id=' + process_id : '';
		this.api
			.getAPI(environment.API_URL + "access/access_user_roles" + searchString)
			.subscribe((res) => {
				this.UserList = res.data;
			});

	}
	processList = [];
	getProcess() {
		this.api
			.getAPI(environment.API_URL + "access/process")
			.subscribe((res) => {
				this.processList = res.data;

				this.docForm = new FormGroup({
					items: new FormArray([]),
				});
			});
	}
	unitList = [];
	getUnit() {
		this.api
			.getAPI(environment.API_URL + "/master/department")
			.subscribe((res) => {
				this.unitList = res.data;

				this.docForm = new FormGroup({
					unit: new FormArray([]),

				});
			});
	}
	unitChange(event){

	}
	deletedUser() {
		this.deleteform.reset();
		openModal('#deleteuser');
	}

	create() {
		this.editForm.get('password').setValidators([Validators.required]);
		this.editForm.get('password').updateValueAndValidity();
		this.crudName = "Add";
		this.isPassword = true;
		this.isReadonly = false;
		this.editForm.enable();
		let reset = this.formGroupDirective.resetForm();
		if (reset !== null) {
			this.initForm();
		}

		var element = <HTMLInputElement>document.getElementById("exampleCheck1");
		element.checked = true;
		openModal('#crud-countries');
	}

	editOption(country) {
		this.isReadonly = false
		this.editForm.enable();
		this.isPassword = false;
		this.crudName = "Edit";
		this.populate(country);
		openModal('#crud-countries');
	}

	onView(country) {
		this.crudName = 'View';
		this.Task = true
		this.isReadonly = true;
		this.editForm.disable();

		this.populate(country);
		openModal('#crud-countries');
	}

	onDelete(id) {
		let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
			width: '350px',
			data: language[environment.DEFAULT_LANG].confirmMessage
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.api.postAPI(environment.API_URL + "api/auth/users/crud", {
					id: id,
					status: 3,
				}).subscribe((res) => {
					if (res.status == environment.SUCCESS_CODE) {
						this.notification.warn('User ' + language[environment.DEFAULT_LANG].deleteMsg);
						this.getUserList();
					} else {
						this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
					}
				});
			}
			dialogRef = null;
		});
	}
	imgToUpload1: File | null = null;
	onImageHandler1(event) {
		if (event.target.files.length > 0) {
			this.imgToUpload1 = event.target.files[0];
		};
	}
	onSubmit() {
		this.showcomments = true;

		this.editForm.value.created_by = this.api.userid.user_id;

		if (this.editForm.value.status) {
			if (this.editForm.value.status == "1")
				this.editForm.value.status = "1"
		}
		else {
			this.editForm.value.status = "2"
		}
		const formData = new FormData();
		if (!this.editForm.value.id) {
			formData.append('first_name', this.editForm.value.first_name);
			formData.append('last_name', this.editForm.value.last_name);
			formData.append('loginname', this.editForm.value.loginname);
			formData.append('email', this.editForm.value.email);
			formData.append('process', this.editForm.value.process);
			formData.append('department', this.editForm.value.department);
			formData.append('tasking', parseInt(this.editForm.value.process) === 3? this.editForm.value.tasking : '' );
			formData.append('status', this.editForm.value.status);
			formData.append('user_role_id', this.editForm.value.user_role_id);
			formData.append('id', this.editForm.value.id );
			formData.append('password', this.editForm.value.password);
			formData.append('rankCode', this.editForm.value.rank_code);
			formData.append('ad_user', this.editForm.value.ad_user==null?this.editForm.value.ad_user='false':this.editForm.value.ad_user);

			if (this.imgToUpload1 != null) {
				formData.append('signature', this.imgToUpload1)
			}
		}
		else {
			formData.append('first_name', this.editForm.value.first_name);
			formData.append('last_name', this.editForm.value.last_name);
			formData.append('loginname', this.editForm.value.loginname);
			formData.append('email', this.editForm.value.email);
			formData.append('rankCode', this.editForm.value.rank_code);
			formData.append('process', this.editForm.value.process);
			formData.append('department', this.editForm.value.department);
			formData.append('tasking', parseInt(this.editForm.value.process) === 3? this.editForm.value.tasking : '');
			formData.append('status', this.editForm.value.status);
			formData.append('user_role_id', this.editForm.value.user_role_id);
			formData.append('id', this.editForm.value.id);
			formData.append('ad_user', this.editForm.value.ad_user);
			if (this.imgToUpload1 != null) {
				formData.append('signature', this.imgToUpload1)
			}
		}
		let formVal = {
			...this.editForm.value,
		}
		if (formVal.id != '' && formVal.id != null)
			delete formVal.password;

		if (this.editForm.valid) {
			this.api
				.postAPI(
					environment.API_URL + "api/auth/users/crud",
					formData
				)
				.subscribe((res) => {
					if (res.status == environment.SUCCESS_CODE) {
						this.notification.success(res.message);
						this.getUserList();
						this.closebutton.nativeElement.click();
						this.showcomments = true;
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
		if (this.moduleAccess) {
			let addPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'ADD') return access.status; }).map(function (obj) { return obj.status; });
			let editPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'EDIT') { return access.status; } }).map(function (obj) { return obj.status; });;
			let viewPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'VIW') { return access.status; } }).map(function (obj) { return obj.status; });;
			let deletePermission = (this.moduleAccess).filter(function (access) { if (access.code == 'DEL') { return access.status; } }).map(function (obj) { return obj.status; });;
			this.permission.add = addPermission.length > 0 ? addPermission[0] : false;
			this.permission.edit = editPermission.length > 0 ? editPermission[0] : false;;
			this.permission.view = viewPermission.length > 0 ? viewPermission[0] : false;;
			this.permission.delete = deletePermission.length > 0 ? deletePermission[0] : false;;
		}

	}

	applyFilter(event: Event) {
		this.filterValue = (event.target as HTMLInputElement).value;
		if (this.filterValue) {
			this.dataSource.filter = this.filterValue.trim().toLowerCase();
		} else {
			this.getUserList();
		}
	}

	toggleAllSelection() {
		if (this.allSelected) {
			this.select.options.forEach((item: MatOption) => item.select());
		} else {
			this.select.options.forEach((item: MatOption) => item.deselect());
		}
	}
	optionClick() {
		let newStatus = true;
		this.select.options.forEach((item: MatOption) => {
			if (!item.selected) {
				newStatus = false;
			}
		});
		this.allSelected = newStatus;
	}

	toggleAllSelectionSAT() {
		if (this.allSelectedSAT) {
			this.selectSAT.options.forEach((item: MatOption) => item.select());
		} else {
			this.selectSAT.options.forEach((item: MatOption) => item.deselect());
		}
	}
	optionClickSAT() {
		let newStatus = true;
		this.selectSAT.options.forEach((item: MatOption) => {
			if (!item.selected) {
				newStatus = false;
			}
		});
		this.allSelectedSAT = newStatus;
	}
	showcomments = false;
	cancelmodal() {
		this.showcomments = false;
		closeModal('#crud-countries');
	}

	public importform = new FormGroup({
		file_upload: new FormControl(""),
	});

	imgToUpload: File | null = null;
	onImageHandler(event) {
		if (event.target.files.length > 0) {
			this.imgToUpload = event.target.files[0];
		};

	}

	Submit() {
		const formData = new FormData();
		formData.append('file_upload', this.imgToUpload);
		if (this.importform.valid) {
			this.api
				.postAPI(
					environment.API_URL + "access/user_role/import",
					formData
				)
				.subscribe((res) => {
					if (res.status == environment.SUCCESS_CODE) {
						this.notification.success(res.message);
						this.getUserList();
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


	onPermanentDelete(id) {
		let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
			width: '350px',
			data: language[environment.DEFAULT_LANG].confirmMessage
		});
		let delval = { id: id }
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.api.postAPI(environment.API_URL + "api/auth/users/crud", {
					delval: delval.id
				}).subscribe((res) => {
					if (res.status == environment.SUCCESS_CODE) {
						this.notification.warn(res.message);
						this.getUserList();
					} else {
						this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
					}
				});
			}
			dialogRef = null;
		});
	}



	import() {
		this.importname = 'Import';
		openModal('#import');
	}
	data: any;;
	closeimport() {
		let reset = this.importform.reset();
		if (reset !== null) {
			this.initForm();
		}
		closeModal('#import');
	}



	gridColumns=[
		{ field: 'first_name', header: ' First Name', filter: true, filterMatchMode: 'contains' },
		{ field: 'last_name', header: 'Last Name', filter: true, filterMatchMode: 'contains' },
		{ field: 'email', header: 'Login Email', filter: true, filterMatchMode: 'contains' },
		{ field: 'roles[0].user_role.name', header: 'User Role', filter: true, filterMatchMode: 'contains' },
		{ field: 'department.name', header: 'unit', filter: true, filterMatchMode: 'contains' },
	  ]
	  exportData:any;
	  filterData:any;
	  handleFilter(filterValue: any) {
		
		this.filterData = filterValue;
	  }
	  handlePagination(event: any) {
		this.getUserList()
   		 this.page=event.page+1; 
			this.currentPage=event.page;
			this.pageSize = event.rows;
		 }


	
		  
		completedtask(country) {
		}
		taskid:any;
		opentask(country:any){
		  openModal('#export');
		  this.taskid = country.id;
	  
		}
	
		capitalizeInput(controlName: string): void {
			const control = this.editForm.get(controlName);
			if (control && control.value) {
			  const capitalizedValue = control.value.toUpperCase();
			  control.setValue(capitalizedValue, { emitEvent: false });
			}
		  }
	
}
