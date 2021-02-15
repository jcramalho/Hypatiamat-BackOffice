<template>
 <v-app id="inspire">
  <v-main class="grey lighten-3">
    <v-container>
      <v-layout row class="text-xs-center">
          <v-container style="position: relative;top: 15%;" class="text-xs-center">
            <v-card class="pa-5">
              <v-form>
              <v-text-field prepend-icon="mdi-account" v-model="nome" name="Nome do Agrupamento" label="Nome do Agrupamento" :rules="[existeNome, string120]" required></v-text-field>
              <v-text-field prepend-icon="mdi-card-account-details" v-model="codigo" name="Código do Agrupamento" :rules="[existeCodigo, string10]" label="Código do Agrupamento" required></v-text-field>
              <v-text-field prepend-icon="mdi-city" v-model="localidade" name="Localidade" label="Localidade" :rules="[string30]" required></v-text-field>
              <v-text-field prepend-icon="mdi-calendar" v-model="distrito" name="Distrito" label="Distrito" :rules="[string30]" required></v-text-field>
              <v-text-field prepend-icon="mdi-bank" v-model="pais" name="País" label="País" :rules="[string20]" required></v-text-field>
              
              <v-card-actions>
                <v-btn class="white--text" primary large block style="background-color: #009263;" @click="registarEscola">Criar Agrupamento</v-btn>
              </v-card-actions>
              </v-form>
            </v-card>
          </v-container>
      </v-layout>
    </v-container>
  </v-main>
</v-app>
</template>

<script>
  const h = require("@/config/hosts").hostAPI
  import Swal from 'sweetalert2'
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
        string10: v  => {
          if(v.length <= 10) return true
          else return "Apenas pode conter 10 caractéres"
        },
        string120: v  => {
          if(v.length <= 120) return true
          else return "Apenas pode conter 120 caractéres"
        },
        string30: v  => {
          if(v.length <= 30) return true
          else return "Apenas pode conter 30 caractéres"
        },
        string20: v  => {
          if(v.length <= 20) return true
          else return "Apenas pode conter 20 caractéres"
        },
        isNumber: v=>{

        },
        existeCodigo: v =>{
          if(this.escolas.find(element => element.cod == v)) return 'Esse código de agrupamento já existe. Escolha outro por favor.'
          else return true
        },
        existeNome: v =>{
          if(this.escolas.find(element => element.nome == v)) return 'Esse nome de agrupamento já existe. Escolha outro por favor.'
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
            axios.post(h + "escolas/?token=" + this.token, data)
                 .then(()=>{
                   Swal.fire({
                      icon: 'success',
                      title: 'Agrupamento registado com sucesso.',
                      confirmButtonColor: '#009263'
                    })
                   this.$router.push({name: "Escolas"})
                 })
                .catch(erro=> console.log(erro))
        }
        else {
            Swal.fire({
                  icon: 'error',
                  title: 'Ainda possuí campos por preencher!',
                  confirmButtonColor: '#009263'
                })
        }
      },
      /*
      disabledConfirmar: async function(){
        if((this.localidade.length > 1 && this.localidade.length < 30) && (this.nome.length > 1 && this.nome.length < 30))
      }*/

    }
  }
</script>

