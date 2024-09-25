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

declare var arrayColumn: any;
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

	displayedColumns: string[] = [
		"First_Name",
		"Last_Name",
		"user_name",
		"unit",
		"User_Role",
		
		"view",
		"edit",
		"delete",
		"p_delete",


	];
	dataSource: MatTableDataSource<any>;
	inArray = inArray;
	user: any;
	crudName = "Add";
	UserList = [];
	// trials = [];
	// satellite = [];
	// ships = [];
	trial_unit: any;
	filterValue: any;
	isReadonly = false;
	moduleAccess: any;
	ErrorMsg: any;
	error_msg = false;
	showError = false;
	allSelected = false;
	allSelectedSAT = false;
	isPassword = false;
	importname: any;
	pageEvent: PageEvent;
	totalLength = 0;
	// Task = false;

	//   public permission = {
	//     add: false,
	//     edit: false,
	//     view: false,
	//     delete: false,
	//   };
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
	@ViewChild("fileInput") fileInput: any;
	userData= [] as any;
	//   set fileInput(val: ElementRef) {
	//     if(val) {
	//       console.log(val);
	//     }
	// }
	constructor(public api: ApiService, private notification: NotificationService,
		private dialog: MatDialog, private router: Router, private elementref: ElementRef, private logger: ConsoleService,
		private formBuilder: FormBuilder
		,) {

	}
	docForm!: FormGroup;
	items!: FormArray;

	public deleteform = new FormGroup({
		// id: new FormControl(""),
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
		last_name: new FormControl("", [
			Validators.required,
			Validators.pattern("[a-zA-Z ]+"),
		]),
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
		console.log('data', data)
		this.editForm.get('password').clearValidators();
		this.editForm.get('password').updateValueAndValidity();
		console.log('api', this.api.userid)
		this.items = this.docForm.get('items') as FormArray;
		this.clearFormArray(this.items);
		this.editForm.patchValue({ id: data.id, first_name: data.first_name, last_name: data.last_name, loginname: data.loginname, email: data.email, created_by: data.created_by, modified_by: this.api.userid.user_id, status: data.status, ad_user: data.ad_user, hrcdf_designation: data.hrcdf_designation});
		setTimeout(() => {
			if (data.department != null) {
				this.editForm.patchValue({ department: data.department.id });
			}
			this.editForm.patchValue({ process: data.process.id });
			if (data.tasking != null) {
				this.editForm.patchValue({ tasking: data.tasking.id });
			}
			// if(data.user_role_id!=null){
			//   this.editForm.patchValue({user_role_id: data.user_role_id.id});
			//   }
			// let actions = data.roles.map(function (a) { console.log(a.user_role.id); return a.user_role.id; });
			this.editForm.patchValue({ user_role_id: data.roles[0].user_role.id });

		}, 500);
		// if (data.user_role_id) {
		// 	let id = '';
		// 	let name = '';
		// 	let code = '';
		// 	//console.log('ship_id',ship_id);
		// 	for (let i = 0; i < data.user_role_id.length; i++) {

		// 		id = data.user_role_id[i].code;
		// 		// name = data.user_role_id[i].name;

		// 		// this.items.push(this.formBuilder.group({name:name , code:code}));
		// 		this.items.push(this.formBuilder.group({ id: id }));

		// 	}

		// }
		// else {
		// 	this.items = this.docForm.get('items') as FormArray;
		// 	// this.items.push(this.formBuilder.group({name: '', code:''}));
		// 	this.items.push(this.formBuilder.group({ id: '' }));
		// }

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
		

		/*this.getUserRoles();*/
		this.getProcess();
		this.getUnit()
		this.getDepartment();
		//this.getSatellite();
		this.getAccess();
		this.getUserList();
		this.getDeletedUserList();
		this.getTasking();
		this.refreshPaginator()

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
		this.api.getAPI(environment.API_URL + "master/department?status=1").subscribe((res) => {
			this.departmentList = res.data;
		});
	}

	taskingList = [];
	getTasking() {
		this.api.getAPI(environment.API_URL + "master/taskinggroups?status=1").subscribe((res) => {
			this.taskingList = res.data;
		});
	}
	UserGroup: any;
	processChange(process_id) {
		console.log("Process   " + process_id )
		if (process_id) {
			this.getUserRoles(process_id);
			if (process_id == 1 ) {
				this.Task = false;
			}
			else {
				this.Task = true;
			}

		}
	}

	param: any;
	getUserList() {
		let limit_start = 0;
		let limit_end = 10;
		if (this.pageEvent) {
			limit_end = (this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize;
			limit_start = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
		}
		if (this.param == undefined) this.param = ""; else this.param;
		this.api.displayLoading(true);
		this.api
			.getAPI(environment.API_URL + "api/auth/users?order_type=desc" + this.param + "&limit_start=" + limit_start + "&limit_end=" + limit_end)
			.subscribe((res) => {
				this.api.displayLoading(false)
				this.dataSource = new MatTableDataSource(res.data);
				this.userData=res.data;

				// this.dataSource.paginator = this.pagination;
				this.totalLength = res.total_length
				this.user = res.data;
				console.log('User', this.user);

			});
	}
	deleted_users: any;
	getDeletedUserList() {
		this.api
			.getAPI(environment.API_URL + "api/auth/deleted/users")
			.subscribe((res) => {
				this.deleted_users = res.data;
				console.log("Deleted", this.deleted_users);
			});
	}
	deleteusers: any;
	deletedstatus: any;
	closedelete() {
		closeModal('#deleteuser');
	}
	undeleteUser() {
		// console.log("deleteusers",this.deleteusers);
		// console.log("deletedstatus",this.deletedstatus);
		this.deleteform.value.user = this.deleteusers;
		this.deleteform.value.status = this.deletedstatus;
		let formval = { id: this.deleteform.value.user, status: this.deleteform.value.status };
		this.api.postAPI(environment.API_URL + "api/auth/deletedusers/crud", { deletedUser: formval })
			.subscribe((res) => {
				this.deleted_users = res.data;
				this.notification.success(res.message);
				closeModal('#deleteuser');
				console.log("Deleted", this.deleted_users);
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
					// ship_id: new FormArray([]),

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
					// ship_id: new FormArray([]),

				});
			});
	}
	unitChange(event){

	}
	deletedUser() {
		// this.deleteform.get('user').setValue('');
    	// this.deleteform.get('status').setValue('');
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
		// this.items = this.docForm.get('items') as FormArray;
		// this.clearFormArray(this.items);
		// this.items.push(this.formBuilder.group({ trial_unit_id: '', satellite_unit_id: '', ship_id: [] }));
		// this.items = this.docForm.get('items') as FormArray;
		// this.clearFormArray(this.items);
		// this.items.push(this.formBuilder.group({id: ''}));
		openModal('#crud-countries');
	}

	editOption(country) {
		this.isReadonly = false
		this.editForm.enable();
		this.isPassword = false;
		this.crudName = "Edit";
		this.populate(country);
		// var element = <HTMLInputElement>document.getElementById("exampleCheck1");
		// if (this.editForm.value.status == "1") {
		//   element.checked = true;
		// }
		// else {
		//   element.checked = false;
		// }
		openModal('#crud-countries');
	}

	onView(country) {
		this.crudName = 'View';
		this.Task = true
		this.isReadonly = true;
		this.editForm.disable();

		this.populate(country);
		// var element = <HTMLInputElement>document.getElementById("exampleCheck1");
		// if (this.editForm.value.status == "1") {
		//   element.checked = true;
		// }
		// else {
		//   element.checked = false;
		// }
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
		// console.log(event,event.target.files[0])
		if (event.target.files.length > 0) {
			this.imgToUpload1 = event.target.files[0];

		};

	}


	// accessArr = [];
	onSubmit() {

		console.log("this.editForm.value", this.editForm.value);

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
			console.log('1111')
			formData.append('first_name', this.editForm.value.first_name);
			formData.append('last_name', this.editForm.value.last_name);
			formData.append('loginname', this.editForm.value.loginname);
			formData.append('email', this.editForm.value.email);
			formData.append('process', this.editForm.value.process);
			formData.append('department', this.editForm.value.department);
			formData.append('tasking', this.editForm.value.tasking);
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
			console.log('22222')
			formData.append('first_name', this.editForm.value.first_name);
			formData.append('last_name', this.editForm.value.last_name);
			formData.append('loginname', this.editForm.value.loginname);
			formData.append('email', this.editForm.value.email);
			formData.append('rankCode', this.editForm.value.rank_code);
			formData.append('process', this.editForm.value.process);
			formData.append('department', this.editForm.value.department);
			formData.append('tasking', this.editForm.value.tasking);
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
			// ...user_role

		}
		if (formVal.id != '' && formVal.id != null)
			delete formVal.password;

		if (this.editForm.valid) {
			this.api
				.postAPI(
					environment.API_URL + "api/auth/users/crud",
					formData

					// formVal
				)
				.subscribe((res) => {
					if (res.status == environment.SUCCESS_CODE) {
						// this.logger.log('Formvalue',this.editForm.value);
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
		// this.moduleAccess = this.api.getPageAction();
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
		// console.log(event,event.target.files[0])
		if (event.target.files.length > 0) {
			this.imgToUpload = event.target.files[0];

		};

	}

	Submit() {
		const formData = new FormData();
		const file = this.fileInput.nativeElement.files[0];
		
		if (this.importform.valid) {
			formData.append('file_upload', file);
			this.api.postAPI(environment.API_URL + "access/user_role/import",formData)
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
		// closeModal('#import');
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
		//this.crudName = "Add";
		//this.isReadonly=false;

		//var element = <HTMLInputElement>document.getElementById("exampleCheck1");
		// element.checked = true;
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
