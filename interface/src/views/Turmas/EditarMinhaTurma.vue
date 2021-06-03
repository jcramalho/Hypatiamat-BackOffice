<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Transferência de Alunos ({{turma.turma}})
            </v-card-title>
            <center>
              <v-btn v-if="!show" text @click="show=!show"><span>Mostrar Ajuda</span><v-icon color="#009263"> mdi-help-circle </v-icon> </v-btn>
              <v-btn v-else text @click="show=!show">Esconder Ajuda</v-btn> 
            </center>
            <v-slide-y-transition>
                  <v-card v-show="show" class="elevation-6 pa-3" style="border: 2px solid green !important;" color="grey lighten-3">
                    <v-row >
                      <v-col cols="12">
                        <span> 1. Na tabela da esquerda, é possível visualizar os alunos pertencentes à turma que selecionou para realizar transferências de alunos ({{turma.turma}}).
                        </span>
                      </v-col>
                      <v-col cols="12">
                      <span> 2. Inicialmente, a tabela da direita não possuí informação. Para tal, deverá escolher a turma sobre a qual deseja realizar transferências.</span>
                      </v-col>
                      <v-col cols="12">
                      <span> 3. Realizado o passo anterior, poderá selecionar os alunos que pretende transferir de uma ou outra turma. </span> 
                      </v-col>
                      <v-col cols="12">
                      <span> 4. Depois de selecionados os alunos pretendidos, caso deseje uma transferência da turma da esquerda para a turma da direita 
                        aparecerá um <v-icon color="#009263">mdi-arrow-right-box</v-icon> e caso clique os alunos serão transferidos. Caso queira transferir da turma 
                        da direita para a turma da esquerda e depois dos alunos estarem selecionados, poderá concluir a transferência clicando em 
                        <v-icon color="#009263">mdi-arrow-left-box</v-icon>. </span> 
                      </v-col>
                      <v-col cols="12">
                        <span> 5. Não é permitida a transferências de alunos de uma turma de um ano letivo superior para um ano letivo inferior. Por exemplo, não
                          conseguirá transferir alunos de uma turma de 20/21 para uma turma de 19/20. 
                        </span> 
                      </v-col>
                    </v-row>
                  </v-card>
            </v-slide-y-transition>         
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
                      </v-data-table>
              </v-card>
            </v-flex>
            <v-flex xs1>
              <v-container v-if="turmaSel.length != 0">
                <center>
                  <v-tooltip v-if="this.selected.length>0 && this.anoLetivoTurma1 <= this.anoLetivoTurma2" top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs" 
                        v-on="on"
                        :disabled="utilizador.type == 5"
                        @click="alteraTurma"
                      >
                      <v-icon large color="#009263"> mdi-arrow-right-box </v-icon>
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
                        :disabled="utilizador.type == 5"
                        @click="alteraTurma2"
                      >
                      <v-icon  large color="#009263"> mdi-arrow-left-box </v-icon>
                      </v-btn>
                    </template>
                    <span>Irá transferir os alunos selecionados da turma {{turma2}} para a turma {{turma.turma}}</span>
                  </v-tooltip>
                </center>
              </v-container>
            </v-flex>
            <v-flex xs5>
              <v-card class="pa-4">
              <v-card-title primary-title class="justify-center">
                      Alunos da Turma  <v-spacer/>  <v-combobox
                      id="turma"
                      v-model="turmaSel"
                      :items="turmas"
                      @change="onTurmaChange"
                  ></v-combobox>
                  </v-card-title>
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
                      </v-data-table>
              </v-card>        
            </v-flex>
    </v-layout>


        
        </v-container>
    </v-card>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
import Swal from 'sweetalert2'
const h = require("@/config/hosts").hostAPI
const anoLetivoAtual = require("@/config/hosts").anoAtual

  export default {
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
            {text: "Nome", value: 'nome', class: 'subtitle-1'}
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [30, 50, -1],
        },
        token: "",
        turma: {},
        id : 0,
        filtrar:"",
        filtrar2:"",
        turma2:"",
        minhaTurma: false,
        utilizador:{},
        anoLetivoTurma2:"21",
        anoAtual: parseInt(anoLetivoAtual),
        anoLetivoTurma1:"21",
        show:false
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.id = this.$route.params.id
        var response = await axios.get(h + "turmas/" + this.id + "?token=" + this.token)
        this.turma = response.data
        this.anoLetivoTurma1 = parseInt(this.turma.turma.split("-")[1])
        response = await axios.get(h + "turmas/" + this.turma.turma + "/alunos?codprofessor="+ this.turma.idprofessor + "&alunosAtuais=true" + "&token=" + this.token)
        this.alunosTurmaAtual = response.data
        response = await axios.get(h + "professores/" + this.utilizador.codigo + "/turmas?token=" + this.token)
        var i = 0
        for(i = 0; i < response.data.length; i++){
          if(response.data[i].turma != this.turma.turma) this.turmas.push(response.data[i].turma)
        }
    },
    methods: {
      onTurmaChange: async function(item){
        if(item != null){
         this.turma2 = item
         this.anoLetivoTurma2 = parseInt(this.turma2.split("-")[1])
         let response = await axios.get(h + "turmas/" + this.turma2 + "/alunos?codprofessor="+ this.utilizador.codigo + "&alunosAtuais=true" + "&token=" + this.token)
         this.alunosOutraTurma = response.data
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
                  codprofessor: this.utilizador.codigo, 
                  turmaOld: this.turma.turma,
                  alunos: this.selected
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
                      codprofessor: this.utilizador.codigo, 
                      turmaOld: this.turma2,
                      alunos: this.selected2
                }
                await axios.put(h + "alunos/turmas/" + this.turma.turma + "?token=" + this.token, body)
                this.selected2 = []
                this.atualizaAlunos()
                }
        })
      },
      atualizaAlunos: async function(){
        var response = await axios.get(h + "turmas/" + this.turma.turma + "/alunos?codprofessor="+ this.turma.idprofessor + "&alunosAtuais=true" + "&token=" + this.token)
        this.alunosTurmaAtual = response.data
        response = await axios.get(h + "turmas/" + this.turma2 + "/alunos?codprofessor="+ this.utilizador.codigo + "&alunosAtuais=true" + "&token=" + this.token)
        this.alunosOutraTurma = response.data
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