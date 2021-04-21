<script>
import { Line } from 'vue-chartjs'
 
export default {
  extends: Line,
  props: ['data', 'options'],
  mounted () {
    var data = {
        labels: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
        datasets: [{
            data: [0.2, 0.1, 0.4, 0.1, 0.0, 0.5, 0.4],
            pointBackgroundColor: 'black',
            pointRadius: 5,
            fill: false,
            showLine: false 
        }, {
            data: [0.3, 0.2, 0.4, 0.4, 0.0, 0.7, 0.6]
            },
        {
            data: [0.4, 0.5, 0.5, 0.4, 0.0, 0.9, 0.7]
        },
        {
            data: [0.6, 0.7, 0.55, 0.6, 0.0, 0.9, 0.7]
        }]
    };

    this.renderChart(data, {
        maintainAspectRatio: false
      })
  }
}

</script>