import { Component, OnInit, ViewChild, Input, ElementRef, inject, TemplateRef } from "@angular/core";
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective, FormBuilder } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { NotificationService } from "../../../service/notification.service";
import { ConfirmationDialogComponent } from "../../../confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "../../../../environments/language";
import { Router } from '@angular/router';
import { ConsoleService } from "../../../service/console.service";
import { of } from 'rxjs';
import { formatDate } from "@angular/common";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { any } from "@amcharts/amcharts5/.internal/core/util/Array";
import { Table } from "primeng/table";
import { sequence } from "@angular/animations";
import { ConfirmationService, MessageService } from "primeng/api";



declare function closeModal(selector): any;
declare function openModal(selector): any;
declare var moment: any;
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  providers: [ConfirmationService, MessageService]

})
export class TaskListComponent implements OnInit {
  currentYear = new Date().getFullYear();
  currentDate1 = new Date();
  formGroup: FormGroup
  minitingForm: FormGroup;
  routeConfigForm: FormGroup;
  private modalService = inject(NgbModal);
  displayedColumns: string[] = [
    "sponsoring_directorate",
    "task_name",
    "status",
    "view",
    "edit",
    "delete",

  ];
  dataSource: MatTableDataSource<any>;

  dataSource1: MatTableDataSource<any>;
  visible = false;
  country: any;
  image: any;
  public crudName = "Save";
  public countryList = [];
  public countryList1 = [];
  filterValue: any;
  isReadonly = false;
  moduleAccess: any;
  ErrorMsg: any;
  error_msg = false;
  //moment=moment;
  showError = false;
  moment = moment;
  pageEvent: PageEvent;
  totalLength = 0;

  type = [{ id: 'day', name: "Day" }, { id: 'month', name: "Month" }, { id: 'year', name: "Year" }];

  generatedNumber: number;
  public permission = {
    add: false,
    edit: false,
    view: false,
    delete: false,
    recommend: true,
  };

  name = 'Angular 6';
  htmlContent = '';



  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  //task_number_dee: boolean;
  //sponsoring_directorate: boolean;
  editForm: any;
  currentDate: Date;
  id: any;
  ImageUrl: string;
  ImageUrl1: string;
  ImageUrl2: string;
  ImageUrl3: string;
  ImageUrl4: string;
  ImageUrl5: string;
  ImageUrl6: string;
  ImageUrl7: string;
  ImageUrl8: string;

  importname: any;

  //comments_of_wesee: any;
  minitingList=[];
  directorateList: any;
  userroleList: any;
  userList: any;
  routeList: any;
  token_detail: any;
  allocateForm: FormGroup;
  res: any;
  constructor(public api: ApiService, private notification: NotificationService, private fb: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService,
    private dialog: MatDialog, private router: Router, private elementref: ElementRef, private logger: ConsoleService) {

    this.token_detail = this.api.decryptData(localStorage.getItem('token-detail'));
    this.allocateForm = new FormGroup({
      id: new FormControl(""),
      tasking_group: new FormControl(""),
      tasking: new FormControl(""),
      created_by: new FormControl(""),
      created_role: new FormControl(this.token_detail.role_id),
    });
  }


  editorConfig: AngularEditorConfig = {
    editable: true,
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

  commentEditor: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter Comment here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'whiteBackground',
        class: 'white-background'
      },
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
  }


  get remainingCharacters(): number {
    const wordLimit = 200; // Set your desired word limit
    const words = this.taskForm.get('sdForm.task_description').value.split(' ');
    return wordLimit - words.length;
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


  taskForm = new FormGroup({
    id: new FormControl(""),

    status: new FormControl(""),
    comment_status: new FormControl(""),
    //   });
    sdForm: new FormGroup({
      sponsoring_directorate: new FormControl("", [Validators.required]),
      SD_comments: new FormControl(""),
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
    apsoForm: new FormGroup({
      comments_of_apso: new FormControl("", [Validators.required]),
    }),
    weseeForm: new FormGroup({
      id: new FormControl(""),
      cost_implication: new FormControl(""),
      comments_of_wesee: new FormControl("", [Validators.required]),
      time_frame_for_completion_days: new FormControl(""),
      time_frame_for_completion_month: new FormControl(""),
      file5: new FormControl(""),
      file6: new FormControl(""),
    }),
    deeForm: new FormGroup({
      task_number_dee: new FormControl(""),
      task_number_dee0: new FormControl(""),
      task_number_dee1: new FormControl(""),
      task_number_dee2: new FormControl(""),
      comments_of_dee: new FormControl("", [Validators.required]),
      file7: new FormControl(""),
      file8: new FormControl(""),

    }),
    acomForm: new FormGroup({
      recommendation_of_acom_its: new FormControl("", [Validators.required]),
    }),
    comForm: new FormGroup({
      approval_of_com: new FormControl("", [Validators.required]),
    })
  });

  status = this.taskForm.value.status;
  showSD = false;
  populate(data) {

    // this.taskForm.get('sdForm').patchValue({sdForm.sponsoring_directorate: data.sponsoring_directorate.id});
    //this.taskForm.get('sdForm').patchValue(data);
    this.taskForm.get('apsoForm').patchValue(data);
    this.taskForm.get('weseeForm').patchValue(data);
    this.taskForm.get('deeForm').patchValue(data);
    this.taskForm.get('acomForm').patchValue(data);
    this.taskForm.get('comForm').patchValue(data);


    if (data.sponsoring_directorate == 'Others') {
      this.showSD = true;
      this.taskForm.patchValue({ sdForm: { SD_comments: data.SD_comments } })
    } else {
      this.showSD = false;
    }


    this.taskForm.patchValue({ sdForm: { sponsoring_directorate: data.sponsoring_directorate, task_name: data.task_name, task_description: data.task_description } })

    this.allocateForm.patchValue({
      tasking_group: data.assigned_tasking_group.length > 0 && data.assigned_tasking_group[0].tasking_group ? data.assigned_tasking_group[0].tasking_group.id : ''
    });
    console.log('data.task_number_dee', data.task_number_dee);

    if (data.task_number_dee != null) {
      let split_task_number_dee = data.task_number_dee.split("/");
      this.taskForm.patchValue({ deeForm: { task_number_dee0: split_task_number_dee[1], task_number_dee1: split_task_number_dee[2], task_number_dee2: split_task_number_dee[3] } })
    }


    if (data ? data.file : "") {
      var img_link = data.file;
      //var trim_img = img_link.substring(1)
      this.ImageUrl = img_link;
      console.log('ImageUrl', this.ImageUrl);

    } else {
      this.ImageUrl = "";
      console.log('ImageUrl "d"', this.ImageUrl);

    }

    if (data ? data.file1 : "") {
      var img_link1 = data.file1;
      //var trim_img = img_link.substring(1)
      this.ImageUrl1 = img_link1;
    } else {
      this.ImageUrl1 = ""
    }

    if (data ? data.file2 : "") {
      var img_link2 = data.file2;
      //var trim_img = img_link.substring(1)
      this.ImageUrl2 = img_link2;
    } else {
      this.ImageUrl2 = ""
    }
    if (data ? data.file3 : "") {
      var img_link3 = data.file3;
      //var trim_img = img_link.substring(1)
      this.ImageUrl3 = img_link3;
    } else {
      this.ImageUrl3 = ""
    }

    if (data ? data.file4 : "") {
      var img_link4 = data.file4;
      //var trim_img = img_link.substring(1)
      this.ImageUrl4 = img_link4;
    } else {
      this.ImageUrl4 = ""
    }
    if (data ? data.file5 : "") {
      var img_link5 = data.file5;
      //var trim_img = img_link.substring(1)
      this.ImageUrl5 = img_link5;
    }
    else {
      this.ImageUrl5 = ""
    }
    if (data ? data.file6 : "") {
      var img_link6 = data.file6;
      //var trim_img = img_link.substring(1)
      this.ImageUrl6 = img_link6;
    }
    else {
      this.ImageUrl6 = ""
    }

    if (data ? data.file7 : "") {
      var img_link7 = data.file7;
      //var trim_img = img_link.substring(1)
      this.ImageUrl7 = img_link7;
    }
    else {
      this.ImageUrl7 = '';
    }

    if (data ? data.file8 : "") {
      var img_link8 = data.file8;
      //var trim_img = img_link.substring(1)
      this.ImageUrl8 = img_link8;
    }
    else {
      this.ImageUrl8 = '';
    }
  }

  initForm() {
    this.taskForm.patchValue({
      status: "1",
    });

  }
  populate1(data) {
    setTimeout(() => {
      if (data.assigned_tasking_group) {


        if (data.assigned_tasking_group[0] != null) {
          this.allocateForm.patchValue({ tasking_group: data.assigned_tasking_group[0].tasking_group.id });
        }
      }
    }, 500);

  }

  Error = (controlName: string, errorName: string) => {
    return this.taskForm.controls[controlName].hasError(errorName);
  };

  taskList: any;
  initiator_active = '';
  apso_active = '';
  wesee_active = '';
  dgwesee_active = '';
  acom_active = '';
  dee_active = '';
  com_active = '';
  current_taskingID = '1';
  SDFORM = false;


  //   randomString(length) {

  //     var randomChars = '1234567890';

  //     // var result = '';
  //     var randNumber = Math.random() * 1000;

  //     // result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  //     // Math.random() * 1000;


  //     return randNumber;

  // }
  randomChars = '1234567890';
  randNumber = '';
  ngOnInit(): void {
    this.formInit();
    this.getDirectorate();
    this.token_detail = this.api.decryptData(localStorage.getItem('token-detail'));
    console.log('token_api', this.token_detail)
    this.getTasking();
    this.getAccess();
    this.getComments;
    this.getTaskingGroups();
    // this.refreshPaginator();
    var randNumber = Math.random() * 1000;
    this.currentDate = new Date();
    let date = new Date().getFullYear();
    const cValue = formatDate(this.currentDate, 'yyyy', 'en-US');
    const ccValue = formatDate(this.currentDate, 'dd', 'en-US');
    (new Date(), 'yyyy/MM/dd', 'en');
    this.taskForm.patchValue({

      deeForm: ({
        task_number_dee: 'WESEE'

      })

    });

    if (this.api.userid.role_center[0].user_role.code != 'Initiator' && this.token_detail.process_id == 2) {
      this.SDFORM = true;
    }
    else if (this.token_detail.tasking_id == '' || this.token_detail.tasking_id == null && this.token_detail.process_id == 3) {

      this.SDFORM = true;
    }
    this.taskForm.get('sdForm').disable();
    this.taskForm.get('apsoForm').disable();
    this.taskForm.get('weseeForm').disable();
    this.taskForm.get('deeForm').disable();
    this.taskForm.get('acomForm').disable();
    this.taskForm.get('comForm').disable();
    console.log(this.taskForm.get('deeForm'), "====================%%%%%%%%%%%%%%%%%%%%")



    //  if(this.SDFORM==false && this.current_taskingID!='')this.initiator_active='active';
    //  if(this.api.userid.role_center[0].user_role.code=='APSO')this.apso_active='active';
    //  if(this.token_detail.tasking_id!=null && this.current_taskingID!='')this.wesee_active='active';
    //  if(this.api.userid.role_center[0].user_role.code=='WESEE')this.dgwesee_active='active';
    //  if(this.api.userid.role_center[0].user_role.code=='DEE')this.dee_active='active';
    //  if(this.api.userid.role_center[0].user_role.code=='ACOM')this.acom_active='active';
    //  if(this.api.userid.role_center[0].user_role.code=='APP')this.com_active='active';
  }

  modulesData = [
    'Initiator',
    'APSO Recommender',
    'Wesee Recommender',
    'DWE Recommender',
    'Dee Recommender',
    'Approver',
    'ACom Recommender',
    'Recommender'
  ];

  disableDee(): boolean {
    if (this.role === 6 && this.taskListRoot.WESEE_recommender == 1) {
      return false;
    }
    return true;
  }
  disableApso(): boolean {
    if (this.role === 14 && this.taskListRoot.SD_initiater == 1) {
      return false;
    }
    return true;
  }


  disableWesee(): boolean {
    if (this.role === 4 && this.taskListRoot.comment_status != 4) {
      return false;
    }
    return true;
  }
  disableWesee2(): boolean {
    if (this.api.userid.process_id === 3) {
      return false;
    }
    if (this.role === 4 && this.taskListRoot.comment_status == 4) {
      return false;
    }
    return true;
  }

  disableAcom(): boolean {
    if (this.role === 8 && this.taskListRoot.DEE_recommender == 1) {
      return false;
    }
    return true;
  }
  disableCom(): boolean {
    if (this.role === 5 && this.taskListRoot.ACOM_recommender == 1) {
      return false;
    }
    return true;
  }
  role: any;
  onEditRole(rowData) {

    this.taskForm.get('sdForm')?.disable();
    this.taskForm.get('apsoForm')?.disable();
    this.taskForm.get('weseeForm')?.disable();
    this.taskForm.get('deeForm')?.disable();
    this.taskForm.get('acomForm')?.disable();
    this.taskForm.get('comForm')?.disable();


    this.api.getAPI(environment.API_URL + `transaction/current-status/${rowData.id}/?user=${this.api.userid.user_id}`).subscribe((res) => {
      this.role = res.role;

      // switch(role) {
      //     case 'Initiator':
      //       this.taskForm.get('sdForm')?.enable();
      //       break;
      //     case 'APSO Recommender':
      //       this.taskForm.get('apsoForm')?.enable();
      //       break;
      //     case 'Wesee Recommender':
      //       this.taskForm.get('weseeForm')?.enable();
      //       break;
      //     case 'DWE Recommender':
      //       this.taskForm.get('deeForm')?.enable();
      //       break;
      //     case 'Dee Recommender':
      //       this.taskForm.get('deeForm')?.enable();
      //       break;
      //     case 'ACom Recommender':
      //       this.taskForm.get('acomForm')?.enable();
      //       break;
      //     case 'Recommender':
      //       this.taskForm.get('comForm')?.enable();
      //       break;
      //     default:
      //       console.log('No matching role to enable forms');
      //   }
    })

  }




  // refreshPaginator() {
  //   let pageIndex = 0;
  //   setTimeout((idx) => {
  //     this.pagination.pageIndex = 0;
  //     this.pagination._changePageSize(10);
  //   }, 0, pageIndex);
  // }




  taskingGroups: any;
  getTaskingGroups() {
    this.api
      .getAPI(environment.API_URL + "master/taskinggroups")
      .subscribe((res) => {
        this.taskingGroups = res.data;
        console.log('TTTTT', this.taskingGroups);

      });
  }
  ImgUrl: any;
  param: any;
  getTasking() {
    this.countryList = []
    let limit_start = 0;
    let limit_end = 10;
    if (this.pageEvent) {
      limit_end = (this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize;
      limit_start = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
    }
    if (this.param == undefined) this.param = ""; else this.param;
    this.api.displayLoading(true);

    if (this.token_detail.process_id == 2 && this.token_detail.role_id == 3) {
      this.api
        .getAPI(environment.API_URL + "transaction/tasking?order_type=desc" + this.param + "&created_by_id=" + this.token_detail.user_id)
        .subscribe((res) => {
          this.api.displayLoading(false)
          if (res.status == environment.SUCCESS_CODE) {
            this.dataSource = new MatTableDataSource(res.data);
            this.countryList = res.data;
            this.totalLength = res.total_length
            //   this.dataSource.paginator = this.pagination;
            var Img = environment.MEDIA_URL;
            this.ImgUrl = Img.substring(0, Img.length - 1);

          }

        });
    }
    else {
      this.api
        .getAPI(environment.API_URL + "transaction/tasking?order_type=desc" + this.param + "&limit_start=" + limit_start + "&limit_end=" + limit_end)
        .subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            this.dataSource = new MatTableDataSource(res.data);
            this.countryList = res.data;
            this.totalLength = res.total_length
            //   this.dataSource.paginator = this.pagination;
            var Img = environment.MEDIA_URL;
            this.ImgUrl = Img.substring(0, Img.length - 1);
          }

        });

    }


  }
  is_sponsoring_directorate = false;
  getComments() {

    this.api
      .getAPI(environment.API_URL + "transaction/trials_status?tasking=" + this.id)
      .subscribe((res) => {
        this.countryList1 = res.data;
        console.log('comments', res);

        if (res.data[0].sponsoring_directorate && res.data[0].sponsoring_directorate.skip_apso == 1) {
          this.is_sponsoring_directorate = false
        }
        else {
          this.is_sponsoring_directorate = true

        }



      });

  }
  signatureDataIni:any
  signatureDataApso:any
  signatureDatawesee:any
  signatureDataDee:any
  signatureDataAcom:any
  signatureDatacom:any
  signeture(countryList: any[], key: string): object | null {
    const index = countryList.findIndex(country => country[key] === 1);
    switch (key) {
      case 'SD_initiater':
        this.signatureDataIni = countryList[index];
        return countryList[index];
      case 'APSO_recommender':
        this.signatureDataApso = countryList[index];
        return countryList[index];
      case 'WESEE_recommender':
        this.signatureDatawesee = countryList[index];
        return countryList[index];
      case 'DEE_recommender':
        this.signatureDataDee = countryList[index];
        return countryList[index];
      case 'ACOM_recommender':
        this.signatureDataAcom = countryList[index];
        return countryList[index];
      case 'COM_approver':
        this.signatureDatacom = countryList[index];
        return countryList[index];
      default:
        return null;
    }
  
    return null;
}

  taskingID: any;
  //   openPopup(id) {
  // 	this.taskingID=id;
  //     // this.getMileStone();
  // 	openModal('#crud-countries');
  //     setTimeout(()=> {
  //       this.getComments();
  //      }, 2000);
  // 	}
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
    this.isReadonly = false;
    this.taskForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if (reset !== null) {
      this.initForm();
    }

  }

  file1 = true
  file6 = true
  file7 = true
  file8 = true
  file9 = true
  file1url = true
  file6url = true
  file7url = true
  file8url = true
  file9url = true
  remove_file1() {
    this.file1 = true
    this.file1url = false
    this.imgToUpload = '';
  }
  file2 = true
  file2url = true
  remove_file2() {
    this.file2 = true
    this.file2url = false
    this.imgToUpload1 = '';
  }
  file3 = true
  file3url = true
  remove_file3() {
    this.file3 = true
    this.file3url = false
    this.imgToUpload2 = '';
  }
  file4 = true
  file4url = true
  remove_file4() {
    this.file4 = true
    this.file4url = false
    this.imgToUpload3 = '';
  }
  file5 = true
  file5url = true
  remove_file5() {
    this.file5 = true
    this.file5url = false
    this.imgToUpload4 = '';
  }
  remove_file6() {
    this.file6 = true
    this.file6url = false
    this.imgToUpload5 = '';
  }
  remove_file7() {
    this.file7 = true
    this.file7url = false
    this.imgToUpload6 = '';
  }
  remove_file8() {
    this.file8 = true
    this.file8url = false
    this.imgToUpload7 = '';
  }
  remove_file9() {
    this.file9 = true
    this.file9url = false
    this.imgToUpload8 = '';
  }
  ckeditor: any;

  list: any;
  listDelapso: any;
  listdee: any;
  listacom: any;
  listapp: any;
  listwesee: any;
  listassign: any;
  rowId

  editOption(country) {
    this.onEditRole(country);
    this.commentEditor.editable = true;
    console.log(country, "==================>>>>>>>>>>>>")
    this.apiCall();
    this.taskListRoot = country;
    this.formGroup.get('taskId').setValue(this.taskListRoot.task_name);
    console.log('country', country)
    this.listassign = country.assigned_tasking_group
    console.log('this.listassign', this.listassign)
    this.listDelapso = country.APSO_recommender
    this.listwesee = country.WESEE_recommender
    this.listdee = country.DEE_recommender
    this.listacom = country.ACOM_recommender
    this.listapp = country.COM_approver
    this.initiator_active = '';
    this.apso_active = '';
    this.dgwesee_active = '';
    this.dee_active = '';
    this.acom_active = '';
    this.com_active = '';
    this.wesee_active = '';
    this.isReadonly = false;
    this.taskForm.enable();
    this.crudName = "Edit";
    this.id = country.id;
    this.rowId = country.id;
    this.populate(country);
    this.populate1(country);
    this.list = country;
    this.getComments();
    this.getTaskingg();
    this.getMiniting();
    this.getStatusTimeline();
    if (this.token_detail.role_center[0].user_role.code == 'Initiator') {
      this.editorConfig.editable = true;
    }
    else {
      this.editorConfig.editable = false;
    }

    this.currentDate = new Date();
    const cValue = formatDate(this.currentDate, 'yyyy', 'en-US');
    const ccValue = formatDate(this.currentDate, 'dd', 'en-US');
    (new Date(), 'yyyy/MM/dd', 'en');
    let splitFirst = this.taskForm.get('deeForm').value.task_number_dee0;
    let splitFirst1 = this.taskForm.get('deeForm').value.task_number_dee1;
    let splitFirst2 = this.taskForm.get('deeForm').value.task_number_dee2;


    if (this.taskForm.get('deeForm').value.task_number_dee == '' || this.taskForm.get('deeForm').value.task_number_dee == null) {
      this.taskForm.patchValue({

        deeForm: ({
          task_number_dee: this.taskForm.get('deeForm').value.task_number_dee0 + this.taskForm.get('deeForm').value.task_number_dee1 + this.taskForm.get('deeForm').value.task_number_dee2

        })


      });


    }
    this.taskForm.patchValue({

      deeForm: ({
        // task_number_dee:splitFirst
        task_number_dee: this.taskForm.get('deeForm').value.task_number_dee + this.taskForm.get('deeForm').value.task_number_dee1 + this.taskForm.get('deeForm').value.task_number_dee2
      })

    });

    if (this.api.userid.role_center[0].user_role.code != 'Initiator' && this.token_detail.process_id == 2) {

      this.SDFORM = true;
    }
    else if (this.token_detail.tasking_id == '' || this.token_detail.tasking_id == null && this.token_detail.process_id == 3) {

      this.SDFORM = true;
    }
    if ((this.SDFORM == true) || (country.SD_initiater == '1' && country.APSO_recommender == '1')) this.taskForm.get('sdForm').disable();

    if (this.api.userid.role_center[0].user_role.code != 'APSO' && (country.APSO_recommender == '1' && country.WESEE_recommender == '1')) this.taskForm.get('apsoForm').disable();
    if (this.api.userid.role_center[0].user_role.code != 'WESEE' || (country.WESEE_recommender == '1' && country.DEE_recommender == 1)) {
      if (this.api.userid.process_id != '3') this.taskForm.get('weseeForm').disable();
    }
    if (this.api.userid.role_center[0].user_role.code != 'DEE' || (country.DEE_recommender == '1' && country.ACOM_recommender == '1')) this.taskForm.get('deeForm').disable();
    if (this.api.userid.role_center[0].user_role.code != 'ACOM' || (country.ACOM_recommender == '1' && country.COM_approver == '1')) this.taskForm.get('acomForm').disable();
    if (this.api.userid.role_center[0].user_role.code != 'APP' || (country.comment_status == '3')) this.taskForm.get('comForm').disable();
    // else if(this.api.userid.process_id=='3')this.taskForm.get('weseeForm').enable();

    if ((country.SD_initiater == '1') || (country.SD_initiater != '')) this.initiator_active = 'active';

    if ((country.APSO_recommender == '1')) this.apso_active = 'active';
    if (country.assigned_tasking_group != '') this.wesee_active = 'active';
    if ((country.WESEE_recommender == '1')) this.dgwesee_active = 'active';
    // // {
    // //         if(this.api.userid.process_id!='3')this.wesee_active='active';
    // //           }
    if ((country.DEE_recommender == '1')) this.dee_active = 'active';
    if ((country.ACOM_recommender == '1')) this.acom_active = 'active';
    if ((country.comment_status == '3')) this.com_active = 'active';



    openModal('#crud-countries');

  }

  onView(country) {
    // this.commentEditor.editable=false;
    this.id = country.id;
    this.apiCall();
    this.getComments();
    this.getTaskingg();
    this.getMiniting();
    this.getStatusTimeline();
    this.taskListRoot = country;
    this.formGroup.get('taskId').setValue(this.taskListRoot.task_name);
    
    this.initiator_active = '';
    this.apso_active = '';
    this.dgwesee_active = '';
    this.dee_active = '';
    this.acom_active = '';
    this.com_active = '';
    this.wesee_active = '';
    this.crudName = 'View';
    this.isReadonly = true;
    this.taskForm.disable();
    this.taskForm.get('sdForm').disable();
    this.populate(country);
    // var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    console.log('tr', country)
    this.list = country;
    
    this.getComments();
    this.getMiniting();
    // this.listdee=country.DEE_recommender

    if (country.SD_initiater == '1')
      this.initiator_active = 'active';

    if (country.APSO_recommender == '1')
      this.apso_active = 'active';
    if (country.assigned_tasking_group != '') this.wesee_active = 'active';
    if (country.WESEE_recommender == '1')
      this.dgwesee_active = 'active';
    // {
    //         if(this.api.userid.process_id!='3')this.wesee_active='active';
    //           }
    if ((country.DEE_recommender == '1')) this.dee_active = 'active';
    if ((country.ACOM_recommender == '1')) this.acom_active = 'active';
    if ((country.comment_status == '3')) this.com_active = 'active';

    this.editorConfig.editable = false;

    openModal('#crud-countries');
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
  taskingg: any;
  getTaskingg() {
    this.api
      .getAPI(environment.API_URL + "transaction/allocate/status")
      .subscribe((res) => {
        this.taskingg = res.data;

        // this.logger.log('country', this.taskingg)
      });
  }
  onSubmit() {
    this.showError = true;
    this.currentDate = new Date();
    //this.taskForm.value.id=this.id;
    console.log('this.taskForm', this.taskForm.value)

    const cValue = formatDate(this.currentDate, 'yyyy', 'en-US');
    const ccValue = formatDate(this.currentDate, 'dd', 'en-US');
    (new Date(), 'yyyy/MM/dd', 'en');

    //  if(this.taskForm.get('sdForm').value.sponsoring_directorate==''){

    // 	this.taskForm.get('sdForm').value.sponsoring_directorate='IHQ MOD(N)/'+this.api.userid.first_name;
    // 	  }

    //this.taskForm.value.created_by = this.api.userid.user_id;
    //this.taskForm.value.status = this.taskForm.value.status==true ? 1 : 2;
    this.taskForm.value.id = this.id;
    const formData = new FormData();
    formData.append('sponsoring_directorate', this.taskForm.get('sdForm').value.sponsoring_directorate);
    formData.append('task_name', this.taskForm.get('sdForm').value.task_name);
    formData.append('task_description', this.taskForm.get('sdForm').value.task_description);
    formData.append('details_hardware', this.taskForm.get('sdForm').value.details_hardware);
    formData.append('details_software', this.taskForm.get('sdForm').value.details_software);
    formData.append('details_systems_present', this.taskForm.get('sdForm').value.details_systems_present);
    formData.append('ships_or_systems_affected', this.taskForm.get('sdForm').value.ships_or_systems_affected);
    formData.append('id', this.taskForm.value.id);
    if (this.imgToUpload != null) {
      formData.append('file', this.imgToUpload)
      this.file1 = false

    }
    if (this.imgToUpload1 != null) {
      formData.append('file1', this.imgToUpload1)
      this.file2 = false
    }
    if (this.imgToUpload2 != null) {
      formData.append('file2', this.imgToUpload2)
      this.file3 = false
    }

    if (this.imgToUpload3 != null) {
      formData.append('file3', this.imgToUpload3)
      this.file4 = false
    }

    if (this.imgToUpload4 != null) {
      formData.append('file4', this.imgToUpload4)
      this.file5 = false
    }


    if (this.imgToUpload5 != null) {
      formData.append('file5', this.imgToUpload5)
      this.file6 = false
    }

    if (this.imgToUpload6 != null) {
      formData.append('file6', this.imgToUpload6)
      this.file7 = false
    }

    if (this.imgToUpload7 != null) {
      formData.append('file7', this.imgToUpload7)
      this.file8 = false
    }

    if (this.imgToUpload8 != null) {
      formData.append('file8', this.imgToUpload8)
      this.file9 = false
    }

    formData.append('modified_by', this.api.userid.user_id);


    if (this.taskForm) {
      //formData.append('id', this.editForm.value.id);
      this.api
        .postAPI(
          environment.API_URL + "transaction/tasking/crud",
          formData,
        )

        .subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {

            this.notification.success(res.message);
            this.getTasking();
            // this.closebutton.nativeElement.click();
            setTimeout(() => {
              this.close();
            }, 3000);
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
      this.countryList.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getTasking();
    }
  }

  imgToUpload: any;
  onImageHandler(event) {
    console.log('image', event.target.files[0])
    if (event.target.files.length > 0) {
      this.imgToUpload = event.target.files[0];
      console.log('img', event)

    };

  }

  imgToUpload1: any;
  onImageHandler1(event) {
    if (event.target.files.length > 0) {
      this.imgToUpload1 = event.target.files[0];
      console.log('img2', this.imgToUpload1)
      console.log('img2', this.imgToUpload.size)
    };

  }


  imgToUpload2: any;
  onImageHandler2(event) {
    if (event.target.files.length > 0) {
      this.imgToUpload2 = event.target.files[0];

    };

  }

  imgToUpload3: any;
  onImageHandler3(event) {
    if (event.target.files.length > 0) {
      this.imgToUpload3 = event.target.files[0];

    };

  }

  imgToUpload4: any;
  onImageHandler4(event) {
    if (event.target.files.length > 0) {
      this.imgToUpload4 = event.target.files[0];

    };

  }

  cancelmodal() {
    closeModal('#crud-countries');
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
          console.log('tasking res', res)
          if (res.status == environment.SUCCESS_CODE) {
            // this.logger.log('Formvalue',this.editForm.value);
            localStorage.setItem('allocate_Del', this.api.encryptData(res));
            this.notification.displayMessage("Task Allocated Sucessfully");
            this.getTasking();
            setTimeout(() => {
              this.close();
            }, 1500);

          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = true;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = false;
            }, 1000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
  }
  apsonotRecommended() {
   
    this.showError = true;
    if (this.taskForm) {

      this.taskForm.value.comment_status = '2';
      this.taskForm.value.status = '1';
      this.taskForm.value.id = this.id;

      this.api
        .postAPI(
          environment.API_URL + "transaction/tasking/crud",
          this.taskForm.value)
        .subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {

            this.notification.displayMessage("Not Recommended Successfully");
            this.getTasking();

            setTimeout(() => {
              this.close();
            }, 1500);
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = false;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = true;
            }, 1000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }

  }
  apsoRecommened() {
    if(this.lastStatusData <= this.taskListRoot.level ){
      this.showConfirm();
      return;
    }
    this.showError = true;
    if (this.taskForm) {
      this.taskForm.value.comment_status = '1';
      this.taskForm.value.status = '1';
      this.taskForm.value.id = this.id;
      this.api.postAPI(environment.API_URL + "transaction/tasking/crud", this.taskForm.value).subscribe((res) => {
        if (res.status == environment.SUCCESS_CODE) {
          this.notification.success(res.message);
          this.getTasking();
          setTimeout(() => {
            this.close();
          }, 1200);
        } else if (res.status == environment.ERROR_CODE) {
          this.error_msg = false;
          this.ErrorMsg = res.message;
          setTimeout(() => {
            this.error_msg = true;
          }, 900);
        } else {
          this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
        }

      });
    }
    //closeModal('#crud-countries');
  }

  notRecommended() { 
    this.showError = true;
    if (this.taskForm) {

      this.taskForm.value.comment_status = '2';
      this.taskForm.value.status = '1';
      this.taskForm.value.id = this.id;

      this.api.postAPI( environment.API_URL + "transaction/tasking/crud",this.taskForm.value)
        .subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.displayMessage("Not Recommended Successfully");
            this.getTasking();
            // this.closebutton.nativeElement.click();
            setTimeout(() => {
              this.close();
            }, 1200);
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = false;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = true;
            }, 900);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
    //closeModal('#crud-countries');
  }
  Recommened() { // wasee
    if(this.lastStatusData <= this.taskListRoot.level ){
      this.showConfirm();
      return;
    }
    this.showError = true;
    if (this.taskForm) {

      this.taskForm.value.comment_status = '1';
      this.taskForm.value.status = '1';
      this.taskForm.value.id = this.id;
      const formData = new FormData();

      formData.append('time_frame_for_completion_days', this.taskForm.get('weseeForm').value.time_frame_for_completion_days);
      formData.append('cost_implication', this.taskForm.get('weseeForm').value.cost_implication);
      formData.append('comments_of_wesee', this.taskForm.get('weseeForm').value.comments_of_wesee);
      formData.append('time_frame_for_completion_month', this.taskForm.get('weseeForm').value.time_frame_for_completion_month);
      formData.append('comment_status', this.taskForm.value.comment_status);
      formData.append('status', this.taskForm.value.status);
      formData.append('id', this.taskForm.value.id);

      if (this.imgToUpload5 != null) {
        formData.append('file5', this.imgToUpload5)
      }

      if (this.imgToUpload6 != null) {
        formData.append('file6', this.imgToUpload6)
      }

      if (this.taskForm) {
        this.api.postAPI(environment.API_URL + "transaction/tasking/crud", formData,
            // this.taskForm.value


          )
          .subscribe((res) => {
            if (res.status == environment.SUCCESS_CODE) {
              // this.logger.log('Formvalue',this.editForm.value);
              this.notification.success(res.message);
              this.getTasking();
              // this.closebutton.nativeElement.click();
              setTimeout(() => {
                this.close()
              }, 1200);
            } else if (res.status == environment.ERROR_CODE) {
              this.error_msg = false;
              this.ErrorMsg = res.message;
              setTimeout(() => {
                this.error_msg = true;
              }, 9000);
            } else {
              this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
            }

          });
      }
    }
    
  }
  OnTaskingSubmit() {
    this.showError = true;

    if (this.taskForm) {

      const formData = new FormData();

      formData.append('time_frame_for_completion_days', this.taskForm.get('weseeForm').value.time_frame_for_completion_days);
      formData.append('cost_implication', this.taskForm.get('weseeForm').value.cost_implication);
      formData.append('comments_of_wesee', this.taskForm.get('weseeForm').value.comments_of_wesee);
      formData.append('time_frame_for_completion_month', this.taskForm.get('weseeForm').value.time_frame_for_completion_month);


      this.taskForm.value.comment_status = '4';
      this.taskForm.value.status = '1';
      this.taskForm.value.id = this.id;
      formData.append('comment_status', this.taskForm.value.comment_status);
      formData.append('status', this.taskForm.value.status);
      formData.append('id', this.taskForm.value.id);
      if (this.imgToUpload5 != null) {
        formData.append('file5', this.imgToUpload5)
      }

      if (this.imgToUpload6 != null) {
        formData.append('file6', this.imgToUpload6)
      }


      this.api
        .postAPI(
          environment.API_URL + "transaction/tasking/crud", formData)
        .subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getTasking();
            // this.closebutton.nativeElement.click();
            setTimeout(() => {
              this.close();
            }, 1200);
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = false;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = true;
            }, 900);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
    // this.close()
  }

  deenotRecommended() {
    this.showError = true;
    this.currentDate = new Date();
    //this.taskForm.value.id=this.id;

    const cValue = formatDate(this.currentDate, 'yyyy', 'en-US');
    const ccValue = formatDate(this.currentDate, 'dd', 'en-US');
    (new Date(), 'yyyy/MM/dd', 'en');
    // console.log('trr',this.taskForm.get('deeForm').value.task_number_dee);

    // this.taskForm.get('deeForm').value.task_number_dee;
    if (this.taskForm.get('deeForm').value.task_number_dee0 == '' || this.taskForm.get('deeForm').value.task_number_dee0 == null) {
      // this.taskForm.get('deeForm').value.task_number_dee='WESEE/'+this.taskForm.get('deeForm').value.task_number_dee+'/'+cValue+'/'+ccValue;
      this.taskForm.get('deeForm').value.task_number_dee0 = 'WESEE/' + this.taskForm.get('deeForm').value.task_number_dee0 + '/' + this.taskForm.get('deeForm').value.task_number_dee1 + '/' + this.taskForm.get('deeForm').value.task_number_dee2
    }
    if (this.taskForm) {
      // this.taskForm.get('deeForm').value.task_number_dee='WESEE/'+this.taskForm.get('deeForm').value.task_number_dee+'/'+cValue+'/'+ccValue;
      this.taskForm.value.comment_status = '2';
      this.taskForm.value.status = '1';
      this.taskForm.value.id = this.id;
      this.api
        .postAPI(
          environment.API_URL + "transaction/tasking/crud",
          this.taskForm.value)
        .subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getTasking();
            // this.closebutton.nativeElement.click();
            setTimeout(() => {
              this.close()
            }, 1200);
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = false;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = true;
            }, 900);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
    // this.close()
  }
  deeRecommened() {
    if(this.lastStatusData <= this.taskListRoot.level ){
      this.showConfirm();
      return;
    }
    this.showError = true;
    this.currentDate = new Date();

    const formData = new FormData();
    //this.taskForm.value.id=this.id;
    console.log('task_number_dee', this.taskForm.get('deeForm').value.task_number_dee0)
    const cValue = formatDate(this.currentDate, 'yyyy', 'en-US');
    const ccValue = formatDate(this.currentDate, 'dd', 'en-US');
    (new Date(), 'yyyy/MM/dd', 'en');

    if (this.taskForm.get('deeForm').value.task_number_dee0 != '' || this.taskForm.get('deeForm').value.task_number_dee0 == null) {
      this.taskForm.get('deeForm').value.task_number_dee = 'WESEE/' + this.taskForm.get('deeForm').value.task_number_dee0 + '/' + this.taskForm.get('deeForm').value.task_number_dee1 + '/' + this.taskForm.get('deeForm').value.task_number_dee2
      formData.append('task_number_dee', this.taskForm.get('deeForm').value.task_number_dee);

    }
    formData.append('comments_of_dee', this.taskForm.get('deeForm').value.comments_of_dee);
    if (this.imgToUpload7 != null) {
      formData.append('file7', this.imgToUpload7)
    }

    if (this.imgToUpload8 != null) {
      formData.append('file8', this.imgToUpload8)
    }

    if (this.taskForm) {

      this.taskForm.value.comment_status = '1';
      this.taskForm.value.status = '1';
      this.taskForm.value.id = this.id;
      formData.append('comment_status', this.taskForm.value.comment_status);
      formData.append('status', this.taskForm.value.status);
      formData.append('id', this.taskForm.value.id);
      formData.append('DEE_recommender', this.taskForm.value.status);

      this.api.postAPI(environment.API_URL + "transaction/tasking/crud",
          formData)
        .subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getTasking();
            // this.closebutton.nativeElement.click();
            setTimeout(() => {
              this.close()
            }, 1200);
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = false;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = true;
            }, 900);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
    // this.close()
  }
  acomnotRecommended() {
    if(this.lastStatusData <= this.taskListRoot.level ){
      this.showConfirm();
      return;
    }
    this.showError = true;
    if (this.taskForm) {

      this.taskForm.value.comment_status = '2';
      this.taskForm.value.status = '1';
      this.taskForm.value.id = this.id;
      this.api
        .postAPI(
          environment.API_URL + "transaction/tasking/crud",
          this.taskForm.value)
        .subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getTasking();
            // this.closebutton.nativeElement.click();
            setTimeout(() => {
              closeModal('#crud-countries');
            }, 3000);
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = false;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = true;
            }, 2000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
    
  }
  acomRecommened() {
    if(this.lastStatusData <= this.taskListRoot.level ){
      this.showConfirm();
      return;
    }
    this.showError = true;
    if (this.taskForm) {

      this.taskForm.value.comment_status = '1';
      this.taskForm.value.status = '1';
      this.taskForm.value.id = this.id;
      this.api
        .postAPI(
          environment.API_URL + "transaction/tasking/crud",
          this.taskForm.value)
        .subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getTasking();
            // this.closebutton.nativeElement.click();
            setTimeout(() => {
              closeModal('#crud-countries');
            }, 1200);
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = false;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = true;
            }, 900);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
    // this.close()
  }
  comRecommened() {
 
    this.showError = true;
    if (this.taskForm) {

      this.taskForm.value.comment_status = '3';
      this.taskForm.value.status = '1';
      this.taskForm.value.id = this.id;
      this.api
        .postAPI(
          environment.API_URL + "transaction/tasking/crud",
          this.taskForm.value)
        .subscribe((res) => {
          //this.error= res.status;
          if (res.status == environment.SUCCESS_CODE) {
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getTasking();
            // this.closebutton.nativeElement.click();
            setTimeout(() => {
              this.close();
            }, 1200);
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = false;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = true;
            }, 900);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });

    }
    // this.close()
  }

  comnotRecommended() {
    this.showError = true;
    if (this.taskForm) {

      this.taskForm.value.comment_status = '2';
      this.taskForm.value.status = '1';
      this.taskForm.value.id = this.id;
      this.api
        .postAPI(
          environment.API_URL + "transaction/tasking/crud",
          this.taskForm.value)
        .subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getTasking();
            // this.closebutton.nativeElement.click();
            setTimeout(() => {
              this.close();
            }, 3000);
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = false;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = true;
            }, 2000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
    
  }


  close() {
    closeModal('#crud-countries');
    this.getTasking();
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


  public importform = new FormGroup({
    file_upload: new FormControl(""),
  });


  Submit() {
    const formData = new FormData();
    formData.append('file_upload', this.imgToUpload);
    if (this.importform.valid) {
      // this.importform.value.created_by = this.api.userid.user_id;
      // this.importform.value.status = this.importform.value.status == true ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "transaction/trials_import",
          formData
        )
        .subscribe((res) => {
          //this.error= res.status;
          if (res.status == environment.SUCCESS_CODE) {
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


  import() {
    this.importname = 'Import';
    //this.crudName = "Add";
    //this.isReadonly=false;

    //var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    // element.checked = true;
    openModal('#import');
  }
  closeimport() {
    closeModal('#import');
  }


  div1: boolean = true;
  div2: boolean = false;

  div3: boolean = true;
  div4: boolean = false;
  div1Function() {
    this.div1 = true;
    this.div2 = true;
  }

  div2Function() {
    this.div2 = true;
    this.div1 = true;
  }
  div3Function() {
    this.div2 = false;
    this.div1 = true;
  }

  div4Function() {
    this.div3 = true;
    this.div4 = true;
  }

  div5Function() {
    this.div3 = true;
    this.div4 = true;
  }
  div6Function() {
    this.div4 = false;
    this.div3 = true;
  }
  imgToUpload5: any;
  onImageHandler5(event) {
    if (event.target.files.length > 0) {
      this.imgToUpload5 = event.target.files[0];
    };

  }

  imgToUpload6: any;
  onImageHandler6(event) {
    if (event.target.files.length > 0) {
      this.imgToUpload6 = event.target.files[0];
    };

  }

  imgToUpload7: any;
  onImageHandler7(event) {
    if (event.target.files.length > 0) {
      this.imgToUpload7 = event.target.files[0];
    };

  }

  imgToUpload8: any;
  onImageHandler8(event) {
    if (event.target.files.length > 0) {
      this.imgToUpload8 = event.target.files[0];
    };

  }
  taskListRoot: any;
  processList: any
  userRoleList: any
  formInit() {
    this.formGroup = this.fb.group({
      taskId: [{ value: '', disabled: true }],
      current_id: [''],
      next_user_id: [''],
      process: [''],

    });
    this.minitingForm = this.fb.group({
      comment: [''],
    })

  }

  openBackDropCustomClass(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'xl' });
    this.messageService.clear('c');
  }

  apiCall() {
    this.api.getAPI(environment.API_URL + '/access/access_user_roles').subscribe((res) => {
      this.userRoleList = res.data

    })
    // this.api.getAPI(environment.API_URL +'/access/process' ).subscribe((res) => {
    // this.processList = res.data

    // });

  }




  steps = []
  saveRoot() {
    let index = this.steps.findIndex(step => step.level === parseInt(this.formGroup.get('process').value));

    // Create the new step object
    let newStep = {
      level: parseInt(this.formGroup.get('process').value) + 1,
      label: this.formGroup.get('userRoleId').value, // Assuming name is a string
      status: 'inactive'
    };

    // Insert the new step after the found index
    this.steps.splice(index + 1, 0, newStep);

    // Update the levels of all subsequent steps
    for (let i = index + 2; i < this.steps.length; i++) {
      this.steps[i].level += 1;
    }

  }

  getDirectorate() {
    this.api.getAPI(environment.API_URL + `access/process`).subscribe(res => {
      this.directorateList = res.data;
      console.log(res, "directorateList ");
    })
  }
  selectedProcess: string;
  onSectionChange(event: any) {
    this.selectedProcess = event.value;
    this.api.getAPI(environment.API_URL + `access/access_user_roles?process_id=${this.selectedProcess}`).subscribe(res => {
      this.userroleList = res.data;

    })
  }
  directList: any;
  onSelectChangeRole(event: any) {

    this.api.getAPI(environment.API_URL + `api/auth/users?process_id=${this.selectedProcess}&userrolemapping__user_role=${event.value}`).subscribe(res => {
      this.userList = res.data;

    })


  }
  userListTo: any;
  directRecomender: any
  onSelectChangeRoleTo(event: any) {
    const selectedUserRole = event.value;
    this.directRecomender = event.value
    if (selectedUserRole === 18) {
      this.api.getAPI(environment.API_URL + `master/department`).subscribe(res => {
        this.directList = res.data;
        console.log(this.directList)
      })
    } else {
      this.api.getAPI(environment.API_URL + `api/auth/users?process_id=${this.selectedProcess}&userrolemapping__user_role=${selectedUserRole}`).subscribe(res => {
        this.userListTo = res.data;

      })
    }
  }
  onSelectDirectrate(event: any) {
    this.api.getAPI(environment.API_URL + `api/auth/users?department_id=${event.value}`).subscribe(res => {
      this.userListTo = res.data;

    })
  }
  onSubmitRoute() {
    const formData = this.formGroup.value;

    const newComment = {
      tasking: this.id,
      id: '',
      process: this.formGroup.get('process').value,
      current_id: this.formGroup.get('current_id').value,
      next_user_id: this.formGroup.get('next_user_id').value, //loginname
    };
    this.api.postAPI(environment.API_URL + `transaction/process-flows/details/`, newComment).subscribe(res => {

      this.getStatusTimeline()
      this.modalService.dismissAll("Close")
    })
    let taskId = this.formGroup.get('taskId').value
    this.formGroup.reset();
    this.formGroup.get('taskId').setValue(taskId)
  }
  roles: any = [];
  lastStatusData:any;
  getStatusTimeline() {
    this.roles = [];
    this.routeList = [];
    let temp = [];
    
    this.api.getAPI(environment.API_URL + `transaction/process-flows/details/?tasking_id=${this.id}`).subscribe({
      next: (res) => {
        temp = res;
        this.roles.push(temp[0]);
        this.routeList = res;
        this.lastStatusData = res[res.length - 1]?.sequence;
      },
      error: (err) => {
        // Handle the error response properly here
        console.error('Error fetching data:', err);
        // Optionally, you can display an error message or log the error
      }
    });
  }
  

  timelineStepName(step: any): string {
    const roleName = step?.next_user?.roles[0]?.user_role?.name;
    return ` (${roleName})`;
  }
  timelineStepDirect(step: any): string {
    const directorate = step?.next_user?.department?.name;
    return `${directorate}`;
  }


  getMiniting() {
    this.minitingList=[]
    this.api.getAPI(environment.API_URL + `transaction/comments?tasking_id=${this.id}`).subscribe(res => {
      this.minitingList = res.data;
      console.log(res, "miniting sheet");
    })
  }

  minitingSheetdata = []
  saveMiniting() {

    if(this.lastStatusData <= this.taskListRoot.level ){
      this.showConfirm();
      return;
    }
    const formData = this.minitingForm.value;

    const newComment = {
      tasking: this.id,
      id: '',
      comments: formData.comment,
      created_on: new Date(),
      created_by: localStorage.getItem('user_id'),
      recommendation_status: 1
    };
    this.api.postAPI(environment.API_URL + `transaction/comments/crud`, newComment).subscribe(res => {
      console.log(res)
      this.getMiniting();
      this.getStatusTimeline();
      this.close();
      // this.getTasking();
    })
    this.minitingForm.reset();

  }




  gridColum = [
    { field: 'sponsoring_directorate', header: 'Sponsoring Directorate', filter: true, filterMatchMode: 'contains' },
    { field: 'task_name', header: 'Task Name', filter: true, filterMatchMode: 'contains' },
    { field: 'tasking_status', header: 'Status', filterMatchMode: 'contains', filter: false, }
  ]
  // Event handlers
  handleFilter(filterValue: any) {
    console.log('Filter triggered with value:', filterValue);
  }

  handlePagination(pageEvent: any) {
    console.log('Pagination triggered with event:', pageEvent);
  }
  handleEdit(rowData: any) {
    this.editOption(rowData)
    console.log('Edit triggered for row:', rowData);
  }
  handleDelete(rowData: any) {
    this.onDelete(rowData.id)
  }



  handleView(rowData: any) {
    this.onView(rowData)
    console.log('View triggered for row:', rowData);
  }



 
  // onConfirm() {
  //   this.messageService.clear('c');

  // }

  onReject() {
    this.messageService.clear('c');
  }

  showConfirm() {

    this.messageService.clear();
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Configure Route', detail: 'Please configure route before submitting your response' });
  }
}


