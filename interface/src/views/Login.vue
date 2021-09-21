<template>
  <div class="grey lighten-3">
    <v-main class="grey lighten-3">  
    <v-row class="text-xs-center pa-lg-16" justify-center align-center  >
      <v-col class="justify-center" cols="12" xs="12" sm="12" md="12" lg="12" xl="3">
      </v-col>
      <v-col class="justify-center" align-self="center" cols="12" xs="12" sm="12" md="6" lg="6" xl="3" fill-heigth>
        <center>
        <v-img 
          v-if="small"
          src="https://www.hypatiamat.com/imagens/images/backofficeAPP.png"
          lazy-src="https://www.hypatiamat.com/imagens/images/backofficeAPP.png"
          max-height="15%"
          width="55%"
          >
        </v-img>
        <v-img 
          v-else
          src="https://www.hypatiamat.com/imagens/images/backofficeAPP.png"
          lazy-src="https://www.hypatiamat.com/imagens/images/backofficeAPP.png"
          max-height="30%"
          width="75%"
          >
        </v-img>
        </center>
      </v-col>
      <v-col class="justify-center" cols="12" xs="12" sm="12" md="6" lg="6" xl="3">
        <v-container :v-bind:style="[small ? 'width:60%;' : 'width:10%;']">
        <v-row>
          <v-col cols="12">
          <v-card class="pa-4" rounded outlined>
              <v-card-title class="justify-center green--text" >
                <b>Autenticação</b>
              </v-card-title>
              
              <v-form>
              <v-row>
                <v-col cols="12">
              <v-text-field prepend-icon="mdi-account" v-on:keyup.enter="login" color="#009263" v-model="user" name="Username" label="Username" type="text" ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
              <v-col class="d-flex" xs="12" sm="12" md="12" lg="12" xl="12">
              <v-text-field v-if="showPassword" v-on:keyup.enter="login" color="#009263" prepend-icon="mdi-key" v-model="password" name="Password" label="Password" type="text"></v-text-field>
              <v-text-field v-else color="#009263" v-on:keyup.enter="login" prepend-icon="mdi-key" v-model="password" name="Password" label="Password" type="password"></v-text-field>
              <v-icon class="pl-2" v-if="showPassword"  color="#009263" @click="showPassword=!showPassword">mdi-eye-off</v-icon>
              <v-icon class="pl-2" v-else color="#009263" @click="showPassword=!showPassword">mdi-eye</v-icon>
              </v-col>
              </v-row>
              <v-card-actions>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-btn class="white--text" primary large block style="background-color: #009263;" @click="login">Login</v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-btn class="text-none" block style="color: #009263;" text @click="loginAlunoVisitante">Entrar como aluno visitante</v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-btn class="text-none" block style="color: #009263;" text @click="loginProfVisitante">Entrar como professor visitante</v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
              </v-form>
              <center><span> Ainda não possuí conta? </span> <span class="font-weight-bold green--text" @click="registar()" style="cursor: pointer;" > Registe-se aqui! </span></center>
          </v-card>
          </v-col>     
        </v-row>   
        </v-container>
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="3">
      </v-col>
    </v-row>
    <Footer  class="grey lighten-3" />
    </v-main>
    </div>
</template>



<script>
import axios from "axios"
import Swal from 'sweetalert2'
const h = require("@/config/hosts").hostAPI

import jwt_decode from "jwt-decode";
import Footer from '../components/Footer.vue';


  export default {
  components: { Footer },
    data(){
      return {
        user : "",
        password : "",
        showPassword: false
      }
    },

  computed:{
    small() {
      if (this.$vuetify.breakpoint.sm) return true
      return false
    },
  },
    methods: {
      login: async function () {
        try {

        if(this.user != "" && this.password != ""){
          let response = await axios.post(h + "login", {user: this.user, password: this.password});
          if(!response.data.authentication){
            this.password = ""
            let message = 'Credenciais erradas'
            if(!response.data.valido) message = 'As suas credenciais não são válidas.\nPor favor contacte: associacaohypatiamat@gmail.com'
            Swal.fire({
              icon: 'error',
              confirmButtonColor: '#009263',
              title: message,
              width:450,
            })
            return;
          } 
          let token = response.data.token;
          if (token) {
            localStorage.setItem("type", JSON.stringify(response.data.type))
            var aux = jwt_decode(token)
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
            this.$router.push({name: "Meu Perfil"})
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
      loginAlunoVisitante: async function(){
        let response = await axios.get(h + "login/aluno/visitante");
        localStorage.setItem("type", JSON.stringify(response.data.type))
        var aux = jwt_decode(response.data.token)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("utilizador", JSON.stringify(aux.user))
        this.$emit("refreshLogout")
        this.$router.push({name: "Meu Perfil"})
      },
      loginProfVisitante: async function(){
        let response = await axios.get(h + "login/professor/visitante");
        localStorage.setItem("type", JSON.stringify(response.data.type))
        var aux = jwt_decode(response.data.token)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("utilizador", JSON.stringify(aux.user))
        this.$emit("refreshLogout")
        this.$router.push({name: "Meu Perfil"})
      },
      registar: function(){
        this.$emit("registar");
      }
    }
  }
</script>