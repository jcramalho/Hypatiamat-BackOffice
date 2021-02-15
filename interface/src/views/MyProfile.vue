<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
        <v-container class="grey lighten-3 mx-auto" v-if="type == 10">
            <!-- ALUNO !-->
            <Aluno/>
        </v-container>
         <v-container class="grey lighten-3 mx-auto" v-else-if="type == 20">
            <!-- PROFESSOR !-->
            <Professor/>
        </v-container>
         <v-container class="grey lighten-3 mx-auto" v-else-if="type == 30">
          <!-- MUNICIPIO !-->
            <Municipio/>
        </v-container>
         <v-container class="grey lighten-3 mx-auto" v-else-if="type == 40">
            <!-- AGRUPAMENTO !-->
            <Agrupamento/>
        </v-container>
        <v-container class="grey lighten-3 mx-auto" v-else>
            <!-- Admin !-->
            <Professor/>
        </v-container>
    </v-main>
  </v-app>
</template>



<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI
import Professor from '@/components/Professor.vue'
import Aluno from '@/components/Aluno.vue'
import Municipio from '@/components/Municipio.vue'
import Agrupamento from '@/components/Agrupamento.vue'
import Admin from '@/components/Admin.vue'

  export default {
    components:{
      Professor,
      Municipio,
      Aluno, 
      Agrupamento,
      Admin
    },
    data(){
      return {
        type:0
      }
    },
    created: async function(){
        this.type = JSON.parse(localStorage.getItem("utilizador")).type
    },
    methods: {
    }
  }
</script>