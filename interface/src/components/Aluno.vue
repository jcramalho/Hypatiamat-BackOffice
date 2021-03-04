<template>
    <v-card class="elevation-5 pa-5" background-color="gray" rounded>
      <v-container>
            <!-- Aluno !-->
            
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
              <v-card-title primary-title class="justify-center green--text">
                  Dados da minha conta ({{aluno.user}})
              </v-card-title>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
              <center>
                <v-list-item-avatar class="elevation-6" color="#009263" size="120">
                      <v-icon size="80" color="white">mdi-account</v-icon>             
                </v-list-item-avatar>
              </center>
            </v-col>
          <v-row class="mx-auto">
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
              <v-text-field label="Nome" v-model="aluno.nome" color="#009263" outlined disabled/>
            </v-col>
            <v-col v-if="xl" cols="2" xl="2">
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
              <v-text-field label="Agrupamento" v-model="aluno.agrupamento" color="#009263" outlined disabled/>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
              <v-text-field label="Tipo de Utilizador" v-model="aluno.nomeType" color="#009263" outlined disabled/>
            </v-col>
            <v-col v-if="xl" cols="2" xl="2">
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
              <v-text-field label="Email"  v-model="aluno.email" color="#009263" outlined disabled/>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
              <v-text-field label="Data de Nascimento" v-model="aluno.datanascimento" color="#009263" outlined disabled/>
            </v-col>
            <v-col v-if="xl" cols="2" xl="2">
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
              <v-text-field label="Turma"  v-model="aluno.turma" color="#009263" outlined disabled/>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
              <v-text-field label="Professor do Aluno" v-model="aluno.codprofessor" color="#009263" outlined disabled/>
            </v-col>
            <v-col v-if="xl" cols="2" xl="2">
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
              <v-text-field label="País"  v-model="aluno.pais" color="#009263" outlined disabled/>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
              <center><v-btn class="white--text" style="background-color: #009263;" @click="editarAluno()"> Editar dados pessoais </v-btn></center>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
              <center><v-btn class="white--text" style="background-color: #009263;" @click="dialogPassword = true"> Alterar password </v-btn></center>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
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
    </v-card>
</template>

<script>
import axios from "axios"
import Swal from 'sweetalert2'
const h = require("@/config/hosts").hostAPI

  export default {
    components:{

    },
    data(){
      return {
        turmas: [],
        dialogTurmas: false,
        dialogPassword: false,
        aluno: {},
        password1: "",
        password2: "",
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
        id : 0,
        type: 0,
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
        var aluno = JSON.parse(localStorage.getItem("utilizador"))
        var response = await axios.get(h + "alunos/" + aluno.id + "?token=" + this.token)
        this.aluno = response.data
        this.aluno.nomeType = "Aluno"
    },
    computed: {
      xl() {
        if (this.$vuetify.breakpoint.xl) return true
        return false
      },
    },
    methods: {
      editarAluno : function(){
          this.$router.push({name: "Editar Aluno", params: {id : this.professor.id}})
      },
      editarPassword : async function(){
          if(this.password1 != "" && this.password2 != ""){
            if(this.password1 == this.password2){
              if(confirm("Tem a certeza que pretende alterar a sua password?")){
                axios.put(h + "alunos/" + this.aluno.id + "/password", {password: this.password1})
                     .then(() => {
                       Swal.fire({
                          icon: 'error',
                          text: "As palavra passe de confirmação não coincide com a palavra passe primeiramente definida!",
                          confirmButtonColor: '#009263'
                        })
                        this.dialogPassword = false
                     })
                     .catch(erro => console.log(erro))
              }
            }
            else{
              this.password2 = ""
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