<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
                <v-card-title primary-title class="justify-center green--text">
                    Professores do Agrupamento {{escola.nome}}
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
                        <td>{{row.item.validade}}</td>
                        <td v-if="row.item.confirmacao"> <v-icon color="green">mdi-check-bold</v-icon> </td>
                        <td v-else> <v-icon color="red">mdi-close-thick</v-icon> </td>
                        <td v-if="row.item.premium > 0"> <v-icon color="green">mdi-check-bold</v-icon> </td>
                        <td v-else> <v-icon color="red">mdi-close-thick</v-icon> </td>
                        <td>
                        <v-icon color="#009263" @click="verTurmas(row.item.codigo)"> mdi-eye </v-icon>
                        </td>
                    </tr>
                    </template>
                    </v-data-table>
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
        token: "",
        professores: [],
        escola: {},
         header_professores: [
            {text: "Username", sortable: true, value: 'codigo', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Validade", value: 'validade', class:'subtitle-1'},
            {text: "Confirmado", value: 'confirmacao', class:'subtitle-1'},
            {text: "Premium", value: 'premium', class:'subtitle-1'},
            {text: "Ver Turmas", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        //var response = await axios.get(h + "professores?token=" + this.token)
        var codEscola = this.$route.params.escola
        var responseEscola = await axios.get(h + "escolas/" + codEscola + "/?token=" + this.token)
        this.escola = responseEscola.data
        var responseProf = await axios.get(h + "escolas/" + codEscola + "/professores" + "/?token=" + this.token)
        this.professores = responseProf.data
    },
    methods: {
      
      verTurmas: async function(codigo){
        //this.$router.push({name:''})
        this.$router.push({name: 'Turmas Professor', params:{codigo: codigo}})
      }
    }
  }
</script>