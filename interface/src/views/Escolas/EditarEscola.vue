<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container >
                <v-card-title primary-title class="justify-center green--text">
                    Editar Agrupamento de Escolas ({{nomeEscola}})
                </v-card-title>
                        
              <v-text-field prepend-icon="mdi-account" label="Nome" placeholder="Nome" v-model="escola.nome" :rules="[existeNome, string120]"  required/>
              <v-text-field prepend-icon="mdi-city" label="Localidade" placeholder="Localidade" v-model="escola.localidade" :rules="[string30]"  required/>
              <v-text-field prepend-icon="mdi-calendar" label="Distrito" placeholder="Distrito" v-model="escola.distrito" :rules="[string30]"  required/>
              <v-text-field prepend-icon="mdi-bank" label="País" placeholder="País " v-model="escola.pais" :rules="[string20]" required/>
              
              <br>
              <center><v-btn class="white--text" style="background-color: #009263;" @click="verProfessores()"> Ver Professores </v-btn></center>
              <br>
              <center><v-btn class="white--text" style="background-color: #009263;" @click="verAlunos()"> Ver Alunos </v-btn></center>
              <br>
              <center><v-btn class="white--text" style="background-color: #009263;" @click="editarEscola()"> Confirmar Alterações </v-btn></center>
            
              <v-dialog
                v-model="dialogProfessores"
                width="40%"
                >
                    <v-card class="pa-5">
                    <v-card-title primary-title class="justify-center green--text">
                        Professores do Agrupamento
                    </v-card-title> 
                    <v-text-field
                    prepend-icon="mdi-magnify"
                    color="#009263"
                    v-model="filtrar"
                    label="Filtrar"
                    single-line
                    ></v-text-field>
                    <v-data-table
                    class="elevation-1"
                    :headers="header_professores"
                    :items="professores"
                    :footer-props="footer_props"
                    :search="filtrar"
                    @click:row="verProfessor"
                    >
                    </v-data-table>
                    </v-card>
                </v-dialog>

                <v-dialog
                v-model="dialogAlunos"
                width="40%"
                >
                    <v-card class="pa-5">
                    <v-card-title primary-title class="justify-center green--text">
                      Alunos do Agrupamento
                    </v-card-title>
                    <v-text-field
                    prepend-icon="mdi-magnify"
                    color="#009263"
                    v-model="filtrar2"
                    label="Filtrar"
                    single-line
                    ></v-text-field>
                    <v-data-table
                    class="elevation-1"
                    :headers="header_alunos"
                    :items="alunos"
                    :footer-props="footer_props"
                    :search="filtrar2"
                    >
                    </v-data-table>
                    </v-card>
                </v-dialog>

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

  export default {
    data(){
      return {
        nomeEscola:"",
        token: "",
        escola: {},
        id : 0,
        cod: "",
        alunos: [],
        professores: [],
        dialogProfessores : false,
        dialogAlunos : false,
        filtrar : "",
        escolas:[],
        filtrar2 : "",
        header_professores: [
            {text: "Username", sortable: true, value: 'codigo', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
        ],
        header_alunos: [
            {text: "Turma", sortable: true, value: 'turma', class: 'subtitle-1'},
            {text: "Username", sortable: true, value: 'user', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        string10: v  => {
          if(v.length <= 10) return true
          else return "Apenas pode conter 10 caractéres"
        },
        string120: v  => {
          if(v.length <= 120) return true
          else return "Apenas pode conter 120 caractéres"
        },
        string30: v  => {
          if(v.length <= 30) return true
          else return "Apenas pode conter 30 caractéres"
        },
        string20: v  => {
          if(v.length <= 20) return true
          else return "Apenas pode conter 20 caractéres"
        },
        nomeExiste: v =>{
          
        },
        existeNome: v =>{
          if(this.escolas.find(element => element.nome == v) && this.nomeEscola != v) return 'Esse nome de agrupamento já existe. Escolha outro por favor.'
          else return true
        }
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.id = this.$route.params.id
        var responseEsc = await axios.get(h + "escolas")
        this.escolas = responseEsc.data
        var response = await axios.get(h + "escolas/" + this.id + "?token=" + this.token)
        this.escola = response.data
        this.cod = this.escola.cod
        this.nomeEscola = this.escola.nome
    },
    methods: {
      verAlunos : async function(){
        var response = await axios.get(h + "escolas/" + this.cod + "/alunos?token=" + this.token)
        this.alunos = response.data
        this.dialogAlunos = true
      },
      verProfessores: async function(){
        var response = await axios.get(h + "escolas/" + this.cod + "/professores?token=" + this.token)
        this.professores = response.data
        this.dialogProfessores = true
      },
      verProfessor: function(professor){
        this.$router.push({name: "Ver Professor", params: { id : professor.id } })
      },
      verAluno: function(aluno){
        this.$router.push({name: "Ver Aluno", params: { id : aluno.id } })
      },
      editarEscola : function(){
          axios.put(h + "escolas/" + this.id + "?token=" + this.token, this.escola)
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
      }
    }
  }
</script>