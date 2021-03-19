<template>
<v-container>
    <center><span> Totais: </span></center>
    <v-row v-if="this.estatisticasGerais" class="justify-center" no-gutters>
        <v-col cols="12" xs="12" sm="12" md="12" lg="4" xl="4">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b>Total de Jogos</b> </span> </p>
                    <span> <b>{{this.estatisticasGerais.number}}</b> </span>
                </center>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
const h = require("@/config/hosts").hostAPI

  export default {
    data(){
      return {
        token: "",
      }
    },
    props:["estatisticasGerais", "professor"],
    created: async function(){
        this.token = localStorage.getItem("token")
    },
    methods: {
     
    }
  }
</script>