import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import ApexCharts from 'apexcharts';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'test';
  @ViewChild('chart') chart!: ElementRef;
  @ViewChild('donut') donut!: ElementRef;
  @ViewChild('lineCharts') lineCharts!: ElementRef;
  private chartInstance!: ApexCharts;
  private donutInstance!: ApexCharts;
  private linechartInstance!: ApexCharts;
  private updateSubscription!: Subscription;

  private dataPoints: number[] = [];
  private timePoints: string[] = [];

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    // Initialization logic can go here
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    if (this.donutInstance) {
      this.donutInstance.destroy();
    }
  }

  ngAfterViewInit() {
    this.renderChart();
    this.startUpdating(); //start updating after initial render
  }

  renderChart() {
    if (!this.chart || !this.chart.nativeElement) {
      console.error("Chart element not found!");
      return;
    }
    if (!this.donut || !this.donut.nativeElement) {
      console.error("Chart element not found!");
      return;
    }
    if (!this.lineCharts || !this.lineCharts.nativeElement) {
      console.error("Chart element not found!");
      return;
    }

    this.pieChart();
    this.donutChart();
    this.lineChart();

  }

  pieChart() {

    const options = {
      series: this.generateRandomData(),
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    this.chartInstance = new ApexCharts(this.chart.nativeElement, options);
    this.chartInstance.render();
  }

  donutChart() {

    const donut = {
      series: this.generateRandomData(),
      chart: {
        width: 380,
        type: 'donut',
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    this.donutInstance = new ApexCharts(this.donut.nativeElement, donut);
    this.donutInstance.render();
  }

  lineChart() {
    const options = {
      series: [{
        name: "Data",
        data: this.dataPoints
      }],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        categories: this.timePoints,
      },
      yaxis: {
        title: {
          text: 'Values'
        }
      }
    };

    this.linechartInstance = new ApexCharts(this.lineCharts.nativeElement, options);
    this.linechartInstance.render();
  }

  startUpdating() {
    this.updateSubscription = interval(2000).subscribe(() => {
      this.ngZone.run(() => {
        this.updateChart();
        this.updateLineChart();
        // console.log('ok');
      });
    });
  }

  updateChart() {
    if (this.chartInstance) {
      const newData = this.generateRandomData();
      // console.log("New Data:", newData);
      // console.log("Chart Instance:", this.chartInstance);
      this.chartInstance.updateSeries(newData);
      //this.chartInstance.render(); // force re-render. only needed if updateSeries does not refresh
    } else {
      // console.error("Chart instance not available.");
    }
    if (this.donutInstance) {
      const newData = this.generateRandomData();
      // console.log("New Data:", newData);
      // console.log("Chart Instance:", this.chartInstance);
      this.donutInstance.updateSeries(newData);
      //this.chartInstance.render(); // force re-render. only needed if updateSeries does not refresh
    } else {
      // console.error("Chart instance not available.");
    }
  }

  updateLineChart() {
    if (this.linechartInstance) {
      const newData = Math.floor(Math.random() * 100);
      const newTime = new Date().toLocaleTimeString();

      this.dataPoints.push(newData);
      this.timePoints.push(newTime);
      if (this.dataPoints.length > 20) {
        this.dataPoints.shift();
        this.timePoints.shift();
      }

      this.linechartInstance.updateSeries([{
        data: this.dataPoints
      }]);
      this.linechartInstance.updateOptions({
        xaxis: {
          categories: this.timePoints
        }
      });
    } else {
      console.error("Chart instance not available.");
    }
  }

  generateRandomData(): number[] {
    return [
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100)
    ];
  }
}
