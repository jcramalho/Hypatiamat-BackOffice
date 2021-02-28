<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Alunos da Turma {{turma.turma}}
            </v-card-title>
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
                    <td>{{row.item.numero}}</td>
                    <td>{{row.item.nome}}</td>
                    <td>{{row.item.user}}</td>
                    <td>{{row.item.email}}</td>
                    <td>{{row.item.agrupamento}}</td>
                    <td>
                      <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs" 
                          v-on="on"
                        >
                        <v-icon @click="editarAluno(row.item.id)"> mdi-pencil </v-icon>
                        </v-btn>
                        </template>
                        <span>Poderá editar informações do seu aluno.</span>
                      </v-tooltip>
                    </td>
                </tr>
                </template>
                </v-data-table>
                <center>
                  <v-dialog style="align-self: flex-end;" v-model="dialogEditar" width="85%">
                    <v-card>
                      <EditarAluno v-if="dialogEditar" @alteracao="atualizaAlunos()" :idProp="this.idEditarAluno"/>
                    </v-card>
                  </v-dialog>
                </center>
        </v-container>
    </v-card>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
import EditarAluno from '@/components/EditarAluno.vue'
import Swal from 'sweetalert2'
const h = require("@/config/hosts").hostAPI

  export default {
    components:{
         EditarAluno
    },
    data(){
      return {
        token: "",
        alunos: [],
         header_alunos: [
            {text: "Número", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Username", value: 'user', class: 'subtitle-1'},
            {text: "Email", value: 'email', class: 'subtitle-1'},
            {text: "Agrupamento", value: 'agrupamento', class: 'subtitle-1'},
            {text: "Editar", sortable:false, class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [30, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        idTurma: "",
        turma: {},
        utilizador:{},
        dialogEditar: false,
        idEditarAluno:-1,
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.idTurma = this.$route.params.id
        var response = await axios.get(h + "turmas/" + this.idTurma + "?token=" + this.token)
        this.turma = response.data
        var responseA = await axios.get(h + "turmas/" + this.turma.turma + "/alunos?codprofessor="+ this.turma.idprofessor + "&token=" + this.token)
        this.alunos = responseA.data
    },
    methods: {
      editarAluno : function(idAluno){
          this.idEditarAluno = idAluno;
          this.dialogEditar = true;
          //this.$router.push({name: "Editar Aluno", params: { id : idAluno } })
      },
      editarTurma: function(id){

      },
      atualizaAlunos: async function(){
        this.dialogEditar = false
        var response = await axios.get(h + "alunos/" + this.idEditarAluno + "/?token=" + this.token)
        var al = this.alunos.find(a => a.id == this.idEditarAluno) 
        var index = this.alunos.indexOf(al)
        this.alunos.splice(index, 1, response.data)
      }
  }
  }
</script>