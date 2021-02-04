<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Monotorização de Jogos por Municípios
            </v-card-title>
                
                <center><v-btn v-if="items.length>0" class="white--text" style="background-color: #009263;" @click="exportPDF()"> <v-icon> mdi-pdf-box </v-icon> Exportar </v-btn></center>
                <br v-if="items.length>0">
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
            @click:row="goToEscolas"
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
        dialogEstatisticas: false,
        dialogGrafico: false,
        jogo:"",
        filtrar:"",
        dataInicio: "2020-09-01",
        dataFim: "2021-01-22",
        turmaSel: "",
        utilizador : {},
        alunos:[],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        anosLetivos:["2020/2021","2019/2020", "2018/2019","2017/2018" ],
        anoLetivo: "2020/2021",
        jogos:["Todos"],
        headersTodos:[
            {text: "Municipio", value: 'localidade', class: 'subtitle-1'},
            {text: "#", value: 'number', class: 'subtitle-1'},
        ], 
        headersJogo:[
            {text: "Municipio", value: 'localidade', class: 'subtitle-1'},
            {text: "Max", value: 'max', class: 'subtitle-1'},
            {text: "Min", value: 'min', class: 'subtitle-1'},
            {text: "Média", value: 'media', class: 'subtitle-1'},
            {text: "#", value: 'number', class: 'subtitle-1'},
        ],
        jogosInfo:[],
        headers:[
            {text: "Municipio", value: 'localidade', class: 'subtitle-1'},
            {text: "Max", value: 'max', class: 'subtitle-1'},
            {text: "Min", value: 'min', class: 'subtitle-1'},
            {text: "Média", value: 'media', class: 'subtitle-1'},
            {text: "#", value: 'number', class: 'subtitle-1'},
        ],
        items:[]
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
        
    },
    methods: {
      onAnoChange: async function(item){
          if(this.anoLetivo != ""){
             var aux = this.anoLetivo.split("/")
             this.dataInicio = aux[0] + "-09-01"
             this.dataFim = aux[1] + "-09-01"
             this.atualizaConteudo()
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
                if(this.jogo == "Todos"){
                    this.headers = this.headersTodos
                    var response = await axios.get(h + "escolas/jogos/" + this.jogo + "/municipios/"
                                                + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                +  "&token=" + this.token)
                    this.items = response.data
                }
                else{
                    this.headers = this.headersJogo
                    var aux = this.jogosInfo.find(element => element.jogo == this.jogo)
                    var jogoTipo = aux.tipo
                    var jogoTable = aux.jogotable
                    // municipios
                    var response = await axios.get(h + "escolas/jogos/" + jogoTable + "/municipios/"
                                                + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                + "&jogoTipo=" + jogoTipo + "&token=" + this.token)
                
                    this.items = response.data
              
                }
              

          } 
      },
      goToEscolas: function(item){
        this.$router.push({name: 'Jogos Escolas', params:{municipio: item.localidade, jogoAtual: this.jogo, 
                                                            anoLetivo: this.anoLetivo, dataInicio: this.dataInicio, dataFim: this.dataFim}})

      },
      exportPDF: async function(){
        var doc = new jsPDF({
        })

        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = this.jogo + "-Municipios.pdf"
        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text("Jogo: " + this.jogo, 15, 50)
        doc.text("Período: " + this.dataInicio + " a " + this.dataFim, 130, 50)
        var listaRes = []
        var header = [['Município', 'Max', "Min", "Média", "#"]]
        if(this.jogo == "Todos"){
            header = [['Município', "#"]]
            var total = 0
            for(var i = 0; i<this.items.length; i++){
                var aux = [];
                aux.push(this.items[i].localidade)
                aux.push(this.items[i].number)
                total += this.items[i].number
                listaRes.push(aux)
            }
            var aux = ["Todos"]
            aux.push(total)
            listaRes.push(aux)
        }
        else{
            for(var i = 0; i<this.items.length; i++){
                var aux = [];
                aux.push(this.items[i].localidade)
                aux.push(this.items[i].max)
                aux.push(this.items[i].min)
                aux.push(this.items[i].media)
                aux.push(this.items[i].number)
                total += this.items[i].number
                listaRes.push(aux)
            }
        }
        doc.autoTable({
            head: header,
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin:{top: 65},
            didDrawPage: function (data) {
                    data.settings.margin.top = 10;
                    ytotal = doc.internal.pageSize.getHeight()
                    doc.setFontSize(8)
                    //doc.setFontType('bold'
                    doc.text("Legenda:" , 10, ytotal -10)
                    doc.text("# - Frequência", 10, ytotal-6)
                },
            willDrawCell: function (data) {
                var rows = data.table.body;
                if (data.row.index === rows.length - 1) {
                    doc.setFillColor(5, 179, 123);
                    doc.setTextColor(255, 255, 255)
                }
            },
        })
        

        doc.save(pdfName)
       
      },
      
    }
  }
</script>