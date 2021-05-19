<template>

  <v-app id="app"  :key="viewKey">
    
    <router-view v-if="this.$route.name=='Novidades'"> 
    </router-view>

    <Auth v-else-if="loggedIn" @refreshLogout="refreshLogout" />

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
        }
    },
    watch: {
  /* $route(to) {
     document.title = `${to.meta.title}`;
     const link = document.querySelector("[rel='icon']")
     link.setAttribute('href',to.meta.icon)
  }*/
},
    created: function(){
      var aux = false
      var self = this
      axios.interceptors.response.use((response) => {
        return response
      }, function (error) {
            
        if( error.response.status === 401 ){
          localStorage.removeItem("token")
          localStorage.removeItem("type")
          localStorage.removeItem("utilizador")
          Swal.fire({
                  icon: 'info',
                  text: "A sua sessão expirou.",
                  confirmButtonColor: '#009263'
                }) 
          self.refreshLogout()
          window.location.href = './';
        }

      });
      
      this.refreshLogout()
    },
    methods: {
          teste(){
            console.log(this.$route)
            console.log(this.$route.name)
            return true
          },
          isLogged: function(){
            var token = localStorage.getItem("token")
            if (token == null) return false
            else return true
          },
          refreshLogout: function(){
            this.loggedIn = this.isLogged()
            this.viewKey ++;
          },
          registar: function(){
            this.mode = true
          },
          login: function(){
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