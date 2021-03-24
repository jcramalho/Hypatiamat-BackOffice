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
                                v-if="this.comunidade=='Nenhuma'"
                                @change="onMunicipioChange"
                            ></v-combobox>
                            <v-combobox
                                id="comunidade"
                                label="Comunidade"
                                v-model="comunidade"
                                color="#009263"
                                :items="comunidades"
                                @change="onComunidadeChange" 
                            ></v-combobox>
                            <v-row class="justify-center align-center">
                                <v-switch color="green" v-model="totaisMunicipio" @change="onTotaisMunicipioChange"></v-switch>
                                <h4 v-if="totaisMunicipio"> Totais </h4>
                                <h4 v-else> Por Jogo </h4>
                            </v-row>
                        </v-card>
                        </v-container>
                        </center>
                        <br>
                        <center><span v-if="this.estatisticasGerais"> <b>Neste campeonato:</b></span></center>
                        <EstatisticasGeraisCampeonato v-if="this.estatisticasGerais" :estatisticasGerais="this.estatisticasGerais"/>
                        <center><span v-if="this.estastisticasMunicipio && this.comunidade == 'Nenhuma'"> <b> Neste campeonato em {{this.municipio}}: </b> </span> 
                        <span v-else-if="this.estastisticasMunicipio"> <b> Neste campeonato em {{this.comunidade}}: </b> </span> </center>
                        <CampeonatoMunicipio v-if="this.estastisticasMunicipio && this.comunidade == 'Nenhuma'" :estatisticasGerais="this.estastisticasMunicipio"/>
                        <EstatisticasGeraisCampeonato v-else-if="this.estastisticasMunicipio" :estatisticasGerais="this.estastisticasMunicipio"/>
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
                        <tr @click="goToAgrupamentos(row.item)" v-if="!totaisMunicipio || (comunidade == 'Nenhuma' && municipio!='Todos')">
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
                        <tr @click="goToAgrupamentos(row.item)" v-else>
                            <td>{{row.item.localidade}}</td>
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
import EstatisticasGeraisCampeonato from '@/components/Campeonatos/EstatisticasGeraisCampeonato.vue'
import CampeonatoMunicipio from '@/components/Campeonatos/CampeonatoMunicipio.vue'
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
        headers_totais:[
            {text: "Municipio", value: 'localidade', class: 'subtitle-1'},
            {text: "Max", value: 'max', class: 'subtitle-1'},
            {text: "Min", value: 'min', class: 'subtitle-1'},
            {text: "Média", value: 'media', class: 'subtitle-1'},
            {text: "#Jogos", value: 'njogos', class: 'subtitle-1'},
            {text: "#Alunos", value: 'nusers', class: 'subtitle-1'},
            {text: "#Jogos/#Alunos", value: 'jogosAluno', class: 'subtitle-1'},
        ],
        headers_jogo:[
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
        comunidades:["Nenhuma"],
        comunidade: "Nenhuma",
        comunidadesId:[],
        estatisticasGerais: undefined,
        estastisticasMunicipio: undefined,
        totaisMunicipio: false
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        var responseCamp = await axios.get(hostCampeonatos + "?token=" + this.token)
        this.campeonatosInfo = responseCamp.data
        this.campeonatos = await this.parseCampeonatos()
        this.parseMunicipios()        
        this.parseComunidades()
    },
    methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      parseComunidades: async function(){
        var response = await axios.get(h + "comunidades?token=" + this.token)
        this.comunidadesId = response.data
        var aux = ["Nenhuma"]
        for(var i = 0; i < this.comunidadesId.length; i++){
          aux.push(this.comunidadesId[i].nome)
        }
        this.comunidades = aux
      },
      parseCampeonatos: async function(){
          var aux = []
          for(var i = 0; i < this.campeonatosInfo.length; i++){
              aux.push(this.campeonatosInfo[i].descricaoBackOffice)
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
              if(this.municipio != "Todos" && this.comunidade == "Nenhuma") this.atualizaEstatisticasGeraisMunicipio()
              if(this.comunidade != "Nenhuma") this.atualizaEstatisticasGeraisComunidade()
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
      onComunidadeChange: function(item){
          var com = this.comunidadesId.find(e => e.nome == this.comunidade)
          if(com){
              this.estastisticasMunicipio = undefined
              this.atualizaEstatisticasGeraisComunidade()
              this.atualizaConteudoComunidade()
          }
          else{
              if(this.comunidade == 'Nenhuma'){
                  this.estastisticasMunicipio = undefined
                  this.onMunicipioChange()
              }
          }
          this.municipio = "Todos"
      },
      onTotaisMunicipioChange: function(){
          this.atualizaConteudo()
      },
      atualizaEstatisticasGeraisComunidade: async function(){
          if(this.campeonatoId){
            if(this.comunidade != "Nenhuma"){
                var com = this.comunidadesId.find(e => e.nome == this.comunidade)
                var response = await axios.get(hostCampeonatos + this.campeonatoId.cod + "/comunidades/"+ com.codigo + "/gerais?token=" + this.token)
                this.estastisticasMunicipio = response.data
            }   
            else this.estastisticasMunicipio = undefined
          }
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
               if(this.comunidade != "Nenhuma") {this.atualizaConteudoComunidade(); return}
               this.loading = true
               if(this.municipio == "Todos"){
                   if(!this.totaisMunicipio){
                        this.headers = this.headers_jogo
                        var response = await axios.get(hostCampeonatos + this.campeonatoId.cod + "/municipios/?token=" + this.token)
                        this.items = response.data
                   }
                   else{
                       this.headers = this.headers_totais
                       var response = await axios.get(hostCampeonatos + this.campeonatoId.cod + "/municipios/totais?token=" + this.token)
                       this.items = response.data
                   }
               }
               else{
                   this.headers = this.headers_jogo
                   var response = await axios.get(hostCampeonatos + this.campeonatoId.cod + "/municipios/?municipio=" + this.municipio + "&token=" + this.token)
                   this.items = response.data
               }
               this.loading = false
          }
      },
      atualizaConteudoComunidade: async function(){
          if(this.campeonatoId && this.comunidade && this.comunidade != "Nenhuma"){
              this.loading = true;
              var com = this.comunidadesId.find(e => e.nome == this.comunidade)
              if(!this.totaisMunicipio) {
                  this.headers = this.headers_jogo
                  var response = await axios.get(hostCampeonatos + this.campeonatoId.cod + "/municipios/?comunidade=" 
                                                    + com.codigo + "&token=" + this.token)
              }
              else {
                  this.headers = this.headers_totais
                  var response = await axios.get(hostCampeonatos + this.campeonatoId.cod + "/municipios/totais?comunidade=" 
                                                    + com.codigo + "&token=" + this.token)
                
              }
              this.items = response.data
              this.loading = false;
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
            if(!this.totaisMunicipio){
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
            }
            aux.push(this.items[i].max)
            aux.push(this.items[i].min)
            aux.push(this.items[i].media)
            aux.push(this.items[i].njogos)
            aux.push(this.items[i].nusers)
            aux.push(this.items[i].jogosAluno)

            listaRes.push(aux)
        }

        if(!this.totaisMunicipio) var headers =  [['Município', 'Jogo', "Max", "Min", "Média", "#Jogos", "#Alunos", '#J/#A']]
        else var headers =  [['Município', "Max", "Min", "Média", "#Jogos", "#Alunos", '#J/#A']]
        doc.autoTable({
            head: headers,
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