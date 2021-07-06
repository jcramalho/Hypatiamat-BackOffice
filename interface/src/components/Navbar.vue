<template>
<v-container v-if="isLogged()" v-model="reatividade">
<nav>

  <v-navigation-drawer 
          v-model="drawer"
          dark
          app
          :mini-variant.sync="mini"
          permanent
          floating
          height="100%"
          color="#009263"
          mobile-breakpoint="991"
          >
          <v-list
            dense
            nav
            class="py-0"
          >
            <v-list-item two-line :class="miniVariant && 'px-0'">
              <v-list-item-icon >
                <v-icon style="color:#F5F5F5">mdi-account</v-icon>
              </v-list-item-icon>
                
              <v-list-item-content>
                <v-list-item-title >{{this.idUtilizador}}</v-list-item-title>
                <v-list-item-subtitle>Autenticado</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
              <v-btn
                icon
                @click.stop="mini = !mini"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              </v-list-item-action>
            </v-list-item>
            
  
            <v-divider></v-divider>
  
            <v-list-item
              v-for="item in items"
              :key="item.title"
              :to="item.href"
            >
              <v-list-item-icon>
                <v-icon v-if="item.title != 'Terminar Sessão' && item.title != 'Mensagens' && item.title != 'TPC Hypatiamat'" >{{ item.icon }} </v-icon>
                <v-icon v-else-if="item.title == 'Terminar Sessão'" @click="logout()" style="cursor: pointer;">{{ item.icon }}</v-icon>
                <v-icon v-else-if="item.title == 'TPC Hypatiamat'" @click="goToTPC()" style="cursor: pointer;">{{ item.icon }}</v-icon>
                <v-icon v-else-if="item.title == 'Mensagens'">{{ item.icon }}</v-icon>
              </v-list-item-icon>
  
              <v-list-item-content>
                <v-list-item-title v-if=" item.title != 'Terminar Sessão' && item.title != 'Mensagens' && item.title != 'TPC Hypatiamat'" >{{ item.title }}</v-list-item-title>
                <v-list-item-title v-else-if="item.title == 'Terminar Sessão'" @click="logout()" style="cursor: pointer;">{{ item.title }}</v-list-item-title>
                <v-list-item-title v-else-if="item.title == 'TPC Hypatiamat'" @click="goToTPC()" style="cursor: pointer;">{{ item.title }}</v-list-item-title>
                <v-list-item-title v-else-if="item.title == 'Mensagens'">{{ item.title }} 
                  <v-icon v-if="mensagensLer > 0 && mensagensLer < 9"> mdi-numeric-{{mensagensLer}}-circle-outline </v-icon>
                  <v-icon class="pr-0" v-else-if="mensagensLer > 0">mdi-numeric-9-plus-circle-outline</v-icon>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <template v-slot:append>
            <div class="pa-2" >
              <span v-if="mini" class="white--text" style="font-size:12px" >
               <b> {{versao}} </b>
              </span>
              <span v-else class="white--text" style="font-size:12px" >
               <b> Versão {{versao}} </b>
              </span>
            </div>
          </template>
        </v-navigation-drawer>
</nav>
   
  </v-container>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
import Swal from 'sweetalert2'
const host = require("@/config/hosts").host
const hostTPC = require("@/config/hosts").hostTPC

export default {
  props:[
    'logged', 'mensagensLer', 'storage'
  ],
  data () {
    return {
      reatividade : "#900000",
      drawer: true,
      mini: false,
      items: [
      ],
      color: '#900000',
      colors: [
        'primary',
        'blue',
        'success',
        'red',
        'teal',
      ],
      right: false,
      miniVariant: false,
      expandOnHover: false,
      background: false,
      idUtilizador:"",
      nomeUtilizador:"",
      nome:"",
      versao: "2.9"
    }
  },
  watch: {
    mini: function(){
      //console.log(this.mini)
      this.$emit("miniEvent", this.mini)
    },
  },
  created: async function(){
    // src="https://www.hypatiamat.com/imagens/images/backofficeAPP.png"
    let utilizador = JSON.parse(localStorage.getItem("utilizador"))
    if(utilizador.user) this.idUtilizador = utilizador.user
    else this.idUtilizador = utilizador.codigo
    this.nomeUtilizador = utilizador.nome
    this.$emit("miniEvent", this.mini)
    if(utilizador.type == 50){
      // Admin   
      this.items = [
        { title: 'Conta', icon: 'mdi-view-dashboard',href:"/" },
        { title: 'Quarentena', icon: 'mdi-account-clock',href:"/pendentes" },
        { title: 'Professores Pendentes', icon: 'mdi-account-clock', href:"/profspendentes" },
        { title: 'Professores Ativos', icon: 'mdi-teach', href:"/professores" },
        { title: 'Códigos Professores', icon: 'mdi-barcode', href:"/codigosprof" },
        { title: 'Alunos', icon: 'mdi-account-group', href:"/alunos" },
        { title: 'Agrupamentos', icon: 'mdi-school', href:"/escolas" },
        { title: 'Gestão de Turmas', icon: 'mdi-book-account', href:"/turmas" },
        { title: 'Comunidades', icon: 'mdi-google-circles-communities', href:"/comunidades" },
        { title: 'Gestão de Campeonatos', icon: 'mdi-table-edit', href:"/gestao/campeonatos"},
        { title: 'Gestão de Novidades', icon: 'mdi-newspaper', href:"/novidades" },
        { title: 'Gestão de Cromos', icon: 'mdi-book-open-page-variant-outline', href:"/gestao/cromos" },
        { title: 'Monitorização de Jogos', icon: 'mdi-gamepad-variant', href:"/jogos/municipios"},
        { title: 'Monitorização de Apps', icon: 'mdi-apps', href:"/apps/municipios"},
        { title: 'Ranking Jogos', icon: 'mdi-podium', href:"/classificacoes/jogos/admin"},
        { title: 'Ranking Apps', icon: 'mdi-trophy-award', href:"/classificacoes/apps/admin"},
        { title: 'Outras Estatísticas', icon: 'mdi-home-analytics', href:"/estatisticas/municipios"},
        { title: 'Campeonatos', icon: 'mdi-trophy', href:"/campeonatos/municipios"},
        { title: 'TPC Hypatiamat', icon: 'mdi-web', ref: hostTPC},
        { title: 'Terminar Sessão', icon: 'mdi-logout'}
      ]
    }
    else if(utilizador.type == 20 || utilizador.type == 5) {
      // Professor
      this.items = [
        { title: 'Conta', icon: 'mdi-view-dashboard',href:"/" },
        { title: 'Enviar Mensagem', icon: 'mdi-message-reply-text-outline', href:"/professores/mensagens"},
        { title: 'Gestão de Turmas', icon: 'mdi-book-account', href:"/gestaoTurmas" },
        { title: 'Gestão de Alunos', icon: 'mdi-account-group', href:"/gestaoAlunos" },
        { title: 'Desempenho de Alunos', icon: 'mdi-star-face', href:"/desempenho/" + utilizador.codigo + "/turmas" },
        { title: 'Monitorização de Jogos', icon: 'mdi-gamepad-variant', href:"/jogos/" + utilizador.codigo },
        { title: 'Monitorização de Apps', icon: 'mdi-apps', href:"/apps/" + utilizador.codigo},
        { title: 'Ranking Jogos', icon: 'mdi-podium', href:"/classificacoes/jogos"},
        { title: 'Ranking Apps', icon: 'mdi-trophy-award', href:"/classificacoes/apps"},
        { title: 'Campeonatos', icon: 'mdi-trophy', href:"/campeonatos/professores/" + utilizador.codigo},
        { title: 'TPC Hypatiamat', icon: 'mdi-web', ref: hostTPC}, 
        { title: 'Terminar Sessão', icon: 'mdi-logout'}
      ]
    }
    else if(utilizador.type == 10 || utilizador.type == 3){
      // Aluno
      this.items = [
        { title: 'Conta', icon: 'mdi-view-dashboard',href:"/" },
        { title: 'Desempenho nos Jogos', icon: 'mdi-gamepad-variant',href:"/jogosAluno" },
        { title: 'Desempenho nas Apps', icon: 'mdi-apps', href:"/appsAluno"},
        { title: 'Campeonatos', icon: 'mdi-podium', href:"/campeonatos/alunos/" + utilizador.user},
        { title: 'Mensagens', icon: 'mdi-message-reply-text-outline', href:"/alunos/mensagens"},
        { title: 'Caderneta de Cromos', icon: 'mdi-book-open-page-variant-outline', href:"/alunos/cromos"},
        { title: 'TPC Hypatiamat', icon: 'mdi-web', ref: hostTPC},
        { title: 'Terminar Sessão', icon: 'mdi-logout'}
      ]
    }
    else if(utilizador.type == 30){
      // Municipio
      this.items =[
        { title: 'Conta', icon: 'mdi-view-dashboard',href:"/" },
        { title: 'Meus Agrupamentos', icon: 'mdi-school', href:"/agrupamentos" },
        { title: 'Monitorização de Jogos', icon: 'mdi-gamepad-variant', href:"/jogos/"+ utilizador.infoEscola.localidade +"/escolas" },
        { title: 'Monitorização de Apps', icon: 'mdi-apps', href:"/apps/" + utilizador.infoEscola.localidade + "/escolas"},
        { title: 'Ranking Jogos', icon: 'mdi-podium', href:"/classificacoes/jogos/municipio"},
        { title: 'Ranking Apps', icon: 'mdi-trophy-award', href:"/classificacoes/apps/municipio"},
        { title: 'Outras estatísticas', icon:'mdi-home-analytics', href:"/estatisticas/municipios/" + utilizador.infoEscola.localidade},
        { title: 'Campeonatos', icon: 'mdi-trophy', href:"/campeonatos/municipios/" + utilizador.infoEscola.localidade},
        { title: 'TPC Hypatiamat', icon: 'mdi-web', ref: hostTPC},
        { title: 'Terminar Sessão', icon: 'mdi-logout'}
      ]
    }
    else if(utilizador.type == 40){
      // Agrupamento
      this.items =[
        { title: 'Conta', icon: 'mdi-view-dashboard',href:"/" },
        { title: 'Meus Professores', icon: 'mdi-teach', href:"/escolas/" + utilizador.escola +  "/professores" },
        { title: 'Monitorização de Jogos', icon: 'mdi-gamepad-variant', href:"/escolas/"+ utilizador.escola + "/jogos" },        
        { title: 'Monitorização de Apps', icon: 'mdi-apps', href:"/escolas/"+ utilizador.escola + "/apps" },
        { title: 'Ranking Jogos', icon: 'mdi-podium', href:"/classificacoes/jogos/escola"},
        { title: 'Ranking Apps', icon: 'mdi-trophy-award', href:"/classificacoes/apps/escola"},
        { title: 'Outras estatísticas', icon:'mdi-home-analytics', href:"/estatisticas/escolas/" + utilizador.escola},
        { title: 'Campeonatos', icon: 'mdi-trophy', href:"/campeonatos/escolas/" + utilizador.escola},
        { title: 'TPC Hypatiamat', icon: 'mdi-web', ref: hostTPC},
        { title: 'Terminar Sessão', icon: 'mdi-logout'}
      ]
    }
  },
  computed: {
    bg () {
      return this.background ? 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg' : undefined
    },
  },
  methods:{

    logout: function(){
      Swal.fire({
          title: "De certeza que pretende terminar sessão?",
          showDenyButton: true,
          confirmButtonColor: '#009263',
          confirmButtonText: `Sim`,
          denyButtonText: `Não`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            localStorage.removeItem("utilizador");
            localStorage.removeItem("type");
            localStorage.removeItem("token");
            //this.bifrostCors.deleteLocalStorage(["token", "type", "utilizador"])
            if(this.storage) this.storage.clear();
            this.$emit('refreshLogout')
            this.color = "#900001"
          }
        })
    },
    isLogged: function(){
      if (localStorage.getItem("token") == null) {
        return false
      } else {
       return true
      }
    },
    navBarAberta: function(){

    },
    goToTPC: function(){
      //window.open(hostTPC)
      window.location.href = hostTPC
    }
  }
}
</script>


<style lang="scss">
  #app-drawer {
    .v-list__tile {
      border-radius: 4px;

      &--buy {
        margin-top: auto;
        margin-bottom: 17px;
      }
    }
  }
</style>