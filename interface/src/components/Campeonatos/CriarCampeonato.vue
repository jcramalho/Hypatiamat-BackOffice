<template>
    <v-card class="pa-5">
        <v-container>
            <v-card-title class="justify-center green--text"> Criar Campeonato </v-card-title>
            
            <v-form>
                <v-row>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
                <v-text-field color="#009263" :rules="[string20, campeonatoExiste]"
                    v-model="campeonato.cod" name="Código do Campeonato" label="Código do Campeonato" 
                    required
                ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                <v-text-field color="#009263"
                    v-model="campeonato.di" name="Data Inicial" type="date" label="Data Inicial" 
                    required
                ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                <v-text-field color="#009263"
                    v-model="campeonato.hi" name="Hora Inicial" type="time" label="Hora Inicial" 
                    required
                ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                <v-text-field color="#009263"
                    v-model="campeonato.df" name="Data Final" type="date" label="Data Final" 
                    required
                ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                <v-text-field color="#009263" v-model="campeonato.hf" name="Hora Final" 
                    type="time" label="Hora Final" required
                ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
                <v-text-field prepend-icon="mdi-tooltip-edit-outline" color="#009263"
                    v-model="campeonato.frase1" name="Frase 1" label="Frase 1"
                ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
                <v-text-field prepend-icon="mdi-tooltip-edit-outline" color="#009263"
                    v-model="campeonato.frase2" name="Frase 2" label="Frase 2"
                ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
                <v-combobox prepend-icon="mdi-city" color="#009263" :items="municipios" item-text="localidade"
                    v-model="campeonato.municipio" name="Município" label="Município"
                ></v-combobox>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
                <v-combobox prepend-icon="mdi-google-circles-communities" color="#009263" item-text="nome"
                    v-model="campeonato.comunidade" name="Comunidade" label="Comunidade" :items="comunidades"
                ></v-combobox>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
                <v-text-field prepend-icon="mdi-comment-bookmark" color="#009263"
                    v-model="campeonato.descricaoBackOffice" name="Descrição BackOffice" label="Descrição BackOffice"
                ></v-text-field>
                </v-col>
                </v-row>
            </v-form>
            <v-btn class="white--text" :disabled="disabled"
            block style="background-color: #009263;" @click="insertCampeonato()">
                Criar
            </v-btn>
        </v-container>
    </v-card>
</template>

<script>
import axios from "axios"
import Swal from 'sweetalert2'
const h = require("@/config/hosts").hostAPI
const hostCampeonatos = require("@/config/hosts").hostCampeonatos

  export default {
    components:{
    },
    data(){
      return {
        token: "",
        campeonato:{
            cod: "",
            di:"",
            horai:"",
            df:"",
            horaf:"",
            frase1:"",
            frase2:"",
            municipio:"",
            comunidade:"",
            descricaoBackOffice:""
        },
        loading:false,
        diHora:"",
        diData:"",
        dfHora:"",
        dfData:"",
        disabled:true,
        municipios:[],
        comunidades:[],
        filtrar : "",
        filtrar2 : "",
        string20: v =>{
            if(this.campeonato.cod.length > 20) {this.disabled = true ; return 'Não pode ter mais que 20 caractéres.'}
            if(this.campeonato.cod.length == 0) {this.disabled = true ; return 'O campeonato tem que possuir um código.'}
            this.disabled = false
            return true
        },
        campeonatoExiste: v =>{
            if(this.campeonatos.find(e => e.cod == this.campeonato.cod)) {this.disabled = true ; return 'Já existe um campeonato com esse código.'}
            this.disabled = false
            return true
        },
      }
    },
    props:["campeonatos"],
    created: async function(){
        this.token = localStorage.getItem("token")
        
        await this.parseMunicipios()
        await this.parseComunidades()
    },
    methods: {
      parseMunicipios: async function(){
          var response = await axios.get(h + "escolas/localidades/?token=" + this.token)
          this.municipios = response.data 
      },
      parseComunidades: async function(){
          var response = await axios.get(h + "comunidades/?token=" + this.token)
          this.comunidades = response.data
      },
      parseCampeonato: function(){
          var campeonatoNovo = {
                cod: this.campeonato.cod,
                datains: this.campeonato.datains,
                di: this.campeonato.di + " " + this.campeonato.hi,
                df: this.campeonato.df + " " + this.campeonato.hf,
                horai: this.campeonato.hi,
                horaf: this.campeonato.hf,
                frase1: this.campeonato.frase1,
                frase2: this.campeonato.frase2,
                descricaoBackOffice: this.campeonato.descricaoBackOffice,
                comunidade: null,
                municipio: null
            }
          if(this.campeonato.municipio.localidade && this.campeonato.municipio.localidade != ""){
            if(this.campeonato.comunidade && this.campeonato.comunidade != ""){
                campeonatoNovo.comunidade = this.campeonato.comunidade.codigo
                campeonatoNovo.municipio = this.campeonato.municipio.localidade
            }
            else campeonatoNovo.municipio = this.campeonato.municipio.localidade 
          } 
          else if(this.campeonato.comunidade && this.campeonato.comunidade != ""){
              campeonatoNovo.comunidade = this.campeonato.comunidade.codigo
          }

          return campeonatoNovo
      },
      insertCampeonato: async function(){
          var campeonatoNovo = await this.parseCampeonato()
          
          await axios.post(hostCampeonatos + "?token=" + this.token, campeonatoNovo)
          Swal.fire({
            icon: 'success',
            title: 'Campeonato criado com sucesso.',
            confirmButtonColor: '#009263'
          })
          this.$emit("atualizaCampeonatos")
      },

      
    }
  }
</script>
