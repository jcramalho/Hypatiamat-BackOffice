<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card>
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
          <center><v-icon large color="#009263" @click="alteraTurma" > mdi-arrow-right-box </v-icon></center>
          <br>
          <center><v-icon large color="#009263" @click="alteraTurma2"> mdi-arrow-left-box </v-icon></center>
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




          <center><v-btn class="white--text" style="background-color: #009263;" @click="editarProfessor()"> Confirmar Alterações </v-btn></center>
        
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
        turma2:""
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.id = this.$route.params.id
        var response = await axios.get(h + "turmas/" + this.id + "?token=" + this.token)
        this.turma = response.data
        response = await axios.get(h + "turmas/" + this.turma.turma + "/alunos?token=" + this.token)
        this.alunosTurmaAtual = response.data
        response = await axios.get(h + "turmas?token=" + this.token)
        var i = 0
        for(i = 0; i < response.data.length; i++){
          if(response.data[i].turma != this.turma.turma) this.turmas.push(response.data[i].turma)
        }
    },
    methods: {
      verTurmas : async function(id){
          var response = await axios.get(h + "professores/" + this.professor.codigo + "/turmas?token=" + this.token)
          this.turmas = response.data
          this.dialogTurmas = true
      },
      editarTurma : async function(turma){
        var id = turma.id
        this.$router.push({name: "Editar Turma", params: { id : id } })
      },
      editarProfessor : function(){
          axios.put(h + "professores/" + this.id + "?token=" + this.token, this.professor)
               .then(dados => {
                 alert("Dados alterados com sucesso!")
               })
               .catch(error => alert("Não foi possível guardar as alterações."))
      },
      onTurmaChange: async function(item){
         this.turma2 = item
         let response = await axios.get(h + "turmas/" + item + "/alunos?token=" + this.token)
         this.alunosOutraTurma = response.data
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