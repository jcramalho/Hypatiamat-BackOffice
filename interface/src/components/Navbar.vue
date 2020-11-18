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
          color="#009263"
          mobile-break-point="991"
          width="260"
          >
          <v-list
            dense
            nav
            class="py-0"
          >
            <v-list-item two-line :class="miniVariant && 'px-0'">
              <v-list-item-avatar>
                <v-icon style="color:#F5F5F5">mdi-account</v-icon>
              </v-list-item-avatar>
                
              <v-list-item-content>
                <v-list-item-title >{{this.nomeUtilizador}}</v-list-item-title>
                <v-list-item-subtitle>Autenticado</v-list-item-subtitle>
              </v-list-item-content>

              <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
            </v-list-item>
            
  
            <v-divider></v-divider>
  
            <v-list-item
              v-for="item in items"
              :key="item.title"
              :to="item.href"
            >
              <v-list-item-icon>
                <v-icon v-if=" item.title != 'Logout' " >{{ item.icon }}</v-icon>
                <v-icon v-else @click="logout()" style="cursor: pointer;">{{ item.icon }}</v-icon>
              </v-list-item-icon>
  
              <v-list-item-content>
                <v-list-item-title v-if=" item.title != 'Logout' ">{{ item.title }}</v-list-item-title>
                <v-list-item-title v-else @click="logout()" style="cursor: pointer;">{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
</nav>
   
  </v-container>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
const host = require("@/config/hosts").host
export default {
  props:[
    'logged'
  ],
  data () {
    return {
      reatividade : "#900000",
      drawer: true,
      mini: true,
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
      nome:""
    }
  },
  created: async function(){
    // src="https://www.hypatiamat.com/imagens/images/backofficeAPP.png"
    let utilizador = JSON.parse(localStorage.getItem("utilizador"))
    if(utilizador.user) this.idUtilizador = utilizador.user
    else this.idUtilizador = utilizador.codigo
    this.nomeUtilizador = utilizador.nome
    this.items = [
        { title: 'Conta', icon: 'mdi-view-dashboard',href:"/" },
        { title: 'Professores', icon: 'mdi-teach', href:"/professores" },
        { title: 'Alunos', icon: 'mdi-account-group', href:"/alunos" },
        { title: 'Escolas', icon: 'mdi-school', href:"/escolas" },
        { title: 'Turmas', icon: 'mdi-book-account', href:"/turmas" },
        { title: 'Minhas Turmas', icon: 'mdi-book-account', href:"/minhasturmas" },
        { title: 'Terminar sessão', icon: 'mdi-logout'}
    ]
  },
  computed: {
    bg () {
      return this.background ? 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg' : undefined
    },
  },
  methods:{

    logout: function(){
      if(confirm("De certeza que pretende terminar sessão?")){
        localStorage.removeItem("utilizador");
        localStorage.removeItem("type");
        localStorage.removeItem("token");
        this.$emit('refreshLogout')
        this.color = "#900001"
      }
    },
    isLogged: function(){
      if (localStorage.getItem("token") == null) {
      return false
      } else {
      return true
      }
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