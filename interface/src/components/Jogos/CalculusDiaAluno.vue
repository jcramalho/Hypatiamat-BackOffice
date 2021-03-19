<template>
    <div>
        <v-card class="pa-5">
        <v-card-title class="justify-center green--text"><span>Resultados Por Dia</span></v-card-title>
        <br>
        <center><span>Jogo: {{jogo}}</span></center>
        <br>
        <v-data-table
        class="elevation-4"
        :headers="header_resultados"
        :items="resultados"
        :footer-props="footer_props"
        >
        </v-data-table>

        </v-card>   
    </div> 
</template>

<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI
const hostJogos = require("@/config/hosts").hostJogos
const anosletivos2 = require("@/config/confs").anosletivos2
const anoletivoAtual = require("@/config/confs").anoletivo2

  export default {
    data(){
      return {
        header_resultados: [
            {text: "Data", value: 'data', class: 'subtitle-1'},
            {text: "Op. Certas", value: 'numcertas', class: 'subtitle-1'},
            {text: "Op. Erradas", value: 'numerradas', class: 'subtitle-1'},
            {text: "Níveis Jogados", value: 'niveis', class: 'subtitle-1'},
            {text: "Tipos de Op.", value: 'ops', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",

      }
    },
    props:["resultados", "jogo"],
    created: async function(){
    },
    
    methods: {
     
    }
  }
</script>