<template>
<v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card>
        
        <v-container style="position: relative;top: 15%; width: 60%;" class="text-xs-center">
            <v-card-title primary-title class="justify-center green--text">
                Criar Turma
            </v-card-title>
            <v-form>
            <v-text-field prepend-icon="mdi-account" v-model="utilizador.codigo" name="Username do Professor" label="Username do Professor" required disabled></v-text-field>
            <v-text-field prepend-icon="mdi-book-account" v-model="turma" name="Nome da Turma (Ex: 7A-14-1)" label="Nome da Turma (Ex: 7A-14-1)" required></v-text-field>
            <v-card-actions>
              <v-btn class="white--text" primary large block style="background-color: #009263;" @click="criarTurma">Confirmar</v-btn>
            </v-card-actions>
            </v-form>
        </v-container>
    </v-card>
    </v-main>
</v-app>
</template>

<script>
  const h = require("@/config/hosts").hostAPI
  import axios from "axios"
import TurmasVue from './Turmas.vue'
  export default {
    data(){
      return {
        utilizador : {},
        turma : "",
        token: ""
      }
    },
    created : async function() {
        try {
            this.token = localStorage.getItem("token")
            this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        
        } catch (e) {
        return e
        }
    },
     methods: {
      criarTurma: async function () {
        if (this.turma != ""){ 

            let data = {
                idprofessor: this.utilizador.codigo,
                turma: this.turma
            }
            
            var response = await axios.post(h + "turmas?token=" + this.token, data)
            this.$router.push({name: "Editar Turma", params: { id : response.data.insertedId } })   
        }
        else {
            alert('Ainda possuí campos por preencher!')
        }
      }
    }
  }
</script>

