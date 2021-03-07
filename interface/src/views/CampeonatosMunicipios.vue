<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
        <v-container>
            <v-card class="pa-5">
                <v-container>
                    <v-card-title primary-title class="justify-center green--text">
                        Monitorização de Campeonatos por Municípios
                    </v-card-title>
                        <center><v-btn v-if="items.length>0" class="white--text" style="background-color: #009263;" @click="exportPDF()"> <v-icon> mdi-pdf-box </v-icon> Exportar </v-btn></center>
                        <br v-if="items.length>0">
                        <center>
                        <v-container style="width:80%">
                        <v-card class="pa-5">
                            <v-combobox
                                id="campeonatos"
                                v-model="campeonato"
                                label="Campeonato"
                                color="green"
                                :items="campeonatos"
                                @change="onCampeonatoChange"
                            ></v-combobox>
                            <v-combobox
                                id="municipios"
                                v-model="municipio"
                                label="Município"
                                color="green"
                                :items="municipios"
                                @change="onMunicipioChange"
                            ></v-combobox>
                        </v-card>
                        </v-container>
                        </center>
                        <br>
                        <center><span v-if="this.estatisticasGerais"> <b>Neste campeonato:</b></span></center>
                        <EstatisticasGeraisCampeonato v-if="this.estatisticasGerais" :estatisticasGerais="this.estatisticasGerais"/>
                        <center><span v-if="this.estastisticasMunicipio"> <b> Neste campeonato em {{this.municipio}}: </b> </span> </center>
                        <CampeonatoMunicipio v-if="this.estastisticasMunicipio" :estatisticasGerais="this.estastisticasMunicipio"/>
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
                    <template v-slot:item="row">
                        <tr @click="goToAgrupamentos(row.item)">
                            <td>{{row.item.localidade}}</td>
                            <td v-if="row.item.jogo == 0"> ADD (1.º ano)</td>
                            <td v-else-if="row.item.jogo == 1">ADD (2.º ano)</td>
                            <td v-else-if="row.item.jogo == 2">SAM (2.º ano)</td>
                            <td v-else-if="row.item.jogo == 3">SAM (3.º ano)</td>
                            <td v-else-if="row.item.jogo == 4">SAMD (3.º ano)</td>
                            <td v-else-if="row.item.jogo == 5">SAMD (4.º ano)</td>
                            <td v-else-if="row.item.jogo == 6">SAMD (5/6.º ano)</td>
                            <td v-else-if="row.item.jogo == 7">SAMD (7/8/9.º ano)</td>
                            <td v-else-if="row.item.jogo == 8">SUBADD (1.º ano)</td>
                            <td v-else>SUBADD (2.º ano)</td>
                            <td>{{row.item.max}}</td>
                            <td>{{row.item.min}}</td>
                            <td>{{row.item.media}}</td>
                            <td>{{row.item.njogos}}</td>
                            <td>{{row.item.nusers}}</td>
                            <td>{{row.item.jogosAluno}}</td>
                        </tr>
                    </template>
                </v-data-table>
                </v-container>
                </v-container>
            </v-card>
        </v-container>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
import jsPDF from 'jspdf' 
import 'jspdf-autotable'
import EstatisticasGeraisCampeonato from '@/components/EstatisticasGeraisCampeonato.vue'
import CampeonatoMunicipio from '@/components/CampeonatoMunicipio.vue'
const h = require("@/config/hosts").hostAPI
const hostCampeonatos = require("@/config/hosts").hostCampeonatos
const hypatiaImg = require("@/assets/hypatiamat.png")
const anosletivos2 = require("@/config/confs").anosletivos2
const anoletivoAtual = require("@/config/confs").anoletivo2

  export default {
    components:{
         EstatisticasGeraisCampeonato,
         CampeonatoMunicipio
    },
    data(){
      return {
        token: "",
        loading: false,
        filtrar:"",
        utilizador : {},
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        anosLetivos: anosletivos2,
        anoLetivo: anoletivoAtual,
        headers:[
            {text: "Municipio", value: 'localidade', class: 'subtitle-1'},
            {text: "Jogo", value: 'jogo', class: 'subtitle-1'},
            {text: "Max", value: 'max', class: 'subtitle-1'},
            {text: "Min", value: 'min', class: 'subtitle-1'},
            {text: "Média", value: 'media', class: 'subtitle-1'},
            {text: "#Jogos", value: 'njogos', class: 'subtitle-1'},
            {text: "#Alunos", value: 'nusers', class: 'subtitle-1'},
            {text: "#Jogos/#Alunos", value: 'jogosAluno', class: 'subtitle-1'},
        ],
        items:[],
        campeonatos:[],
        campeonatosInfo:[],
        campeonato:"",
        campeonatoId:"",
        municipio: "Todos",
        municipios: ["Todos"],
        estatisticasGerais: undefined,
        estastisticasMunicipio: undefined,
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        var responseCamp = await axios.get(hostCampeonatos + "?token=" + this.token)
        this.campeonatosInfo = responseCamp.data
        this.campeonatos = await this.parseCampeonatos()
        this.parseMunicipios()        
    },
    methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      parseCampeonatos: async function(){
          var aux = []
          for(var i = 0; i < this.campeonatosInfo.length; i++){
              var campeonato = "Campeonato " + (i+1) + " - " + this.campeonatosInfo[i].datains
              if(this.campeonatosInfo[i].municipio != null) campeonato += " (" + this.campeonatosInfo[i].municipio +")"
              aux.push(campeonato)
          }
          return aux
      },
      parseMunicipios: async function(){
          var response = await axios.get(h + "escolas/localidades?token=" + this.token)
          this.municipios = ["Todos"]
          for(var i = 0; i < response.data.length; i++){
              this.municipios.push(response.data[i].localidade)
          }
      },
      onCampeonatoChange: function(item){
          var camp = this.campeonatos.find(e => e == this.campeonato)
          if(camp){
              var index = this.campeonatos.indexOf(camp)
              this.campeonatoId = this.campeonatosInfo[index]
              this.atualizaEstatisticasGerais()
              if(this.municipio != "Todos") this.atualizaEstatisticasGerais()
              this.atualizaConteudo()
          }
          else this.campeonatoId = undefined
      },
      onMunicipioChange: function(item){
          if(this.municipios.find(e => e == this.municipio)){
              this.atualizaEstatisticasGeraisMunicipio()
              this.atualizaConteudo()
          }
          else this.municipio="Todos"
      },
      atualizaEstatisticasGeraisMunicipio: async function(){
          if(this.campeonatoId){
            if(this.municipio != "Todos"){
                var response = await axios.get(hostCampeonatos + this.campeonatoId.cod + "/municipios/"+ this.municipio + "/gerais?token=" + this.token)
                this.estastisticasMunicipio = response.data
            }
            else this.estastisticasMunicipio = undefined
          }
      },
      atualizaEstatisticasGerais: async function(){
          var response = await axios.get(hostCampeonatos + this.campeonatoId.cod + "/municipios/gerais?token=" + this.token)
          this.estatisticasGerais = response.data
      },
      atualizaConteudo: async function(){
          if(this.campeonatoId && this.municipio){
               this.loading = true
               if(this.municipio == "Todos"){
                   var response = await axios.get(hostCampeonatos + this.campeonatoId.cod + "/municipios/?token=" + this.token)
                   this.items = response.data
               }
               else{
                   var response = await axios.get(hostCampeonatos + this.campeonatoId.cod + "/municipios/?municipio=" + this.municipio + "&token=" + this.token)
                   this.items = response.data
               }
               this.loading = false
          }
      },
      goToAgrupamentos: function(item){
          var params = {municipio: item.localidade, campeonato: this.campeonato}
          this.$router.push({name: 'Campeonatos Agrupamentos', params:params})
      },
      exportPDF: async function(){
        var doc = new jsPDF({
        })

        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName
        if(this.municipio == "Todos") pdfName = this.campeonato + "-Municípios.pdf"
        else pdfName = this.campeonato + "-" + this.municipio + ".pdf"
        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text(this.campeonato, 15, 50)
        if(this.municipio != "Todos") doc.text("Municipio: " + this.municipio, 15, 60)
        var listaRes = []
        //var total = ["Todos", 0, 0, 0, 0, 0, 0]
        for(var i = 0; i<this.items.length; i++){
            var aux = [];
            aux.push(this.items[i].localidade)
            if(this.items[i].jogo == 0) aux.push("ADD (1.º)")
            else if(this.items[i].jogo == 1) aux.push("ADD (2.º)")
            else if(this.items[i].jogo == 2) aux.push("SAM (2.º)")
            else if(this.items[i].jogo == 3) aux.push("SAM (3.º)")
            else if(this.items[i].jogo == 4) aux.push("SAMD (3.º)")
            else if(this.items[i].jogo == 5) aux.push("SAMD (4.º)")
            else if(this.items[i].jogo == 6) aux.push("SAMD (5/6.º)")
            else if(this.items[i].jogo == 7) aux.push("SAMD (7/8/9.º)")
            else if(this.items[i].jogo == 8) aux.push("SUBADD (1.º)")
            else aux.push("SUBADD (2.º)")
            aux.push(this.items[i].max)
            aux.push(this.items[i].min)
            aux.push(this.items[i].media)
            aux.push(this.items[i].njogos)
            aux.push(this.items[i].nusers)
            aux.push(this.items[i].jogosAluno)

            listaRes.push(aux)
        }

        doc.autoTable({
            head: [['Município', 'Jogo', "Max", "Min", "Média", "#Jogos", "#Alunos", '#J/#A']],
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin:{top: 65, bottom:30},
            styles:{fontSize:9},
            didDrawPage: function (data) {
                    // Reseting top margin. The change will be reflected only after print the first page.
                    data.settings.margin.top = 10;
                    ytotal = doc.internal.pageSize.getHeight()
                    doc.setFontSize(8)
                    doc.text("Legenda:" , 10, ytotal -26)
                    doc.text("Max - Máximo de pontuação obtida pelo município no jogo do campeonato", 10, ytotal -22)
                    doc.text("Min - Mínimo de pontuação obtida pelo município no jogo do campeonato", 10, ytotal -18)
                    doc.text("#Jogos - Número de vezes que o jogo foi jogado pelo município", 10, ytotal - 14)
                    doc.text("#Alunos - Número de alunos do município que participaram naquele jogo do campeonato", 10, ytotal -10)
                    doc.text("#J/#A - Número médio de vezes que um aluno do município jogou", 10, ytotal-6)
                },
            willDrawCell: function (data) {
                /*
                var rows = data.table.body;
                if (data.row.index === rows.length - 1) {
                    doc.setFillColor(5, 179, 123);
                    doc.setTextColor(255, 255, 255)
                }*/
            },
        })
        
        

        doc.save(pdfName)
       
      },
      
    }
  }
</script>