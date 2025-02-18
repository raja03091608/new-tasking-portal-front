import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskBlockComponent } from '../task-block/task-block.component';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { MatColumnDef, MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ConsoleService } from "../../../service/console.service";
import { NotificationService } from "../../../service/notification.service";
import { MatDialog } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { formatDate, PlatformLocation } from "@angular/common";
import { language } from "../../../../environments/language";
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from "../../../confirmation-dialog/confirmation-dialog.component";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import 'datatables.net'
import * as XLSX from 'xlsx';
import { ApexAxisChartSeries, ApexChart, ApexFill, ApexLegend, ApexNonAxisChartSeries, ApexResponsive, ApexDataLabels, ApexGrid, ApexYAxis, ApexXAxis, ApexPlotOptions, ChartComponent, ApexTooltip, ApexStroke, ApexTitleSubtitle } from 'ng-apexcharts';
import moment from 'moment';
import DataTables from 'datatables.net';
declare let $: any;
declare function closeModal(selector): any;
declare function openModal(selector): any;

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Dashboard1Component implements OnInit, OnDestroy {
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  exportDialog: boolean = false;
  dropdownOptions: any[] = [];
  selectedOption: any;
  inputValue: string = '';

  apioverdata1 = [] as any;
  apigroupdata1 = [] as any;
  apidistributiondata1 = [] as any;
  apiyearlytaskdata1 = [] as any;
  value: string = '';
  visible: boolean = false;
  visible1: boolean = false;
  visible2: boolean = false;
  visible3: boolean = false;
  visible4: boolean = false;
  visibleExcel: boolean = false;
  yearlytaskdata = [] as any;
  overdata = [] as any;
  Pendingdata = [] as any;
  groupdata = [] as any;
  distributiondata = [] as any;
  statusTaskingNew = [] as any;
  newTableDataSource = new MatTableDataSource([]);

  currentYear = new Date().getFullYear();
  currentDate1 = new Date();
  xlxsForm: FormGroup;
  selectedHeader = []
  isFormHide = false;
  exportData: any;
  filterData: any;
  fileName: string;
  searchValue: string = '';
  expDataHeader = [
    { field: 'tasking.task_name', header: 'Task Name', },
    { field: 'tasking.task_number_dee', header: 'Task Number', },
    { field: 'tasking.sponsoring_directorate', header: 'Sponsoring Directorate', },
    { field: 'assigned_tasking_group.name', header: 'Assigned Tasking Group Name', },
    { field: 'start_date', header: 'Start Date' },
    { field: 'end_date', header: 'End Date' },
    { field: 'title', header: 'Title' },
    { field: 'secondary_title', header: 'Secondary Title' },
    { field: 'status_summary', header: 'Status Summary' },
    { field: 'tasking.comments_of_dee', header: 'Dee Comments' },
    { field: 'tasking.approval_of_com', header: 'COM Comments' },
    { field: 'tasking.recommendation_of_acom_its', header: 'ACOM Comments' },
    { field: 'tasking.time_frame_for_completion_month', header: 'Comepletion Months' },

    { field: 'tasking.comments_of_wesee', header: 'Wesee Comments' },
    { field: 'tasking.comments_of_apso', header: 'APSO Comments' },
    { field: 'tasking.task_description', header: 'Task Description' }
  ];
  gridData: any[];
  totaleRecords: any;
  tableDataSource: MatTableDataSource<unknown, MatPaginator>;

  downloadexcel() {
    let data = document.getElementById('xlseExport');
    if (!data) {
      console.error('Table element not found.');
      return;
    }

    // Create a worksheet from the table
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    // Create a new workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Approved Tasks');

    // Write the workbook to a file with .xlsx extension
    XLSX.writeFile(wb, this.fileName);
    this.exportData = this.dataSourcelist.data
    this.visibleExcel = false;

  }
  protected onInput(event: Event) {
    // this.value.((event.target as HTMLInputElement).value);
    this.value = (event.target as HTMLInputElement).value;

  }

  displayedColumns: string[] = [
    "task_number_dee",
    "task_name",
  ];
  displayedColumnsNewTable: string[] =
    [
      'task_name',
      'task_Number_dee',
      'sponsoring_directorate',
      'assigned_tasking_group',
      'secondary_title',
      'Action'
    ];

  displayedColumnslist: string[] = [
    "tasking_status",
    "milestone",
    "percentage_completion",
    "budget_utilized",
    "manpower",
    "task_start_date",
    "task_end_date",
    "edit",
    "delete",
  ];
  displayedColumnsview: string[] = [
    "milestone",
    "percentage_completion",
    "budget_utilized",
    "manpower",
    "task_start_date",
    "task_end_date",
  ];

  public permission = {
    add: false,
    view: false,
    gwtcG: false,
    tsdG: false,
    ywtcG: false,
    twedBYG: false,
    otsBYG: false,
    mtP: false,
    tatC: false,
    twaC: false,
    atC: false,
    santC: false
  };
  @ViewChild('template') template: ElementRef;
  @ViewChild('template1') template1: ElementRef;
  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @Input() myinputMsg: any;
  deleteProjectRef: any;
  TaskBlockRef: any;
  username: any;
  filterValue: any;
  country: any;
  ImageUrl: string;
  ImageUrl1: string;
  ImageUrl2: string;
  ImageUrl3: string;
  ImageUrl4: string;
  ImageUrl5: string;
  ImageUrl6: string;
  ImageUrl7: string;
  ImageUrl8: string;
  image: any;
  items: any = [];
  task_start_date: string;
  task_end_date: string;
  public crudName = "Save";
  public countryList = [];
  public mileList = [];
  editorConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    minHeight: '15rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    defaultFontSize: '3',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['subscript', 'superscript'],
      ['fontSize', 'toggleEditorMode', 'customClasses']
    ],
    outline: true
  };
  isReadonly = false;
  moduleAccess: any;
  ErrorMsg: any;
  error_msg = false;
  showError = false;
  sub: any;

  dataSource: MatTableDataSource<any>;
  dataSourcelist: MatTableDataSource<any>;
  dataSourceDel: MatTableDataSource<any>;
  dataSourceStatus: MatTableDataSource<any>;
  public statusTasking = [];
  public statusTaskinglist = [];
  token_details: any;
  allocateForm: FormGroup;
  distribution: any;
  overdata1: any;
  groupdata1: any;
  distributiondata1: any;
  extenddata: any;
  chartData: any = {
    series: [],
  };
  constructor(private ref: ChangeDetectorRef, private modalService: NgbModal, private logger: ConsoleService, private route: ActivatedRoute, public api: ApiService, private notification: NotificationService, private dialog: MatDialog, private elementref: ElementRef, public datepipe: DatePipe, private router: Router, private platformLocation: PlatformLocation) {
    this.token_details = this.api.decryptData(localStorage.getItem('token-detail'));
    this.xlxsForm = new FormGroup({
      header: new FormControl([]),
      fileName: new FormControl(''),
    })

    this.allocateForm = new FormGroup({
      id: new FormControl(""),
      tasking_group: new FormControl(""),
      tasking: new FormControl(""),
      created_by: new FormControl(""),
      created_role: new FormControl(this.token_details.role_id),
    });
    platformLocation.onPopState(() => this.cancelmodal());
    enum ChangeDetectionStrategy {
      OnPush = 0,
      Default = 2
    }
    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 10);
    this.sub = this.route.data
      .subscribe((v: any) => {
        this.username = v.some_data
      });
   


   

  }



  taskForm = new FormGroup({
    id: new FormControl(""),

    status: new FormControl(""),
    comment_status: new FormControl(""),
    //   });
    sdForm: new FormGroup({
      sponsoring_directorate: new FormControl("", [Validators.required]),
      SD_comments: new FormControl(""),
      task_description: new FormControl(""),
      task_name: new FormControl(""),
      details_hardware: new FormControl(""),
      details_software: new FormControl(""),
      details_systems_present: new FormControl(""),
      ships_or_systems_affected: new FormControl(""),
      file: new FormControl("",),
    }),
    weseeForm: new FormGroup({
      id: new FormControl(""),
      cost_implication: new FormControl(""),
      comments_of_wesee: new FormControl(""),
      comments_of_tasking_group: new FormControl(""),
      time_frame_for_completion_days: new FormControl(""),
      time_frame_for_completion_month: new FormControl(""),
    }),
    deeForm: new FormGroup({
      task_number_dee: new FormControl(""),
      comments_of_dee: new FormControl(""),
    }),
    acomForm: new FormGroup({
      recommendation_of_acom_its: new FormControl(""),
    }),
    comForm: new FormGroup({
      approval_of_com: new FormControl(""),
    }),
    apsoForm: new FormGroup({
      comments_of_apso: new FormControl(""),
    })
  });
  public MileStoneForm = new FormGroup({
    id: new FormControl(""),
    milestone: new FormControl(""),
    task_start_date: new FormControl(""),
    task_end_date: new FormControl(""),
    percentage_completion: new FormControl(""),
    budget_utilized: new FormControl(""),
    manpower: new FormControl(""),
    tasking: new FormControl(""),
    status: new FormControl(""),
    tasking_status: new FormControl(""),

  });
  status = this.taskForm.value.status;
  showSD = false;
  populate(data, tasking) {
    this.taskForm.get('weseeForm').patchValue(data);
    this.taskForm.get('deeForm').patchValue(data);
    this.taskForm.get('acomForm').patchValue(data);
    this.taskForm.get('comForm').patchValue(data);
    this.taskForm.get('apsoForm').patchValue(data);
    if (data.sponsoring_directorate == 'Others') {
      this.showSD = true;
      this.taskForm.patchValue({ sdForm: { SD_comments: data.SD_comments } })
    } else {
      this.showSD = false;
    }

    this.taskForm.patchValue({ sdForm: { sponsoring_directorate: data.sponsoring_directorate, task_name: data.task_name, task_description: data.task_description } })


    this.allocateForm.patchValue({ tasking_group: tasking?.assigned_tasking_group?.id });


    if (data ? data.file : "") {
      var img_link = data.file;
      this.ImageUrl = img_link;
    } else {
      this.ImageUrl = ""
    }

    if (data ? data.file1 : "") {
      var img_link1 = data.file1;
      this.ImageUrl1 = img_link1;
    } else {
      this.ImageUrl1 = ""
    }

    if (data ? data.file2 : "") {
      var img_link2 = data.file2;
      this.ImageUrl2 = img_link2;
    } else {
      this.ImageUrl2 = ""
    }
    if (data ? data.file3 : "") {
      var img_link3 = data.file3;
      this.ImageUrl3 = img_link3;
    } else {
      this.ImageUrl3 = ""
    }

    if (data ? data.file4 : "") {
      var img_link4 = data.file4;
      this.ImageUrl4 = img_link4;
    } else {
      this.ImageUrl4 = ""
    }
    if (data ? data.file5 : "") {
      var img_link5 = data.file5;
      this.ImageUrl5 = img_link5;
    }
    else {
      this.ImageUrl5 = ""
    }
    if (data ? data.file6 : "") {
      var img_link6 = data.file6;
      this.ImageUrl6 = img_link6;
    }
    else {
      this.ImageUrl6 = ""
    }

    if (data ? data.file7 : "") {
      var img_link7 = data.file7;
      this.ImageUrl7 = img_link7;
    }
    else {
      this.ImageUrl7 = '';
    }

    if (data ? data.file8 : "") {
      var img_link8 = data.file8;
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

  Error = (controlName: string, errorName: string) => {
    return this.taskForm.controls[controlName].hasError(errorName);
  };

  statusValue = [];
  series: any;
  dataValue = [];
  chart_data = [];
  pending = [];
  name = [];
  completed = [];
  nameData = [];
  time_data: any;


  tasking_chart = [];


  token_detail: any;
  tasking_ID: any;
  getAccess() {
    this.moduleAccess = this.api.getPageAction();

    if (this.moduleAccess) {

      let addPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'ADD') return access.status; }).map(function (obj) { return obj.status; });
      let viewPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'VIW') { return access.status; } }).map(function (obj) { return obj.status; });;
      this.permission.add = addPermission.length > 0 ? addPermission[0] : false;
      this.permission.view = viewPermission.length > 0 ? viewPermission[0] : false;;

    }

  }
  ngOnInit(): void {
    this.getTicketCounts()
    this.getJSON()
    this.getStatus();
    this.getNewTaskingStatus();
    this.token_detail = this.api.decryptData(localStorage.getItem('token-detail'));
    this.getTasking();
    this.getDashboardCount();
    this.getAccess();
    this.getTaskingGroups();
    this.tasklist();
    this.getChart();
  }

  getJSON() {
    let acceaa = this.api.getAccessJson();
    if (acceaa) {
      acceaa.find((x: any) => x.url === 'dashboard/dashboard1').action.map((y: any) => {
        if (y.code === 'ADD') {
          this.permission.add = y.status;
        }
        if (y.code === 'VIW') {
          this.permission.view = y.status;
        }
        if (y.code === 'GWTC') {
          this.permission.gwtcG = y.status;
        }
        if (y.code === 'OTS') {
          this.permission.otsBYG = y.status;
        }
        if (y.code === 'MTS') {
          this.permission.mtP = y.status;
        }
        if (y.code === 'TWAT') {
          this.permission.twaC = y.status;
        }
        if (y.code === 'NEW Task') {
          this.permission.santC = y.status;
        }
        if (y.code === 'Archive Task') {
          this.permission.atC = y.status;
        }
        if (y.code === 'TSD') {
          this.permission.tsdG = y.status;
        }
        if (y.code === 'YWTC') {
          this.permission.ywtcG = y.status;
        }
        if (y.code === 'TED') {
          this.permission.twedBYG = y.status;
        }
        if (y.code === 'TAT') {
          this.permission.tatC = y.status;
        }
      });
    }
  }
  showDialog() {
    this.getyearData();
    this.visible = true;
  }
  showDialog1() {
    this.getdistribution();
    this.visible1 = true;
  }
  showDialog2() {
    this.getoverdue();
    this.visible2 = true;
  }
  showDialog3() {
    this.getpendingdata();
    this.visible3 = true;
  }
  showDialog4() {
    this.getgroupwise()
    this.visible4 = true;
  }
  onTaskChange(taskname: any) {

    this.getChart(taskname.id);
  }

  maybeDisposeRoot(divId) {
    am5.array.each(am5.registry.rootElements, function (root) {
      if (root && root.dom.id == divId) {
        root.dispose();
      }
    });
  };
  getChart(task_id = "") {
    this.maybeDisposeRoot("chartChartDetailModule")
    let root = am5.Root.new("chartChartDetailModule");
    root.dateFormatter.setAll({
      dateFormat: "yyyy-MM-dd",
      dateFields: ["valueX", "openValueX"]
    });

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout
    }));


    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    }))

    let colors = chart.get("colors");
    root.interfaceColors.set("grid", am5.color(0x058a342));

    var tasking_chartname = [];
    var tasking_chart_name = [];
    if (this.token_detail.process_id == 3) {

      this.api
        .postAPI(environment.API_URL + "transaction/taskingchart", { 'created_by': this.token_detail.user_id })
        .subscribe((res) => {
          let kj = 0;
          let km = 0;
          if (task_id != '') {

            var statusTaskingList = res.data.filter(task => task.tasking_id === task_id);
          }
          else {
            statusTaskingList = res.data;
          }

          for (let k = 0; k < statusTaskingList.length; k++) {
            tasking_chart_name.push({ category: statusTaskingList[k].tasking__task_name });
            tasking_chart_name = tasking_chart_name.filter((test, index, array) =>
              index === array.findIndex((findTest) =>
                findTest.category === test.category
              )
            );
            km += 2;
            if (statusTaskingList[k].title) {
              if (statusTaskingList[k].start_date != '' && statusTaskingList[k].end_date != '' && statusTaskingList[k].title != '') {
                {

                  tasking_chartname.push({ category: statusTaskingList[k].tasking__task_name, start: new Date(statusTaskingList[k].start_date).getTime(), end: new Date(statusTaskingList[k].end_date).getTime(), columnSettings: { fill: am5.Color.brighten(colors.getIndex(km), kj) }, task: statusTaskingList[k].title })
                }

              }
              kj += 0.4;
            }
          }
        });
    }
    else {
      this.api
        .postAPI(environment.API_URL + "transaction/taskingchart", {})
        .subscribe((res) => {
          let kj = 0;
          let km = 0;
          if (task_id != '') {
            var statusTaskingList = res.data.filter(task => task.tasking_id === task_id);
          }
          else {
            statusTaskingList = res.data;
          }

          for (let k = 0; k < statusTaskingList.length; k++) {
            tasking_chart_name.push({ category: statusTaskingList[k].tasking__task_name });
            tasking_chart_name = tasking_chart_name.filter((test, index, array) =>
              index === array.findIndex((findTest) =>
                findTest.category === test.category
              )
            );
            km += 2;
            if (statusTaskingList[k].title) {
              if (statusTaskingList[k].start_date != '' && statusTaskingList[k].end_date != '' && statusTaskingList[k].title != '') {
                {

                  tasking_chartname.push({ category: statusTaskingList[k].tasking__task_name, start: new Date(statusTaskingList[k].start_date).getTime(), end: new Date(statusTaskingList[k].end_date).getTime(), columnSettings: { fill: am5.Color.brighten(colors.getIndex(km), kj) }, task: statusTaskingList[k].title })
                }

              }
              kj += 0.4;
            }
          }
        });
    }
    if (this.token_detail.process_id == 3) {
      this.api
        .postAPI(environment.API_URL + "transaction/dashboard-taskstatus", { 'created_by': this.token_detail.user_id })
        .subscribe((res) => {
          this.statusTaskinglist = res.data;
        });
    }
    else {
      this.api
        .postAPI(environment.API_URL + "transaction/dashboard-taskstatus", {})
        .subscribe((res) => {
          this.statusTaskinglist = res.data;
        });
    }

   

   
  }









  taskName: any;
  task_list: any;
  created_by: any;
  tasklist() {
    if (this.token_detail.process_id == 3) {
      this.created_by = this.token_detail.user_id;
    }
    else {
      this.created_by = ''
    }
    let search = this.created_by != '' ? 'created_by=' + this.created_by : ''

    this.api
      .postAPI(environment.API_URL + "transaction/trial/status", { 'tasking_id': this.token_detail.tasking_id, 'process_id': this.token_detail.process_id, search })
      .subscribe((res) => {
        if (res.status == environment.SUCCESS_CODE) {
          this.task_list = res.data;
          this.dataTask = res.data;
        }
      });
  }
  dataTask = [] as any;
  getTasking() {
    if (this.token_detail.process_id == 2 && this.token_detail.department_id == 1) {
      this.api.postAPI(environment.API_URL + "transaction/trial/status", { 'process_id': this.token_detail.process_id, 'created_by': this.token_detail.user_id, 'tasking_id': '' })
        .subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            this.dataSource = new MatTableDataSource(res.data);
            this.countryList = res.data;
            this.dataSource.paginator = this.pagination;
          }

        });

    }
    else if (this.token_detail.process_id == 3 && this.token_detail.tasking_id != '') {
      this.api
        .postAPI(environment.API_URL + "transaction/trial/status", { 'tasking_id': this.token_detail.tasking_id, 'process_id': this.token_detail.process_id, 'created_by': this.token_detail.user_id })
        .subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            this.dataSource = new MatTableDataSource(res.data);
            this.countryList = res.data;
            this.dataSource.paginator = this.pagination;
          }
        });

    }
    else {
      this.api
        .postAPI(environment.API_URL + "transaction/trial/status", { 'process_id': this.token_detail.process_id, 'tasking_id': '' })
        .subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            this.dataSource = new MatTableDataSource(res.data);
            this.countryList = res.data;
            this.dataSource.paginator = this.pagination;
          }
        });

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
  currentDate: Date;

  onSubmit() {
    this.showError = true;
    this.currentDate = new Date();
    const cValue = formatDate(this.currentDate, 'yyyy', 'en-US');
    const ccValue = formatDate(this.currentDate, 'dd', 'en-US');
    (new Date(), 'yyyy/MM/dd', 'en');
    this.taskForm.get('deeForm').value.task_number_dee;
    if (this.taskForm.get('deeForm').value.task_number_dee != '') {
      this.taskForm.get('deeForm').value.task_number_dee = 'WESEE/' + this.taskForm.get('deeForm').value.task_number_dee + '/' + cValue + '/' + ccValue;
    }
    const formData = new FormData();
    formData.append('sponsoring_directorate', this.taskForm.get('sdForm').value.sponsoring_directorate);
    formData.append('task_description', this.taskForm.get('sdForm').value.task_description);
    formData.append('task_name', this.taskForm.get('sdForm').value.task_name);
    formData.append('details_hardware', this.taskForm.get('sdForm').value.details_hardware);
    formData.append('details_software', this.taskForm.get('sdForm').value.details_software);
    formData.append('details_systems_present', this.taskForm.get('sdForm').value.details_systems_present);
    formData.append('ships_or_systems_affected', this.taskForm.get('sdForm').value.ships_or_systems_affected);
    formData.append('id', this.taskForm.value.id);
    let splitFirst = this.taskForm.get('deeForm').value.task_number_dee.split("/")[1]
    formData.append('cost_implication', this.taskForm.get('weseeForm').value.cost_implication);
    formData.append('time_frame_for_completion_days', this.taskForm.get('weseeForm').value.time_frame_for_completion_days);
    formData.append('time_frame_for_completion_month', this.taskForm.get('weseeForm').value.time_frame_for_completion_month);
    formData.append('comments_of_wesee', this.taskForm.get('weseeForm').value.comments_of_wesee);
    formData.append('task_number_dee', splitFirst);
    formData.append('comments_of_dee', this.taskForm.get('deeForm').value.comments_of_dee);
    formData.append('recommendation_of_acom_its', this.taskForm.get('acomForm').value.recommendation_of_acom_its);
    formData.append('approval_of_com', this.taskForm.get('comForm').value.approval_of_com);
    formData.append('modified_by', this.api.userid.user_id);
    if (this.taskForm.valid) {
      this.api
        .postAPI(
          environment.API_URL + "transaction/tasking/crud",
          formData,
        )

        .subscribe((res) => {
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

  editOption(milestone) {
    this.isReadonly = false;
    this.MileStoneForm.enable();
    this.crudName = "Edit";
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    openModal('#crud-milestone');
  }
  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.postAPI(environment.API_URL + "transaction/milestone-status/crud", {
          id: id,
          status: 3,
        }).subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            this.notification.warn('Milestone ' + language[environment.DEFAULT_LANG].deleteMsg);
            // this.getMileStone();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef = null;
    });
  }
  OnMileStoneSubmit() {
    this.showError = true;
    this.MileStoneForm.patchValue({ task_start_date: this.datepipe.transform(this.task_start_date, 'yyyy-MM-dd') });
    this.MileStoneForm.patchValue({ task_end_date: this.datepipe.transform(this.task_end_date, 'yyyy-MM-dd') });
    const formData = new FormData();
    formData.append('milestone', this.MileStoneForm.value.milestone);
    formData.append('tasking', this.taskingID);
    formData.append('percentage_completion', this.MileStoneForm.value.percentage_completion);
    formData.append('budget_utilized', this.MileStoneForm.value.budget_utilized);
    formData.append('task_start_date', this.MileStoneForm.value.task_start_date);
    formData.append('task_end_date', this.MileStoneForm.value.task_end_date);
    formData.append('id', this.MileStoneForm.value.id);
    formData.append('manpower', this.MileStoneForm.value.manpower);
    formData.append('tasking_status', this.MileStoneForm.value.tasking_status);
    formData.append('modified_by', this.api.userid.user_id);
    if (this.MileStoneForm.valid) {
      // this.MileStoneForm.value.created_by = this.api.userid.user_id;
      this.MileStoneForm.value.status = "1";
      this.api.postAPI(environment.API_URL + "transaction/milestone-status/crud", formData).subscribe((res) => {
        //this.error= res.status;
        if (res.status == environment.SUCCESS_CODE) {
          // this.logger.log('Formvalue',this.editForm.value);
          this.notification.success(res.message);
          //  this.getMileStone();
          let reset = this.formGroupDirective.resetForm();
          if (reset !== null) {
            this.initForm();
          }
          //  this.closebutton.nativeElement.click();
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
  ngAfterViewInit() {
  }

  count: any;
  count1: any;
  count2: any;
  count3: any;
  archive_count: any;
  countlist: any;
  totalCounts:number=0;

  getDashboardCount() {
    this.api.getAPI(`${environment.API_URL}transaction/archive_list`)
      .subscribe((res) => {
        if (res?.status === environment.SUCCESS_CODE && res?.data) {
          this.archive_count = res.results.data|| 0;  // Ensure it's always a number
        }
      });
      if (this.token_detail.role_id == 3) {

        this.api.getAPI(
          `${environment.API_URL}transaction/tasking/count?comment_status=3&page=${this.page}&created_by_id=${this.token_detail.user_id}`
        ).subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            this.countlist = res.results.data;
            this.count = res.results.data;
            this.totalCounts=res.count;
          }
        });
        
        this.api.getAPI(environment.API_URL + "transaction/tasking/count?comment_status=1" + "&created_by_id=" + this.token_detail.user_id).subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            this.count2 = res.data.length;
          }
  
        });
  
      }
  
      else if (this.token_detail.process_id == 3) {
  
  
        this.api.getAPI(`${environment.API_URL}transaction/tasking/count?comment_status=3&page=${this.page}&assignedtaskinggroup__tasking_group__id=${this.token_detail.tasking_id}`
        ).subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            // this.dataSourcelist = new MatTableDataSource(res.results.data);
            this.countlist = res.results.data;
            this.count = res.results.data;
            this.totalCounts=res.count;
          }
        });
        
        this.api.getAPI(environment.API_URL + "transaction/tasking/count?comment_status=1").subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            this.count2 = res.data.length;
          }
        });
      }
      else {
        this.api.getAPI(`$environment.API_URL + "transaction/tasking/count?comment_status=3&page=${this.page}`).subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            this.countlist = res.data;
            this.count = res.results.data;
            this.totalCounts=res.count;
  
          }
        });
        this.api.getAPI(environment.API_URL + "transaction/tasking/count?comment_status=1").subscribe((res) => {
          if (res.status == environment.SUCCESS_CODE) {
            this.count2 = res.data.length;
          }
        });
  
      }
  }
  openView() {
    this.TaskBlockRef = this.modalService.open(TaskBlockComponent, { size: 'lg' });
    this.TaskBlockRef.componentInstance.modelData = { 'data': 'view' };
  }
  task_del: any;

  id: any;
  list: any;
  openEdit(country) {
    this.isReadonly = false;
    this.crudName = "View";
    this.id = country.id;
    this.populate(country.tasking, country);
    this.list = country;
    this.taskForm.disable();
    openModal('#crud-countries');
  }
  openDelete() {
    this.deleteProjectRef = this.modalService.open(this.template);

  }
  taskingID: any;
  openPopup(id) {
    this.taskingID = id;
    openModal('#crud-milestone');
    setTimeout(() => {
    }, 2000);
  }
  openview(id) {
    this.router.navigateByUrl("/dashboard/view-task?tasking_id=" + btoa(id));

  }
  openlistitem(id) {
    this.taskingID = id;
    openModal('#view-milestone');


  }
  ngOnDestroy() {
  }
  imgToUpload: any;
  onImageHandler(event) {
    if (event.target.files.length > 0) {
      this.imgToUpload = event.target.files[0];
    };
  }
  cancelmodal() {
    closeModal('#crud-countries');
    closeModal('#crud-milestone');
    closeModal('#view-milestone');
  }

  close() {
    this.taskingID = '';
    let data = [];
    this.dataSourcelist = new MatTableDataSource(data);
    closeModal('#crud-milestone');
  }

  closeview() {
    this.taskingID = '';
    let data = [];
    this.dataSourcelist = new MatTableDataSource(data);
    closeModal('#view-milestone');
  }

  taskingGroups: any;
  getTaskingGroups() {
    this.api.getAPI(environment.API_URL + "master/taskinggroups").subscribe((res) => {
      this.taskingGroups = res.data;
    });
  }
  statusData: any;
  getStatus() {
    this.api.getAPI(environment.API_URL + "master/lookup?type__code=PRO").subscribe((res) => {
      this.statusData = res.data;
    });
  }

  getyearData() {
    this.api.getAPI(environment.API_URL + 'transaction/yearly-task-status/')
      .subscribe((res: any) => {
        this.yearlytaskdata = res;
      },
        (error) => {
        }
      )
  }
  getoverdue() {
    this.api.getAPI(environment.API_URL + 'transaction/overdue-by-group/').subscribe((res: any) => {
      this.overdata = res.data;
      this.overdata = res.data.flatMap((group: any) =>
        group.tasks.map((task: any) => ({
          ...task,
          sponsoring_directorate: group.sponsoring_directorate
        }))
      );
    },
      
    )

  }

  getpendingdata() {
    this.api.getAPI(environment.API_URL + 'transaction/pending-by-group/').subscribe((res: any) => {
      this.Pendingdata = res.data;
    },
    )
  }
  getgroupwise() {
    this.api.getAPI(environment.API_URL + 'transaction/group-wise/').subscribe((res: any) => {
      this.groupdata = res.data;
    });
  }
  getdistribution() {
    this.api.getAPI(environment.API_URL + 'transaction/task-distribution').subscribe((res: any) => {
      this.distributiondata = res.data;
    }
    );
  }


  
  

  tabledata(data: any) {

  }
  page=1;
  pageSize=10;
  currentPage=0;
  approveTask = [] as any
  getNewTaskingStatus() { 
    this.approveTask = [];
    this.api.getAPI(`${environment.API_URL}/transaction/tasking-status?flag=dashboard&page=${this.page}`)
    .subscribe(
      (res: any) => {
        if (res?.results?.data) {
          this.approveTask = res.results.data;
          this.currentPage=this.page-1;
          this.totaleRecords = res.count; // Ensure count is defined
        } 
      },
    );
}



  handleFilter(filterValue: any) {
    this.filterData = filterValue;
  }
  handlePagination(event: any) {
    this.page=event.page+1;
    this.getNewTaskingStatus();
    this. getDashboardCount();
    this.currentPage=event.page;
    this.pageSize = event.rows;
  
    
}

  gridColum = [
    { field: 'tasking.task_name', header: 'Task Name', filter: true, filterMatchMode: 'contains' },
    { field: 'tasking.task_number_dee', header: 'Task Number', filterMatchMode: 'contains', filter: false, },
    { field: 'tasking.sponsoring_directorate', header: 'Sponsoring Directorate', filter: true, filterMatchMode: 'contains' },
    { field: 'assigned_tasking_group.name', header: 'Assigned Tasking Group Name', filter: true, filterMatchMode: 'contains' },
    { field: 'title', header: 'Title', filter: true, filterMatchMode: 'contains' },
    { field: 'secondary_title', header: 'Status', filter: true, filterMatchMode: 'contains' },

  ]

  exportToExcel1() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.approveTask);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  }



  saveAsExcelFile() {
    let data = document.getElementById('xlseExport');
    if (!data) {
      console.error('Table element not found.');
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Approved Tasks');

    XLSX.writeFile(wb, this.fileName);
    this.exportData = this.approveTask
    this.visible = false;

  }

  submitToExcel() {

    this.visibleExcel = true;
    this.isFormHide = false

    if (this.filterData) {
      this.exportData = this.filterData;
    }
    else {
      this.exportData = this.approveTask
    }
  }
  submitHeaderForm() {
    this.isFormHide = true
    // Extract form values
    this.selectedHeader = this.xlxsForm.get('header')?.value || [];
    this.fileName = this.xlxsForm.get('fileName')?.value + ".xlsx" || 'sheet.xlsx';
    this.xlxsForm.reset()
  }
  selectAll() {
    const allHeaders = this.expDataHeader.map(option => option);
    this.xlxsForm.get('header')?.setValue(allHeaders);
  }


  get filteredTasks() {
    const search = this.searchValue.toLowerCase();
    return this.overdata.filter(task =>
      task.tasking__task_name?.toLowerCase().includes(search) ||
      task.tasking__tasking_group_name?.toLowerCase().includes(search) ||
      task.sponsoring_directorate?.toLowerCase().includes(search) ||
      task.tasking__task_number_dee?.toLowerCase().includes(search)
    );
  }



  getFileNameFromUrl(url: string): string {
    return url ? url.substring(url.lastIndexOf('/') + 1) : '';
}
onSearch(searchText: string) {
  if (!searchText.trim()) {
    this.approveTask = []; 
    return;
  }
  this.approveTask = []; 
  this.api.getAPI(`${environment.API_URL}transaction/tasking-status?flag=dashboard&search=${searchText}`).subscribe(
    (res) => {
      if (res && res.results && res.results.data && res.results.data.length > 0) {
        this.approveTask = res.results.data;
        this.totaleRecords = res.count; 
      } else {
        this.approveTask = []; 
        console.warn('No matching data found.');
        this.getNewTaskingStatus();
      }
    },
   
  );
}
updateTable() {
  this.tableDataSource = new MatTableDataSource(this.approveTask);
}
  clearFields() {
    this.searchValue = '';
    this.getNewTaskingStatus();
   
  }
  getTicketCounts(): void {
    this.api.getAPI(environment.API_URL + 'transaction/dashboard-cards')  // Replace with your actual API URL
      .subscribe(
        (response) => {
          this.count = response.approved_count || 0;
          this.count2 = response.waiting_for_approval || 0;
          this.archive_count = response.archive_count || 0;
        },
        (error) => {
          console.error('Error fetching ticket counts', error);
        }
      );
}



}


