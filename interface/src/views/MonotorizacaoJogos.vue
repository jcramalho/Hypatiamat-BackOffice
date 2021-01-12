<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Monotorização de Jogos por {{atual}}
            </v-card-title>
                <center>
                <v-card class="pa-5" width="60%">
                    <v-combobox
                        id="jogos"
                        v-model="jogo"
                        label="Jogo"
                        color="green"
                        :items="jogos"
                        @change="onJogoChange"
                    ></v-combobox>
                    <v-combobox
                        id="anos"
                        v-model="anoLetivo"
                        label="Ano Letivo"
                        color="green"
                        :items="anosLetivos"
                        @change="onAnoChange"
                    ></v-combobox>
                    <v-layout row class="text-xs-center" justify-center align-center>
                        <v-flex xs5>
                        <v-text-field @change="onDataInChange" prepend-icon="mdi-calendar" v-model="dataInicio" label="Data Inicio" type="date" :format="format" required></v-text-field>
                        </v-flex>
                        <v-flex xs5>
                            <v-text-field @change="onDataFimChange" prepend-icon="mdi-calendar" v-model="dataFim" label="Data Fim" type="date" :format="format" required></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-card>
                </center>
                <br v-if="state!=0">
                <center> <v-btn v-if="state!=0">Voltar a ver jogos por {{this.antiga}}</v-btn></center>
                <br>
        <v-text-field
            v-model="filtrar"
            label="Filtrar"
            prepend-icon="mdi-magnify"
            color="#009263"
            single-line
            ></v-text-field>
        <v-data-table
            class="elevation-4"
            :headers="headers"
            :items="items"
            :footer-props="footer_props"
            :search="filtrar"
            @click:row="changeState"
        >
            
        </v-data-table>
        </v-container>
    </v-card>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
import jsPDF from 'jspdf' 
import domtoimage from "dom-to-image";
import 'jspdf-autotable'
import html2canvas from "html2canvas";
const h = require("@/config/hosts").hostAPI
const hostJogos = require("@/config/hosts").hostJogos
const hypatiaImg = require("@/assets/hypatiamat.png")

  export default {
    data(){
      return {
        token: "",
        turmas: [],
        dialogEstatisticas: false,
        dialogGrafico: false,
        jogo:"",
        filtrar:"",
        dataInicio: "2019-09-01",
        dataFim: "2020-09-01",
        turmaSel: "",
        utilizador : {},
        alunos:[],
         header_alunos: [
            {text: "Nº", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Max", value: 'maximo', class: 'subtitle-1'},
            {text: "Min", value: 'minimo', class: 'subtitle-1'},
            {text: "Média", value: 'media', class: 'subtitle-1'},
            {text: "#", value: 'count', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        anosLetivos:["2013/2014", "2014/2015", "2015/2016", "2016/2017", "2017/2018", "2018/2019", "2019/2020", "2020/2021"],
        anoLetivo: "2019/2020",
        jogos:[],
        jogosInfo:[],
        headers:[
            {text: "Municipio", value: 'localidade', class: 'subtitle-1'},
            {text: "Max", value: 'max', class: 'subtitle-1'},
            {text: "Min", value: 'min', class: 'subtitle-1'},
            {text: "Média", value: 'media', class: 'subtitle-1'},
            {text: "#", value: 'number', class: 'subtitle-1'},
        ],
        headersMunicipios: [
            {text: "Municipio", value: 'localidade', class: 'subtitle-1'},
            {text: "Max", value: 'max', class: 'subtitle-1'},
            {text: "Min", value: 'min', class: 'subtitle-1'},
            {text: "Média", value: 'media', class: 'subtitle-1'},
            {text: "#", value: 'number', class: 'subtitle-1'},
        ],
        headersEscolas:[
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Max", value: 'max', class: 'subtitle-1'},
            {text: "Min", value: 'min', class: 'subtitle-1'},
            {text: "Média", value: 'media', class: 'subtitle-1'},
            {text: "#", value: 'number', class: 'subtitle-1'},
        ],
        items:[],
        state:0,
        atual: "Municipio",
        municipioAtual: "",
        escolaAtual: "",
        turmaAtual: "",
        antiga: ""
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        
        
        var response2 = await axios.get(hostJogos +"?token=" + this.token)
        this.jogosInfo = response2.data
        for(var i = 0; i < this.jogosInfo.length; i++){
            this.jogos.push(this.jogosInfo[i].jogo)
        }
        this.headers = this.headersMunicipios
        //var responseMun = await axios.get(h + "escolas/jogos/municipios")
        this.items = [{localidade:"Vila Verde", max:0, min:0, number:0, media:0}, {localidade:"Braga", max:0, min:0, number:0, media:0}]
        
    },
    methods: {
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
          if(this.jogo != "" && this.dataFim != "" && this.dataInicio != ""){
              var aux = this.jogosInfo.find(element => element.jogo == this.jogo)
              var jogoTipo = aux.tipo
              var jogoTable = aux.jogotable
              if(this.state == 0){
                  // municipios
                var response = await axios.get(h + "escolas/jogos/" + jogoTable + "/municipios/"
                                                + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                + "&jogoTipo=" + jogoTipo + "&token=" + this.token)
                
                this.headers = this.headersMunicipios
                this.items = response.data
              }
              else if(this.state == 1){
                  // escolas do municipio
                  var response = await axios.get(h + "escolas/jogos/" + jogoTable + "/municipios/" + this.municipioAtual
                                                + "/?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                + "&jogoTipo=" + jogoTipo + "&token=" + this.token)

                  this.headers = this.headersEscolas
                  this.items = response.data

              }
              else if(this.state == 2){
                  // professores da escola
                  //var response = await axios.get(h)

              }
              else if(this.state == 3){
                  // alunos da turma
              }
              

          } 
      },
      changeState: async function(item){
          if(this.state == 3){
              // não faz nada (selecionou um aluno)
          }
          else if(this.state == 2){
              // selecionou uma turma
              
          }
          else if(this.state == 1){
              // selecionou uma escola
          }
          else if(this.state == 0){
              // selecionou um municipio
              this.municipioAtual = item.localidade
              this.antiga = this.atual
              this.atual = "Agrupamentos de " + this.municipioAtual
              this.state++;
              this.atualizaConteudo()
          }
      },
      voltar: function(){

      }
    }
  }
</script>