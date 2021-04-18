<template>
      <v-container>
        <v-card class="justify-center">
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
                      <center v-if="naoPossuiCromo(cromo.id)">
                        <div style="margin-top:65px">
                          <v-img :src="require('@/assets/cromos/cromoBack2.png')" width="150px">
                            <v-avatar>
                              <span class="green--text">{{cromo.numero}}</span>
                            </v-avatar>
                          </v-img>
                          <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  icon
                                  v-bind="attrs" 
                                  v-on="on"
                                >
                                <v-icon color="green"> mdi-information-outline </v-icon>
                                </v-btn>
                              </template>
                              <center>
                                <span>{{cromo.nome}}</span>
                                <br>
                                <span>{{cromo.descricao}}</span>
                              </center>
                          </v-tooltip>
                        </div>
                      </center>
                        <v-container v-else>
                          <center>
                            
                            <div v-if="cromo.estrelas && verifyEstrelas(cromosCompletados.find(e => e.idcromo == cromo.id))">
                              <div v-if="cromo.estrelas">
                                <v-img width="150px" :src="require('@/assets/cromos/estrela'+cromosCompletados.find(e => e.idcromo == cromo.id).estrelasGanhas+'.png')">
                                </v-img>
                              </div>
                              <v-img :src="require('@/assets/cromos/cromo' + cromo.numero + '.png')" width="150px" heigth="150px">
                              </v-img>
                            </div>
                            <div v-else>
                              <div v-if="cromo.estrelas">
                                <v-img width="150px" :src="require('@/assets/cromos/estrela'+cromosCompletados.find(e => e.idcromo == cromo.id).estrelasGanhas+'.png')">
                                </v-img>
                                <v-img  :src="require('@/assets/cromos/cromo' + cromo.numero + '.png')" width="150px" heigth="150px">
                                </v-img>
                              </div>
                              <div v-else style="margin-top:55px">
                                <v-img  :src="require('@/assets/cromos/cromo' + cromo.numero + '.png')" width="150px" heigth="150px">
                                </v-img>
                              </div>
                            </div>
                            <v-tooltip bottom>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      icon
                                      v-bind="attrs" 
                                      v-on="on"
                                    >
                                    <v-icon color="green"> mdi-information-outline </v-icon>
                                    </v-btn>
                                  </template>
                                  <center>
                                    <span>{{cromo.nome}}</span>
                                    <br>
                                    <span>{{cromo.descricao}}</span>
                                  </center>
                            </v-tooltip>
                          </center>
                        </v-container>
                    </v-container>
                </v-col>
            </v-row>
        </v-card>
      </v-container>
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
        totalCromos:0,
      }
    },
    props:["userAluno"],
    created: async function(){
        this.token = localStorage.getItem("token")
        
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
        var response = await axios.get(hostCromos + "alunos/" + this.userAluno + "?token=" + this.token)
        this.cromosCompletados = response.data
        this.countCromosCompletadosVirados()
      },
      naoPossuiCromo: function(id){
        var c = this.cromosCompletados.find(e => e.idcromo == id)
        if (c && c.virado) return false
        else return true
      },

      countCromosCompletadosVirados: function(){
        var r = 0;
        for(var i = 0; i < this.cromosCompletados.length; i++){
          if(this.cromosCompletados[i].virado) r++
        }
        this.numeroCromosCompletados = r
      },
      verifyEstrelas: function(cromo){
        
        if(cromo.frequencia > cromo.oldfrequencia){
          cromo.estrelasGanhas = cromo.oldfrequencia - 1
          return true
        } 
        else{
          cromo.estrelasGanhas = cromo.frequencia - 1
          return false
        }
      }
    }
  }
</script>