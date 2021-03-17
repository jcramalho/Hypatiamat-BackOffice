<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
        <v-container>
            <v-card class="pa-5">
                <v-container >
                    <v-card-title primary-title class="justify-center green--text">
                        Desempenho nos Jogos
                    </v-card-title>
                        <v-container :style="widthParams">
                            <v-combobox
                                id="jogos"
                                v-model="jogo"
                                label="Jogo"
                                color="#009263"
                                item-text="jogo"
                                :items="jogosInfo"
                                @change="onJogoChange"
                            ></v-combobox>
                            <v-combobox
                                id="tiposCalcRapid"
                                chips
                                v-if="jogo && jogo.jogo=='Calcrapid'"
                                v-model="tiposCalc"
                                label="Tipo de Operação"
                                color="green"
                                :multiple="true"
                                :items="jogo.tipos"
                                @change="onTipoCalcChange"
                            ></v-combobox>
                            <v-combobox
                                id="niveisCalculus"
                                chips
                                v-if="jogo && jogo.jogo=='Calculus'"
                                v-model="niveisSel"
                                label="Nível"
                                color="green"
                                :multiple="true"
                                :items="jogo.niveis"
                                @change="onNivelChange"
                            ></v-combobox>
                            <v-combobox
                                id="tiposCalculus"
                                chips
                                v-if="jogo && jogo.jogo=='Calculus'"
                                v-model="tiposCalculusSel"
                                label="Tipo de Operações"
                                color="green"
                                :multiple="true"
                                :items="jogo.tipos"
                                @change="onTipoCalculusChange"
                            ></v-combobox>
                            <v-combobox
                                id="anos"
                                v-model="anoLetivo"
                                label="Ano Letivo"
                                color="#009263"
                                :items="anosLetivos"
                                @change="onAnoChange"
                            ></v-combobox>   
                            <v-row>
                                <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" >
                                <v-text-field @change="onDataInChange" color="#009263" v-model="dataInicio" label="Data Inicio" type="date" :format="format" required></v-text-field>
                                </v-col>
                                <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" >
                                    <v-text-field @change="onDataFimChange" color="#009263" v-model="dataFim" label="Data Fim" type="date" :format="format" required></v-text-field>
                                </v-col>
                            </v-row>
                            </v-container>
                            <v-card class="pa-4 elevation-5">
                                <v-container v-if="resultadosGlobais == undefined">
                                    <center><v-icon large color="#009263"> mdi-home-analytics </v-icon></center>
                                    <br>
                                <center> Ainda não preencheu os campos necessários para ver resultados ou nunca jogou este jogo. </center>
                                </v-container>
                                <v-container v-else-if="this.jogo.jogo=='Calcrapid'">
                                    <CalcRapidAluno v-if="resultadosGlobais != undefined || resultadosGlobais.idaluno == undefined" 
                                                :resultados="resultadosGlobais" :dataInicio="dataInicio" :dataFim="dataFim" :jogo="jogo"/>
                                </v-container>
                                <v-container v-else-if="this.jogo.jogo=='Calculus'">
                                    <CalculusAluno v-if="resultadosGlobais != undefined || resultadosGlobais.idaluno == undefined" 
                                                :resultados="resultadosGlobais" :dataInicio="dataInicio" :dataFim="dataFim" :jogo="jogo"/>
                                </v-container>
                                <v-container v-else>
                                    <JogoGeralAluno v-if="resultadosGlobais != undefined || resultadosGlobais.idaluno == undefined" 
                                                :resultados="resultadosGlobais" :dataInicio="dataInicio" :dataFim="dataFim" :jogo="jogo"/>                                 
                                </v-container>
                            </v-card>
                </v-container>
            </v-card>
        </v-container>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI
const hostJogos = require("@/config/hosts").hostJogos
const anosletivos2 = require("@/config/confs").anosletivos2
const anoletivoAtual = require("@/config/confs").anoletivo2
import JogoGeralAluno from "@/components/JogoGeralAluno.vue"
import CalcRapidAluno from "@/components/CalcRapidAluno.vue"
import CalculusAluno from "@/components/CalculusAluno.vue"

  export default {
    components:{
        JogoGeralAluno, CalcRapidAluno,
        CalculusAluno
    },
    data(){
      return {
        verTotal: false,
        token: "",
        turmas: [],
        jogo:"",
        dataInicio: "2019-09-01",
        dataFim: "2020-09-01",
        turmaSel: "",
        utilizador : {},
        alunos:[],
         header_resultados: [
            {text: "Pontuação Obtida", value: 'pontuacao', class: 'subtitle-1'},
            {text: "Data", value: 'data', class: 'subtitle-1'},
            {text: "Horário", value: 'horario', class: 'subtitle-1'},
            ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        anosLetivos: anosletivos2,
        anoLetivo: anoletivoAtual,
        jogos:[],
        jogosInfo:[], 
        resultadosGlobais:undefined,
        resultadosTotal:[],
        tiposCalc: ["1 - Adição", "2 - Subtração", "3 - Multiplicação", "4 - Divisão"],
        niveisSel:["1","2","3","4","5"],
        tiposCalculusSel:["0 - Todas as combinações"],
        tiposCalculusSelAnterior:["0 - Todas as combinações"],
        styleP: 'font-size:20px',
        styleF: 'font-size:15px',
        widthParams: 'width:70%'
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        
        this.onAnoChange()
        this.resize()
    },
    mounted: function(){
        window.onresize = () => {
            this.resize()
        }
    },
    computed:{
        size(){
            if (this.$vuetify.breakpoint.xs) return 'x-small'
            else if(this.$vuetify.breakpoint.sm) return 'small'
            
            return 'medium'
        },
        xs(){
            if (this.$vuetify.breakpoint.xs) return true
            return false
        }
    },
    methods: {
      atualizaJogos: async function(){
        var response2 = await axios.get(hostJogos + "alunos/"+ this.utilizador.user + "/jogou?dataInicio=" 
                                        + this.dataInicio + "&dataFim=" + this.dataFim + "&token=" + this.token)
        this.jogosInfo = response2.data
      },
      resize(){
          if (this.$vuetify.breakpoint.xs) {this.styleP='font-size:15px'; this.widthParams = 'width:100%';}
          else if(this.$vuetify.breakpoint.sm) this.styleP= 'font-size:17px'
          else this.styleP ='font-size:20px'
      },
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      onAnoChange: async function(item){
          if(this.anoLetivo != ""){
             var aux = this.anoLetivo.split("/")
             this.dataInicio = aux[0] + "-09-01"
             this.dataFim = aux[1] + "-09-01"
             this.atualizaJogos()
             this.atualizaConteudo()
          }
      },
      onJogoChange: async function(item){
          if(this.jogo != "" && this.jogo){
              this.atualizaConteudo()
          }
      },
      onDataInChange: async function(item){
          if(this.dataInicio){
              this.atualizaJogos()
              this.atualizaConteudo()
          }
      },
      onDataFimChange: async function(item){
          if(this.dataFim){
              this.atualizaJogos()
              this.atualizaConteudo()
          }
      },
      onTipoCalcChange: async function(item){
          if(this.jogo && this.jogo != "" && this.dataFim != "" && this.dataInicio != "" && this.tiposCalc.length > 0){
              this.atualizaCalcRapid()
          }
      },
      onNivelChange: async function(item){
          if(this.tiposCalculusSel.find(e => e == "0 - Todas as combinações")){
              if(this.niveisSel.length < this.jogo.niveis.length){
                  if(this.niveisSel.length > 0){
                     this.atualizaMinuteNewNiveis()
                  }
              }
              else{
                  this.atualizaMinuteNew()
              }
          }
          else{
              if(this.niveisSel.length < this.jogo.niveis.length){
                  if(this.niveisSel.length > 0){
                      this.atualizaMinuteNewTiposNiveis()
                  }
              }
              else{
                  this.atualizaMinuteNewTipos()
              }
          }
      },
      onTipoCalculusChange: async function(item){
          var todos = this.tiposCalculusSel.find(e => e == "0 - Todas as combinações")
          if(todos && !this.tiposCalculusSelAnterior.find(e => e == "0 - Todas as combinações")){
                this.tiposCalculusSel = ["0 - Todas as combinações"]
                    if(this.niveisSel.length < this.jogo.niveis.length){
                        this.atualizaMinuteNewNiveis()
                    }
                    else{
                        this.atualizaMinuteNew()
                    }       
        }
        else{
            if(todos){
                var index = this.tiposCalculusSel.indexOf(todos)
                this.tiposCalculusSel.splice(index, index+1)
            }
            if(this.niveisSel.length < this.jogo.niveis.length){
                this.atualizaMinuteNewTiposNiveis()
            }
            else{
                this.atualizaMinuteNewTipos()
            }
        }
          this.tiposCalculusSelAnterior = this.tiposCalculusSel
      },
      parseTiposCalcRapid: async function(){
          var res = []
          for(var i = 0; i < this.tiposCalc.length; i++){
              var aux = this.tiposCalc[i].split(" - ")
              res.push(aux[0])
          }
          return res
      },
      parseTiposCalculus: async function(){
          var res = ""
          this.tiposCalculusSel.sort()
          for(var i = 0; i < this.tiposCalculusSel.length; i++){
              var aux = this.tiposCalculusSel[i].split(" - ")
              res += aux[0]
          }
          return res
      },
      atualizaCalcRapid: async function(){
          this.headers = this.headers_calcrapid
          this.resultadosGlobais = undefined
          if(this.tiposCalc.length < this.jogo.tipos.length){
            var tipos = await this.parseTiposCalcRapid()
            var response = await axios.get(hostJogos + "calcrapid/alunos/" + this.utilizador.user
                                                + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                + "&tipos="+ tipos + "&token=" + this.token)
          }
          else{
            var response = await axios.get(hostJogos + "calcrapid/alunos/" + this.utilizador.user
                                                + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                + "&token=" + this.token)
          }
          this.resultadosGlobais = response.data
          return true
      },
      atualizaConteudo: async function(){
          if(this.jogo && this.jogo.jogo != "" && this.dataFim != "" && this.dataInicio != "" ){
              if(this.jogo.jogo == "Calcrapid") this.atualizaCalcRapid()
              else if(this.jogo.jogo == "Calculus") this.onNivelChange()
              else{
                this.resultadosGlobais = undefined
                var response = await axios.get(h + "alunos/" + this.utilizador.user + "/jogosGlobal/" + this.jogo.jogotable 
                                                + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                + "&jogoTipo=" + this.jogo.tipo
                                                + "&token=" + this.token)
                this.resultadosGlobais = response.data
              }
          } 
      },
      atualizaMinuteNew: async function(){
          this.resultadosGlobais = undefined
          var response = await axios.get(hostJogos + "minutenew/alunos/" + this.utilizador.user
                                            + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                            +  "&token=" + this.token)
          this.resultadosGlobais = response.data
          return true
      },
      atualizaMinuteNewTipos: async function(){
          var tipos = await this.parseTiposCalculus()
          this.resultadosGlobais = undefined
          var response = await axios.get(hostJogos + "minutenew/alunos/" + this.utilizador.user
                                                + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                + "&tipos=" + tipos +"&token=" + this.token)
        
          this.resultadosGlobais = response.data
          return true
      },
      atualizaMinuteNewNiveis: async function(){
          this.resultadosGlobais = undefined
          var response = await axios.get(hostJogos + "minutenew/alunos/" + this.utilizador.user
                                                + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                + "&niveis=" + this.niveisSel +"&token=" + this.token)
          
          this.resultadosGlobais = response.data
          return true
      },
      atualizaMinuteNewTiposNiveis: async function(){
          var tipos = await this.parseTiposCalculus()
          this.resultadosGlobais = undefined
          var response = await axios.get(hostJogos + "minutenew/alunos/" + this.utilizador.user
                                            + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                            +  "&niveis=" + this.niveisSel + "&tipos=" + tipos + "&token=" + this.token)
          
          this.resultadosGlobais = response.data
          return true
      },
    }
  }
</script>