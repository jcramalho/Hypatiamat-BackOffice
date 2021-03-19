<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
                <v-card-title primary-title class="justify-center green--text">
                    Códigos de Professores
                </v-card-title>
                <center><v-btn class="white--text" style="background-color: #009263;" @click="criarCodigo()"><v-icon> mdi-account-plus </v-icon> Criar Código </v-btn></center>
                <br>
                <center><v-btn class="white--text" style="background-color: #009263;" @click="dialogGerar = true"><v-icon> mdi-horseshoe </v-icon> Gerar Codigos </v-btn></center>                                         
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
                    color="#009263"
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
                                <v-btn class="white--text" :disabled="disabled" block style="background-color: #009263;" @click="inserirCodigo()">Criar Código</v-btn>
                            </v-container>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogGerar" width="70%">
                      <v-card class="pa-5">
                      <v-container >
                        <center>
                        <v-form style="width:80%">
                          <v-text-field color="#009263" type="number"
                                        v-model="nCodigos" name="Numero de Códigos" :rules="[ruleNCodigos]" label="Número de Códigos" 
                                            required
                          ></v-text-field>
                          <v-btn class="white--text" :disabled="disabledGerar" block style="background-color: #009263;" @click="gerarCodigos()">Gerar e Inserir Códigos</v-btn>
                          <br>
                        </v-form>
                        </center>
                        <v-container v-if="loading">
                          <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
                        </v-container>
                        <v-container v-else>
                          <v-data-table
                              class="elevation-4"
                              :headers="header_codigos_gerados"
                              :items="codigosGerados"
                              :footer-props="footer_props"
                          >
                          </v-data-table>
                        </v-container>
                      </v-container>
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
const h = require("@/config/hosts").hostAPI

  export default {
    data(){
      return {
        token: "",
        novoCodigo: "",
        inseridos: false,
        nCodigos:10,
        loading:false,
        codigos: [],
        disabled:false,
        disabledGerar: false,
        dialogCriar: false,
        codigosExistentes: [],
        dialogGerar: false,
        header_codigos: [
            {text: "Código", sortable: true, value: 'codigo', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        codigosGerados: [],
        header_codigos_gerados: [
            {text: "Código", align: 'center', sortable: true, value: 'codigo', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        string15: v =>{
            if(v.length > 11) return 'Não pode ter mais que 11 digitos'
            return true
        },
        existeCodigo: v =>{
            if(this.codigos.find(e => e.codigo == v)) { this.disabled = true; return 'Código já existente.'}
            this.disabled = false
            return true
        },
        number: v  => {
          //if (!v.trim()) return true;
          if (!isNaN(parseInt(v))) {this.disabled = false; return true;}
          this.disabled = true
          return 'Tem que ser um inteiro';
        },
        ruleNCodigos: v  => {
          //if (!v.trim()) return true;
          if (!isNaN(parseInt(v)) && v > 0 && v <= 1000) {this.disabledGerar = false; return true;}
          this.disabledGerar = true
          return 'Tem que ser um inteiro (Compreendido entre 1 e 1000)';
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
      },
      gerarCodigos: async function(){
        this.loading = true
        var auxCodigos = []
        var random = Math.floor(Math.random() * (10000 - 1000) ) + 1000
        var j = 0
        for(var i = 0; i < this.nCodigos;){
          var newCodigo = random + j
          if(this.codigos.find(e => e.codigo == newCodigo)){
            j++
          }
          else{
            auxCodigos.push({codigo: newCodigo})
            i++
            j++
          }
        }
        this.codigosGerados = auxCodigos
        console.log(this.codigosGerados)
        axios.post(h + "codigos/lista?token=" + this.token, {codigos: this.codigosGerados})
             .then(async ()=>{ 
               Swal.fire({
                      icon: 'success',
                      title: 'Códigos gerados e inseridos com sucesso.',
                      confirmButtonColor: '#009263'
                    })
                this.loading = false
                var response = await axios.get(h + "codigos?token=" + this.token)
                this.codigos = response.data
             })
             .catch(erro=> console.log(erro))
        
      }
    }
  }
</script>