<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-container>
        <v-card class="pa-5">
            <v-card-title primary-title class="justify-center green--text">
                Ranking dos Alunos (Jogos)
            </v-card-title>
            <br v-if="items.length > 0">
            <center>
                <v-btn v-if="items.length>0" class="white--text" style="background-color: #009263;" @click="exportPDF()">
                <v-icon> mdi-pdf-box </v-icon> Exportar 
                </v-btn>
            </center>
            <v-container>
              <v-card class="pa-3">
                    <v-combobox
                    v-if="professores.length > 0"
                    id="professor"
                    label="Professor"
                    color="green"
                    v-model="idprofessor"
                    :items="professores"
                    @change="getTurmas()"
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
            </v-card>
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
              <div id="tableResultados">          
                <v-data-table
                class="elevation-4"
                :headers="headersJogo"
                :items="items"
                :footer-props="footer_props"
                :search="filtrar"
                >
                </v-data-table>
              </div>
          </v-container>
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
const h = require("@/config/hosts").hostAPI
const hostJogos = require("@/config/hosts").hostJogos
const hypatiaImg = require("@/assets/hypatiamat.png")
const anosletivos2 = require("@/config/confs").anosletivos2
const anoletivoAtual = require("@/config/confs").anoletivo2

  export default {
    data(){
      return {
        token: "",
        utilizador: {},
        anosLetivos: anosletivos2,
        anoLetivo: anoletivoAtual,
        jogo:"",
        jogos:[],
        jogosInfo:[],
        loadingJogos: false,
        idprofessor: "",
        turmaSel:"",
        turmas: [],
        items:[],
        headersJogo:[
            {text: "Nº", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Posição (Turma)", value: 'posTurma', class: 'subtitle-1'},
            {text: "Posição (Agr. Escolas)", value: 'posEscola', class: 'subtitle-1'},
            {text: "Posição (Hypatia)", value: 'posHypatia', class: 'subtitle-1'},
            {text: "Pontos", value: 'total', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [30, 50, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        loading:false,
        tiposCalcRapid:["1 - Adição", "2 - Subtração", "3 - Multiplicação", "4 - Divisão"],
        tiposCalc:["1 - Adição", "2 - Subtração", "3 - Multiplicação", "4 - Divisão"],
        niveisCalculus:["1","2","3","4","5"],
        tiposCalculus:["0 - Todas as combinações", "1 – Adição", "2 – Subtração", "3 - Multiplicação", "4 - Divisão"],
        niveisSel:["1","2","3","4","5"],
        tiposCalculusSel:["0 - Todas as combinações"],
        tiposCalculusSelAnterior:["0 - Todas as combinações"],
        professores: [],
        escola: "",
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        //this.agrupamentos = await this.getAgrupamentos()
        this.escolaIdOriginal = this.escola = this.utilizador.escola
        this.getProfessores()
        
    },
    methods: {
      getProfessores: async function(item){
          this.turmaSel = ""
          this.jogo = ""
          this.jogos = []
          var responseProfs = await axios.get(h + "escolas/" + this.escola + "/professores/?token=" + this.token)
          var aux = []
          for(var i = 0; i < responseProfs.data.length; i++){
            aux.push(responseProfs.data[i].codigo)
          }
          this.professores = aux
      },
      getTurmas: async function(){
          if(this.idprofessor && this.idprofessor != ""){
            this.turmaSel = ""
            var responseTurmas = await axios.get(h + "professores/" + this.idprofessor + "/turmas?token=" + this.token)
            var i = 0
            var aux = []
            for(i = 0; i < responseTurmas.data.length; i++){
                aux.push(responseTurmas.data[i].turma)
            }
            this.turmas = aux
          }
      },
      onTurmaChange: async function(item){
          if(this.turmaSel != "" && this.turmaSel && this.anoLetivo){
            this.loadingJogos = true
            this.escolaId = this.escolaIdOriginal
            var responseAlunos = await axios.get(h + "turmas/" + this.turmaSel + 
                                                    "/alunos?codprofessor=" + this.idprofessor
                                                    + "&token=" + this.token)

            var escolas = []
            for(var i = 0; i < responseAlunos.data.length; i++){
                  var auxEscola = escolas.find(a => a.escola == responseAlunos.data[i].escola)
                  if(auxEscola) auxEscola.numero++;
                  else escolas.push({escola: responseAlunos.data[i].escola, numero:1})
              }
            if(escolas.length > 1){
                var res = Math.max.apply(Math, escolas.map(function(o){return o.numero;}))
                var escolaAux = escolas.find(function(o){ return o.numero == res; })
                if(escolaAux && escolaAux.escola != this.escolaId) this.escolaId = escolaAux.escola;
            }
            var aux = this.anoLetivo.split("/")
            var dataInicio = aux[0] + "-09-01"  
            var dataFim = aux[1] + "-09-01"                                          
            var response2 = await axios.get(h + "turmas/" + this.turmaSel + "/jogos?escola=" 
                                                + this.escolaId + "&dataInicio=" + dataInicio 
                                                + "&dataFim=" + dataFim + "&codprofessor=" + this.idprofessor + "&token=" + this.token)
            this.jogosInfo = response2.data
            this.jogos = []
            this.items = []
            this.jogo = ""
            for(var i = 0; i < this.jogosInfo.length; i++){
                this.jogos.push(this.jogosInfo[i].jogo)
            }
            this.loadingJogos = false
            //this.atualizaConteudo()
          }
      },
      onAnoChange: async function(){
        if(this.anoLetivo && this.anoLetivo != ""){
          this.onTurmaChange()
        }
      },
      onJogoChange: async function(item){
          if(this.jogos.find(element => element == this.jogo)){
              this.atualizaConteudo()
          }
      },
      onNivelChange: async function(item){
          if(this.tiposCalculusSel.find(e => e == "0 - Todas as combinações")){
              if(this.niveisSel.length < this.niveisCalculus.length){
                  if(this.niveisSel.length > 0){
                      this.atualizaMinuteNewNiveis()
                  }
              }
              else{
                  this.atualizaMinuteNew()
              }
          }
          else{
              if(this.niveisSel.length < this.niveisCalculus.length){
                  if(this.niveisSel.length > 0){
                      this.atualizaMinuteNewTiposNiveis()
                  }
              }
              else{
                  this.atualizaMinuteNewTipos()
              }
          }
      },
      onTipoCalculusChange: async function(item){
          var todos = this.tiposCalculusSel.find(e => e == "0 - Todas as combinações")
          if(todos && !this.tiposCalculusSelAnterior.find(e => e == "0 - Todas as combinações")){
                this.tiposCalculusSel = ["0 - Todas as combinações"]
                    if(this.niveisSel.length < this.niveisCalculus.length){
                        this.atualizaMinuteNewNiveis()
                    }
                    else{
                        this.atualizaMinuteNew()
                    }       
        }
        else{
            if(todos){
                var index = this.tiposCalculusSel.indexOf(todos)
                this.tiposCalculusSel.splice(index, index+1)
            }
            if(this.niveisSel.length < this.niveisCalculus.length){
                this.atualizaMinuteNewTiposNiveis()
            }
            else{
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
      atualizaMinuteNew: async function(){
          this.loading = true
          var response = await axios.get(hostJogos + "minutenew/turmas/" + this.turmaSel + "/ranking"
                                                    + "?anoletivo=" + this.anoLetivo
                                                    + "&codprofessor=" + this.idprofessor 
                                                    + "&escola=" + this.escolaId + "&token=" + this.token)
          this.items = response.data
          this.loading = false
          return true
      },
      atualizaMinuteNewTipos: async function(){
          this.loading = true
          var tipos = await this.parseTiposCalculus()
          var response = await axios.get(hostJogos + "minutenew/turmas/" + this.turmaSel + "/ranking"
                                                    + "?anoletivo=" + this.anoLetivo
                                                    + "&codprofessor=" + this.idprofessor 
                                                    + "&tipos=" + tipos + "&escola=" + this.escolaId +"&token=" + this.token)
          this.items = response.data
          this.loading = false
          return true
      },
      atualizaMinuteNewNiveis: async function(){
          this.loading = true
          var response = await axios.get(hostJogos + "minutenew/turmas/" + this.turmaSel + "/ranking"
                                                    + "?anoletivo=" + this.anoLetivo
                                                    + "&codprofessor=" + this.idprofessor 
                                                    + "&niveis=" + this.niveisSel + "&escola=" + this.escolaid +"&token=" + this.token)
          this.items = response.data
          this.loading = false
          return true
      },
      atualizaMinuteNewTiposNiveis: async function(){
          this.loading = true
          var tipos = await this.parseTiposCalculus()
          var response = await axios.get(hostJogos + "minutenew/turmas/" + this.turmaSel + "/ranking"
                                                    + "?anoletivo=" + this.anoLetivo + "&escola=" + this.escolaId
                                                    + "&codprofessor=" + this.idprofessor 
                                                    +  "&niveis=" + this.niveisSel + "&tipos=" + tipos + "&token=" + this.token)
          this.items = response.data
          this.loading = false
          return true
      },
      atualizaCalcRapid: async function(){
          //this.header_alunos = this.headers_calcrapid
          this.loading = true
          if(this.tiposCalc.length < this.tiposCalcRapid.length && this.tiposCalc.length > 0){
              var tipos = await this.parseTiposCalcRapid()
              var response = await axios.get(hostJogos + "calcrapid/turmas/" + this.turmaSel + "/ranking"
                                                    + "?anoletivo=" + this.anoLetivo
                                                    + "&escola=" + this.escolaId + "&codprofessor=" + this.idprofessor + 
                                                    "&tipo="+ tipos + "&token=" + this.token)
              this.items = response.data
          }
          else{
            var response = await axios.get(hostJogos + "calcrapid/turmas/" + this.turmaSel + "/ranking"
                                                    + "?anoletivo=" + this.anoLetivo
                                                    + "&escola=" + this.escolaId + "&codprofessor=" + this.idprofessor + 
                                                    "&token=" + this.token)
            this.items = response.data
          }
          this.loading = false
          return true
      },
      atualizaConteudo: async function(){
          if(this.jogo && this.jogo != "" && this.dataFim != "" && this.dataInicio != "" && this.turmaSel != "" ){
              this.loading = true
              if(this.jogo == "Calcrapid") this.atualizaCalcRapid()
              else if(this.jogo == "Calculus") this.onNivelChange()
              else{
                var aux = this.jogosInfo.find(element => element.jogo == this.jogo)
                if(aux){
                    ///this.header_alunos = this.headersJogo
          
                    var jogoTipo = aux.tipo
                    var jogoTable = aux.jogotable
                    var idescola = this.escolaId
                    // :jogo/turmas/:turma/ranking
                    var response = await axios.get(hostJogos + jogoTable + "/turmas/" + this.turmaSel + "/ranking/" 
                                                        + "?anoletivo=" + this.anoLetivo
                                                        + "&jogoTipo=" + jogoTipo + "&escola=" + idescola
                                                        + "&codprofessor=" + this.idprofessor
                                                        + "&token=" + this.token)
                    this.items = response.data
                }
                else this.loading=false
              }
              this.loading = false
          } 
      },
      exportPDF: async function(){
        var doc = new jsPDF({
        })
        var aux = this.jogosInfo.find(element => element.jogo == this.jogo)
        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = aux.jogo + "-Ranking-" + this.turmaSel + ".pdf"
        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text("Professor: " + this.idprofessor, 15, 50)
        doc.text("Turma: " + this.turmaSel, 15, 60)
        doc.text("Jogo: " + aux.jogo, 130, 50)
        var listaRes = []
        var headers = [['N.º', 'Nome', 'Posição (Turma)', "Posição (Agr. Escolas)", "Posição (Hypatia)", "Pontos"]]
        ytotal += 70

        for(var i = 0; i<this.items.length; i++){
            var aux = [];
            aux.push(this.items[i].numero)
            aux.push(this.items[i].nome)
            aux.push(this.items[i].posTurma)
            aux.push(this.items[i].posEscola)
            aux.push(this.items[i].posHypatia)
            aux.push(this.items[i].total)
            listaRes.push(aux)
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

                    doc.text("Legenda:" , 10, ytotal -26)
                    doc.text("N.º - Número do Aluno", 10, ytotal-22)
                    doc.text("Posição (Turma) - Posição do aluno na Turma", 10, ytotal-18)
                    doc.text("Posição (Agr. Escolas) - Posição do aluno no Agrupamento de Escolas", 10, ytotal-14)
                    doc.text("Posição (Hypatia) - Posição do aluno em todo o Hypatiamat", 10, ytotal-10)
                    doc.text("Pontos - Máximo de pontos obtidos pelo aluno ", 10, ytotal-6)

                },
        })

        doc.save(pdfName)
       
      },
    }
  }
</script>