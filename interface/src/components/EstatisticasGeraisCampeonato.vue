<template>
<v-container>
    <v-row v-if="this.estatisticasGerais" class="justify-center" no-gutters>
        <v-col cols="12" xs="12" sm="12" md="3" lg="3" xl="3">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b>Municípios</b> </span> </p>
                    <span> <b>{{this.estatisticasGerais.nmunicipios}}</b> </span>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="3" lg="3" xl="3">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b>Agrupamentos</b> </span> </p>
                    <span><b>{{this.estatisticasGerais.nescolas}}</b></span>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="3" lg="3" xl="3">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b>Professores</b> </span> </p>
                    <span> <b> {{this.estatisticasGerais.nprofessores}} </b> </span>
                </center>
            </v-card>
        </v-col>
    </v-row>
    <v-row v-if="this.estatisticasGerais" class="justify-center" no-gutters>
        <v-col cols="12" xs="12" sm="12" md="3" lg="3" xl="3">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b> Jogos Jogados </b> </span> </p>
                    <span> <b>{{this.estatisticasGerais.njogos}}</b> </span>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="3" lg="3" xl="3">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b> Alunos </b> </span> </p>
                    <span><b>{{this.estatisticasGerais.nusers}}</b></span>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="3" lg="3" xl="3">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b> Jogos/Aluno </b></span> </p>
                    <span> <b> {{this.estatisticasGerais.jogosAluno}} </b> </span>
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
    props:["estatisticasGerais"],
    created: async function(){
        this.token = localStorage.getItem("token")
    },
    methods: {
     
    }
  }
</script>