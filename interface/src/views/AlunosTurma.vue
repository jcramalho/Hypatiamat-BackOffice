<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Alunos da Turma {{turma.turma}}
            </v-card-title>
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
                    <td>
                    <v-icon @click="editarAluno(row.item.id)"> mdi-pencil </v-icon>
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
            {text: "Editar", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        idTurma: "",
        turma: {},
        utilizador:{}
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.idTurma = this.$route.params.id
        var response = await axios.get(h + "turmas/" + this.idTurma + "?token=" + this.token)
        this.turma = response.data
        var responseA = await axios.get(h + "turmas/" + this.turma.turma + "/alunos?codprofessor="+ this.turma.idprofessor + "&token=" + this.token)
        this.alunos = responseA.data
    },
    methods: {
      editarAluno : function(id){
          this.$router.push({name: "Editar Aluno", params: { id : id } })
      },
      editarTurma: function(id){

      }
  }
  }
</script>