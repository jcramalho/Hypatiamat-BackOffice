<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3" >
      <v-container>
        <v-card class="justify-center">
            <center>
                <v-icon x-large color='#009263'> mdi-book-open-page-variant-outline </v-icon>
                <br>
                <span> Caderneta de cromos </span>
            </center>
            <v-row>
                <v-col cols="12">
                  <center>
                    <span> {{numeroCromosCompletados}} / {{totalCromos}} </span>
                    <br>
                    <span> {{((numeroCromosCompletados/totalCromos)*100).toFixed(0)}}% </span>
                    <v-col cols="6">
                      <v-progress-linear
                        color="cyan darken-2"
                        rounded
                        :value="((numeroCromosCompletados/totalCromos)*100).toFixed(0)"
                      ></v-progress-linear>
                    </v-col>
                  </center>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3" xl="2" v-for="cromo in cromos" v-bind:key="cromo.id">
                    <v-container class="text-center pa-0 ma-0">
                        <v-avatar v-if="naoPossuiCromo(cromo.id)" tile color="#a6ffbe" size="200">
                            <span style="color:#009263">{{cromo.numero}}</span>
                        </v-avatar>
                        <v-avatar v-else-if="!cromosCompletados.find(e => e.idcromo == cromo.id).virado" 
                                  tile color="#a6ffbe" size="200" @click="abreCromo(cromo.id)">
                            <span style="color:#009263">Clique para abrir o cromo!</span>
                        </v-avatar>
                        <v-container v-else>
                          <center>
                            <span v-if="cromo.estrelas">({{cromosCompletados.find(e => e.idcromo == cromo.id).frequencia}} estrelas)</span>
                            <div><v-img  :src="require('@/assets/cromo.png')" width="150px" heigth="150px"> </v-img></div>
                            <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      icon
                                      v-bind="attrs" 
                                      v-on="on"
                                    >
                                    <v-icon color="green"> mdi-information-outline </v-icon>
                                    </v-btn>
                                  </template>
                                  <span>{{cromo.nome}}</span>
                                  <!--<span class="header"> <p> Para ganhar o cromo ou mais estrelas do cromo, terá que: </p> <p> {{cromo.descricao}}</p> </span>-->
                            </v-tooltip>
                          </center>
                        </v-container>
                    </v-container>
                </v-col>
            </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
import Swal from 'sweetalert2'
const h = require("@/config/hosts").hostAPI
const hostCromos = require("@/config/hosts").hostCromos

  export default {
    data(){
      return {
        token: "",
        utilizador:{},
        cromos: [],
        cromosCompletados: [],
        numeroCromosCompletados:0,
        totalCromos:0
      }
    },
    props:["idProp"],
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        
        this.getCromos()
        this.getCromosCompletados()
    },
    methods: {
      getCromos: async function(){
        var response = await axios.get(hostCromos + "?token=" + this.token)
        this.cromos = response.data
        this.totalCromos = this.cromos.length
      },
      getCromosCompletados: async function(){
        var response = await axios.get(hostCromos + "alunos/" + this.utilizador.user + "?token=" + this.token)
        this.cromosCompletados = response.data
        this.countCromosCompletadosVirados()
      },
      naoPossuiCromo: function(id){
        if (this.cromosCompletados.find(e => e.idcromo == id)) return false
        else return true
      },
      abreCromo: function(id){
        this.cromosCompletados.find(e => e.idcromo == id).virado = true
        this.countCromosCompletadosVirados()
      },
      countCromosCompletadosVirados: function(){
        var r = 0;
        for(var i = 0; i < this.cromosCompletados.length; i++){
          if(this.cromosCompletados[i].virado) r++
        }
        this.numeroCromosCompletados = r
      }
    }
  }
</script>