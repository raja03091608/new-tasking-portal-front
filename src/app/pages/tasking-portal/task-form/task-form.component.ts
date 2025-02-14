import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from '../../../../environments/environment.prod';
import { ApiService } from '../../../service/api.service';
import { Dialog } from 'primeng/dialog';
import { ConfirmationService, MessageService } from "primeng/api";
import { MatRadioChange } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { language } from '../../../../environments/language';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-task-form',

  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  providers:[MessageService]
})
export class TaskFormComponent implements OnInit {

  @ViewChild('dialog') dialog: Dialog;

  visible = false;
  sdForm: FormGroup;
  apsoForm: FormGroup;
  weseeForm: FormGroup;
  allocateForm: FormGroup;
  dgweseeForm: FormGroup;
  deeForm: FormGroup;
  pdDeeForm: FormGroup;
  acomForm: FormGroup;
  comForm: FormGroup;
  minitingForm: FormGroup;
  formGroup: FormGroup;
  files = {
    file1: null as File | null,
    file2: null as File | null,
    file3: null as File | null,
    file4: null as File | null,
    file5: null as File | null,
    file6: null as File | null,
    file7: null as File | null,
    file8: null as File | null,
    file9: null as File | null,
  };
  public permission = {
    add: false,
    edit: false,
    view: false,
    delete: false,
    recommend: true,
  };
  gridColum = [
    { field: 'sponsoring_directorate', header: 'Sponsoring Directorate', filter: true, filterMatchMode: 'contains' },
    { field: 'task_name', header: 'Task Name', filter: true, filterMatchMode: 'contains' },
    { field: 'tasking_status', header: 'Status', filterMatchMode: 'contains', filter: false, }
  ]
  SubmitAccess={
    formPermission1:true,
    formPermission2:false,
    formPermissionTasking:false,
    formPermission3:false,
    formPermission4:false,
    formPermission5:false,
    formPermission6:false,
    formPermission7:false,
    formPermission8:false,
    commentPermission:false,
    
  }
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    
    minHeight: '10rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter description here...',
    defaultParagraphSeparator: '',
    defaultFontName: 'Arial',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
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
      ['fontSize', 'toggleEditorMode', 'customClasses']
    ]

  };
  usersList = []
  taskingGroups=[];
  rowDataStatus=[]
  taskList=[]
  // rowData:any;
  processList: any
  userRoleListFrom: any
  userRoleListTo: any
  userroleList: any;
  userList: any;
  moduleAccess: any;
  token_detail: any;
  constructor(private fb: FormBuilder, private api: ApiService,private messageService: MessageService,private conFdialog: MatDialog,) { 
    this.token_detail = this.api.decryptData(localStorage.getItem('token-detail'));
  }

  ngOnInit(): void {
    this.token_detail = this.api.decryptData(localStorage.getItem('token-detail'));
    this.getAccess()
    this.initializeForms();
    this.getTasking()
    
  }
  getTasking(){
    this.taskList=[];
    let url=environment.API_URL+"transaction/tasking?order_type=desc&page=4";
    if(this.token_detail.process_id == 2 && this.token_detail.role_id == 3)
         url+=`&created_by_id=${this.token_detail.user_id}`

    this.api.getAPI(url).subscribe(res=>{
      this.taskList=res.results;
    });
  }
  
  showModal(): void {
    this.visible = true;
  }

  hideModal(): void {
    this.visible = false;
  }

  onEditRow(rowData){
    // this.rowData=rowData
    this.onEditRole(rowData);
    this.apiCall();
    this.getTaskingGroups()
    this.getMiniting();
    this.getStatusTimeline();
    this.setFormData()
    this.getSignatureData()
    this.editorConfig.editable=false;
    if(this.rowData && this.rowData.assigned_tasking_group &&this.rowData.assigned_tasking_group?.tasking_group)
        this.getTaskingUser({value:this.rowData.assigned_tasking_group?.tasking_group})
    // this.disableAllForms()
    this.showModal()
  }
  onViewRow(rowData){
    this.setFormData()
    this.getSignatureData()
    if(this.rowData && this.rowData.assigned_tasking_group &&this.rowData.assigned_tasking_group?.tasking_group)
        this.getTaskingUser({value:this.rowData.assigned_tasking_group?.tasking_group})
    this.editorConfig.editable=false;
    this.disableAllForms()

    
  }
  onDelete(id) {
    let dialogRef = this.conFdialog.open(ConfirmationDialogComponent, {   width: '350px',   data: language[environment.DEFAULT_LANG].confirmMessage   });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.postAPI(environment.API_URL + "transaction/tasking/crud", { id: id,status: 3, }).subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'tasking ' + language[environment.DEFAULT_LANG].deleteMsg || "Task Delete Successfully" });
              this.getTasking();
          } else {    this.messageService.add({ severity: 'error', summary: 'Error', detail: language[environment.DEFAULT_LANG].unableDelete || "Unable To delete Task" });}
        });
      }
      dialogRef = null;
    });
  }

  getAccess() {
    this.moduleAccess = this.api.getPageAction();

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
  initializeForms(): void {
    this.sdForm = this.fb.group({
      sponsoring_directorate: ['', Validators.required],
      SD_comments: [''],
      task_name: [''],
      task_description: ['']
    });

    this.apsoForm = this.fb.group({
      comments_of_apso: ['', Validators.required]
    });

    this.weseeForm = this.fb.group({
      cost_implication: ['', Validators.required],
      time_frame_for_completion_month: ['', Validators.required],
      comments_of_tasking_group: ['', Validators.required]
    });
    this.allocateForm = this.fb.group({
      tasking_group: ['', Validators.required],
      tasking_user: ['', Validators.required],
    });
    this.dgweseeForm = this.fb.group({
      comments_of_wesee: ['', Validators.required]
    });

    this.deeForm = this.fb.group({
      task_number_dee0: ['', Validators.required],
      task_number_dee1: ['', Validators.required],
      task_number_dee2: ['', Validators.required],
      comments_of_dee: ['', Validators.required]
    });
    this.pdDeeForm = this.fb.group({
      comments_of_pd_dee: ['', Validators.required]
    });

    this.acomForm = this.fb.group({
      recommendation_of_acom_its: ['', Validators.required]
    });

    this.comForm = this.fb.group({
      approval_of_com: ['', Validators.required]
    });
    this.minitingForm = this.fb.group({
      comment: [''],
    })
    this.formGroup = this.fb.group({
      taskId: [{ value: '', disabled: true }],
      current_id: [''],
      next_user_id: [''],
      process: [''],
      userTypeFrom: [],
      userTypeTo: [],
    });
  }
  disableAllForms(): void {
    this.sdForm.disable();
    this.apsoForm.disable();
    this.weseeForm.disable();
    this.allocateForm.disable();
    this.dgweseeForm.disable();
    this.deeForm.disable();
    this.pdDeeForm.disable();
    this.acomForm.disable();
    this.comForm.disable();
  }
  
  enableAllForms(): void {
    this.sdForm.enable();
    this.apsoForm.enable();
    this.weseeForm.enable();
    this.allocateForm.enable();
    this.dgweseeForm.enable();
    this.deeForm.enable();
    this.pdDeeForm.enable();
    this.acomForm.enable();
    this.comForm.enable();
  }
  onFileSelected(event: Event,key): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    this.files['file'+key] = input.files[0]; 
    console.log('Selected file:'+key,  this.files['file'+key] );
  }
  removeFile(key:string){    this.rowData[key]=null;  }
  getFileNameFromUrl(url: string): string {    return url ? url.substring(url.lastIndexOf('/') + 1) : '';}
  getSignatureData() { this.api.getAPI(environment.API_URL + "transaction/trials_status?tasking_id=" + this.rowData.id).subscribe((res) => { this.rowDataStatus = res.data;})}
  getTaskingUser(event) { this.api.getAPI(environment.API_URL + `api/auth/users?tasking_id=${event?.value}`).subscribe(res => { this.usersList = res  })  }
  getTaskingGroups() { this.api.getAPI(environment.API_URL + "master/taskinggroups").subscribe((res) => {  this.taskingGroups = res.data;  }); }
  

  handlePagination(pageEvent: any) {
    console.log('Pagination triggered with event:', pageEvent);
  }


  onSubmitSD(): void {
    this.showConfirm();
    if(this.lastStatusData <= this.rowData.level ){
      return;
    }
    if (this.sdForm.valid) {
      const formData = new FormData();

      
      formData.append('sponsoring_directorate', this.sdForm.value.sponsoring_directorate);
      formData.append('id', this.rowData.id+"");
      formData.append('SD_comments', this.sdForm.value.SD_comments);
      formData.append('task_name', this.sdForm.value.task_name);
      formData.append('task_description', this.sdForm.value.task_description);
      formData.append('status', '1');
      
      // Append files if they exist
      if (this.files.file1) {
        formData.append('files', this.files.file1);
      }
      if (this.files.file2) {
        formData.append('files1', this.files.file2);
      }
      if (this.files.file3) {
        formData.append('files2', this.files.file3);
      }
      if (this.files.file4) {
        formData.append('files3', this.files.file4);
      }
      if (this.files.file5) {
        formData.append('files4', this.files.file5);
      }
      
      

      console.log('SD Payload:', formData);

      this.api.postAPI(environment.API_URL + 'transaction/tasking/crud', formData).subscribe(
        response => {
          console.log('SD Form submitted successfully:', response);
        },
        error => {
          console.error('Error submitting SD form:', error);
        }
      );
    }
  }

  onSubmitAPSO(): void {
    if(this.lastStatusData <= this.rowData.level ){
      this.showConfirm();
      return;
    }
    if (this.apsoForm.valid) {
      const payload = {
        comments_of_apso: this.apsoForm.value.comments_of_apso,
        'id': this.rowData.id,
        status :1

      };

      console.log('APSO Payload:', payload);

      this.api.postAPI(environment.API_URL + 'transaction/tasking/crud', payload).subscribe(
        response => {
          console.log('APSO Form submitted successfully:', response);
        },
        error => {
          console.error('Error submitting APSO form:', error);
        }
      );
    }
  }

  onSubmitWESEE(): void {
    if(this.lastStatusData <= this.rowData.level ){
      this.showConfirm();
      return;
    }
    if (this.weseeForm.valid) {
      const formData = new FormData();
      formData.append('cost_implication', this.weseeForm.value.cost_implication);
      formData.append('time_frame_for_completion_month', this.weseeForm.value.time_frame_for_completion_month);
      formData.append('comments_of_tasking_group', this.weseeForm.value.comments_of_tasking_group);
      
      if (this.files.file6) {
        formData.append('files5', this.files.file6);
      }
      if (this.files.file7) {
        formData.append('files6', this.files.file7); 
      }

      console.log('WESEE Payload:', formData);

      this.api.postAPI(environment.API_URL + 'wesee-endpoint', formData).subscribe(
        response => {
          console.log('WESEE Form submitted successfully:', response);
        },
        error => {
          console.error('Error submitting WESEE form:', error);
        }
      );
    }
  }

  onallocateSubmit(): void {
    if (this.allocateForm.valid) {
      const payload = {
        tasking_group: this.allocateForm.value.tasking_group,
        tasking_user: this.allocateForm.value.tasking_user,
        id: this.rowData.id,
        status :1

      };

      console.log('Allocate Payload:', payload);

      this.api.postAPI(environment.API_URL + 'transaction/tasking/crud', payload).subscribe(
        response => {
          console.log('Allocate Form submitted successfully:', response);
        },
        error => {
          console.error('Error submitting Allocate form:', error);
        }
      );
    }
  }

  onSubmitDGWESEE(): void {
    if(this.lastStatusData <= this.rowData.level ){
      this.showConfirm();
      return;
    }
    if (this.dgweseeForm.valid) {
      const payload = {
        comments_of_wesee: this.dgweseeForm.value.comments_of_wesee,
        id:this.rowData.id,
        status :1

      };

      console.log('DG WESEE Payload:', payload);

      this.api.postAPI(environment.API_URL + 'transaction/tasking/crud', payload).subscribe(
        response => {
          console.log('DG WESEE Form submitted successfully:', response);
        },
        error => {
          console.error('Error submitting DG WESEE form:', error);
        }
      );
    }
  }

  onSubmitDEE(): void {
    if(this.lastStatusData <= this.rowData.level ){
      this.showConfirm();
      return;
    }
    if (this.deeForm.valid) {
      const formData = new FormData();
      formData.append('task_number_dee', `WESEE/${this.deeForm.value.task_number_dee0}/${this.deeForm.value.task_number_dee1}/${this.deeForm.value.task_number_dee2}`);
      formData.append('comments_of_dee', this.deeForm.value.comments_of_dee);
      formData.append('id', this.rowData.id+"");
      formData.append('status', "1");

      if (this.files.file8) {
        formData.append('files2', this.files.file8);
      }
      if (this.files.file9) {
        formData.append('files3', this.files.file9);
      }
      
      console.log('DEE Payload:', formData);

      this.api.postAPI(environment.API_URL + 'transaction/tasking/crud', formData).subscribe(
        response => {
          console.log('DEE Form submitted successfully:', response);
        },
        error => {
          console.error('Error submitting DEE form:', error);
        }
      );
    }
  }

  onSubmitPdDEE(): void {
    if(this.lastStatusData <= this.rowData.level ){
      this.showConfirm();
      return;
    }
    if (this.pdDeeForm.valid) {
      const payload = {
        comments_of_pd_dee: this.pdDeeForm.value.comments_of_pd_dee,
      id:this.rowData.id,
      status :1

      };

      console.log('PD DEE Payload:', payload);

      this.api.postAPI(environment.API_URL + 'transaction/tasking/crud', payload).subscribe(
        response => {
          console.log('PD DEE Form submitted successfully:', response);
        },
        error => {
          console.error('Error submitting PD DEE form:', error);
        }
      );
    }
  }

  onSubmitACOM(): void {
    if(this.lastStatusData <= this.rowData.level ){
      this.showConfirm();
      return;
    }
    if (this.acomForm.valid) {
      const payload = {
        recommendation_of_acom_its: this.acomForm.value.recommendation_of_acom_its,
        id:this.rowData.id,
        status :1

      };

      console.log('ACOM Payload:', payload);

      this.api.postAPI(environment.API_URL + 'transaction/tasking/crud', payload).subscribe(
        response => {
          console.log('ACOM Form submitted successfully:', response);
        },
        error => {
          console.error('Error submitting ACOM form:', error);
        }
      );
    }
  }

  onSubmitCOM(): void {
    if (this.comForm.valid) {
      const payload = {
        approval_of_com: this.comForm.value.approval_of_com,
        id:this.rowData.id,
        status :1
      };

      console.log('COM Payload:', payload);

      this.api.postAPI(environment.API_URL + 'transaction/tasking/crud', payload).subscribe(
        response => {
          console.log('COM Form submitted successfully:', response);
        },
        error => {
          console.error('Error submitting COM form:', error);
        }
      );
    }
  }
  
  getSignatureHtml(key:string ): string {
    
    const signature = this.rowDataStatus.find(country => country[key] === 1);
    
    if (!signature) {
      return ''; 
    }

    const dateString = signature.created_on
      ? new Date(signature.created_on).toLocaleString()
      : 'N/A';

    
    return `
      
        <span class="float-end">
          <i class="font-normal">Electronically Signed by:</i>
        </span>
        <br />
        <span class="float-end">
          ${signature.created_by?.rankCode || ''} 
          ${signature.created_by?.first_name || ''} 
          ${signature.created_by?.last_name || ''}
        </span>
        <br />
        <span class="float-end">
          ${signature.created_by?.department?.name || ''}, 
          ${dateString}
        </span>
      
    `;
  }
  setFormData(): void {
    this.sdForm.patchValue({
      sponsoring_directorate: this.rowData?.sponsoring_directorate || '',
      SD_comments: this.rowData?.SD_comments || '',
      task_name: this.rowData?.task_name || '',
      task_description: this.rowData?.task_description || ''
    });
    this.apsoForm.patchValue({ comments_of_apso: this.rowData?.comments_of_apso || '' });

    this.weseeForm.patchValue({
      cost_implication: this.rowData?.cost_implication || '',
      time_frame_for_completion_month: this.rowData?.time_frame_for_completion_month || '',
      comments_of_tasking_group: this.rowData?.comments_of_tasking_group || ''
    });

    this.allocateForm.patchValue({
      tasking_group: this.rowData?.assigned_tasking_group?.tasking_group || '',
      tasking_user: this.rowData?.assigned_tasking_group?.tasking_user || ''
    });

    this.dgweseeForm.patchValue({ comments_of_wesee: this.rowData?.comments_of_wesee || '' });

    const splitDee = this.rowData?.task_number_dee?.split('/') || [];
    this.deeForm.patchValue({
      task_number_dee0: splitDee[1] || '', // adjust indices as needed
      task_number_dee1: splitDee[2] || '',
      task_number_dee2: splitDee[3] || '',
      comments_of_dee: this.rowData?.comments_of_dee || ''
    });
    this.pdDeeForm.patchValue({
      // comments_of_pd_dee: this.rowData?.comments_of_pd_dee || ''
    });
    this.acomForm.patchValue({ recommendation_of_acom_its: this.rowData?.recommendation_of_acom_its || '' });
    this.comForm.patchValue({ approval_of_com: this.rowData?.approval_of_com || '' });
  }
  rowData={
    "id": 185,
    "created_by": {
        "id": 118,
        "process": 2,
        "department": 1,
        "loginname": "SPONSOR",
        "first_name": "sponsoring",
        "last_name": "directeroate",
        "email": "sd@gmail.com"
    },
    "sponsoring_directorate": "DSR",
    "task_description": "TaskToday12121TaskToday12121TaskToday12121TaskToday12121TaskToday12121TaskToday12121TaskToday12121TaskToday12121TaskToday12121TaskToday12121TaskToday12121TaskToday12121",
    "file": null,
    "file1": null,
    "file2": null,
    "file3": null,
    "file4": null,
    "file5": null,
    "file6": null,
    "file7": null,
    "file8": null,
    "cost_implication": "12345643",
    "time_frame_for_completion_days": "null",
    "comments_of_wesee": "sefd&UIB Eeifu ase97fduhqw 8aesiufhayiguskjfd",
    "task_number_dee": "WESEE/qwert/12345/12345",
    "comments_of_dee": "sefdca esifbaisKBciheskFc",
    "comments_of_tasking_group": "gjutgyrhfxyrfx",
    "recommendation_of_acom_its": null,
    "approval_of_com": "",
    "SD_initiater": 1,
    "WESEE_recommender": 1,
    "DEE_recommender": 1,
    "TS_recommender": 1,
    "DWE_recommender": null,
    "ACOM_recommender": null,
    "COM_approver": null,
    "approved_level": 2,
    "status": 1,
    "comment_status": 1,
    "level": 4,
    "legacy_attachment": null,
    "created_on": "2025-01-31T15:30:26.321029+05:30",
    "created_ip": "103.83.149.59",
    "modified_on": "2025-01-31T16:15:42.552730+05:30",
    "modified_by": "118",
    "modified_ip": null,
    "tasking_status": "DEE Recommended",
    "APSO_recommender": 1,
    "comments_of_apso": "ahsbihYIKE UIWAE FUH WUEFHWQUE IUWH IUHOUG",
    "task_name": "TaskToday12121",
    "time_frame_for_completion_month": "22",
    "details_hardware": "",
    "details_software": "",
    "details_systems_present": "",
    "ships_or_systems_affected": "",
    "legacy_data": "No",
    "completed_status": null,
    "completed_comments": null,
    "SD_comments": "",
    "history": [
        {
            "id": 45,
            "approved_role": {
                "id": 3,
                "from_ad": null,
                "name": "Initiator",
                "code": "Initiator",
                "is_biometric": false,
                "modified_on": "2022-09-19T18:44:04.752709+05:30",
                "modified_by": null,
                "modified_ip": null,
                "status": 1,
                "process": 2
            },
            "approved_by": {
                "id": 118,
                "process": {
                    "id": 2,
                    "name": "User Groups",
                    "sequence": 2
                },
                "department": {
                    "id": 1,
                    "name": "DSR",
                    "description": "DSR",
                    "code": "DSR",
                    "sequence": 1,
                    "status": 1,
                    "created_on": "2022-09-19T18:25:06.257071+05:30",
                    "created_by": "4",
                    "created_ip": "182.65.77.40",
                    "modified_on": "2023-03-15T18:04:57.461409+05:30",
                    "modified_by": "4",
                    "modified_ip": "182.65.77.40"
                },
                "password": "pbkdf2_sha256$320000$l3JVNbWXq1CqzMYdecQ1fJ$xZnakEpnRo0JecJnjzA1BfMsTHrA4uG8fP5IqA8QEqE=",
                "last_login": null,
                "loginname": "SPONSOR",
                "email": "sd@gmail.com",
                "first_name": "sponsoring",
                "last_name": "directeroate",
                "is_active": true,
                "staff": false,
                "admin": false,
                "fpdata": null,
                "verification_code": null,
                "status": 1,
                "ad_user": false,
                "hrcdf_designation": null,
                "rankCode": null,
                "tasking": null
            },
            "comments": "Initiated",
            "type": -1,
            "status": 1,
            "approved_level": 1,
            "approved_on": "2025-01-31T15:31:10.720247+05:30",
            "approved_ip": "103.83.149.59",
            "tasking": 185
        },
        {
            "id": 46,
            "approved_role": {
                "id": 15,
                "from_ad": null,
                "name": "COMBAT SYSTEMS INTEGRATION",
                "code": "CSI",
                "is_biometric": false,
                "modified_on": "2022-09-19T18:46:28.745730+05:30",
                "modified_by": null,
                "modified_ip": null,
                "status": 1,
                "process": 3
            },
            "approved_by": {
                "id": 166,
                "process": {
                    "id": 3,
                    "name": "Tasking Groups",
                    "sequence": 3
                },
                "department": {
                    "id": 2,
                    "name": "WESEE",
                    "description": "DNA",
                    "code": "WESEE",
                    "sequence": 2,
                    "status": 1,
                    "created_on": "2022-09-19T18:34:17.220684+05:30",
                    "created_by": "4",
                    "created_ip": "182.65.77.40",
                    "modified_on": "2023-03-15T18:05:07.908325+05:30",
                    "modified_by": "4",
                    "modified_ip": "182.65.77.40"
                },
                "password": "pbkdf2_sha256$320000$GO3etdnqlytz4OQQjbJ1t3$+MXsfPdoLLVoR1voLA+8kqTwT4KCTWUzDxQWngyY9sA=",
                "last_login": null,
                "loginname": "CSI",
                "email": "csi@gmail.com",
                "first_name": "csi",
                "last_name": "task group",
                "is_active": true,
                "staff": false,
                "admin": false,
                "fpdata": null,
                "verification_code": null,
                "status": 1,
                "ad_user": false,
                "hrcdf_designation": null,
                "rankCode": "Cdr",
                "tasking": 6
            },
            "comments": "gjutgyrhfxyrfx",
            "type": -1,
            "status": 1,
            "approved_level": 1,
            "approved_on": "2025-01-31T15:53:45.798091+05:30",
            "approved_ip": "103.83.149.59",
            "tasking": 185
        }
    ],
    "assigned_tasking_group": {
        "id": 176,
        "tasking_group": 6,
        "tasking_user": 199,
        "created_by": 119,
        "created_role": 4
    },
    "project_status": [],
    "trial_status": {
        "id": 1083,
        "created_by_id": 193
    }
}




 

  roles: any = [];
  routeList: any = [];
  lastStatusData:any;
  minitingList=[]
  getStatusTimeline() {
    this.roles = [];
    this.routeList = [];
    let temp = [];
    this.api.getAPI(environment.API_URL + `transaction/process-flows/details/?tasking_id=${this.rowData.id}`).subscribe({
      next: (res) => {
        temp = res;
        this.roles.push(temp[0]);
        this.routeList = res;
        this.lastStatusData = res[res.length - 1]?.sequence;
      },
      error: (err) => {        console.error('Error fetching data:', err);      }
    });
  }
  getMiniting() {
    this.minitingList=[]
    this.api.getAPI(environment.API_URL + `transaction/comments?tasking_id=${this.rowData.id}`).subscribe(res => {
      this.minitingList = res.data;
    })
  }

  saveMiniting() {

    if(this.lastStatusData <= this.rowData.level ){
      this.showConfirm();
      return;
    }
    const formData = this.minitingForm.value;

    const newComment = {
      tasking: this.rowData.id,
      id: '',
      comments: formData.comment,
      created_on: new Date(),
      created_by: localStorage.getItem('user_id'),
      recommendation_status: 1
    };
    this.api.postAPI(environment.API_URL + `transaction/comments/crud`, newComment).subscribe(res => {
      this.getMiniting();
      this.getStatusTimeline();
     
    })
    this.minitingForm.reset();

  }
  showConfirm() {
    this.messageService.clear();
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Configure Route', detail: 'Please configure route before submitting your response' });
  }
  releDetaile:any
onEditRole(rowData) {
    this.api.getAPI(environment.API_URL + `transaction/current-status/${rowData.id}/?user=${this.api.userid.user_id}`).subscribe((res) => {
      this.releDetaile=res })
  }
  displayModal=false
  openBackDropCustomClass() {
   this.displayModal=true
    this.messageService.clear('c');
  }

  timelineStepName(step: any): string {
    const roleName = step?.next_user?.roles[0]?.user_role?.name;
    return ` (${roleName})`;
  }
  timelineStepDirect(step: any): string {
    const directorate = step?.next_user?.department?.name;
    return `${directorate}`;
  }
  timelineStepNameCurrent(step: any): string {
    const roleName = step?.current?.roles[0]?.user_role?.name;
    return ` (${roleName})`;
  }
  timelineStepDirectCurrent(step: any): string {
    const directorate = step?.current?.department?.name;
    return `${directorate}`;
  }


  getUser() {
    this.api.getAPI(environment.API_URL + `access/access_user_roles?process_id=2`).subscribe(res => {
      this.userroleList = res.data;

    })
  }
  isMainUser:boolean;
  onUserTypeChange(event: MatRadioChange) {
    this.isMainUser = event.value === 'main';
    if (!this.isMainUser) {
      this.api.getAPI(environment.API_URL + `master/department`).subscribe(res => {
        this.directList = res.data;
      
      })
    }
  }
  isMainUserTo:boolean;
  onUserTypeChangeTo(event: MatRadioChange) {
    this.isMainUserTo = event.value === 'main';
    if (!this.isMainUserTo) {
      this.api.getAPI(environment.API_URL + `master/department`).subscribe(res => {
        this.directList = res.data;
      
      })
    }
  }
  
  onSelectChangeRoleFrom(event: any) {
    this.api.getAPI(environment.API_URL + `api/auth/users?process_id=2&userrolemapping__user_role=18&department_id=${event.value}`).subscribe(res => {
      this.userList = res.data;

    })
  }
  directList: any;
  onSelectChangeRole(event: any) {

    this.api.getAPI(environment.API_URL + `api/auth/users?process_id=2&userrolemapping__user_role=${event.value}`).subscribe(res => {
      this.userList = res.data;
    })
  }
  userListTo: any;
  
  onSelectChangeRoleTo(event: any) {
    const selectedUserRole = event.value;
    
      this.api.getAPI(environment.API_URL + `api/auth/users?process_id=2&userrolemapping__user_role=${selectedUserRole}`).subscribe(res => {
        this.userListTo = res.data;

      })
    
  }
  onSelectDirectrate(event: any) {
    this.api.getAPI(environment.API_URL + `api/auth/users?process_id=2&userrolemapping__user_role=18&department_id=${event.value}`).subscribe(res => {
      this.userListTo = res.data;

    })
  }
  onSubmitRoute() {
    const formData = this.formGroup.value;

    const newComment = {
      tasking: this.rowData.id,
      id: '',
      process: 2,
      current_id: this.formGroup.get('current_id').value,
      next_user_id: this.formGroup.get('next_user_id').value, //loginname
    };
    this.api.postAPI(environment.API_URL + `transaction/process-flows/details/`, newComment).subscribe(res => {
      this.getStatusTimeline()
      this.hideModal()
      // this.modalService.dismissAll("Close")
    })
    let taskId = this.formGroup.get('taskId').value
    this.formGroup.reset();
    this.formGroup.get('taskId').setValue(taskId)
  }

  apiCall() {
    this.api.getAPI(environment.API_URL + '/access/access_user_roles?process_id=2').subscribe((res) => {
     if(this.rowData.APSO_recommender===3){
        this.userRoleListFrom = res.data.filter(role => role.id !== 18 && role.id !== 14);
        this.userRoleListTo = res.data.filter(role => role.id !== 18 && role.id !== 3  && role.id !== 14);

      }else{

        this.userRoleListFrom = res.data.filter(role => role.id !== 18);
        this.userRoleListTo = res.data.filter(role => role.id !== 18 && role.id !== 3);
      }

    })

  }
  handleDelete(_t604: any) {
    throw new Error('Method not implemented.');
    }
    handleEdit(_t604: any) {
    throw new Error('Method not implemented.');
    }

    showSuccess() {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }

}

