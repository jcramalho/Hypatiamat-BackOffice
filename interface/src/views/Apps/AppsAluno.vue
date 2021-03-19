<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
        <v-container>
            <v-card class="pa-5">
                <v-container >
                    <center><v-icon large color="#009263">mdi-apps</v-icon></center>
                    <v-card-title primary-title class="justify-center green--text">
                        Desempenho nas Aplicações de Conteúdo
                    </v-card-title>
                        <v-container :style="widthParams">
                            <v-combobox
                                id="apps"
                                v-model="app"
                                label="Aplicação"
                                color="#009263"
                                :items="apps"
                                @change="onAppChange"
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
                            <br>
                            <v-card class="pa-4 elevation-5" style="border: 2px solid green !important;">
                                <v-container v-if="resultadosGlobais == undefined">
                                    <center><v-icon large color="#009263"> mdi-home-analytics </v-icon></center>
                                    <br>
                                <center> <span :style="styleP"> Ainda não preencheu os campos necessários para ver resultados ou nunca fez esta aplicação.</span> </center>
                                </v-container>
                                <v-container v-else>
                                    <center><v-icon large color="#009263"> mdi-home-analytics </v-icon></center>
                                    <v-card-title class="justify-center"><span :style="styleP"> {{this.app}} </span></v-card-title>
                                    <br>
                                    <v-row>
                                        <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
                                            <v-card  style="background-color:#DDAF94">
                                                <v-card-title class="justify-center">
                                                    <span :style="styleP"> NTRC </span>
                                                </v-card-title>
                                                <center>
                                                <v-card-text class="justify-center">
                                                    {{resultadosGlobais.ncertas}}
                                                </v-card-text>
                                                </center>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
                                            <v-card  style="background-color:#E8CEBF">
                                                <v-card-title  primary-title class="justify-center">
                                                    <span :style="styleP"> NTR </span>
                                                </v-card-title>
                                                <center>
                                                <v-card-text class="justify-center">
                                                    {{resultadosGlobais.ntotal}}
                                                </v-card-text>
                                                </center>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
                                            <v-card  style="background-color:#DDAF94">
                                                <v-card-title  primary-title class="justify-center">
                                                   <span :style="styleP"> Acerto </span>
                                                </v-card-title>
                                                <center>
                                                <v-card-text class="justify-center">
                                                    {{resultadosGlobais.acerto}}%
                                                </v-card-text>
                                                </center>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" xs="12" sm="6" md="12" lg="3" xl="3">
                                            <v-card  style="background-color:#E8CEBF">
                                                <v-card-title  primary-title class="justify-center">
                                                    <span :style="styleP">Frequência</span>
                                                </v-card-title>
                                                <center>
                                                <v-card-text class="justify-center">
                                                    {{resultadosGlobais.frequencia}}
                                                </v-card-text>
                                                </center>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12"  xs="12" sm="12" md="12" lg="12" xl="12">
                                            <center>
                                                <v-btn v-if="!xs" class="white--text" color="#009263" @click="verTodos()">Ver todos estes resultados</v-btn>
                                                <v-btn v-else class="white--text" color="#009263" @click="verTodos()">Ver todos</v-btn>
                                            </center>
                                        </v-col>
                                    </v-row>                                    
                                </v-container>
                            </v-card>
                            <v-dialog v-model="verTotal" width="60%">
                                <v-card class="pa-5" >
                                <v-data-table
                                class="elevation-4"
                                :headers="header_resultados"
                                :items="resultadosTotal"
                                :footer-props="footer_props"
                                >
                                </v-data-table>
                                </v-card>
                            </v-dialog>
                </v-container>
            </v-card>
        </v-container>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI
const hostApps = require("@/config/hosts").hostApps
const anosletivos2 = require("@/config/confs").anosletivos2
const anoletivoAtual = require("@/config/confs").anoletivo2

  export default {
    data(){
      return {
        verTotal: false,
        token: "",
        app:"",
        dataInicio: "2019-09-01",
        dataFim: "2020-09-01",
        utilizador : {},
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
        apps:[],
        appsInfo:[], 
        resultadosGlobais:undefined,
        resultadosTotal:[],
        styleP: 'font-size:20px',
        styleF: 'font-size:15px',
        widthParams: 'width:70%'
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        await this.onAnoChange()
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
      resize(){
          if (this.$vuetify.breakpoint.xs) {this.styleP='font-size:15px'; this.widthParams = 'width:100%';}
          else if(this.$vuetify.breakpoint.sm) {this.styleP= 'font-size:17px'; this.widthParams = 'width:85%'}
          else {this.styleP ='font-size:20px'; this.widthParams = 'width:70%';}
      },
      atualizaApps: async function(){
          if(this.dataInicio && this.dataFim){
            var response = await axios.get(hostApps + "alunos/"+ this.utilizador.user + "/jogou" +
                                            "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim + "&token=" + this.token)
            this.appsInfo = response.data
            await this.parseApps()
          }
      },
      parseApps: async function(){
          var aux = []
          for(var i = 0; i < this.appsInfo.length; i++){
              if(i == 0) aux.push(this.appsInfo[i])
              else if(this.appsInfo[i].codsubtema) aux.push(this.appsInfo[i].subtema)
              else aux.push(this.appsInfo[i].tema)
          }
          this.apps = aux
      },
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      onAnoChange: async function(item){
          if(this.anoLetivo != ""){
             var aux = this.anoLetivo.split("/")
             this.dataInicio = aux[0] + "-09-01"
             this.dataFim = aux[1] + "-09-01"
             this.atualizaApps()
          }
      },
      onAppChange: async function(item){
          if(this.app != "" && this.app){
              this.atualizaConteudo()
          }
      },
      onDataInChange: async function(item){
          if(this.dataInicio && this.dataInicio != ""){
              this.atualizaApps()
              this.atualizaConteudo()
          }
      },
      onDataFimChange: async function(item){
          if(this.dataFim && this.dataFim != ""){
              this.atualizaApps()
              this.atualizaConteudo()
          }
      },
      atualizaConteudoSubtema: async function(appInfo){
        this.resultadosGlobais = undefined
        var response = await axios.get(hostApps + "alunos/" + this.utilizador.user
                                        + "/?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim 
                                        +"&codtema=" + appInfo.codtema + "&codsubtema=" + appInfo.codsubtema + "&token=" + this.token)
                        
        this.resultadosGlobais = response.data
      },
      atualizaConteudoTema: async function(appInfo){
        this.resultadosGlobais = undefined
        var response = await axios.get(hostApps + "alunos/" + this.utilizador.user
                                            + "/?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim 
                                            +"&codtema=" + appInfo.codtema + "&token=" + this.token)
                        
        this.resultadosGlobais = response.data
      },
      atualizaConteudo: async function(){
          if(this.jogo != "" && this.dataFim != "" && this.dataInicio != "" ){
            if(this.app == "Todas"){
                    this.resultadosGlobais = undefined
                    var response = await axios.get(hostApps + "alunos/" + this.utilizador.user
                                            + "/?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                            + "&token=" + this.token)
            
                    this.resultadosGlobais = response.data
                }
                else{
                    var appInfo = this.appsInfo.find(element => element.tema == this.app)
                    // é um dos temas
                    if(appInfo) this.atualizaConteudoTema(appInfo)
                    else{
                        // é um subtema
                        appInfo = this.appsInfo.find(element => element.subtema == this.app)
                        if(appInfo) this.atualizaConteudoSubtema(appInfo)
                    }
                }
          } 
      },
      verTodos: async function(){
          if(this.jogo != "" && this.dataFim != "" && this.dataInicio != "" ){
              var aux = this.jogosInfo.find(element => element.jogo == this.jogo)
              var jogoTipo = aux.tipo
              var jogoTable = aux.jogotable

                var response = await axios.get(h + "alunos/" + this.utilizador.user + "/jogos/" + jogoTable 
                                                + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                + "&jogoTipo=" + jogoTipo
                                                + "&token=" + this.token)
              this.resultadosTotal = response.data
              this.verTotal = true
          } 

      }
    }
  }
</script>