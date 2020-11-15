<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card>
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Lista de Alunos
            </v-card-title>
            <v-text-field
                v-model="filtrar"
                label="Filtrar"
                single-line
                ></v-text-field>
                <v-data-table
                :headers="header_alunos"
                :items="alunos"
                :footer-props="footer_props"
                :search="filtrar"
                >
                <template v-slot:item="row">
                <tr>
                    <td>{{row.item.user}}</td>
                    <td>{{row.item.nome}}</td>
                    <td>
                    <v-icon @click="verAluno(row.item.id)"> mdi-eye </v-icon>
                    <v-icon @click="editarAluno(row.item.id)"> mdi-pencil </v-icon>
                    <v-icon @click="apagarAluno(row.item.iduser)"> mdi-delete </v-icon>
                    </td>
                </tr>
                </template>
                </v-data-table>
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
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        var response = await axios.get(h + "alunos?token=" + this.token)
        this.alunos = response.data
    },
    methods: {
      verAluno : function(id){
          this.$router.push({name: "Ver Aluno", params: { id : id } })
      },
      editarAluno : function(id){
          this.$router.push({name: "Editar Aluno", params: { id : id } })
      },
      apagarAluno: async function(id){
          if(confirm("De certeza que deseja apagar este aluno?")){
              var a = axios.delete(h + "alunos/" + id + "?token=" + this.token)
              var response = await axios.get(h + "alunos?token=" + this.token)
              this.professores = response.data
          }
      }
    }
  }
</script>