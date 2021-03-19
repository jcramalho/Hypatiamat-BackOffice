<template>

    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Minhas Turmas
            </v-card-title>
            <center>
              <v-btn v-if="turmasAnoLetivo<limiteTurmas" class="white--text" style="background-color: #009263;" @click="criarTurma()"> 
                <v-icon> mdi-book-plus </v-icon> Criar Turma 
              </v-btn>
              <v-row v-else class="justify-center" style="display: flex;  align-items: center;">
                <v-icon color="red"> mdi-alert-outline </v-icon>
                <span> Não pode criar mais turmas, uma vez que atingiu o limite deste ano letivo ({{limiteTurmas}}). </span>
              </v-row>
            </center>
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
                    <td>{{row.item.anoletivo}}</td>
                    <td>{{row.item.turma}}</td>
                    <td>
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
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs" 
                          v-on="on"
                        >
                        <v-icon @click="editarTurma(row.item.id)"> mdi-pencil </v-icon>
                        </v-btn>
                      </template>
                      <span>Efetuar transferências de alunos, no qual envolverá esta turma.</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs" 
                          v-on="on"
                        >
                        <v-icon @click="apagarTurma(row.item.id)"> mdi-delete </v-icon>
                        </v-btn>
                      </template>
                      <span>Apagar esta turma, caso não haja alunos pertencentes à turma, entre outros.</span>
                    </v-tooltip>
                    
                    </td>
                </tr>
                </template>
                </v-data-table>
        </v-container>
    </v-card>
</template>



<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI
const nTurmas = require("@/config/confs").limiteTurmas
const anoletivoAtual = require("@/config/confs").anoletivo
const anosletivos1 = require("@/config/confs").anosletivos

  export default {
    data(){
      return {
        token: "",
        turmas: [],
        limiteTurmas: 4,
        anosletivos:["Todos"],
        anoletivo:"Todos",
        utilizador : {},
         header_turmas: [
            {text: "Ano Letivo", value: 'anoletivo', class: 'subtitle-1'},
            {text: "Turma", value: 'turma', class: 'subtitle-1'},
            {text: "Operações", sortable:false, class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        turmasAnoLetivo: 0
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        var response = await axios.get(h + "professores/" + this.utilizador.codigo + "/turmas?token=" + this.token)
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
      }
    }
  }
</script>