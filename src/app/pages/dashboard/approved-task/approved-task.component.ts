import { Component, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';

@Component({
  selector: 'app-approved-task',
  templateUrl: './approved-task.component.html',
  styleUrls: ['./approved-task.component.scss']
})
export class ApprovedTaskComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let root = am5.Root.new("chartdiv");

root.setThemes([
  am5themes_Animated.new(root)
]);

let chart = root.container.children.push(am5percent.PieChart.new(root, {
  startAngle: 180,
  endAngle: 360,
  layout: root.verticalLayout,
  innerRadius: am5.percent(50)
}));

let series = chart.series.push(am5percent.PieSeries.new(root, {
  startAngle: 180,
  endAngle: 360,
  valueField: "value",
  categoryField: "category",
  alignLabels: false
}));

series.states.create("hidden", {
  startAngle: 180,
  endAngle: 180
});

series.slices.template.setAll({
  cornerRadius: 5
});

series.ticks.template.setAll({
  forceHidden: true
});

series.data.setAll([
  { value: 10, category: "One" },
  { value: 9, category: "Two" },
  { value: 6, category: "Three" },
  { value: 5, category: "Four" },
  { value: 4, category: "Five" },
  { value: 3, category: "Six" },
  { value: 1, category: "Seven" }
]);

series.appear(1000, 100);

  }

  ngAfterViewInit(): void {

    let root = am5.Root.new("chartdiv1");


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

let colors = chart.get("colors");

let data = [{
  country: "One",
  visits: 725
}, {
  country: "Two",
  visits: 625
}, {
  country: "Three",
  visits: 602
}, {
  country: "Four",
  visits: 509
}, {
  country: "Five",
  visits: 322
}, {
  country: "Six",
  visits: 214
}, {
  country: "Seven",
  visits: 204
}, 
];

prepareParetoData();

function prepareParetoData() {
  let total = 0;

  for (var i = 0; i < data.length; i++) {
    let value = data[i].visits;
    total += value;
  }

  let sum = 0;
  for (var i = 0; i < data.length; i++) {
    let value = data[i].visits;
    sum += value;
  }
}



let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "country",
  renderer: am5xy.AxisRendererX.new(root, {
    minGridDistance: 30
  })
}));

xAxis.get("renderer").labels.template.setAll({
  paddingTop: 20
});

xAxis.data.setAll(data);

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {})
}));

let paretoAxisRenderer = am5xy.AxisRendererY.new(root, {opposite:true});
let paretoAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: paretoAxisRenderer,
  min:0,
  max:100,
  strictMinMax:true
}));

paretoAxisRenderer.grid.template.set("forceHidden", true);
paretoAxis.set("numberFormat", "#'%");


let series = chart.series.push(am5xy.ColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "visits",
  categoryXField: "country"
}));

series.columns.template.setAll({
  tooltipText: "{categoryX}: {valueY}",
  tooltipY: 0,
  strokeOpacity: 0,
  cornerRadiusTL: 6,
  cornerRadiusTR: 6
});

let paretoSeries = chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: xAxis,
  yAxis: paretoAxis,
  valueYField: "pareto",
  categoryXField: "country",
  stroke: root.interfaceColors.get("alternativeBackground"),
  maskBullets:false
}));

paretoSeries.bullets.push(function() {
  return am5.Bullet.new(root, {
    locationY: 1,
    sprite: am5.Circle.new(root, {
      radius: 5,
      fill: series.get("fill"),
      stroke:root.interfaceColors.get("alternativeBackground")
    })
  })
})

series.data.setAll(data);
paretoSeries.data.setAll(data);

series.appear();
chart.appear(1000, 100);

let root1 = am5.Root.new("chartdiv2");


root1.setThemes([
  am5themes_Animated.new(root1)
]);


let chart1 = root1.container.children.push(am5xy.XYChart.new(root1, {
  panX: false,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  layout: root1.verticalLayout,
}));



let data1 = [{
  country: "Feb",
  visits: 50,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/united-states.svg",
}, {
  country: "Mar",
  visits: 70,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/united-kingdom.svg",
}, {
  country: "Apr",
  visits: 20,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/china.svg",
}, {
  country: "May",
  visits: 40,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/japan.svg",
}, {
  country: "Jun",
  visits: 10,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/germany.svg",
}, {
  country: "Jul",
  visits: 30,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/france.svg",
}, {
  country: "Aug",
  visits: 60,
  icon: "https://www.amcharts.com/wp-content/uploads/flags/india.svg",
}, ];


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


series3.appear();
chart1.appear(1000, 100);
     
  


}


}
