<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
                <v-card-title primary-title class="justify-center green--text">
                    Transferência de Alunos ({{turma.turma}})
                </v-card-title>
                        
              <v-layout row class="text-xs-center pa-lg-16" justify-center >
          <v-flex xs5>
            <v-card class="pa-4">
                <v-card-title primary-title class="justify-center">
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
                    v-model="selected"
                    :single-select="false"
                    show-select
                    :headers="header_alunos"
                    :items="alunosTurmaAtual"
                    :footer-props="footer_props"
                    :search="filtrar"
                    >
                    <template v-slot:item="row">
                    <tr>
                        <td>
                            <v-checkbox color="green" v-model="selected" :value="row.item" style="margin:0px;padding:0px"
                                hide-details />
                        </td>
                        <td>{{row.item.numero}}</td>
                        <td>{{row.item.nome}}</td>
                        <td>
                        <!--<v-icon @click="verProfessor(row.item.id)"> mdi-eye </v-icon>-->
                        <v-icon @click="dialogEditar1 = true; idEditar1=row.item.id"> mdi-pencil </v-icon>
                        </td>
                    </tr>
                    </template>
                    </v-data-table>
            </v-card>
          </v-flex>
          <v-flex xs1>
            <v-container v-if="turma2.length != 0">
              <center>
                <v-tooltip v-if="this.selected.length>0 && this.anoLetivoTurma1 <= this.anoLetivoTurma2" top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs" 
                      v-on="on"
                    >
                    <v-icon large color="#009263" @click="alteraTurma"> mdi-arrow-right-box </v-icon>
                    </v-btn>
                  </template>
                  <span>Irá transferir os alunos selecionados da turma {{turma.turma}} para a turma {{turma2}}</span>
                </v-tooltip>
              </center>
              <br>
              <center>
                <v-tooltip v-if="this.selected2.length>0 && this.anoLetivoTurma2 <= this.anoLetivoTurma1" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs" 
                      v-on="on"
                    >
                    <v-icon  large color="#009263" @click="alteraTurma2"> mdi-arrow-left-box </v-icon>
                    </v-btn>
                  </template>
                  <span>Irá transferir os alunos selecionados da turma {{turma2}} para a turma {{turma.turma}}</span>
                </v-tooltip>
              </center>
            </v-container>
          </v-flex>
          <v-flex xs5>
            <v-card class="pa-4">
            
                <v-combobox
                    id="escola"
                    label="Agrupamento de Escolas"
                    v-model="escola"
                    :items="agrupamentos"
                    @change="onAgrupamentoChange"
                ></v-combobox>
                <v-combobox
                    v-if="professores.length > 0"
                    id="professor"
                    label="Professor"
                    v-model="idprofessor2"
                    :items="professores"
                    @change="onProfessorChange"
                ></v-combobox>
                <v-combobox
                    v-if="turmas.length>0 && professores.length > 0"
                    id="turma"
                    label="Turma"
                    v-model="turma2"
                    :items="turmas"
                    @change="onTurmaChange"
                ></v-combobox>
                
                
                <v-text-field
                    v-model="filtrar2"
                    label="Filtrar"
                    prepend-icon="mdi-magnify"
                    color="#009263"
                    single-line
                    ></v-text-field>
                    <v-data-table
                    class="elevation-1"
                    v-model="selected2"
                    :single-select="false"
                    show-select
                    :headers="header_alunos"
                    :items="alunosOutraTurma"
                    :footer-props="footer_props"
                    :search="filtrar2"
                    >
                    <template v-slot:item="row">
                    <tr>
                        <td>
                            <v-checkbox color="green" v-model="selected2" :value="row.item" style="margin:0px;padding:0px"
                                hide-details />
                        </td>
                        <td>{{row.item.numero}}</td>
                        <td>{{row.item.nome}}</td>
                        <td>
                        <!--<v-icon @click="verProfessor(row.item.id)"> mdi-eye </v-icon>-->
                        <v-icon @click="dialogEditar2 = true; idEditar2=row.item.id"> mdi-pencil </v-icon>
                        </td>
                    </tr>
                    </template>
                    </v-data-table>
            </v-card>        
          </v-flex>
        </v-layout>

                <v-dialog v-model="dialogEditar1" width="85%">
                  <v-card>
                  <EditarAluno v-if="dialogEditar1" @alteracao="atualizaAlunos1()" :idProp="idEditar1"/>
                  </v-card>
                </v-dialog>

                <v-dialog v-model="dialogEditar2" width="85%">
                  <v-card>
                  <EditarAluno v-if="dialogEditar2" @alteracao="atualizaAlunos2()" :idProp="idEditar2"/>
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
const anoLetivoAtual = require("@/config/hosts").anoAtual
import EditarAluno from '@/components/Alunos/EditarAluno.vue'

  export default {
    components:{
         EditarAluno
    },
    data(){
      return {
        selected:[],
        selected2:[],
        turmaSel:"",
        turmas: [],
        alunosTurmaAtual: [],
        alunosOutraTurma: [],
        dialogTransferencia: false,
        header_alunos: [
            {text: "Numero", sortable: true, value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Editar", class: 'subtitle-1'}
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [30, 50, -1],
            "items-per-page-all-text": "Todos"
        },
        token: "",
        turma: {},
        id : 0,
        filtrar:"",
        filtrar2:"",
        turma2:"",
        codprofessor2:"",
        minhaTurma: false,
        idprofessor: "",
        agrupamentos: [],
        agrupamentosIds: [],
        professores: [],
        escola: "",
        escolaId: "",
        escolaIdOriginal:"",
        idprofessor2:"",
        anoLetivoTurma2:"21",
        anoAtual: parseInt(anoLetivoAtual),
        anoLetivoTurma1:"21", 
        dialogEditar1: false, 
        idEditar1:0,
        dialogEditar2: false,
        idEditar2:0
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        let utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.id = this.$route.params.turma
        this.idprofessor = this.$route.params.idprofessor
        this.idprofessor2 = this.idprofessor
        var response = await axios.get(h + "turmas/" + this.id + "?token=" + this.token)
        this.turma = response.data
        this.anoLetivoTurma1 = parseInt(this.turma.turma.split("-")[1])
        response = await axios.get(h + "turmas/" + this.turma.turma + "/alunos?codprofessor="+ this.turma.idprofessor + "&token=" + this.token)
        this.alunosTurmaAtual = response.data
        var responseProf = await axios.get(h + "professores/codigos/" + this.idprofessor + "/?token=" + this.token)
        this.escolaId = responseProf.data.escola
        this.escolaIdOriginal = this.escolaId
        //alert(this.escolaId)
        //alert(responseProf.data.escola)
        this.agrupamentos = await this.getAgrupamentos()
        //alert(JSON.stringify(this.agrupamentosIds))
        //alert(this.agrupamentosIds.find(e => {e.cod == this.escolaId}))
        this.escola = this.agrupamentosIds.find(e => e.cod == this.escolaId).nome
        
        this.getProfessores()
        
        this.getTurmas()
    },
    methods: {
      getAgrupamentos: async function(item){
        var response = await axios.get(h + "escolas/?token=" + this.token)
        this.agrupamentosIds = response.data
        var aux = []
        for(var i = 0; i < this.agrupamentosIds.length; i++){
          aux.push(this.agrupamentosIds[i].nome)
        }
        return aux
      },
      getProfessores: async function(item){
        if(this.escola != "" && this.escola){
          var responseProfs = await axios.get(h + "escolas/" + this.escolaId + "/professores/?token=" + this.token)
          var aux = []
          for(var i = 0; i < responseProfs.data.length; i++){
            aux.push(responseProfs.data[i].codigo)
          }
          this.professores = aux
        }
      },
      onTurmaChange: async function(item){
        if(item != null && this.idprofessor2 != "" && item != ""){
         this.anoLetivoTurma2 = parseInt(this.turma2.split("-")[1])
         this.turma2 = item
         let response = await axios.get(h + "turmas/" + this.turma2 + "/alunos?codprofessor="+ this.idprofessor2 + "&token=" + this.token)
         this.alunosOutraTurma = response.data
         this.selected2 = []
        }
      }, 
      getTurmas: async function(){
          this.turma2 = ""
          var responseTurmas = await axios.get(h + "professores/" + this.idprofessor2 + "/turmas?token=" + this.token)
          var i = 0
          var aux = []
          for(i = 0; i < responseTurmas.data.length; i++){
            if(responseTurmas.data[i].turma != this.turma.turma || this.idprofessor != this.idprofessor2) aux.push(responseTurmas.data[i].turma)
          }
          this.turmas = aux
      },
      onProfessorChange: async function(item){
        if(item != null){
          this.turma2 = ""
          this.alunosOutraTurma = []
          this.getTurmas()
        }
      },
      onAgrupamentoChange: async function(item){
        if(item != null && item != ""){
          this.idprofessor2 = ""
          this.turma2 = ""
          this.escolaId = this.agrupamentosIds.find(e => e.nome == this.escola).cod
          this.getProfessores()
        }
      },
      alteraTurma: async function(){
        Swal.fire({
          title: 'Tem a certeza que pretende transferir os alunos selecionados da turma ' + this.turma.turma + ' para a turma '+ this.turma2 +  '?',
          showDenyButton: true,
          confirmButtonColor: '#009263',
          confirmButtonText: `Sim`,
          denyButtonText: `Não`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            var body = {
                    codprofessor: this.turma.idprofessor, 
                    turmaOld: this.turma.turma,
                    alunos: this.selected, 
                    codprofessorNovo: this.idprofessor2,
                    codescola: this.escolaId
              }
              await axios.put(h + "alunos/turmas/" + this.turma2 + "?token=" + this.token, body)
              this.selected = []
              this.atualizaAlunos()
          }
        })
      },
      alteraTurma2: async function(){
        Swal.fire({
          title: 'Tem a certeza que pretende transferir os alunos selecionados da turma ' + this.turma2 + ' para a turma '+ this.turma.turma +  '?',
          showDenyButton: true,
          confirmButtonColor: '#009263',
          confirmButtonText: `Sim`,
          denyButtonText: `Não`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            var body = {
                    codprofessor: this.idprofessor2, 
                    turmaOld: this.turma2,
                    codprofessorNovo: this.turma.idprofessor,
                    alunos: this.selected2, 
                    codescola: this.escolaIdOriginal
              }
              await axios.put(h + "alunos/turmas/" + this.turma.turma + "?token=" + this.token, body)
              this.selected2 = []
              this.atualizaAlunos()
          }
        })
      },
      atualizaAlunos: async function(){
        var response = await axios.get(h + "turmas/" + this.turma.turma + "/alunos?codprofessor="+ this.turma.idprofessor + "&atuais=true" + "&token=" + this.token)
        this.alunosTurmaAtual = response.data
        this.selected = []
        response = await axios.get(h + "turmas/" + this.turma2 + "/alunos?codprofessor="+ this.idprofessor2 + "&atuais=true" + "&token=" + this.token)
        this.alunosOutraTurma = response.data
        this.selected2 = []
      },
      atualizaAlunos1: async function(){
        
        var response = await axios.get(h + "alunos/" + this.idEditar1 + "/?token=" + this.token)
        var al = this.alunosTurmaAtual.find(a => a.id == this.idEditar1) 
        this.dialogEditar1 = false
        var index = this.alunosTurmaAtual.indexOf(al)
        this.alunosTurmaAtual.splice(index, 1, response.data)
        this.selected = []
      },
      atualizaAlunos2: async function(){
        
        var response = await axios.get(h + "alunos/" + this.idEditar2 + "/?token=" + this.token)
        var al = this.alunosOutraTurma.find(a => a.id == this.idEditar2) 
        this.dialogEditar2 = false
        var index = this.alunosOutraTurma.indexOf(al)
        this.alunosOutraTurma.splice(index, 1, response.data)
        this.selected2 = []
      }
    }
  }
</script>

<style scoped>
.transparent {
   background-color: white!important;
   opacity: 0.65;
   border-color: transparent!important;
 }
</style>