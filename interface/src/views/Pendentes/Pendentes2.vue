<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
                <v-row class="justify-center no-gutters" >

                <v-card-title class="green--text" style="padding-right:0px">Professores não confirmados/</v-card-title>
                <v-card-title class="green--text" style="padding-left:0px; padding-right:0px"> sem acesso premium/</v-card-title>
                <v-card-title class="green--text" style="padding-left:0px"> com validade expirada </v-card-title>
                </v-row>
                <v-text-field
                    v-model="filtrar"
                    label="Filtrar"
                    prepend-icon="mdi-magnify"
                    color="#009263"
                    single-line
                    ></v-text-field>
                    <v-data-table
                    class="elevation-1"
                    :headers="header_professores"
                    :items="professores"
                    :footer-props="footer_props"
                    :search="filtrar"
                    >
                    <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.codigo}}</td>
                        <td>{{row.item.nome}}</td>
                        <td>{{row.item.localidade}}</td>
                        <td>{{row.item.agrupamento}}</td>
                        <td>{{row.item.socionum}}</td>
                        <td>{{row.item.projeto}}</td>
                        <td v-if="row.item.valido"> <v-icon color="green">mdi-check-bold</v-icon> </td>
                        <td v-else> <v-icon color="red">mdi-close-thick</v-icon> </td>
                        <td>
                        <!--<v-icon @click="verProfessor(row.item.id)"> mdi-eye </v-icon>-->
                        <v-icon @click="editarProfessor(row.item.id)"> mdi-pencil </v-icon>
                        <v-icon @click="apagarProfessor(row.item.codigo)"> mdi-delete </v-icon>
                        </td>
                    </tr>
                    </template>
                    </v-data-table>
                    <v-dialog v-model="dialogEditar" width="80%">
                      <v-card>
                      <EditarProfessor v-if="dialogEditar" :idProp="idEditar" @alteracao="atualizaProfessores()"/>
                      </v-card>
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
import EditarProfessor from '@/components/Professores/EditarProfessor.vue'
const h = require("@/config/hosts").hostAPI

  export default {
    components:{
         EditarProfessor
    },
    data(){
      return {
        token: "",
        professores: [],
         header_professores: [
            {text: "Username", value: 'codigo', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Localidade", value: 'localidade', class: 'subtitle-1'},
            {text: "Agrupamento", value: 'agrupamento', class: 'subtitle-1'},
            {text: "Sócio", value: 'socionum', class: 'subtitle-1'},
            {text: "Projeto", value: 'projeto', class: 'subtitle-1'},
            {text: "Válido", value:'valido', class:"subtitle-1"},
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        idEditar: -1,
        dialogEditar: false
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        var response = await axios.get(h + "professores/naoconfirmados?token=" + this.token)
        this.professores = response.data
    },
    methods: {
     editarProfessor : function(id){
          this.dialogEditar = true;
          this.idEditar = id
          //this.$router.push({name: "Editar Professor", params: { id : id } })
      },
      apagarProfessor: async function(id){
        Swal.fire({
          title: "De certeza que deseja apagar este professor?",
          showDenyButton: true,
          confirmButtonColor: '#009263',
          confirmButtonText: `Sim`,
          denyButtonText: `Não`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            var a = await axios.delete(h + "professores/" + id + "?token=" + this.token)
              var apagado = a.data
              if(apagado.removed){
                var response = await axios.get(h + "professores?token=" + this.token)
                this.professores = response.data
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
      criarProfessor: async function(){
        this.$router.push({name:"Criar Professor"})
      },
      atualizaProfessores: async function(){
        this.dialogEditar = false
        var response = await axios.get(h + "professores/" + this.idEditar + "/?token=" + this.token)
        var edited = response.data
        var al = this.professores.find(a => a.id == this.idEditar) 
        var index = this.professores.indexOf(al)
        if(edited.confirmacao == 1 && edited.premium != 0 && edited.valido){
          this.professores.splice(index, index+1)
        }
        else{
          this.professores.splice(index, 1, edited)
        }
      }
    }
  }
</script>