<template>
  <div>
    <div id="main" style="width: 1200px;height:680px;color: dark;"></div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {};
    },
    mounted() {
      this.myecharts()
    },
    methods: {
      myecharts() {
        var chartDom = document.getElementById('main');
        var myChart = this.$echarts.init(chartDom);
        var option;

        option = {
          title:{text:'2021年6月-2021年11月用户平均分统计图'},
          legend: {},
          tooltip: {},
          label: {
            show: true,
            position:'top'
          },
          dataset: {
            source: [
              ['product', '普通用户平均分', '推荐用户平均分', '安装用户平均分'],
              ['6月', 43.3, 70.8, 72.3],
              ['7月', 51.5, 74.4, 76.1],
              ['8月', 56.4, 77.5, 81.7],
              ['9月', 61.4, 81.9, 85.1],
              ['10月', 65.7, 84.5, 87.2],
              ['11月', 68.4, 86.1, 90.1],
            ]
          },
          color: ['darkgrey', 'lightgreen', 'red'],

          xAxis: {
            type: 'category',

          },
          yAxis: {},
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [{
            type: 'bar'
          }, {
            type: 'bar'
          }, {
            type: 'bar'
          }]
        };
        option && myChart.setOption(option);
      }
    },
  };
</script>
