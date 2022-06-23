<template>

  <v-app id="app"  :key="viewKey">
    
    <v-container v-if="loading">
      <center>
        <v-img
          class="align-center"
          :src="require('@/assets/loading.gif')"
          width="250px"
          heigth="250px"
        >
        </v-img>
      </center>
    </v-container>
    
    <div v-else>
      <router-view v-if="this.$route.name=='Novidades' || this.$route.name=='Registar'" @login="login"> 
      </router-view>

      <Auth v-else-if="loggedIn" @refreshLogout="refreshLogout" :storage="storage" />

      <Login v-else-if="!mode"  @refreshLogout="refreshLogout" @registar="registar"  />
      
      <Registar v-else @login="login"/>
    </div>

  </v-app>
</template>

<script>

import Vue from 'vue'
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
const hostTPC = require('@/config/hosts').hostTPC
const h = require("@/config/hosts").hostAPI
const storageHosts = require("@/config/hosts").storageHosts

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
          loading: true
        }
    },
    created: async function(){
      var aux = false
      var self = this

      if (Vue.$cookies.isKey("token") && !localStorage.getItem('token')) {
        let tokenTemp = Vue.$cookies.get("token")
        localStorage.setItem("token", tokenTemp)
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem('token');
      }
      else {
        console.log("no token?")
      }

      this.getTokenInterface()

      CrossStorageHub.init(storageHosts);

      axios.interceptors.response.use((response) => {
        return response
      }, function (error) {
            
        if( error.response.status === 401 ){
          localStorage.removeItem("token")
          localStorage.removeItem("type")
          localStorage.removeItem("utilizador")
          Vue.$cookies.remove("token")
          if(self.storageConnected){ self.storage.clear()}
          //this.bifrostCors.deleteLocalStorage(["token", "type", "utilizador"])
          Swal.fire({
                  icon: 'info',
                  text: "A sua sessão expirou.",
                  confirmButtonColor: '#009263'
                }) 
          self.refreshLogout()
          window.location.href = 'http://localhost:12090';
        }
      });

      await this.refreshLogout()

      
      try { 
        this.storage = new CrossStorageClient(hostTPC, {
          timeout: 2000,
        });

        await this.storage.onConnect() 
                          .then(() => {
                            console.log("Connection com tpc feita...")
                            self.storageConnected = true;
                            this.loading = false
                            }
                          );
        

        if(!this.loggedIn) this.refreshLogout()
      }
      catch(error){
        self.storageConnected = false
        this.loading = false
        console.log("connection com tpc falhou...")
      }


    },
    computed:{
      haveToken(){
        return localStorage.getItem('token') != null
      }
    },
    methods: {
          getTokenInterface: async function(){
            var response = await axios.get(h + "login/interface")
            localStorage.setItem("tokenInterface", response.data.token)
          },  
          teste(){
            console.log(this.$route)
            console.log(this.$route.name)
            return true
          },
          isLogged: async function(){
            var token = localStorage.getItem("token")
            if (token == null) {
              var aux_token = await this.getTokenFromTPC()
              if(aux_token){
                var decode_token = jwt_decode(aux_token)
                localStorage.setItem("token", aux_token)
                if(decode_token.user && decode_token.user.type){
                    await this.decodeUser(decode_token)
                    return true
                }
                else return false
              }
              else return false
            }
            else{ 
              var utilizador = JSON.parse(localStorage.getItem("utilizador"))
              var type = JSON.parse(localStorage.getItem("type"))
              var decode_token = jwt_decode(token)
              if(utilizador && type) {
                if(utilizador.type == type && type == decode_token.user.type) return true
                else {
                  // caso alguém tente alterar o type no localStorage
                  this.removeItems()
                  return false
                }
              }
              else{ 
                if(decode_token.user && decode_token.user.type){
                    await this.decodeUser(decode_token)
                    return true
                }
                else {
                  localStorage.removeItem("token")
                  Vue.$cookies.remove("token")
                  window.location.href = 'http://localhost:12090'
                  return false
                }
              }
            }
          },
          getTokenFromTPC: async function(){
            if(this.storageConnected){
              return this.storage.get('token')
                            .then(jwt => {return jwt})
                            .catch(() => {return null})
            }
            else return null
          },
          decodeUser: async function(decode_token){
            localStorage.setItem('utilizador', JSON.stringify(decode_token.user))
            localStorage.setItem('type', decode_token.user.type)
          },
          removeItems: function(){
            localStorage.removeItem("token")
            localStorage.removeItem("utilizador")
            localStorage.removeItem("type")
            Vue.$cookies.remove("token")
            window.location.href = 'http://localhost:12090'
          },
          refreshLogout: async function(){
            this.loggedIn = await this.isLogged()
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