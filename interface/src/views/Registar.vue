<template>
 <div id="app">
  <v-container>
    <v-layout row class="text-xs-center">
        <v-container style="position: relative;top: 15%; width: 60%;" class="text-xs-center">
          <material-card              
          color="#900000"
          title="Registo"
        >

            <v-form>
            <v-text-field prepend-icon="mdi-account-card-details" v-model="username" name="Username" label="Username" required></v-text-field>
            <v-text-field prepend-icon="mdi-account" v-model="name" name="Name" label="Name" required></v-text-field>
            <v-text-field prepend-icon="mdi-email" v-model="email" name="Email" label="Email" required></v-text-field>
            <v-text-field prepend-icon="mdi-calendar-question" v-model="birthdate" name="Birthdate" label="Birthdate" type="date" required></v-text-field>
            <v-text-field prepend-icon="mdi-key" v-model="password" name="Password" label="Password" type="password" required></v-text-field>
            <v-card-actions>
              <v-btn primary large block style="background-color: #900000;" @click="registar">Confirmar</v-btn>
            </v-card-actions>
            </v-form>
            <v-card-actions class="justify-center">
            <v-btn width=100 style="background-color: #900000;" @click="login">Voltar</v-btn>
            </v-card-actions>
              </material-card>
        </v-container>
    </v-layout>
  </v-container>
</div>
</template>

<script>
  const h = require("@/config/hosts").hostDataApi
  import axios from "axios"
  export default {
    data(){
      return {
        name : "",
        birthdate : "",
        email : "",
        username : "",
        password : "",
      }
    },
    created : async function() {
        try {
        
        } catch (e) {
        return e
        }
    },
     methods: {
       login: function(){
         this.$emit("login");
       },
      registar: function () {
          console.log(this.birthdate)
        if (this.name != "" && this.email != "" && this.username != "" && this.birthdate != "" && this.password != ""){ 
            let data = {
                name : this.name,
                email : this.email,
                username : this.username,
                birthdate : this.birthdate,
                password : this.password
            }
            axios.post(h + "users/", data)
                 .then(()=>{
                   alert('A sua conta foi criada com sucesso!\n Por favor efetue o login com as suas credenciais.')
                   this.$emit("login")
                 })
                .catch(erro=> console.log(erro))
            ///this.$store.dispatch('register', data)
            //.then(() => this.$router.push('/universidade'))
            //.catch(err => console.log(err))
        }
        else {
            alert('Ainda possuí campos por preencher!')
        }
      }
    }
  }
</script>

