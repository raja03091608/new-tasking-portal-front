import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { ApiService } from '../../service/api.service';
import { environment } from '../../../environments/environment.prod';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';

Chart.register(ChartDataLabels);
@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
    @ViewChild('groupWiseChart') groupWiseChart!: UIChart;
    @ViewChild('yearWiseData') yearWiseData!: UIChart;
    @ViewChild('overDueChart') overDueChart!: UIChart;
    @ViewChild('extDate') extDate!: UIChart;

    // @ViewChild('groupWiseChart') groupWiseChart!: UIChart;
    // @ViewChild('yearWiseData') yearWiseData!: UIChart;
    // @ViewChild('overDueChart') overDueChart!: UIChart;
    // @ViewChild('extDate') extDate!: UIChart;
    @ViewChild('taskStatusChart') taskStatusChart!: UIChart;
    @ViewChild('statusByGroupChart') statusByGroupChart!: UIChart;
    @ViewChild('statusCSIGroupChart') statusCSIGroupChart!: UIChart;
    @ViewChild('statusCMSGroupChart') statusCMSGroupChart!: UIChart;
    @ViewChild('statusSCSGroupChart') statusSCSGroupChart!: UIChart;
    @ViewChild('statusTaNCSGroupChart') statusTaNCSGroupChart!: UIChart;
    @ViewChild('statusCSCGroupChart') statusCSCGroupChart!: UIChart;
    @ViewChild('pieChart1') pieChart1!: UIChart;
    @ViewChild('pieChart2') pieChart2!: UIChart;

    @Input() showGroupWiseChart: boolean = true;
    @Input() showYearlyReport: boolean = true;
    @Input() showTaskDistribution: boolean = true;
    @Input() showExtendedDeadlines: boolean = true;
    @Input() showOverdueTasks: boolean = true;
    @Input() showGroupwiseChart: boolean = true;
    @Input() showTaskStatus: boolean = true;
    @Input() showStatusByGroup: boolean = true;
    @Input() showCMSStatus: boolean = true;
    @Input() showCSCStatus: boolean = true;
    @Input() showSCSStatus: boolean = true;
    @Input() showTaNCSStatus: boolean = true;

    stackBarChart: any;
    stackBarChartOptions: any;
    yearWise: any;
    yearWiseOption: any;
    OverDueData: any;
    overDueOptions: any;
    extData: any;
    extDataOptions: any;
    pieChartData: any;
    pieChartDataOption: any;

    colors = ["#008FFB", "#00E396", "#FEB019", "#FF4560"];

    constructor(private api: ApiService) {}

    ngOnInit(): void {
        this.getStackBarChart();
        this.generateChart();
        this.overDue();
        this.updated22();
        this.pieChart();
        this.taskingSponsoringDirectorate()
        this.generateDirectorateChart()
        this.loadOngoingTasksChart()
        this.loadTaskIssuedChart()
        this.initGroupwiseChart();
        this.initPieCharts();
        this.initTaskStatusChart();
        this.initStatusByGroupChart();
        this.initCSIGroupChart();
        this.initCMSGroupChart();
        this.initSCSGroupChart();
        this.initTaNCSGroupChart();
        this.initCSCGroupChart();
        this.initETGGroupChart()
    }

    // ✅ Stacked Bar Chart (Group-wise)
    getStackBarChart() {
        this.api.getAPI(environment.API_URL + 'transaction/group-wise/').subscribe((response: any) => {
            if (!response || !response.data) {
                console.error('Invalid API response:', response);
                return;
            }

            const groups = response.data;
            const moduleNames: string[] = [];
            const workInProgressData: number[] = [];
            const completedData: number[] = [];
            const taskClosedData: number[] = [];

            groups.forEach((group) => {
                moduleNames.push(group.tasking_group_name);

                let workInProgressCount = 0, completedCount = 0, taskClosedCount = 0;
                group.titles.forEach((title) => {
                    if (title.title.includes('Work In Progress')) workInProgressCount += title.task_count;
                    else if (title.title.includes('Completed')) completedCount += title.task_count;
                    else if (title.title.includes('Task Closed')) taskClosedCount += title.task_count;
                });

                workInProgressData.push(workInProgressCount);
                completedData.push(completedCount);
                taskClosedData.push(taskClosedCount);
            });

            this.stackBarChart = {
                labels: moduleNames,
                datasets: [
                    {
                        label: 'Work In Progress',
                        backgroundColor: '#f7a400',
                        data: workInProgressData,
                        stack: 'Stack 0',
                        barThickness: 130, 
                         maxBarThickness: 130
                    },
                    {
                        label: 'Completed',
                        backgroundColor: '#3a9efd',
                        data: completedData,
                        stack: 'Stack 0',
                        barThickness: 130, 
                        maxBarThickness: 130
                    },
                    {
                        label: 'Task Closed',
                        backgroundColor: '#492a73',
                        data: taskClosedData,
                        stack: 'Stack 0',
                        barThickness: 130, 
                        maxBarThickness: 130
                    
                    }
                ]
            };

            this.stackBarChartOptions = {
                ...this.getChartOptions("Number of Tasks","WESEE GROUP"),
                
            };
        });
    }

    // ✅ Yearly Task Report (Vertical Bar)
    generateChart() {
        this.api.getAPI(environment.API_URL + 'transaction/yearly-task-status/').subscribe((response: any) => {
            if (!response || !Array.isArray(response)) {
                console.error('Invalid API response:', response);
                return;
            }

            const years = response.map(item => item.year.toString());
            const taskCounts = response.map(item => item.count);

            this.yearWise = {
                labels: years,
                datasets: [{
                    label: 'Completed Tasks',
                    data: taskCounts,
                    backgroundColor: '#00E396',
                    barThickness: 40, 
                    maxBarThickness: 40
                }]
            };

            this.yearWiseOption = {
                ...this.getChartOptions("Number of Tasks","YEARS"),
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        display: true,
                        color: '#fff',
                        font: { size: 18, weight: 'bold' },
                        anchor: 'center',
                        align: 'center'
                    }
                }
            };
        });
    }

    // ✅ Overdue Tasks by Group
    overDue() {
        this.api.getAPI(environment.API_URL + 'transaction/overdue-by-group/').subscribe((res: any) => {
            if (!res || !res.data) {
                console.error('Invalid API response:', res);
                return;
            }

            const categories = res.data.map(item => item.sponsoring_directorate);
            const seriesData = res.data.map(item => item.overdue_count);

            this.OverDueData = {
                labels: categories,
                datasets: [{
                    label: 'Overdue Tasks',
                    data: seriesData,
                    backgroundColor: this.colors,
                    barThickness: 90, 
                    maxBarThickness: 90
                }]
            };

            this.overDueOptions = {
                ...this.getChartOptions("Number of Overdue Tasks","WESEE GROUP"),
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        display: true,
                        color: '#fff',
                        font: { size: 18, weight: 'bold' },
                        anchor: 'center',
                        align: 'center'
                    }
                }
            };
        });
    }

    // ✅ Extended Task Report
    updated22() {
        this.api.getAPI(environment.API_URL + 'transaction/extended-deadlines/').subscribe((res: any) => {
            if (!res || !res.data) {
                console.error('Invalid API response:', res);
                return;
            }

            const groupNames = res.data.map(item => item.tasking_group_name);
            const extensionCounts = res.data.map(item => item.extension_count);
            
            // Define a list of custom colors
            const customColors = [
                "#00E396","#008FFB", "#FF4560" , "#FEB019"
            ];
            
            // Assign colors dynamically (looping through colors if there are more bars than colors)
            const barColors = groupNames.map((_, index) => customColors[index % customColors.length]);
            
            this.extData = {
                labels: groupNames,
                datasets: [{
                    label: 'Extended Deadlines',
                    data: extensionCounts,
                    backgroundColor: barColors ,
                    barThickness: 90, 
                    maxBarThickness: 90
                }]
            };
            

            this.extDataOptions = {
                ...this.getChartOptions("Number of Extended Deadlines","WESEE GROUP"),
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        display: true,
                        color: '#fff',
                        font: { size: 18, weight: 'bold' },
                        anchor: 'center',
                        align: 'center'
                    }
                }
            };
        });
    }

    // ✅ Task Distribution Pie Chart
    pieChart() {
        this.api.getAPI(environment.API_URL + 'transaction/task-distribution').subscribe((res: any) => {
            if (!res || !res.data) {
                console.error('Invalid API response:', res);
                return;
            }

            const completedCount = res.data.completed.count;
            const inProgressCount = res.data.in_progress.count;

            this.pieChartData = {
                labels: ['IN PROGRESS', 'COMPLETED'],
                datasets: [{
                    data: [inProgressCount, completedCount],
                    backgroundColor: ["#F4CE14", "#379777"]
                }]
            };

            this.pieChartDataOption = {
                
                plugins: {
                    datalabels: { display: true, color: '#fff',
                        font: { size: 18, weight: 'bold' },
                        anchor: 'center',
                        align: 'center' }
                }
            };
        });
    }

    // ✅ Helper function to apply consistent chart options
    getChartOptions(yLabel: string,xlable) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 0.5,
            plugins: {
                datalabels: {
                    display: true,
                    color: '#fff',
                    font: { size: 18, weight: 'bold' },
                    anchor: 'center',
                    align: 'center'
                }
            },
            scales: {
                x: { title: { display: true, text: xlable ,font: { size: 18, weight: 'bold' }},font: { size: 18, weight: 'bold' } },
                y: { title: { display: true, text: yLabel ,font: { size: 18, weight: 'bold' } }, beginAtZero: true ,}
            }
        };
    }


    

    // ✅ **Download Chart as PNG**
    downloadChart(chartInstance: any, filename: string): void {
        const base64Image = chartInstance?.toBase64Image();
        if (base64Image) {
            const link = document.createElement('a');
            link.href = base64Image;
            link.download = `${filename}.png`;
            link.click();
        } else {
            console.error('Failed to generate chart image.');
        }
    }

    // ✅ **Download Data as CSV**
    downloadCSV(chartData: any, filename: string): void {
        if (!chartData || !chartData.labels || !chartData.datasets) {
            console.error('Invalid chart data.');
            return;
        }

        const headers = ['Category', ...chartData.datasets.map(ds => ds.label)];
        const rows = chartData.labels.map((label, index) => {
            const row = [label];
            chartData.datasets.forEach(ds => row.push(ds.data[index]));
            return row;
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.csv`;
        link.click();
    }


    directorateChartData: any;
    directorateChartOptions: any;
    
    // ✅ **Function to populate the chart data**
    taskingSponsoringDirectorate() {
        const directorates = [
            'WESEE', 'WDB', 'PMG CMS', 'NHO', 'DWE', 'DSR', 'DSP', 'DMAQ',
            'DNS', 'DNSO/DNS', 'DNSO', 'DNSM', 'DNI', 'DNCO', 'DNOM',
            'DIT', 'DEE/WDB', 'DEE/DNS', 'DEE/DNAS', 'DEE (SM)', 'DEE'
        ];

        const taskCounts = {
            CMS: [5, 2, 3, 1, 8, 15, 12, 3, 4, 1, 5, 2, 3, 4, 2, 5, 6, 3, 2, 10, 8],
            CSC: [2, 1, 2, 0, 5, 8, 6, 1, 2, 0, 3, 1, 1, 2, 1, 3, 2, 1, 1, 4, 3],
            CSI: [3, 1, 2, 1, 7, 12, 10, 2, 3, 1, 4, 2, 2, 3, 2, 4, 5, 2, 1, 9, 7],
            ETG: [1, 0, 1, 0, 3, 5, 4, 1, 1, 0, 2, 1, 0, 1, 0, 2, 2, 1, 0, 3, 2],
            SCS: [4, 2, 3, 1, 9, 14, 11, 3, 4, 1, 5, 3, 3, 4, 2, 5, 6, 3, 2, 11, 9],
            TaNCS: [6, 3, 4, 2, 10, 18, 14, 4, 5, 2, 6, 3, 4, 5, 3, 6, 7, 4, 3, 12, 10]
        };

        this.directorateChartData = {
            labels: directorates,
            datasets: [
                { label: 'CMS', backgroundColor: '#008FFB', data: taskCounts.CMS },
                { label: 'CSC', backgroundColor: '#FF9800', data: taskCounts.CSC },
                { label: 'CSI', backgroundColor: '#4CAF50', data: taskCounts.CSI },
                { label: 'ETG', backgroundColor: '#F44336', data: taskCounts.ETG },
                { label: 'SCS', backgroundColor: '#9C27B0', data: taskCounts.SCS },
                { label: 'TaNCS', backgroundColor: '#795548', data: taskCounts.TaNCS }
            ]
        };

        // ✅ **Using helper function to generate chart options**
        this.directorateChartOptions = this.getChartOptionsStackBar("Sponsor Directorate", "Tasks");
    }
    distributionChartData: any;
    distributionChartOptions: any;
    
    generateDirectorateChart() {
        const directorates = [
            'WESEE', 'WDB', 'PMG CMS', 'NHO', 'DWE', 'DSR', 'DSP', 'DMAQ',
            'DNS', 'DNSO/DNS', 'DNSO', 'DNSM', 'DNI', 'DNCO', 'DNOM',
            'DIT', 'DEE/WDB', 'DEE/DNS', 'DEE/DNAS', 'DEE (SM)', 'DEE'
        ];
  
        const taskCounts = {
            Completed: [5, 2, 3, 1, 8, 15, 12, 3, 4, 1, 5, 2, 3, 4, 2, 5, 6, 3, 2, 10, 8],
            TaskClosed: [2, 1, 2, 0, 5, 8, 6, 1, 2, 0, 3, 1, 1, 2, 1, 3, 2, 1, 1, 4, 3],
            WorkInProgress: [3, 1, 2, 1, 7, 12, 10, 2, 3, 1, 4, 2, 2, 3, 2, 4, 5, 2, 1, 9, 7]
        };
  
        this.distributionChartData = {
            labels: directorates,
            datasets: [
                { label: 'Completed', backgroundColor: '#007bff', data: taskCounts.Completed },
                { label: 'Task Closed', backgroundColor: '#ff9800', data: taskCounts.TaskClosed },
                { label: 'Work In Progress', backgroundColor: '#4caf50', data: taskCounts.WorkInProgress }
            ]
        };
  
        // ✅ **Using helper function to generate chart options**
        this.distributionChartOptions = this.getChartOptionsStackBar("Sponsor Directorate", "Tasks");
    }


    ongoingTasksData: any;
    ongoingTasksOptions: any;

    loadOngoingTasksChart() {
        this.ongoingTasksData = {
            labels: ['2021', '2022', '2023', '2024', '2025'],
            datasets: [
                {
                    label: 'CMS',
                    backgroundColor: '#008FFB',
                    data: [8, 5, 10, 15, 2]
                },
                {
                    label: 'CSC',
                    backgroundColor: '#FF9800',
                    data: [5, 3, 6, 8, 2]
                },
                {
                    label: 'CSI',
                    backgroundColor: '#4CAF50',
                    data: [10, 6, 12, 20, 5]
                },
                {
                    label: 'ETG',
                    backgroundColor: '#F44336',
                    data: [3, 2, 4, 6, 1]
                },
                {
                    label: 'SCS',
                    backgroundColor: '#9C27B0',
                    data: [7, 5, 8, 10, 3]
                },
                {
                    label: 'TaNCS',
                    backgroundColor: '#795548',
                    data: [12, 10, 15, 18, 7]
                }
            ]
        };

        this.ongoingTasksOptions = this.getChartOptionsStackBar('Year','Tasks','y','top')
    }
    taskIssuedData: any;
    taskIssuedOptions: any;

    loadTaskIssuedChart() {
        this.taskIssuedData = {
            labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
            datasets: [
                {
                    label: 'Completed',
                    backgroundColor: '#008FFB',
                    data: [2, 4, 3, 3, 2, 5, 8, 10, 12, 3]
                },
                {
                    label: 'Task Closed',
                    backgroundColor: '#FF9800',
                    data: [3, 5, 4, 4, 3, 10, 6, 12, 8, 2]
                },
                {
                    label: 'Work In Progress',
                    backgroundColor: '#4CAF50',
                    data: [1, 2, 1, 1, 0, 20, 12, 15, 10, 1]
                }
            ]
        };
        this.taskIssuedOptions = this.getChartOptionsStackBar('Year','Tasks',"x",'top') 
    }
    getChartOptionsStackBar(yLabel: string, xLabel: string,indexAxis='y',pos='right') {
        return {
            indexAxis: indexAxis,
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 0.7,
            plugins: {
                legend: { display: true, position: pos },
                tooltip: { enabled: true },
                datalabels: {
                    display: false,
                    color: '#fff',
                    font: { size: 14, weight: 'bold' },
                    anchor: 'center',
                    align: 'center'
                }
            },
            scales: {
                x: { 
                    stacked: true,
                    title: { display: true, text: xLabel, font: { size: 16, weight: 'bold' } },
                    ticks: { beginAtZero: true }
                },
                y: { 
                    stacked: true,
                    title: { display: true, text: yLabel, font: { size: 16, weight: 'bold' } }
                }
            },
            elements: {
                bar: {
                    borderSkipped: false,
                    borderWidth: 1,
                    barPercentage: 0.9,  // **Adjusts bar thickness**
                    categoryPercentage: 0.9  // **Controls space between bars**
                }
            }
        };
    }

    groupwiseChartData: any;
    groupwiseChartOptions: any;
    statusByGroupChartData: any;
    statusByGroupChartDataOption: any;
    pieChartData1: any;
    pieChartData2: any;
    taskStatusChartData: any;
    statusCSIGroupChartData: any;
    statusCMSGroupChartData: any;
    statusSCSGroupChartData: any;
    statusTaNCSGroupChartData: any;
    statusCSCGroupChartData: any;
    statusETGGroupChartData: any;
  

    commanChartOption={
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 0.7,
        indexAxis: 'y', // ✅ **Makes the chart horizontal**
        plugins: {
            legend: { display: false },
            datalabels: { display: true, color: '#000', font: { size: 12, weight: 'bold' } }
        },
        scales: {
            x: {
            title: { display: true, text: "Tasks", font: { size: 14, weight: 'bold' } },
            beginAtZero: true
            },
            y: {
            title: { display: true, text: "Category", font: { size: 14, weight: 'bold' } }
            }
        }
        
    }
    
    initGroupwiseChart() {
      this.groupwiseChartData = {
        labels: ['CMS', 'CSC', 'CSI', 'ETG', 'SCS', 'TaNCS'],
        datasets: [
          { label: 'Completed', backgroundColor: '#008FFB', data: [5, 4, 6, 1, 3, 7] },
          { label: 'Task Closed', backgroundColor: '#FF9800', data: [15, 12, 18, 3, 7, 14] },
          { label: 'Work In Progress', backgroundColor: '#4CAF50', data: [20, 10, 30, 2, 5, 30] }
        ]
      };
      this.groupwiseChartOptions = this.getChartOptionsStackBar('Tasks', 'Group','x','top');
    }
  
    initPieCharts() {
      this.pieChartData1 = {
        labels: ['CSI', 'CSC', 'SCS', 'ETG', 'TaNCS', 'CMS'],
        datasets: [{
          data: [53, 26, 12, 3, 51, 35],
          backgroundColor: ['#008FFB', '#FF9800', '#4CAF50', '#9C27B0', '#F44336', '#795548']
        }]
      };
      
      this.pieChartData2 = {
        labels: ['Time Independent', 'Completed', 'Task Closed', 'WIP'],
        datasets: [{
          data: [24, 20, 77, 83],
          backgroundColor: ['#008FFB', '#F44336', '#4CAF50', '#FF9800']
        }]
      };
    }
  
    initTaskStatusChart() {
      this.taskStatusChartData = {
        labels: ['Total', 'Work In Progress', 'Completed', 'Approval in Progress', 'Closure in Progress', 'Extension in Progress'],
        datasets: [{
          label: 'Status',
          backgroundColor: ['#90EE90', '#ADD8E6', '#D3D3D3', '#FFA500', '#800080', '#FF69B4'],
          data: [100, 70, 30, 10, 5, 8]
        }]
      };
    }
  
    initStatusByGroupChart() {
      this.statusByGroupChartData = {
        labels: ['Work In Progress', 'Completed'],
        datasets: [
          { label: 'CMS', backgroundColor: '#008FFB', data: [15, 5] },
          { label: 'CSC', backgroundColor: '#FF9800', data: [12, 4] },
          { label: 'CSI', backgroundColor: '#4CAF50', data: [18, 6] },
          { label: 'ETG', backgroundColor: '#9C27B0', data: [3, 1] },
          { label: 'SCS', backgroundColor: '#F44336', data: [7, 3] },
          { label: 'TaNCS', backgroundColor: '#795548', data: [14, 7] }
        ]
      };
      this.statusByGroupChartDataOption={
          ...this.getChartOptionsStackBar('','','x','top'),
        
        
    }
        
    }
  
    initCSIGroupChart() {
      this.statusCSIGroupChartData = {
        labels: ['Total', 'Work In Progress', 'Completed', 'Approval in Progress', 'Closure in Progress', 'Extension in Progress'],
        datasets: [{ backgroundColor: ['#90EE90', '#ADD8E6', '#D3D3D3', '#FFA500', '#800080', '#FF69B4'], data: [35, 25, 10, 5, 3, 4] }]
      };
    }
  
    initCMSGroupChart() {
      this.statusCMSGroupChartData = {
        labels: ['Total', 'Work In Progress', 'Completed', 'Approval in Progress', 'Closure in Progress', 'Extension in Progress'],
        datasets: [{ backgroundColor: ['#90EE90', '#ADD8E6', '#D3D3D3', '#FFA500', '#800080', '#FF69B4'], data: [25, 10, 6, 4, 0, 0] }]
      };
    }
  
    initSCSGroupChart() {
      this.statusSCSGroupChartData = {
        labels: ['Total', 'Work In Progress', 'Completed', 'Approval in Progress', 'Closure in Progress', 'Extension in Progress'],
        datasets: [{ backgroundColor: ['#90EE90', '#ADD8E6', '#D3D3D3', '#FFA500', '#800080', '#FF69B4'], data: [20, 10, 6, 4, 2, 3] }]
   
      };
    }
  
    initTaNCSGroupChart() {
      this.statusTaNCSGroupChartData = {
        labels: ['Total', 'Work In Progress', 'Completed', 'Approval in Progress', 'Closure in Progress', 'Extension in Progress'],
        datasets: [{ backgroundColor: ['#90EE90', '#ADD8E6', '#D3D3D3', '#FFA500', '#800080', '#FF69B4'], data: [25, 8, 3, 8, 0, 3] }]
   
      };
    }
  
    initCSCGroupChart() {
      this.statusCSCGroupChartData = {
        labels: ['Total', 'Work In Progress', 'Completed', 'Approval in Progress', 'Closure in Progress', 'Extension in Progress'],
        datasets: [{ backgroundColor: ['#90EE90', '#ADD8E6', '#D3D3D3', '#FFA500', '#800080', '#FF69B4'], data: [19, 11, 4, 1, 2, 0] }]
   
      };
    }

    initETGGroupChart() {
        this.statusETGGroupChartData = {
            labels: ['Total', 'Work In Progress', 'Completed', 'Approval in Progress', 'Closure in Progress', 'Extension in Progress'],
            datasets: [{ backgroundColor: ['#90EE90', '#ADD8E6', '#D3D3D3', '#FFA500', '#800080', '#FF69B4'], data: [16, 8, 6, 1, 2, 3] }]
       
        };
      }
    


}
