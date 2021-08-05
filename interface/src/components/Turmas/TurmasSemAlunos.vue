<template>
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Turmas Sem Alunos
            </v-card-title>
            <v-combobox
                id="anoletivo"
                label="Ano Letivo"
                prepend-icon="mdi-counter"
                v-model="anoletivo"
                color="#009263"
                :items="anosletivos"
                @change="getTurmas()"
            ></v-combobox>
            <v-container v-if="laoding">
              <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
            </v-container>
            <div v-else>
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
                    <td>{{row.item.idprofessor}}
                    <td>{{row.item.nome}}</td>
                    <td>{{row.item.agrupamento}}</td>
                    <td>{{row.item.turma}}</td>
                    <td>{{row.item.anoletivo}}</td>
                    <td>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs" 
                          v-on="on"
                        >
                        <v-icon @click="apagarTurma(row.index, row.item.turma, row.item.idprofessor)" color="#009263"> mdi-delete </v-icon>
                        </v-btn>
                      </template>
                      <span>Apagar esta turma.</span>
                    </v-tooltip>
                    </td>
                </tr>
                </template>
                </v-data-table>
            </div>
        </v-container>
    </v-card>
</template>



<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI
const anosletivos1 = require("@/config/confs").anosletivosMaior
import Swal from 'sweetalert2'

  export default {
    data(){
      return {
        token: "",
        turmas: [],
        anosletivos:["Todos"],
        anoletivo:"Todos",
        utilizador : {},
         header_turmas: [
            {text: "Username do Professor", value: 'idprofessor', class: 'subtitle-1'},
            {text: "Nome do Professor", value: 'nome', class: 'subtitle-1'},
            {text: "Agrupamento de Escolas", value: 'agrupamento', class: 'subtitle-1'},
            {text: "Turma", value: 'turma', class: 'subtitle-1'},
            {text: "Ano Letivo", value: 'anoletivo', class: 'subtitle-1'},
            {text: "Operações", sortable:false, class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        loading: false
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.getTurmas()
        for(var i = 0; i < anosletivos1.length; i++){
          this.anosletivos.push(anosletivos1[i])
        }
    },
    methods: {
      getTurmas: async function(){
        this.loading = true
        var response
        if(this.anoletivo != "Todos") response = await axios.get(h + "turmas/semalunos?token=" + this.token + "&anoletivo=" + this.anoletivo)
        else response = await axios.get(h + "turmas/semalunos?token=" + this.token)
        this.turmas = response.data
        this.loading = false
      },
      apagarTurma: async function(index, turma, codprofessor){
          Swal.fire({
                title: 'De certeza que deseja eliminar esta turma?',
                showDenyButton: true,
                confirmButtonColor: '#009263',
                confirmButtonText: `Sim`,
                denyButtonText: `Não`,
              }).then(async (result) => {
                    if (result.isConfirmed) {
                      var resDelete = await axios.delete(h + "turmas/" + turma + "?codprofessor=" + codprofessor + "&token=" + this.token)
                      var apagado = resDelete.data
                      if(apagado.removed){
                        this.turmas.splice(index, 1)
                      }
                      else{
                        Swal.fire({
                          icon: 'error',
                          text: apagado.message,
                          confirmButtonColor: '#009263'
                        })
                      }
                    }})
      },
    }
  }
</script>