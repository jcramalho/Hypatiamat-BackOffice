
<script>
import { Line } from "vue-chartjs";
export default {
  extends: Line,
  data() {
    return {
      gradient: null
    };
  },
  /*
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: null
    }
  },*/
  mounted() {
      /*
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
    this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");*/
    this.renderChart({
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      datasets: [
        {
          label: 'Período 1',
          backgroundColor: 'red',
          pointRadius: 4,
          data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
          showLine: false 
        },
        {
          label: 'Período 2',
          backgroundColor: 'blue',
          pointRadius: 4,
          data: [100, 40, 30, 22, 21, 49, 69, 40, 20, 30, 32, 31],
          showLine: false 
        },
        {
          label: 'Período 3',
          backgroundColor: 'green',
          pointRadius: 4,
          
          data: [80, 100, 102, 49, 30, 52, 49, 30, 19, 29, 22, 21],
          showLine: false 
        },
        {
            label: "My second dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            //highlightFill: "rgba(220,220,220,0.75)",
            //highlightStroke: "rgba(220,220,220,1)",
            showTooltip: true, //TO USE JUST ADD THIS NEW OPTION ONLY REALLY NEEDS TO PRESENT IF SETTING TO FALSE
            data: [null, 100, null]
            
        }

      ]
    },
    { 
        animation: {
            /*
            onComplete: e => {
                var ctx = chart.chart.ctx;
                var data =  chart.config.data.datasets[0].data;
                if (data[0] == null) {
                var xAxis = chart.scales['x-axis-0'];
                var yAxis = chart.scales['y-axis-0']; 
                var y = yAxis.getPixelForValue(data[1]);         
                ctx.save();           
                ctx.globalCompositeOperation='destination-over';
                ctx.strokeStyle = 'blue'          
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(xAxis.left, y);             
                ctx.lineTo(xAxis.right, y);
                ctx.stroke();
                ctx.restore();       
                }    
            }*/
        }
    }
    )
  }
};
</script>