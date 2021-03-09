<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
        <v-container>
            <v-card class="ma-auto">
                <v-container>
                    <v-card-title primary-title class="justify-center green--text">
                        Monitorização de Jogos do professor ({{this.idprofessor}})
                    </v-card-title>
                    <v-layout row class="text-xs-center pa-lg-4" justify-center align-center>
                        <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4" v-if="alunos.length>0">
                            <center><v-btn class="white--text" style="background-color: #009263;" 
                            @click="estatisticasGlobais()"> <v-icon> mdi-home-analytics </v-icon> Estatísticas Globais 
                            </v-btn></center>
                        </v-col>
                        <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4" v-if="alunos.length>0">
                            <center><v-btn class="white--text" style="background-color: #009263;" @click="verGrafico()"> <v-icon> mdi-chart-bar-stacked </v-icon> Visualizar Gráfico </v-btn></center>
                        </v-col>
                        <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4" v-if="alunos.length>0">
                            <center><v-btn class="white--text" style="background-color: #009263;" @click="exportPDF()"> <v-icon> mdi-pdf-box </v-icon> Exportar </v-btn></center>
                        </v-col>
                    </v-layout>
                    
                    <v-layout row class="text-xs-center" justify-center align-center>
                        <v-col cols="12" xs="12" sm="12" md="12" lg="3" xl="3">
                            <v-container >
                                <v-card class="pa-3">
                                    <v-combobox
                                        id="turmas"
                                        v-model="turmaSel"
                                        label="Turma"
                                        color="green"
                                        :items="turmas"
                                        @change="onTurmaChange"
                                    ></v-combobox>
                                    <v-combobox
                                        v-if="!loadingJogos"
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
                                        v-if="jogo=='Calcrapid' && !loadingJogos"
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
                                        v-if="jogo=='Calculus'  && !loadingJogos"
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
                                        v-if="jogo=='Calculus'  && !loadingJogos"
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
                                        <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-text-field @change="onDataInChange" v-model="dataInicio" label="Data Inicio" type="date" :format="format" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
                                            <v-text-field @change="onDataFimChange" v-model="dataFim" label="Data Fim" type="date" :format="format" required></v-text-field>
                                        </v-col>
                                    </v-layout>
                                </v-card>
                                </v-container>
                            </v-col>
                        <v-col cols="12" xs="12" sm="12" md="12" lg="1" xl="1">
                        </v-col>
                        <v-col cols="12" xs="12" sm="12" md="12" lg="8" xl="8" >
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
                        </v-col>
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
                                        TURMA
                                    </v-card-text>
                                    </center>
                                </v-card>
                            </v-flex>
                            <v-flex xs3>
                                <v-card outlined style="background-color:#f58733">
                                    <center>
                                    <v-card-text>
                                        AGRUPAMENTO
                                    </v-card-text>
                                    </center>
                                </v-card>
                            </v-flex>
                            <v-flex xs3>
                                <v-card outlined style="background-color:#f58733">
                                    <center>
                                    <v-card-text>
                                        HYPATIA
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
        </v-container>
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
        dataInicio: "2020-09-01",
        dataFim: "2021-09-01",
        turmaSel: "",
        utilizador : {},
        alunos:[],
        headersTodos:[
            {text: "Nº", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "#", value: 'count', class: 'subtitle-1'},
        ], 
        headersJogo:[
            {text: "Nº", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Max", value: 'maximo', class: 'subtitle-1'},
            {text: "Min", value: 'minimo', class: 'subtitle-1'},
            {text: "Média", value: 'media', class: 'subtitle-1'},
            {text: "#", value: 'count', class: 'subtitle-1'},
        ],
         header_alunos: [
            {text: "Nº", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Max", value: 'maximo', class: 'subtitle-1'},
            {text: "Min", value: 'minimo', class: 'subtitle-1'},
            {text: "Média", value: 'media', class: 'subtitle-1'},
            {text: "#", value: 'count', class: 'subtitle-1'},
        ],
        headers_calcrapid:[
            {text: "Nº", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "P.Certa", value: 'pontcerta', class: 'subtitle-1'},
            {text: "P.Errada", value: 'ponterrada', class: 'subtitle-1'},
            {text: "#Operações", value: 'oprealizadas', class: 'subtitle-1'},
            {text: "#", value: 'frequencia', class: 'subtitle-1'},
        ],
        headers_minutenew:[
            {text: "Nº", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "N.Certas", value: 'numcertas', class: 'subtitle-1'},
            {text: "N.Erradas", value: 'numerradas', class: 'subtitle-1'},
            {text: "T.Pontos", value: 'pontos', class: 'subtitle-1'},
            {text: "#", value: 'frequencia', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [30, 50, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        anosLetivos: anosletivos2,
        anoLetivo: anoletivoAtual,
        jogos:["Todos"],
        loadingJogos: false,
        idprofessor:"",
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
        escola:"", 
        loading: false,
        tiposCalcRapid:["1 - Adição", "2 - Subtração", "3 - Multiplicação", "4 - Divisão"],
        tiposCalc:["1 - Adição", "2 - Subtração", "3 - Multiplicação", "4 - Divisão"],
        niveisCalculus:["1","2","3","4","5"],
        tiposCalculus:["0 - Todas as combinações", "1 – Adição", "2 – Subtração", "3 - Multiplicação", "4 - Divisão"],
        niveisSel:["1","2","3","4","5"],
        tiposCalculusSel:["0 - Todas as combinações"],
        tiposCalculusSelAnterior:["0 - Todas as combinações"],
        escolaOriginal: ""
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.idprofessor = this.$route.params.idprofessor
        if(this.$route.params.escola) this.escola = this.$route.params.escola
        else{ 
           if(this.utilizador.type != 20){
            var response2 = await axios.get(h + "professores/codigos/" + this.idprofessor + "/?token=" + this.token )
            this.escola = response2.data.escola
            this.escolaOriginal = response2.data.escola
           }
           else this.escola = this.escolaOriginal = this.utilizador.codigo
        }
        
        var response = await axios.get(h + "professores/" + this.idprofessor + "/turmas?token=" + this.token)
        var i = 0
        for(i = 0; i < response.data.length; i++){
          this.turmas.push(response.data[i].turma)
        }

        if(this.$route.params.anoLetivo && this.$route.params.dataInicio && this.$route.params.dataFim){
            this.anoLetivo = this.$route.params.anoLetivo
            this.dataInicio = this.$route.params.dataInicio
            this.dataFim = this.$route.params.dataFim
        }
        else{
            this.onAnoChange()
        }
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
          if(this.turmaSel != "" && this.turmaSel && this.dataInicio && this.dataFim){
            this.loadingJogos = true
            this.escola = this.escolaOriginal
            var responseAlunos = await axios.get(h + "turmas/" + this.turmaSel + 
                                                    "/alunos?codprofessor=" + this.idprofessor
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
                                                        
            var response2 = await axios.get(h + "turmas/" + this.turmaSel + "/jogos?escola=" 
                                                + this.escola + "&dataInicio=" + this.dataInicio 
                                                + "&dataFim=" + this.dataFim + "&codprofessor=" + this.idprofessor + "&token=" + this.token)
            this.jogosInfo = response2.data
            this.jogos = ["Todos"]
            this.alunos = []
            this.jogo = ""
            for(var i = 0; i < this.jogosInfo.length; i++){
                this.jogos.push(this.jogosInfo[i].jogo)
            }
            this.loadingJogos = false
            this.atualizaConteudo()
          }

      },
      onAnoChange: async function(item){
          if(this.anoLetivo != ""){
             var aux = this.anoLetivo.split("/")
             this.dataInicio = aux[0] + "-09-01"
             this.dataFim = aux[1] + "-09-01"
             this.onTurmaChange()
          }
      },
      onJogoChange: async function(item){
          if(this.jogos.find(element => element == this.jogo)){
              this.atualizaConteudo()
          }
      },
      onDataInChange: async function(item){
          if(this.dataInicio){
              this.onTurmaChange()
          }
      },
      onDataFimChange: async function(item){
          if(this.dataFim){
              this.onTurmaChange()
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
      onTipoCalcChange: async function(item){
          if(this.jogo && this.jogo != "" && this.dataFim != "" && this.dataInicio != "" && this.tiposCalc.length > 0){
              this.atualizaCalcRapid()
          }
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
          this.header_alunos = this.headers_calcrapid
          this.loading = true
          if(this.tiposCalc.length < this.tiposCalcRapid.length){
              var tipos = await this.parseTiposCalcRapid()
              var response = await axios.get(hostJogos + "calcrapid/turmas/" + this.turmaSel
                                                    + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                    + "&escola=" + this.escola + "&codprofessor=" + this.idprofessor + 
                                                    "&tipo="+ tipos + "&token=" + this.token)
              this.alunos = response.data
          }
          else{
            var response = await axios.get(hostJogos + "calcrapid/turmas/" + this.turmaSel
                                                    + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                    + "&escola=" + this.escola + "&codprofessor=" + this.idprofessor + 
                                                    "&token=" + this.token)
            this.alunos = response.data
          }
          this.loading = false
          return true
      },
      atualizaMinuteNew: async function(){
          this.loading = true
          this.header_alunos = this.headers_minutenew
          var response = await axios.get(hostJogos + "minutenew/turmas/" + this.turmaSel
                                                    + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                    + "&codprofessor=" + this.idprofessor 
                                                    + "&escola=" + this.escola + "&token=" + this.token)
          this.alunos = response.data
          this.loading = false
          return true
      },
      atualizaMinuteNewTipos: async function(){
          this.loading = true
          var tipos = await this.parseTiposCalculus()
          this.header_alunos = this.headers_minutenew
          var response = await axios.get(hostJogos + "minutenew/turmas/" + this.turmaSel
                                                    + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                    + "&codprofessor=" + this.idprofessor 
                                                    + "&tipos=" + tipos + "&escola=" + this.escola +"&token=" + this.token)
          this.alunos = response.data
          this.loading = false
          return true
      },
      atualizaMinuteNewNiveis: async function(){
          this.loading = true
          this.header_alunos = this.headers_minutenew
          var response = await axios.get(hostJogos + "minutenew/turmas/" + this.turmaSel
                                                    + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                    + "&codprofessor=" + this.idprofessor 
                                                    + "&niveis=" + this.niveisSel + "&escola=" + this.escola +"&token=" + this.token)
          this.alunos = response.data
          this.loading = false
          return true
      },
      atualizaMinuteNewTiposNiveis: async function(){
          this.loading = true
          var tipos = await this.parseTiposCalculus()
          this.header_alunos = this.headers_minutenew
          var response = await axios.get(hostJogos + "minutenew/turmas/" + this.turmaSel
                                                    + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim + "&escola=" + this.escola
                                                    + "&codprofessor=" + this.idprofessor 
                                                    +  "&niveis=" + this.niveisSel + "&tipos=" + tipos + "&token=" + this.token)
          this.alunos = response.data
          this.loading = false
          return true
      },
      atualizaConteudo: async function(){
          if(this.jogo && this.jogo != "" && this.dataFim != "" && this.dataInicio != "" && this.turmaSel != "" ){
              this.loading = true
              if(this.jogo == "Todos"){
                this.header_alunos = this.headersTodos
                var idescola = this.escola
                console.log(this.idprofessor + " - professor")
                var response = await axios.get(h + "turmas/" + this.turmaSel + "/jogos/Todos" 
                                                + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                + "&codprofessor=" + this.idprofessor
                                                + "&escola=" + idescola + "&token=" + this.token)
                this.alunos = response.data
              }
              else if(this.jogo == "Calcrapid") this.atualizaCalcRapid()
              else if(this.jogo == "Calculus") this.onNivelChange()
              else{
                var aux = this.jogosInfo.find(element => element.jogo == this.jogo)
                if(aux){
                    this.header_alunos = this.headersJogo
                    
                    var jogoTipo = aux.tipo
                    var jogoTable = aux.jogotable
                    var idescola = this.escola

                    var response = await axios.get(h + "turmas/" + this.turmaSel + "/jogos/" + jogoTable 
                                                        + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                                        + "&jogoTipo=" + jogoTipo + "&escola=" + idescola
                                                        + "&codprofessor=" + this.idprofessor
                                                        + "&token=" + this.token)
                    this.alunos = response.data
                }
                else this.loading=false
              }
              this.loading = false
          } 
      },
      estatisticasGlobais: async function(){
          // turmas/:id/jogos/:tableJogo/estatisticasGlobais
          var aux = this.jogosInfo.find(element => element.jogo == this.jogo)
          var jogoTipo = aux.tipo
          var jogoTable = aux.jogotable
          var idescola = this.escola
          var response = await axios.get(h + "turmas/" + this.turmaSel + "/jogos/" + jogoTable + "/estatisticasGlobais"
                                        + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                        + "&jogoTipo=" + jogoTipo + "&escola=" + idescola
                                        + "&codprofessor=" + this.idprofessor +
                                        + "&token=" + this.token)

          this.estatisticas = response.data
          this.dialogEstatisticas = true
      },
      getEstatisticas: async function(){
          if(this.jogo != "" && this.jogo != "Todos"){
            var aux = this.jogosInfo.find(element => element.jogo == this.jogo)
            var jogoTipo = aux.tipo
            var jogoTable = aux.jogotable
            var idescola = this.escola
            var response = await axios.get(h + "turmas/" + this.turmaSel + "/jogos/" + jogoTable + "/estatisticasGlobais"
                                            + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                            + "&jogoTipo=" + jogoTipo + "&escola=" + idescola
                                            + "&codprofessor=" + this.idprofessor 
                                            + "&token=" + this.token)
            return response.data
          }
          else return []
      },
      exportPDFCalculus: async function(){
          var doc = new jsPDF({
        })
        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = this.jogo + "-" + this.turmaSel + ".pdf"
        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text("Jogo: " + this.jogo, 15, 50)
        doc.text("Período: " + this.dataInicio + " a " + this.dataFim, 130, 50)
        doc.text("Tipos de Operações:", 15, 56)
        var ytotal1 = 56
        for(var i = 0; i < this.tiposCalculusSel.length; i++){
            ytotal1 += 4
            doc.text(this.tiposCalculusSel[i], 15, ytotal1)
        }
        doc.text("Níveis Selecionados:", 130, 56)
        var ytotal2 = 56
        for(var i = 0; i < this.niveisSel.length; i++){
            ytotal2 +=4
            doc.text("- Nível " + this.niveisSel[i], 130, ytotal2)
        }
        if(ytotal2 > ytotal1) ytotal = ytotal2;
        else ytotal = ytotal1
        var listaRes = []
        var header = [['Nº', 'Nome', 'N.Certas', "N.Erradas", "T.Pontos", "#"]]
        var jogo = this.jogo
        
        //var auxTotal = ['Todos', -1, this.items[0].min, 0, 0]
        for(var i = 0; i<this.alunos.length; i++){
            var aux = [];
            aux.push(this.alunos[i].numero)
            aux.push(this.alunos[i].nome)
            aux.push(this.alunos[i].numcertas)
            aux.push(this.alunos[i].numerradas)
            aux.push(this.alunos[i].pontos)
            aux.push(this.alunos[i].frequencia)
            listaRes.push(aux)
        }
        //auxTotal[3] = (auxTotal[3]/(this.items.length)).toFixed(0)
        //listaRes.push(auxTotal)
        doc.autoTable({
            head: header,
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin:{top: ytotal+6, bottom:30},
            didDrawPage: function (data) {
                    data.settings.margin.top = 10;
                    ytotal = doc.internal.pageSize.getHeight()
                    doc.setFontSize(8)
                    //doc.setFontType('bold'
                    doc.text("Legenda:" , 10, ytotal -22)
                    doc.text("N.Certas - Total de Operações certas", 10, ytotal-18)
                    doc.text("N.Erradas - Total de Operações erradas", 10, ytotal-14)
                    doc.text("T.Pontos - Total de Pontos obtidos", 10, ytotal-10)
                    doc.text("# - Frequência", 10, ytotal-6)
                },
        })
        

        doc.save(pdfName)
      },
      exportPDFCalcRapid: async function(){
        var doc = new jsPDF({
        })
        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = this.jogo + "-" + this.turmaSel + ".pdf"
        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text("Jogo: " + this.jogo, 15, 50)
        doc.text("Período: " + this.dataInicio + " a " + this.dataFim, 130, 50)
        doc.text("Tipos de Operações realizadas:", 15, 56)
        ytotal = 56;
        for(var i = 0; i < this.tiposCalc.length; i++){
            ytotal += 4
            doc.text(this.tiposCalc[i], 15, ytotal);
        }
        var listaRes = []
        var header = [['Nº', 'Nome', 'P.Certa', "P.Errada", "#Operações", "#"]]
        var jogo = this.jogo
        
        //var auxTotal = ['Todos', -1, this.items[0].min, 0, 0]
        for(var i = 0; i<this.alunos.length; i++){
            var aux = [];
            aux.push(this.alunos[i].numero)
            aux.push(this.alunos[i].nome)
            aux.push(this.alunos[i].pontcerta)
            aux.push(this.alunos[i].ponterrada)
            aux.push(this.alunos[i].oprealizadas)
            aux.push(this.alunos[i].frequencia)
            listaRes.push(aux)
        }
        //auxTotal[3] = (auxTotal[3]/(this.items.length)).toFixed(0)
        //listaRes.push(auxTotal)
        doc.autoTable({
            head: header,
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin:{top: ytotal+6, bottom:30},
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
        else if(this.jogo == "Calculus") {this.exportPDFCalculus(); return;}
        var doc = new jsPDF({
        })

        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = this.jogo + "-" + this.turmaSel + ".pdf"
        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text("Professor: " + this.idprofessor, 15, 50)
        doc.text("Turma: " + this.turmaSel, 15, 60)
        doc.text("Jogo: " + this.jogo, 130, 50)
        doc.text("Período: " + this.dataInicio + " a " + this.dataFim, 130, 60)
        var listaRes = []
        var headers = [['Nº', 'Nome', 'Max', "Min", "Média", "#"]]
        var jogo = this.jogo
        ytotal += 70
        if(jogo != "Todos"){
            var auxTotal = ['Todos', "Todos", -1, this.alunos[0].minimo, 0, 0]
            for(var i = 0; i<this.alunos.length; i++){
                var aux = [];
                aux.push(this.alunos[i].numero)
                aux.push(this.alunos[i].nome)
                aux.push(this.alunos[i].maximo)
                if(auxTotal[2] < this.alunos[i].maximo) auxTotal[2] = this.alunos[i].maximo
                aux.push(this.alunos[i].minimo)
                if(auxTotal[3] > this.alunos[i].minimo) auxTotal[3] = this.alunos[i].minimo
                aux.push(this.alunos[i].media)
                auxTotal[4] += this.alunos[i].media*this.alunos[i].count
                aux.push(this.alunos[i].count)
                auxTotal[5] += this.alunos[i].count
                listaRes.push(aux)
            }
            auxTotal[4] = (auxTotal[4]/auxTotal[5]).toFixed(0)
            listaRes.push(auxTotal)
        }
        else {
            headers = [['Nº', 'Nome', "#"]]
            var total = ["Todos", "Todos", 0]
            for(var i = 0; i<this.alunos.length; i++){
                var aux = [];
                aux.push(this.alunos[i].numero)
                aux.push(this.alunos[i].nome)
                aux.push(this.alunos[i].count)
                total[2] += this.alunos[i].count
                listaRes.push(aux)
            }
            listaRes.push(total)
        }
        doc.autoTable({
            head: headers,
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin:{top: ytotal, bottom: 30},
            didDrawPage: function (data) {
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
        /*
        if(this.jogo != "Todos"){
            this.estatisticas = await this.getEstatisticas()

            var min = ["Min", this.estatisticas.turma.min, this.estatisticas.escola.min, this.estatisticas.hypatia.min]
            var max = ["Max", this.estatisticas.turma.max, this.estatisticas.escola.max, this.estatisticas.hypatia.max]
            var media = ["Média", this.estatisticas.turma.media, this.estatisticas.escola.media, this.estatisticas.hypatia.media]
            var total = ["Nº de jogos", this.estatisticas.turma.number, this.estatisticas.escola.number, this.estatisticas.hypatia.number]
            
            doc.autoTable({
                head: [['Tipo', 'Turma', 'Agrupamento', "Hypatia"]],
                body: [min, max, media, total],
                margin:{ bottom: 60}
            })
        }*/

        doc.save(pdfName)
       
      },
      verGrafico: async function(){
          this.dialogGrafico = true
      } 
    }
  }
</script>