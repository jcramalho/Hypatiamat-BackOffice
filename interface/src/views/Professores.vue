<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
                <v-card-title primary-title class="justify-center green--text">
                    Professores
                </v-card-title>
                <center><v-btn class="white--text" style="background-color: #009263;" @click="criarProfessor()"><v-icon> mdi-account-plus </v-icon> Criar Professor </v-btn></center>
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
                        <td>{{row.item.validade}}</td>
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
import EditarProfessor from '@/components/EditarProfessor.vue'
const h = require("@/config/hosts").hostAPI

  export default {
    components:{
         EditarProfessor
    },
    data(){
      return {
        token: "",
        professores: [],
        professoresOriginal:[],
         header_professores: [
            {text: "Username", sortable: true, value: 'codigo', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Localidade", value: 'localidade', class: 'subtitle-1'},
            {text: "Agrupamento", value: 'agrupamento', class: 'subtitle-1'},
            {text: "Sócio", value: 'socionum', class: 'subtitle-1'},
            {text: "Projeto", value: 'projeto', class: 'subtitle-1'},
            {text: "Validade", value: 'validade', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        confirmacaoSel: "Todos",
        validadeSel: "Todos",
        validades: ["Todos", "Dentro da validade", "Fora da validade"],
        confirmacoes: ["Todos", "Confirmados", "Não Confirmados"],
        today:"",
        confirmadoBool: false,
        validadeBool: false, 
        idEditar: -1,
        dialogEditar: false
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        var response = await axios.get(h + "professores?token=" + this.token)
        this.professores = response.data
        this.professoresOriginal = this.professores
    },
    methods: {
      verProfessor : function(id){
          this.$router.push({name: "Ver Professor", params: { id : id } })
      },
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
        var al = this.professores.find(a => a.id == this.idEditar) 
        var index = this.professores.indexOf(al)
        this.professores.splice(index, 1, response.data)
      }
    }
  }
</script>