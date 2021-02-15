<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Códigos de Professores
            </v-card-title>
            <center><v-btn class="white--text" style="background-color: #009263;" @click="criarCodigo()"><v-icon> mdi-account-plus </v-icon> Criar Codigo </v-btn></center>
            <v-text-field
                v-model="filtrar"
                label="Filtrar"
                prepend-icon="mdi-magnify"
                color="#009263"
                single-line
                ></v-text-field>
                <v-data-table
                class="elevation-1"
                :headers="header_codigos"
                :items="codigos"
                :footer-props="footer_props"
                :search="filtrar"
                >
                <template v-slot:item="row">
                <tr>
                    <td>{{row.item.codigo}}</td>
                    <td>
                    <!--<v-icon @click="verProfessor(row.item.id)"> mdi-eye </v-icon>-->
                    <v-icon @click="apagarCodigo(row.item.id)"> mdi-delete </v-icon>
                    </td>
                </tr>
                </template>
                </v-data-table>
                <v-dialog v-model="dialogCriar" width="70%">
                    <v-card class="pa-5">
                        <v-container>
                            <v-form>
                                <v-text-field prepend-icon="mdi-card-account-details" color="#009263" type="number"
                                        v-model="novoCodigo" name="Código Professor" :rules="[existeCodigo, number]" label="Código Professor" 
                                        required
                                ></v-text-field>
                            </v-form>
                            <v-btn class="white--text" block style="background-color: #009263;" @click="inserirCodigo()">Criar Codigo</v-btn>
                        </v-container>
                    </v-card>
                </v-dialog>
        </v-container>
    </v-card>
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
        novoCodigo: "",
        codigos: [],
        dialogCriar: false,
        codigosExistentes: [],
        header_codigos: [
            {text: "Código", sortable: true, value: 'codigo', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        string15: v =>{
            if(v.length > 15) return 'Não pode ter mais que 15 caractéres'
            return true
        },
        existeCodigo: v =>{
            if(this.codigos.find(e => e.codigo == v)) return 'Código já existente.'
            return true
        },
        number: v  => {
          //if (!v.trim()) return true;
          if (!isNaN(parseInt(v))) return true;
          return 'Tem que ser um inteiro';
        } 
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        var response = await axios.get(h + "codigos?token=" + this.token)
        this.codigos = response.data
        //var responseCod = await axios.get(h + "professores/codigos")
        //this.codigosExistentes = responseCod.data
    },
    methods: {
      
      apagarCodigo: async function(id){
        Swal.fire({
          title: "De certeza que deseja apagar este código?",
          showDenyButton: true,
          confirmButtonColor: '#009263',
          confirmButtonText: `Sim`,
          denyButtonText: `Não`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            var a = await axios.delete(h + "codigos/" + id + "?token=" + this.token)
            var response = await axios.get(h + "codigos?token=" + this.token)
            this.codigos = response.data
              
          }
        })
      },
      criarCodigo: async function(){
          this.dialogCriar = true
      },
      inserirCodigo: async function(){
          axios.post(h + "codigos?token=" + this.token, {codigo: this.novoCodigo})
               .then(async ()=> {
                   this.dialogCriar = false
                   Swal.fire({
                      icon: 'success',
                      title: 'Código registado com sucesso.',
                      confirmButtonColor: '#009263'
                    })
                    var response = await axios.get(h + "codigos?token=" + this.token)
                    this.codigos = response.data
                    this.novoCodigo = ""     
               })
      }
    }
  }
</script>