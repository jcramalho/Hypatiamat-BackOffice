<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card>
        <v-container style="width:50%;">
            <v-card-title primary-title class="justify-center green--text">
                Editar Professor ({{professor.codigo}})
            </v-card-title>
                     
          <v-text-field label="Nome" placeholder="Nome" v-model="professor.nome" color="#900000" required/>
          <v-text-field label="Identificador da Escola" placeholder="Identifcador da Escola" v-model="professor.escola" color="#900000" required/>
          <v-text-field label="Email" placeholder="Email" v-model="professor.email" color="#900000" required/>
          <v-text-field label="Confirmação (0 ou 1)" placeholder="Confirmação (0 ou 1) " v-model="professor.confirmacao" :rules="[number0or1]" color="#900000" required/>
          <v-text-field label="Premium (0 ou 1)" placeholder="Premium (0 ou 1)" v-model="professor.premium" :rules="[number0or1]" color="#900000" required/>
          <v-text-field label="Validade (YYYY-MM-DD)" placeholder="Validade (YYYY-MM-DD)" v-model="professor.validade" color="#900000" required/>
          <v-text-field label="Número de Sócio" placeholder="Número de Sócio" v-model="professor.socionum" color="#900000" :rules="[number]" required/>
          <v-text-field label="Projeto" placeholder="Projeto" v-model="professor.projeto" color="#900000" :rules="[number]" required/>
          <br>
          <center><v-btn class="white--text" style="background-color: #009263;" @click="verTurmas()"> Ver Turmas </v-btn></center>
          <br>
          <v-dialog
            v-model="dialogTurmas"
            width="40%"
            >
                <v-card class="pa-5">
                <v-text-field
                v-model="filtrar"
                prepend-icon="mdi-magnify"
                color="#009263"
                label="Filtrar"
                single-line
                ></v-text-field>
                <v-data-table
                class="elevation-1"
                :headers="header_turmas"
                :items="turmas"
                :footer-props="footer_props"
                :search="filtrar"
                @click:row="editarTurma"
                >
                </v-data-table>
                </v-card>
            </v-dialog>




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
        turmas: [],
        dialogTurmas: false,
        header_turmas: [
            {text: "Id", sortable: true, value: 'id', class: 'subtitle-1'},
            {text: "Turma", value: 'turma', class: 'subtitle-1'}
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
        token: "",
        professor: {},
        id : 0,
        filtrar:"",
        number0or1: v  => {
          if (!v.trim()) return true;
          if (!isNaN(parseInt(v)) && (v == 0 || v == 1)) return true;
          return 'Tem que ser 0 ou 1';
        },
        number: v  => {
          if (!v.trim()) return true;
          if (!isNaN(parseInt(v))) return true;
          return 'Tem que ser um inteiro';
        } 

      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.id = this.$route.params.id
        var response = await axios.get(h + "professores/" + this.id + "?token=" + this.token)
        this.professor = response.data
        console.log(this.professor)
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
      }
    }
  }
</script>