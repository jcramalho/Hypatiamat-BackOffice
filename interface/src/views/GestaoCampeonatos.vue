<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
                <v-card-title primary-title class="justify-center green--text">
                    Gestão de Campeonatos
                </v-card-title>
                <center><v-btn class="white--text" style="background-color: #009263;" @click="criarCampeonato()"><v-icon> mdi-account-plus </v-icon> Criar Campeonato </v-btn></center>
                                         
                    <v-text-field
                    v-model="filtrar"
                    label="Filtrar"
                    prepend-icon="mdi-magnify"
                    color="#009263"
                    single-line
                    ></v-text-field>
                    <v-data-table
                    class="elevation-1"
                    :headers="header_campeonatos"
                    :items="campeonatos"
                    :footer-props="footer_props"
                    :search="filtrar"
                    color="#009263"
                    >
                    <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.cod}}</td>
                        <td>{{row.item.di}}</td>
                        <td>{{row.item.df}}</td>
                        <td v-if="row.item.municipio">{{row.item.municipio}}</td>
                        <td v-else>------</td>
                        <td v-if="row.item.comunidade">{{row.item.comunidade}}</td> 
                        <td v-else>------</td>
                        <td>
                        <!--<v-icon @click="verProfessor(row.item.id)"> mdi-eye </v-icon>-->
                            <v-icon v-if="row.item.link" @click="goToLink(row.item.link)">mdi-link-variant</v-icon>
                            <v-icon @click="editarCampeonato(row.item.cod, row.index)"> mdi-pencil </v-icon>
                            <v-icon @click="apagarCampeonato(row.index, row.item.cod)"> mdi-delete </v-icon>
                        </td>
                    </tr>
                    </template>
                    </v-data-table>

                    <v-dialog v-model="dialogCriar" width="70%">
                        <CriarCampeonato v-if="dialogCriar" :campeonatos="campeonatos" @atualizaCampeonatos="atualizaCampeonatos()"/>
                    </v-dialog>

                    <v-dialog v-model="dialogEditar" width="77%">
                      <EditarCampeonato v-if="dialogEditar" :codEditar="this.codEditar" @atualizaCampeonato="atualizaCampeonato()"
                          @subnovidades="(subnovidades) => {atualizaSubNovidades(subnovidades)}"/>
                    </v-dialog>
                    
            </v-container>
        </v-card>
      </v-container>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
import Swal from 'sweetalert2'
import EditarCampeonato from '@/components/EditarCampeonato.vue'
import CriarCampeonato from '@/components/CriarCampeonato.vue'
const h = require("@/config/hosts").hostAPI
const hostCampeonatos = require("@/config/hosts").hostCampeonatos

  export default {
    components:{
      EditarCampeonato, CriarCampeonato
    },
    data(){
      return {
        token: "",
        novaNovidade:{
            titulo: "",
            link: "",
            subnovidades:[]
        },
        subnovidade:"",
        loading:false,
        campeonatos: [],
        disabledTitulo:false,
        dialogCriar: false,
        dialogEditar: false,
        codEditar: -1,
        indexEditar: -1,
        header_campeonatos: [
            {text: "Código", sortable: true, value: 'cod', class: 'subtitle-1'},
            {text: "Data (Início)", sortable: true, value: 'di', class: 'subtitle-1'},
            {text: "Data (Final)", sortable: true, value: 'df', class: 'subtitle-1'},
            {text: "Município", sortable: true, value: 'municipio', class: 'subtitle-1'},
            {text: "Comunidade", sortable: true, value: 'comunidade', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        header_subnovidades: [
            {text: "Sub Novidade", sortable: true, value: 'subnovidade', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        filtrar2 : "",
        string15: v =>{
            if(v.length > 15) return 'Não pode ter mais que 15 caractéres.'
            return true
        },
        string70: v =>{
            if(v.length > 70) {this.disabledTitulo = true; return 'Não pode ter mais que 70 caractéres.'}
            if(v.length == 0) {this.disabledTitulo = true; return 'Precisa de um título.'}
            this.disabledTitulo = false
            return true
        },
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.atualizaCampeonatos()

    },
    methods: {
      atualizaCampeonatos: async function(){
        this.dialogCriar = false 
        var response = await axios.get(hostCampeonatos + "?token=" + this.token)
        this.campeonatos = response.data
      },
      insertSubNovidade: function(){
          this.novaNovidade.subnovidades.push({subnovidade: this.subnovidade})
      },
      editarCampeonato: async function(cod, index){
        this.codEditar = cod
        this.indexEditar = index
        this.dialogEditar = true;
      },
      apagarCampeonato: async function(index, codigo){
        Swal.fire({
          title: "De certeza que deseja apagar este campeonato?",
          showDenyButton: true,
          confirmButtonColor: '#009263',
          confirmButtonText: `Sim`,
          denyButtonText: `Não`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            var res = await axios.delete(hostCampeonatos + codigo + "?token=" + this.token)
            if(res.data.deleted){
                this.campeonatos.splice(index, index+1)
                Swal.fire({
                    icon: 'success',
                    title: 'Campeonato apagado com sucesso.',
                    confirmButtonColor: '#009263'
                })
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: res.data.message,
                    confirmButtonColor: '#009263'
                })
            }
          }
        })
      },
      criarCampeonato: async function(){
          this.dialogCriar = true
      },
      apagarSubNovidadeCriada: async function(row){
          this.novaNovidade.subnovidades.splice(row.index, row.index+1)
      },
      atualizaCampeonato: async function(){
          var response = await axios.get(hostCampeonatos + this.codEditar + "/?token=" + this.token)
          this.$set(this.campeonatos, this.indexEditar, response.data)
          this.dialogEditar = false
      },
      atualizaSubNovidades: async function(subnovidades){
        this.novidades[this.indexEditar].subnovidades = subnovidades
      },  
      goToLink: function(link){
        window.open(link, '_blank')
      }
    }
  }
</script>