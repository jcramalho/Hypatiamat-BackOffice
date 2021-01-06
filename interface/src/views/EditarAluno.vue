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

          <center><v-btn class="white--text" style="background-color: #009263;" @click="dialogPassword = true"> Alterar password </v-btn></center>
          <br>
          <center><v-btn class="white--text" style="background-color: #009263;" @click="editarAluno()"> Confirmar Alterações </v-btn></center>
          
           <v-dialog
            v-model="dialogPassword"
            width="40%"
            >
                <v-card class="pa-5">
                  <v-card-title primary-title class="justify-center green--text">
                  Alterar Password
                  </v-card-title>
                  <v-text-field label="Password Nova" placeholder="Password nova" v-model="password1" color="#900000" type="password" required />
                  <v-text-field label="Confirmação Password" placeholder="Confirmação Password" v-model="password2" color="#900000" type="password" required />
                  <v-btn class="white--text" primary large block style="background-color: #009263;" @click="editarPassword()">Confirmar alteração</v-btn>
                </v-card>
          </v-dialog>

        </v-container>
    </v-card>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
import Swal from 'sweetalert2'
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
        dialogPassword: false,
        password1:"",
        password2:"",
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
                 Swal.fire({
                  icon: 'success',
                  text: "Dados alterados com sucesso!",
                  confirmButtonColor: '#009263'
                })
               })
               .catch(error => Swal.fire({
                  icon: 'error',
                  text: "Não foi possível guardar as alterações.",
                  confirmButtonColor: '#009263'
                })) 
      },
      editarPassword : async function(){
          if(this.password1 != "" && this.password2 != ""){
            if(this.password1 == this.password2){
              if(confirm("Tem a certeza que pretende alterar a sua password?")){
                await axios.put(h + "alunos/" + this.aluno.id + "/password", {password: this.password1})
                this.dialogPassword = false
              }
            }
            else{
              this.password2 = ""
              alert("As palavra passe de confirmação não coincide com a palavra passe primeiramente definida!")
              Swal.fire({
                  icon: 'error',
                  text: "As palavra passe de confirmação não coincide com a palavra passe primeiramente definida!",
                  confirmButtonColor: '#009263'
                })
            }
          }
          else Swal.fire({
                  icon: 'error',
                  text: "Tem de preencher os dois campos!",
                  confirmButtonColor: '#009263'
                })
      },
    }
  }
</script>