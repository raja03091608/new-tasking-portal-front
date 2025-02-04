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

    @Input() showGroupWiseChart: boolean = true;
    @Input() showYearlyReport: boolean = true;
    @Input() showTaskDistribution: boolean = true;
    @Input() showExtendedDeadlines: boolean = true;
    @Input() showOverdueTasks: boolean = true;

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
}
