<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Lista de Turmas
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
                :headers="header_turmas"
                :items="turmas"
                :footer-props="footer_props"
                :search="filtrar"
                >
                <template v-slot:item="row">
                <tr>
                    <td @click="verProfessor(row.item.idprofessor)" style="cursor: pointer;">{{row.item.idprofessor}}</td>
                    <td>{{row.item.turma}}</td>
                    <td>
                    <v-icon @click="editarTurma(row.item.id)"> mdi-pencil </v-icon>
                    <v-icon @click="apagarTurma(row.item.id)"> mdi-delete </v-icon>
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
        turmas: [],
         header_turmas: [
            {text: "Username do Professor", sortable: true, value: 'idprofessor', class: 'subtitle-1'},
            {text: "Turma", value: 'turma', class: 'subtitle-1'},
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
        var response = await axios.get(h + "turmas?token=" + this.token)
        this.turmas = response.data
    },
    methods: {
      verProfessor : function(id){
          this.$router.push({name: "Ver Professor", params: { id : id } })
      },
      editarTurma : function(id){
          this.$router.push({name: "Editar Turma", params: { id : id, minhaTurma: false } })
      },
      apagarProfessor: async function(id){
          if(confirm("De certeza que deseja apagar esta turma?")){
              var a = await axios.delete(h + "turmas/" + id + "?token=" + this.token)
              var response = await axios.get(h + "turmas?token=" + this.token)
              this.turmas = response.data
          }
      }
    }
  }
</script>