<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card>
        <v-container style="width:50%;">
            <v-card-title primary-title class="justify-center green--text">
                Editar Aluno ({{aluno.user}})
            </v-card-title>
                     
          <v-text-field label="Número" placeholder="Número" v-model="aluno.numero" color="#900000" :rules="[number]" required/>           
          <v-text-field label="Nome" placeholder="Nome" v-model="aluno.nome" color="#900000" required/>
          <v-text-field label="Data de Nascimento (YYYY-MM-DD)" placeholder="Data de Nascimento (YYYY-MM-DD)" v-model="aluno.datanascimento" color="#900000" required/>
          <v-text-field label="Email" placeholder="Email" v-model="aluno.email" color="#900000" required/>
          <v-text-field label="Confirmação (0 ou 1)" placeholder="Confirmação (0 ou 1) " v-model="aluno.confirmacao" :rules="[number0or1]" color="#900000" required/>

          <center><v-btn class="white--text" style="background-color: #009263;" @click="editarAluno()"> Confirmar Alterações </v-btn></center>
        
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
        header_turmas: [
            {text: "Id", sortable: true, value: 'id', class: 'subtitle-1'},
            {text: "Username do professor", value: 'idprofessor', class: 'subtitle-1'},
            {text: "Turma", value: 'turma', class: 'subtitle-1'}
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
        token: "",
        aluno: {},
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
        var response = await axios.get(h + "alunos/" + this.id + "?token=" + this.token)
        this.aluno = response.data
    },
    methods: {
      editarAluno : function(){
          axios.put(h + "alunos/" + this.id + "?token=" + this.token, this.aluno)
               .then(dados => {
                 alert("Dados alterados com sucesso!")
               })
               .catch(error => alert("Não foi possível guardar as alterações."))
      }
    }
  }
</script>