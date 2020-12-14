<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text" >
                Lista de Alunos
            </v-card-title>
            <center><v-btn class="white--text" style="background-color: #009263;" @click="criarAluno()"><v-icon> mdi-account-plus </v-icon> Criar Aluno </v-btn></center>
            <v-combobox
                id="escola"
                label="Agrupamento de Escolas"
                prepend-icon="mdi-school"
                :return-object="true"
                v-model="escola"
                color="#009263"
                :items="escolas"
                @change="getAlunos()"
            ></v-combobox>
            <v-container v-if="ready">
            <v-text-field
                v-model="filtrar"
                label="Filtrar"
                prepend-icon="mdi-magnify"
                color="#009263"
                single-line
                ></v-text-field>
                <v-data-table
                class="elevation-1"
                loading-text="A carregar alunos..."
                :headers="header_alunos"
                :items="alunos"
                :footer-props="footer_props"
                :search="filtrar"
                >
                <template v-slot:item="row">
                <tr>
                    <td>{{row.item.user}}</td>
                    <td>{{row.item.nome}}</td>
                    <td>{{row.item.codprofessor}}</td>
                    <td>{{row.item.turma}}</td>
                    <td>
                    <v-icon @click="verAluno(row.item.id)"> mdi-eye </v-icon>
                    <v-icon @click="editarAluno(row.item.id)"> mdi-pencil </v-icon>
                    <v-icon @click="apagarAluno(row.item.user)"> mdi-delete </v-icon>
                    </td>
                </tr>
                </template>
                </v-data-table>
            </v-container>
            <v-container v-else>
            <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
            </v-container>
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
        token: "",
        alunos: [],
         header_alunos: [
            {text: "Username", sortable: true, value: 'user', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Professor", value: 'codprofessor', class: 'subtitle-1'},
            {text: "Turma", value: 'turma', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        ready:false,
        escolas:[],
        escolasIds:[]
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        var responseE = await axios.get(h + "escolas")
        this.escolasIds = responseE.data
        var i
        for(i = 0; i < this.escolasIds.length; i++){
          var string = this.escolasIds[i].localidade + " - " + this.escolasIds[i].nome 
          this.escolas.push(string)
        }
        var response = await axios.get(h + "alunos?token=" + this.token)
        this.alunos = response.data

        this.ready = true
    },
    methods: {
      verAluno : function(id){
          this.$router.push({name: "Ver Aluno", params: { id : id } })
      },
      editarAluno : function(id){
          this.$router.push({name: "Editar Aluno", params: { id : id } })
      },
      getAlunos : async function(){
        this.ready = false
        var aux = this.escola.split(" - ")
        var escolaEscolhida = this.escolasIds.find(element => element.nome == aux[1]).cod
        var response = await axios.get(h + "escolas/" + escolaEscolhida + "/alunos?token=" + this.token )
        console.log(response.data)
        this.alunos = response.data
        this.ready = true
      },
      apagarAluno: async function(id){
          if(confirm("De certeza que deseja apagar este aluno?")){
              var a = await axios.delete(h + "alunos/" + id + "?token=" + this.token)
              var apagado = a.data
              if(apagado.removed){
                var response = await axios.get(h + "alunos?token=" + this.token)
                this.alunos = response.data
              }
              else{
                alert(apagado.message)
              }
              
          }
      },
      criarAluno: async function(){
        this.$router.push({name: "Criar Aluno"})
      }
    }
  }
</script>