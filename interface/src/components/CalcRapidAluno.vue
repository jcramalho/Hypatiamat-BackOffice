<template>
<div>
    <center><v-icon large color="#009263"> mdi-home-analytics </v-icon></center>
    <center><span :style="styleP">{{this.jogo.jogo}}</span></center>
    <br>
    <v-row>
        <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
            <v-card style="background-color:#009263">
                <v-card-title  primary-title class="justify-center">
                    <span class="white--text" :style="styleP"> Pontuação certa</span>
                </v-card-title>
                <center>
                <v-card-text class="justify-center white--text">
                    {{resultadosGlobais.pontcerta}}
                </v-card-text>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
            <v-card  style="background-color:#3ab040">
                <v-card-title class="justify-center">
                    <span class="white--text" :style="styleP"> Pontuação Errada </span>
                </v-card-title>
                <center>
                <v-card-text class="justify-center white--text">
                    {{resultadosGlobais.ponterrada}}
                </v-card-text>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
            <v-card style="background-color:#009263">
                <v-card-title primary-title class="justify-center">
                    <span class="white--text" :style="styleP"> Operações Realizadas </span>
                </v-card-title>
                <center>
                <v-card-text class="justify-center white--text">
                    {{resultadosGlobais.oprealizadas}}
                </v-card-text>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="6" md="12" lg="3" xl="3">
            <v-card  style="background-color:#3ab040">
                <v-card-title class="justify-center">
                    <span class="white--text" :style="styleP"> Frequência </span>
                </v-card-title>
                <center>
                <v-card-text class="justify-center white--text">
                    {{resultadosGlobais.frequencia}}
                </v-card-text>
                </center>
            </v-card>
        </v-col>
        <v-col cols="12"  xs="12" sm="12" md="12" lg="12" xl="12">
            <center>
                <v-btn v-if="!xs" class="white--text" color="#009263" @click="verTodos()">Ver todos estes resultados</v-btn>
                <v-btn v-else class="white--text" color="#009263" @click="verTodos()">Ver todos</v-btn>
            </center>
        </v-col>
    </v-row>    
    <v-dialog v-model="verTotal" width="70%">
        <v-card class="pa-5" >
        <v-data-table
        class="elevation-4"
        :headers="header_resultados"
        :items="resultadosTotal"
        :footer-props="footer_props"
        >
        </v-data-table>
        </v-card>
    </v-dialog>    
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
        header_resultados: [
            {text: "Pontuação Obtida", value: 'pontuacao', class: 'subtitle-1'},
            {text: "Data", value: 'data', class: 'subtitle-1'},
            {text: "Horário", value: 'horario', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        resultadosGlobais:{},
        resultadosTotal:[],
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
      verTodos: async function(){
        var response = await axios.get(h + "alunos/" + this.utilizador.user + "/jogos/" + this.jogo.jogotable 
                                        + "?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                        + "&jogoTipo=" + this.jogo.tipo
                                        + "&token=" + this.token)
        this.resultadosTotal = response.data
        this.verTotal = true
      }
    }
  }
</script>