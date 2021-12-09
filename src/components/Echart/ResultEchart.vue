<template>
  <div>
    <div id="main" style="width: 1200px;height:680px;color: dark;"></div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        
      };
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

          label: {
            show: true,
            position:'top'
          },
          legend:{
            data:['留存数','取消安装数']
          },
          xAxis: {
            type: 'category',
            data: ['6月', '7月', '8月', '9月', '10月', '11月']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '留存数',
              data: [164, 193, 229, 259, 287, 301],
              type: 'line'
            },
            {
              name:'取消安装数',
              data: [68, 55, 42, 39, 30,19],
              type: 'line'
            },
          ]
        };
        option && myChart.setOption(option);
      }
    },
  };
  //data: [164, 193, 229, 259, 287, 301]
  //              data: [68, 55, 42, 39, 30,19]


</script>
