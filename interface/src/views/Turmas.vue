<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Lista de Turmas
            </v-card-title>
            <center><v-btn class="white--text" style="background-color: #009263;" @click="criarTurma()"> <v-icon> mdi-book-plus </v-icon> Criar Turma </v-btn></center>
            <v-combobox
                id="escola"
                prepend-icon="mdi-school"
                :return-object="true"
                v-model="escola"
                color="#009263"
                :items="escolas"
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
                    <td @click="verProfessor(row.item.idprofessor)" style="cursor: pointer;">{{row.item.idprofessor}}</td>
                    <td>{{row.item.turma}}</td>
                    <td>
                    <v-icon @click="editarTurma(row.item.id, row.item.idprofessor)"> mdi-pencil </v-icon>
                    <v-icon @click="apagarTurma(row.item.turma, row.item.idprofessor)"> mdi-delete </v-icon>
                    </td>
                </tr>
                </template>
                </v-data-table>
        </v-container>
    </v-card>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI

  export default {
    data(){
      return {
        token: "",
        turmas: [],
         header_turmas: [
            {text: "Username do Professor", sortable: true, value: 'idprofessor', class: 'subtitle-1'},
            {text: "Turma", value: 'turma', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
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
          this.$router.push({name: "Criar Turma" })
      },
      getTurmas : async function(){
        var aux = this.escola.split(" - ")
        var escolaEscolhida = this.escolasIds.find(element => element.nome == aux[1]).cod
        var response = await axios.get(h + "escolas/" + escolaEscolhida + "/turmas?token=" + this.token )
        console.log(response.data)
        this.turmas = response.data
      },
      editarTurma : function(idTurma, idprofessor){
          this.$router.push({name: "Editar Turma", params: { id : idTurma, idprofessor: idprofessor } })
      },
      apagarTurma: async function(turma, codprofessor){
          if(confirm("De certeza que deseja apagar esta turma?")){
              var resDelete = await axios.delete(h + "turmas/" + turma + "?codprofessor=" + codprofessor + "&token=" + this.token)
              var apagado = resDelete.data
              if(apagado.removed){
                var response = await axios.get(h + "turmas?token=" + this.token)
                this.turmas = response.data
              }
              else{
                alert(apagado.message)
              }
          }
      }
    }
  }
</script>