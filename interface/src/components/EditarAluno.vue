<template>
  <v-container>
    <v-card class="justify-center">
        <v-container class="justify-center">
            <v-card-title primary-title class="justify-center green--text">
                Editar Aluno ({{aluno.user}})
            </v-card-title>
                     
          <v-text-field prepend-icon="mdi-numeric-1-box-multiple-outline" label="Número" placeholder="Número" v-model="aluno.numero" color="#009263" type="number" :rules="[number]" required/>           
          <v-text-field prepend-icon="mdi-account" label="Nome" placeholder="Nome" v-model="aluno.nome" color="#009263" required/>
          <v-text-field prepend-icon="mdi-calendar" label="Data de Nascimento" placeholder="Data de Nascimento" v-model="aluno.datanascimento" type="date" color="#009263" required/>
          <v-text-field prepend-icon="mdi-email" label="Email" placeholder="Email" v-model="aluno.email" color="#009263" required/>
          <v-text-field prepend-icon="mdi-account-check" label="Confirmação (0 ou 1)" placeholder="Confirmação (0 ou 1) " v-model="aluno.confirmacao" :rules="[number0or1]" color="#009263" required/>

          <center><v-btn class="white--text" style="background-color: #009263;" @click="dialogPassword = true"> Alterar password </v-btn></center>
          <br>
          <center><v-btn class="white--text" style="background-color: #009263;" @click="editarAluno()"> Confirmar Alterações </v-btn></center>
          
           <v-dialog
            v-model="dialogPassword"
            width="75%"
            >
                <v-card class="pa-5">
                  <v-card-title primary-title class="justify-center green--text">
                  Alterar Password
                  </v-card-title>
                  <v-text-field label="Password Nova" placeholder="Password nova" v-model="password1" color="#009263" type="password" required />
                  <v-text-field label="Confirmação Password" placeholder="Confirmação Password" v-model="password2" color="#009263" type="password" required />
                  <v-btn class="white--text" primary large block style="background-color: #009263;" @click="editarPassword()">Confirmar alteração</v-btn>
                </v-card>
          </v-dialog>

        </v-container>
    </v-card>
  </v-container>
</template>



<script>
import axios from "axios"
import Swal from 'sweetalert2'
const h = require("@/config/hosts").hostAPI

  export default {
    data(){
      return {
        token: "",
        aluno: {},
        id : 0,
        dialogPassword: false,
        password1:"",
        password2:"",
        filtrar:"",
        number0or1: v  => {
          if (!isNaN(parseInt(v)) && (v == 0 || v == 1)) return true;
          return 'Tem que ser 0 ou 1';
        },
        number: v  => {
          if (!isNaN(parseInt(v))) return true;
          return 'Tem que ser um inteiro';
        } 

      }
    },
    props:["idProp"],
    created: async function(){
        this.token = localStorage.getItem("token")
        // caso seja passado o id por prpo
        this.id = this.idProp
        var response = await axios.get(h + "alunos/" + this.id + "?token=" + this.token)
        this.aluno = response.data
        var aux = this.aluno.datanascimento.split("/")
        if(aux.length > 0){
          this.aluno.datanascimento = aux[2] + "-" + aux[1] + "-" + aux[0]
        }
    },
    methods: {
      editarAluno : function(){
        var formatada = this.aluno.datanascimento
        var data = this.aluno.datanascimento.split("-")
        if(data.length == 3){
          this.aluno.datanascimento = data[2] + "/" + data[1] + "/" + data[0]
          axios.put(h + "alunos/" + this.id + "?token=" + this.token, this.aluno)
               .then(dados => {
                 Swal.fire({
                  icon: 'success',
                  text: "Dados alterados com sucesso!",
                  confirmButtonColor: '#009263'
                })
                 this.aluno.datanascimento = formatada
                 this.$emit("alteracao")
               })
               .catch(error => Swal.fire({
                  icon: 'error',
                  text: "Não foi possível guardar as alterações.",
                  confirmButtonColor: '#009263'
                })) 
        }
        else{
          Swal.fire({
                  icon: 'error',
                  text: "Data de Nascimento mal preenchida.",
                  confirmButtonColor: '#009263'
                })
        }
      },
      editarPassword : async function(){
          if(this.password1 != "" && this.password2 != ""){
            if(this.password1 == this.password2){
              Swal.fire({
                title: 'De certeza que deseja alterar a password deste aluno?',
                showDenyButton: true,
                confirmButtonColor: '#009263',
                confirmButtonText: `Sim`,
                denyButtonText: `Não`,
              }).then(async (result) => {
                    if (result.isConfirmed) {
                      await axios.put(h + "alunos/" + this.aluno.id + "/password/?token="+this.token, {password: this.password1})
                              .then(() => {
                                Swal.fire({
                                    icon: 'success',
                                    text: "Password alterada com sucesso.",
                                    confirmButtonColor: '#009263'
                                  })
                              })
                              .catch(() => {
                                Swal.fire({
                                  icon: 'error',
                                  text: "Não foi possível guardar a nova password.",
                                  confirmButtonColor: '#009263'
                                })
                              })
                      this.dialogPassword = false
                    }
                  })
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