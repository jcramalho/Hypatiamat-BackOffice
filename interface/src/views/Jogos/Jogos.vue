<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Monotorização de Jogos
            </v-card-title>
            <v-layout row class="text-xs-center pa-lg-4" justify-center align-center>
                <v-flex xs3 v-if="alunos.length>0">
                    <center><v-btn class="white--text" style="background-color: #009263;" @click="estatisticasGlobais()"> <v-icon> mdi-book-plus </v-icon> Estatísticas Globais </v-btn></center>
                </v-flex>
                <v-flex xs3 v-if="alunos.length>0">
                    <center><v-btn class="white--text" style="background-color: #009263;" @click="verGrafico()"> <v-icon> mdi-chart-bar-stacked </v-icon> Visualizar Gráfico </v-btn></center>
                </v-flex>
                <v-flex xs3 v-if="alunos.length>0">
                    <center><v-btn class="white--text" style="background-color: #009263;" @click="exportPDF()"> <v-icon> mdi-pdf-box </v-icon> Exportar </v-btn></center>
                </v-flex>
            </v-layout>
            <v-layout row class="text-xs-center pa-lg-4" justify-center align-center>
                <v-flex xs3>
                    <v-combobox
                        id="turmas"
                        v-model="turmaSel"
                        label="Turma"
                        color="green"
                        :items="turmas"
                        @change="onTurmaChange"
                    ></v-combobox>
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
                        <v-flex xs6>
                        <v-text-field @change="onDataInChange" prepend-icon="mdi-calendar" v-model="dataInicio" label="Data Inicio" type="date" :format="format" required></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field @change="onDataFimChange" prepend-icon="mdi-calendar" v-model="dataFim" label="Data Fim" type="date" :format="format" required></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex xs1>
                </v-flex>
                <v-flex xs8>
                    <v-container v-if="loading">
                        <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
                    </v-container>
                    <v-container v-else>     
                    <div id="tableResultados">          
                    <v-data-table
                    class="elevation-4"
                    :headers="header_alunos"
                    :items="alunos"
                    :footer-props="footer_props"
                    :search="filtrar"
                    >
                    </v-data-table>
                    </div>
                    </v-container>
                </v-flex>
            </v-layout>
            <v-dialog
                v-model="dialogEstatisticas"
                width="50%"
            >
            <div ref="estatisticas">
            <v-card class="pa-5">
                <v-card-title class="justify-center" primary-title>
                    Estatísticas globais ({{jogo}})
                </v-card-title>
                <br>
                <v-layout class="text-xs-center" row justify-center align-center>
                    <v-flex xs3 outlined>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined style="background-color:#f58733">
                            <center>
                            <v-card-text>
                                {{this.turmaSel}}
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined style="background-color:#f58733">
                            <center>
                            <v-card-text>
                                AGRUPAMENTO ({{this.utilizador.escola}})
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined style="background-color:#f58733">
                            <center>
                            <v-card-text>
                                HYPATIAMAT
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs3>
                        <v-card outlined style="background-color:#134517">
                            <center>
                            <v-card-text class="white--text">
                                MIN
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined>
                            <center>
                            <v-card-text >
                                {{estatisticas.turma.min}}
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined>
                            <center>
                            <v-card-text >
                                {{estatisticas.escola.min}}
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined>
                            <center>
                            <v-card-text >
                                {{estatisticas.hypatia.min}}
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs3>
                        <v-card outlined style="background-color:#134517">
                            <center>
                            <v-card-text class="white--text">
                                MAX
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined>
                            <center>
                            <v-card-text >
                                {{estatisticas.turma.max}}
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined>
                            <center>
                            <v-card-text >
                                {{estatisticas.escola.max}}
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined>
                            <center>
                            <v-card-text >
                                {{estatisticas.hypatia.max}}
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs3>
                        <v-card outlined style="background-color:#134517">
                            <center>
                            <v-card-text class="white--text">
                                MÉDIA
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined>
                            <center>
                            <v-card-text >
                                {{estatisticas.turma.media}}
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined>
                            <center>
                            <v-card-text >
                                {{estatisticas.escola.media}}
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined>
                            <center>
                            <v-card-text >
                                {{estatisticas.hypatia.media}}
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs3>
                        <v-card outlined style="background-color:#134517">
                            <center>
                            <v-card-text class="white--text">
                                #
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined>
                            <center>
                            <v-card-text >
                                {{estatisticas.turma.number}}
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined>
                            <center>
                            <v-card-text >
                                {{estatisticas.escola.number}}
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                    <v-flex xs3>
                        <v-card outlined>
                            <center>
                            <v-card-text >
                                {{estatisticas.hypatia.number}}
                            </v-card-text>
                            </center>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-card>
            </div>
            </v-dialog>

            <v-dialog
                v-model="dialogGrafico"
                width="50%"
            >
            <v-card class="pa-4">
                <v-card-title>
                    Gráfico
                </v-card-title>
            </v-card>
            </v-dialog>
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
        dialogEstatisticas: false,
        dialogGrafico: false,
        jogo:"",
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
        anosLetivos:anosletivos2,
        anoLetivo: anoletivoAtual,
        jogos:[],
        jogosInfo:[],
        estatisticas:{
            turma:{
                min: 0,
                max: 0,
                media: 0,
                number: 0
            },
            hypatia:{
                min: 0,
                max: 0,
                media: 0,
                number: 0
            },
            escola:{
                min: 0,
                max: 0,
                media: 0,
                number: 0
            }
        },
        loading: false
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        var response = await axios.get(h + "professores/" + this.utilizador.codigo + "/turmas?token=" + this.token)
        var i = 0
        for(i = 0; i < response.data.length; i++){
          this.turmas.push(response.data[i].turma)
        }
        this.onAnoChange()
        /*
        var response2 = await axios.get(h + "turmas/"  "?token=" + this.token)
        this.jogosInfo = response2.data
        for(i = 0; i < this.jogosInfo.length; i++){
            this.jogos.push(this.jogosInfo[i].jogo)
        }
        */
    },
    methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      onTurmaChange: async function(item){
          if(this.turmaSel != ""){
            var response2 = await axios.get(h + "turmas/" + this.turmaSel + "/jogos?escola=" + this.utilizador.escola + "&token=" + this.token)
            this.jogosInfo = response2.data
            this.jogos = []
            this.alunos = []
            this.jogo = ""
            for(var i = 0; i < this.jogosInfo.length; i++){
                this.jogos.push(this.jogosInfo[i].jogo)
            }
            this.atualizaConteudo()
          }

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
          if(this.jogo != "" && this.dataFim != "" && this.dataInicio != "" && this.turmaSel != "" ){
              this.loading = true
              var aux = this.jogosInfo.find(element => element.jogo == this.jogo)
              var jogoTipo = aux.tipo
              var jogoTable = aux.jogotable
              var idescola = this.utilizador.escola
              console.log("jogoTipo: " + jogoTipo + " ; jogoTable: " + jogoTable + "; escola: " + idescola)

                var response = await axios.get(h + "turmas/" + this.turmaSel + "/jogos/" + jogoTable 
                                                + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                + "&jogoTipo=" + jogoTipo + "&escola=" + idescola
                                                + "&token=" + this.token)
              this.alunos = response.data
              this.loading = false
          } 
      },
      estatisticasGlobais: async function(){
          // turmas/:id/jogos/:tableJogo/estatisticasGlobais
          var aux = this.jogosInfo.find(element => element.jogo == this.jogo)
          var jogoTipo = aux.tipo
          var jogoTable = aux.jogotable
          var idescola = this.utilizador.escola
          var response = await axios.get(h + "turmas/" + this.turmaSel + "/jogos/" + jogoTable + "/estatisticasGlobais"
                                        + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                        + "&jogoTipo=" + jogoTipo + "&escola=" + idescola
                                        + "&token=" + this.token)

          this.estatisticas = response.data
          this.dialogEstatisticas = true
      },
      getEstatisticas: async function(){
          var aux = this.jogosInfo.find(element => element.jogo == this.jogo)
          var jogoTipo = aux.tipo
          var jogoTable = aux.jogotable
          var idescola = this.utilizador.escola
          var response = await axios.get(h + "turmas/" + this.turmaSel + "/jogos/" + jogoTable + "/estatisticasGlobais"
                                        + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                        + "&jogoTipo=" + jogoTipo + "&escola=" + idescola
                                        + "&token=" + this.token)
          return response.data
      },
      exportPDF: async function(){
        var doc = new jsPDF({
        })

        var xImage = doc.internal.pageSize.getWidth() / 4
        var y
        var pdfName = this.jogo + "-" + this.turmaSel + ".pdf"
        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text("Professor: " + this.utilizador.codigo, 15, 50)
        doc.text("Turma: " + this.turmaSel, 15, 60)
        doc.text("Jogo: " + this.jogo, 130, 50)
        doc.text("Período: " + this.dataInicio + " a " + this.dataFim, 130, 60)
        var listaRes = []
        
        for(var i = 0; i<this.alunos.length; i++){
            var aux = [];
            aux.push(this.alunos[i].numero)
            aux.push(this.alunos[i].nome)
            aux.push(this.alunos[i].maximo)
            aux.push(this.alunos[i].minimo)
            aux.push(this.alunos[i].media)
            aux.push(this.alunos[i].count)

            listaRes.push(aux)
        }
        doc.autoTable({
            head: [['Nº', 'Nome', 'Max', "Min", "Média", "#"]],
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin:{top: 65}
        })
        
        this.estatisticas = await this.getEstatisticas()

        var min = ["Min", this.estatisticas.turma.min, this.estatisticas.escola.min, this.estatisticas.hypatia.min]
        var max = ["Max", this.estatisticas.turma.max, this.estatisticas.escola.max, this.estatisticas.hypatia.max]
        var media = ["Média", this.estatisticas.turma.media, this.estatisticas.escola.media, this.estatisticas.hypatia.media]
        var total = ["Nº de jogos", this.estatisticas.turma.number, this.estatisticas.escola.number, this.estatisticas.hypatia.number]
        
        doc.autoTable({
            head: [['Tipo', 'Turma', 'Agrupamento', "Hypatia"]],
            body: [min, max, media, total],
            margin:{bottom: 65},
            headStyles: { fillColor: [0, 146, 99] }
        })

        doc.save(pdfName)
       
      },
      verGrafico: async function(){
          this.dialogGrafico = true
      } 
    }
  }
</script>