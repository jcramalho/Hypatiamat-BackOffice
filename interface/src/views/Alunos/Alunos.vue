<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
                <v-card-title primary-title class="justify-center green--text" >
                    Lista de Alunos
                </v-card-title>
                <center><v-btn class="white--text" style="background-color: #009263;" @click="criarAluno()"><v-icon> mdi-account-plus </v-icon> Criar Aluno </v-btn></center>
                <br>
                <v-dialog v-model="csvDialog" width="70%">
                  <v-card class="pa-5">
                    <center>
                    <v-file-input show-size v-model="file" placeholder="Anexar ficheiro csv"  label="Anexar ficheiro csv"
                    prepend-icon="mdi-paperclip" style="width:70%;" color="#009263" @change="checkFile()"/> 

                    <v-btn color="#009263" type='submit' @click="postFile()"> Inserir Alunos </v-btn>
                    </center>
                  </v-card>
                </v-dialog>
                <center><v-btn class="white--text" style="background-color: #009263;" @click="csvDialog = true"><v-icon> mdi-file-delimited </v-icon> Inserir CSV </v-btn></center>
                <v-combobox
                    id="escola"
                    label="Agrupamento de Escolas"
                    prepend-icon="mdi-school"
                    :return-object="true"
                    v-model="escola"
                    color="#009263"
                    :items="escolas"
                    @change="getAlunos()"
                ></v-combobox>
                <v-container v-if="ready">
                <v-text-field
                    v-model="filtrar"
                    label="Filtrar"
                    prepend-icon="mdi-magnify"
                    color="#009263"
                    single-line
                    ></v-text-field>
                    <v-data-table
                    class="elevation-1"
                    loading-text="A carregar alunos..."
                    :headers="header_alunos"
                    :items="alunos"
                    :footer-props="footer_props"
                    :search="filtrar"
                    >
                    <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.user}}</td>
                        <td>{{row.item.nome}}</td>
                        <td>{{row.item.codprofessor}}</td>
                        <td>{{row.item.turma}}</td>
                        <td>
                        <!--<v-icon @click="verAluno(row.item.id)"> mdi-eye </v-icon>-->
                        <v-icon @click="editarAluno(row.item.id)"> mdi-pencil </v-icon>
                        <v-icon @click="apagarAluno(row.item.user)"> mdi-delete </v-icon>
                        </td>
                    </tr>
                    </template>
                    </v-data-table>
                </v-container>
                <v-container v-else>
                <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
                
                </v-container>
                <v-dialog v-model="dialogEditar" width="85%">
                  <v-card>
                  <EditarAluno v-if="dialogEditar" @alteracao="atualizaAlunos()" :idProp="idEditar"/>
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
var fs = require('fs')
var fastcsv = require('fast-csv')
import EditarAluno from '@/components/Alunos/EditarAluno.vue'
const h = require("@/config/hosts").hostAPI

  export default {
    components:{
         EditarAluno
    },
    data(){
      return {
        token: "",
        alunos: [],
        page:1,
        csvDialog:false,
        dialogEditar: false,
         header_alunos: [
            {text: "Username", sortable: true, value: 'user', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Professor", value: 'codprofessor', class: 'subtitle-1'},
            {text: "Turma", value: 'turma', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        ready:false,
        escolas:["Todos"],
        escolasIds:[],
        escola:"Todos",
        escolaAnterior:"Todos",
        file:{},
        idEditar:-1
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        var responseE = await axios.get(h + "escolas")
        this.escolasIds = responseE.data
        var i
        for(i = 0; i < this.escolasIds.length; i++){
          var string = this.escolasIds[i].localidade + " - " + this.escolasIds[i].nome 
          this.escolas.push(string)
        }
        var response = await axios.get(h + "alunos?token=" + this.token)
        this.alunos = response.data

        this.ready = true
    },
    methods: {
      checkFile: async function(){
        console.log(this.file)
        if(this.file != undefined){
          if(this.file.type != "application/vnd.ms-excel"){
            Swal.fire({
                  icon: 'error',
                  text: "O ficheiro tem que ser do tipo csv!",
                  confirmButtonColor: '#009263'
                })
            this.file = {}
          }
        }
      },
      postFile: function(){
        if  (!this.file.type) {
          Swal.fire({
                  icon: 'error',
                  text: "Tem que introduzir um ficheiro csv!",
                  confirmButtonColor: '#009263'
                })
          return;
        }

        let formData = new FormData();
        
        formData.append("ficheiro", this.file)
 
        axios.post(h + 'alunos/csv/?token=' + this.token,
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        ).then((response) => {
           this.csvDialog = false
           Swal.fire({
                  icon: 'info',
                  html: response.data.replaceAll('\n', '<br>'),
                  confirmButtonColor: '#009263'
                })
        })
      },
      verAluno : function(id){
          this.$router.push({name: "Ver Aluno", params: { id : id } })
      },
      editarAluno : function(id){
          //this.$router.push({name: "Editar Aluno", params: { id : id } })
          this.idEditar = id
          this.dialogEditar = true
      },
      getAlunos : async function(){
        if(this.escola){
          this.ready = false
          if(this.escola == "Todos"){
            var response = await axios.get(h + "alunos/?token=" + this.token)
            this.alunos = response.data
          } 
          else{
            var aux = this.escola.split(" - ")
            var escolaEscolhida = this.escolasIds.find(element => element.nome == aux[1])
            if(escolaEscolhida) {var response = await axios.get(h + "escolas/" + escolaEscolhida.cod + "/alunos?token=" + this.token ); this.alunos = response.data}
          }
          //if(this.escola != this.escolaAnterior) this.page = 1
          this.ready = true
        }
      },
      apagarAluno: async function(id){
        Swal.fire({
          title: 'De certeza que deseja apagar este aluno?',
          showDenyButton: true,
          confirmButtonColor: '#009263',
          confirmButtonText: `Sim`,
          denyButtonText: `Não`,
        }).then(async (result) => {
          if (result.isConfirmed) {
              var a = await axios.delete(h + "alunos/" + id + "?token=" + this.token)
              var apagado = a.data
              if(apagado.removed){
                var response = await axios.get(h + "alunos?token=" + this.token)
                this.alunos = response.data
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
      criarAluno: async function(){
        this.$router.push({name: "Criar Aluno"})
      },
      atualizaAlunos: async function(){
        this.dialogEditar = false
        var response = await axios.get(h + "alunos/" + this.idEditar + "/?token=" + this.token)
        var al = this.alunos.find(a => a.id == this.idEditar) 
        var index = this.alunos.indexOf(al)
        this.alunos.splice(index, 1, response.data)
      }
    }
  }
</script>