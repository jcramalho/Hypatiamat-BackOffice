<template>
<v-card class="pa-5">
     <v-layout row class="text-xs-center pa-lg-16" justify-center >
            <v-flex xs5>
              <v-card class="pa-4">
                  <v-card-title primary-title class="justify-center">
                      Cromos do Ano Letivo <v-combobox
                            id="anoletivo1"
                            v-model="anoletivo1"
                            :items="anos"
                            @change="onAno1Change"
                        ></v-combobox>
                  </v-card-title>
                  <v-text-field
                      v-model="filtrar1"
                      label="Filtrar"
                      prepend-icon="mdi-magnify"
                      color="#009263"
                      single-line
                      ></v-text-field>
                      <v-data-table
                      class="elevation-1"
                      v-model="selected1"
                      :single-select="false"
                      show-select
                      :headers="header_cromos"
                      :items="cromos1"
                      :footer-props="footer_props"
                      :search="filtrar1"
                      >
                      </v-data-table>
              </v-card>
            </v-flex>
            <v-flex xs2>
              <v-container v-if="anoletivo1 != anoletivo2">
                <center>
                  <v-tooltip v-if="this.selected1.length>0" top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs" 
                        v-on="on"
                        @click="copiarCromos1()"
                      >
                      <v-icon large color="#009263" > mdi-arrow-right-box </v-icon>
                      </v-btn>
                    </template>
                    <span>Irá copiar os cromos selecionados do ano letivo {{anoletivo1}} para os cromos do ano letivo {{anoletivo2}}</span>
                  </v-tooltip>
                  </center>
                <br>
                <center>
                  <v-tooltip v-if="this.selected2.length>0" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs" 
                        v-on="on"
                        @click="copiarCromos2()"
                      >
                      <v-icon  large color="#009263" @click="alteraTurma2"> mdi-arrow-left-box </v-icon>
                      </v-btn>
                    </template>
                    <span>Irá copiar os cromos selecionados do ano letivo {{anoletivo2}} para os cromos do ano letivo {{anoletivo1}}</span>
                  </v-tooltip>
                </center>
              </v-container>
              <v-container v-else>
                  <span style="color:#009263"> Anos letivos têm que ser diferentes.</span>
              </v-container>
            </v-flex>
            <v-flex xs5>
              <v-card class="pa-4">
              <v-card-title primary-title class="justify-center">
                      Cromos do Ano Letivo <v-combobox
                            id="anoletivo2"
                            v-model="anoletivo2"
                            :items="anos"
                            @change="onAno2Change"
                        ></v-combobox>
                  </v-card-title>
                  <v-text-field
                      v-model="filtrar2"
                      label="Filtrar"
                      prepend-icon="mdi-magnify"
                      color="#009263"
                      single-line
                      ></v-text-field>
                      <v-data-table
                      class="elevation-1"
                      v-model="selected2"
                      :single-select="false"
                      show-select
                      :headers="header_cromos"
                      :items="cromos2"
                      :footer-props="footer_props"
                      :search="filtrar2"
                      >
                      </v-data-table>
              </v-card>        
            </v-flex>
    </v-layout>
</v-card>
</template>

<script>
import axios from "axios"
const h = require("@/config/hosts").host
const hostCromos = require("@/config/hosts").hostCromos
const anoletivo = require("@/config/confs").anoletivo
const anoletivo2 = require("@/config/confs").anoAtual
const anosletivos = require('@/config/confs').anosCromos
const anosleivos2 = require('@/config/confs').anosCromos2
import Swal from 'sweetalert2'


  export default {
    name: 'GestaoCromos',
    props: ["cromosSel", "anoletivoSel"],
    components:{
    },
    data(){
      return {
        token: "",
        loading:false,
        anoletivo1: "",
        anoletivo2: anoletivo,
        anos: anosletivos,
        host: h,
        dialogImage: false,
        cromos1: [],
        cromos2: [],
        selected1: [],
        selected2: [],
        pathImage: '',
        pastaCromos: 'cromos_imgs/',
        header_cromos: [
            {text: "Número", value: 'numero', class: 'subtitle-1',},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar1 : "",
        filtrar2: "",
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.cromos1 = this.cromosSel
        this.anoletivo1 = this.anoletivoSel
        if(this.anoletivo1 == this.anoletivo2) {
            var indexOf = this.anos.indexOf(this.anoletivo1)
            console.log(indexOf)
            this.anoletivo2 = this.anos[indexOf+1]
        }
        this.onAno2Change()
    },
    methods: {
      onAno1Change: async function(){
        //this.loading = true
        var response = await axios.get(hostCromos + "?anoletivo=" + this.anoletivo1 + "&token=" + this.token)
        this.selected1 =[]
        this.cromos1 = response.data
        //this.loading = false
      },
      onAno2Change: async function(){
        //this.loading = true
        var response = await axios.get(hostCromos + "?anoletivo=" + this.anoletivo2 + "&token=" + this.token)
        this.selected2 = []
        this.cromos2 = response.data
        //this.loading = false
      },
      copiarCromos1: async function(){
          if(this.selected1.length > 0){
              Swal.fire({
                    icon: 'success',
                    text: 'Cromos copiados com sucesso.',
                    confirmButtonColor: '#009263'
                })
              for(var i = 0; i < this.selected1.length; i++)
                  this.selected1[i].anoletivo = this.anoletivo2
              await axios.post(hostCromos + "lista?token=" + this.token, {cromos: this.selected1})
              this.$emit("copiados", this.anoletivo2)
          }
      },
      copiarCromos2: async function(){
          if(this.selected2.length > 0){
              Swal.fire({
                    icon: 'success',
                    text: 'Cromos copiados com sucesso.',
                    confirmButtonColor: '#009263'
                })
              for(var i = 0; i < this.selected2.length; i++)
                  this.selected2[i].anoletivo = this.anoletivo1
              await axios.post(hostCromos + "lista?token=" + this.token, {cromos: this.selected2})
              this.$emit("copiados", this.anoletivo1)
          }
      }
    }
  }
</script>