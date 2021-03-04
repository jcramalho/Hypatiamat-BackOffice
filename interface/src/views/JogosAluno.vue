<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
        <v-container>
            <v-card class="pa-5">
                <v-container style="width:70%">
                    <v-card-title primary-title class="justify-center green--text">
                        Desempenho nos Jogos
                    </v-card-title>
                        <v-container style="width:70%">
                            <v-combobox
                                id="jogos"
                                v-model="jogo"
                                label="Jogo"
                                color="#009263"
                                :items="jogos"
                                @change="onJogoChange"
                            ></v-combobox>
                            <v-combobox
                                id="anos"
                                v-model="anoLetivo"
                                label="Ano Letivo"
                                color="#009263"
                                :items="anosLetivos"
                                @change="onAnoChange"
                            ></v-combobox>
                        
                            <v-layout row class="text-xs-center" justify-center align-center>
                                <v-flex xs6>
                                <v-text-field @change="onDataInChange" prepend-icon="mdi-calendar" color="#009263" v-model="dataInicio" label="Data Inicio" type="date" :format="format" required></v-text-field>
                                </v-flex>
                                <v-flex xs6>
                                    <v-text-field @change="onDataFimChange" prepend-icon="mdi-calendar" color="#009263" v-model="dataFim" label="Data Fim" type="date" :format="format" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            </v-container>
                            <v-card class="pa-4 elevation-5">
                                <v-container v-if="resultadosGlobais.idaluno == undefined">
                                    <center><v-icon large color="#009263"> mdi-home-analytics </v-icon></center>
                                    <br>
                                <center> Ainda não preencheu os campos necessários para ver resultados ou nunca jogou este jogo. </center>
                                </v-container>
                                <v-container v-else>
                                    <center><v-icon large color="#009263"> mdi-home-analytics </v-icon></center>
                                    <br>
                                    <v-layout class="text-xs-center" row justify-center align-center>
                                        <v-flex xs3>
                                            <v-card  style="background-color:#DDAF94">
                                                <v-card-title  primary-title class="justify-center">
                                                    Média
                                                </v-card-title>
                                                <center>
                                                <v-card-text class="justify-center">
                                                    {{resultadosGlobais.media}}
                                                </v-card-text>
                                                </center>
                                            </v-card>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-card  style="background-color:#E8CEBF">
                                                <v-card-title  primary-title class="justify-center">
                                                    Mínimo
                                                </v-card-title>
                                                <center>
                                                <v-card-text class="justify-center">
                                                    {{resultadosGlobais.minimo}}
                                                </v-card-text>
                                                </center>
                                            </v-card>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-card  style="background-color:#DDAF94">
                                                <v-card-title  primary-title class="justify-center">
                                                    Máximo
                                                </v-card-title>
                                                <center>
                                                <v-card-text class="justify-center">
                                                    {{resultadosGlobais.maximo}}
                                                </v-card-text>
                                                </center>
                                            </v-card>
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-card  style="background-color:#E8CEBF">
                                                <v-card-title  primary-title class="justify-center">
                                                    Nº de vezes que jogou
                                                </v-card-title>
                                                <center>
                                                <v-card-text class="justify-center">
                                                    {{resultadosGlobais.count}}
                                                </v-card-text>
                                                </center>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                    <br>
                                    <center><v-btn class="white--text" color="#009263" @click="verTodos()"> Ver todos estes resultados </v-btn></center>
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
const hostJogos = require("@/config/hosts").hostJogos
const anosletivos2 = require("@/config/confs").anosletivos2
const anoletivoAtual = require("@/config/confs").anoletivo2

  export default {
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
        resultadosGlobais:{},
        resultadosTotal:[]
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        var response2 = await axios.get(hostJogos + "?token=" + this.token)
        var i
        this.jogosInfo = response2.data
        for(i = 0; i < this.jogosInfo.length; i++){
            this.jogos.push(this.jogosInfo[i].jogo)
        }
        this.onAnoChange()
    },
    methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      onAnoChange: async function(item){
          if(this.anoLetivo != ""){
             var aux = this.anoLetivo.split("/")
             this.dataInicio = aux[0] + "-09-01"
             this.dataFim = aux[1] + "-09-01"
             this.atualizaConteudo
          }
      },
      onJogoChange: async function(item){
          if(this.jogo != ""){
              this.atualizaConteudo()
          }
      },
      onDataInChange: async function(item){
          if(this.dataInicio){
              this.atualizaConteudo()
          }
      },
      onDataFimChange: async function(item){
          if(this.dataFim){
              this.atualizaConteudo()
          }
      },
      atualizaConteudo: async function(){
          if(this.jogo != "" && this.dataFim != "" && this.dataInicio != "" ){
              var aux = this.jogosInfo.find(element => element.jogo == this.jogo)
              var jogoTipo = aux.tipo
              var jogoTable = aux.jogotable

                var response = await axios.get(h + "alunos/" + this.utilizador.user + "/jogosGlobal/" + jogoTable 
                                                + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                + "&jogoTipo=" + jogoTipo
                                                + "&token=" + this.token)
              this.resultadosGlobais = response.data
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