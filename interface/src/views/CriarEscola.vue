<template>
 <div id="app">
  <v-container>
    <v-layout row class="text-xs-center">
        <v-container style="position: relative;top: 15%; width: 60%;" class="text-xs-center">
          <v-card class="pa-5">
            <v-form>
            <v-text-field prepend-icon="mdi-account" v-model="nome" name="Nome da Escola" label="Nome do Escola" :rules="[existeNome]" required></v-text-field>
            <v-text-field prepend-icon="mdi-card-account-details" v-model="codigo" name="Código da Escola" :rules="[existeCodigo]" label="Código da Escola" required></v-text-field>
            <v-text-field prepend-icon="mdi-city" v-model="localidade" name="Localidade" label="Localidade" required></v-text-field>
            <v-text-field prepend-icon="mdi-calendar" v-model="distrito" name="Distrito" label="Distrito" required></v-text-field>
            <v-text-field prepend-icon="mdi-bank" v-model="pais" name="País" label="País" required></v-text-field>
            
            <v-card-actions>
              <v-btn class="white--text" primary large block style="background-color: #009263;" @click="registarAluno">Confirmar</v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        </v-container>
    </v-layout>
  </v-container>
</div>
</template>

<script>
  const h = require("@/config/hosts").hostAPI
  import axios from "axios"
  export default {
    data(){
      return {
        nome : "",
        escola : "",
        escolas: [],
        escolasIds : [],
        email : "",
        pais: "",
        localidade:"",
        distrito:"",
        codigo : "",
        token: "",
        string15: v  => {
          if(v.length <= 15) return true
          else return "Apenas pode conter 15 caractéres"
        },
        isNumber: v=>{

        },
        existeCodigo: v =>{
          if(this.escolas.find(element => element.cod == v)) return 'Esse código de escola já existe. Escolha outro por favor.'
          else return true
        },
        existeNome: v =>{
          if(this.escolas.find(element => element.nome == v)) return 'Esse nome de escola já existe. Escolha outro por favor.'
          else return true
        }
      }
    },
    created : async function() {
        try {
          this.token = localStorage.getItem("token")
          var response = await axios.get(h + "escolas")
          this.escolas = response.data
        } catch (e) {
        return e
        }
    },
     methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      registarEscola: function () {

        if (this.nome != "" && this.distrito != "" && this.codigo != "" && this.localidade != "" && this.pais != "" ){ 
            let data = {
                localidade: this.localidade,
                distrito: this.distrito,
                pais: this.pais,
                nome : this.nome,
                cod : this.codigo
            }
            axios.post(h + "escolas/", data)
                 .then(()=>{
                   alert('Escola registada com sucesso.')
                   this.$router.push({name: "Escolas"})
                 })
                .catch(erro=> console.log(erro))
        }
        else {
            alert('Ainda possuí campos por preencher!')
        }
      }

    }
  }
</script>

