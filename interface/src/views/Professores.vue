<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Lista de Professores
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
                :headers="header_professores"
                :items="professores"
                :footer-props="footer_props"
                :search="filtrar"
                >
                <template v-slot:item="row">
                <tr>
                    <td>{{row.item.codigo}}</td>
                    <td>{{row.item.nome}}</td>
                    <td>
                    <v-icon @click="verProfessor(row.item.id)"> mdi-eye </v-icon>
                    <v-icon @click="editarProfessor(row.item.id)"> mdi-pencil </v-icon>
                    <v-icon @click="apagarProfessor(row.item.iduser)"> mdi-delete </v-icon>
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
        professores: [],
         header_professores: [
            {text: "Username", sortable: true, value: 'codigo', class: 'subtitle-1'},
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
        var response = await axios.get(h + "professores?token=" + this.token)
        this.professores = response.data
    },
    methods: {
      verProfessor : function(id){
          this.$router.push({name: "Ver Professor", params: { id : id } })
      },
      editarProfessor : function(id){
          this.$router.push({name: "Editar Professor", params: { id : id } })
      },
      apagarProfessor: async function(id){
          if(confirm("De certeza que deseja apagar este professor?")){
              var a = axios.delete(h + "professores/" + id + "?token=" + this.token)
              var response = await axios.get(h + "professores?token=" + this.token)
              this.professores = response.data
          }
      }
    }
  }
</script>