<template>
    <div>
        <v-card class="pa-5">
        <v-card-title class="justify-center green--text"><span>Resultados Por Dia</span></v-card-title>
        <br>
        <center><span>App: {{app}}</span></center>
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
            {text: "Data", value: 'lastdate', class: 'subtitle-1'},
            {text: "NTRC", value: 'ncertas', class: 'subtitle-1'},
            {text: "NTR", value: 'ntotal', class: 'subtitle-1'},
            {text: "Acerto(%)", value: 'acerto', class: 'subtitle-1'},
            {text: "Frequência", value: 'frequencia', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",

      }
    },
    props:["resultados", "app"],
    created: async function(){
    },
    
    methods: {
     
    }
  }
</script>