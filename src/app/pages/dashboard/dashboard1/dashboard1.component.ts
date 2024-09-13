import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input,OnDestroy, OnInit, ViewChild } from '@angular/core';
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
//import { NgZone } from '@angular/core'

import { ApexAxisChartSeries, ApexChart, ApexFill,ApexLegend,ApexNonAxisChartSeries,ApexResponsive, ApexDataLabels, ApexGrid, ApexYAxis, ApexXAxis, ApexPlotOptions, ChartComponent, ApexTooltip,ApexStroke,ApexTitleSubtitle } from 'ng-apexcharts';
import moment from 'moment';
import DataTables from 'datatables.net';
declare let $: any;
declare function closeModal(selector): any;
declare function openModal(selector): any;


// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   fill: ApexFill;
//   dataLabels: ApexDataLabels;
//   grid: ApexGrid;
//   yaxis: ApexYAxis;
//   xaxis: ApexXAxis;
//   plotOptions: ApexPlotOptions;
//   tooltip:ApexTooltip;
// };
// export type ChartOptions21 = {
// 	series: ApexAxisChartSeries;
// 	chart: ApexChart;
// 	xaxis: ApexXAxis;
// 	yaxis: ApexYAxis;
// 	title: ApexTitleSubtitle;
// 	plotOptions: ApexPlotOptions;
// 	fill: ApexFill;
// 	dataLabels: ApexDataLabels;
// 	legend: ApexLegend;
//   };

export type chartOptionsGroup = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  colors: string[];
  dataLabels: ApexDataLabels;
  };

  export type ChartOptions22 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
  };
  
  
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
};
export type ChartOptions1 = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	fill: ApexFill;
	legend: ApexLegend;
	xaxis: ApexXAxis;
	plotOptions: ApexPlotOptions;
  };

  export type ChartOptions2 = {
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

  export type ChartOptions3 = {
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
	fill: ApexFill;
	legend: ApexLegend;
    title: ApexTitleSubtitle;
  };

  export type ChartOptions11 = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	xaxis: ApexXAxis;
	dataLabels: ApexDataLabels;
	title: ApexTitleSubtitle;
	plotOptions: ApexPlotOptions;
  };

  export type ChartOptions12 = {
	series: ApexNonAxisChartSeries;
	chart: ApexChart;
	labels: any;
	responsive: ApexResponsive[];
	legend: ApexLegend;
	dataLabels: ApexDataLabels;
	title: ApexTitleSubtitle;
  colors: string[];
  };

  export type ChartOptions13 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
    plotOptions: ApexPlotOptions;
    fill: any;
  };

  export type ChartOptions14 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
    plotOptions: ApexPlotOptions;
    fill: any;
  };


@Component({
  selector: 'app-dashboard1',
  templateUrl:'./dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss'],
  providers:[DatePipe],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Dashboard1Component implements OnInit,OnDestroy {
  
  apioverdata1=[] as any;
  apigroupdata1=[]as any;
  apidistributiondata1=[] as any;
  apiyearlytaskdata1=[]as any;
  value: string = '';
  visible: boolean = false;
  visible1:boolean=false;
  visible2:boolean=false;
  visible3:boolean=false;
  visible4:boolean=false;
  yearlytaskdata=[] as any;
  overdata=[] as any;
  Pendingdata=[] as any;
  groupdata=[] as any;  
  distributiondata=[] as any;
  statusTaskingNew=  [] as any;
  newTableDataSource = new MatTableDataSource([]);


	projects: any[] = [
		{ name: 'Navy3005', code: '30/5/2024', status: 'INITIATION STARTED' },
		{ name: 'PT-0107', code: '1/7/2024', status: 'INITIATION STARTED' }
	  ];
  currentYear = new Date().getFullYear();
  currentDate1 = new Date();

  displayedColumns: string[] = [
		"task_number_dee",
		// "task_description",
    "task_name",
		// "file",
		// "due_date",
		// "assignee",
  //   // "sponsoring_directorate",
  //   'title',
  // 'secondary_title',
  // 'start_date',
  // 'end_date',
  // 'project_progress',
  // 'status_summary',
  // 'Action'
    


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
    add:false,
    view:false,
  };
  @ViewChild('template') template: ElementRef;
	@ViewChild('template1') template1: ElementRef;
  @ViewChild(MatPaginator) pagination: MatPaginator;
	@ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @Input() myinputMsg:any;

  deleteProjectRef:any;
  TaskBlockRef:any;
  username:any;
  filterValue: any;
  country:any;
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
  items:any= [];
  task_start_date: string;
  task_end_date: string ;

  public crudName = "Save";
  public countryList = [];
  public mileList = [];

  editorConfig: AngularEditorConfig = {
    editable: false,
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



  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;
  showError=false;
sub:any;

dataSource: MatTableDataSource<any>;
dataSourcelist: MatTableDataSource<any>;
dataSourceDel: MatTableDataSource<any>;
dataSourceStatus: MatTableDataSource<any>;
public statusTasking = [];
public statusTaskinglist = [];
@ViewChild("chart") chart: ChartComponent;
@ViewChild("chart1") chart1: ChartComponent;
public chartOptions1: Partial<ChartOptions1> |any;
public chartOptions: Partial<ChartOptions> | any;
@ViewChild("chart2") chart2: ChartComponent;
public chartOptions2: Partial<ChartOptions2>;
@ViewChild("chart3") chart3: ChartComponent;
public chartOptions3: Partial<ChartOptions3>;
  milestoneList: any;
@ViewChild('chart4') chart4: ChartComponent;
public chartOptions11: Partial<ChartOptions11> | any;

@ViewChild('chart5') chart5: ChartComponent;
public chartOptions12: Partial<ChartOptions12>;

@ViewChild('chart6') chart6: ChartComponent;
public chartOptions13: Partial<ChartOptions13>;

@ViewChild('chart7') chart7: ChartComponent;
public chartOptions14: Partial<ChartOptions14>;
// @ViewChild('chart8') chart8: ChartComponent;
// public chartOptions21: Partial<ChartOptions21>;
@ViewChild('chartGroup') chartGroup: ChartComponent;
public chartOptionsGroup: Partial<chartOptionsGroup>;
@ViewChild('chart9') chart9: ChartComponent;
public chartOptions22: Partial<ChartOptions22>;
token_details:any;
allocateForm:FormGroup;
  distribution: any;
  overdata1: any;
  groupdata1: any;
  distributiondata1: any;
  extenddata: any;
  chartData: any = {
    series: [],
  };


 
  
  constructor(private ref: ChangeDetectorRef,private modalService: NgbModal,  private logger: ConsoleService,private route: ActivatedRoute,public api: ApiService,private notification: NotificationService, private dialog: MatDialog, private elementref: ElementRef,public datepipe:DatePipe,private router: Router,private platformLocation: PlatformLocation)

  {

    this.token_details=this.api.decryptData(localStorage.getItem('token-detail'));

    this.allocateForm = new FormGroup({
      id: new FormControl(""),
      tasking_group: new FormControl(""),
      tasking: new FormControl(""),
      created_by:new FormControl(""),
      created_role : new FormControl(this.token_details.role_id),
      });
    // platformLocation.onPopState(() => this.modalService.dismissAll());
    // platformLocation.onPopState(() => this.close());
    platformLocation.onPopState(() => this.cancelmodal());

	enum ChangeDetectionStrategy {
		OnPush= 0,
		Default= 2
	  }

	ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 10);



    this.sub = this.route.data
    .subscribe((v:any) => {
    this.username= v.some_data});


    var updateChart = this.chartOptions = {
    	series:
        this.tasking_chart,

    	tooltip: {
    	  enabled:true

    	},

      chart: {
        height: 450,
        type: "rangeBar",
        toolbar: {
          show: false
          },
          zoom: {
          enabled:false,
          },

      },
      dataLabels: {
        enabled: false,
      },
      animations: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "50%"
        }
      },
      xaxis: {
        type: "datetime",
        axisBorder: {
          show: false,
          color: '#000',
          height: 1,
          width: '100%',
          offsetX: 0,
          offsetY: 0
      },
      },
      // yaxis: {
      //   show:false
      // },
      zoom: {
        enabled: false,
        },
        zoomout: {
        enabled: false,
        },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
        }
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center"
      },
      grid: {
        xaxis: {
          lines: {
            show:true
          }
        },
        yaxis: {
          lines: {
            show:false
          }
        },

        borderColor:'black',

      }

      };

	  // var updateChart1 =	this.chartOptions1 = {
		// series:
    //     this.milestone_data,
		// chart: {

		//   height: 450,
		//   type: "rangeBar",
		//   toolbar: {
		// 	show: false
		//   },
		//   zoom: {
		// 	enabled:false,
		//   },

		// },

    // dataLabels: {
    //   enabled: false,
    // },
    // animations: {
    //   enabled: false,
    // },
		// plotOptions: {
		//   bar: {
		// 	horizontal: true,
		// 	barHeight: "50%",

		//   }
		// },
		// xaxis: {
		//   type: "datetime",
    //   axisBorder: {
    //     show: false,
    //     color: '#000',
    //     height: 1,
    //     width: '100%',
    //     offsetX: 0,
    //     offsetY: 0
    // },
		// },

		// zoom: {
		// 	enabled: false,
		//   },
		//   zoomout: {
		// 	enabled: false,
		//   },

		// fill: {
		//   type: "gradient",
		//   gradient: {
		// 	shade: "light",
		// 	type: "vertical",
		// 	shadeIntensity: 0.25,
		// 	gradientToColors: undefined,
		// 	inverseColors: true,
		// 	opacityFrom: 1,
		// 	opacityTo: 1,
		// 	stops: [50, 0, 100, 100]
		//   }
		// },
		// legend: {
		//   position: "bottom",
		//   horizontalAlign: "center"
		// },
    // grid: {
    //   xaxis: {
    //     lines: {
    //       show:false
    //     }
    //   },

    //   yaxis: {
    //     lines: {
    //       show:true
    //     }
    //   },

    //   borderColor:'black',

    // }

	  // };

   var updateChart2= this.chartOptions2 = {
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
          barHeight: "30%"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
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
        },
        axisBorder: {
          show: true,
          color: '#000',
          offsetX: 0,
          offsetY: 0
      },


      },
      grid: {
        xaxis: {
          lines: {
            show:false
          }
        },
        yaxis: {
          lines: {
            show:true
          }
        },

        borderColor:'black',

      }
    };

var updateChartNew = this.chartOptions3 = {
	series: [
	  {
		name: "Inflation",
		data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
	  }
	],
	chart: {
	  height: 350,
	  type: "bar"
	},
	plotOptions: {
	  bar: {
		dataLabels: {
		  position: "top" // top, center, bottom
		}
	  }
	},
	dataLabels: {
	  enabled: true,
	  formatter: function(val) {
		return val + "%";
	  },
	  offsetY: -20,
	  style: {
		fontSize: "12px",
		colors: ["#304758"]
	  }
	},

	xaxis: {
	  categories: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	  ],
	  position: "top",
	  labels: {
		offsetY: -18
	  },
	  axisBorder: {
		show: false
	  },
	  axisTicks: {
		show: false
	  },
	  crosshairs: {
		fill: {
		  type: "gradient",
		  gradient: {
			colorFrom: "#D8E3F0",
			colorTo: "#BED1E6",
			stops: [0, 100],
			opacityFrom: 0.4,
			opacityTo: 0.5
		  }
		}
	  },
	  tooltip: {
		enabled: true,
		offsetY: -35
	  }
	},
	fill: {
	  type: "gradient",
	  gradient: {
		shade: "light",
		type: "horizontal",
		shadeIntensity: 0.25,
		gradientToColors: undefined,
		inverseColors: true,
		opacityFrom: 1,
		opacityTo: 1,
		stops: [50, 0, 100, 100]
	  }
	},
	yaxis: {
	  axisBorder: {
		show: false
	  },
	  axisTicks: {
		show: false
	  },
	  labels: {
		show: false,
		formatter: function(val) {
		  return val + "%";
		}
	  }
	},
	title: {
	  text: "Monthly Inflation in Argentina, 2002",
	  offsetY: 320,
	  align: "center",
	  style: {
		color: "#444"
	  }
	}
  };
  setTimeout(() => {
    updateChart
    // updateChart1
    updateChart2
	updateChartNew
  }, 1500);


   this.chartOptions11 = {
	series: [
        {
          name: 'task',
          data: [30,  49, 60, 70, 91, ]
        }
      ],
      chart: {
        type: 'bar',
        height: 350
      },
      xaxis: {
        categories: ['2021', '2022', '2023', '2024', '2025', ]
      }

    };

    this.chartOptions22 = {
      series: [
        {
          name: "Number of Extended Deadlines",
          data: [4, 5, 1] // Values corresponding to CMS, CSI, SCS
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%"
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: ["CMS", "CSI", "SCS"], // Group names
        title: {
          text: "WESEE GROUP"
        }
      },
      yaxis: {
        title: {
          text: "Number of Extended Deadlines"
        }
      },
 title: {
        text: "Tasks with Extended Deadlines by Group",
        align: "center"
      }
    }

	this.chartOptions12 = {
		series: [50.9, 49.1],
		chart: {
		  type: 'pie',
		  height: 350,

		},
		labels: ['IN PROGRESS', 'YES'],

		legend: {
		  position: 'right',
		  horizontalAlign: 'center'
		},
		dataLabels: {
		  enabled: true,
		   formatter: (val: number | string) => `${parseFloat(val as string).toFixed(1)}%`
		},
		responsive: [
		  {
			breakpoint: 480,

			options: {
			  chart: {
				width: 300
			  },
			  legend: {
				position: 'bottom',
				colors: ['#8AE234', '#FFA500'] ,
			  }
			}
		  }
		],
		title: {
		  text: 'Task Status Distribution',
		  align: 'center'
		}
	  };
	  this.chartOptions13 = {
		series: [{
			name: 'Number of Overdue Tasks',
			// data: [1, 0.1, 1]
			data: [1]
		  }],
		  chart: {
			type: 'bar',
			height: 450
		  },
		  plotOptions: {
			bar: {
			  horizontal: false,
			  columnWidth: '35%',
			},
		  },
		  xaxis: {
			// categories: ['WESEE GROUP', 'CSI','CMS'],  // Group names
			categories: ['CSI']
		  },
		  yaxis: {
			title: {
			  text: 'Number of Overdue Tasks'
			}
		  },
		  fill: {
			colors: ['#FF0000'],  // Set the bar color to red
		  },
		  title: {
			text: 'Overdue Tasks Summary by Group',
			align: 'center'
		  }
	  };
	  this.chartOptions14 = {
		series: [{
			name: 'Number of Pending Tasks',
			data: [0.2 ,0.5, 1, 0.7,0.5]
		  }],
		  chart: {
			type: 'bar',
			height: 450
		  },
		  plotOptions: {
			bar: {
			  horizontal: false,
			  columnWidth: '15%',
			},
		  },
		  xaxis: {
			categories: ['CSI','CMS','CSC','ETG','SCS'],  // Group names
			// categories: ['CSI']
		  },
		  yaxis: {
			title: {
			  text: 'Number of Pending Tasks'
			}
		  },
		  fill: {
			colors: ['#ffff00'],  // Set the bar color to red
		  },
		  title: {
			text: 'Pending Tasks Summary by Group',
			align: 'center'
		  }
	  };
	  // this.chartOptions21 = {
		// series: [
		// 	{
		// 	  name: 'IN PROGRESS',
		// 	  data: [10, 20, 30, 5, 10],  // Replace with your data
		// 	  color: '#fcb040'  // Yellow
		// 	},
		// 	{
		// 	  name: 'YES',
		// 	  data: [20, 10, 20, 5, 5],  // Replace with your data
		// 	  color: '#f58220'  // Orange
		// 	}
		//   ],
		//   chart: {
		// 	type: 'bar',
		// 	height: 350,
		// 	stacked: true
		//   },
		//   plotOptions: {
		// 	bar: {
		// 	  horizontal: false,
		// 	},
		//   },
		//   xaxis: {
		// 	categories: ['CMS', 'CSC', 'CSI', 'ETG', 'SCS'],  // Replace with your categories
		// 	title: {
		// 	  text: 'WESEE GROUP'
		// 	}
		//   },
		//   yaxis: {
		// 	title: {
		// 	  text: 'Number of Tasks'
		// 	}
		//   },
		//   legend: {
		// 	position: 'top',
		// 	horizontalAlign: 'right'
		//   },
		//   fill: {
		// 	opacity: 1
		//   },
		//   title: {
		// 	text: 'Group-wise Task Summary',
		// 	align: 'center'
		//   },
		//   dataLabels: {
		// 	enabled: true
		//   }
	  // };

    this.chartOptionsGroup = {
      chart: {
        type: 'bar',
        stacked: true,
        height: '400px',
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: 'Number of Tasks',
        },
      },
      legend: {
        position: 'right',
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      colors: ['#fbbf24', '#fb923c'], // Yellow for "IN PROGRESS", Orange for "YES"
      dataLabels: {
        enabled: false,
      },
    };
  }



  taskForm = new FormGroup({
    id: new FormControl(""),

	status: new FormControl(""),
    comment_status:new FormControl(""),
//   });
   sdForm : new FormGroup({
	sponsoring_directorate: new FormControl("",[Validators.required]),
  SD_comments : new FormControl(""),
    task_description: new FormControl(""),
    task_name: new FormControl(""),
    details_hardware: new FormControl(""),
    details_software: new FormControl(""),
    details_systems_present: new FormControl(""),
    ships_or_systems_affected: new FormControl(""),
    file: new FormControl("",),
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
    comments_of_dee: new FormControl(""),
  }),
acomForm : new FormGroup({
	recommendation_of_acom_its:new FormControl(""),
}),
comForm : new FormGroup({
	approval_of_com: new FormControl(""),
}),
apsoForm : new FormGroup({
	comments_of_apso: new FormControl(""),
})
});
public MileStoneForm = new FormGroup({
    id: new FormControl(""),
	milestone:new FormControl(""),
	task_start_date:new FormControl(""),
	task_end_date:new FormControl(""),
	percentage_completion:new FormControl(""),
	budget_utilized:new FormControl(""),
	manpower:new FormControl(""),
  tasking:new FormControl(""),
	status: new FormControl(""),
  tasking_status:new FormControl(""),

});
status = this.taskForm.value.status;
  showSD=false;
  populate(data) {
    //console.log('patch',data.assigned_tasking_group[0].tasking_group.name);
    //this.taskForm.get('sdForm').patchValue(data);
    this.taskForm.get('weseeForm').patchValue(data);
    this.taskForm.get('deeForm').patchValue(data);
    this.taskForm.get('acomForm').patchValue(data);
    this.taskForm.get('comForm').patchValue(data);
    this.taskForm.get('apsoForm').patchValue(data);
    if(data.sponsoring_directorate=='Others'){
      this.showSD = true;
      this.taskForm.patchValue({sdForm:{SD_comments:data.SD_comments}})
    }else{
      this.showSD = false;
    }

    this.taskForm.patchValue({sdForm:{sponsoring_directorate:data.sponsoring_directorate,task_name:data.task_name,task_description:data.task_description}})

    // this.taskForm.patchValue({sdForm:{sponsoring_directorate:data.sponsoring_directorate}})
    // this.allocateForm.patchValue({tasking_group:data.assigned_tasking_group.length>0 && data.assigned_tasking_group[0].tasking_group?data.assigned_tasking_group[0].tasking_group.id:''
    // });
    this.allocateForm.patchValue({tasking_group:data?.assigned_tasking_group?.length>0 && data?.assigned_tasking_group[0]?.tasking_group?data?.assigned_tasking_group[0]?.tasking_group?.id:''});

    // this.MileStoneForm.patchValue(data);
    // this.MileStoneForm.patchValue({tasking_status:data.tasking_status.id});
    // this.MileStoneForm.patchValue({
    //   milestone:data.milestone,percentage_completion:data.percentage_completion,
    //   task_start_date:data.task_start_date,task_end_date:data.task_end_date,manpower:data.manpower,
    //   id:data.id,budget_utilized:data.budget_utilized,tasking:data.tasking,tasking_status:data.tasking_status.id
    // });
    if (data ? data.file : "") {
      var img_link = data.file;
      //var trim_img = img_link.substring(1)
      this.ImageUrl = img_link;
    }else{
      this.ImageUrl=""
    }

    if (data ? data.file1 : "") {
      var img_link1 = data.file1;
      //var trim_img = img_link.substring(1)
      this.ImageUrl1 = img_link1;
    }else{
      this.ImageUrl1=""
    }

    if (data ? data.file2 : "") {
      var img_link2 = data.file2;
      //var trim_img = img_link.substring(1)
      this.ImageUrl2 = img_link2;
    }else{
      this.ImageUrl2=""
    }
    if (data ? data.file3 : "") {
      var img_link3 = data.file3;
      //var trim_img = img_link.substring(1)
      this.ImageUrl3 = img_link3;
    }else{
      this.ImageUrl3=""
    }

    if (data ? data.file4 : "") {
      var img_link4 = data.file4;
      //var trim_img = img_link.substring(1)
      this.ImageUrl4 = img_link4;
    }else{
      this.ImageUrl4=""
    }
    if (data ? data.file5 : "") {
      var img_link5 = data.file5;
      //var trim_img = img_link.substring(1)
      this.ImageUrl5 = img_link5;
      }
    else{
      this.ImageUrl5=""
    }
    if (data ? data.file6 : "") {
      var img_link6 = data.file6;
      //var trim_img = img_link.substring(1)
      this.ImageUrl6 = img_link6;
    }
    else{
      this.ImageUrl6=""
    }

    if (data ? data.file7 : "") {
      var img_link7 = data.file7;
      //var trim_img = img_link.substring(1)
      this.ImageUrl7 = img_link7;
      }
    else{
      this.ImageUrl7 = '';
    }

    if (data ? data.file8 : "") {
      var img_link8 = data.file8;
      //var trim_img = img_link.substring(1)
      this.ImageUrl8 = img_link8;
    }
    else{
      this.ImageUrl8 = '';
    }

  }

  milestonepopulate(data){
    this.MileStoneForm.patchValue(data);
    this.MileStoneForm.patchValue({tasking_status:data.tasking_status.id});
	  if (data ? data.file : "") {
		var img_link = data.file;
		//var trim_img = img_link.substring(1)
		this.ImageUrl = img_link;
	  }


  }

  initForm() {
    this.taskForm.patchValue({
      status: "1",
    });
	this.MileStoneForm.patchValue({
		status: "1",
    // tasking_status:this.MileStoneForm.value.tasking_status

	  });

  }

  Error = (controlName: string, errorName: string) => {
    return this.taskForm.controls[controlName].hasError(errorName);
  };

  statusValue=[];
  series:any;
  dataValue=[];
  chart_data=[];
  pending=[];
  name=[];
  completed=[];
  nameData=[];
  time_data:any;
  // getStatusTasking() {
  //   if(this.token_detail.process_id==3 && this.token_detail.tasking_id!=''){
  //     this.api
  //     .postAPI(environment.API_URL + "transaction/trial/status",{'tasking_id':this.token_detail.tasking_id,'process_id':this.token_detail.process_id})
  //     .subscribe((res) => {

  //       this.dataSourceDel = new MatTableDataSource(res.data);

  //       this.statusTasking = res.data;

  //       this.dataSourceDel.paginator = this.pagination;
  //       // this.logger.log('countryfg',this.statusTasking)

  //       for(let i=0;i<this.statusTasking.length;i++){
  //         if(this.statusTasking[i].project_status!='' && this.statusTasking[i].task_number_dee!=''){
  //           for(let k=0;k<this.statusTasking[i].project_status.length;k++){
  //             if(this.statusTasking[i].project_status[k].project_progress!='' && this.statusTasking[i].task_number_dee!='')
  //             {
  //               this.pending.push([100-this.statusTasking[i].project_status[k].project_progress])
  //               this.completed.push('-'+[this.statusTasking[i].project_status[k].project_progress])

  //             }

  //           }
  //           this.name.push([this.statusTasking[i].task_number_dee])

  //         }

  //       }
  //         for(let i=0;i<this.statusTasking.length;i++){
  //           if(this.statusTasking[i].project_status!='' && this.statusTasking[i].task_number_dee!=''){
  //             for(let k=0;k<this.statusTasking[i].project_status.length;k++){
  //               if(this.statusTasking[i].project_status[k].start_date!='' && this.statusTasking[i].project_status[k].task_end_date!='')  {
  //                 this.chart_data.push({y:[new Date(this.statusTasking[i].project_status[k].start_date).getTime(),new Date(this.statusTasking[i].project_status[k].end_date).getTime()],x:this.statusTasking[i].task_number_dee,  product: 'name',
  //                 info: 'info',
  //                 site: 'name',
  //                 fillColor: "#008FFB",id:this.statusTasking[i].id})
  //               }

  //             }



  //           }

  //       }
	// 	this.ref.detectChanges();
  //     });
  //   }
  //   else if(this.token_detail.role_id==3 && this.token_detail.process_id==2 && this.token_detail.department_id!=''){
  //     this.api
  //     .postAPI(environment.API_URL + "transaction/trial/status",{'tasking_id':this.token_detail.tasking_id,'process_id':this.token_detail.process_id,'created_by':this.token_detail.user_id})
  //     .subscribe((res) => {

  //       this.dataSourceDel = new MatTableDataSource(res.data);

  //       this.statusTasking = res.data;
  //       this.dataSourceDel.paginator = this.pagination;

  //       for(let i=0;i<this.statusTasking.length;i++){
  //         if(this.statusTasking[i].project_status && this.statusTasking[i].task_number_dee){
  //           for(let k=0;k<this.statusTasking[i].project_status.length;k++){
  //             if(this.statusTasking[i].project_status[k].project_progress!='' && this.statusTasking[i].task_number_dee!='')
  //             {
  //               this.pending.push([100-this.statusTasking[i].project_status[k].project_progress])
  //               this.completed.push('-'+[this.statusTasking[i].project_status[k].project_progress])

  //             }

  //           }
  //           // console.log('this.statusTasking[i]',this.statusTasking[i]);
  //           this.name.push([this.statusTasking[i].task_number_dee])

  //         }

  //       }
  //         for(let i=0;i<this.statusTasking.length;i++){
  //           if(this.statusTasking[i].project_status!='' && this.statusTasking[i].task_number_dee!=''){
  //             for(let k=0;k<this.statusTasking[i].project_status.length;k++){
  //               if(this.statusTasking[i].project_status[k].start_date!='' && this.statusTasking[i].project_status[k].end_date!='' && this.statusTasking[i].task_number_dee!='')  {
  //                 this.chart_data.push({y:[new Date(this.statusTasking[i].project_status[k].start_date).getTime(),new Date(this.statusTasking[i].project_status[k].end_date).getTime()],x:this.statusTasking[i].task_number_dee,  product: 'name',
  //                 info: 'info',
  //                 site: 'name',
  //                 fillColor: "#008FFB",id:this.statusTasking[i].id})
  //               }

  //             }


  //           }

  //       }
	// 	this.ref.detectChanges();
  //     });

  //   }
  //   else{
  //     this.api
  //     .postAPI(environment.API_URL + "transaction/trial/status",{'process_id':this.token_detail.process_id,'tasking_id':''})
  //     .subscribe((res) => {

  //       this.dataSourceDel = new MatTableDataSource(res.data);

  //       this.statusTasking = res.data;

  //       this.dataSourceDel.paginator = this.pagination;

  //       for(let i=0;i<this.statusTasking.length;i++){

  //         if(this.statusTasking[i].project_status!='' && this.statusTasking[i].task_number_dee!=''){
  //           for(let k=0;k<this.statusTasking[i].project_status.length;k++){
  //             if(this.statusTasking[i].project_status[k].project_progress!='')

  //             {

  //               this.pending.push([100-this.statusTasking[i].project_status[k].project_progress])
  //               this.completed.push('-'+[this.statusTasking[i].project_status[k].project_progress])
  //               // this.name.push([this.statusTasking[i].task_number_dee])

  //             }

  //           }
  //           //console.log('this.statusTasking[i]',this.statusTasking[i]);
  //           this.name.push([this.statusTasking[i].task_number_dee])

  //         }

  //       }
  //         for(let i=0;i<this.statusTasking.length;i++){
  //           if(this.statusTasking[i].project_status!='' && this.statusTasking[i].task_number_dee!=''){
  //             for(let k=0;k<this.statusTasking[i].project_status.length;k++){
  //               if(this.statusTasking[i].project_status[k].start_date!='' && this.statusTasking[i].project_status[k].end_date!='')  {
  //                 this.chart_data.push({y:[new Date(this.statusTasking[i].project_status[k].start_date).getTime(),new Date(this.statusTasking[i].project_status[k].end_date).getTime()],x:this.statusTasking[i].task_number_dee})


  //               }

  //             }


  //           }

  //       }

	// 	this.ref.detectChanges();
  //     });
  //   }


  // }


//   getStatusTasking() {
//     console.log("getStatusTasking called");
    
//     if(this.token_detail.process_id == 3 && this.token_detail.tasking_id != '') {
//         console.log("Condition 1: process_id == 3 and tasking_id is not empty");

//         this.api
//         .postAPI(environment.API_URL + "transaction/trial/status", {'tasking_id': this.token_detail.tasking_id, 'process_id': this.token_detail.process_id})
//         .subscribe((res) => {
//             console.log("API response:", res);

//             this.dataSourceDel = new MatTableDataSource(res.data);
//             this.statusTasking = res.data;
//             this.dataSourceDel.paginator = this.pagination;

//             console.log("statusTasking:", this.statusTasking);

//             for(let i = 0; i < this.statusTasking.length; i++) {
//                 if(this.statusTasking[i].project_status != '' && this.statusTasking[i].task_number_dee != '') {
//                     for(let k = 0; k < this.statusTasking[i].project_status.length; k++) {
//                         if(this.statusTasking[i].project_status[k].project_progress != '') {
//                             this.pending.push([100 - this.statusTasking[i].project_status[k].project_progress]);
//                             this.completed.push('-' + [this.statusTasking[i].project_status[k].project_progress]);

//                             console.log("Project progress:", this.statusTasking[i].project_status[k].project_progress);
//                         }
//                     }
//                     this.name.push([this.statusTasking[i].task_number_dee]);
//                     console.log("Task number dee:", this.statusTasking[i].task_number_dee);
//                 }
//             }

//             for(let i = 0; i < this.statusTasking.length; i++) {
//                 if(this.statusTasking[i].project_status != '' && this.statusTasking[i].task_number_dee != '') {
//                     for(let k = 0; k < this.statusTasking[i].project_status.length; k++) {
//                         if(this.statusTasking[i].project_status[k].start_date != '' && this.statusTasking[i].project_status[k].end_date != '') {
//                             this.chart_data.push({
//                                 y: [new Date(this.statusTasking[i].project_status[k].start_date).getTime(), new Date(this.statusTasking[i].project_status[k].end_date).getTime()],
//                                 x: this.statusTasking[i].task_number_dee,
//                                 product: 'name',
//                                 info: 'info',
//                                 site: 'name',
//                                 fillColor: "#008FFB",
//                                 id: this.statusTasking[i].id
//                             });

//                             console.log("Chart data:", this.chart_data);
//                         }
//                     }
//                 }
//             }
//             this.ref.detectChanges();
//         });

//     } else if(this.token_detail.role_id == 3 && this.token_detail.process_id == 2 && this.token_detail.department_id != '') {
//         console.log("Condition 2: role_id == 3, process_id == 2, and department_id is not empty");

//         this.api
//         .postAPI(environment.API_URL + "transaction/trial/status", {'tasking_id': this.token_detail.tasking_id, 'process_id': this.token_detail.process_id, 'created_by': this.token_detail.user_id})
//         .subscribe((res) => {
//             console.log("API response:", res);

//             this.dataSourceDel = new MatTableDataSource(res.data);
//             this.statusTasking = res.data;
//             this.dataSourceDel.paginator = this.pagination;

//             console.log("statusTasking:", this.statusTasking);

//             for(let i = 0; i < this.statusTasking.length; i++) {
//                 if(this.statusTasking[i].project_status && this.statusTasking[i].task_number_dee) {
//                     for(let k = 0; k < this.statusTasking[i].project_status.length; k++) {
//                         if(this.statusTasking[i].project_status[k].project_progress != '') {
//                             this.pending.push([100 - this.statusTasking[i].project_status[k].project_progress]);
//                             this.completed.push('-' + [this.statusTasking[i].project_status[k].project_progress]);

//                             console.log("Project progress:", this.statusTasking[i].project_status[k].project_progress);
//                         }
//                     }
//                     this.name.push([this.statusTasking[i].task_number_dee]);
//                     console.log("Task number dee:", this.statusTasking[i].task_number_dee);
//                 }
//             }

//             for(let i = 0; i < this.statusTasking.length; i++) {
//                 if(this.statusTasking[i].project_status != '' && this.statusTasking[i].task_number_dee != '') {
//                     for(let k = 0; k < this.statusTasking[i].project_status.length; k++) {
//                         if(this.statusTasking[i].project_status[k].start_date != '' && this.statusTasking[i].project_status[k].end_date != '') {
//                             this.chart_data.push({
//                                 y: [new Date(this.statusTasking[i].project_status[k].start_date).getTime(), new Date(this.statusTasking[i].project_status[k].end_date).getTime()],
//                                 x: this.statusTasking[i].task_number_dee,
//                                 product: 'name',
//                                 info: 'info',
//                                 site: 'name',
//                                 fillColor: "#008FFB",
//                                 id: this.statusTasking[i].id
//                             });

//                             console.log("Chart data:", this.chart_data);
//                         }
//                     }
//                 }
//             }
//             this.ref.detectChanges();
//         });

//     } else {
//         console.log("Condition 3: process_id present but tasking_id is empty");

//         this.api
//         .postAPI(environment.API_URL + "transaction/trial/status", {'process_id': this.token_detail.process_id, 'tasking_id': ''})
//         .subscribe((res) => {
//             console.log("API response:", res);

//             this.dataSourceDel = new MatTableDataSource(res.data);
//             this.statusTasking = res.data;
//             this.dataSourceDel.paginator = this.pagination;

//             console.log("statusTasking:", this.statusTasking);

//             for(let i = 0; i < this.statusTasking.length; i++) {
//                 if(this.statusTasking[i].project_status != '' && this.statusTasking[i].task_number_dee != '') {
//                     for(let k = 0; k < this.statusTasking[i].project_status.length; k++) {
//                         if(this.statusTasking[i].project_status[k].project_progress != '') {
//                             this.pending.push([100 - this.statusTasking[i].project_status[k].project_progress]);
//                             this.completed.push('-' + [this.statusTasking[i].project_status[k].project_progress]);

//                             console.log("Project progress:", this.statusTasking[i].project_status[k].project_progress);
//                         }
//                     }
//                     this.name.push([this.statusTasking[i].task_number_dee]);
//                     console.log("Task number dee:", this.statusTasking[i].task_number_dee);
//                 }
//             }

//             for(let i = 0; i < this.statusTasking.length; i++) {
//                 if(this.statusTasking[i].project_status != '' && this.statusTasking[i].task_number_dee != '') {
//                     for(let k = 0; k < this.statusTasking[i].project_status.length; k++) {
//                         if(this.statusTasking[i].project_status[k].start_date != '' && this.statusTasking[i].project_status[k].end_date != '') {
//                             this.chart_data.push({
//                                 y: [new Date(this.statusTasking[i].project_status[k].start_date).getTime(), new Date(this.statusTasking[i].project_status[k].end_date).getTime()],
//                                 x: this.statusTasking[i].task_number_dee
//                             });

//                             console.log("Chart data:", this.chart_data);
//                         }
//                     }
//                 }
//             }
//             this.ref.detectChanges();
//         });
//     }
// }

  tasking_chart=[];
  getTaskingChart(){

    if(this.token_detail.process_id==3){
      this.api
      .postAPI(environment.API_URL + "transaction/taskingchart",{'created_by':this.token_detail.user_id})
      .subscribe((res) => {

        // this.dataSourceDel = new MatTableDataSource(res.data);

        this.statusTasking = res.data;

        for (let i=0;i<this.statusTasking.length;i++){
          if(this.statusTasking[i].tasking!=''){
            this.tasking_chart.push({name:this.statusTasking[i].tasking__task_name})
            this.api
        .getAPI(environment.API_URL + "transaction/tasking-status?tasking__task_number_dee="+this.statusTasking[i].tasking__tasking__task_name + '&limit_start=0&limit_end=6')
        .subscribe((res) => {
          this.dataSourcelist = new MatTableDataSource(res.data);

            var statusTaskingList = res.data;
            this.tasking_chart[i].data=[];
            for (let k=0;k<statusTaskingList.length;k++){
              if(statusTaskingList[k].title){
                if(statusTaskingList[k].start_date!='' && statusTaskingList[k].end_date!='' && statusTaskingList[k].title!=''){
                  {
                    this.tasking_chart[i].data.push({x:
                    statusTaskingList[k].title,y:[new Date(statusTaskingList[k].start_date).getTime(),new Date(statusTaskingList[k].end_date).getTime()]})

                  }

                }
              }


            }

        });

          }
        }

      });


    }
    else{
      this.api
    .postAPI(environment.API_URL + "transaction/taskingchart",{})
    .subscribe((res) => {

      // this.dataSourceDel = new MatTableDataSource(res.data);

      this.statusTasking = res.data;
      for (let i=0;i<this.statusTasking.length;i++){
        if(this.statusTasking[i].tasking!=''){
          this.tasking_chart.push({name:this.statusTasking[i].tasking__task_number_dee})
          this.api
      .getAPI(environment.API_URL + "transaction/tasking-status?tasking__task_number_dee="+this.statusTasking[i].tasking__task_number_dee + '&limit_start=0&limit_end=6')
      .subscribe((res) => {
        this.dataSourcelist = new MatTableDataSource(res.data);
          var statusTaskingList = res.data;

          this.tasking_chart[i].data=[];
          for (let k=0;k<statusTaskingList.length;k++){
            if(statusTaskingList[k].title){
              if(statusTaskingList[k].start_date!='' && statusTaskingList[k].end_date!='' && statusTaskingList[k].title!=''){
                {
                  this.tasking_chart[i].data.push({x:
                  statusTaskingList[k].title,y:[new Date(statusTaskingList[k].start_date).getTime(),new Date(statusTaskingList[k].end_date).getTime()]})

                }

              }
            }


          }


      });

        }
      }

    });
    //console.log('this.tasking_chartname',this.tasking_chart);
    }

  }


token_detail:any;
tasking_ID:any;
getAccess() {
  this.moduleAccess = this.api.getPageAction();
   if (this.moduleAccess) {
     let addPermission=(this.moduleAccess).filter(function(access){ if(access.code=='ADD') return access.status; }).map(function(obj) {return obj.status;});
     let viewPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'VIW') { return access.status; } }).map(function (obj) { return obj.status; });;
     this.permission.add=addPermission.length>0?addPermission[0]:false;
     this.permission.view = viewPermission.length > 0 ? viewPermission[0] : false;;

   }

 }






ngOnInit(): void {
	this.getStatus();
   this.getyear() ;
   this.getoverd();
   this.getgroup();
   this.getdistri();
   this.getextend();
  //  this.getStatusTaskingNew();
  this.getNewTaskingStatus();
 
    // this.dtOptions = {
    //   pagingType: 'full_numbers'
    // };
    this.token_detail=this.api.decryptData(localStorage.getItem('token-detail'));
    //console.log(' this.token_detail', this.token_detail)
    // this.tasking_ID=this.api.decryptData();
   
    this.getTasking();

    // this.getMileStone;
    this.getDashboardCount();
    // this.getMileStoneChart();
    this.getAccess();
    this.getTaskingChart();
    this.getTaskingGroups();
    this.tasklist();
    this.getChart();
  }
  showDialog() {
    this.getyearData();
    this.visible = true; }
    showDialog1() {
      this.getdistribution();
      this.visible1 = true; }
      showDialog2() {
        this.getoverdue();
        this.visible2 = true; }
        showDialog3() {
          this.getpendingdata();
          this.visible3 = true; }
          showDialog4() {
           this.getgroupwise()
            this.visible4= true; }
  

  
  // task_id:string
  onTaskChange(taskname: any){
    console.log('Selected Task Name:', taskname.id);
    // this.task_id=taskname.id
    this.getChart(taskname.id);
  }

  maybeDisposeRoot(divId) {
    am5.array.each(am5.registry.rootElements, function (root) {
      if (root && root.dom.id == divId) {
        root.dispose();
      }
    });
  };
getChart(task_id=""){
  console.log("task_id1111",task_id);
 this.maybeDisposeRoot("chartChartDetailModule")
   // Chart code goes in here
   let root = am5.Root.new("chartChartDetailModule");
   root.dateFormatter.setAll({
     dateFormat: "yyyy-MM-dd",
     dateFields: ["valueX", "openValueX"]
   });
   // Set themes
   // https://www.amcharts.com/docs/v5/concepts/themes/
   root.setThemes([
     am5themes_Animated.new(root)
   ]);


   // Create chart
   // https://www.amcharts.com/docs/v5/charts/xy-chart/
   let chart = root.container.children.push(am5xy.XYChart.new(root, {
     panX: false,
     panY: false,
     wheelX: "panX",
     wheelY: "zoomX",
     layout: root.verticalLayout
   }));

   // Add legend
   // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
   let legend = chart.children.push(am5.Legend.new(root, {
     centerX: am5.p50,
     x: am5.p50
   }))

   let colors = chart.get("colors");
   root.interfaceColors.set("grid", am5.color(0x058a342));

   var tasking_chartname=[];
   var tasking_chart_name=[];
     if(this.token_detail.process_id==3){

       this.api
       .postAPI(environment.API_URL + "transaction/taskingchart",{'created_by':this.token_detail.user_id})
       .subscribe((res) => {
         let kj = 0;
         let km = 0;
         if(task_id!=''){

          var statusTaskingList = res.data.filter(task => task.tasking_id === task_id);
          console.log("statusTaskingList21",statusTaskingList);
        }
        else{
          console.log("statusTaskingList2",statusTaskingList);
            statusTaskingList = res.data;
        }

         for (let k=0;k<statusTaskingList.length;k++){
           //console.log('statusTaskingList.length',statusTaskingList);
           tasking_chart_name.push({category:statusTaskingList[k].tasking__task_name});
           tasking_chart_name = tasking_chart_name.filter((test, index, array) =>
             index === array.findIndex((findTest) =>
                 findTest.category === test.category
             )
           );
           km+=2;
           if(statusTaskingList[k].title){
             if(statusTaskingList[k].start_date!='' && statusTaskingList[k].end_date!='' && statusTaskingList[k].title!=''){
               {

                 tasking_chartname.push({category:statusTaskingList[k].tasking__task_name,start:new Date(statusTaskingList[k].start_date).getTime(),end:new Date(statusTaskingList[k].end_date).getTime(),columnSettings:{fill: am5.Color.brighten(colors.getIndex(km), kj)},task:statusTaskingList[k].title})
               }

             }
             kj+=0.4;
           }
         }
       // this.statusTaskinglist = res.data;
       });
     }
     else{
      console.log("task_id222222",task_id);
       this.api
       .postAPI(environment.API_URL + "transaction/taskingchart",{})
       .subscribe((res) => {
        //  this.statusTaskinglist = res.data;
         let kj = 0;
         let km = 0;
        //
        if(task_id!=''){
          console.log("statusTaskingList21",statusTaskingList);
          var statusTaskingList = res.data.filter(task => task.tasking_id === task_id);
        }
        else{
          console.log("statusTaskingList2",statusTaskingList);
            statusTaskingList = res.data;
        }

         for (let k=0;k<statusTaskingList.length;k++){
           console.log('statusTaskingList.length',statusTaskingList);
           tasking_chart_name.push({category:statusTaskingList[k].tasking__task_name});
           tasking_chart_name = tasking_chart_name.filter((test, index, array) =>
             index === array.findIndex((findTest) =>
                 findTest.category === test.category
             )
           );
           // console.log('tasking_chart_name',tasking_chart_name);
           km+=2;
           if(statusTaskingList[k].title){
             if(statusTaskingList[k].start_date!='' && statusTaskingList[k].end_date!='' && statusTaskingList[k].title!=''){
               {

                 tasking_chartname.push({category:statusTaskingList[k].tasking__task_name,start:new Date(statusTaskingList[k].start_date).getTime(),end:new Date(statusTaskingList[k].end_date).getTime(),columnSettings:{fill: am5.Color.brighten(colors.getIndex(km), kj)},task:statusTaskingList[k].title})
               }

             }
             kj+=0.4;
           }
         }
       });
     console.log('this.tasking_chartname',tasking_chartname);
     }

setTimeout(() => {
 console.log('this.tasking_chartname',tasking_chartname);
   let data_tasking_chart = tasking_chartname;
  
   let yRenderer = am5xy.AxisRendererY.new(root, {});
   yRenderer.grid.template.set("location", 1);

   let yAxis = chart.yAxes.push(
     am5xy.CategoryAxis.new(root, {
       categoryField: "category",
       renderer: yRenderer,
       tooltip: am5.Tooltip.new(root, {})
     })
   );
   //console.log('this.tasking_chart_name',tasking_chart_name);
   yAxis.data.setAll(
     tasking_chart_name
     // [
     // { category: "Task Oct-2023" },
     // { category: "Test Task1" },
     // // { category: "PSR" },
     // ]
     );

   let xAxis = chart.xAxes.push(
     am5xy.DateAxis.new(root, {
       baseInterval: { timeUnit: "minute", count: 1 },
       renderer: am5xy.AxisRendererX.new(root, { strokeOpacity: 0.1 })
     })
   );


   // Add series
   // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
   let series = chart.series.push(am5xy.ColumnSeries.new(root, {
     xAxis: xAxis,
     yAxis: yAxis,
     openValueXField: "start",
     valueXField: "end",
     categoryYField: "category",
     sequencedInterpolation: true
   }));

   series.columns.template.setAll({
     templateField: "columnSettings",
     strokeOpacity: 0,
     tooltipText: "{task}:\n[bold]{openValueX}[/] - [bold]{valueX}[/]"
   });
   //console.log('tasking_chartname',data_tasking_chart);
   series.data.setAll(data_tasking_chart);

   // Add scrollbars
   chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));

   // Make stuff animate on load
   // https://www.amcharts.com/docs/v5/concepts/animations/
   series.appear();
   chart.appear(1000, 100);

//}
}, 1500);



var rootctcm = am5.Root.new("chartTaskCompletionModule");

rootctcm.setThemes([
 am5themes_Animated.new(rootctcm)
]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let ctcmchart = rootctcm.container.children.push(am5xy.XYChart.new(rootctcm, {
 panX: false,
 panY: false,
 wheelX: "panX",
 wheelY: "zoomX",
 layout: rootctcm.verticalLayout
}));


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
let ctcmlegend = ctcmchart.children.push(am5.Legend.new(rootctcm, {
 centerX: am5.p50,
 x: am5.p50
}));

 if(this.token_detail.process_id==3){
   this.api
   .postAPI(environment.API_URL + "transaction/dashboard-taskstatus",{'created_by':this.token_detail.user_id})
   .subscribe((res) => {
    this.statusTaskinglist = res.data;
   });


 }
 else{
   this.api
   .postAPI(environment.API_URL + "transaction/dashboard-taskstatus",{})
   .subscribe((res) => {
     this.statusTaskinglist = res.data;
   });
 }

setTimeout(() => {
var ctcmtaskdata = this.statusTaskinglist;
//console.log('statusTaskingList.chart',ctcmtaskdata);
// var ctcmtaskdata = [{
//   "task": "WESEE/02/2023/20",
//   "Project Initiation": 10,
//   "Project Design And Planning": 20
// }, {
//   "task": "WESEE/03/2023/20",
//   "Project Initiation": 10
// }, {
//   "task": "WESEE/22/2023/17",
//   "Project Initiation": 10,
//   "Project Design And Planning": 20,
//   "Project Execution": 30,
//   "Project Monitoring": 20,
//   "Project Testing": 10,
//   "Project Closing": 10,
// }, {
//   "task": "WESEE/22/2023/20",
//   "Project Initiation": 10,
// }];


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(rootctcm, {
 cellStartLocation: 0.1,
 cellEndLocation: 0.9
});

let xAxis = ctcmchart.xAxes.push(am5xy.CategoryAxis.new(rootctcm, {
 categoryField: "task",
 renderer: xRenderer,
 tooltip: am5.Tooltip.new(rootctcm, {})
}));

xRenderer.grid.template.setAll({
 location: 1
})

xAxis.data.setAll(ctcmtaskdata);

let yAxis = ctcmchart.yAxes.push(am5xy.ValueAxis.new(rootctcm, {
 min: 0,
 renderer: am5xy.AxisRendererY.new(rootctcm, {
   strokeOpacity: 0.1
 })
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
function makeSeries(name, fieldName, stacked) {
 let ctcmseries = ctcmchart.series.push(am5xy.ColumnSeries.new(rootctcm, {
   stacked: stacked,
   name: name,
   xAxis: xAxis,
   yAxis: yAxis,
   valueYField: fieldName,
   categoryXField: "task"
 }));

 let colors = chart.get("colors");
 root.interfaceColors.set("grid", am5.color(0x6794dc));

 ctcmseries.columns.template.setAll({
   tooltipText: "{name}, {categoryX}:{valueY}",
   width: am5.percent(90),
   tooltipY: am5.percent(10)
 });
 ctcmseries.data.setAll(ctcmtaskdata);

 // Make stuff animate on load
 // https://www.amcharts.com/docs/v5/concepts/animations/
 ctcmseries.appear();

 ctcmseries.bullets.push(function() {
   return am5.Bullet.new(rootctcm, {
     locationY: 0.5,
     sprite: am5.Label.new(rootctcm, {
       text: "{valueY}",
       fill: rootctcm.interfaceColors.get("alternativeText"),
       centerY: am5.percent(50),
       centerX: am5.percent(50),
       populateText: true
     })
   });
 });

 ctcmlegend.data.push(ctcmseries);
}

makeSeries("Project Initiation", "Project Initiation", false);
makeSeries("Project Design And Planning", "Project Design And Planning", false);
makeSeries("Project Execution", "Project Execution", false);
makeSeries("Project Monitoring", "Project Monitoring", false);
makeSeries("Project Testing", "Project Testing", false);
makeSeries("Project Closing", "Project Closing", false);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
ctcmchart.appear(1000, 100);
}, 1500);

setTimeout(() => {


this.chartOptions2 = {
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
     height: 480,
     stacked: true
   },
   colors: ["#1abc9c" ,"#e74c3c"],
   plotOptions: {
     bar: {
       horizontal: true,
       barHeight: "50%"
     }
   },
   dataLabels: {
     enabled: false
   },
   stroke: {
     width: 1,
     colors: ["#fff"]
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
     },
     axisBorder: {
       show: false,
       color: '#000',
       offsetX: 0,
       offsetY: 0
   },
   },
   grid: {
     xaxis: {
       lines: {
         show:false
       }
     },
     yaxis: {
       lines: {
         show:true
       }
     },

     borderColor:'#9a97da',

   }
 };
 this.chartOptions3 = {
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
		height: 480,
		stacked: true
	  },
	  colors: ["#1abc9c" ,"#e74c3c"],
	  plotOptions: {
		bar: {
		  horizontal: true,
		  barHeight: "50%"
		}
	  },
	  dataLabels: {
		enabled: false
	  },
	  stroke: {
		width: 1,
		colors: ["#fff"]
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
		},
		axisBorder: {
		  show: false,
		  color: '#000',
		  offsetX: 0,
		  offsetY: 0
	  },
	  },
	  grid: {
		xaxis: {
		  lines: {
			show:false
		  }
		},
		yaxis: {
		  lines: {
			show:true
		  }
		},

		borderColor:'#9a97da',

	  }
}

}, 2000);
}









  taskName:any;
  task_list:any;
  created_by:any;
  tasklist(){
    console.log("taskName",this.taskName);
    if(this.token_detail.process_id==3){
      this.created_by=this.token_detail.user_id;
      console.log('tokennn',this.created_by);

     }
     else{
      this.created_by=''
     }
     let search = this.created_by!=''?'created_by='+this.created_by:''

     this.api
     .postAPI(environment.API_URL + "transaction/trial/status",{'tasking_id':this.token_detail.tasking_id,'process_id':this.token_detail.process_id,search})
     .subscribe((res)=>{
      if(res.status==environment.SUCCESS_CODE) {
        this.task_list = res.data;
        console.log('tasklist',this.task_list);
		this.dataTask = res.data;
		console.log(this.dataTask,"data task")
      }
    });
  }
  dataTask=[] as any;
  getTasking() {
    // if(this.token_detail.role_id==3){
    if(this.token_detail.process_id==2 && this.token_detail.department_id==1){
      this.api.postAPI(environment.API_URL + "transaction/trial/status",{'process_id':this.token_detail.process_id,'created_by':this.token_detail.user_id,'tasking_id':''})
      .subscribe((res) => {
        if(res.status==environment.SUCCESS_CODE){
          this.dataSource = new MatTableDataSource(res.data);
          this.countryList = res.data;
          this.dataSource.paginator = this.pagination;
        }

      });

    }
    else if(this.token_detail.process_id==3 && this.token_detail.tasking_id!=''){
      this.api
      .postAPI(environment.API_URL + "transaction/trial/status",{'tasking_id':this.token_detail.tasking_id,'process_id':this.token_detail.process_id,'created_by':this.token_detail.user_id})
      .subscribe((res) => {
        if(res.status==environment.SUCCESS_CODE){
          this.dataSource = new MatTableDataSource(res.data);
          this.countryList = res.data;
          this.dataSource.paginator = this.pagination;
        }


      });

    }
    else{
      this.api
      .postAPI(environment.API_URL + "transaction/trial/status",{'process_id':this.token_detail.process_id,'tasking_id':''})
      .subscribe((res) => {
        if(res.status==environment.SUCCESS_CODE){
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
	this.showError=true;
	this.currentDate = new Date();
	 //this.taskForm.value.id=this.id;

	const cValue = formatDate(this.currentDate, 'yyyy', 'en-US');
	const ccValue=formatDate(this.currentDate,'dd','en-US');
	(new Date(),'yyyy/MM/dd', 'en');
	this.taskForm.get('deeForm').value.task_number_dee;
 	if(this.taskForm.get('deeForm').value.task_number_dee!=''){

 	  this.taskForm.get('deeForm').value.task_number_dee='WESEE/'+this.taskForm.get('deeForm').value.task_number_dee+'/'+cValue+'/'+ccValue;
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
    // formData.append('file', this.imgToUpload);
  let splitFirst=this.taskForm.get('deeForm').value.task_number_dee.split("/")[1]
	formData.append('cost_implication', this.taskForm.get('weseeForm').value.cost_implication);
	formData.append('time_frame_for_completion_days', this.taskForm.get('weseeForm').value.time_frame_for_completion_days);
  formData.append('time_frame_for_completion_month', this.taskForm.get('weseeForm').value.time_frame_for_completion_month);
	formData.append('comments_of_wesee', this.taskForm.get('weseeForm').value. comments_of_wesee);
	formData.append('task_number_dee', splitFirst);
	formData.append('comments_of_dee', this.taskForm.get('deeForm').value. comments_of_dee);
	formData.append('recommendation_of_acom_its', this.taskForm.get('acomForm').value.recommendation_of_acom_its);
	formData.append('approval_of_com', this.taskForm.get('comForm').value.approval_of_com);

    //formData.append('created_by', this.taskForm.value.created_by);
    formData.append('modified_by', this.api.userid.user_id);


	if (this.taskForm.valid) {
		//formData.append('id', this.editForm.value.id);
		this.api
		  .postAPI(
			environment.API_URL + "transaction/tasking/crud",
			formData,
		  )

        .subscribe((res) => {
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getTasking();
            this.closebutton.nativeElement.click();
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


 

    editOption(milestone) {
      this.isReadonly=false;
      this.MileStoneForm.enable();
      this.crudName = "Edit";
      this.milestonepopulate(milestone);

      var element = <HTMLInputElement> document.getElementById("exampleCheck1");

      openModal('#crud-milestone');


    }
    onDelete(id) {
      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: language[environment.DEFAULT_LANG].confirmMessage
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.api.postAPI(environment.API_URL + "transaction/milestone-status/crud", {
            id: id,
            status: 3,
          }).subscribe((res)=>{
            if(res.status==environment.SUCCESS_CODE) {
              this.notification.warn('Milestone '+language[environment.DEFAULT_LANG].deleteMsg);
              // this.getMileStone();
            } else {
              this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
            }
          });
        }
        dialogRef=null;
      });
    }

  OnMileStoneSubmit() {

	this.showError=true;
  this.MileStoneForm.patchValue({task_start_date:this.datepipe.transform(this.task_start_date,'yyyy-MM-dd')});
  this.MileStoneForm.patchValue({task_end_date:this.datepipe.transform(this.task_end_date,'yyyy-MM-dd')});

  const formData = new FormData();
  formData.append('milestone', this.MileStoneForm.value.milestone);
  formData.append('tasking', this.taskingID);
  formData.append('percentage_completion', this.MileStoneForm.value.percentage_completion);
  formData.append('budget_utilized', this.MileStoneForm.value.budget_utilized);
  formData.append('task_start_date', this.MileStoneForm.value.task_start_date);
  formData.append('task_end_date', this.MileStoneForm.value.task_end_date);
  formData.append('id',this.MileStoneForm.value.id);
  formData.append('manpower', this.MileStoneForm.value.manpower);
  formData.append('tasking_status', this.MileStoneForm.value.tasking_status);


  formData.append('modified_by', this.api.userid.user_id);

	if (this.MileStoneForm.valid) {
	// this.MileStoneForm.value.created_by = this.api.userid.user_id;
	  this.MileStoneForm.value.status = "1";
	 this.api.postAPI(environment.API_URL + "transaction/milestone-status/crud",formData).subscribe((res) => {
		 //this.error= res.status;
		 if(res.status==environment.SUCCESS_CODE){
		   // this.logger.log('Formvalue',this.editForm.value);
		   this.notification.success(res.message);
      //  this.getMileStone();
       let reset = this.formGroupDirective.resetForm();
      if(reset!==null) {
        this.initForm();
      }
		  //  this.closebutton.nativeElement.click();
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


  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit() {

  }

count:any;
count1:any;
count2:any;
count3:any;
archive_count:any;
countlist:any;
getDashboardCount(){


  this.api.getAPI(environment.API_URL+"transaction/archive_list").subscribe((res)=>{
    if(res.status==environment.SUCCESS_CODE) {
      this.archive_count=res.data.length;
    }
  });

  if(this.token_detail.role_id==3) {


      this.api.getAPI(environment.API_URL+"transaction/tasking/count?comment_status=3"+"&created_by_id="+this.token_detail.user_id).subscribe((res)=>{
        if(res.status==environment.SUCCESS_CODE) {
          // this.dataSourcelist = new MatTableDataSource(res.data);
          this.countlist = res.data;
          this.count=res.data.length;

        }
      });
    this.api.getAPI(environment.API_URL+"transaction/tasking/count?comment_status=1"+"&created_by_id="+this.token_detail.user_id).subscribe((res)=>{
      if(res.status==environment.SUCCESS_CODE) {
        this.count2=res.data.length;
      }

      });

    }

    else if (this.token_detail.process_id==3){


      this.api.getAPI(environment.API_URL+"transaction/tasking/count?comment_status=3"+"&assignedtaskinggroup__tasking_group__id="+this.token_detail.tasking_id).subscribe((res)=>{
        if(res.status==environment.SUCCESS_CODE) {
          // this.dataSourcelist = new MatTableDataSource(res.data);
          this.countlist = res.data;
          this.count=res.data.length;

        }
      });
    this.api.getAPI(environment.API_URL+"transaction/tasking/count?comment_status=1").subscribe((res)=>{
      if(res.status==environment.SUCCESS_CODE) {
        this.count2=res.data.length;

      }

      });


    }

    else{


      this.api.getAPI(environment.API_URL+"transaction/tasking/count?comment_status=3").subscribe((res)=>{
        if(res.status==environment.SUCCESS_CODE) {
          // this.dataSourcelist = new MatTableDataSource(res.data);
          this.countlist = res.data;
          this.count=res.data.length;

        }
      });
    this.api.getAPI(environment.API_URL+"transaction/tasking/count?comment_status=1").subscribe((res)=>{
      if(res.status==environment.SUCCESS_CODE) {
        this.count2=res.data.length;

      }

      });

    }


}
  openView(){
		this.TaskBlockRef = this.modalService.open(TaskBlockComponent, { size: 'lg' });
		this.TaskBlockRef.componentInstance.modelData = { 'data': 'view' };

  }
  task_del:any;
//   openPopup(index){
//   this.task_del=this.statusTasking[index]
//     // this.chart_data[0].series[0].data[0].id;
//     // console.log('iiui',this.task_del.project_status.start_date )
//     this.deleteProjectRef = this.modalService.open(this.template1);
//   }

  id:any;
  list:any;


  openEdit(country) {
    this.isReadonly=false;
    // this.taskForm.enable();
    this.crudName = "View";
	  this.id=country.id;
    this.populate(country);
    this.list=country;
	  this.taskForm.disable();
  //console.log('country',country)
	openModal('#crud-countries');}

  openDelete(){
    this.deleteProjectRef = this.modalService.open(this.template);

  }

  taskingID:any;
  openPopup(id) {
    this.taskingID=id;
    openModal('#crud-milestone');
    setTimeout(()=> {
      // this.getMileStone();
     }, 2000);


  }

  openview(id) {
    this.router.navigateByUrl("/dashboard/view-task?tasking_id="+btoa(id));

  }

  openlistitem(id) {
    this.taskingID=id;
    // this.getMileStone();
    openModal('#view-milestone');
    // this.getMileStone();
    // setTimeout(()=> {
    //   this.getMileStone();
    //  }, 2000);


  }

  ngOnDestroy(){
    // am5.disposeAllCharts();
   // rootctcm.dispose();
  }
  imgToUpload:any;
  onImageHandler(event) {
    if (event.target.files.length > 0) {
      this.imgToUpload= event.target.files[0];

     };

    }
	cancelmodal(){
		closeModal('#crud-countries');
		closeModal('#crud-milestone');
    closeModal('#view-milestone');

	  }

    close(){
      this.taskingID='';
      let data=[];
      this.dataSourcelist= new MatTableDataSource(data);
      closeModal('#crud-milestone');
    }

    closeview(){
      this.taskingID='';
      let data=[];
      this.dataSourcelist= new MatTableDataSource(data);
      closeModal('#view-milestone');
    }

    taskingGroups:any;
  getTaskingGroups() {
    this.api.getAPI(environment.API_URL + "master/taskinggroups").subscribe((res) => {
        this.taskingGroups = res.data;
		console.log('dfdsf',this.taskingGroups);
        //console.log('taskingGroups0',this.taskingGroups)
      });
  }
  statusData: any;
  getStatus(){
	this.api.getAPI(environment.API_URL + "master/lookup?type__code=PRO").subscribe((res) => {
        this.statusData = res.data;
		console.log('dfdstatusDatasf',this.statusData);
      });
  }

  getyearData() {
    this.api.getAPI(environment.API_URL + '/transaction/yearly-task-status/')
      .subscribe((res: any) => {
        this.yearlytaskdata = res;
        console.log('yearlytaskdata',this.yearlytaskdata) 
      },
      (error)=>{
        console.error('Error fetching pending data:', error);
      }
    )
  }
  getoverdue(){
    this.api.getAPI(environment.API_URL + '/transaction/overdue-by-group/').subscribe((res:any)=>{
      this.overdata=res.data;
      console.log('overdata',this.overdata);
    },
    (error)=>{
      console.error('Error fetching pending data:',error);
    }
  )
  
  }
  getpendingdata(){
    this.api.getAPI(environment.API_URL + '/transaction/pending-by-group/').subscribe((res:any)=>{
      this.Pendingdata=res.data;
      console.log('Pendingdata',this.Pendingdata);
    },
    (error)=>{
      console.error('Error fetching pending data:',error );
    }
  )
  }
  getgroupwise(){
    this.api.getAPI(environment.API_URL + '/transaction/group-wise/').subscribe((res:any)=>{
      this.groupdata=res.data;
     
      console.log('groupdata',this.groupdata);
    });
  }
getdistribution(){
  this.api.getAPI(environment.API_URL +'/transaction/task-distribution').subscribe((res:any)=>{
    this. distributiondata=res.data;
    console.log('distributiondata',this.distributiondata);
  }
  );
}


// 2ndchartapi
getyear() {
  this.api.getAPI(environment.API_URL + '/transaction/yearly-task-status/')
    .subscribe((res: any) => {
      this.apiyearlytaskdata1 = res;
      this.updateChartOptions(this.apidistributiondata1); // Update the chart options with API data
      console.log('apiyearlytaskdata1', this.apiyearlytaskdata1);
    });
}
updateChartOptions(data:any) {
  const years = this.apiyearlytaskdata1.map(item => item.year.toString());
  const taskCounts = this.apiyearlytaskdata1.map(item => item.count);

  this.chartOptions11 = {
    series: [
      {
        name: 'Tasks',
        data: taskCounts
      }
    ],
    chart: {
      type: 'bar',
      height: 350
    },
    xaxis: {
      categories: years
    }
  };
}


// 3rdchartapi
  getoverd(){
    this.api.getAPI(environment.API_URL + '/transaction/overdue-by-group/').subscribe((res:any)=>{
      this.apioverdata1=res.data;
      this.updateChartOptions1(this.apioverdata1);
      console.log('apioverdata1',this.apioverdata1);
    });
  }
  
  updateChartOptions1(data: any) {
    const categories = data.map((item: any) => item.sponsoring_directorate);
    const overdueCounts = data.map((item: any) => item.overdue_count);
    
    this.chartOptions13 = {
      series: [{
        name: 'Number of Overdue Tasks',
        data: overdueCounts
      }],
      chart: {
        type: 'bar',
        height: 450
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',  // Adjust the width of the bar
        },
      },
      xaxis: {
        categories: categories,
        labels: {
          rotate: -45,  // Rotate the labels for better visibility
        }
      },
      yaxis: {
        title: {
          text: 'Number of Overdue Tasks'
        }
      },
      fill: {
        colors: ['#2196f3'],  
      },
      title: {
        text: 'Overdue Tasks Summary by Group',
        align: 'center'
      }
    };
}

  // 4thchartapi

// getgroup(){
//   this.api.getAPI(environment.API_URL + '/transaction/group-wise/').subscribe((res:any)=>{
//     this.apigroupdata1=res.data;
//     this.updateChartOptions21(this.apigroupdata1);
//     console.log('apigroupdata1',this.apigroupdata1);
//   });
// }
// updateChartOptions21(data: any) {
//   const categories = data.map((item: any) => item.tasking_group_name);
//   const inProgressData = data.map((item: any) => {
//     const titleData = item.titles.find((title: any) => title.title === 'Work in Progress');
//     return titleData ? titleData.task_count : 0;
//   });
//   const completedData = data.map((item: any) => {
//     const titleData = item.titles.find((title: any) => title.title === 'Completed and closure in Progress');
//     return titleData ? titleData.task_count : 0;
//   });

//   this.chartOptions21 = {
//     series: [
//       {
//         name: 'IN PROGRESS',
//         data: inProgressData,
//         color: '#fcb040'  // Yellow
//       },
//       {
//         name: 'Completed and closure in Progress',
//         data: completedData,
//         color: '#f58220'  // Orange
//       }
//     ],
//     chart: {
//       type: 'bar',
//       height: 350,
//       stacked: true
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//       },
//     },
//     xaxis: {
//       categories: categories,  // Set categories to the extracted tasking group names
//       title: {
//         text: 'WESEE GROUP'
//       }
//     },
//     yaxis: {
//       title: {
//         text: 'Number of Tasks'
//       }
//     },
//     legend: {
//       position: 'top',
//       horizontalAlign: 'right'
//     },
//     fill: {
//       opacity: 1
//     },
//     title: {
//       text: 'Group-wise Task Summary',
//       align: 'center'
//     },
//     dataLabels: {
//       enabled: true
//     }
//   };
// }

getgroup(): void {
  this.api.getAPI(environment.API_URL + '/transaction/group-wise/').subscribe(
    (res: any) => {
      this.apigroupdata1 = res.data;
      this.updateChartOptionsGroup(this.apigroupdata1);
      console.log('apigroupdata1', this.apigroupdata1);
    },
    (error) => {
      console.error('Error fetching group data', error);
    }
  );
}

updateChartOptionsGroup(res: any[]): void {
  const categories = [];
  const seriesData = [
    {
      name: 'Work In Progress',
      data: [],
    },
    {
      name: 'Completed',
      data: [],
    },
    {
      name: 'Task Closed',
      data: [],
    },
  ];

  
  res.forEach((group) => {
    categories.push(group.tasking_group_name);

    
    const workInProgressCount = group.titles.reduce((count, title) => {
      if (title.title.includes('Work In Progress')) {
        return count + title.task_count;
      }
      return count;
    }, 0);

    
    const completedCount = group.titles.reduce((count, title) => {
      if (title.title.includes('Completed')) {
        return count + title.task_count;
      }
      return count;
    }, 0);

    
    const taskClosedCount = group.titles.reduce((count, title) => {
      if (title.title.includes('Task Closed')) {
        return count + title.task_count;
      }
      return count;
    }, 0);

    seriesData[0].data.push(workInProgressCount); 
    seriesData[1].data.push(completedCount);     
    seriesData[2].data.push(taskClosedCount);   
  });

  
  this.chartData.series = seriesData;
  this.chartOptionsGroup.xaxis.categories = categories;

  this.chartOptionsGroup.colors = ['#f7a400',  '#492a73', '#3a9efd', '#f7a400', '#FFB6C1', '#E6E6FA', '#AFEEEE'];


}



// 5thchartapi

getdistri() {
  this.api.getAPI(environment.API_URL + '/transaction/task-distribution').subscribe((res: any) => {
    this.apidistributiondata1 = res.data;
    this.updated12(this.apidistributiondata1); // Pass the data to updated12
    console.log('apidistributiondata', this.apidistributiondata1);
  });
}


updated12(data: any) { 
  const completedCount = data.completed.count;
  const inProgressCount = data.in_progress.count;
  this.chartOptions12 = {
    series: [inProgressCount, completedCount],
    chart: {
      type: 'pie',
      height: 350,
    },
    labels: ['IN PROGRESS', 'COMPLETED'],
    colors: ["#adff2f" ,"#ff0000ad"], // Green for IN PROGRESS, Yellow for COMPLETED
    legend: {
      position: 'right',
      horizontalAlign: 'center'
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number | string) => `${parseFloat(val as string).toFixed(1)}%`
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    title: {
      text: 'Task Status Distribution',
      align: 'center'
    }
  };
}




// 6tchartAPI
getextend() {
  this.api.getAPI(environment.API_URL + '/transaction/extended-deadlines/').subscribe((res: any) => {
    this.extenddata = res.data;
    this.updated22(this.extenddata); // Pass the data to updated22
    console.log('extenddata', this.extenddata);
  });
}

updated22(data: any) {
  const groupNames: string[] = [];
  const extensionCounts: number[] = [];

  data.forEach((item: any) => {
    groupNames.push(item.tasking_group_name);
    extensionCounts.push(item.extension_count);
  });

  // Update the chart options with the processed data
  this.chartOptions22 = {
    series: [
      {
        name: 'Number of Extended Deadlines',
        data: extensionCounts
      }
    ],
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%'
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: groupNames,
      title: {
        text: 'WESEE GROUP'
      }
    },
    yaxis: {
      title: {
        text: 'Number of Extended Deadlines'
      }
    },
    title: {
      text: 'Tasks with Extended Deadlines by Group',
      align: 'center'
    }
  };
}




// getStatusTaskingNew() {
//   this.api.getAPI(environment.API_URL + '/transaction/tasking-status?flag=dashboard/')
//     .subscribe((res: any) => {
//       this.statusTaskingNew = res.data;
//       this.tabledata(this.statusTaskingNew);
//       console.log('statusTaskingNew', this.statusTaskingNew);
//     });
//   }

//     tabledata(data:any){

//     }


approveTask:any
getNewTaskingStatus() {
  this.api.getAPI(environment.API_URL + 'transaction/tasking-status?flag=dashboard/')
    .subscribe((res: any) => {
      console.log(res);
      if (res && res.data) {
           
        this.newTableDataSource =res.data 
        this.approveTask = res.data
        // this.newTableDataSource.paginator = this.pagination;
      } else {
        console.error('Data part of the response is undefined');
      }
    }, error => {
      console.error('Error fetching API data', error);
    });
}

applyFilter1(event: Event) {
  this.filterValue = (event.target as HTMLInputElement).value;
  if (this.filterValue) {
    this.newTableDataSource.filter = this.filterValue.trim().toLowerCase();
    // this.dataSource.filter = this.filterValue.trim().toLowerCase();
  } else {
    // this.getTasking();
    this.getNewTaskingStatus();
  }
}

handleFilter(filterValue: any) {

  console.log('Filter triggered with value:', filterValue);
}
handlePagination(pageEvent: any) {
  console.log('Pagination triggered with event:', pageEvent);
}

gridColum = [
  { field: 'tasking.task_name', header: 'Task Name', filter: true, filterMatchMode: 'contains' },
  { field: 'tasking.task_number_dee', header: 'Task Number', filterMatchMode: 'contains', filter: false, },
  { field: 'tasking.sponsoring_directorate', header: 'Sponsoring Directorate', filter: true, filterMatchMode: 'contains' },
  { field: 'assigned_tasking_group.name', header: 'Assigned Tasking Group Name', filter: true, filterMatchMode: 'contains' },
  { field: 'secondary_title', header: 'Status', filter: true, filterMatchMode: 'contains' },

]

  }

