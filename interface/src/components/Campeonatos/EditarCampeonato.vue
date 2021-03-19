<template>
    <v-card class="pa-5">
        <v-container>
            <v-card-title class="justify-center green--text"> Editar Campeonato ({{codEditar}}) </v-card-title>
            
            <v-form>
                <v-row>
                <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                <v-text-field color="#009263"
                    v-model="diData" name="Data Inicial" type="date" label="Data Inicial" 
                    required
                ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                <v-text-field color="#009263"
                    v-model="diHora" name="Hora Inicial" type="time" label="Hora Inicial" 
                    required
                ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                <v-text-field color="#009263"
                    v-model="dfData" name="Data Final" type="date" label="Data Final" 
                    required
                ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                <v-text-field color="#009263" v-model="dfHora" name="Hora Final" 
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
            <v-btn class="white--text"
            block style="background-color: #009263;" @click="updateCampeonato()">
                Guardar Alterações
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
        campeonato:{},
        loading:false,
        disabledTitulo:false,
        diHora:"",
        diData:"",
        dfHora:"",
        dfData:"",
        municipios:[],
        comunidades:[],
        header_subnovidades: [
            {text: "Sub Novidade", sortable: true, value: 'subnovidade', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        filtrar2 : "",
        subnovidadesEliminar:[],
        string15: v =>{
            if(v.length > 15) return 'Não pode ter mais que 15 caractéres.'
            return true
        },
        string70: v =>{
            if(v.length > 70) {this.disabledTitulo = true; return 'Não pode ter mais que 70 caractéres.'}
            if(v.length == 0) {this.disabledTitulo = true; return 'Precisa de um título.'}
            this.disabledTitulo = false
            return true
        },
      }
    },
    props:["codEditar"],
    created: async function(){
        this.token = localStorage.getItem("token")
        var response = await axios.get(hostCampeonatos + this.codEditar + "?token=" + this.token)
        this.campeonato = response.data
        
        await this.parseMunicipios()
        await this.parseComunidades()
        this.parseDatas()
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
      parseDatas: function(){
          var aux1 = this.campeonato.di.split(" ")
          var aux2 = this.campeonato.df.split(" ")
          this.diData = aux1[0]
          this.diHora = aux1[1]
          this.dfData = aux2[0]
          this.dfHora = aux2[1] 
          this.campeonato.comunidade = this.comunidades.find(e => e.codigo == this.campeonato.comunidade)
          var mun = this.campeonato.municipio
          this.campeonato.municipio = {}
          this.campeonato.municipio.localidade = mun

      },
      parseCampeonato: function(){
          var campeonatoNovo = {
                cod: this.codEditar,
                datains: this.campeonato.datains,
                di: this.diData + " " + this.diHora,
                df: this.dfData + " " + this.dfHora,
                horai: this.diHora,
                horaf: this.dfHora,
                frase1: this.campeonato.frase1,
                frase2: this.campeonato.frase2,
                descricaoBackOffice: this.campeonato.descricaoBackOffice,
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
      updateCampeonato: async function(){
          var campeonatoNovo = await this.parseCampeonato()
          
          await axios.put(hostCampeonatos + this.codEditar + "?token=" + this.token, campeonatoNovo)
          Swal.fire({
            icon: 'success',
            title: 'Campeonato alterado com sucesso.',
            confirmButtonColor: '#009263'
          })
          this.$emit("atualizaCampeonato")
      },

      
    }
  }
</script>
