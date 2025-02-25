import { Component, ElementRef, OnInit, ViewChild, Inject, LOCALE_ID, signal, } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewStatusComponent } from '../view-status/view-status.component';
import { MatTableDataSource } from "@angular/material/table";
import { environment } from "../../../../environments/environment";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { ConsoleService } from "../../../service/console.service";
import { ApiService } from "../../../service/api.service";
import { FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { NotificationService } from "../../../service/notification.service";
import { ConfirmationDialogComponent } from "../../../confirmation-dialog/confirmation-dialog.component";
import { language } from "../../../../environments/language";
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
declare var $;
declare var moment:any;
import { of } from 'rxjs';
import { formatDate } from "@angular/common";
import { any } from '@amcharts/amcharts5/.internal/core/util/Array';
import { AllocateTasksComponent } from '../allocate-tasks/allocate-tasks.component';
import { TestBed } from '@angular/core/testing';
import * as XLSX from 'xlsx';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexYAxis,
  ApexXAxis,
  ApexPlotOptions,
  ApexTooltip
} from "ng-apexcharts";


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle;
};


type Tabs = "TaskWaiting" | "TaskApproved";
declare function closeModal(selector:any):any;
declare function openModal(selector:any):any;
declare function triggerClick(selector:any):any;
declare var moment:any;

@Component({
  selector: 'app-view-tasks',
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.scss'],
  providers:[DatePipe]
})

export class ViewTasksComponent implements OnInit {

  commentForm:FormGroup;
  extensionForm:FormGroup;
  archiveForm:FormGroup;
  completedForm:FormGroup;
  exportform:FormGroup;
  approvalForm:FormGroup;
  taskingForm:FormGroup;
  dataSource: MatTableDataSource<any>;
  dataSourcelist = new MatTableDataSource<any>([]); // Data source for Angular Material table
  dataSourceStatus: MatTableDataSource<any>;
  xlxsForm: FormGroup;
  isStatusAdd:boolean = false;
  totalCounts: any;
  searchValue: string;
  totaleRecords: any;
  tableDataSource: MatTableDataSource<any, MatPaginator>;
  paginator: any;
  sort: any;
  patchValue(data: any) {
    throw new Error('Method not implemented.');
  }
  file: File[];
  displayedColumns: string[] = [
    "task_number_dee",
    "task_name",
    "cost_implication",
    "sponsoring_directorate",
    "time_frame_for_completion",
    "legacy_data",
    "status",
    "completed",
    "actions",
    "pdf",
	"Export"
  ];
  visible=false;
  displayedColumnslist: string[] = [
    "title",
    "start_date",
    "end_date",
    "project_progress",
    "file",
    "edit",
    "delete",

    ];


  country: any;
  image: any;
  public crudName = "Add";
  public countryList = [];
  public statuslist:any = [];
  imgToUpload: any = null;
  filterValue: any;
  isReadonly = false;
  moduleAccess: any;
  ErrorMsg: any;
  error_msg = false;
  tasking:any;
  showError=false;
  moment=moment;
  fileToUpload: File | null = null;
  dateFormat=environment.DATE_FORMAT;
  ImgUrl:any;
  public permission = {
    add:false,
    view:false,
    archive:false,
    delete:false
  };
  isfileUpload:boolean;

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild('approve') approve: ElementRef;
  @ViewChild('reject') reject: ElementRef;
  @ViewChild('localForm') localForm: HTMLFormElement;
  start_date: string;
  end_date: string ;
  series:any;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  login_id:any;
  constructor(@Inject(LOCALE_ID) public locale: string,public api: ApiService, private notification: NotificationService,
    private dialog: MatDialog, private router: Router, private elementref: ElementRef, private logger: ConsoleService,private modalService: NgbModal,private fb:FormBuilder,public datepipe:DatePipe)
    {

       this.login_id = this.api.userid.user_id
      this.dataSource = new MatTableDataSource();
      this.dataSourcelist = new MatTableDataSource();
      this.dataSourceStatus = new MatTableDataSource();
       this.commentForm = new FormGroup({
        id: new FormControl(""),
        tasking:new FormControl(""),
        status : new FormControl(""),
        created_by: new FormControl(""),
        comments: new FormControl("", [Validators.required]),
      });
      this.xlxsForm = new FormGroup({
        header: new FormControl([]),
        fileName: new FormControl(''),
      })
      this.archiveForm = new FormGroup({
        id:new FormControl(""),
        tasking:new FormControl(""),
        reason: new FormControl("",Validators.required),
        authority_permission: new FormControl("",Validators.required)

      });
      this.completedForm = new FormGroup({
        tasking:new FormControl(""),
        completed_status: new FormControl(""),
        completed_comments: new FormControl("")

      });
    this.extensionForm = new FormGroup({
      extensionNumber:new FormControl(""),
       authorityLetterNumber :new FormControl(""),
      description : new FormControl(""),
      extendedTill: new FormControl(""),
    })
  this.exportform = new FormGroup({
    id: new FormControl(""),
    initiator: new FormControl(""),
    apso: new FormControl(""),
    wesee: new FormControl(""),
    dg_wesee: new FormControl(""),
    dee: new FormControl(""),
    acom : new FormControl(""),
    com: new FormControl(""),
    tasking: new FormControl(""),
	  mile: new FormControl(""),
  });
  this.approvalForm = new FormGroup({
    id: new FormControl(""),
    tasking:new FormControl(""),
    approved_level: new FormControl(''),
    comments: new FormControl("",[Validators.required]),
    status: new FormControl(""),
    approved_role_id: new FormControl(''),

  });

  this.taskingForm = new FormGroup({
    id: new FormControl(""),
    tasking:new FormControl(""),
    start_date:new FormControl(''),
    end_date:new FormControl(""),
    view_image:new FormControl(""),
    status_description:new FormControl(""),
    note:new FormControl(""),
    project_progress:new FormControl(""),
    created_by: new FormControl(""),
    created_ip:new FormControl(""),
    status_summary: new FormControl(""),
    title:new FormControl(""),
    status: new FormControl(""),
    secTitle:new FormControl(""),

  });
     var updateChart= this.chartOptions = {

        series: [
          {
            name: "Completed",
            data: this.completed

          },
          {
            name: "Pending",
            data: this.pending
          }
        ],
        chart: {
          type: "bar",
          height: 400,
          stacked: true
        },
        colors: ["#008FFB" ,"#FF4560"],
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "20%"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 1,
          colors: ["#fff"]
        },

        grid: {
          xaxis: {
            lines: {
              show: false
            }
          }
        },
        yaxis: {
          min: -100,
          max: 100,
          title: {
            // text: 'Age',
          }
        },
        tooltip: {
          shared: false,
          x: {
            formatter: function(val) {
              return val.toString();
            }
          },
          y: {
            formatter: function(val) {
              return Math.abs(val) + "%";
            }
          }
        },
        xaxis: {
          categories: this.name,
          title: {
            text: "Percent"
          },
          labels: {
            formatter: function(val) {
              return Math.abs(Math.round(parseInt(val, 10))) + "%";
            }
          }
        }
      };
	  setTimeout(() => {
        updateChart
      }, 1000);

  }
  img_link1=0;
  populate(data:any) {
    this.approvalForm.patchValue(data);
    this.taskingForm.patchValue(data);
    this.commentForm.patchValue(data);
    this.completedForm.patchValue(data);
    this.archiveForm.patchValue(data);
    this.taskingForm.patchValue({status_summary:data.status_summary,secTitle:data.secondary_title })
    if (data ? data.file : "") {
      var img_link = data.file;
      this.img_link1 = data.file;
      var trim_img = img_link.substring(1)
      this.ImgUrl = environment.MEDIA_URL; + trim_img;
      }
      else{
        this.ImgUrl ="";
      }

  }

  initForm() {
    this.approvalForm.patchValue({
      status: "1",
    })
    this.taskingForm.patchValue({
      status: "1",
      });
  }

  Errorcomment = (controlName: string, errorName: string) => {
    return this.commentForm.controls[controlName].hasError(errorName);
  };

  Errorarchive = (controlName: string, errorName: string) => {
    return this.archiveForm.controls[controlName].hasError(errorName);
  };

  Errorcompleted = (controlName: string, errorName: string) => {
    return this.completedForm.controls[controlName].hasError(errorName);
  };

  ErrorApproval = (controlName: string, errorName: string) => {
    return this.approvalForm.controls[controlName].hasError(errorName);
  };

  Error = (controlName: string, errorName: string) => {
    return this.taskingForm.controls[controlName].hasError(errorName);
  };

  pending:any=[];
  name:any=[];
  completed:any=[];
  mapped:any=[];
  getstatus(tasking_id:any) {
    this.api
      .getAPI(environment.API_URL + "transaction/tasking-status?tasking_id="+tasking_id)
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.statuslist = res.data;
        this.dataSource.paginator = this.pagination;
        for(let i=0;i<this.statuslist.length;i++){
          const val =100-this.statuslist[i].project_progress;
          this.pending.push([val]);
          this.completed.push('-'+[this.statuslist[i].project_progress])
          this.name.push([this.statuslist[i].tasking.task_number_dee])

        }
      });

  }

  allocate_del:any;
  token_detail:any;
  ngOnInit(): void {
    this.token_detail=this.api.decryptData(localStorage.getItem('token-detail'));
    this.allocate_del=this.api.decryptData(localStorage.getItem('allocate_Del'));
    this.getTasking();
    this.getTaskingGroups();
    this.getAccess();
    this.gettitlelist();
    this.isStatusAdd= (this.token_detail.process_id == 3 || this.token_detail.process_id == 1) ? true : false
  }
onFilterChange(filterInput,item?,item2?){
}
onCustomClear(item){
}
  data_list:any;
  add(country:any) {
    this.showError=false;
    this.crudName = "Add";
    this.isReadonly=false;
    this.taskingForm.enable();
    this.data_list=country;
    let reset = this.formGroupDirective.resetForm();
    this.getViewStatus(country.id)
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    openModal('#tasking-modal');

  }

  showSecTitle : boolean = false;
  secondaryTitle
  onSelectionChange(event){
    if(event){
      if(event !== 'Task Closed'){
        let url  = `master/lookup?type__code=${event == 'Work In Progress'? 'PRO_SEC': 'PRO_TER'}`
        this.api
      .getAPI(environment.API_URL + url)
      .subscribe((res) => {
        this.secondaryTitle = res.data;
        this.showSecTitle = true;
      });
      }else{
        this.showSecTitle = false;
        this.taskingForm.patchValue({
          secTitle: 'Task Close'
        });
        
      }
    }

  }
  onSubmit() {
    this.showError=true;
    this.taskingForm.patchValue({start_date:this.datepipe.transform(this.start_date,'yyyy-MM-dd')});
    this.taskingForm.patchValue({end_date:this.datepipe.transform(this.end_date,'yyyy-MM-dd')});
    if(this.taskingForm.value.status){
      if(this.taskingForm.value.status=="1")
        this.taskingForm.value.status="1"
    }
    else{
      this.taskingForm.value.status="2"
    }
    const formData = new FormData();
    formData.append('status_description', this.taskingForm.value.status_description);
    formData.append('start_date', this.taskingForm.value.start_date);
    formData.append('title', this.taskingForm.value.title);
    formData.append('end_date', this.taskingForm.value.end_date);
    formData.append('tasking', this.data_list.id);
    formData.append('project_progress', this.taskingForm.value.project_progress);
    formData.append('id', this.taskingForm.value.id);
    formData.append('created_by', this.api.userid.user_id);
    formData.append('status_summary', this.taskingForm.value.status_summary);
    formData.append('status', this.taskingForm.value.status);
    formData.append('secondary_title', this.taskingForm.value.secTitle)
     if (this.taskingForm.valid) {


      this.taskingForm.value.created_by = this.api.userid.user_id;
      this.api
        .postAPI(
          environment.API_URL + "transaction/tasking-status/crud",
          formData,
        )
        .subscribe((res) => {
          if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            this.getViewStatus( this.data_list.id);
            let reset = this.formGroupDirective.resetForm();
            if(reset!==null) {
              this.initForm();
            }
          } else if(res.status==environment.ERROR_CODE) {
            this.error_msg=false;
            this.ErrorMsg=res.message;
            setTimeout(()=> {
              this.error_msg = true;
           }, 2000);
          } else {
            const msg = language[environment.DEFAULT_LANG].unableSubmit;
            this.notification.displayMessage(msg);
          }

        });
    }
  }
  onImageHandler(event:any) {
    if (event.target.files.length > 0) {
      this.imgToUpload= event.target.files[0];
     };

    }
    fileUpload(event:any) {
      this.id=event.id;
      this.isfileUpload=true;
    }
  taskingGroups: any;
  getTaskingGroups() {
    this.api
      .getAPI(environment.API_URL + "master/taskinggroups")
      .subscribe((res) => {
        this.taskingGroups = res.data;
      });
  }
  id: any;
  task_name: any;
  task_Desc: any;
  tasking_group: any;
  getAccess() {
   this.moduleAccess = this.api.getPageAction();
    if (this.moduleAccess) {
      let addPermission=(this.moduleAccess).filter(function(access){ if(access.code=='ADD') return access.status; }).map(function(obj) {return obj.status;});
      let viewPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'VIW') { return access.status; } }).map(function (obj) { return obj.status; });;
      let archivePermission=(this.moduleAccess).filter(function(access){ if(access.code=='ARCHIVE') return access.status; }).map(function(obj) {return obj.status;});
      let deletePermission=(this.moduleAccess).filter(function(access){ if(access.code=='DEL') return access.status; }).map(function(obj) {return obj.status;});
      this.permission.add=addPermission.length>0?addPermission[0]:false;
      this.permission.view = viewPermission.length > 0 ? viewPermission[0] : false;;
      this.permission.archive = archivePermission.length > 0 ? archivePermission[0] : false;;
      this.permission.delete=deletePermission.length>0?deletePermission[0]:false;

    }

  }
  selectedTrial:any;
  taskname:any;
  tasknumber:any
  isStatusOpen=false;
  statusData:any;
  statusDataMainUser:object
  signatureData: any = {};
  openCurrentStatus(eventRow){
    this.statusData=eventRow;
    this.isStatusOpen=true
    console.log('tasking country',eventRow)
   
    this.api.getAPI(environment.API_URL + "transaction/trials_status?tasking="+eventRow.id)
    .subscribe((res) => {
      const keys = [
        'SD_initiater', 'APSO_recommender', , 
        'WESEE_recommender', 'DEE_recommender', 'ACOM_recommender', 'COM_approver'
    ];

    keys.forEach(key => {
        const match = res.data.find(country => country[key] === 1 ||( country[key] === 3 && key === 'COM_approver'));
        this.signatureData[key] = match || null; // Store the full object or null if no match
    });
      // this.statusDataMainUser = res.data;

    });

  }

  getRemarkTitle(key: string): string {
    const titles: any = {
        'SD_initiater': 'Initiator Remarks',
        'APSO_recommender': 'APSO Remarks',
        'WESEE_recommender': 'DG WESEE Remarks',
        'DEE_recommender': 'DEE Remarks',
        'ACOM_recommender': 'ACOM IT&S Remarks',
        'COM_approver': 'COM Remarks'
    };
    return titles[key] || 'Remarks';
}

@ViewChild('tableContent', { static: false }) tableContent!: ElementRef;

  printPDF(): void {
    const content = this.tableContent.nativeElement.innerHTML;
    const printWindow = window.open('', '', 'width=794,height=1123'); // A4 size

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
          <html>
              <head>
                  <title>Approved Tasking History</title>
                  <style>
                      @page {
                          
                          margin: 20mm 15mm 20mm 15mm; /* Top, Right, Bottom, Left */
                      }

                    body {
    font-family: "Times New Roman", Times, serif;
    margin: 30px;
}


                      .text-center {
                          text-align: center;
                      }

                     .label-text{font-size: 16px;}

.p-datatable .wrap-text {
    max-width: 300px;    /* Limit the maximum width */
    word-wrap: break-word; 
    overflow-wrap: break-word;
  }

  /* General Table Styling */
.custom-table {
    width: 100%;
    border-collapse: collapse;
    
    margin-top: 20px;
}

/* Table Header Styling */
.table-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    background-color: #ffffff;
    padding: 10px;
    // border: 1px solid black;
}

/* Table Labels (Left Column) */
.table-label {
    font-weight: bold;
    padding: 12px;
    width: 60%;
    border: 1px solid rgb(41, 41, 41);
    vertical-align: middle;
    background-color: #ffffff;
    margin:0px !important;
}

/* Table Data (Right Column) */
.table-data {
margin:0px !important;
    padding: 12px;
    width: 40%;
    border: 1px solid rgb(41, 41, 41);
    vertical-align: middle;
    background-color: #ffffff;
}

/* Remark Comments Styling */
.remark-comment {
    font-weight: normal;
    font-style: italic;
    
}


.title-header {
    font-size: 22px;
    font-weight: bold;
    margin:20px
}
                      /* Prevent table breaks across pages */
                      table, tr, td, th {
                          page-break-inside: avoid;
                      }
                  </style>
              </head>
              <body>
                  ${content}
                  <script>
                      window.onload = function() { window.print(); window.close(); }
                  </script>
              </body>
          </html>
      `);
      printWindow.document.close();
    }
  }


  hasHTML(text: string): boolean {
    const regex = /<\/?[a-z][\s\S]*>/i;  // Regex to check for HTML tags
    return regex.test(text);
}


  UploadReceipt(country) {
    this.id=country.id;
    window.open(country.legacy_attachment)
  }
  completedtask(country) {
    this.id=country.id;
    openModal('#completedTask-modal');
  }
  archivetask(country){
    this.id=country.id;
    openModal('#archive-modal')
  }
  commentModal(comment){
    openModal('#comment-modal')
    this.commentForm.patchValue(comment)
  }
  taskid:any;
  opentask(country:any){
    this.resetexportform();
    openModal('#export');
	  this.taskid = country.id;

  }
  data:any;
  approvalData:any;
  pendingAt:any;
  openApproveDialog(countryList) {

    this.id=countryList.id;
    this.approvalData = countryList;
    this.approvalForm.patchValue({id:this.id,tasking:this.id,approved_level:countryList.approved_level,approved_role_id:this.token_detail.role_center[0].user});


    this.dialogRef = this.modalService.open(this.approve);

  }
  approvalType='Recommendation';
  approvalButton='Recommend';
  aTrial:any;
  appLevel:any;

  onApproval()
  {
   this.approvalForm.patchValue({status:"1"});
    triggerClick('#approvalSubmit');
  }
  approved_level:any;
  approved_role_id:any;
  status:any;

  onApprovalSubmit()
  {
   this.showError=true;
   this.approvalForm.value.id=this.approvalData.id;
    this.approvalForm.value.status = this.approvalData.status;
    this.approvalForm.value.approved_role_id = this.token_detail.role_center[0].user;
      if (this.approvalForm.valid) {
        this.api.postAPI(environment.API_URL + "transaction/trials/approval",this.approvalForm.value).subscribe((res) => {

            this.approvalForm.patchValue({comments:''});
           if(res.status==environment.SUCCESS_CODE){
              this.notification.success(res.message);
              this.showError=false;
              this.dialogRef = this.modalService.dismissAll(this.approve);
             this.getTasking();
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




  cancelmodal(){
    closeModal('#tasking-modal');
	closeModal('#export');
  }

 dismissmodal(){
   this.router.navigateByUrl('/tasking-portal/view-tasking-status')
 }



  activeTab: Tabs = "TaskWaiting";
  dialogRef:any;
  approveForm: FormGroup;
  rejectForm: FormGroup;
  statusRef:any;

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }
  page=1;
pageSize=10;
currentPage=0;
  getTasking() {
    this.countryList=[]
      if(this.token_detail.process_id==3 ){
      this.api.postAPI(`${environment.API_URL}transaction/trial/status?`, {
        'tasking_id': this.token_detail.tasking_id,
        'process_id': this.token_detail.process_id,
        'created_by': this.token_detail.user_id
      })
      .subscribe((res) => {
        if(res.status==environment.SUCCESS_CODE){
          this.countryList = res.results;
          this.totalCounts=res.count
        this.dataSourcelist = new MatTableDataSource(this.countryList);
        this.dataSourcelist.paginator = this.pagination;
        }
      });
    }
    else{
      this.api
      .postAPI(
        `${environment.API_URL}transaction/trial/status?page=${this.page}`,
        {
          'tasking_id': this.token_detail.tasking_id,
          'process_id': this.token_detail.process_id
        }
      )
      .subscribe((res) => {
        this.dataSourcelist = new MatTableDataSource(res.data);
        this.countryList = res.results;
        this.totaleRecords = res.count; // Ensure count is defined
        this.currentPage=this.page-1;        this.dataSourcelist.paginator = this.pagination;
        if(res.results.status==environment.SUCCESS_CODE){
        }
      });
    }
  }
  approvalID:any;
  viewlist:any;
  viewStatusDialog(data){
    this.commentForm.get('comments').setValue(null);
    this.data_list=data.id;
    this.viewlist=data
    openModal('#viewTasking-modal');
     this.getstatus(data.id);
    this.taskname = data.task_name
    this.tasknumber = data.task_number_dee
    setTimeout(()=> {
      this.chartOptions = {
        series: [
          {
            name: "Completed",
            data: this.completed
          },
          {
            name: "Pending",
            data: this.pending
          }
        ],
        chart: {
          type: "bar",
          height: 400,
          stacked: true
        },
        colors: ["#008FFB" ,"#FF4560"],
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "20%"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 1,
          colors: ["#fff"]
        },
        grid: {
          xaxis: {
            lines: {
              show: false
            }
          }
        },
        yaxis: {
          min: -100,
          max: 100,
          title: {
          }
        },
        tooltip: {
          shared: false,
          x: {
            formatter: function(val) {
              return val.toString();
            }
          },
          y: {
            formatter: function(val) {
              return Math.abs(val) + "%";
            }
          }
        },
        xaxis: {
          categories: this.name,
          title: {
            text: "Percent"
          },
          labels: {
            formatter: function(val) {
              return Math.abs(Math.round(parseInt(val, 10))) + "%";
            }
          }
        }
      };

   }, 500);
  }

  commentslist:any;
  showcomments=false;
  closeviewlistmodal(){

    this.completed=[];
    this.pending=[];
    this.name=[];
    this.showcomments=false;
    closeModal('#viewTasking-modal');
    this.getTasking();
  }

  closecompletedmodal(){
    closeModal('#completedTask-modal');
  }

  closestatusmodal(){
    closeModal('#trial-status-modal');
  }

  saveviewstatus() {
    this.showcomments=true;
    if(this.commentForm.value.created_by!=null && this.commentForm.value.tasking!=null){
    this.commentForm.value.created_by = this.api.userid.user_id;
    this.commentForm.value.tasking = this.viewlist.id;
    this.commentForm.value.status = '1';
    }

     if (this.commentForm.valid) {
      this.api
        .postAPI(
          environment.API_URL + "transaction/comments/crud",
          this.commentForm.value,

        )
        .subscribe((res) => {
          if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            this.closebutton.nativeElement.click();
            this.showcomments=false;
            this.commentclose()
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
  }

  submitExten(){
    let data = {
      id: '',
      "tasking": this.data_list.id,
      "extension_no": this.extensionForm.value.extensionNumber,
      "description": this.extensionForm.value.description,
      "date": new Date(this.extensionForm.value.extendedTill).toISOString().split('T')[0],
      "authority_letter": this.extensionForm.value.authorityLetterNumber
    };
    if(this.isEditExt){
      data.id=this.extentionId ;
    }
    this.api
    .postAPI(
      environment.API_URL + "transaction/extended/details/",
      data,
      

    )
    .subscribe((res) => {
      if(res.status==environment.SUCCESS_CODE)
         this.notification.success(res.message);
        this.extensionForm.reset();
        closeModal('#extension-modal');
        this.isEditExt=false;
      });
  }
  extentionId:any
  isEditExt:boolean
  extentionData=[]
  extentionDataHeader=[
    { field: 'extension_no', header: 'Extension no', filter: true, filterMatchMode: 'contains' },
    { field: 'authority_letter', header: 'Authority Letter', filter: true, filterMatchMode: 'contains' },
    { field: 'description', header: 'Description', filter: true, filterMatchMode: 'contains' },
    { field: 'date', header: 'Date', filter: true, filterMatchMode: 'contains' },
  
    ]
  extension(){
    this.extentionData=[]
    this.api.getAPI(environment.API_URL + `transaction/extended/details/?tasking_id=${this.data_list.id}`,)
          .subscribe((res) => {
           
            this.extentionData=res;
          })
  
  }
  editExtention(rowData,str){
    this.extentionId = rowData.id;
    if(str==='delete'){
      this.api.postAPI(environment.API_URL + `transaction/extended/details/`,{id:rowData.id,status:3},)
      .subscribe((res) => {
        this.extentionData=res;
        this.extension()
        if(res.status==environment.SUCCESS_CODE)
          this.notification.success(res.message);
      })
    }else{
      this.isEditExt=true;
      this.extensionForm.patchValue({
        extensionNumber:rowData.extension_no,
        authorityLetterNumber:rowData.authority_letter,
        description:rowData.description,
        extendedTill:new Date(rowData.date),
      });
    }
  }
  

  commentDelete(country:any){
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api
        .postAPI(
          environment.API_URL + "transaction/comments/crud",
          {status:'3',comments:'',id:country.id},
        )
        .subscribe((res) => {
          if(res.status === 1){
            this.notification.success(res.message);
          }
          else{
            this.notification.success(res.message);
          }
        })
      }
        dialogRef=null;

      });
    }

    addStatusdata=[];
  getViewStatus(id) {
    this.addStatusdata=[]
    this.api
      .getAPI(environment.API_URL + "transaction/tasking-status?tasking_id="+id)
      .subscribe((res) => {
        this.addStatusdata = res.data;
      });

  }

  addStatusHeader=[
  { field: 'title', header: 'Title', filter: true, filterMatchMode: 'contains' },
  { field: 'secondary_title', header: 'Secondary Title', filter: true, filterMatchMode: 'contains' },
  { field: 'start_date', header: 'Start Date', filter: true, filterMatchMode: 'contains' },
  { field: 'end_date', header: 'End Date', filter: true, filterMatchMode: 'contains' },

  ]
  editOption(view) {
    this.isReadonly=false;
    this.taskingForm.enable();
    this.crudName = "Edit";
    this.populate(view);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    openModal('#tasking-modal');


  }

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "transaction/tasking-status/crud", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn('View Status '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getViewStatus(this.data_list.id);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  taskingID:any;
  close(){
    this.taskingID='';
    closeModal('#tasking-modal');
  }
  archiveclose(){
    closeModal('#archive-modal');
  }
  commentclose(){
    closeModal('#comment-modal');
    this.commentForm.patchValue({comments:''})
  }

  compleList:any;
  savecompleted() {
    this.showcomments=true;
    this.completedForm.value.completed_status = "1";
    this.completedForm.value.tasking=this.id;
     if (this.completedForm.valid) {
      this.api
        .postAPI(
          environment.API_URL + "transaction/completed-view",
          this.completedForm.value,

        )
        .subscribe((res) => {
          if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            this.completedForm.reset();
            this.closebutton.nativeElement.click();
            this.getTasking();
			this.closecompletedmodal();
            this.showcomments=false;
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

  }

  savearchive() {
    this.showcomments=true;
    this.archiveForm.value.tasking=this.id;
     if (this.archiveForm.valid) {
      this.api
        .postAPI(
          environment.API_URL + "transaction/reason-task",
          this.archiveForm.value,

        )
        .subscribe((res) => {
          if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            this.archiveForm.reset();
			closeModal('#archive-modal')
			this.getTasking()
            this.closebutton.nativeElement.click();
            this.showcomments=false;
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
  ;
  }
  approvedDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "transaction/trial/status", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn('Approved Task '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getTasking();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }
  processview = [];
  gettitlelist() {
    this.api
      .getAPI(environment.API_URL + "master/lookup?type__code=PRO")
      .subscribe((res) => {
        this.processview = res.data;
      });
  }
  exports:any
    saveform(taskid:any){
      this.id=taskid;
      this.exportform.value.id = taskid
      window.open(environment.API_URL+"transaction/approved_all_task_excel/"+taskid+"/?initiator="+this.exportform.value.initiator+"&apso="+this.exportform.value.apso+"&wesee="+this.exportform.value.wesee+"&dg_wesee="+this.exportform.value.dg_wesee+"&dee="+this.exportform.value.dee+"&acom="+this.exportform.value.acom+"&com="+this.exportform.value.com+"&tasking="+this.exportform.value.tasking+"&mile="+this.exportform.value.mile)
      closeModal('#export');
      this.resetexportform();
  }

  resetexportform(){
    this.exportform.reset();
  }

  gridColumns=[
    { field: 'task_number_dee', header: 'Tasking Number', filter: true, filterMatchMode: 'contains' },
    { field: 'task_name', header: 'Task Name', filter: true, filterMatchMode: 'contains' },
    { field: 'assigned_tasking_group.tasking_group_name', header: 'Assigned Tasking Group', filter: true, filterMatchMode: 'contains' },
    { field: 'sponsoring_directorate',     header: 'Sponsoring Directorate', filter: true, filterMatchMode: 'contains', },
    { field: 'time_frame_for_completion_month', header: 'Time Frame for Completion', filter: true, filterMatchMode: 'contains',},
    {
      field: 'modified_on',
      header: 'Approved on',
      filter: true,
      filterMatchMode: 'contains',
      valueFormatter: (data: any) => {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(data.modified_on, 'dd-MM-yyyy');
      },
    },
  
    { field: 'legacy_data', header: 'Legacy Data', filter: true, filterMatchMode: 'contains' }
  ]
exportData:any;
filterData:any;
handleFilter(filterValue: any) {
  
  this.filterData = filterValue;
}
handlePagination(event: any) {
  this.getTasking();
  this.page=event.page+1;
  this.currentPage=event.page;
  this.pageSize = event.rows;
  
}
expDataHeader=[
  { field: 'task_number_dee', header: 'Task Number (DEE)' },
  { field: 'task_name', header: 'Task Name' },
  { field: 'cost_implication', header: 'Cost Implication' },
  { field: 'sponsoring_directorate', header: 'Sponsoring Directorate' },
  { field: 'time_frame_for_completion_month', header: 'Time Frame (Months)' },
  { field: 'comments_of_wesee', header: 'Wesee Comments' },
  { field: 'comments_of_dee', header: 'DEE Comments' },
  { field: 'comments_of_apso', header: 'APSO Comments' },
  { field: 'approval_of_com', header: 'COM Approval' },
  { field: 'tasking_status', header: 'Tasking Status' },
  { field: 'legacy_data', header: 'Legacy Data' },
  { field: 'created_by.first_name', header: 'Created By' },
  { field: 'created_on', header: 'Created On' },
  { field: 'modified_on', header: 'Modified On' }
]

downloadexcel() {
  let data = document.getElementById('xlseExport');
  if (!data) {
    console.error('Table element not found.');
    return;
  }

  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Approved Tasks');
  XLSX.writeFile(wb, this.fileName);
  this.exportData=this.dataSourcelist.data
  this.visible=false;
  
}
protected readonly value = signal('');

protected onInput(event: Event) {
  this.value.set((event.target as HTMLInputElement).value);
}
selectedHeader=[]
fileName:string;
isFormHide=false
submitHeaderForm() {
  this.isFormHide=true
    this.selectedHeader = this.xlxsForm.get('header')?.value || [];
    this.fileName = this.xlxsForm.get('fileName')?.value+".xlsx" || 'sheet.xlsx';
    this.xlxsForm.reset()
  }
  selectAll() {
    const allHeaders = this.expDataHeader.map(option => option);
    this.xlxsForm.get('header')?.setValue(allHeaders);
  }

  openPopexportExcel(){
    this.isFormHide=false
    this.visible=true;
    if(this.filterData){
      this.exportData=this.filterData;
    }
    else{
      this.exportData=this.dataSourcelist.data
    }
  }
  handleUpload(rowData: any) {
    }

    onUpload(event) {
      for(let file of event.files) {
         
       }


}
onFileUpload(event) {   
  const formData = new FormData();;
 
     for (let file of event.files) {
       this.file = file;
       formData.append('legacy_attachment', file);
       formData.append('id',this.id);
  }
  this.api.postAPI(environment.API_URL + 'transaction/tasking/crud', formData).subscribe(res=>{
    if (res.status === 1) {
      this.notification.success(res.message);
      this.isfileUpload=false;
      this.getTasking()
    }
    else {
      this.notification.success(res.message);
      
    }
  })
 }

 download(event: any) {
  const url = event.legacy_attachment;
    window.open(url, '_blank');
  
}
onSearch(searchText: string) {
  searchText = searchText.trim();
  this.countryList = [];
  this.totaleRecords = 0;
  this.updateTable();

  if (!searchText) {
    return;
  }
  
  const requestBody = { search: searchText };

  this.api.postAPI(`${environment.API_URL}transaction/trial/status`, requestBody)
    .subscribe({
      next: (res) => {
        this.countryList = res.results || [];
        this.totaleRecords = res?.count || 0;
        if (this.countryList.length === 0) {
          console.warn('No data found, calling getTasking() API...');
          this.getTasking();
        }
        this.updateTable();
      },
      error: (error) => {
        console.error('API Error:', error);
        this.countryList = [];
        this.totaleRecords = 0;

        this.getTasking();
        this.updateTable();
      }
    });
}

updateTable() {
  this.tableDataSource = new MatTableDataSource(this.countryList);
  if (this.paginator) {
    this.tableDataSource.paginator = this.paginator;
  }
  if (this.sort) {
    this.tableDataSource.sort = this.sort;
  }
}





  clearFields() {
    this.searchValue = '';
    this.getTasking();
   
  }

}
