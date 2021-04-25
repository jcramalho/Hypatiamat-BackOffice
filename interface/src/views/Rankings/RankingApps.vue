<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-container>
        <v-card class="pa-5">
            <v-card-title primary-title class="justify-center green--text">
                Ranking dos Alunos das suas turmas (Aplicações de Conteúdo)
            </v-card-title>
            <center>
                <v-btn v-if="!show" text @click="show=!show"><span>Mostrar Ajuda</span><v-icon color="#009263"> mdi-help-circle </v-icon> </v-btn>
                <v-btn v-else text @click="show=!show">Esconder Ajuda</v-btn> 
            </center>
            <v-slide-y-transition>
                <v-card v-show="show" class="elevation-6 pa-3" style="border: 2px solid green !important;" color="grey lighten-3">
                <v-row class="justify-center">
                    <v-col cols="12">
                    <span> 1. No "Tipo de Ranking", pode escolher o critério de ordenação que desejar. </span>
                    </v-col>
                    <v-col cols="12">
                    <span> 2. Pode selecionar a turma desejada através da seleção do campo "Turma". </span>
                    </v-col>
                    <v-col cols="12">
                    <span> 3. Pode escolher a aplicação de conteúdo pretendida através da seleção do campo "Aplicação". De referir que este campo apenas contém
                      as aplicações de conteúdo que a turma selecionada realizou. </span>
                    </v-col>
                    <v-col cols="12">
                    <span> 4. Pode escolher o ano letivo desejado através do campo "Ano Letivo". </span>
                    </v-col>
                    <v-col cols="12">
                    <span> 5. Tendo os campos todos selecionados, pode visualizar o ranking dos seus alunos. </span> 
                    </v-col>
                    <v-col cols="9">
                        <v-card class="mx-auto" color="grey lighten-4">
                            <center> <h3 class="green--text"> Legenda da Tabela: </h3> </center>
                            <ul> 
                                <li> <span> <b>N.º</b> - Número do aluno; </span> </li>
                                <li> <span> <b>Posição (Turma)</b> - Posição do aluno na turma; </span> </li>
                                <li> <span> <b>Posição (Agr. Escolas)</b> - Posição do aluno no seu Agrupamento de Escolas; </span> </li>
                                <li> <span> <b>Posição (Hypatia)</b> - Posição do aluno em todo o Hypatiamat; </span> </li>
                                <li> <span> <b>NTRC</b> - Número de tarefas resolvidas corretamente. Caso o nome da coluna esteja a verde, significa que 
                                é o critério de ordenação selecionado; </span> </li>
                                <li> <span> <b>Acerto(%)</b> - Percentagem de acerto, ou seja, a divisão do NTRC pelo número de tarefas resolvidas. 
                                Caso o nome da coluna esteja a verde, significa que é o critério de ordenação selecionado. </span> </li>
                            </ul>
                        </v-card>
                    </v-col>
                </v-row>
                </v-card>
            </v-slide-y-transition>
            <br v-if="items.length > 0">
            <center>
                <v-btn v-if="items.length>0" class="white--text" style="background-color: #009263;" @click="exportPDF()">
                <v-icon> mdi-pdf-box </v-icon> Exportar 
                </v-btn>
            </center>
            <center>
                <v-container style="width:80%">
                <v-card class="pa-5" >
                    <v-combobox
                        id="tipoRanking"
                        v-model="tipoRankSel"
                        label="Tipo de Ranking"
                        color="green"
                        :items="tiposRanking"
                        @change="onRankingChange"
                    ></v-combobox>
                    <v-combobox
                        id="turmas"
                        v-model="turmaSel"
                        label="Turma"
                        color="green"
                        :items="turmas"
                        @change="onTurmaChange"
                    ></v-combobox>
                    <v-combobox
                        v-if="apps"
                        id="apps"
                        v-model="app"
                        label="Aplicação"
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
            color="#009263"
        >
            
        </v-data-table>
        </v-container>
        </v-card>
    </v-container>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
import Swal from 'sweetalert2'
import jsPDF from 'jspdf' 
import 'jspdf-autotable'
const hypatiaImg = require("@/assets/hypatiamat.png")
const h = require("@/config/hosts").hostAPI
const hostApps = require("@/config/hosts").hostApps
const anosletivos2 = require("@/config/confs").anosletivos2
const anoletivoAtual = require("@/config/confs").anoletivo2

  export default {
    data(){
      return {
        token: "",
        utilizador: {},
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [30, 50, -1],
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
          {text: "Posição (Turma)", value: 'posTurma', class: 'subtitle-1'},
          {text: "Posição (Agr. Escolas)", value: 'posEscola', class: 'subtitle-1'},
          {text: "Posição (Hypatia)", value: 'posHypatia', class: 'subtitle-1'},
          {text: "NTRC", value: 'total', class: 'subtitle-1 green--text'},
          {text: "Acerto (%)", value: 'params', class: 'subtitle-1'},

        ],
        headers_NTRC:[
          {text: "Nº", value: 'numero', class: 'subtitle-1'},
          {text: "Nome", value: 'nome', class: 'subtitle-1'},
          {text: "Posição (Turma)", value: 'posTurma', class: 'subtitle-1'},
          {text: "Posição (Agr. Escolas)", value: 'posEscola', class: 'subtitle-1'},
          {text: "Posição (Hypatia)", value: 'posHypatia', class: 'subtitle-1'},
          {text: "NTRC", value: 'total', class: 'subtitle-1 green--text'},
          {text: "Acerto (%)", value: 'params', class: 'subtitle-1'},
        ],
        headers_Acerto:[
          {text: "Nº", value: 'numero', class: 'subtitle-1'},
          {text: "Nome", value: 'nome', class: 'subtitle-1'},
          {text: "Posição (Turma)", value: 'posTurma', class: 'subtitle-1'},
          {text: "Posição (Agr. Escolas)", value: 'posEscola', class: 'subtitle-1'},
          {text: "Posição (Hypatia)", value: 'posHypatia', class: 'subtitle-1'},
          {text: "Acerto (%)", value: 'total', class: 'subtitle-1 green--text'},
          {text: "NTRC", value: 'params', class: 'subtitle-1'},
        ],
        items:[],
        codProf:"",
        turmas:[],
        turmaSel:"",
        dataInicio:"",
        dataFim:"",
        app:"",
        escola: "",
        escolaOriginal:"",
        loading: false,
        tipoRankSel: "NTRC - Número de tarefas resolvidas corretamente",
        tiposRanking: ["NTRC - Número de tarefas resolvidas corretamente", "Acerto - Percentagem de acerto"],
        show:false,
        nomeProf: ""
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.codProf = this.utilizador.codigo
        var response = await axios.get(hostApps + "temas/?token=" + this.token)
        this.appsInfo = response.data
        await this.parseApps()
        this.onAnoChange()

        var response = await axios.get(h + "professores/" + this.codProf + "/turmas?token=" + this.token)
        var i = 0
        for(i = 0; i < response.data.length; i++){
          this.turmas.push(response.data[i].turma)
        }
        this.escola = this.escolaOriginal = this.utilizador.escola   
        
        var responseProf = await axios.get(h + "professores/codigos/" + this.codProf + "?token=" + this.token)
        this.nomeProf = responseProf.data.nome

    },
    methods: {
      atualizaApps: async function(){
          if(this.turmaSel && this.turmaSel != ""){
            this.apps = undefined
            var response = await axios.get(hostApps + "turmas/" + this.turmaSel + "/jogou?codprofessor=" + this.codProf
                                                + "&dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim + "&token=" + this.token)
            this.appsInfo = response.data
            this.parseApps()
          }
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
          if(this.turmaSel != "" && this.turmaSel){
              this.escola = this.escolaOriginal
              var responseAlunos = await axios.get(h + "turmas/" + this.turmaSel + 
                                                      "/alunos?codprofessor=" + this.codProf
                                                      + "&token=" + this.token)

              var escolas = []
              this.atualizaApps()
            for(var i = 0; i < responseAlunos.data.length; i++){
                var auxEscola = escolas.find(a => a.escola == responseAlunos.data[i].escola)
                if(auxEscola) auxEscola.numero++;
                else escolas.push({escola: responseAlunos.data[i].escola, numero:1})
            }
            if(escolas.length > 1){
                var res = Math.max.apply(Math, escolas.map(function(o){return o.numero;}))
                var escolaAux = escolas.find(function(o){ return o.numero == res; })
                if(escolaAux && escolaAux.escola != this.escola) this.escola = escolaAux.escola;
            }
          }
      },
      onAnoChange: async function(item){
          if(this.anoLetivo != "" && this.anoLetivo){
             var aux = this.anoLetivo.split("/")
             this.dataInicio = aux[0] + "-09-01"
             this.dataFim = aux[1] + "-09-01"
             this.atualizaApps()
          }
      },
      onAppChange: async function(item){
          if(this.app){
            this.atualizaConteudo()
          }
      },
      onRankingChange: async function(item){
        if(this.tipoRankSel && this.tiposRanking.find(e => e == this.tipoRankSel)) this.atualizaConteudo()
        else {
          this.tipoRankSel = this.tiposRanking[0]
          this.atualizaConteudo()
        }
        if(this.tipoRankSel == "Acerto - Percentagem de acerto") this.headers = this.headers_Acerto
        else this.headers = this.headers_NTRC
      },
      atualizaConteudoTodas: async function(){
        this.loading = true
        var aux = this.tipoRankSel.split(" - ")
        var response = await axios.get(hostApps + "turmas/" + this.turmaSel + "/ranking/" + aux[0]
                                            + "/?anoletivo=" + this.anoLetivo + "&escola=" + this.escola
                                            + "&codProf=" + this.codProf + "&token=" + this.token)
            
        this.items = response.data
        this.loading = false
      },
      atualizaConteudoTema: async function(appInfo){
        this.loading = true
        var aux = this.tipoRankSel.split(" - ")
        var response = await axios.get(hostApps + "turmas/" + this.turmaSel + "/ranking/" + aux[0]
                                            + "/?anoletivo=" + this.anoLetivo + "&escola=" + this.escola
                                            + "&codProf=" + this.codProf + "&codtema=" + appInfo.codtema +
                                            "&token=" + this.token)
                        
        this.items = response.data
        this.loading = false
      },
      atualizaConteudoSubTema: async function(appInfo){
        this.loading = true
        var aux = this.tipoRankSel.split(" - ")
        var response = await axios.get(hostApps + "turmas/" + this.turmaSel + "/ranking/" + aux[0]
                                            + "/?anoletivo=" + this.anoLetivo + "&escola=" + this.escola
                                            + "&codProf=" + this.codProf + "&codtema=" + appInfo.codtema +
                                            "&codsubtema=" + appInfo.codsubtema + "&token=" + this.token)
                        
        this.items = response.data
        this.loading = false
      },
      atualizaConteudo: async function(){
            if(this.app != "" && this.anoLetivo && this.turmaSel != "" && this.tipoRankSel != ""
                && this.app && this.anoLetivo && this.turmaSel && this.tipoRankSel){
                if(this.app == "Todas"){
                  // apps todas
                  this.atualizaConteudoTodas()
                }
                else{
                    // Fazer para uma app em particular
                    var appInfo = this.appsInfo.find(element => element.tema == this.app)
                    if(appInfo){
                        // é um dos temas
                        this.atualizaConteudoTema(appInfo)
                    }
                    else{
                        // é um subtema
                        appInfo = this.appsInfo.find(element => element.subtema == this.app)
                        if(appInfo){
                            this.atualizaConteudoSubTema(appInfo)
                        }
                    }
                }
          } 
      },
      exportPDF: async function(){
        var doc = new jsPDF({
        })
        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = this.app + "-Ranking-" + this.turmaSel + ".pdf"
        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text("Professor: " + this.nomeProf, 15, 50)
        doc.text("Critério: " + this.tipoRankSel, 15, 60)
        doc.text("App: " + this.app, 130, 60)
        doc.text("Turma: " + this.turmaSel, 130, 50)
        var listaRes = []
        var headers = []
        if(this.tipoRankSel == "Acerto - Percentagem de acerto") headers = [['N.º', 'Nome', 'Posição (Turma)', "Posição (Agr. Escolas)", "Posição (Hypatia)", "Acerto (%)", "NTRC"]]
        else headers = [['N.º', 'Nome', 'Posição (Turma)', "Posição (Agr. Escolas)", "Posição (Hypatia)", "NTRC", "Acerto (%)"]]
        ytotal += 70

        for(var i = 0; i<this.items.length; i++){
            var aux = [];
            aux.push(this.items[i].numero)
            aux.push(this.items[i].nome)
            aux.push(this.items[i].posTurma)
            aux.push(this.items[i].posEscola)
            aux.push(this.items[i].posHypatia)
            aux.push(this.items[i].total)
            aux.push(this.items[i].params)
            listaRes.push(aux)
        }

        doc.autoTable({
            head: headers,
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin:{top: ytotal, bottom: 34},
            didDrawPage: function (data) {
                    data.settings.margin.top = 10;
                    ytotal = doc.internal.pageSize.getHeight()
                    doc.setFontSize(8)
                    //doc.setFontType('bold'

                    doc.text("Legenda:" , 10, ytotal -30)
                    doc.text("N.º - Número do Aluno", 10, ytotal-26)
                    doc.text("Posição (Turma) - Posição do aluno na Turma", 10, ytotal-22)
                    doc.text("Posição (Agr. Escolas) - Posição do aluno no Agrupamento de Escolas", 10, ytotal-18)
                    doc.text("Posição (Hypatia) - Posição do aluno em todo o Hypatiamat", 10, ytotal-14)
                    doc.text("NTRC - Nº de tarefas resolvidas corretamente", 10, ytotal-10)
                    doc.text("Acerto (%) - Perecentagem de acerto do aluno", 10, ytotal-6)
                },
        })

        doc.save(pdfName)
       
      },
    }
  }
</script>