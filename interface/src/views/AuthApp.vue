<template>
<div class="grey lighten-3"> 

    <Navbar @refreshLogout="refreshLogout" @miniEvent="(value)=>{this.mini=value}" :mensagensLer="mensagensLer" :storage="storage"/>


    <keep-alive :include="cacheItens" :max="10">
      <router-view :key="$route.fullPath" 
          @refreshVistas="mensagensLer = 0" @refreshLogout="refreshLogout"></router-view>
    </keep-alive>
    <!--
    <v-main v-else class="grey lighten-3">
      <p :style="styleP"> Dado que se encontra no telemóvel ou num dispositivo pequeno, para visualizar os dados de forma clara, <b> minimize a barra de navegação </b> através do botão <span :style="styleP">&#8918;</span> . </p> 
    </v-main>
    -->
</div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Views from '@/components/View.vue'
import Swal from 'sweetalert2'
import axios from "axios"
const h = require("@/config/hosts").hostAPI
const hostCromos = require("@/config/hosts").hostCromos

export default {
  components:{
    Navbar,
    Views
  },
  props:["storage"],
  data(){
      return {
      color: "#FF0000",
      mini:true,
      miniVariant: false,
      windowWidth: 0,
      styleP: 'font-size:20px',
      mensagensLer:0,
      oldNovasMensagensLer: 0, 
      token: "",
      interval: undefined,
      utilizador: {},
      cacheItens: ['JogosMunicipios', 'JogosEscolas', 'JogosProfessores', 'JogosTurmas',
                   'AppsMunicipios', 'AppsEscolas', 'AppsProfessores', 'AppsTurmas',
                   'EstatisticasMunicipios', 'EstatisticasAgrupamentos', 'EstatisticasProfessores',
                   'CampeonatosMunicipios', 'CampeonatosAgrupamentos', 'CampeonatosProfessores', 'CampeonatosTurmas',
                   'RankingApps', 'RankingAppsAdmin', 'RankingAppsAgrupamento', 'RankingAppsMunicipio',
                   'RankingJogos', 'RankingJogosAdmin', 'RankingJogosAgupamento', 'RankingJogosMunicipio']
    }
  },
  computed: {
    mobile() {
      if(localStorage.getItem("token") && localStorage.getItem("utilizador") && localStorage.getItem("type")){
        if (this.$vuetify.breakpoint.xs) return this.mini
        return true
      }
      else {
        this.refreshLogout()
        return true
      }
    },
  },
  created: async function(){
    this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
    this.token = localStorage.getItem("token")
    this.windowWidth = window.innerWidth
    this.size()
    if(this.utilizador.type == 10){
      this.getNovosCromos()
      var response = await axios.get(h + "mensagens/alunos/" + this.utilizador.user + "/number/naovistas?token=" + this.token)
      this.mensagensLer =  response.data.number 
      this.oldNovasMensagensLer = this.mensagensLer
      if(this.mensagensLer > 0){
        Swal.fire({
          icon: 'warning',
          text: 'Tem ' + this.mensagensLer + ' mensagens por ler.',
          confirmButtonColor: '#009263'
        })
        
      }
      /*
      var self = this
      this.interval = setInterval(async function(){
          
          var response = await axios.get(h + "mensagens/alunos/" + self.utilizador.user + "/number/naovistas?token=" + self.token)
          self.mensagensLer =  response.data.number 
          if(self.mensagensLer - self.oldNovasMensagensLer > 0){
            Swal.fire({
              icon: 'warning',
              text: 'Tem mais ' + (self.mensagensLer - self.oldNovasMensagensLer) + ' novas mensagens por ler.',
              confirmButtonColor: '#009263'
            })
          }
          self.oldNovasMensagensLer = self.mensagensLer
        }, 10000)*/
      
    }
  },
  mounted: function(){
    window.onresize = () => {
      this.size()
    }
  },
  methods:{
    refreshLogout : function(){
      clearInterval(this.interval)
      this.$emit("refreshLogout")
    },
    size(){
        if(window.innerWidth > 500){
          this.styleP = 'font-size:20px'
        }
        else if(window.innerWidth > 400){
          this.styleP = 'font-size:16px'
        }
        else{
          this.styleP = 'font-size:9px'
        }
    },
    getNovosCromos: async function(){
      var response = await axios.get(hostCromos + "novos/alunos/" + this.utilizador.user + "?token=" + this.token)
      var novosCromos = response.data.novosCromos
      if(novosCromos.length > 0){
        var htmlCode = '<p><center><h1> Parabéns! </h1></center></p>'
        for(var i = 0; i < novosCromos.length; i++){
          var cromoGanho = novosCromos[i]
          if(cromoGanho.freq) htmlCode += '<p> Ganhou o cromo <b>' + cromoGanho.numero + '</b> ' + cromoGanho.freq + ' vez(es). </p>'
          else htmlCode += '<p> Ganhou o cromo <b>' + cromoGanho.numero + '</b>. </p>'
        }
        Swal.fire({
          icon: 'success',
          html: htmlCode,
          confirmButtonColor: '#009263'
        })
      }
    }, 
    atualizaNovasMensagens: async function(){
      var response = await axios.get(h + "mensagens/alunos/" + utilizador.user + "/number/naovistas?token=" + this.token)
      this.mensagensLer =  response.data.number 
      this.oldNovasMensagensLer = this.mensagensLer
      if(this.mensagensLer > 0){
        Swal.fire({
          icon: 'warning',
          text: 'Tem ' + this.mensagensLer + ' mensagens por ler.',
          confirmButtonColor: '#009263'
        })
      }
    },
  }

}
</script>
