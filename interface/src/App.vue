<template>
  <v-app id="app" :key="viewKey">
    
    <div v-if="loggedIn">
    <Auth  @refreshLogout="refreshLogout" />
    </div>
    <div v-else>
      <div v-if="!mode" v-responsive="{ small: el => el.width <= 500 }">
      <Login  @refreshLogout="refreshLogout" @registar="registar"  />
      </div>
      <div v-else>
      <Registar @login="login"/>
      </div>
    </div>
  </v-app>
</template>

<script>

import Swal from 'sweetalert2'
import Auth from '@/views/AuthApp.vue'
import Login from '@/views/Login.vue'
import Registar from '@/views/Registar.vue'
import axios from 'axios'
import { ResponsiveDirective } from "vue-responsive-components"




export default {
    components: {
    Auth,
    Login,
    Registar,
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