<template>

  <v-app id="app"  :key="viewKey">
    
    <router-view v-if="this.$route.name=='Novidades' || this.$route.name=='Registar'" @login="login"> 
    </router-view>

    <Auth v-else-if="loggedIn" @refreshLogout="refreshLogout" :storage="storage" />

    <Login v-else-if="!mode"  @refreshLogout="refreshLogout" @registar="registar"  />
     
    <Registar v-else @login="login"/>

  </v-app>
</template>

<script>

import Swal from 'sweetalert2'
import Auth from '@/views/AuthApp.vue'
import Login from '@/views/Login.vue'
import Registar from '@/views/Registar.vue'
import Novidades from '@/views/Novidades/Novidades.vue'
import axios from 'axios'
import { ResponsiveDirective } from "vue-responsive-components"
import jwt_decode from "jwt-decode";
var CrossStorageClient = require('cross-storage').CrossStorageClient;
var CrossStorageHub = require('cross-storage').CrossStorageHub;
const host = require('@/config/hosts').host
const h = require("@/config/hosts").hostAPI

export default {
    components: {
    Auth,
    Login,
    Registar,
    Novidades,
    },
    directives: {
    responsive: ResponsiveDirective
  },
     data() {

        return {
          color :"#eee",
          viewKey: 0,
          loggedIn : false,
          mode : false,
          storage: '',
          storageConnected: false,
        }
    },
    created: async function(){
      var aux = false
      var self = this
      axios.interceptors.response.use((response) => {
        return response
      }, function (error) {
            
        if( error.response.status === 401 ){
          localStorage.removeItem("token")
          localStorage.removeItem("type")
          localStorage.removeItem("utilizador")
          //this.bifrostCors.deleteLocalStorage(["token", "type", "utilizador"])
          Swal.fire({
                  icon: 'info',
                  text: "A sua sessão expirou.",
                  confirmButtonColor: '#009263'
                }) 
          self.refreshLogout()
          window.location.href = './';
        }
      });

      CrossStorageHub.init([
        {origin: /localhost:8081$/, allow: ['get', 'set', 'del', 'getKeys', 'clear']},
        {origin: /hypatiamat.com$/, allow: ['get', 'set', 'del', 'clear']},
      ]);

      this.storage = new CrossStorageClient("http://localhost:8081", {
        timeout: 5000,
      });

      await this.storage.onConnect();


      this.refreshLogout()


      var response = await axios.get(h + "login/interface")
      localStorage.setItem("tokenInterface", response.data.token)


    },
    computed:{
      haveToken(){
        return localStorage.getItem('token') != null
      }
    },
    methods: {
          teste(){
            console.log(this.$route)
            console.log(this.$route.name)
            return true
          },
          isLogged: function(){
            var token = localStorage.getItem("token")
            if (token == null) {
              var self = this
              this.storage.get('token')
                          .then(jwt => {
                            if(jwt){
                             localStorage.setItem("token", jwt)
                             self.resfreshLogout()
                            }
                          })
            }
            else{ 
              var utilizador = localStorage.getItem("utilizador")
              if(utilizador) return true
              else{ 
                var decode_token = jwt_decode(token)
                if(decode_token.user && decode_token.user.type){
                  if(decode_token.user.type == 'professor') decode_token.user.type = 20
                  else if(decode_token.user.type == 'aluno') decode_token.user.type = 10
                  
                  localStorage.setItem('utilizador', JSON.stringify(decode_token.user))
                  localStorage.setItem('type', type)

                  return true
                }
                else return false
              }
            }
          },
          refreshLogout: function(){
            this.loggedIn = this.isLogged()
            this.viewKey ++;
          },
          registar: function(){
            this.mode = true
          },
          login: function(){
            if(this.$route.name == 'Registar') this.$router.push({path: "/"})
            this.mode = false
          }
    }
}
</script>

<style lang="scss">
.item {
  display: flex;
}
.item.small {
  flex-direction: column;
}
</style>