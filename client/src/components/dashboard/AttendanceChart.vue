<template>
  <div class="attendance-chart">
    <apexchart
      type="line"
      height="300"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import moment from 'moment';

export default {
  name: 'AttendanceChart',
  
  components: {
    apexchart: VueApexCharts
  },

  props: {
    data: {
      type: Array,
      required: true
    }
  },

  computed: {
    series() {
      return [{
        name: 'Attendance Rate',
        data: this.data.map(item => ({
          x: moment(item._id).format('ddd'),
          y: Math.round((item.presentStudents / item.totalStudents) * 100)
        }))
      }];
    },

    chartOptions() {
      return {
        chart: {
          type: 'line',
          toolbar: {
            show: false
          }
        },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        colors: ['#1976D2'],
        xaxis: {
          type: 'category'
        },
        yaxis: {
          labels: {
            formatter: (value) => `${value}%`
          }
        },
        tooltip: {
          y: {
            formatter: (value) => `${value}%`
          }
        }
      };
    }
  }
};
</script>