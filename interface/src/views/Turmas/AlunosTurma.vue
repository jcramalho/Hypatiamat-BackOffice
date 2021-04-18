<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
                <v-card-title primary-title class="justify-center green--text">
                    Alunos da Turma {{turma.turma}}
                </v-card-title>
                <center v-if="utilizador.type==20">
                  <v-btn v-if="!show" text @click="show=!show"><span>Mostrar Ajuda</span><v-icon color="#009263"> mdi-help-circle </v-icon> </v-btn>
                  <v-btn v-else text @click="show=!show">Esconder Ajuda</v-btn> 
                </center>
                
                <v-slide-y-transition v-if="utilizador.type==20">
                      <v-card v-show="show" class="elevation-6 pa-3" style="border: 2px solid green !important;" color="grey lighten-3">
                        <v-row >
                          <v-col cols="12">
                            <span> 1. Na tabela, é possível visualizar os alunos pertencentes à turma, assim como algumas das suas informações.
                            </span>
                          </v-col>
                          <v-col cols="12">
                          <span> 2. Caso algum aluno pertença agora a uma turma diferente, mas tenha pertencido à turma, irá possuir uma cor diferente. </span>
                          </v-col>
                          <v-col cols="12">
                          <span> 3. Caso pretenda editar as informações de um aluno ou a sua password, clique em <v-icon>mdi-pencil</v-icon> do aluno pretendido. </span> 
                          </v-col>
                        </v-row>
                      </v-card>
                </v-slide-y-transition>
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
                    <template v-slot:item="row" >
                    <tr :class="row.item.alunoOld ? 'style-AlunoOld' : 'style-AlunoAtual'">
                        <td>{{row.item.numero}}</td>
                        <td>{{row.item.nome}}</td>
                        <td>{{row.item.user}}</td>
                        <td>{{row.item.email}}</td>
                        <td>{{row.item.agrupamento}}</td>
                        <td v-if="utilizador.type==20">
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
                      
                      <v-dialog v-if="utilizador.type==20" class="mydialog" v-model="dialogEditar" width="85%" >
                        <v-card id="inspire">
                          <EditarAluno v-if="dialogEditar" @alteracao="atualizaAlunos()" :idProp="this.idEditarAluno"/>
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
import EditarAluno from '@/components/Alunos/EditarAluno.vue'
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
            "items-per-page-options": [30, 50, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        idTurma: "",
        turma: {},
        utilizador:{},
        dialogEditar: false,
        idEditarAluno:-1,
        show:false
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.idTurma = this.$route.params.id
        var response = await axios.get(h + "turmas/" + this.idTurma + "?token=" + this.token)                     
        if(response) this.turma = response.data
        else this.$router.push({name: "Meu Perfil"})
        
        if(this.utilizador.type != 20){
          this.header_alunos = [
            {text: "Número", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Username", value: 'user', class: 'subtitle-1'},
            {text: "Email", value: 'email', class: 'subtitle-1'},
            {text: "Agrupamento", value: 'agrupamento', class: 'subtitle-1'},
          ]
        }
        var responseA = await axios.get(h + "turmas/" + this.turma.turma + "/alunos?codprofessor="+ this.turma.idprofessor + "&token=" + this.token)
        this.alunos = responseA.data
    },
    methods: {
      editarAluno : function(idAluno){
          this.idEditarAluno = idAluno;
          this.dialogEditar = true;
          //this.$router.push({name: "Editar Aluno", params: { id : idAluno } })
      },
      atualizaAlunos: async function(){
        this.dialogEditar = false
        var response = await axios.get(h + "alunos/" + this.idEditarAluno + "/?token=" + this.token)
        var al = this.alunos.find(a => a.id == this.idEditarAluno) 
        var index = this.alunos.indexOf(al)
        this.alunos.splice(index, 1, response.data)
      },
      itemRowBackground: function (item) {
        console.log(item)
        return item.alunoOld ? 'style-1' : 'style-2'
      }

  }
  }
</script>

<style>
.style-AlunoOld {
  background-color: rgb(215,215,44)
}
.style-AlunoAtual {
  background-color: white
}

.mydialog {
    align-self: flex-end;
  }
</style>