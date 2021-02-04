<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Monotorização de Apps por Professores de {{this.nomeEscola}}
            </v-card-title>
                <center><v-btn v-if="items.length>0" class="white--text" style="background-color: #009263;" @click="exportPDF()"> <v-icon> mdi-pdf-box </v-icon> Exportar </v-btn></center>
                <br v-if="items.length>0">
                <center>
                <v-card class="pa-5" width="60%">
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
            @click:row="goToTurmas"
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

  export default {
    data(){
      return {
        token: "",
        loading: false,
        app:"",
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
        apps:["Todas"],
        appsInfo:["Todas"],
        headers:[
            {text: "Professor", value: 'nome', class: 'subtitle-1'},
            {text: "NCertas", value: 'ncertas', class: 'subtitle-1'},
            {text: "NTotal", value: 'ntotal', class: 'subtitle-1'},
            {text: "Acerto(%)", value: 'acerto', class: 'subtitle-1'},
            {text: "OnPeak", value: 'onpeak', class: 'subtitle-1'},
            {text: "OffPeak", value: 'offpeak', class: 'subtitle-1'},
            {text: "Frequência", value:'frequencia', class:"subtitle-1"}
        ],
        items:[],
        escolaAtual:"",
        nomeEscola:""
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.escolaAtual = this.$route.params.escola
        var response = await axios.get(h + "escolas/" + this.escolaAtual +"/?token=" + this.token)
        this.nomeEscola = response.data.nome

        if(this.$route.params.anoLetivo && this.$route.params.dataInicio && this.$route.params.dataFim && this.$route.params.appAtual){
            this.anoLetivo = this.$route.params.anoLetivo
            this.dataInicio = this.$route.params.dataInicio
            this.dataFim = this.$route.params.dataFim
            this.app = this.$route.params.appAtual
            this.atualizaConteudo()
        }
        // ir buscar as apps disponíveis
        
        
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
      onAppChange: async function(item){
          if(this.app != ""){
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
            if(this.app != "" && this.dataFim != "" && this.dataInicio != ""){

                if(this.app == "Todas"){

                    this.loading = true
                    var response = await axios.get(hostApps + "escolas/" + this.escolaAtual
                                            + "/?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                            + "&token=" + this.token)
            
                    this.items = response.data
                    this.loading = false
              
                }
                else{
                    // Fazer para uma app em particular
                }

          } 
      },
      goToTurmas: function(item){
        this.$router.push({name: 'Apps Turmas', params:{idprofessor: item.codProf, appAtual: this.app, 
                                                            anoLetivo: this.anoLetivo, dataInicio: this.dataInicio, dataFim: this.dataFim}})

      },
      exportPDF: async function(){
        var doc = new jsPDF({
        })

        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = "Apps-" + this.app + "-"+ this.escolaAtual +".pdf"
        
        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text("App de Conteúdos: " + this.app, 15, 50)
        doc.text("Período: " + this.dataInicio + " a " + this.dataFim, 130, 50)
        doc.text(this.nomeEscola, doc.internal.pageSize.getWidth() / 2, 60, null, null, 'center')
        var listaRes = []
        var totalNtotal = 0
        var totalNcertas = 0
        var totalOnPeak = 0
        var totalOffPeak = 0
        var frequencia = 0
        ytotal += 70
        for(var i = 0; i<this.items.length; i++){
            var aux = [];
            aux.push(this.items[i].nome)
            aux.push(this.items[i].ncertas)
            aux.push(this.items[i].ntotal)
            aux.push(this.items[i].acerto)
            aux.push(this.items[i].onpeak)
            aux.push(this.items[i].offpeak)
            aux.push(this.items[i].frequencia)
            totalNtotal +=this.items[i].ntotal
            totalNcertas += this.items[i].ncertas
            totalOnPeak += this.items[i].onpeak
            totalOffPeak += this.items[i].offpeak
            frequencia += this.items[i].frequencia

            listaRes.push(aux)
        }
        var aux = []
        aux.push("Total"); aux.push(totalNcertas); aux.push(totalNtotal); aux.push(((totalNcertas/totalNtotal)*100).toFixed(0)); aux.push(totalOnPeak); aux.push(totalOffPeak); aux.push(frequencia)
        listaRes.push(aux)
        doc.autoTable({
            head: [['Professor', 'NTRC', "NTR", "Acerto(%)", "DP", "FP", "#"]],
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin: {top: ytotal, bottom:30}, // Seting top margin for First Page.
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
        /*
        for(var i = 1; i < doc.getNumberOfPages; i++){
            //doc.text(150,285); //print number bottom right
            console.log(i)
            doc.text(i, doc.internal.pageSize.getWidth()-20, doc.internal.pageSize.getHeight()-20)
        }*/
        doc.save(pdfName)
       
      },
      
    }
  }
</script>