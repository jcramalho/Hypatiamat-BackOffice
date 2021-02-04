<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container style="width:80%">
            <v-card-title primary-title class="justify-center green--text">
                Lista de Pedidos de Inscrição
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
                :headers="header_pendentes"
                :items="pendentes"
                :footer-props="footer_props"
                :search="filtrar"
                >
                <template v-slot:item="row">
                <tr>
                    <td>{{row.item.codigo}}</td>
                    <td>{{row.item.nome}}</td>
                    <td>{{row.item.escola}}</td>
                    <td>
                    <v-icon @click="aceitarPedido(row.item.id)" color="#009263"> mdi-account-check </v-icon>
                    </td>
                    <td>
                    <v-icon @click="rejeitarPedido(row.item.id)" color="red"> mdi-account-remove </v-icon>
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
        pendentes: [],
         header_pendentes: [
            {text: "Username", sortable: true, value: 'codigo', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Agrupamento", value: 'escola', class: 'subtitle-1'},
            {text: "Aceitar", class: 'subtitle-1'},
            {text: "Rejeitar", class: 'subtitle-1'}
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
        var response = await axios.get(h + "quarentenas?token=" + this.token)
        this.pendentes = response.data
    },
    methods: {
      aceitarPedido : async function(id){
        await axios.post(h + "quarentenas/" + id + "?token=" + this.token)
        var response = await axios.get(h + "quarentenas?token=" + this.token)
        this.pendentes = response.data
      },
      rejeitarPedido: async function(id){
        await axios.delete(h + "quarentenas/" + id + "?token=" + this.token)
        var response = await axios.get(h + "quarentenas?token=" + this.token)
        this.pendentes = response.data
      }
    }
  }
</script>