<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Monotorização de Jogos por Agrupamentos de {{this.municipioAtual}}
            </v-card-title>
                <center><v-btn v-if="items.length>0" class="white--text" style="background-color: #009263;" @click="exportPDF()"> <v-icon> mdi-pdf-box </v-icon> Exportar </v-btn></center>
                <br v-if="items.length>0">
                <center>
                <v-card class="pa-5" width="80%">
                    <v-combobox
                        id="jogos"
                        v-model="jogo"
                        label="Jogo"
                        color="green"
                        :items="jogos"
                        @change="onJogoChange"
                    ></v-combobox>
                    <v-combobox
                        id="tiposCalcRapid"
                        chips
                        v-if="jogo=='Calcrapid'"
                        v-model="tiposCalc"
                        label="Tipo de Operação"
                        color="green"
                        :multiple="true"
                        :items="tiposCalcRapid"
                        @change="onTipoCalcChange"
                    ></v-combobox>
                    <v-combobox
                        id="niveisCalculus"
                        chips
                        v-if="jogo=='Calculus'"
                        v-model="niveisSel"
                        label="Nível"
                        color="green"
                        :multiple="true"
                        :items="niveisCalculus"
                        @change="onNivelChange"
                    ></v-combobox>
                    <v-combobox
                        id="tiposCalculus"
                        chips
                        v-if="jogo=='Calculus'"
                        v-model="tiposCalculusSel"
                        label="Tipo de Operações"
                        color="green"
                        :multiple="true"
                        :items="tiposCalculus"
                        @change="onTipoCalculusChange"
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
                        <v-col cols="12" xs="12" sm="12" md="12" lg="6" xl="6">
                        <v-text-field @change="onDataInChange" prepend-icon="mdi-calendar" v-model="dataInicio" label="Data Inicio" type="date" :format="format" required></v-text-field>
                        </v-col>
                        <v-col cols="12" xs="12" sm="12" md="12" lg="6" xl="6">
                            <v-text-field @change="onDataFimChange" prepend-icon="mdi-calendar" v-model="dataFim" label="Data Fim" type="date" :format="format" required></v-text-field>
                        </v-col>
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
        <v-container v-if="loading">
            <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
        </v-container>
        <v-container v-else>
        <v-data-table
            class="elevation-4"
            :headers="headers"
            :items="items"
            :footer-props="footer_props"
            :search="filtrar"
            @click:row="goToProfessores"
        >   
        </v-data-table>
        </v-container>
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
const anosletivos2 = require("@/config/confs").anosletivos2
const anoletivoAtual = require("@/config/confs").anoletivo2

  export default {
    data(){
      return {
        token: "",
        turmas: [],
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
        anosLetivos: anosletivos2,
        anoLetivo: anoletivoAtual,
        jogos:["Todos"],
        jogosInfo:[],
        headersTodos:[
            {text: "Agrupamento", value: 'nome', class: 'subtitle-1'},
            {text: "#", value: 'number', class: 'subtitle-1'},
        ], 
        headersJogo:[
            {text: "Agrupamento", value: 'nome', class: 'subtitle-1'},
            {text: "Max", value: 'max', class: 'subtitle-1'},
            {text: "Min", value: 'min', class: 'subtitle-1'},
            {text: "Média", value: 'media', class: 'subtitle-1'},
            {text: "#", value: 'number', class: 'subtitle-1'},
        ],
        headers:[
            {text: "Agrupamento", value: 'nome', class: 'subtitle-1'},
            {text: "Max", value: 'max', class: 'subtitle-1'},
            {text: "Min", value: 'min', class: 'subtitle-1'},
            {text: "Média", value: 'media', class: 'subtitle-1'},
            {text: "#", value: 'number', class: 'subtitle-1'},
        ],
        headers_calcrapid:[
            {text: "Agrupamento", value: 'nome', class: 'subtitle-1'},
            {text: "P.Certa", value: 'pontcerta', class: 'subtitle-1'},
            {text: "P.Errada", value: 'ponterrada', class: 'subtitle-1'},
            {text: "#Operações", value: 'oprealizadas', class: 'subtitle-1'},
            {text: "#", value: 'frequencia', class: 'subtitle-1'},
        ],
        headers_minutenew:[
            {text: "Agrupamento", value: 'nome', class: 'subtitle-1'},
            {text: "N.Certas", value: 'numcertas', class: 'subtitle-1'},
            {text: "N.Erradas", value: 'numerradas', class: 'subtitle-1'},
            {text: "T.Pontos", value: 'pontos', class: 'subtitle-1'},
            {text: "#", value: 'frequencia', class: 'subtitle-1'},
        ],
        items:[],
        municipioAtual: "",
        loading: false,
        tiposCalcRapid:["1 - Adição", "2 - Subtração", "3 - Multiplicação", "4 - Divisão"],
        tiposCalc:["1 - Adição", "2 - Subtração", "3 - Multiplicação", "4 - Divisão"],
        niveisCalculus:["1","2","3","4","5"],
        tiposCalculus:["0 - Todas as combinações", "1 – Adição", "2 – Subtração", "3 - Multiplicação", "4 - Divisão"],
        niveisSel:["1","2","3","4","5"],
        tiposCalculusSel:["0 - Todas as combinações"],
        tiposCalculusSelAnterior:["0 - Todas as combinações"]
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.municipioAtual = this.$route.params.municipio        

        var response2 = await axios.get(hostJogos +"?token=" + this.token)
        this.jogosInfo = response2.data
        for(var i = 0; i < this.jogosInfo.length; i++){
            this.jogos.push(this.jogosInfo[i].jogo)
        }

        if(this.$route.params.jogoAtual){
            this.jogo = this.$route.params.jogoAtual
            if(this.$route.params.anoLetivo && this.$route.params.dataInicio && this.$route.params.dataFim){
                this.anoLetivo = this.$route.params.anoLetivo
                this.dataInicio = this.$route.params.dataInicio
                this.dataFim = this.$route.params.dataFim
                if(this.$route.params.tiposCalc) this.tiposCalc = this.$route.params.tiposCalc
                if(this.$route.params.niveisSel && this.$route.params.tiposCalculusSel){
                    this.niveisSel = this.$route.params.niveisSel; 
                    this.tiposCalculusSel = this.$route.params.tiposCalculusSel;
                }
                this.atualizaConteudo()
            }
            else{
                this.onAnoChange()
            }
        }
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
      onTipoCalcChange: async function(item){
          console.log(this.tiposCalc)
          if(this.jogo && this.jogo != "" && this.dataFim != "" && this.dataInicio != "" && this.tiposCalc.length > 0){
              console.log("Vou ver")
              this.atualizaCalcRapid()
          }
      },
      onNivelChange: async function(item){
          if(this.tiposCalculusSel.find(e => e == "0 - Todas as combinações")){
              if(this.niveisSel.length < this.niveisCalculus.length){
                  if(this.niveisSel.length > 0){
                      console.log("Por níveis")
                      this.atualizaMinuteNewNiveis()
                  }
              }
              else{
                  console.log("Todos os registos")
                  this.atualizaMinuteNew()
              }
          }
          else{
              if(this.niveisSel.length < this.niveisCalculus.length){
                  if(this.niveisSel.length > 0){
                      console.log("Por níveis e tipos")
                      this.atualizaMinuteNewTiposNiveis()
                  }
              }
              else{
                  console.log("Por tipos")
                  this.atualizaMinuteNewTipos()
              }
          }
      },
      onTipoCalculusChange: async function(item){
          var todos = this.tiposCalculusSel.find(e => e == "0 - Todas as combinações")
          if(todos && !this.tiposCalculusSelAnterior.find(e => e == "0 - Todas as combinações")){
                this.tiposCalculusSel = ["0 - Todas as combinações"]
                    if(this.niveisSel.length < this.niveisCalculus.length){
                        console.log("Por niveis")
                        this.atualizaMinuteNewNiveis()
                    }
                    else{
                        console.log("Todos os registos")
                        this.atualizaMinuteNew()
                    }       
        }
        else{
            if(todos){
                var index = this.tiposCalculusSel.indexOf(todos)
                this.tiposCalculusSel.splice(index, index+1)
            }
            if(this.niveisSel.length < this.niveisCalculus.length){
                console.log("Por niveis e tipos")
                this.atualizaMinuteNewTiposNiveis()
            }
            else{
                console.log("Por tipos")
                this.atualizaMinuteNewTipos()
            }
        }
          this.tiposCalculusSelAnterior = this.tiposCalculusSel
      },
      parseTiposCalculus: async function(){
          var res = ""
          for(var i = 0; i < this.tiposCalculusSel.length; i++){
              var aux = this.tiposCalc[i].split(" - ")
              res += aux[0]
          }
          return res
      },
      parseTiposCalcRapid: async function(){
          var res = []
          for(var i = 0; i < this.tiposCalc.length; i++){
              var aux = this.tiposCalc[i].split(" - ")
              res.push(aux[0])
          }
          return res
      },
      atualizaCalcRapid: async function(){
          this.headers = this.headers_calcrapid
          if(this.tiposCalc.length < this.tiposCalcRapid.length){
              var tipos = await this.parseTiposCalcRapid()
              var response = await axios.get(hostJogos + "/calcrapid/municipios/" + this.municipioAtual
                                                    + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                    + "&tipo="+ tipos + "&token=" + this.token)
              this.items = response.data
          }
          else{
            var response = await axios.get(hostJogos + "/calcrapid/municipios/" + this.municipioAtual
                                                    + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                    +  "&token=" + this.token)
            this.items = response.data
          }
          return true
      },
      atualizaMinuteNew: async function(){
          this.loading = true
          this.headers = this.headers_minutenew
          var response = await axios.get(hostJogos + "minutenew/municipios/" + this.municipioAtual
                                                    + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                    +  "&token=" + this.token)
          this.items = response.data
          this.loading = false
          return true
      },
      atualizaMinuteNewTipos: async function(){
          this.loading = true
          var tipos = await this.parseTiposCalculus()
          this.headers = this.headers_minutenew
          var response = await axios.get(hostJogos + "minutenew/municipios/" + this.municipioAtual
                                                    + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                    + "&tipos=" + tipos +"&token=" + this.token)
          this.items = response.data
          this.loading = false
          return true
      },
      atualizaMinuteNewNiveis: async function(){
          this.loading = true
          this.headers = this.headers_minutenew
          var response = await axios.get(hostJogos + "minutenew/municipios/" + this.municipioAtual
                                                    + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                    + "&niveis=" + this.niveisSel +"&token=" + this.token)
          this.items = response.data
          this.loading = false
          return true
      },
      atualizaMinuteNewTiposNiveis: async function(){
          this.loading = true
          var tipos = await this.parseTiposCalculus()
          this.headers = this.headers_minutenew
          var response = await axios.get(hostJogos + "minutenew/municipios/" + this.municipioAtual
                                                    + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                    +  "&niveis=" + this.niveisSel + "&tipos=" + tipos + "&token=" + this.token)
          this.items = response.data
          this.loading = false
          return true
      },
      atualizaConteudo: async function(){
          if(this.jogo != "" && this.dataFim != "" && this.dataInicio != ""){
              this.loading = true
              if(this.jogo == "Todos"){
                  this.headers = this.headersTodos
                  var response = await axios.get(h + "escolas/jogos/" + this.jogo + "/municipios/" + this.municipioAtual
                                                + "/?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                + "&token=" + this.token)
                  this.items = response.data
              }
              else if(this.jogo == "Calcrapid") await this.atualizaCalcRapid()
              else if(this.jogo == "Calculus") await this.onNivelChange()
              else{
                this.headers = this.headersJogo
                var aux = this.jogosInfo.find(element => element.jogo == this.jogo)
                var jogoTipo = aux.tipo
                var jogoTable = aux.jogotable
                  // escolas do municipio
                  var response = await axios.get(h + "escolas/jogos/" + jogoTable + "/municipios/" + this.municipioAtual
                                                + "/?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                + "&jogoTipo=" + jogoTipo + "&token=" + this.token)

                  this.items = response.data
              }
              this.loading = false
          } 
      },
      goToProfessores: function(item){
          var params = {id: item.cod, jogoAtual: this.jogo, anoLetivo: this.anoLetivo, 
                        dataInicio: this.dataInicio, dataFim: this.dataFim}
          if(this.jogo == 'Calcrapid' && this.tiposCalc.length > 0) params.tiposCalc = this.tiposCalc
          if(this.jogo == 'Calculus'){
              if(this.tiposCalculusSel.length > 0 && this.niveisSel.length > 0){
                 params.tiposCalculusSel = this.tiposCalculusSel 
                 params.niveisSel = this.niveisSel
              }
          }
          this.$router.push({name: 'Jogos Professores', params:params})
      },
      exportPDFCalcRapid: async function(){
        var doc = new jsPDF({
        })
        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = this.jogo + "-" + this.municipioAtual + ".pdf"
        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text("Jogo: " + this.jogo, 15, 50)
        doc.text("Período: " + this.dataInicio + " a " + this.dataFim, 130, 50)
        var listaRes = []
        var header = [['Agrupamento de Escolas', 'P.Certa', "P.Errada", "#Operações", "#"]]
        var jogo = this.jogo
        
        //var auxTotal = ['Todos', -1, this.items[0].min, 0, 0]
        for(var i = 0; i<this.items.length; i++){
            var aux = [];
            aux.push(this.items[i].nome)
            aux.push(this.items[i].pontcerta)
            aux.push(this.items[i].ponterrada)
            aux.push(this.items[i].oprealizadas)
            aux.push(this.items[i].frequencia)
            listaRes.push(aux)
        }
        //auxTotal[3] = (auxTotal[3]/(this.items.length)).toFixed(0)
        //listaRes.push(auxTotal)
        doc.autoTable({
            head: header,
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin:{top: 65, bottom:30},
            didDrawPage: function (data) {
                    data.settings.margin.top = 10;
                    ytotal = doc.internal.pageSize.getHeight()
                    doc.setFontSize(8)
                    //doc.setFontType('bold'
                    doc.text("Legenda:" , 10, ytotal -22)
                    doc.text("P.Certa - Total de Pontuação Certa", 10, ytotal-18)
                    doc.text("P.Errada - Total de Pontuaçao Errada", 10, ytotal-14)
                    doc.text("#Operações - Total de Operações Realizadas", 10, ytotal-10)
                    doc.text("# - Frequência", 10, ytotal-6)
                },
        })
        

        doc.save(pdfName)
      },
      exportPDF: async function(){
        if(this.jogo == "Calcrapid") {this.exportPDFCalcRapid(); return;}
        var doc = new jsPDF({
        })
        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = this.jogo + "-" + this.municipioAtual + ".pdf"
        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text("Jogo: " + this.jogo, 15, 50)
        doc.text("Período: " + this.dataInicio + " a " + this.dataFim, 130, 50)
        var listaRes = []
        var freqtotal = 0;
        var header = [['Agrupamento de Escolas', 'Max', "Min", "Média", "#"]]
        var jogo = this.jogo
        if(jogo != "Todos"){
            var auxTotal = ['Todos', -1, this.items[0].min, 0, 0]
            for(var i = 0; i<this.items.length; i++){
                var aux = [];
                aux.push(this.items[i].nome)
                aux.push(this.items[i].max)
                if(auxTotal[1] < this.items[i].max) auxTotal[1] = this.items[i].max
                aux.push(this.items[i].min)
                if(auxTotal[2] > this.items[i].min) auxTotal[2] = this.items[i].min
                aux.push(this.items[i].media)
                auxTotal[3] += this.items[i].media
                aux.push(this.items[i].number)
                auxTotal[4] += this.items[i].number

                listaRes.push(aux)
            }
            auxTotal[3] = (auxTotal[3]/(this.items.length)).toFixed(0)
            listaRes.push(auxTotal)
        }
        else{
            header = [['Agrupamento de Escolas', "#"]] 
            for(var i = 0; i<this.items.length; i++){
                var aux = [];
                aux.push(this.items[i].nome)
                aux.push(this.items[i].number)
                freqtotal += this.items[i].number
                listaRes.push(aux)
            }
            var aux = []
            aux.push("Todos")
            aux.push(freqtotal)
            listaRes.push(aux)
        }
        doc.autoTable({
            head: header,
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin:{top: 65, bottom:30},
            didDrawPage: function (data) {
                    // Reseting top margin. The change will be reflected only after print the first page.
                    data.settings.margin.top = 10;
                    ytotal = doc.internal.pageSize.getHeight()
                    doc.setFontSize(8)
                    //doc.setFontType('bold'

                    if(jogo == "Todos"){
                        doc.text("Legenda:" , 10, ytotal -10)
                        doc.text("# - Frequência", 10, ytotal-6)
                    }
                    else{
                        doc.text("Legenda:" , 10, ytotal -22)
                        doc.text("Min - Mínimo de pontuação obtida", 10, ytotal-18)
                        doc.text("Max - Máximo de pontuação obtida", 10, ytotal-14)
                        doc.text("Média - Média de pontuação obtida", 10, ytotal-10)
                        doc.text("# - Frequência", 10, ytotal-6)
                    }
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