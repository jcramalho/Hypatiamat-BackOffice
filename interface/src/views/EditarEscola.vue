<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container style="width:50%;">
            <v-card-title primary-title class="justify-center green--text">
                Editar Escola ({{nomeEscola}})
            </v-card-title>
                     
          <v-text-field label="Nome" placeholder="Nome" v-model="escola.nome" color="#900000" required/>
          <v-text-field label="Localidade" placeholder="Localidade" v-model="escola.localidade" color="#900000" required/>
          <v-text-field label="Distrito" placeholder="Distrito" v-model="escola.distrito" color="#900000" required/>
          <v-text-field label="País" placeholder="País " v-model="escola.pais"  color="#900000" required/>
          <v-text-field label="Código" placeholder="Código" v-model="escola.cod"  color="#900000" required/>
          
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
                    Professores da Escola
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
                  Alunos da Escola
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
                @click:row="verAluno"
                >
                </v-data-table>
                </v-card>
            </v-dialog>

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
        filtrar2 : "",
        header_professores: [
            {text: "Username", sortable: true, value: 'codigo', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
        ],
        header_alunos: [
            {text: "Username", sortable: true, value: 'user', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.id = this.$route.params.id
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
                 alert("Dados alterados com sucesso!")
               })
               .catch(error => alert("Não foi possível guardar as alterações."))
      }
    }
  }
</script>