
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
                      var acerto = "Acerto(%) : " + aux.y
                      var ncertas = "NTRC : " + aux.ncertas
                      var ntotal = "NTR: " + aux.ntotal
                      var frequencia = "Frequência: " + aux.frequencia
                      result = [nome, acerto, ncertas, ntotal, frequencia]
                    }

                    return result;
                  }
              }
          },
      }
    )
    
  },
  methods:{

  }
};
</script>