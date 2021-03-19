<template>
<v-container>
    <center><span> Totais: </span></center>
    <v-row v-if="this.estatisticasGerais" class="justify-center" no-gutters>
        <v-col cols="12" xs="12" sm="12" md="12" lg="3" xl="3">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b>NTRC</b> </span> </p>
                    <span> <b>{{this.estatisticasGerais.ncertas}}</b> </span>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="3" xl="3">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b>NTR</b> </span> </p>
                    <span><b>{{this.estatisticasGerais.ntotal}}</b></span>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="3" xl="3">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b>Acerto(%)</b> </span> </p>
                    <span> <b> {{this.estatisticasGerais.acerto}} </b> </span>
                </center>
            </v-card>
        </v-col>
    </v-row>
    <v-row v-if="this.estatisticasGerais" class="justify-center" no-gutters>
        <v-col cols="12" xs="12" sm="12" md="12" lg="3" xl="3">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b> DP </b> </span> </p>
                    <span> <b>{{this.estatisticasGerais.onpeak}}</b> </span>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="3" xl="3">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b> FP </b> </span> </p>
                    <span> <b>{{this.estatisticasGerais.offpeak}}</b> </span>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="3" xl="3">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b> Frequência </b> </span> </p>
                    <span> <b>{{this.estatisticasGerais.frequencia}}</b> </span>
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