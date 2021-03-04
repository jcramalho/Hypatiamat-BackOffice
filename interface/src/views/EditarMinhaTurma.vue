<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Transferência de Alunos ({{turma.turma}})
            </v-card-title>
                     
           <v-layout row class="text-xs-center pa-lg-16" justify-center align-center >
      <v-flex xs5>
        <v-card class="pa-4">
            <v-card-title primary-title class="justify-center">
                Alunos da Turma {{turma.turma}}
            </v-card-title>
             <v-text-field
                v-model="filtrar"
                label="Filtrar"
                prepend-icon="mdi-magnify"
                color="#009263"
                single-line
                ></v-text-field>
                <v-data-table
                class="elevation-1"
                v-model="selected"
                :single-select="false"
                show-select
                :headers="header_alunos"
                :items="alunosTurmaAtual"
                :footer-props="footer_props"
                :search="filtrar"
                >
                </v-data-table>
        </v-card>
      </v-flex>
      <v-flex xs1>
        <v-container v-if="turmaSel.length != 0">
          <center>
            <v-tooltip v-if="this.selected.length>0 && this.anoLetivoTurma1 <= this.anoLetivoTurma2" top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs" 
                  v-on="on"
                >
                <v-icon large color="#009263" @click="alteraTurma"> mdi-arrow-right-box </v-icon>
                </v-btn>
              </template>
              <span>Irá transferir os alunos selecionados da turma {{turma.turma}} para a {{turma2}}</span>
            </v-tooltip>
            </center>
          <br>
          <center>
            <v-tooltip v-if="this.selected2.length>0 && this.anoLetivoTurma2 <= this.anoLetivoTurma1" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs" 
                  v-on="on"
                >
                <v-icon  large color="#009263" @click="alteraTurma2"> mdi-arrow-left-box </v-icon>
                </v-btn>
              </template>
              <span>Irá transferir os alunos selecionados da turma {{turma2}} para a {{turma.turma}}</span>
            </v-tooltip>
          </center>
        </v-container>
      </v-flex>
      <v-flex xs5>
        <v-card class="pa-4">
        <v-card-title primary-title class="justify-center">
                Alunos da Turma  <v-spacer/>  <v-combobox
                id="turma"
                v-model="turmaSel"
                :items="turmas"
                @change="onTurmaChange"
            ></v-combobox>
            </v-card-title>
            <v-text-field
                v-model="filtrar2"
                label="Filtrar"
                prepend-icon="mdi-magnify"
                color="#009263"
                single-line
                ></v-text-field>
                <v-data-table
                class="elevation-1"
                v-model="selected2"
                :single-select="false"
                show-select
                :headers="header_alunos"
                :items="alunosOutraTurma"
                :footer-props="footer_props"
                :search="filtrar2"
                >
                </v-data-table>
        </v-card>        
      </v-flex>
    </v-layout>


        
        </v-container>
    </v-card>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI
const anoLetivoAtual = require("@/config/hosts").anoAtual

  export default {
    data(){
      return {
        selected:[],
        selected2:[],
        turmaSel:"",
        turmas: [],
        alunosTurmaAtual: [],
        alunosOutraTurma: [],
        dialogTransferencia: false,
        header_alunos: [
            {text: "Numero", sortable: true, value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'}
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [30, 50, -1],
        },
        token: "",
        turma: {},
        id : 0,
        filtrar:"",
        filtrar2:"",
        turma2:"",
        minhaTurma: false,
        utilizador:{},
        anoLetivoTurma2:"21",
        anoAtual: parseInt(anoLetivoAtual),
        anoLetivoTurma1:"21",
        
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.id = this.$route.params.id
        var response = await axios.get(h + "turmas/" + this.id + "?token=" + this.token)
        this.turma = response.data
        this.anoLetivoTurma1 = parseInt(this.turma.turma.split("-")[1])
        response = await axios.get(h + "turmas/" + this.turma.turma + "/alunos?codprofessor="+ this.turma.idprofessor + "&token=" + this.token)
        this.alunosTurmaAtual = response.data
        response = await axios.get(h + "professores/" + this.utilizador.codigo + "/turmas?token=" + this.token)
        var i = 0
        for(i = 0; i < response.data.length; i++){
          if(response.data[i].turma != this.turma.turma) this.turmas.push(response.data[i].turma)
        }
    },
    methods: {
      onTurmaChange: async function(item){
        if(item != null){
         this.turma2 = item
         this.anoLetivoTurma2 = parseInt(this.turma2.split("-")[1])
         let response = await axios.get(h + "turmas/" + this.turma2 + "/alunos?codprofessor="+ this.utilizador.codigo + "&token=" + this.token)
         this.alunosOutraTurma = response.data
        }
      }, 
      alteraTurma: async function(){
          var body = {
                codprofessor: this.utilizador.codigo, 
                turmaOld: this.turma.turma,
                alunos: this.selected
          }
          await axios.put(h + "alunos/turmas/" + this.turma2 + "?token=" + this.token, body)
          this.selected = []
          this.atualizaAlunos()
      },
      alteraTurma2: async function(){
        var body = {
              codprofessor: this.utilizador.codigo, 
              turmaOld: this.turma2,
              alunos: this.selected2
        }
        await axios.put(h + "alunos/turmas/" + this.turma.turma + "?token=" + this.token, body)
        this.selected2 = []
        this.atualizaAlunos()
      },
      atualizaAlunos: async function(){
        var response = await axios.get(h + "turmas/" + this.turma.turma + "/alunos?codprofessor="+ this.turma.idprofessor + "&token=" + this.token)
        this.alunosTurmaAtual = response.data
        response = await axios.get(h + "turmas/" + this.turma2 + "/alunos?codprofessor="+ this.utilizador.codigo + "&token=" + this.token)
        this.alunosOutraTurma = response.data
      }
    }
  }
</script>

<style scoped>
.transparent {
   background-color: white!important;
   opacity: 0.65;
   border-color: transparent!important;
 }
</style>