<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Monotorização de Apps por turmas do professor ({{this.codProf}})
            </v-card-title>
                <center><v-btn v-if="items.length>0" class="white--text" style="background-color: #009263;" @click="exportPDF()"> <v-icon> mdi-pdf-box </v-icon> Exportar </v-btn></center>
                <br v-if="items.length>0">
                <center>
                <v-container style="width:80%">
                <v-card class="pa-5" >
                    <v-combobox
                        id="turmas"
                        v-model="turmaSel"
                        label="Turma"
                        color="green"
                        :items="turmas"
                        @change="onTurmaChange"
                    ></v-combobox>
                    <v-combobox
                        id="apps"
                        v-model="app"
                        label="App"
                        color="green"
                        :items="apps"
                        @change="onAppChange"
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
                </v-container>
                </center>
                <br>
        <v-container v-if="loading">
            <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
        </v-container>
        <v-container v-else>
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
const hostApps = require("@/config/hosts").hostApps
const hypatiaImg = require("@/assets/hypatiamat.png")
const anosletivos2 = require("@/config/confs").anosletivos2
const anoletivoAtual = require("@/config/confs").anoletivo2

  export default {
    data(){
      return {
        token: "",
        loading: false,
        app:"",
        filtrar:"",
        dataInicio: "2019-09-01",
        dataFim: "2020-09-01",
        turmaSel: "",
        utilizador : {},
        alunos:[],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        anosLetivos:anosletivos2,
        anoLetivo: anoletivoAtual,
        apps:[],
        appsInfo:[],
        headers:[
            {text: "Nº", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "NTRC", value: 'ncertas', class: 'subtitle-1'},
            {text: "NTR", value: 'ntotal', class: 'subtitle-1'},
            {text: "Acerto(%)", value: 'acerto', class: 'subtitle-1'},
            {text: "DP", value: 'onpeak', class: 'subtitle-1'},
            {text: "FP", value: 'offpeak', class: 'subtitle-1'},
            {text: "#", value:'frequencia', class:"subtitle-1"}
        ],
        items:[],
        codProf:"",
        turmas:[],
        turmaSel:"",
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.codProf = this.$route.params.idprofessor
        var response = await axios.get(hostApps + "temas/?token=" + this.token)
        this.appsInfo = response.data
        await this.parseApps()

        var response = await axios.get(h + "professores/" + this.codProf + "/turmas?token=" + this.token)
        var i = 0
        for(i = 0; i < response.data.length; i++){
          this.turmas.push(response.data[i].turma)
        }
        
        if(this.$route.params.anoLetivo && this.$route.params.dataInicio && this.$route.params.dataFim){
            this.dataInicio = this.$route.params.dataInicio
            this.dataFim = this.$route.params.dataFim
            this.anoLetivo = this.$route.params.anoLetivo
        }
        else{
            this.onAnoChange()
        }
        
        
    },
    methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
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
      onTurmaChange: async function(item){
          if(this.turmaSel != ""){
              this.atualizaConteudo()
          }

      },
      onAnoChange: async function(item){
          if(this.anoLetivo != ""){
             var aux = this.anoLetivo.split("/")
             this.dataInicio = aux[0] + "-09-01"
             this.dataFim = aux[1] + "-09-01"
             this.atualizaConteudo()
          }
      },
      onAppChange: async function(item){
            this.atualizaConteudo()
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
            if(this.app != "" && this.dataFim != "" && this.dataInicio != "" && this.turmaSel != ""){
                this.loading = true
                if(this.app == "Todas"){

                    var response = await axios.get(hostApps + "turmas/" + this.turmaSel
                                            + "/?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                            + "&codProf=" + this.codProf + "&token=" + this.token)
            
                    this.items = response.data
              
                }
                else{
                    // Fazer para uma app em particular
                    var appInfo = this.appsInfo.find(element => element.tema == this.app)
                    if(appInfo){
                        // é um dos temas
                        var response = await axios.get(hostApps + "turmas/" + this.turmaSel
                                            + "/?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                            + "&codProf=" + this.codProf + "&codtema=" + appInfo.codtema +
                                            "&token=" + this.token)
                        
                        this.items = response.data
                    }
                    else{
                        // é um subtema
                        appInfo = this.appsInfo.find(element => element.subtema == this.app)
                        if(appInfo){
                              var response = await axios.get(hostApps + "turmas/" + this.turmaSel
                                            + "/?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                            + "&codProf=" + this.codProf + "&codtema=" + appInfo.codtema +
                                            "&codsubtema=" + appInfo.codsubtema + "&token=" + this.token)
                        
                            this.items = response.data
                        }
                    }
                }
                this.loading = false
          } 
      },
      exportPDF: async function(){
        var doc = new jsPDF({
        })

        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = "Apps-" + this.app + "-"+ this.turmaSel +".pdf"
        
        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text("App de Conteúdos: " + this.app, 15, 50)
        doc.text("Professor: " + this.codProf, 130, 50)
        doc.text("Turma: " + this.turmaSel, 15, 60)
        doc.text("Período: " + this.dataInicio + " a " + this.dataFim, 130, 60)
        var listaRes = []
        var total =["Todos", "Todos", 0, 0, 0, 0, 0, 0]
        for(var i = 0; i<this.items.length; i++){
            var aux = [];
            aux.push(this.items[i].numero)
            aux.push(this.items[i].nome)
            aux.push(this.items[i].ncertas)
            total[2] += this.items[i].ncertas
            aux.push(this.items[i].ntotal)
            total[3] += this.items[i].ntotal
            aux.push(this.items[i].acerto)
            aux.push(this.items[i].onpeak)
            total[5] += this.items[i].onpeak
            aux.push(this.items[i].offpeak)
            total[6] += this.items[i].offpeak
            aux.push(this.items[i].frequencia)
            total[7] += this.items[i].frequencia

            listaRes.push(aux)
        }
        total[4] = ((total[2]/total[3]) * 100).toFixed(2)
        listaRes.push(total)
        doc.autoTable({
            head: [['Nº', "Nome", 'NTRC', "NTR", "Acerto(%)", "DP", "FP", "#"]],
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin:{top: 75, bottom: 30},
            didDrawPage: function (data) {
                    // Reseting top margin. The change will be reflected only after print the first page.
                    data.settings.margin.top = 10;
                    ytotal = doc.internal.pageSize.getHeight()
                    doc.setFontSize(8)
                    //doc.setFontType('bold'
                    doc.text("Legenda:" , 10, ytotal -30)
                    doc.text("NTRC - N.º de tarefas realizadas corretamente", 10, ytotal -26)
                    doc.text("NTR- N.º de tarefas realizadas", 10, ytotal -22)
                    doc.text("Acerto (%) - (NTRC/NTR)*100", 10, ytotal - 18)
                    doc.text("DP - Dentro do período escolar", 10, ytotal -14)
                    doc.text("FP - Fora do período escolar", 10, ytotal-10)
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
    },
      
  }
</script>