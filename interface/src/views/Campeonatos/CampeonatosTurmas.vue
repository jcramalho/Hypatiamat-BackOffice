<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
        <v-container>
            <v-card class="pa-5">
                <v-container>
                    <v-card-title primary-title class="justify-center green--text">
                        Monitorização de Campeonatos por Turmas ({{this.codprofessor}})
                    </v-card-title>
                    <center>
                        <v-btn v-if="!show" text @click="show=!show"><span>Mostrar Ajuda</span><v-icon color="#009263"> mdi-help-circle </v-icon> </v-btn>
                        <v-btn v-else text @click="show=!show">Esconder Ajuda</v-btn> 
                    </center>
                    <v-slide-y-transition>
                        <v-card v-show="show" class="elevation-6 pa-3" style="border: 2px solid green !important;" color="grey lighten-3">
                            <v-row class="justify-center">
                                <v-col cols="12">
                                    <span> 1. Selecione o campeonato do qual pretende averiguar o desempenho dos seus alunos através do campo "Campeonato".
                                    </span>
                                </v-col>
                                <v-col cols="12">
                                <span> 2. Selecione a turma sobre a qual quer ver o desempenho no campeonato.</span>
                                </v-col>
                                <v-col cols="12">
                                <span> 3. Estando os dois primeiros passos realizados, poderá visualizar os dados de cada aluno da turma inscrito no campeonato. </span> 
                                </v-col>
                                <v-col cols="9">
                                    <v-card class="mx-auto" color="grey lighten-4">
                                        <center> <h3 class="green--text"> Legenda da Tabela: </h3> </center>
                                        <ul> 
                                            <li> <span> <b>Pontuação</b> - Melhor pontuação obtida pelo aluno no campeonato. </span> </li>
                                            <li> <span> <b>#Jogos</b> - Nº de vezes que o aluno jogou no campeonato. </span> </li>
                                        </ul>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-slide-y-transition>
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
                                id="turmas"
                                v-model="turmaSel"
                                label="Turma"
                                color="green"
                                :items="turmas"
                                @change="onTurmaChange"
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
            {text: "Número", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Pontuação", value: 'pontuacao', class: 'subtitle-1'},
            {text: "#Jogos", value: 'njogos', class: 'subtitle-1'},
        ],
        items:[],
        campeonatos:[],
        campeonatosInfo:[],
        campeonato:"",
        campeonatoId:"",
        escola: "",
        escolaOriginal: "",
        estatisticasGerais: undefined,
        estastisticasMunicipio: undefined,
        municipio:"",
        turmaSel: "",
        turmas:[],
        show:false
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.codprofessor = this.$route.params.codprofessor 
        var responseCamp = await axios.get(hostCampeonatos + "?token=" + this.token)
        if(this.$route.params.campeonato && this.$route.params.municipio && this.$route.params.escola){
            this.campeonato = this.$route.params.campeonato
            this.municipio = this.$route.params.municipio
            this.escola = this.escolaOriginal = this.$route.params.escola
        } 
        else{
            if(this.utilizador.type != 20){
                var response2 = await axios.get(h + "professores/codigos/" + this.codprofessor + "/?token=" + this.token )
                this.escola = response2.data.escola
                this.escolaOriginal = response2.data.escola
                
           }
           else this.escola = this.escolaOriginal = this.utilizador.escola
        } 
        var response3 = await axios.get(h + "escolas/" + this.escola + "/?token=" + this.token )
        this.municipio = response3.data.localidade
        var response = await axios.get(h + "professores/" + this.codprofessor + "/turmas?token=" + this.token)
        var i = 0
        for(i = 0; i < response.data.length; i++){
          this.turmas.push(response.data[i].turma)
        }
        this.campeonatos = await this.parseCampeonatos(responseCamp.data)   
        this.onCampeonatoChange()  
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
      onTurmaChange: async function(item){
          if(this.turmaSel != "" && this.turmaSel){
            this.escola = this.escolaOriginal
            var responseAlunos = await axios.get(h + "turmas/" + this.turmaSel + 
                                                    "/alunos?codprofessor=" + this.codprofessor
                                                    + "&token=" + this.token)

            var escolas = []
            for(var i = 0; i < responseAlunos.data.length; i++){
                if(responseAlunos.data[i].escola != this.escola){
                    var auxEscola = escolas.find(a => a.escola == responseAlunos.data[i].escola)
                    if(auxEscola){
                        auxEscola.numero++;
                    }
                    else escolas.push({escola: responseAlunos.data[i].escola, numero:1})
                }
            }
            if(escolas.length > 0){
                var res = Math.max.apply(Math, escolas.map(function(o){return o.numero;}))
                var escolaAux = escolas.find(function(o){ return o.numero == res; })
                if(escolaAux && escolaAux.escola != this.escola) this.escola = escolaAux.escola;
            }
                                                        
            this.items = []

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
          if(this.campeonatoId && this.escola && this.turmaSel && this.codprofessor){
               this.loading = true
               var response = await axios.get(hostCampeonatos + this.campeonatoId.cod + "/turmas/" + this.turmaSel 
                                                + "?codprofessor=" + this.codprofessor + "&escola=" + this.escola + "&token=" + this.token)
               this.items = response.data
               this.loading = false
          }
      },
      exportPDF: async function(){
        var doc = new jsPDF({
        })

        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = this.campeonato + "-" + this.escola + ".pdf"

        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text(this.campeonato, 15, 50)
        doc.text(this.nomeEscola, 15, 55)
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
            head: [['Professor', 'Jogo', "Max", "Min", "Média", "#Jogos", "#Alunos", '#J/#A']],
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
                    doc.text("Max - Máximo de pontuação obtida pelo professor no jogo do campeonato", 10, ytotal -22)
                    doc.text("Min - Mínimo de pontuação obtida pelo professor no jogo do campeonato", 10, ytotal -18)
                    doc.text("#Jogos - Número de vezes que o jogo foi jogado pelo professor", 10, ytotal - 14)
                    doc.text("#Alunos - Número de alunos do professor que participaram naquele jogo do campeonato", 10, ytotal -10)
                    doc.text("#J/#A - Número médio de vezes que um aluno do professor jogou", 10, ytotal-6)
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