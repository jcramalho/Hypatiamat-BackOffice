<template>
<div>
    <center><v-icon large color="#009263"> mdi-home-analytics </v-icon></center>
    <center><span :style="styleP">{{this.jogo.jogo}}</span></center>
    <br>
    <v-row>
        <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
            <v-card style="background-color:#009263">
                <v-card-title  primary-title class="justify-center">
                    <span class="white--text" :style="styleP">Operações Certas</span>
                </v-card-title>
                <center>
                <v-card-text v-if="resultadosGlobais.numcertas" class="justify-center white--text">
                    {{resultadosGlobais.numcertas}}
                </v-card-text>
                <v-card-text v-else class="justify-center white--text">
                    0
                </v-card-text>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
            <v-card  style="background-color:#3ab040">
                <v-card-title class="justify-center">
                    <span class="white--text" :style="styleP"> Operações Erradas </span>
                </v-card-title>
                <center>
                <v-card-text v-if="resultadosGlobais.numerradas" class="justify-center white--text">
                    {{resultadosGlobais.numerradas}}
                </v-card-text>
                <v-card-text v-else class="justify-center white--text">
                    0
                </v-card-text>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
            <v-card style="background-color:#009263">
                <v-card-title primary-title class="justify-center">
                    <span class="white--text" :style="styleP"> Tipo de Operações </span>
                </v-card-title>
                <center>
                <v-card-text class="justify-center white--text">
                    {{resultadosGlobais.ops}}
                </v-card-text>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="6" md="12" lg="3" xl="3">
            <v-card  style="background-color:#3ab040">
                <v-card-title class="justify-center">
                    <span class="white--text" :style="styleP"> Níveis Jogados </span>
                </v-card-title>
                <center>
                <v-card-text class="justify-center white--text">
                    {{resultadosGlobais.niveis}}
                </v-card-text>
                </center>
            </v-card>
        </v-col>
    </v-row>    
    
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
        verTotal: false,
        token: "",
        utilizador : {},
        alunos:[],
        resultadosGlobais:{},
        styleP: 'font-size:20px',
        styleF: 'font-size:15px',
        widthParams: 'width:70%'
      }
    },
    props:["resultados", "dataInicio", "dataFim", "jogo"],
    created: async function(){
        this.resultadosGlobais = this.resultados
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.resize()
    },
    mounted: function(){
        window.onresize = () => {
            this.resize()
        }
    },
    computed:{
        size(){
            if (this.$vuetify.breakpoint.xs) return 'x-small'
            else if(this.$vuetify.breakpoint.sm) return 'small'
            
            return 'medium'
        },
        xs(){
            if (this.$vuetify.breakpoint.xs) return true
            return false
        }
    },
    methods: {
      resize(){
          if (this.$vuetify.breakpoint.xs) {this.styleP='font-size:15px'; this.widthParams = 'width:100%';}
          else if(this.$vuetify.breakpoint.sm) this.styleP= 'font-size:17px'
          else this.styleP ='font-size:20px'
      },
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
    }
  }
</script>