<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card>
        <v-container style="width:50%;">
            <v-card-title primary-title class="justify-center green--text">
                Editar Escola ({{escola.nome}})
            </v-card-title>
                     
          <v-text-field label="Nome" placeholder="Nome" v-model="escola.nome" color="#900000" required/>
          <v-text-field label="Localidade" placeholder="Localidade" v-model="escola.localidade" color="#900000" required/>
          <v-text-field label="Distrito" placeholder="Distrito" v-model="escola.distrito" color="#900000" required/>
          <v-text-field label="País" placeholder="País " v-model="escola.pais"  color="#900000" required/>
          <v-text-field label="Código" placeholder="Código" v-model="escola.cod"  color="#900000" required/>

          <center><v-btn class="white--text" style="background-color: #009263;" @click="editarEscola()"> Confirmar Alterações </v-btn></center>
        
        </v-container>
    </v-card>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI

  export default {
    data(){
      return {
        token: "",
        escola: {},
        id : 0,
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.id = this.$route.params.id
        var response = await axios.get(h + "escolas/" + this.id + "?token=" + this.token)
        console.log(response.data)
        this.escola = response.data
    },
    methods: {
      editarEscola : function(){
          axios.put(h + "escolas/" + this.id + "?token=" + this.token, this.escola)
               .then(dados => {
                 alert("Dados alterados com sucesso!")
               })
               .catch(error => alert("Não foi possível guardar as alterações."))
      }
    }
  }
</script>