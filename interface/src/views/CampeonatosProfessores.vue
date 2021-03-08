<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
        <v-container>
            <v-card class="pa-5">
                <v-container>
                    <v-card-title primary-title class="justify-center green--text">
                        Monitorização de Campeonatos por Agrupamentos de {{this.municipio}}
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
                        <tr>
                            <td>{{row.item.nome}}</td>
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
        headers:[
            {text: "Professor", value: 'nome', class: 'subtitle-1'},
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
        escola: "",
        nomeEscola:"",
        estatisticasGerais: undefined,
        estastisticasMunicipio: undefined,
        municipio:""
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.escola = this.$route.params.escola 
        var responseCamp = await axios.get(hostCampeonatos + "?token=" + this.token)
        this.campeonatos = await this.parseCampeonatos(responseCamp.data)
        await this.parseEscolas()
        if(this.$route.params.campeonato && this.$route.params.municipio){
            if(this.$route.params.nomeEscola) this.nomeEscola = this.$route.params.nomeEscola
            this.campeonato = this.$route.params.campeonato
            this.municipio = this.$route.params.municipio
            this.onCampeonatoChange()
        }       
    },
    methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      parseCampeonatos: async function(campeonatosComp){
          var aux = []
          var aux2 = []
          for(var i = 0; i < campeonatosComp.length; i++){
              if(campeonatosComp[i].municipio != null){
                  if(campeonatosComp[i].municipio == this.municipio){
                      aux.push(campeonatosComp[i].descricaoBackOffice)
                      aux2.push(campeonatosComp[i])
                  }
              }
              else if(campeonatosComp[i].comunidade != null){
                  var res = await axios.get(h + "comunidades/" + campeonatosComp[i].comunidade + "?token=" + this.token)  
                  var municipios = res.data
                  if(municipios.find(e => e.municipio == this.municipio)){
                      aux.push(campeonatosComp[i].descricaoBackOffice)
                      aux2.push(campeonatosComp[i])
                  }
              }
              else {aux.push(campeonatosComp[i].descricaoBackOffice); aux2.push(campeonatosComp[i])}
          }
          this.campeonatosInfo = aux2
          return aux
      },
      parseEscolas: async function(){
          var response = await axios.get(h + "escolas/localidades/" + this.municipio + "?token=" + this.token)
          this.escolas = ["Todos"]
          this.escolasId = response.data
          for(var i = 0; i < this.escolasId.length; i++){
              this.escolas.push(this.escolasId[i].nome)
          }
      },
      onCampeonatoChange: function(item){
          var camp = this.campeonatos.find(e => e == this.campeonato)
          if(camp){
              var index = this.campeonatos.indexOf(camp)
              this.campeonatoId = this.campeonatosInfo[index]
              this.atualizaEstatisticas()
              this.atualizaConteudo()
          }
          else this.campeonatoId = undefined
      },
      onEscolaChange: function(item){
          if(this.escolas.find(e => e == this.escola)){
              this.atualizaConteudo()
          }
      },
      atualizaEstatisticas: async function(){
          this.estatisticasGerais = await this.atualizaEstatisticasGerais()
          this.estastisticasMunicipio = await this.atualizaEstatisticasGeraisMunicipio()
      },
      atualizaEstatisticasGeraisMunicipio: async function(){
        if(this.campeonatoId){
            var response = await axios.get(hostCampeonatos + this.campeonatoId.cod + "/municipios/" + this.municipio +"/gerais?token=" + this.token)
        }
        return response.data
      },
      atualizaEstatisticasGerais: async function(){
          var response = await axios.get(hostCampeonatos + this.campeonatoId.cod + "/municipios/gerais?token=" + this.token)
          return response.data
      },
      atualizaConteudo: async function(){
          if(this.campeonatoId && this.escola){
               this.loading = true
               var response = await axios.get(hostCampeonatos + this.campeonatoId.cod + "/escolas/" + this.escola + "?token=" + this.token)
               this.items = response.data
               this.loading = false
          }
      },
      exportPDF: async function(){
        var doc = new jsPDF({
        })

        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName
        if(this.escola != "Todos"){
            var esc = this.escolasId.find(e => e.nome == this.escola)
            pdfName = this.campeonato + "-" + esc.cod + ".pdf"
        }
        else pdfName = this.campeonato + "-" + this.municipio + ".pdf"

        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text(this.campeonato, 15, 50)
        doc.text("Municipio: " + this.municipio, 15, 55)
        if(this.escola != "Todos") doc.text(this.escola, 15, 60)
        var listaRes = []
        //var total = ["Todos", 0, 0, 0, 0, 0, 0]
        for(var i = 0; i<this.items.length; i++){
            var aux = [];
            aux.push(this.items[i].nome)
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
        doc.setFontSize(10)
        doc.autoTable({
            head: [['Agrupamento', 'Jogo', "Max", "Min", "Média", "#Jogos", "#Alunos", '#J/#A']],
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            styles:{fontSize:9},
            margin:{top: 65, bottom:35},
            didDrawPage: function (data) {
                    // Reseting top margin. The change will be reflected only after print the first page.
                    data.settings.margin.top = 10;
                    ytotal = doc.internal.pageSize.getHeight()
                    doc.setFontSize(8)
                    doc.text("Legenda:" , 10, ytotal -26)
                    doc.text("Max - Máximo de pontuação obtida pelo agrupamento no jogo do campeonato", 10, ytotal -22)
                    doc.text("Min - Mínimo de pontuação obtida pelo agrupamento no jogo do campeonato", 10, ytotal -18)
                    doc.text("#Jogos - Número de vezes que o jogo foi jogado pelo agrupamento", 10, ytotal - 14)
                    doc.text("#Alunos - Número de alunos do agrupamento que participaram naquele jogo do campeonato", 10, ytotal -10)
                    doc.text("#J/#A - Número médio de vezes que um aluno do agrupamento jogou", 10, ytotal-6)
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