<template>
    <v-card class="pa-5">
    <v-container>
            <!-- Municipio !-->
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
            <v-card-title primary-title class="justify-center green--text">
                Dados do Municipio ({{professor.codigo}})
            </v-card-title>
        </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
            <center>
           <v-list-item-avatar class="elevation-6" color="#009263" size="120">
                <v-icon size="80" color="white">mdi-city</v-icon>             
           </v-list-item-avatar>
            </center>
          </v-col>
        <v-row class="mx-auto">

          <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
          <v-text-field label="Nome" v-model="professor.nome" color="#009263" outlined disabled/>
          </v-col>
          <v-col v-if="xl" cols="2" xl="2">
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
              <v-text-field label="Tipo de Utilizador" v-model="professor.nomeType" color="#009263" outlined disabled/>
          </v-col>

          <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
              <v-text-field label="Município"  v-model="professor.localidade" color="#009263" outlined disabled/>
          </v-col>
          <v-col v-if="xl" cols="2" xl="2">
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
              <v-text-field label="Email"  v-model="professor.email" color="#009263" outlined disabled/>
          </v-col>

          <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
              <v-text-field label="Nº de Agrupamentos" v-model="professor.escolas.length" color="#009263" outlined disabled/>
          </v-col>
          <v-col v-if="xl" cols="2" xl="2">
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
          <v-text-field label="Validade (YYYY-MM-DD)" v-model="professor.validade" color="#009263" outlined disabled/>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
            <center><v-btn class="white--text" style="background-color: #009263;" @click="editarProfessor()"> Editar dados pessoais </v-btn></center>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
            <center><v-btn class="white--text" style="background-color: #009263;" @click="dialogPassword = true"> Alterar password </v-btn></center>
          </v-col>

        </v-row>

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
      </v-row>
    </v-container>
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
        dialogPassword: false,
        password1: "",
        password2: "",

        token: "",
        professor: {},
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
        this.type = localStorage.getItem("type")
        var professorAux = JSON.parse(localStorage.getItem("utilizador"))
        var response = await axios.get(h + "professores/" + professorAux.id + "/?token=" + this.token)
        var professor = response.data
        professor.nomeType = "Munícipio"
        professor.escolas = professorAux.escolas
        professor.localidade = professorAux.infoEscola.localidade
        this.professor = professor
    },
    computed: {
      xl() {
        if (this.$vuetify.breakpoint.xl) return true
        return false
      },
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
          this.$router.push({name: "Editar Professor", params: {id : this.professor.id}})
      },
      editarPassword : async function(){
          if(this.password1 != "" && this.password2 != ""){
            if(this.password1 == this.password2){
              if(confirm("Tem a certeza que pretende alterar a sua password?")){
                await axios.put(h + "professores/" + this.professor.id + "/password", {password: this.password1})
                this.dialogPassword = false
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