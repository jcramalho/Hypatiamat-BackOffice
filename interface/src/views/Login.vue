<template>
  
    <v-layout row class="text-xs-center pa-lg-16" justify-center align-center  >
      <v-flex xs3>
        <v-img src="https://www.hypatiamat.com/imagens/images/backofficeAPP.png" width="350px">
        </v-img>
      </v-flex>
      <v-flex xs3>
        
          <v-card class="pa-5" style="background-color: #d8dbd7;">
              <v-card-title class="justify-center" style="text-color: #d8dbd7;">
                Autenticação
              </v-card-title>
              <v-form>
              <v-layout row>
                <v-flex xs11>
              <v-text-field prepend-icon="mdi-account" color="#009263" v-model="user" name="Username" label="Username" type="text" ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
              <v-flex xs11>
              <v-text-field v-if="showPassword" color="#009263" prepend-icon="mdi-key" v-model="password" name="Password" label="Password" type="text"></v-text-field>
              <v-text-field v-else color="#009263" prepend-icon="mdi-key" v-model="password" name="Password" label="Password" type="password"></v-text-field>
              </v-flex>
              <v-flex xs1 class="pa-4">
              <v-icon v-if="showPassword" color="#009263" @click="showPassword=!showPassword">mdi-eye-off</v-icon>
              <v-icon v-else color="#009263" @click="showPassword=!showPassword">mdi-eye</v-icon>
              </v-flex>
              </v-layout>
              <v-card-actions>
                <v-btn class="white--text" primary large block style="background-color: #009263;" @click="login">Login</v-btn>
              </v-card-actions>
              </v-form>
              <center><v-text> Ainda não possuí conta? </v-text> <span class="font-weight-bold black--text" @click="registar()" style="cursor: pointer;" > Registe-se aqui! </span></center>
          </v-card>
          
        
      </v-flex>
    </v-layout>
  
</template>



<script>
import axios from "axios"
import Swal from 'sweetalert2'
const h = require("@/config/hosts").hostAPI

import VueJwtDecode from "vue-jwt-decode";
import { ResponsiveDirective } from "vue-responsive-components"


  export default {
    data(){
      return {
        user : "",
        password : "",
        showPassword: false
      }
    },

  directives: {
    responsive: ResponsiveDirective
  },
    methods: {
      login: async function () {
        try {

        if(this.user != "" && this.password != ""){
          let response = await axios.post(h + "login", {user: this.user, password: this.password});
          if(!response.data.authentication){
            this.password = ""
            Swal.fire({
              icon: 'error',
              confirmButtonColor: '#009263',
              title: 'Credenciais erradas',
              width:450,
            })
            return;
          } 
          let token = response.data.token;
          if (token) {
            localStorage.setItem("type", JSON.stringify(response.data.type))
            var aux = VueJwtDecode.decode(token)
            localStorage.setItem("utilizador", JSON.stringify(aux.user))
            //let utilizador = JSON.parse(localStorage.getItem("utilizador"))
            localStorage.setItem("token", token);
            Swal.fire({
              icon: 'success',
              confirmButtonColor: '#009263',
              title: 'Login efetuado com sucesso.',
              width:450,
            })
            this.$emit("refreshLogout")
          }
        }
        else Swal.fire({
              icon: 'error',
              confirmButtonColor: '#009263',
              title: 'Não preencheu os dois campos!',
              width:450,
            })
    
       } 
       catch (err) {
        this.password = ""
        alert(err)
      }
      },
      registar: function(){
        this.$emit("registar");
      }
    }
  }
</script>