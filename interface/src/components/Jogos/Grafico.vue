
<script>
import { Line, mixins } from "vue-chartjs";

export default {
  extends: Line,
  data() {
    return {
      gradient: null
    };
  },
  mixins: [mixins.reactiveProp],
  props:["labels", "datasets"],
  watch:{
    datasets : function(newVal, oldVal) { // watch it
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      this._chart.destroy();
    }
  },
  mounted() {
    this.renderChart(
        this.chartData
      ,
      {
          tooltips: {
              callbacks: {
                  label(tooltipItem, data) {
                    var result = []
                    var aux = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
                    if(aux.nome){
                      var nome = "Nome: " + aux.nome 
                      var media = "Média: " + aux.y
                      var max = "Máximo: " + aux.maximo
                      var min = "Mínimo: " + aux.minimo
                      var freq = "Frequência: " + aux.count
                      result = [nome, media, max, min, freq]
                    }
                    

                    return result;
                  }
              }
          },
      }
    )
    
  },
  methods:{
    makeChart(){
      var datasets = []
      var colors = ['#009263', 'purple', 'red']
      for(var i = 0; i < this.datasets.length && i < 3; i++){
        if(this.datasets[i].data.length > 0){
          datasets.push({
            label: 'Período ' + (i+1),
            backgroundColor: colors[i],
            pointRadius: 5,
            data: this.datasets[i].data,
            showLine: false
          })
        }
      }

      this.renderChart({
        labels: this.labels,
        datasets: datasets
      },
      { responsive: true, maintainAspectRatio: false,
          tooltips: {
              callbacks: {
                  label(tooltipItem, data) {
                    //tooltipItem.label = data.datasets[tooltipItem.index].data[tooltipItem.index].nome
                    var aux = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
                    var nome = "Nome: " + aux.nome 
                    var media = "Média: " + aux.y
                    var max = "Máximo: " + aux.maximo
                    var min = "Mínimo: " + aux.minimo
                    var freq = "Frequência: " + aux.count

                    return [nome, media, max, min, freq];
                  }
              }
          },
      }
    )
    }
  }
};
</script>