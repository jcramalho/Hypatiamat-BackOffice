<template>
<div class="grey lighten-3"> 

    <Navbar @refreshLogout="refreshLogout" @miniEvent="(value)=>{this.mini=value}" :mensagensLer="mensagensLer"/>


    <keep-alive v-if="mobile" include="EstatisticasMunicipios">
      <router-view v-if="mobile" @refreshVistas="mensagensLer = 0"/>
    </keep-alive>
    <v-main v-else class="grey lighten-3">
      <p :style="styleP"> Dado que se encontra no telemóvel ou num dispositivo pequeno, para visualizar os dados de forma clara, <b> minimize a barra de navegação </b> através do botão <span :style="styleP">&#8918;</span> . </p> 
    </v-main>

</div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Views from '@/components/View.vue'
import Swal from 'sweetalert2'
import axios from "axios"
const h = require("@/config/hosts").hostAPI

export default {
  components:{
    Navbar,
    Views
  },
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
      interval: undefined
    }
  },
  computed: {
    mobile() {
      if (this.$vuetify.breakpoint.xs) return this.mini
      return true
    },
  },
  watch:{

  },
  created: async function(){
    var utilizador = JSON.parse(localStorage.getItem("utilizador"))
    this.token = localStorage.getItem("token")
    this.windowWidth = window.innerWidth
    this.size()
    if(utilizador.type == 10){
      var response = await axios.get(h + "mensagens/alunos/" + utilizador.user + "/number/naovistas?token=" + this.token)
      this.mensagensLer =  response.data.number 
      this.oldNovasMensagensLer = this.mensagensLer
      if(this.mensagensLer > 0){
        Swal.fire({
          icon: 'warning',
          text: 'Tem ' + this.mensagensLer + ' mensagens por ler.',
          confirmButtonColor: '#009263'
        })
        this.interval = setInterval(async () => {
          var response = await axios.get(h + "mensagens/alunos/" + utilizador.user + "/number/naovistas?token=" + this.token)
          this.mensagensLer =  response.data.number 
          if(this.mensagensLer - this.oldNovasMensagensLer > 0){
            Swal.fire({
              icon: 'warning',
              text: 'Tem mais ' + (this.mensagensLer - this.oldNovasMensagensLer) + ' novas mensagens por ler.',
              confirmButtonColor: '#009263'
            })
          }
          this.oldNovasMensagensLer = this.mensagensLer
        }, 3* 60 * 1000)
      }
      
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
