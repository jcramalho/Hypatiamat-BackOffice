<template>
<div>
   <v-card class="pa-3">
       <v-card-title class="justify-center green--text">
           <span :style="styleP">Gráfico</span>
       </v-card-title>
       <v-row v-if="intervalos && intervalos.intervalos.length > 0" class="justify-center align-center no-gutters" v-model="intervalos.intervalos">
            <v-col cols="12" md="6" xl="4" class="justify-center" v-for="(intervalo, index) in intervalos.intervalos" v-bind:key="index">
                <v-card class="pa-2 ma-2 elevation-2" outlined>
                    <center><span class="green--text"> Período {{index+1}}</span></center>
                    <v-list-item-content>
                        <v-row class="justify-center">
                            <v-col cols="12" sm="6" >
                                <v-text-field label="Data Início" v-model="intervalo.dataInicio" type="date">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="Data Fim" v-model="intervalo.dataFim" type="date">
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-card>
            </v-col>
            <v-col cols="12">
                O gráfico
                <Grafico :height="250"/>
            </v-col>
        </v-row>
        <v-container v-else>
            <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
        </v-container>
            
   </v-card> 
</div> 
</template>

<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI
const hostJogos = require("@/config/hosts").hostJogos
const anosletivos2 = require("@/config/confs").anosletivos2
const anoletivoAtual = require("@/config/confs").anoletivo2
import Grafico from '@/components/Jogos/Grafico'

  export default {
    components:{
        Grafico
    },
    data(){
      return {
        verTotal: false,
        token: "",
        utilizador : {},
        alunos:[],
        header_resultados: [
            {text: "Pontuação Obtida", value: 'pontuacao', class: 'subtitle-1'},
            {text: "Turma", value: 'turma', class: 'subtitle-1'},
            {text: "Data", value: 'data', class: 'subtitle-1'},
            {text: "Horário", value: 'horario', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        intervalos: undefined,
        styleP: 'font-size:20px',
        styleF: 'font-size:15px',
        widthParams: 'width:70%',
        color1:"#009263",
        color2:"#3ab040"
      }
    },
    props:["jogoTipo", "dataInicio", "dataFim", "jogo", "escola", "turma"],
    created: async function(){
        this.resize()
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        var response = await axios.get(hostJogos + this.jogo + "/turmas/" + this.turma + "/intervalos?escola=" 
                        + this.escola + "&jogoTipo=" + this.jogoTipo + "&token=" + this.token)
        this.intervalos = response.data
        console.log(this.intervalos)
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
          else if(this.$vuetify.breakpoint.sm) {this.styleP= 'font-size:17px'; this.widthParams = 'width:100%';}
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