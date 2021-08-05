<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-2">
            <v-container>
                <center><v-icon large color="#009263">mdi-message</v-icon></center>
                <v-card-title primary-title class="justify-center green--text">
                     <span>Mensagens Recebidas</span>
                </v-card-title>
                <v-row no-gutters>
                    <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                        <v-btn class="white--text" color="#27451e" v-if="naovistas" block> <v-icon>mdi-bell-circle-outline</v-icon> Recentes </v-btn>
                        <v-btn class="white--text" color="#009263" block @click="showRecentes()" v-else> <v-icon>mdi-bell-circle-outline</v-icon> Recentes </v-btn>
                    </v-col>
                    <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                        <v-btn class="white--text" color="#009263" block @click="showOutras()" v-if="naovistas"> <v-icon>mdi-history</v-icon> Outras </v-btn>
                        <v-btn class="white--text" color="#27451e" block v-else> <v-icon>mdi-history</v-icon> Outras </v-btn>
                    </v-col>
                </v-row>
                <v-list  class="py-0" nav > 
                    <v-row>        
                    <v-col cols="12">
                        <v-card v-if="naovistas && mensagens.length == 0" class="elevation-6 pa-3" 
                            style="border: 2px solid green !important;" color="grey lighten-3" width="100%">   
                            <span> Não recebeste nenhuma mensagem nesta semana. </span>
                        </v-card>
                        <v-card v-if="!naovistas && mensagens.length == 0" class="elevation-6 pa-3" 
                            style="border: 2px solid green !important;" color="grey lighten-3" width="100%">   
                            <span> Não recebeste nenhuma mensagem nas semanas anteriores. </span>
                        </v-card>
                    <v-list-item
                        v-for="mensagem in mensagensShow"
                        :key="mensagem.id"
                    >
                        <v-list-item-avatar>
                            <v-icon color="#009263">mdi-account</v-icon>
                        </v-list-item-avatar>

                        <v-card class="elevation-6 pa-3" style="border: 2px solid green !important;" :color="mensagem.nova ? 'green lighten-3':'grey lighten-3'" width="100%">
                            
                            <v-list-item-title> <b>{{mensagem.codprofessor}}</b> </v-list-item-title>
                            <v-subheader class="pa-0">{{mensagem.data.split(" ")[0]}} 
                                (<span v-if="mensagem.dias > 1 || mensagem.hours > 24"> há {{mensagem.dias}} dias </span> 
                                 <span v-else-if="mensagem.minutos < 60"> há {{mensagem.minutos}} minutos </span>
                                 <span v-else> há {{mensagem.hours}} horas </span>)
                            </v-subheader>
                            
                            <v-list-item-content style="white-space:pre-wrap;">
                                    <span>{{ mensagem.mensagem }}</span>
                            </v-list-item-content>
                            <v-card-actions >
                                <v-row justify="end">
                                <v-list-item-action-text class="pr-2">
                                    <span v-if="mensagem.visto"> Vista </span>
                                    <span v-else> Não Vista </span>
                                </v-list-item-action-text>
                                </v-row>
                            </v-card-actions>
                        </v-card>
                    </v-list-item>
                    </v-col>
                    </v-row>
                    <v-pagination
                        v-model="pagination.page"
                        :length="pagination.total"
                        color="#009263"
                        @input="this.parseMessages"
                    ></v-pagination>
                </v-list>
            </v-container>
        </v-card>
      </v-container>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
import Swal from 'sweetalert2'
import EditarProfessor from '@/components/Professores/EditarProfessor.vue'
const h = require("@/config/hosts").hostAPI
const anoletivo = require("@/config/confs").anoletivo

  export default {
    components:{
         EditarProfessor
    },
    data(){
      return {
        token: "",
        filtrar : "",
        pagination: {
            page: 1,
            total: 0,
            perPage: 5,
            visible: 5
        },
        mensagens: [],
        mensagensShow: [],
        anoletivo: anoletivo,
        naovistas: true
      }
    },

    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        
        var response = await axios.get(h + "mensagens/alunos/" + this.utilizador.user + "/recentes?token=" + this.token)
        this.mensagens = response.data
        this.$emit("refreshVistas")
        this.atualizaVistas()
        this.pagination.total = Math.ceil(this.mensagens.length/5)
        this.parseMessages()
    },
    methods: {
      parseMessages: function(){
          this.mensagensShow = []
          for(var i = (this.pagination.page-1)*this.pagination.perPage; i < this.mensagens.length && i < this.pagination.page*this.pagination.perPage; i++){
              this.mensagensShow.push(this.mensagens[i])
          }
      },
      atualizaVistas: function(){
          for(var i = 0; i < this.mensagens.length; i++){
              if(!this.mensagens[i].visto) {
                  this.mensagens[i].visto = !this.mensagens[i].visto
                  this.mensagens[i].nova = true
                  axios.put(h + "mensagens/" + this.mensagens[i].id + "/vista?token=" + this.token)
              }
          }
      },
      showRecentes: async function(){
         var response = await axios.get(h + "mensagens/alunos/" + this.utilizador.user + "/recentes?token=" + this.token)
         this.mensagens = response.data
         this.naovistas = !this.naovistas
         this.$emit("refreshVistas")
         this.atualizaVistas()
         this.pagination.total = Math.ceil(this.mensagens.length/5)
         this.parseMessages()
      },
      showOutras: async function(){
         var response = await axios.get(h + "mensagens/alunos/" + this.utilizador.user + "/antigas?token=" + this.token)
         this.mensagens = response.data
         this.naovistas = !this.naovistas
         this.$emit("refreshVistas")
         this.atualizaVistas()
         this.pagination.total = Math.ceil(this.mensagens.length/5)
         this.parseMessages()
      },
      enviaMensagem: async function(){
          this.novaMensagem.codprofessor = this.utilizador.codigo
          console.log(this.novaMensagem)
          await axios.post(h + "mensagens?token=" + this.token, this.novaMensagem)
          Swal.fire({
            icon: 'success',
            text: 'Mensagem enviada com sucesso.',
            confirmButtonColor: '#009263'
            })
          this.novaMensagem = {text: '', alunos : []}
          var responseM = await axios.get(h + "mensagens/professores/" + this.utilizador.codigo + "?token=" + this.token)
          this.mensagens = responseM.data
      }
    }
  }
</script>