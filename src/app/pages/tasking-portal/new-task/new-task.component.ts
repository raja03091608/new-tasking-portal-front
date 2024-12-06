import { Component, OnInit, ViewChild, Input, ElementRef, TemplateRef, inject } from "@angular/core";
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective, AbstractControl, FormBuilder } from "@angular/forms";
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
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";


declare function closeModal(selector):any;
declare function openModal(selector):any;
declare function triggerClick(selector):any;
declare var moment:any;
@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {
  currentYear = new Date().getFullYear();
  currentDate1 = new Date();
  private modalService = inject(NgbModal);


  displayedColumns: string[] = [
    "sponsoring_directorate",
    "task_description",
    "file",
    "wesee",
    "dee",
    "dwe",
    "com",
     "recommend",
     "approval",
    "view",
    "edit",
    "delete",

  ];
  dataSource: MatTableDataSource<any>;
  formGroup:FormGroup
  country: any;
  image: any;
  public crudName = "Save";
  public countryList = [];
  filterValue:any;
  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;
  moment=moment;
  selectedValue:string[];
  showError:boolean=false;
  timeline=[{id:1,name:"Initiator"},{id:2,name:"APSO"},{id:3,name:"DG WESEE"},{id:4,name:"DEE"},{id:5,name:"ACOM"},{id:6,name:"Approver"}]
  type=[{id:'day',name:"Day"},{id:'month',name:"Month"},{id:'year',name:"Year"}];

  public permission={
    add:true,
    edit:true,
    view:true,
    delete:true,
    recommend:true,
  };

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild('selectSD') selectSD: MatSelect;
	task_number_dee: boolean;
	sponsoring_directorate: boolean;
	editForm: any;
  currentTaskId: any;
  public taskForm:FormGroup;

  constructor(public api: ApiService, private notification : NotificationService, private fb:FormBuilder,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService) {

      this.taskForm = new FormGroup({
        id: new FormControl(""),
    //     // sponsoring_directorate: new FormControl("",[Validators.required]),
    //     // task_description: new FormControl(""),
    //     // file: new FormControl("",[Validators.required]),
    // 	// cost_implication: new FormControl(""),
    //     // comments_of_wesee: new FormControl(""),
    //     // time_frame_for_completion: new FormControl(""),
    // 	// task_number_dee: new FormControl(""),
    //     comments_of_dee: new FormControl(""),
    // 	comments_of_dwe: new FormControl(""),
    // 	recommendation_of_acom_its:new FormControl(""),
    // 	//approval_of_com: new FormControl(""),
      status: new FormControl(""),
      legacy_data:new FormControl("No"),

    //   });


       sdForm : new FormGroup({
        sponsoring_directorate: new FormControl("",[Validators.required]),
        SD_comments : new FormControl(""),
        task_description: new FormControl('', [Validators.required, this.wordCountValidator]),
        task_name: new FormControl(""),
        details_hardware: new FormControl(""),
        details_software: new FormControl(""),
        details_systems_present: new FormControl(""),
        ships_or_systems_affected: new FormControl(""),
        file: new FormControl(""),
        file1: new FormControl(""),
        file2: new FormControl(""),
        file3: new FormControl(""),
        file4: new FormControl(""),


      }),
      apsoForm : new FormGroup({
      comments_of_apso:new FormControl(""),
    }),
    weseeForm : new FormGroup({
          id: new FormControl(""),
          cost_implication: new FormControl(""),
         comments_of_wesee: new FormControl(""),
         time_frame_for_completion_days: new FormControl(""),
         time_frame_for_completion_month: new FormControl(""),
      }),
    deeForm : new FormGroup({
        task_number_dee: new FormControl(""),
        task_number_dee1: new FormControl(""),
        task_number_dee2: new FormControl(""),
        comments_of_dee: new FormControl(""),
      }),
    acomForm : new FormGroup({
      recommendation_of_acom_its:new FormControl(""),
    }),
    comForm : new FormGroup({
      approval_of_com: new FormControl(""),
    })
    });
  }

  editorConfig: AngularEditorConfig = {
    editable:true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter description here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
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
    ['fontSize','toggleEditorMode','customClasses']
  ]

};

get remainingCharacters(): number {
  const wordLimit = 500; // Set your desired word limit
  const words = this.taskForm.get('sdForm.task_description').value.split(' ');
  return words.length;
}

txtwordCount = 0;
wordCountValidator = (control: FormControl) => {
  const txtwordCount = control.value.split(' ').length;
  // console.log('txtwordCount',txtwordCount);
  if (txtwordCount > 200) {
    return {
      wordCountError: 'The word count must be greater than 200.'
    };
  }
  return null;
};


taskList:any
processList:any
userRoleList:any
formInit(){
  this.formGroup = this.fb.group({
      taskId: [''],
      process: [''],
      level: [''],
      userRoleId:['']
  });
}
// const description = new FormControl(this.taskForm.get('sdForm.task_description').value, WordCountValidators.min(3));
//     public dweForm = new FormGroup({
//      comments_of_dwe: new FormControl(""),
//     });
//     public comForm = new FormGroup({
//     recommendation_of_acom_its:new FormControl(""),
//      approval_of_com: new FormControl(""),
//   });
//   public approvalForm = new FormGroup({
//     approved_level: new FormControl(""),
//     comments: new FormControl("",[Validators.required]),
//     status: new FormControl(""),
//     approved_role_id: new FormControl(this.api.userid.role_id,[Validators.required]),

//   });
//status = this.taskForm.value.status;

  populate(data) {
    this.taskForm.patchValue(data);
    // this.weseeForm.patchValue(data);
    // this.deeForm.patchValue(data);
    // this.dweForm.patchValue(data);
    // this.comForm.patchValue(data);
    //this.taskForm.patchValue({modified_by:this.api.userid.user_id});
    //this.weseeForm.patchValue({modified_by:this.api.userid.user_id});

  }

  // wordlimit=''
  // checkWordLimit() {

  //   // const editorValue:any = this.taskForm.get('sdForm.task_description').value;
  //   const wordCount = this.wordlimit.split(/\s+/).length;
	// // console.log(this.wordlimit.length)
  //   if (wordCount > 2) {
	// console.log("hlo")
  //    this.taskForm.get('sdForm.task_description').setErrors({ wordLimitExceeded: true });
  //   } else {
  //    this.taskForm.get('sdForm.task_description').setErrors(null);
  //   }
  // }

  initForm() {
    this.taskForm.patchValue({
      status: "1",
    });

  }

  // Error = (controlName: string, errorName: string) => {
  //   return this.taskForm.controls[controlName].hasError(errorName);
  // };
//   sdError = (controlName: string, errorName: string) => {
//     return this.sdForm.controls[controlName].hasError(errorName);
//   };
//   weseeError = (controlName: string, errorName: string) => {
//     return this.weseeForm.controls[controlName].hasError(errorName);
//   };
//   deeError = (controlName: string, errorName: string) => {
//     return this.deeForm.controls[controlName].hasError(errorName);
//   };
//   dweError = (controlName: string, errorName: string) => {
//     return this.dweForm.controls[controlName].hasError(errorName);
//   };
//   comError = (controlName: string, errorName: string) => {
//     return this.comForm.controls[controlName].hasError(errorName);
//   };
//   ErrorApproval = (controlName: string, errorName: string) => {
//     return this.approvalForm.controls[controlName].hasError(errorName);
//   };

  initiator_active='';
  apso_active='';
  wesee_active='';
  dgwesee_active='';
  acom_active='';
  dee_active='';
  com_active='';
  token_detail:any;
  current_taskingID='';
  SDFORM=false;

  ngOnInit(): void {
    this.formInit();
    this.token_detail=this.api.decryptData(localStorage.getItem('token-detail'));
    //  this.getTasking();
     this.getAccess();
     this.getInitator()

    if(this.api.userid.role_center[0].user_role.code!='Initiator' && this.token_detail.process_id==2){
      this.SDFORM=true;
    }
    else if(this.token_detail.tasking_id=='' || this.token_detail.tasking_id==null && this.token_detail.process_id==3){

      this.SDFORM=true;
    }


	//  if(this.SDFORM==true)this.taskForm.get('sdForm').disable();

	 if(this.api.userid.role_center[0].user_role.code!='APSO')this.taskForm.get('apsoForm').disable();
	 if(this.api.userid.role_center[0].user_role.code!='WESEE')this.taskForm.get('weseeForm').disable();
	 if(this.api.userid.role_center[0].user_role.code!='DEE')this.taskForm.get('deeForm').disable();
	 if(this.api.userid.role_center[0].user_role.code!='ACOM')this.taskForm.get('acomForm').disable();
	 if(this.api.userid.role_center[0].user_role.code!='APP')this.taskForm.get('comForm').disable();




   if(this.SDFORM==false && this.current_taskingID=='')this.initiator_active='active';
	//  if(this.api.userid.role_center[0].user_role.code=='APSO')this.apso_active='active';
   if(this.token_detail.tasking_id!=null && this.current_taskingID!='')this.wesee_active='active';
	//  if(this.api.userid.role_center[0].user_role.code=='WESEE')this.dgwesee_active='active';
	//  if(this.api.userid.role_center[0].user_role.code=='DEE')this.dee_active='active';
	//  if(this.api.userid.role_center[0].user_role.code=='ACOM')this.acom_active='active';
	//  if(this.api.userid.role_center[0].user_role.code=='APP')this.com_active='active';
  }

  // getTasking() {
	// this.taskForm.get('sdForm').patchValue({
	// 	sponsoring_directorate: "",
	// 	task_description: "",
  //   SD_comments:"",
  //   task_name:"",
	// 	file: "",
  //   file1: "",
	// 	file2: "",
	// 	file3: "",
	// 	file4: "",
  //   details_hardware: "",
  //   details_software: "",
  //   details_systems_present: "",
  //   ships_or_systems_affected:""
	// });
  //   this.api
  //     .getAPI(environment.API_URL + "transaction/tasking")
  //     .subscribe((res) => {
  //       this.dataSource = new MatTableDataSource(res.data);
  //       this.countryList = res.data;
  //       this.dataSource.paginator = this.pagination;
	// 	//this.country=this.countryList;


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

  create() {
    this.crudName = "Save";
    this.isReadonly=false;
    this.taskForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }

  }


//   updatewesee(country) {
//     this.crudName = "Save";
//     this.isReadonly=false;
//     this.weseeForm.enable();
//     this.id=country.id;
//     let reset = this.formGroupDirective.resetForm();
//     if(reset!==null) {
//       this.initForm();
//     }
//   }
//   updatedee(country) {
//     this.crudName = "Save";
//     this.isReadonly=false;
//     this.deeForm.enable();
//     this.id=country.id;
//     let reset = this.formGroupDirective.resetForm();
//     if(reset!==null) {
//       this.initForm();
//     }
//   }
//   updatedwe(country) {
//     this.crudName = "Save";
//     this.isReadonly=false;
//     this.dweForm.enable();
//     this.id=country.id;
//     let reset = this.formGroupDirective.resetForm();
//     if(reset!==null) {
//       this.initForm();
//     }
//   }
//   updatecom(country) {
//     this.crudName = "Save";
//     this.isReadonly=false;
//     this.comForm.enable();
//     this.id=country.id;
//     let reset = this.formGroupDirective.resetForm();
//     if(reset!==null) {
//       this.initForm();
//     }
//   }

  editOption(country) {
    this.isReadonly=false;
    this.taskForm.enable();

    this.crudName = "Edit";
    this.populate(country);


  }

  onView(country) {
    this.crudName = 'View';
    this.isReadonly=true;

    this.populate(country);

  }

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "transaction/tasking/crud", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn('tasking '+language[environment.DEFAULT_LANG].deleteMsg);
            // this.getTasking();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }
  submitted = false;
  onSubmit() {
	this.showError=true;
	this.currentDate = new Date();
	 //this.taskForm.value.id=this.id;
   this.submitted = true

	const cValue = formatDate(this.currentDate, 'yyyy', 'en-US');
	const ccValue=formatDate(this.currentDate,'dd','en-US');
	(new Date(),'yyyy/MM/dd', 'en');
	// console.log(this.currentDate);
	// console.log(this.taskForm.get('deeForm').value.task_number_dee);
	this.taskForm.get('deeForm').value.task_number_dee;
 	if(this.taskForm.get('deeForm').value.task_number_dee!=''){
    this.taskForm.get('deeForm').value.task_number_dee='WESEE/'+this.taskForm.get('deeForm').value.task_number_dee+'/'+this.taskForm.get('deeForm').value.task_number_dee1+'/'+this.taskForm.get('deeForm').value.task_number_dee2
	 	}

//  if(this.taskForm.get('sdForm').value.sponsoring_directorate!=''){

// 	this.taskForm.get('sdForm').value.sponsoring_directorate='IHQ MOD(N)/'+this.api.userid.first_name;
// 	  }

    //this.taskForm.value.sponsoring_directorate='IHQ MOD(N)/'+this.taskForm.value.sponsoring_directorate;
    //this.taskForm.value.created_by = this.api.userid.user_id;
   //this.taskForm.value.status = this.taskForm.value.status==true ? 1 : 2;
    const formData = new FormData();
    formData.append('sponsoring_directorate', localStorage.getItem('sponsoring_directorate'));

    formData.append('SD_comments', this.taskForm.get('sdForm').value.SD_comments);
    formData.append('task_description', this.taskForm.get('sdForm').value.task_description);
    formData.append('task_name', this.taskForm.get('sdForm').value.task_name);
    // formData.append('details_hardware', this.taskForm.get('sdForm').value.details_hardware);
    // formData.append('details_software', this.taskForm.get('sdForm').value.details_software);
    // formData.append('details_systems_present', this.taskForm.get('sdForm').value.details_systems_present);
    // formData.append('ships_or_systems_affected', this.taskForm.get('sdForm').value.ships_or_systems_affected);
    formData.append('id', this.taskForm.value.id);
    formData.append('legacy_data', this.taskForm.value.legacy_data);
	if(this.imgToUpload !=null){
		formData.append('file', this.imgToUpload)
	  }
  if(this.imgToUpload2 !=null){
      formData.append('file1', this.imgToUpload2)
    }
  if(this.imgToUpload3 !=null){
        formData.append('file2', this.imgToUpload3)
    }
  if(this.imgToUpload4 !=null){
          formData.append('file3', this.imgToUpload4)
    }
  if(this.imgToUpload5 !=null){
            formData.append('file4', this.imgToUpload5)
    }
    //formData.append('file', this.imgToUpload);
	// formData.append('cost_implication', this.taskForm.get('weseeForm').value.cost_implication);
	// formData.append('time_frame_for_completion_days', this.taskForm.get('weseeForm').value.time_frame_for_completion_days);
	// formData.append('time_frame_for_completion_month', this.taskForm.get('weseeForm').value.time_frame_for_completion_month);
  // formData.append('comments_of_wesee', this.taskForm.get('weseeForm').value. comments_of_wesee);
	// formData.append('task_number_dee', this.taskForm.get('deeForm').value. task_number_dee);
	// formData.append('comments_of_dee', this.taskForm.get('deeForm').value. comments_of_dee);
	// formData.append('recommendation_of_acom_its', this.taskForm.get('acomForm').value. recommendation_of_acom_its);
	formData.append(' approval_of_com', this.taskForm.get('comForm').value.  approval_of_com);

    //formData.append('created_by', this.taskForm.value.created_by);
    formData.append('modified_by', this.api.userid.user_id);
    console.log('OUT');

     if (this.taskForm.get('sdForm')) {
      //formData.append('id', this.editForm.value.id);
      console.log('IN');

      this.api
        .postAPI(
          environment.API_URL + "transaction/tasking/crud",
          formData,
        )
        .subscribe((res) => {
          if(res.status==environment.SUCCESS_CODE){
            this.currentTaskId= res.data.id;

            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            // this.getTasking();
            this.router.navigate(['/tasking-portal/task-list'])
            this.closebutton.nativeElement.click();
          } else if(res.status==environment.ERROR_CODE) {
              this.notification.warn(res.message);
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

// onweseeSubmit(){
//   this.weseeForm.value.id=this.id;
//  console.log(this.weseeForm.value)

//   if (this.weseeForm.valid) {
//    // this.weseeForm.value.created_by = this.api.userid.user_id;
//     //this.weseeForm.value.status = this.weseeForm.value.status==true ? 1 : 2;
//     //console.log("Editform",this.editForm.value.id)

//     this.api
//       .postAPI(
//         environment.API_URL + "transaction/tasking/crud",
//         this.weseeForm.value,

//       )
//       .subscribe((res) => {
//         this.logger.log('response',res);
//         //this.error= res.status;
//         if(res.status==environment.SUCCESS_CODE){
//           // this.logger.log('Formvalue',this.editForm.value);
//           this.notification.success(res.message);
//           this.getTasking();
//           this.closebutton.nativeElement.click();
//         } else if(res.status==environment.ERROR_CODE) {
//           this.error_msg=true;
//           this.ErrorMsg=res.message;
//           setTimeout(()=> {
//             this.error_msg = false;
//          }, 2000);
//         } else {
//           this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
//         }

//       });
//   }
// }

currentDate = new Date();



  getAccess() {
    //this.moduleAccess=this.api.getPageAction();
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
      // this.getTasking();
    }
  }
  selectedTrial:any;
  openCurrentStatus(tasking){
    this.selectedTrial=tasking;
    openModal('#trial-status-modal');
  }


  imgToUpload: File | null = null;
  onImageHandler(event) {
    if (event.target.files.length > 0) {
      this.imgToUpload= event.target.files[0];
     };

    }

    imgToUpload2: File | null = null;
    onImageHandler2(event) {
      if (event.target.files.length > 0) {
        this.imgToUpload2= event.target.files[0];
       };

      }
      imgToUpload3: File | null = null;
      onImageHandler3(event) {
        if (event.target.files.length > 0) {
          this.imgToUpload3= event.target.files[0];
         };

        }
        imgToUpload4: File | null = null;
        onImageHandler4(event) {
          if (event.target.files.length > 0) {
            this.imgToUpload4= event.target.files[0];
           };

          }

          imgToUpload5: File | null = null;
          onImageHandler5(event) {
            if (event.target.files.length > 0) {
              this.imgToUpload5= event.target.files[0];
             };

            }

cancelmodal(){
	closeModal('#crud-countries');
  }

  initatorList = []
  getInitator() {
    this.api.getAPI(environment.API_URL + "master/sponsoring_directorate?status=1").subscribe((res) => {
      this.initatorList = res.data;
      console.log('this.initatorList',this.initatorList)
    });
  }
  showSD=false;
  optionClick(data) {
    if(data=='Others')
      this.showSD = true;
    else
      this.showSD = false;
   }

  div1:boolean=true;
  div2:boolean=false;
  div3:boolean=false;
  div4:boolean=false;
  div5:boolean=false;



  div1Function(){
      this.div1=true;
      this.div2=true;
      this.div3=false;
      this.div4=false;
      this.div5=false;

  }

  div2Function(){
      this.div2=true;
      this.div1=true;
      this.div3=true;
      this.div4=false;
      this.div5=false;
  }

  div3Function(){
      this.div3=true;
      this.div2=true;
      this.div1=true;
      this.div4=true;
      this.div5=false;
  }

  div4Function(){
    this.div3=true;
    this.div2=true;
    this.div1=true;
    this.div4=false;
    this.div5=true;
}
div5Function(){
  this.div3=true;
  this.div2=true;
  this.div1=true;
  this.div4=true;
  this.div5=true;
}

div6Function(){
  this.div2=false;
  this.div1=true;
  this.div3=false;
  this.div4=false;
  this.div5=false;
}

div7Function(){
  this.div1=true;
  this.div2=true;
  this.div3=false;
  this.div4=false;
  this.div5=false;

}

div8Function(){
  this.div1=true;
  this.div2=true;
  this.div3=true;
  this.div4=false;
  this.div5=false;

}

div9Function(){
  this.div1=true;
  this.div2=true;
  this.div3=true;
  this.div4=true;
  this.div5=false;

}
atLeastOneRequired = false;
atLeastOneFieldRequiredsdForm(group: AbstractControl): { atLeastOneRequired: boolean } | null {
  const file = group.get('file');
  const file1 = group.get('file1');
  const file2 = group.get('file2');
  const file3 = group.get('file3');
  const file4 = group.get('file4');

  if (!file.value && !file1.value && !file2.value && !file3.value && !file4.value) {
    return { atLeastOneRequired: true };
  }

  return null;
}

clearFileInput(fileControlName: string) {
  this.taskForm.get(`sdForm.${fileControlName}`).setValue(null);
}


openBackDropCustomClass(content: TemplateRef<any>) {
  this.modalService.open(content, { size: 'lg' });
}

apiCall(){
  this.api.getAPI(environment.API_URL +'/access/access_user_roles' ).subscribe((res) => {
  this.userRoleList = res.data

  });
  this.api.getAPI(environment.API_URL +'/access/process' ).subscribe((res) => {
  this.processList = res.data

  });
  this.api.getAPI(environment.API_URL +'/access/access_user_roles' ).subscribe((res) => {
  this.taskList = res.data

  });
}


}


