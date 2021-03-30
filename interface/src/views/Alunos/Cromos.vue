<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3" >
      <v-container>
        <v-card class="justify-center">
            <center>
                <v-icon large color='#009263'> mdi-book-open-page-variant-outline </v-icon>
                <br>
                <span> Caderneta de cromos </span>
            </center>
            <v-row>
                <v-col cols="12" sm="6" md="4" lg="3" xl="2" v-for="cromo in cromos" v-bind:key="cromo.id">
                    <v-container class="text-center pa-0 ma-0">
                        <v-avatar tile color="#a6ffbe" size="200">
                            <span style="color:#009263">{{cromo.numero}}</span>
                        </v-avatar>
                    </v-container>
                </v-col>
            </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
import Swal from 'sweetalert2'
const h = require("@/config/hosts").hostAPI
const hostCromos = require("@/config/hosts").hostCromos

  export default {
    data(){
      return {
        token: "",
        utilizador:{},
        cromos: []
      }
    },
    props:["idProp"],
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        var response = await axios.get(hostCromos + "?token=" + this.token)
        this.cromos = response.data
        console.log(this.cromos)
    },
    methods: {
    }
  }
</script>