<template>
    <v-card class="pa-5 elevation-3" color="grey lighten-3">
        <v-container>
            <v-row class="justify-center align-center">
                <v-col cols="12">
                    <center><span class="green--text"> <b>Classificação no último campeonato</b> </span></center>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="3" lg="3" xl="3">
                    <v-card class="white--text" color="#009263" rounded>
                        <center>
                            <v-icon large color="#cd7f32" v-if="posicoes.posHypatia != '-' && posicoes.posHypatia > 3 && posicoes.posHypatia <= 10">
                                mdi-medal
                            </v-icon>
                            <v-icon large color="#FFD700" v-else-if="posicoes.posHypatia != '-' && posicoes.posHypatia == 2">
                                mdi-medal
                            </v-icon>	
                            <v-icon large color="#C0C0C0" v-else-if="posicoes.posHypatia != '-' && posicoes.posHypatia == 3">
                                mdi-medal
                            </v-icon>
                            <v-icon large v-else-if="posicoes.posHypatia != '-' && posicoes.posHypatia == 1" color="#FFD700">
                                mdi-trophy
                            </v-icon>
                            <p> <span> <b>Hypatiamat</b> </span> </p>
                            <v-card class="elevation-5" outlined>
                                <span class="green--text"> <b>{{posicoes.posHypatia}}</b> </span>
                            </v-card>
                        </center>
                    </v-card>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="3" lg="3" xl="3">
                    <v-card rounded class="white--text" color="#009263">
                        <center>
                            <v-icon large color="#cd7f32" v-if="posicoes.posEscola != '-' && posicoes.posEscola > 3 && posicoes.posEscola <= 10">
                                mdi-medal
                            </v-icon>
                            <v-icon large color="#FFD700" v-else-if="posicoes.posEscola != '-' && posicoes.posEscola == 2">
                                mdi-medal
                            </v-icon>	
                            <v-icon large color="#C0C0C0" v-else-if="posicoes.posEscola != '-' && posicoes.posEscola == 3">
                                mdi-medal
                            </v-icon>
                            <v-icon large v-else-if="posicoes.posEscola != '-' && posicoes.posEscola == 1" color="#FFD700">
                                mdi-trophy
                            </v-icon>
                            
                            <p> <span> <b>Escola</b> </span> </p>
                            <v-card class="elevation-5" outlined>
                                <span class="green--text"> <b>{{posicoes.posEscola}}</b> </span>
                            </v-card>
                        </center>
                    </v-card>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="3" lg="3" xl="3">
                    <v-card rounded class="white--text" color="#009263">
                        <center>
                            <v-icon large color="#cd7f32" v-if="posicoes.posTurma != '-' && posicoes.posTurma > 3 && posicoes.posTurma <= 10">
                                mdi-medal
                            </v-icon>
                            <v-icon large color="#FFD700" v-else-if="posicoes.posTurma != '-' && posicoes.posTurma == 2">
                                mdi-medal
                            </v-icon>	
                            <v-icon large color="#C0C0C0" v-else-if="posicoes.posTurma != '-' && posicoes.posTurma == 3">
                                mdi-medal
                            </v-icon>
                            <v-icon large v-else-if="posicoes.posTurma != '-' && posicoes.posTurma == 1" color="#FFD700">
                                mdi-trophy
                            </v-icon>
                            <p> <span> <b>Turma</b> </span> </p>
                            <v-card class="elevation-5" outlined>
                                <span class="green--text"> <b>{{posicoes.posTurma}}</b> </span>
                            </v-card>
                        </center>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
const h = require("@/config/hosts").hostAPI

  export default {
    data(){
      return {
        token: "",
      }
    },
    props:["posicoes"],
    created: async function(){
        this.token = localStorage.getItem("token")
    },
    methods: {
     
    }
  }
</script>
