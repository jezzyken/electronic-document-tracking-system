<template>
  <div class="class-distribution-chart">
    <apexchart
      type="pie"
      height="300"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'ClassDistributionChart',
  
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
      return this.data.map(item => item.count);
    },

    chartOptions() {
      return {
        labels: this.data.map(item => item._id),
        chart: {
          type: 'pie'
        },
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
        }],
        colors: [
          '#1976D2',
          '#4CAF50',
          '#FF9800',
          '#9C27B0',
          '#F44336'
        ]
      };
    }
  }
};
</script>