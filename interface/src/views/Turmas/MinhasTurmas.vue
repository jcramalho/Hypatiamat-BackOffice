<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <TurmasProfessor v-if="utilizador.type==20"/>
        <TurmasAgrupamento v-else />
      </v-container>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI
import TurmasProfessor from '@/components/Turmas/TurmasProfessor.vue'
import TurmasAgrupamento from '@/components/Turmas/TurmasAgrupamento.vue'


  export default {
    components:{
      TurmasProfessor,
      TurmasAgrupamento
    },
    data(){
      return {
        utilizador:{}
      }
    },
    created: async function(){
       this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
    },
    methods: {
    }
  }
</script>