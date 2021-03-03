<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-container>
        <v-card class="pa-5">
            <v-card-title primary-title class="justify-center green--text">
                Ranking dos Alunos das suas turmas (Aplicações de Conteúdo)
            </v-card-title>
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
            "items-per-page-options": [5, 10, 20, -1],
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
          {text: "Posição (Escola)", value: 'posEscola', class: 'subtitle-1'},
          {text: "Posição (Hypatia)", value: 'posHypatia', class: 'subtitle-1'},
          {text: "NTRC", value: 'total', class: 'subtitle-1'},
        ],
        headers_NTRC:[
          {text: "Nº", value: 'numero', class: 'subtitle-1'},
          {text: "Nome", value: 'nome', class: 'subtitle-1'},
          {text: "Posição (Turma)", value: 'posTurma', class: 'subtitle-1'},
          {text: "Posição (Escola)", value: 'posEscola', class: 'subtitle-1'},
          {text: "Posição (Hypatia)", value: 'posHypatia', class: 'subtitle-1'},
          {text: "NTRC", value: 'total', class: 'subtitle-1'},
        ],
        headers_Acerto:[
          {text: "Nº", value: 'numero', class: 'subtitle-1'},
          {text: "Nome", value: 'nome', class: 'subtitle-1'},
          {text: "Posição (Turma)", value: 'posTurma', class: 'subtitle-1'},
          {text: "Posição (Escola)", value: 'posEscola', class: 'subtitle-1'},
          {text: "Posição (Hypatia)", value: 'posHypatia', class: 'subtitle-1'},
          {text: "Acerto (%)", value: 'total', class: 'subtitle-1'},
        ],
        items:[],
        codProf:"",
        turmas:[],
        turmaSel:"",
        app:"",
        escola: "",
        escolaOriginal:"",
        loading: false,
        tipoRankSel: "NTRC - Número de tarefas resolvidas corretamente",
        tiposRanking: ["NTRC - Número de tarefas resolvidas corretamente", "Acerto - Percentagem de acerto"]
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.codProf = this.utilizador.codigo
        var response = await axios.get(hostApps + "temas/?token=" + this.token)
        this.appsInfo = response.data
        await this.parseApps()

        var response = await axios.get(h + "professores/" + this.codProf + "/turmas?token=" + this.token)
        var i = 0
        for(i = 0; i < response.data.length; i++){
          this.turmas.push(response.data[i].turma)
        }
        this.escola = this.escolaOriginal = this.utilizador.escola        

    },
    methods: {
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
              for(var i = 0; i < responseAlunos.data.length; i++){
                  if(responseAlunos.data[i].escola != this.escola){
                      var auxEscola = escolas.find(a => a.escola == responseAlunos.data[i].escola)
                      if(auxEscola) auxEscola.numero++;
                      else escolas.push({escola: responseAlunos.data[i].escola, numero:1})
                  }
              }
              if(escolas.length > 0){
                  var res = Math.max.apply(Math, escolas.map(function(o){return o.numero;}))
                  var escolaAux = escolas.find(function(o){ return o.numero == res; })
                  if(escolaAux && escolaAux.escola != this.escola) this.escola = escolaAux.escola;
              }
              this.atualizaConteudo()
          }
      },
      onAnoChange: async function(item){
          if(this.anoLetivo != "" && this.anoLetivo){
             this.atualizaConteudo()
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
      }
    }
  }
</script>