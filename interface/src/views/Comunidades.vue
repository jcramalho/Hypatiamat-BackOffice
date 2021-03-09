<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
                <v-card-title primary-title class="justify-center green--text">
                    Comunidades de Municípios
                </v-card-title>
                <center><v-btn class="white--text" style="background-color: #009263;" @click="criarComunidade()"><v-icon> mdi-account-plus </v-icon> Criar Comunidade </v-btn></center>
                                         
                <v-text-field
                    v-model="filtrar"
                    label="Filtrar"
                    prepend-icon="mdi-magnify"
                    color="#009263"
                    single-line
                    ></v-text-field>
                    <v-data-table
                    class="elevation-1"
                    :headers="header_comunidades"
                    :items="comunidades"
                    :footer-props="footer_props"
                    :search="filtrar"
                    color="#009263"
                    >
                    <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.codigo}}</td>
                        <td>{{row.item.nome}}</td>
                        <td>{{row.item.municipios}}</td>
                        <td>
                        <!--<v-icon @click="verProfessor(row.item.id)"> mdi-eye </v-icon>-->
                        <v-icon @click="editarComunidade(row.item.codigo, row.item.nome)"> mdi-pencil </v-icon>
                        <v-icon @click="apagarComunidade(row.item.codigo)"> mdi-delete </v-icon>
                        </td>
                    </tr>
                    </template>
                    </v-data-table>
                    <v-dialog v-model="dialogCriar" width="70%">
                        <v-card class="pa-5">
                            <v-container>
                                <v-form>
                                    <v-text-field prepend-icon="mdi-card-account-details" color="#009263"
                                        v-model="novoCodigo" name="Código da Comunidade" :rules="[existeCodigo]" label="Código da Comunidade" 
                                        required
                                    ></v-text-field>
                                    <v-text-field prepend-icon="mdi-card-account-details" color="#009263"
                                        v-model="novoNome" name="Nome da Comunidade" :rules="[existeNome]" label="Nome da Comunidade" 
                                        required
                                    ></v-text-field>
                                    <v-combobox
                                        id="municipios"
                                        chips
                                        prepend-icon="mdi-city"
                                        v-model="novosMunicipios"
                                        label="Municípios da Comunidade"
                                        color="#009263"
                                        :multiple="true"
                                        :items="municipios"
                                        :rules="[existemMunicipios]"
                                    ></v-combobox>
                                </v-form>
                                <v-btn class="white--text" :disabled="disabledCodigo || disabledNome || disabledMunicipios" 
                                block style="background-color: #009263;" @click="insertComunidade()">
                                  Criar Comunidade
                                </v-btn>
                            </v-container>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogEditar" width="77%">
                      <EditarComunidade v-if="dialogEditar" :codigo="this.idEditar" @municipios="(municipios) => atualizaComunidade(municipios)"
                            :comunidades="this.comunidades" :nomeComunidade="this.nomeEditar"/>
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
import EditarComunidade from '@/components/EditarComunidade.vue'
const h = require("@/config/hosts").hostAPI

  export default {
    components:{
      EditarComunidade
    },
    data(){
      return {
        token: "",
        novoCodigo: "",
        novoNome: "",
        municipios:[],
        novosMunicipios:[],
        loading:false,
        comunidades: [],
        disabledCodigo:false,
        disabledNome:false,
        disabledMunicipios: false,
        dialogCriar: false,
        dialogEditar: false,
        idEditar: -1,
        nomeEditar: "",
        header_comunidades: [
            {text: "Código", sortable: true, value: 'codigo', class: 'subtitle-1'},
            {text: "Nome", sortable: true, value: 'nome', class: 'subtitle-1'},
            {text: "Municípios", sortable: true, value: 'municipios', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        string15: v =>{
            if(v.length > 15) return 'Não pode ter mais que 15 caractéres.'
            return true
        },
        string30: v =>{
            if(v.length > 30) return 'Não pode ter mais que 30 caractéres.'
            return true
        },
        existeCodigo: v =>{
            if(v.length == 0) { this.disabledCodigo = true; return 'Tem de atribuir um código à comunidade.'}
            if(this.comunidades.find(e => e.codigo == v)) { this.disabledCodigo = true; return 'Código já existente.'}
            this.disabledCodigo = false
            return true
        },
        existeNome: v =>{
            if(v.length == 0) { this.disabledNome = true; return 'Tem de atribuir um nome à comunidade.'}
            if(this.comunidades.find(e => e.nome == v)) { this.disabledNome = true; return 'Nome já existente.'}
            this.disabledNome = false
            return true
        },
        existemMunicipios: v =>{
            if(this.novosMunicipios.length == 0) { this.disabledMunicipios = true; return 'Tem de selecionar, pelo menos, 1 município.'}
            this.disabledMunicipios = false
            return true
        },
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        var response = await axios.get(h + "comunidades?token=" + this.token)
        this.comunidades = response.data
        this.parseMunicipios()

    },
    methods: {
      parseMunicipios: async function(){
          var response = await axios.get(h + "escolas/localidades?token=" + this.token)
          this.municipios = []
          for(var i = 0; i < response.data.length; i++){
              this.municipios.push(response.data[i].localidade)
          }
      },
      editarComunidade: async function(codigo, nome){
        this.idEditar = codigo
        this.nomeEditar = nome
        this.dialogEditar = true;
      },
      insertComunidade: async function(){
        var comunidade = {
          codigo: this.novoCodigo,
          nome: this.novoNome,
          municipios: this.novosMunicipios
        }
        axios.post(h + "comunidades?token=" + this.token, comunidade)
             .then(async message => {
                this.dialogCriar = false
                Swal.fire({
                  icon: 'success',
                  title: 'Comunidade criada com sucesso',
                  confirmButtonColor: '#009263'
                })
                var response = await axios.get(h + "comunidades?token=" + this.token)
                this.comunidades = response.data
             })
             .catch(error => console.log(error))
      },
      apagarComunidade: async function(codigo){
        Swal.fire({
          title: "De certeza que deseja apagar esta comunidade?",
          showDenyButton: true,
          confirmButtonColor: '#009263',
          confirmButtonText: `Sim`,
          denyButtonText: `Não`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            var res = (await axios.delete(h + "comunidades/" + codigo + "?token=" + this.token)).data
            if(res.deleted){
              Swal.fire({
                icon: 'success',
                title: 'Comunidade apagada com sucesso',
                confirmButtonColor: '#009263'
              })
              var response = await axios.get(h + "comunidades?token=" + this.token)
              this.comunidades = response.data
            }
            else {
              Swal.fire({
                icon: 'error',
                title: res.message,
                confirmButtonColor: '#009263'
              })
            }
        
              
          }
        })
      },
      criarComunidade: async function(){
          this.dialogCriar = true
      },
      atualizaComunidade: async function(municipios){
        console.log(municipios)
        var com = this.comunidades.find(e => e.codigo == this.idEditar)
        com.municipios = municipios
      }
    }
  }
</script>