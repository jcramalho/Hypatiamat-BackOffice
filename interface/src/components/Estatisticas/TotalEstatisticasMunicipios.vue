<template>
<v-container>
    <center><span> Totais: </span></center>
    <v-row v-if="this.estatisticasGerais" class="justify-center" no-gutters>
        <v-col cols="12" xs="12" sm="12" md="12" lg="2" xl="2">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b>Turmas</b> </span> </p>
                    <span> <b>{{this.estatisticasGerais.totalTurmas}}</b> </span>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="2" xl="2">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b>Turmas Mistas</b> </span> </p>
                    <span><b>{{this.estatisticasGerais.totalTurmasMistas}}</b></span>
                </center>
            </v-card>
        </v-col>
        <v-col v-if="!professor" cols="12" xs="12" sm="12" md="12" lg="2" xl="2">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b>Professores</b> </span> </p>
                    <span> <b> {{this.estatisticasGerais.totalProfessores}} </b> </span>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="2" xl="2">
            <v-card class="white--text" color="#009263" style="border: 2px solid black !important;">
                <center>
                    <p> <span> <b> Alunos </b> </span> </p>
                    <span> <b>{{this.estatisticasGerais.totalAlunos}}</b> </span>
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