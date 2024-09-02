import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5radar from '@amcharts/amcharts5/radar';

@Component({
  selector: 'app-pending-task',
  templateUrl: './pending-task.component.html',
  styleUrls: ['./pending-task.component.scss']
})
export class PendingTaskComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId:any, private zone: NgZone) { }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {

      let root = am5.Root.new("chartdiv");


      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root)
      ]);
      
      
      // Create chart
      // https://www.amcharts.com/docs/v5/charts/xy-chart/
      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX:true
      }));
      
      //chart.get("colors").set("step", 3);
      
      
      // Add cursor
      // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
      cursor.lineY.set("visible", false);
      
      
      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.3,
        baseInterval: {
          timeUnit: "day",
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
      }));
      
      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(root, {})
      }));
      
      
      // Add series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      let series = chart.series.push(am5xy.LineSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value1",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueX}: {valueY}\n{previousDate}: {value2}"
        })
      }));
      
      series.strokes.template.setAll({
        strokeWidth: 2
      });
      
      //series.get("tooltip").get("background").set("fillOpacity", 0.5);
      
      let series2 = chart.series.push(am5xy.LineSeries.new(root, {
        name: "Series 2",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value2",
        valueXField: "date"
      }));
      series2.strokes.template.setAll({
        strokeDasharray: [2, 2],
        strokeWidth: 2
      });
      
      // Set date fields
      // https://www.amcharts.com/docs/v5/concepts/data/#Parsing_dates
      root.dateFormatter.setAll({
        dateFormat: "yyyy-MM-dd",
        dateFields: ["valueX"]
      });
      
      
      // Set data
      let data = [{
        date: new Date(2019, 5, 12).getTime(),
        value1: 50,
        value2: 48,
        previousDate: new Date(2019, 5, 5)
      }, {
        date: new Date(2019, 5, 13).getTime(),
        value1: 53,
        value2: 51,
        previousDate: "2019-05-06"
      }, {
        date: new Date(2019, 5, 14).getTime(),
        value1: 56,
        value2: 58,
        previousDate: "2019-05-07"
      }, {
        date: new Date(2019, 5, 15).getTime(),
        value1: 52,
        value2: 53,
        previousDate: "2019-05-08"
      }, {
        date: new Date(2019, 5, 16).getTime(),
        value1: 48,
        value2: 44,
        previousDate: "2019-05-09"
      }, {
        date: new Date(2019, 5, 17).getTime(),
        value1: 47,
        value2: 42,
        previousDate: "2019-05-10"
      }, {
        date: new Date(2019, 5, 18).getTime(),
        value1: 59,
        value2: 55,
        previousDate: "2019-05-11"
      }]
      
      series.data.setAll(data);
      series2.data.setAll(data);
      
      
      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear(1000);
      series2.appear(1000);
      chart.appear(1000, 100);
      
//chart2 

let root1 = am5.Root.new("chartdiv1");


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root1.setThemes([
  am5themes_Animated.new(root1)
]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart1 = root1.container.children.push(am5xy.XYChart.new(root1, {
  panX: false,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  layout: root1.verticalLayout
}));


// Data
let colors = chart.get("colors");

let data1 = [{
  country: "Feb",
  visits: 50,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/united-states.svg",
  //columnSettings: { fill: colors.next() }
}, {
  country: "Mar",
  visits: 70,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/united-kingdom.svg",
  //columnSettings: { fill: colors.next() }
}, {
  country: "Apr",
  visits: 20,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/china.svg",
 // columnSettings: { fill: colors.next() }
}, {
  country: "May",
  visits: 40,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/japan.svg",
 // columnSettings: { fill: colors.next() }
}, {
  country: "Jun",
  visits: 10,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/germany.svg",
  //columnSettings: { fill: colors.next() }
}, {
  country: "Jul",
  visits: 30,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/france.svg",
  //columnSettings: { fill: colors.next() }
}, {
  country: "Aug",
  visits: 60,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/india.svg",
  //columnSettings: { fill: colors.next() }
}, ];


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis1 = chart1.xAxes.push(am5xy.CategoryAxis.new(root1, {
  categoryField: "country",
  renderer: am5xy.AxisRendererX.new(root1, {
    minGridDistance: 30
  }),
  bullet: function (root1, axis, dataItem) {
    return am5xy.AxisBullet.new(root1, {
      location: 0.5,
      sprite: am5.Picture.new(root1, {
        width: 24,
        height: 24,
        centerY: am5.p50,
        centerX: am5.p50,
        // src: dataItem.dataContext.icon,
      })
    });
  }
}));

xAxis1.get("renderer").labels.template.setAll({
  paddingTop: 20
});

xAxis1.data.setAll(data1);

let yAxis1 = chart1.yAxes.push(am5xy.ValueAxis.new(root1, {
  renderer: am5xy.AxisRendererY.new(root1, {})
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series3 = chart1.series.push(am5xy.ColumnSeries.new(root1, {
  xAxis: xAxis1,
  yAxis: yAxis1,
  valueYField: "visits",
  categoryXField: "country"
}));

series3.columns.template.setAll({
  tooltipText: "{categoryX}: {valueY}",
  tooltipY: 0,
  strokeOpacity: 0,
  templateField: "columnSettings"
});

series3.data.setAll(data1);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series3.appear();
chart1.appear(1000, 100);
     
    });

  }

  ngOnInit(): void {
    let root = am5.Root.new("chartdiv3");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/radar-chart/
    let chart = root.container.children.push(am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      innerRadius: am5.percent(20),
      startAngle: -90,
      endAngle: 180
    }));
    
    
    // Data
    let data = [{
      category: "Research",
      value: 80,
      full: 100,
      columnSettings: {
        // fill: chart.get("colors").getIndex(0)
      }
    }, {
      category: "Marketing",
      value: 35,
      full: 100,
      columnSettings: {
        // fill: chart.get("colors").getIndex(1)
      }
    }, {
      category: "Distribution",
      value: 92,
      full: 100,
      columnSettings: {
        // fill: chart.get("colors").getIndex(2)
      }
    }, {
      category: "Human Resources",
      value: 68,
      full: 100,
      columnSettings: {
        // fill: chart.get("colors").getIndex(3)
      }
    }];
    
    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
    let cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
      behavior: "zoomX"
    }));
    
    cursor.lineY.set("visible", false);
    
    // Create axes and their renderers
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
    let xRenderer = am5radar.AxisRendererCircular.new(root, {
      //minGridDistance: 50
    });
    
    xRenderer.labels.template.setAll({
      radius: 10
    });
    
    xRenderer.grid.template.setAll({
      forceHidden: true
    });
    
    let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      renderer: xRenderer,
      min: 0,
      max: 100,
      strictMinMax: true,
      numberFormat: "#'%'",
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    
    let yRenderer = am5radar.AxisRendererRadial.new(root, {
      minGridDistance: 20
    });
    
    yRenderer.labels.template.setAll({
      centerX: am5.p100,
      fontWeight: "500",
      fontSize: 18,
      templateField: "columnSettings"
    });
    
    yRenderer.grid.template.setAll({
      forceHidden: true
    });
    
    let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: yRenderer
    }));
    
    yAxis.data.setAll(data);
    
    
    // Create series
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
    let series1 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      clustered: false,
      valueXField: "full",
      categoryYField: "category",
      fill: root.interfaceColors.get("alternativeBackground")
    }));
    
    series1.columns.template.setAll({
      width: am5.p100,
      fillOpacity: 0.08,
      strokeOpacity: 0,
      cornerRadius: 20
    });
    
    series1.data.setAll(data);
    
    
    let series2 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      clustered: false,
      valueXField: "value",
      categoryYField: "category"
    }));
    
    series2.columns.template.setAll({
      width: am5.p100,
      strokeOpacity: 0,
      tooltipText: "{category}: {valueX}%",
      cornerRadius: 20,
      templateField: "columnSettings"
    });
    
    series2.data.setAll(data);
    
    // Animate chart and series in
    // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
    series1.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);
    
  }

}
