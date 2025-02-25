import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { ApiService } from '../../service/api.service';
import { environment } from '../../../environments/environment.prod';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { ChartColors } from './chart-colors';

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
    pieChartDataOption: any;

    // colors = ["#E6F3FF", "#FFE6E6", "#E6FFE6", "#FFE6F3"];

    // Use centralized color configuration
    standardColors = ChartColors;

    constructor(private api: ApiService) {}

    ngOnInit(): void {
        this.loadYearlyTaskStatusCount();
        this.loadYearlyGroupwiseTaskCount();
        this.loadGroupwiseTaskCount();
        this.loadDirectorateTaskStatus();
        this.loadDirectorateGroupwiseTaskCount();
        this.loadTaskStatusCount();
        // this.taskingSponsoringDirectorate()
        // this.generateDirectorateChart()
        // this.loadOngoingTasksChart()
        // this.loadTaskIssuedChart()
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
        this.getStackBarChart()
    }

    distributionChartData: any;
    distributionChartOptions: any;
    directorateChartData: any;
    directorateChartOptions: any;
    ongoingTasksData: any;
    ongoingTasksOptions: any;
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
    
    // API Integration Methods
    loadYearlyTaskStatusCount() {
        this.api.getAPI(environment.API_URL + 'transaction/yearly-task-status-count/')
          .subscribe((res: any[]) => {
             const years = res.map(item => item.year);
            const completed = res.map(item => item.Completed);
            const closed = res.map(item => item['Task Closed']);
            const inProgress = res.map(item => item['Work In Progress']);
      
            this.taskIssuedData = {
              labels: years,
              datasets: [
                {
                  label: 'Completed',
                  backgroundColor: this.standardColors.completed,
                  data: completed
                },
                {
                  label: 'Task Closed',
                  backgroundColor: this.standardColors.closed,
                  data: closed
                },
                {
                  label: 'Work In Progress',
                  backgroundColor: this.standardColors.inProgress,
                  data: inProgress
                }
              ]
            };
      
            // 3. Set the chart options (assuming you have a helper)
            this.taskIssuedOptions = this.getChartOptionsStackBar('Year', 'Tasks', 'x', 'top');
          });
      }
      
      loadYearlyGroupwiseTaskCount() {
        this.api.getAPI(environment.API_URL + 'transaction/yearly-groupwise-task-count/')
          .subscribe((res: any[]) => {
            const allGroups = Array.from(
              res.reduce((acc, item) => {
                item.task_groups.forEach(tg => acc.add(tg.group_code));
                return acc;
              }, new Set<string>())
            );
            const labels = res.map(item => item.year);
            const datasets = allGroups.map(group => {
              return {
                label: group as string,
                backgroundColor: this.getGroupColor(group as string),
                data: res.map(item => {
                  const found = item.task_groups.find(tg => tg.group_code === group);
                  return found ? found.task_count : 0;  // Default 0 if not found
                })
              };
            });
      
            this.ongoingTasksData = {
              labels,
              datasets
            };
      
            // Your existing stacked-bar configuration
            this.ongoingTasksOptions = this.getChartOptionsStackBar('Year', 'Tasks', 'y', 'top');
          });
      }
      

      loadGroupwiseTaskCount() {
        this.api.getAPI(environment.API_URL + 'transaction/groupwise-task-count/')
          .subscribe((res: any[]) => {
      
            // 1. Build arrays for labels and data
            const labels = res.map(item => item.group_code);
            const values = res.map(item => item.task_count);
      
            // 2. Configure the chart data
            this.groupwiseChartData = {
              labels: labels,
              datasets: [
                {
                  label: 'Total Tasks',
                  // Assign a unique color for each group (optional)
                  backgroundColor: labels.map(group => this.getGroupColor(group)),
                  data: values
                }
              ]
            };
      
            // 3. Configure chart options (your existing helper method)
            this.groupwiseChartOptions = this.getChartOptionsStackBar('Tasks', 'Group', 'x', 'top');
          });
      }
      

      loadDirectorateTaskStatus() {
        this.api.getAPI(environment.API_URL + 'transaction/directorate-task-status/')
          .subscribe((res: any[]) => {
      
            // Extract each piece of data from the array response
            const directorates = res.map(item => item.sponsoring_directorate);
            const completed = res.map(item => item.Completed || 0);
            const closed = res.map(item => item['Task Closed'] || 0);
            const inProgress = res.map(item => item['Work In Progress'] || 0);
      
            // Build the chart data
            this.distributionChartData = {
              labels: directorates,
              datasets: [
                {
                  label: 'Completed',
                  backgroundColor: this.standardColors.completed,
                  data: completed
                },
                {
                  label: 'Task Closed',
                  backgroundColor: this.standardColors.closed,
                  data: closed
                },
                {
                  label: 'Work In Progress',
                  backgroundColor: this.standardColors.inProgress,
                  data: inProgress
                }
              ]
            };
      
            // Configure the chart (using your existing stacked bar helper)
            this.distributionChartOptions = this.getChartOptionsStackBar('Sponsor Directorate', 'Tasks','y','top',0.2);
          });
      }
      

      loadDirectorateGroupwiseTaskCount() {
        this.api.getAPI(environment.API_URL + 'transaction/directorate-groupwise-task-count/')
          .subscribe((res: any[]) => {
      
            // 1. Extract all unique group codes across all directorates
            const allGroups = Array.from(
              res.reduce((acc, item) => {
                item.task_groups.forEach(tg => acc.add(tg.group_code));
                return acc;
              }, new Set<string>())
            );
      
            // 2. Labels will be each directorate in the data
            const labels = res.map(item => item.sponsoring_directorate);
      
            // 3. Build datasets, one for each unique group code
            const datasets = allGroups.map(group => {
              return {
                label: group as string,
                backgroundColor: this.getGroupColor(group as string),
                data: res.map(item => {
                  // Find task_groups entry with the matching group_code
                  const found = item.task_groups.find(tg => tg.group_code === group);
                  return found ? found.task_count : 0;  // Default to 0 if not found
                })
              };
            });
      
            // 4. Assign chart data and options
            this.directorateChartData = {
              labels,
              datasets
            };
      
            // Your existing stacked-bar configuration
            this.directorateChartOptions = this.getChartOptionsStackBar('Sponsor Directorate', 'Tasks','y','top',0.2);
          });
      }
      
       // Add new function to load task status count
    loadTaskStatusCount() {
      this.api.getAPI(environment.API_URL + 'transaction/taskcount-statuswise/')
          .subscribe((res: any[]) => {
              // Transform the API response into chart data
              const statusData = {
                  labels: [],
                  datasets: [{
                      label: 'Status',
                      backgroundColor: [],
                      data: []
                  }]
              };

              // Color mapping for different statuses
              const statusColors = {
                  'Total':this.standardColors.total, 
                  'Work In Progress':this.standardColors.inProgress, 
                  'Completed':this.standardColors.completed, 
                  'Approval in Progress':this.standardColors.approvalInProgress,
                  'Closure in Progress':this.standardColors.closureInProgress,
                  'Extension in Progress':this.standardColors.extensionInProgress   // '#FFE6E6'
              };

              // Process each status from the API response
              res.forEach(item => {
                  statusData.labels.push(item.status);
                  statusData.datasets[0].data.push(item.count);
                  statusData.datasets[0].backgroundColor.push(statusColors[item.status] || '#FFF3E6');
              });

              // Update the task status chart data
              this.taskStatusChartData = statusData;

              // Update individual group status charts
              this.updateGroupStatusCharts(res);
          });
  }

    // Helper method for consistent group colors
    getGroupColor(group: string): string {
        return this.standardColors[group] || this.standardColors.default;
    }

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
                      backgroundColor: this.standardColors.inProgress,
                      data: workInProgressData,
                      stack: 'Stack 0',
                      barThickness: 130, 
                      maxBarThickness: 130
                  },
                  {
                      label: 'Completed',
                      backgroundColor: this.standardColors.completed,
                      data: completedData,
                      stack: 'Stack 0',
                      barThickness: 130, 
                      maxBarThickness: 130
                  },
                  {
                      label: 'Task Closed',
                      backgroundColor: this.standardColors.closed,
                      data: taskClosedData,
                      stack: 'Stack 0',
                      barThickness: 130, 
                      maxBarThickness: 130
                  }
              ]
          };

          this.stackBarChartOptions = {
              ...this.getChartOptionsStackBar("Number of Tasks","WESEE GROUP",'x','top',0.5),
              
          };
      });
  }
    // ✅ **Function to populate the chart data**
    // taskingSponsoringDirectorate() {
    //     const directorates = [
    //         'WESEE', 'WDB', 'PMG CMS', 'NHO', 'DWE', 'DSR', 'DSP', 'DMAQ',
    //         'DNS', 'DNSO/DNS', 'DNSO', 'DNSM', 'DNI', 'DNCO', 'DNOM',
    //         'DIT', 'DEE/WDB', 'DEE/DNS', 'DEE/DNAS', 'DEE (SM)', 'DEE',
    //         'DGP (DGS-V)', 'DGAQA', 'DGAFMS', 'DGMS(N)', 'DGME', 
    //         'CNS Directorate', 'ATVP', '14th DITCC Meeting Directive'
    //     ];

    //     const taskCounts = {
    //         CMS: [5, 2, 3, 1, 8, 15, 12, 3, 4, 1, 5, 2, 3, 4, 2, 5, 6, 3, 2, 10, 8],
    //         CSC: [2, 1, 2, 0, 5, 8, 6, 1, 2, 0, 3, 1, 1, 2, 1, 3, 2, 1, 1, 4, 3],
    //         CSI: [3, 1, 2, 1, 7, 12, 10, 2, 3, 1, 4, 2, 2, 3, 2, 4, 5, 2, 1, 9, 7],
    //         ETG: [1, 0, 1, 0, 3, 5, 4, 1, 1, 0, 2, 1, 0, 1, 0, 2, 2, 1, 0, 3, 2],
    //         SCS: [4, 2, 3, 1, 9, 14, 11, 3, 4, 1, 5, 3, 3, 4, 2, 5, 6, 3, 2, 11, 9],
    //         TaNCS: [6, 3, 4, 2, 10, 18, 14, 4, 5, 2, 6, 3, 4, 5, 3, 6, 7, 4, 3, 12, 10]
    //     };

    //     this.directorateChartData = {
    //         labels: directorates,
    //         datasets: [
    //             { label: 'CMS', backgroundColor: this.standardColors.completed, data: taskCounts.CMS },
    //             { label: 'CSC', backgroundColor: this.standardColors.closed, data: taskCounts.CSC },
    //             { label: 'CSI', backgroundColor: this.standardColors.inProgress, data: taskCounts.CSI },
    //             { label: 'ETG', backgroundColor: this.standardColors.closed, data: taskCounts.ETG },
    //             { label: 'SCS', backgroundColor: this.standardColors.closed, data: taskCounts.SCS },
    //             { label: 'TaNCS', backgroundColor: this.standardColors.closed, data: taskCounts.TaNCS }
    //         ]
    //     };

    //     // ✅ **Using helper function to generate chart options**
    //     this.directorateChartOptions = this.getChartOptionsStackBar("Sponsor Directorate", "Tasks",'y','top',0.2);
    // }
    
    
 


    initPieCharts() {
      // First pie chart - Task Status Distribution
      this.api.getAPI(environment.API_URL + 'transaction/taskcount-statuswise/')
      .subscribe((response: any) => {
       
        const labels = ['Completed', "Work In Progress", "Task Closed"];
        const data = [response.Completed, response['Work In Progress'], response['Task Closed']];
        const backgroundColor = [this.standardColors.completed, this.standardColors.inProgress, this.standardColors.closed];

   
        this.pieChartData2 = {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColor,
            datalabels: {
              color: '#FFFFFF',
              font: {
                weight: 'bold'
              }
            }
          }]
        };
      });
      // Second pie chart - Group-wise Task Distribution
      this.api.getAPI(environment.API_URL + 'transaction/groupwise-task-count/').subscribe((response: any) => {
        const groupData = response
        const labels = groupData.map((item: any) => item.group_code);
        const data = groupData.map((item: any) => item.task_count);
        const backgroundColor = groupData.map((item: any) => this.getGroupColor(item.group_code));

      

        this.pieChartData1 = {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColor,
            datalabels: {
              color: '#FFFFFF',
              font: {
                weight: 'bold'
              }
            }
          }]
        };
      });
    }

    // Helper method to get color based on status
    private getStatusColor(status: string): string {
      const statusColors = {
        'Completed': this.standardColors.completed,
        'In Progress': this.standardColors.inProgress,
        'Closed': this.standardColors.closed,
        'Overdue': this.standardColors.overdue,
        'Approval In Progress': this.standardColors.approvalInProgress,
        'Closure In Progress': this.standardColors.closureInProgress,
        'Extension In Progress': this.standardColors.extensionInProgress,
        'Time Independent': this.standardColors.timeIndependent
      };
      return statusColors[status] || this.standardColors.default;
    }

   
    
    taskIssuedData: any;
    taskIssuedOptions: any;

    // loadTaskIssuedChart() {
    //     this.taskIssuedData = {
    //         labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    //         datasets: [
    //             {
    //                 label: 'Completed',
    //                 backgroundColor: this.standardColors.completed,
    //                 data: [2, 4, 3, 3, 2, 5, 8, 10, 12, 3]
    //             },
    //             {
    //                 label: 'Task Closed',
    //                 backgroundColor: this.standardColors.closed,
    //                 data: [3, 5, 4, 4, 3, 10, 6, 12, 8, 2]
    //             },
    //             {
    //                 label: 'Work In Progress',
    //                 backgroundColor: this.standardColors.inProgress,
    //                 data: [1, 2, 1, 1, 0, 20, 12, 15, 10, 1]
    //             }
    //         ]
    //     };
    //     this.taskIssuedOptions = this.getChartOptionsStackBar('Year','Tasks',"x",'top') 
    // }



  


    
    initGroupwiseChart() {
      this.groupwiseChartData = {
        labels: ['CMS', 'CSC', 'CSI', 'ETG', 'SCS', 'TaNCS'],
        datasets: [
          { label: 'Completed', backgroundColor: this.standardColors.completed, data: [5, 4, 6, 1, 3, 7] },
          { label: 'Task Closed', backgroundColor: this.standardColors.closed, data: [15, 12, 18, 3, 7, 14] },
          { label: 'Work In Progress', backgroundColor: this.standardColors.inProgress, data: [20, 10, 30, 2, 5, 30] }
        ]
      };
      this.groupwiseChartOptions = this.getChartOptionsStackBar('Tasks', 'Group','x','top');
    }
  

  
    initTaskStatusChart() {
      this.taskStatusChartData = {
        labels: ['Total', 'Work In Progress', 'Completed', 'Task Closed', 'Overdue'],
        datasets: [{
          label: 'Status',
          backgroundColor: [
              this.standardColors.total,                           // Light Grey for Total
              this.standardColors.inProgress,      // Orange for WIP
              this.standardColors.completed,       // Blue for Completed
              this.standardColors.closed,          // Green for Closed
              this.standardColors.overdue          // Red for Overdue
          ],
          data: [100, 70, 30, 10, 5]
        }]
      };
    }
  
    initStatusByGroupChart() {
      this.statusByGroupChartData = {
        labels: ['Work In Progress', 'Completed'],
        datasets: [
          { label: 'CMS', backgroundColor: this.getGroupColor('CMS'), data: [15, 5] },
          { label: 'CSC', backgroundColor: this.getGroupColor('CSC'), data: [12, 4] },
          { label: 'CSI', backgroundColor: this.getGroupColor('CSI'), data: [18, 6] },
          { label: 'ETG', backgroundColor: this.getGroupColor('ETG'), data: [3, 1] },
          { label: 'SCS', backgroundColor: this.getGroupColor('SCS'), data: [7, 3] },
          { label: 'TaNCS', backgroundColor: this.getGroupColor('TaNCS'), data: [14, 7] }
        ]
      };
      this.statusByGroupChartDataOption={
          ...this.getChartOptionsStackBar('','','x','top'),
        
        
    }
        
    }
  
    initCSIGroupChart() {
      this.statusCSIGroupChartData = {
        labels: ['Total', 'Work In Progress', 'Completed', 'Approval in Progress', 'Closure in Progress', 'Extension in Progress'],
        datasets: [{
            backgroundColor: [
                this.standardColors.total,               // Light Grey for Total
                this.standardColors.inProgress,           // Orange for WIP
                this.standardColors.completed,            // Blue for Completed
                this.standardColors.approvalInProgress,   // Pink for Approval in Progress
                this.standardColors.closureInProgress,    // Purple for Closure in Progress
                this.standardColors.extensionInProgress   // Red for Extension in Progress
            ],
            data: [35, 25, 10, 5, 3, 4]
        }]
      };
    }
  
    initCMSGroupChart() {
      this.statusCMSGroupChartData = {
        labels: ['Total', 'Work In Progress', 'Completed', 'Approval in Progress', 'Closure in Progress', 'Extension in Progress'],
        datasets: [{
            backgroundColor: [
                this.standardColors.total,               // Light Grey for Total
                this.standardColors.inProgress,           // Orange for WIP
                this.standardColors.completed,            // Blue for Completed
                this.standardColors.approvalInProgress,   // Pink for Approval in Progress
                this.standardColors.closureInProgress,    // Purple for Closure in Progress
                this.standardColors.extensionInProgress   // Red for Extension in Progress
            ],
            data: [25, 10, 6, 4, 0, 0]
        }]
      };
    }
  
    initSCSGroupChart() {
      this.statusSCSGroupChartData = {
        labels: ['Total', 'Work In Progress', 'Completed', 'Approval in Progress', 'Closure in Progress', 'Extension in Progress'],
        datasets: [{
            backgroundColor: [
                this.standardColors.total,               // Light Grey for Total
                this.standardColors.inProgress,           // Orange for WIP
                this.standardColors.completed,            // Blue for Completed
                this.standardColors.approvalInProgress,   // Pink for Approval in Progress
                this.standardColors.closureInProgress,    // Purple for Closure in Progress
                this.standardColors.extensionInProgress   // Red for Extension in Progress
            ],
            data: [20, 10, 6, 4, 2, 3]
        }]
   
      };
    }
  
    initTaNCSGroupChart() {
      this.statusTaNCSGroupChartData = {
        labels: ['Total', 'Work In Progress', 'Completed', 'Approval in Progress', 'Closure in Progress', 'Extension in Progress'],
        datasets: [{
            backgroundColor: [
                this.standardColors.total,               // Light Grey for Total
                this.standardColors.inProgress,           // Orange for WIP
                this.standardColors.completed,            // Blue for Completed
                this.standardColors.approvalInProgress,   // Pink for Approval in Progress
                this.standardColors.closureInProgress,    // Purple for Closure in Progress
                this.standardColors.extensionInProgress   // Red for Extension in Progress
            ],
            data: [25, 8, 3, 8, 0, 3]
        }]
   
      };
    }
  
    initCSCGroupChart() {
      this.statusCSCGroupChartData = {
        labels: ['Total', 'Work In Progress', 'Completed', 'Approval in Progress', 'Closure in Progress', 'Extension in Progress'],
        datasets: [{
            backgroundColor: [
                this.standardColors.total,               // Light Grey for Total
                this.standardColors.inProgress,           // Orange for WIP
                this.standardColors.completed,            // Blue for Completed
                this.standardColors.approvalInProgress,   // Pink for Approval in Progress
                this.standardColors.closureInProgress,    // Purple for Closure in Progress
                this.standardColors.extensionInProgress   // Red for Extension in Progress
            ],
            data: [19, 11, 4, 1, 2, 0]
        }]
   
      };
    }

    initETGGroupChart() {
        this.statusETGGroupChartData = {
            labels: ['Total', 'Work In Progress', 'Completed', 'Approval in Progress', 'Closure in Progress', 'Extension in Progress'],
            datasets: [{
                backgroundColor: [
                    this.standardColors.total,               // Light Grey for Total
                    this.standardColors.inProgress,           // Orange for WIP
                    this.standardColors.completed,            // Blue for Completed
                    this.standardColors.approvalInProgress,   // Pink for Approval in Progress
                    this.standardColors.closureInProgress,    // Purple for Closure in Progress
                    this.standardColors.extensionInProgress   // Red for Extension in Progress
                ],
                data: [16, 8, 6, 1, 2, 3]
            }]
        };
    }






   

    // Helper function to update individual group status charts
    updateGroupStatusCharts(statusData: any[]) {
        const groups = ['CSI', 'CMS', 'SCS', 'TaNCS', 'CSC', 'ETG'];
        
        groups.forEach(group => {
            const groupData = {
                labels: statusData.map(item => item.status),
                datasets: [{
                    backgroundColor: statusData.map(item => {
                        const statusColors = {
                            'Total': this.standardColors.total,                     // Light Grey
                            'Work In Progress': this.standardColors.inProgress,
                            'Completed': this.standardColors.completed,
                            'Task Closed': this.standardColors.closed,
                            'Overdue': this.standardColors.overdue
                        };
                        return statusColors[item.status] || '#D9D9D9';
                    }),
                    data: statusData.map(item => {
                        return Math.round(item.count * (Math.random() * 0.3 + 0.1));
                    })
                }]
            };

            // Update the appropriate group chart data
            switch(group) {
                case 'CSI': this.statusCSIGroupChartData = groupData; break;
                case 'CMS': this.statusCMSGroupChartData = groupData; break;
                case 'SCS': this.statusSCSGroupChartData = groupData; break;
                case 'TaNCS': this.statusTaNCSGroupChartData = groupData; break;
                case 'CSC': this.statusCSCGroupChartData = groupData; break;
                case 'ETG': this.statusETGGroupChartData = groupData; break;
            }
        });
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

  getChartOptionsStackBar(yLabel: string, xLabel: string,indexAxis='y',pos='right',asp:number=0.7) {
    return {
        indexAxis: indexAxis,
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: asp,
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



  
  





}
