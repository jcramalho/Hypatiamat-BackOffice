<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-card-title primary-title class="justify-center green--text">
                    Desempenho Geral
            </v-card-title>
            <v-container>
                <v-combobox
                    id="turmas"
                    v-model="turmaSel"
                    label="Turma"
                    color="green"
                    item-text="turma"
                    :items="turmas"
                    @change="onTurmaChange"
                ></v-combobox>
            </v-container>
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
                    :headers="header_alunos"
                    :items="alunos"
                    :footer-props="footer_props"
                    :search="filtrar"
                    @click:row="showDesempenho"
                ></v-data-table>
                <v-dialog v-model="dialogDesempenho" width="80%">
                    <Aluno v-if="dialogDesempenho" :idAluno="idAluno"/>
                </v-dialog>
            </v-container>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>


<script>
const h = require("@/config/hosts").hostAPI
const anoletivo = require("@/config/confs").anoletivo
import axios from "axios"
import Aluno from '@/components/Perfis/Aluno.vue'

  export default {
    components:{
        Aluno
    },
    data(){
      return {
        token: "",
        utilizador:{},
        turmas:[],
        turmaSel:"",
        alunos: [],
        header_alunos: [
            {text: "Número", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Username", value: 'user', class: 'subtitle-1'}
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [30, 50, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        dialogDesempenho: false,
        idAluno: -1
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        var anoAux = anoletivo.split("/")
        var ano = anoAux[0]
        var response = await axios.get(h + "professores/" + this.utilizador.codigo + "/turmas?token=" + this.token + "&ano=" + ano)
        this.turmas = response.data
    },
    methods: {
     onTurmaChange: async function(item){
         if(this.turmas.find(t => t.turma == this.turmaSel.turma)){
            var responseA = await axios.get(h + "turmas/" + this.turmaSel.turma + "/alunos?codprofessor="+ this.utilizador.codigo + "&token=" + this.token)
            this.alunos = responseA.data
         }
     },
     showDesempenho: function(aluno){
         this.idAluno = aluno.id
         this.dialogDesempenho = true
     }
    }
  }
</script>