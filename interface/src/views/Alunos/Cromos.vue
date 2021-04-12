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
                        <!--
                        <v-card outlined height="170px" width="150px" color="#a6ffbe" style="margin-top:70px">
                            <br>
                            <br>
                            <span  style="color:#009263; padding-top: 50px">{{cromo.numero}}</span>
                            <br>
                            
                        </v-card>-->
                      </center>
                      <center v-else-if="!cromosCompletados.find(e => e.idcromo == cromo.id).virado" >
                        <div style="margin-top:65px">
                          <v-img :src="require('@/assets/cromos/cromoBack2.png')" width="150px" @click="abreCromo(cromo.id)">
                              <span style="color:#009263">Clique para abrir o cromo!</span>
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
                              <!--<v-rating
                                v-model="cromosCompletados.find(e => e.idcromo == cromo.id).estrelasGanhas"
                                background-color="orange lighten-3"
                                color="orange"
                                dense
                                hover
                                size="22"
                                readonly
                              ></v-rating>  -->
                              <div v-if="cromo.estrelas">
                                <v-img width="150px" :src="require('@/assets/cromos/estrela'+cromosCompletados.find(e => e.idcromo == cromo.id).estrelasGanhas+'.png')">
                                </v-img>
                              </div>
                              <v-img :src="require('@/assets/cromos/cromo' + cromo.numero + '.png')" width="150px" heigth="150px" @click="abreCromo(cromo.id)">
                              </v-img>
                              <span class="caption">Clique no cromo, ganhou uma estrela.</span>   
                            </div>
                            <div v-else>
                              <!--<v-rating
                                v-if="cromo.estrelas"
                                v-model="cromosCompletados.find(e => e.idcromo == cromo.id).estrelasGanhas"
                                background-color="orange lighten-3"
                                color="orange"
                                dense
                                hover
                                size="22"
                                readonly
                              ></v-rating>-->
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
        totalCromos:0,
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
        var cromo = this.cromosCompletados.find(e => e.idcromo == id)
        if(cromo){
          cromo.virado = true
          cromo.oldfrequencia = cromo.frequencia
          cromo.estrelasGanhas = cromo.frequencia
          this.countCromosCompletadosVirados()
          axios.put(hostCromos + cromo.id + "/aberto?token=" + this.token)
        }
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