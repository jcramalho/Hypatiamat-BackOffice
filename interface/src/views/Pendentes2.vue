<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-row class="justify-center no-gutters" >

            <v-card-title class="green--text" style="padding-right:0px">Professores não confirmados/</v-card-title>
            <v-card-title class="green--text" style="padding-left:0px; padding-right:0px"> sem acesso premium/</v-card-title>
            <v-card-title class="green--text" style="padding-left:0px"> com validade expirada </v-card-title>
            </v-row>
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
                    <td>{{row.item.localidade}}</td>
                    <td>{{row.item.escola}}</td>
                    <td>{{row.item.socionum}}</td>
                    <td>{{row.item.projeto}}</td>
                    <td v-if="row.item.valido"> <v-icon color="green">mdi-check-bold</v-icon> </td>
                    <td v-else> <v-icon color="red">mdi-close-thick</v-icon> </td>
                    <td>
                    <!--<v-icon @click="verProfessor(row.item.id)"> mdi-eye </v-icon>-->
                    <v-icon @click="editarProfessor(row.item.id)"> mdi-pencil </v-icon>
                    <v-icon @click="apagarProfessor(row.item.codigo)"> mdi-delete </v-icon>
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
            {text: "Username", value: 'codigo', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Localidade", value: 'localidade', class: 'subtitle-1'},
            {text: "Agrupamento", value: 'escola', class: 'subtitle-1'},
            {text: "Sócio", value: 'socionum', class: 'subtitle-1'},
            {text: "Projeto", value: 'projeto', class: 'subtitle-1'},
            {text: "Válido", value:'valido', class:"subtitle-1"},
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
        var response = await axios.get(h + "professores/naoconfirmados?token=" + this.token)
        this.professores = response.data
        console.log(this.professores)
    },
    methods: {
      aceitarPedido : async function(id){
        
      },
      rejeitarPedido: async function(id){
        
      }
    }
  }
</script>