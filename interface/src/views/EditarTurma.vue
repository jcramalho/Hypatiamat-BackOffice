<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Editar Turma ({{turma.turma}})
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
            <v-tooltip v-if="this.selected.length>0" top>
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
            <v-tooltip v-if="this.selected2.length>0" bottom>
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
        
            <v-combobox
                id="escola"
                label="Agrupamento de Escolas"
                v-model="escola"
                :items="agrupamentos"
                @change="onAgrupamentoChange"
            ></v-combobox>
            <v-combobox
                id="professor"
                label="Professor"
                v-model="idprofessor2"
                :items="professores"
                @change="onProfessorChange"
            ></v-combobox>
            <v-combobox
                id="turma"
                label="Turma"
                v-model="turmaSel"
                :items="turmas"
                @change="onTurmaChange"
            ></v-combobox>
            
            
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
            "items-per-page-options": [5, 10, 20],
        },
        token: "",
        turma: {},
        id : 0,
        filtrar:"",
        filtrar2:"",
        turma2:"",
        codprofessor2:"",
        minhaTurma: false,
        idprofessor: "",
        agrupamentos: [],
        agrupamentosIds: [],
        professores: [],
        escola: "",
        escolaId: "",
        idprofessor2:""
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        let utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.id = this.$route.params.id
        this.idprofessor = this.$route.params.idprofessor
        this.idprofessor2 = this.idprofessor
        var response = await axios.get(h + "turmas/" + this.id + "?token=" + this.token)
        this.turma = response.data
        response = await axios.get(h + "turmas/" + this.turma.turma + "/alunos?codprofessor="+ this.turma.idprofessor + "&token=" + this.token)
        this.alunosTurmaAtual = response.data
        var responseProf = await axios.get(h + "professores/codigos/" + this.idprofessor + "/?token=" + this.token)
        this.escolaId = responseProf.data.escola
        //alert(this.escolaId)
        //alert(responseProf.data.escola)
        this.agrupamentos = await this.getAgrupamentos()
        //alert(JSON.stringify(this.agrupamentosIds))
        //alert(this.agrupamentosIds.find(e => {e.cod == this.escolaId}))
        this.escola = this.agrupamentosIds.find(e => e.cod == this.escolaId).nome
        
        this.getProfessores()
        
        this.getTurmas()
    },
    methods: {
      getAgrupamentos: async function(item){
        var response = await axios.get(h + "escolas/?token=" + this.token)
        this.agrupamentosIds = response.data
        var aux = []
        for(var i = 0; i < this.agrupamentosIds.length; i++){
          console.log(this.agrupamentosIds[i].cod)
          aux.push(this.agrupamentosIds[i].nome)
        }
        return aux
      },
      getProfessores: async function(item){
        if(this.escola != ""){
          var responseProfs = await axios.get(h + "escolas/" + this.escolaId + "/professores/?token=" + this.token)
          var aux = []
          for(var i = 0; i < responseProfs.data.length; i++){
            aux.push(responseProfs.data[i].codigo)
          }
          this.professores = aux
        }
      },
      onTurmaChange: async function(item){
        if(item != null && this.idprofessor2 != ""){
         var aux = item.split(" - ")
         this.turma2 = aux[0]
         let response = await axios.get(h + "turmas/" + this.turma2 + "/alunos?codprofessor="+ this.idprofessor2 + "&token=" + this.token)
         this.alunosOutraTurma = response.data
        }
      }, 
      getTurmas: async function(item){
          var responseTurmas = await axios.get(h + "professores/" + this.idprofessor2 + "/turmas?token=" + this.token)
          var i = 0
          var aux = []
          for(i = 0; i < responseTurmas.data.length; i++){
            if(responseTurmas.data[i].turma != this.turma.turma || this.idprofessor != this.idprofessor2) aux.push(responseTurmas.data[i].turma)
          }
          this.turmas = aux
      },
      onProfessorChange: async function(item){
        if(item != null){
          this.turma2 = ""
          let response = await axios.get(h + "turmas/" + this.turma.turma + "/alunos?codprofessor="+ this.idprofessor2 + "&token=" + this.token)
        }
      },
      alteraTurma: async function(){
        var i = 0
        for(i = 0; i < this.selected.length; i++){
          //var response = await axios.put(h + "alunos/" + this.selected[i].id + "/turma?token=" + this.token, {turma: this.turma2})
        }
        this.selected = []
      },
      alteraTurma2: async function(){
        var i = 0
        for(i = 0; i < this.selected2.length; i++){
          // var response = await axios.put(h + "alunos/" + this.selected2[i].id + "/turma?token=" + this.token, {turma: this.turma.turma})
        }
        this.selected2 = []
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