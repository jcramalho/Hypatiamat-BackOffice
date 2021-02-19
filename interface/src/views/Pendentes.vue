<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
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
                    <v-icon @click="aceitarPedido(row.item.id, row.item.codigo)" color="#009263"> mdi-account-check </v-icon>
                    </td>
                    <td>
                    <v-icon @click="rejeitarPedido(row.item.id)" color="red"> mdi-account-remove </v-icon>
                    </td>
                </tr>
                </template>
                </v-data-table>
                <v-dialog v-model="dialogEditarProfessor" width="80%">
                  <EditarProfessor :idProp="idAceite"/>
                </v-dialog>
        </v-container>
    </v-card>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
import EditarProfessor from '@/views/EditarProfessor.vue'
const h = require("@/config/hosts").hostAPI

  export default {
    components:{
         EditarProfessor
    },
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
        idAceite:"",
        dialogEditarProfessor: false
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        var response = await axios.get(h + "quarentenas?token=" + this.token)
        this.pendentes = response.data
    },
    methods: {
      aceitarPedido : async function(id){
        var responseAceite = await axios.post(h + "quarentenas/" + id + "?token=" + this.token)
                                        .catch(erro => console.log(erro))
        this.idAceite = responseAceite.data.insertId
        this.dialogEditarProfessor = true
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