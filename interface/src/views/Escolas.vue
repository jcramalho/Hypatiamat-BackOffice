<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
              <v-card-title primary-title class="justify-center green--text">
                    Lista de Agrupamentos de Escolas
                </v-card-title>
                <center><v-btn class="white--text" style="background-color: #009263;" @click="criarEscola()"><v-icon> mdi-account-plus </v-icon> Criar Agrupamento </v-btn></center>
                <center>
                <v-text-field
                    class="text--black"
                    label="Procurar escolas por distrito ou país..."
                    color="#009263"
                    v-model="searchInput"
                    hide-details
                    style="max-width:700px;"
                    >
                </v-text-field>
                <br>
                <center><v-btn class="white--text" style="background-color: #009263;" @click="pesquisarLocalidade()"> Pesquisar por Localidade </v-btn></center>
                <br>
                <center><v-btn class="white--text" style="background-color: #009263;" @click="pesquisarDistrito()"> Pesquisar por Distrito </v-btn></center>
                <br>
                <center><v-btn class="white--text" style="background-color: #009263;" @click="pesquisarPais()"> Pesquisar por País </v-btn></center>
                <br>
                <v-btn class="white--text" style="background-color: #009263;" @click="reporTudo()"> Repor tudo </v-btn>
                </center>
                <v-text-field
                    v-model="filtrar"
                    label="Filtrar"
                    prepend-icon="mdi-magnify"
                    color="#009263"
                    single-line
                    ></v-text-field>
                    <v-data-table
                    class="elevation-1"
                    :headers="header_escolas"
                    :items="escolas"
                    :footer-props="footer_props"
                    :search="filtrar"
                    >
                    <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.nome}}</td>
                        <td>{{row.item.localidade}}</td>
                        <td>
                        <v-icon @click="editarEscola(row.item.cod)"> mdi-pencil </v-icon>
                        <v-icon @click="apagarEscola(row.item.cod)"> mdi-delete </v-icon>
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

  export default {
    data(){
      return {
        token: "",
        searchInput: "",
        escolas: [],
         header_escolas: [
            {text: "Nome", sortable: true, value: 'nome', class: 'subtitle-1'},
            {text: "Localidade", value: 'localidade', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        var response = await axios.get(h + "escolas?token=" + this.token)
        this.escolas = response.data
    },
    methods: {
      editarEscola : function(cod){
          this.$router.push({name: "Editar Escola", params: { id : cod } })
      },
      apagarEscola: async function(id){
        Swal.fire({
          title: "De certeza que deseja apagar este agrupamento?",
          showDenyButton: true,
          confirmButtonColor: '#009263',
          confirmButtonText: `Sim`,
          denyButtonText: `Não`,
        }).then(async (result) => {
          if (result.isConfirmed) {
              var a = await axios.delete(h + "escolas/" + id + "?token=" + this.token)
              var apagado = a.data
              if(apagado.removed){
                var response = await axios.get(h + "escolas?token=" + this.token)
                this.escolas = response.data
              }
              else{
                Swal.fire({
                  icon: 'error',
                  text: apagado.message,
                  confirmButtonColor: '#009263'
                })
              }
          }
        })
      },
      pesquisarLocalidade: async function(){
        if(this.searchInput != ""){
          var response = await axios.get(h + "escolas/localidades/" + this.searchInput +"?token=" + this.token)
          this.escolas = response.data
        }
      },
      pesquisarDistrito: async function(){
        if(this.searchInput != ""){
          var response = await axios.get(h + "escolas/distritos/" + this.searchInput +"?token=" + this.token)
          this.escolas = response.data
        }
      },
      pesquisarPais: async function(){
        if(this.searchInput != ""){
          var response = await axios.get(h + "escolas/paises/" + this.searchInput +"?token=" + this.token)
          this.escolas = response.data
        }
      },
      reporTudo: async function(){
        var response = await axios.get(h + "escolas?token=" + this.token)
        this.escolas = response.data
      },
      criarEscola: function(){
        this.$router.push({name:"Criar Escola"})
      }
    }
  }
</script>