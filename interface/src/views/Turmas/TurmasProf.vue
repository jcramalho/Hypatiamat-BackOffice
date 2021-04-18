<template>
<v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
                <v-card-title primary-title class="justify-center green--text">
                    Turmas do Professor(a)
                </v-card-title>
                <center>
                    <span><b>{{professor.nome}}</b></span>
                </center>
                <br>

                <v-combobox
                    id="anoletivo"
                    label="Ano Letivo"
                    prepend-icon="mdi-counter"
                    v-model="anoletivo"
                    color="#009263"
                    :items="anosletivos"
                    @change="getTurmas()"
                ></v-combobox>
                <v-text-field
                    v-model="filtrar"
                    label="Filtrar"
                    prepend-icon="mdi-magnify"
                    color="#009263"
                    single-line
                    ></v-text-field>
                    <v-data-table
                    class="elevation-1"
                    :headers="header_turmas"
                    :items="turmas"
                    :footer-props="footer_props"
                    :search="filtrar"
                    >
                    <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.turma}}</td>
                        <td>{{row.item.anoletivo}}</td>
                        <td class="d-flex align-center">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                icon
                                v-bind="attrs" 
                                v-on="on"
                                >
                                <v-icon color="#009263" @click="verTurma(row.item.id)"> mdi-eye </v-icon>
                                </v-btn>
                            </template>
                            <span>Visualizar os alunos pertencentes à turma.</span>
                        </v-tooltip>
                        </td>
                        <td v-if="utilizador.type==50" class="justify-center">
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              icon
                              v-bind="attrs" 
                              v-on="on"
                            >
                            <v-icon color="#009263" @click="editarTurma(row.item.id)"> mdi-cog-transfer-outline </v-icon>
                            </v-btn>
                          </template>
                          <span>Efetuar transferências de alunos, no qual envolverá esta turma.</span>
                        </v-tooltip>
                        </td>
                    </tr>
                    </template>
                    </v-data-table>
            </v-container>
        </v-card>
      </v-container>
    </v-main>
</v-app>
</template>



<script>
import axios from "axios"
import {Passaport} from '@/config/passport'
const h = require("@/config/hosts").hostAPI
const nTurmas = require("@/config/confs").limiteTurmas
const anoletivoAtual = require("@/config/confs").anoletivo
const anosletivos1 = require("@/config/confs").anosletivos

  export default {
    data(){
      return {
        token: "",
        turmas: [],
        show:false,
        anosletivos:["Todos"],
        anoletivo:anoletivoAtual,
        utilizador : {},
        professor:{},
         header_turmas: [
            {text: "Turma", value: 'turma', class: 'subtitle-1'},
            {text: "Ano Letivo", value: 'anoletivo', class: 'subtitle-1'},
            {text: "Ver Alunos", sortable:false, class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [15, 30, 45, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        codProf:""
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.codProf = this.$route.params.codigo
        if(this.utilizador.type == 50){

        }
        else{

        }
        for(var i = 0; i < anosletivos1.length; i++){
          this.anosletivos.push(anosletivos1[i])
        }
        var anoAux = this.anoletivo.split("/")
        var ano = anoAux[0]
        var responseProf = await axios.get(h + "professores/codigos/" + this.codProf + "?token=" + this.token)
        this.professor = responseProf.data
        var response = await axios.get(h + "professores/" + this.codProf + "/turmas?token=" + this.token + "&ano=" + ano)
        this.turmas = response.data
    },
    methods: {
      getTurmas: async function(){
        if(this.anoletivo != "Todos"){
          var anoAux = this.anoletivo.split("/")
          var ano = anoAux[0]
          var response = await axios.get(h + "professores/" + this.codProf + "/turmas?token=" + this.token + "&ano=" + ano)
          this.turmas = response.data
        }
        else{
          var response = await axios.get(h + "professores/" + this.codProf + "/turmas?token=" + this.token)
          this.turmas = response.data
        }
      },
      verTurma : function(id){
        this.$router.push({name:"Ver Turma", params:{ id : id, codigo: this.codProf }})
      },
    }
  }
</script>