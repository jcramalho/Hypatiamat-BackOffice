<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
                <v-card-title primary-title class="justify-center green--text">
                    Lista de Turmas
                </v-card-title>
                <center><v-btn class="white--text" style="background-color: #009263;" @click="criarTurma()"> <v-icon> mdi-book-plus </v-icon> Criar Turma </v-btn></center>
                <v-combobox
                    id="escola"
                    label="Agrupamento de Escolas"
                    prepend-icon="mdi-school"
                    :return-object="true"
                    v-model="escola"
                    color="#009263"
                    :items="escolas"
                    @change="getTurmas()"
                ></v-combobox>
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
                        <td >{{row.item.idprofessor}}</td>
                        <td>{{row.item.nome}}</td>
                        <td>{{row.item.turma}}</td>
                        <td>{{row.item.anoletivo}}</td>
                        <td class="d-flex align-center">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                            <v-simple-checkbox
                                v-model="row.item.passportPassword"
                                color="#009263"
                                v-bind="attrs" 
                                v-on="on"
                                :ripple="false"
                            ></v-simple-checkbox>
                            </template>
                            <span>Se selecionar esta opção, a palavra-passe dos alunos do passaporte irá ser preenchida com a palavra-passe gerada pelo Hypatiamat.</span>
                        </v-tooltip>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              icon
                              v-bind="attrs" 
                              v-on="on"
                            >
                            <v-icon @click="getPassaporte(row.item.turma, row.item.idprofessor, row.item.passportPassword)"> mdi-passport </v-icon>
                            </v-btn>
                          </template>
                          <span>Gerar um passaporte (PDF) à cerca dos alunos da turma.</span>
                        </v-tooltip>
                        <v-icon @click="editarTurma(row.item.id, row.item.idprofessor)"> mdi-pencil </v-icon>
                        <v-icon @click="apagarTurma(row.item.turma, row.item.idprofessor)"> mdi-delete </v-icon>
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
import Swal from 'sweetalert2'
const h = require("@/config/hosts").hostAPI
import {Passaport} from '../config/passport'

  export default {
    data(){
      return {
        token: "",
        anosletivos:["Todos", "20/21", "19/20", "18/19", "17/18", "16/17", "15/16", "14/15", "13/14"],
        anoletivo:"Todos",
        turmas: [],
         header_turmas: [
            {text: "Username do Professor", sortable: true, value: 'idprofessor', class: 'subtitle-1'},
            {text: "Nome do Professor", sortable: true, value: 'nome', class: 'subtitle-1'},
            {text: "Turma", value: 'turma', class: 'subtitle-1'},
            {text: "Ano Letivo", value: 'anoletivo', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        escolas: [],
        escola: "",
        escolasIds : [],
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        //var response = await axios.get(h + "turmas?token=" + this.token)
        //this.turmas = response.data
        var response = await axios.get(h + "escolas")
        this.escolasIds = response.data
        var i
        for(i = 0; i < this.escolasIds.length; i++){
          var string = this.escolasIds[i].localidade + " - " + this.escolasIds[i].nome 
          this.escolas.push(string)
        }
    },
    methods: {
      criarTurma : function(){
          this.$router.push({name: "Criar Turma",  params:{isAdmin:true} })
      },
      getTurmas : async function(){
        if(this.escola!="" && this.escola){
          var aux = this.escola.split(" - ")
          var escolaEscolhida = this.escolasIds.find(element => element.nome == aux[1]).cod
          if(this.anoletivo == "Todos"){
            var response = await axios.get(h + "escolas/" + escolaEscolhida + "/turmas?token=" + this.token )
            this.turmas = response.data
          }
          else{
             var anoAux = this.anoletivo.split("/")
             var ano = anoAux[0]
             var response = await axios.get(h + "escolas/" + escolaEscolhida + "/turmas?token=" + this.token + "&ano=" + ano)
             this.turmas = response.data
          }
        }
      },
      editarTurma : function(idTurma, idprofessor){
          this.$router.push({name: "Editar Turma", params: { turma : idTurma, idprofessor: idprofessor } })
      },
      apagarTurma: async function(turma, codprofessor){
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
                        this.getTurmas()
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
      getPassaporte : function(turma, codprofessor, passportPassword){
        var passwords = false;
        if(passportPassword) passwords = true
        if(passwords){
          Passaport.getPassaporteTurmaPassword( turma, codprofessor, this.escola.split("-")[1].split(",")[0] )
        }
        else{
          Passaport.getPassaporteTurma( turma, codprofessor, this.escola.split("-")[1].split(",")[0] )
        }
      }
    }
  }
</script>