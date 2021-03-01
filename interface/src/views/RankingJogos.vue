<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-container>
        <v-card class="pa-5">
            <v-card-title primary-title class="justify-center green--text">
                Ranking dos Alunos das suas turmas (Jogos)
            </v-card-title>
            <v-container>
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
                  <!--
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
                  -->
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
        escola:"", 
        escolaOriginal: "",
        idprofessor: "",
        turmaSel:"",
        turmas: [],
        items:[],
        headersJogo:[
            {text: "Nº", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Posição (Turma)", value: 'posTurma', class: 'subtitle-1'},
            {text: "Posição (Escola)", value: 'posEscola', class: 'subtitle-1'},
            {text: "Posição (Hypatia)", value: 'posHypatia', class: 'subtitle-1'},
            {text: "#Pontos", value: 'total', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [30, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        loading:false
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        if(this.utilizador.type != 20){
          var response2 = await axios.get(h + "professores/codigos/" + this.idprofessor + "/?token=" + this.token )
          this.escola = response2.data.escola
          this.escolaOriginal = response2.data.escola
        }
        else {
          this.idprofessor = this.utilizador.codigo
          this.escola = this.escolaOriginal = this.utilizador.escola
        }
        var response = await axios.get(h + "professores/" + this.idprofessor + "/turmas?token=" + this.token)
        var i = 0
        for(i = 0; i < response.data.length; i++){
          this.turmas.push(response.data[i].turma)
        }
    },
    methods: {
      onTurmaChange: async function(item){
          if(this.turmaSel != "" && this.turmaSel && this.anoLetivo){
            this.loadingJogos = true
            this.escola = this.escolaOriginal
            console.log(this.escola)
            var responseAlunos = await axios.get(h + "turmas/" + this.turmaSel + 
                                                    "/alunos?codprofessor=" + this.idprofessor
                                                    + "&token=" + this.token)

            var escolas = []
            console.log(responseAlunos.data)
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
                console.log(escolaAux.escola)
                if(escolaAux && escolaAux.escola != this.escola) this.escola = escolaAux.escola;
            }
            var aux = this.anoLetivo.split("/")
            var dataInicio = aux[0] + "-09-01"  
            var dataFim = aux[1] + "-09-01"                                          
            var response2 = await axios.get(h + "turmas/" + this.turmaSel + "/jogos?escola=" 
                                                + this.escola + "&dataInicio=" + dataInicio 
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
      atualizaConteudo: async function(){
          if(this.jogo && this.jogo != "" && this.dataFim != "" && this.dataInicio != "" && this.turmaSel != "" ){
              this.loading = true
              if(this.jogo == "Calcrapid") alert("Não disponível")
              else if(this.jogo == "Calculus") alert("Não disponível")
              else{
                var aux = this.jogosInfo.find(element => element.jogo == this.jogo)
                if(aux){
                    ///this.header_alunos = this.headersJogo
          
                    var jogoTipo = aux.tipo
                    var jogoTable = aux.jogotable
                    var idescola = this.escola
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
    }
  }
</script>