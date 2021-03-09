<template>
  <v-container>
    <v-card class="justify-center">
        <v-container class="justify-center">
            <v-card-title primary-title class="justify-center green--text">
                Editar Comunidade ({{nomeComunidade}})
            </v-card-title>
                     
          <v-combobox
            id="municipios"
            chips
            prepend-icon="mdi-city"
            v-model="novosMunicipios"
            label="Novos municípios da Comunidade"
            color="#009263"
            :multiple="true"
            :items="municipiosAdicionar"
            ></v-combobox>
            <v-btn class="white--text" :disabled="novosMunicipios.length == 0" color="#009263" @click="adicionaMunicipios()" block> Adicionar </v-btn>
            <v-container>
                <v-text-field
                    v-model="filtrar"
                    label="Filtrar"
                    prepend-icon="mdi-magnify"
                    color="#009263"
                    single-line
                ></v-text-field>
                <v-data-table
                    class="elevation-1"
                    :headers="header_municipios"
                    :items="municipios"
                    :footer-props="footer_props"
                    :search="filtrar"
                    color="#009263"
                >
                    <template v-slot:item="row">
                            <tr>
                                <td>{{row.item.municipio}}</td>
                                <td>
                                <!--<v-icon @click="verProfessor(row.item.id)"> mdi-eye </v-icon>-->
                                <v-icon @click="apagarMunicipio(row.item)"> mdi-delete </v-icon>
                                </td>
                            </tr>
                        </template>
                </v-data-table>
            </v-container>

        </v-container>
    </v-card>
  </v-container>
</template>



<script>
import axios from "axios"
import Swal from 'sweetalert2'
const h = require("@/config/hosts").hostAPI

  export default {
    data(){
      return {
        token: "",
        municipios:[],
        filtrar:"",
        nome:"",
        municipiosAdicionar:[],
        novosMunicipios:[],
        header_municipios:[
            {text: "Município", sortable: true, value: 'municipio', class: 'subtitle-1'},
            {text: "Apagar", sortable: false, class: 'subtitle-1'},

        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        number0or1: v  => {
          if (!isNaN(parseInt(v)) && (v == 0 || v == 1)) return true;
          return 'Tem que ser 0 ou 1';
        },
        number: v  => {
          if (!isNaN(parseInt(v))) return true;
          return 'Tem que ser um inteiro';
        } 
      }
    },
    props:["codigo", "nomeComunidade", "comunidades"],
    created: async function(){
        this.token = localStorage.getItem("token")
        var response = await axios.get(h + "comunidades/" + this.codigo + "?token=" + this.token)
        this.municipios = response.data
        this.parseMunicipios()
    },
    methods: {
      parseMunicipios: async function(){
          var response = await axios.get(h + "escolas/localidades?token=" + this.token)
          this.municipiosAdicionar = []
          for(var i = 0; i < response.data.length; i++){
              if(!this.municipios.find(e => e.municipio == response.data[i].localidade)) this.municipiosAdicionar.push(response.data[i].localidade)
          }
      },
      adicionaMunicipios: async function(){
          await axios.post(h + "comunidades/" + this.codigo + "?token=" + this.token, {nome: this.nomeComunidade, municipios: this.novosMunicipios})
          for(var i = 0; i < this.novosMunicipios.length; i++){
              this.municipios.push({municipio: this.novosMunicipios[i]})
          }
          this.$emit("municipios", this.municipios.length)
          this.novosMunicipios = []
          this.parseMunicipios()
      },
      apagarMunicipio: async function(municipio){
          await axios.delete(h + "comunidades/" + this.codigo + "/municipios/" + municipio.municipio + "?token=" + this.token)
          var index = this.municipios.indexOf(municipio)
          this.municipios.splice(index, index+1)
          this.$emit("municipios", this.municipios.length)
          this.parseMunicipios()
      }
    }
  }
</script>