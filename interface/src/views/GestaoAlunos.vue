<template>
<v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
                <v-card-title primary-title class="justify-center green--text">
                    Gestão de Alunos
                </v-card-title>
                <center>
                  <v-btn v-if="!show" text @click="show=!show"><span>Mostrar Ajuda</span><v-icon color="#009263"> mdi-help-circle </v-icon> </v-btn>
                  <v-btn v-else text @click="show=!show">Esconder Ajuda</v-btn> 
                </center>
                <v-slide-y-transition>
                      <v-card v-show="show" class="elevation-6 pa-3" style="border: 2px solid green !important;" color="grey lighten-3">
                        <v-row >
                          <v-col cols="12">
                          <span> 1. Se desejar visualizar as suas turmas antigas, pode fazê-lo através da seleção de um ano letivo diferente ou de todos (<v-icon>mdi-counter</v-icon>). </span>
                          </v-col>
                          <v-col cols="12">
                          <span> 2. Caso deseje visualizar os alunos pertencentes a uma turma e eventualmente editar as informações dos mesmos, clique em  <v-icon> mdi-eye </v-icon>
                          da respetiva turma. </span>
                          </v-col>
                          <v-col cols="12">
                          <span> 3. Caso deseje efetuar transferências de alunos no qual envolvam uma determinada turma, clique em 
                            <v-icon> mdi-cog-transfer-outline </v-icon> da respetiva turma. </span> 
                          </v-col>
                        </v-row>
                      </v-card>
                  </v-slide-y-transition>
                  <br v-if="show">
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
                                <v-icon @click="verTurma(row.item.id)"> mdi-eye </v-icon>
                                </v-btn>
                            </template>
                            <span>Visualizar os alunos pertencentes à turma.</span>
                        </v-tooltip>
                        </td>
                        <td class="justify-center">
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              icon
                              v-bind="attrs" 
                              v-on="on"
                            >
                            <v-icon @click="editarTurma(row.item.id)"> mdi-cog-transfer-outline </v-icon>
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
import {Passaport} from '../config/passport'
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
        limiteTurmas: 4,
        anosletivos:["Todos"],
        anoletivo:anoletivoAtual,
        utilizador : {},
         header_turmas: [
            {text: "Turma", value: 'turma', class: 'subtitle-1'},
            {text: "Ano Letivo", value: 'anoletivo', class: 'subtitle-1'},
            {text: "Ver Alunos", sortable:false, class: 'subtitle-1'},
            {text: "Transferência de Alunos", sortable:false, class: 'subtitle-1',},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [15, 30, 45, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        turmasAnoLetivo: 0
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        var anoAux = this.anoletivo.split("/")
        var ano = anoAux[0]
        var response = await axios.get(h + "professores/" + this.utilizador.codigo + "/turmas?token=" + this.token + "&ano=" + ano)
        this.turmas = response.data
        if(this.utilizador.limiteTurmas) this.limiteTurmas = this.utilizador.limiteTurmas
        else this.limiteTurmas = nTurmas
        this.calculaTurmasAnoLetivo();
        for(var i = 0; i < anosletivos1.length; i++){
          this.anosletivos.push(anosletivos1[i])
        }
    },
    methods: {
      getTurmas: async function(){
        if(this.anoletivo != "Todos"){
          var anoAux = this.anoletivo.split("/")
          var ano = anoAux[0]
          var response = await axios.get(h + "professores/" + this.utilizador.codigo + "/turmas?token=" + this.token + "&ano=" + ano)
          this.turmas = response.data
        }
        else{
          var response = await axios.get(h + "professores/" + this.utilizador.codigo + "/turmas?token=" + this.token)
          this.turmas = response.data
        }
      },
      verTurma : function(id){
        this.$router.push({name:"Ver Turma", params:{ id : id }})
      },
      editarTurma : function(id){
        this.$router.push({name: "Editar Minha Turma", params: { id : id } })
      },
      criarTurma : function(){
        this.$router.push({name: "Criar Turma" })
      },
      apagarTurma: async function(id){
          if(confirm("De certeza que deseja apagar esta turma?")){
              var a = await axios.delete(h + "turmas/" + id + "?token=" + this.token)
              var response = await axios.get(h + "professores/" + this.utilizador.codigo + "/turmas?token=" + this.token)
              this.turmas = response.data
          }
      },
      calculaTurmasAnoLetivo: function(){
        this.turmasAnoLetivo = 0;
        this.turmas.forEach(t => {if(t.anoletivo == anoletivoAtual) this.turmasAnoLetivo++})
      },
      getPassaporte : function(turma, passportPassword){
        var passwords = false;
        if(passportPassword) passwords = true
        var codprofessor = this.utilizador.codigo
        console.log(this.utilizador.agrupamento)
        Passaport.getPassaporteTurma( turma, codprofessor, this.utilizador.agrupamento.split(",")[0] )
      }
    }
  }
</script>