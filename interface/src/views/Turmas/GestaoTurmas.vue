<template>
<v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
                <v-card-title primary-title class="justify-center green--text">
                    <span> Gestão de Turmas</span>
                </v-card-title>
                <center>
                  
                  <v-btn v-if="turmasAnoLetivo<limiteTurmas" class="white--text" style="background-color: #009263;" @click="criarTurma()"> 
                    <v-icon> mdi-book-plus </v-icon> Criar Turma 
                  </v-btn>
                  <v-row v-else class="justify-center" style="display: flex;  align-items: center;">
                    <v-icon color="red"> mdi-alert-outline </v-icon>
                    <span> Não pode criar mais turmas, uma vez que atingiu o limite deste ano letivo ({{limiteTurmas}}). </span>
                  </v-row>
                  <br>
                  <br>
                  <v-btn v-if="!show" text @click="show=!show"><span>Mostrar Ajuda</span><v-icon color="#009263"> mdi-help-circle </v-icon> </v-btn>
                  <v-btn v-else text @click="show=!show">Esconder Ajuda</v-btn> 
                </center>
                  <v-slide-y-transition>
                      <v-card v-show="show" class="elevation-6 pa-3" style="border: 2px solid green !important;" color="grey lighten-3">
                        <v-row >
                          <v-col cols="12">
                            <span> 1. Caso não tenha ultrapassado o limite de turmas deste ano letivo ({{limiteTurmas}}), pode criar uma turma no botão 
                              <v-btn small text class="white--text" style="background-color: #009263;"> 
                                <v-icon> mdi-book-plus </v-icon> Criar Turma 
                             </v-btn> 
                            </span>
                          </v-col>
                          <v-col cols="12">
                          <span> 2. Se desejar visualizar as suas turmas antigas, pode fazê-lo através da seleção de um ano letivo diferente ou de todos (<v-icon>mdi-counter</v-icon>). </span>
                          </v-col>
                          <v-col cols="12">
                          <span> 3. Caso queira gerar os passaportes de uma turma, basta clicar em <v-icon> mdi-passport </v-icon> da respetiva turma. 
                          Além disso, caso sejam credenciais de alunos fornecidas pelo Hypatiamat (passwords hypatiamat) 
                          poderá selecionar a opção de incluir as passwords dos alunos nos passaportes. </span>
                          </v-col>
                          <v-col cols="12">
                          <span> 4. Caso deseje eliminar uma turma e não existam registos de alunos dessa turma (ou de antigos alunos dessa turma) nos jogos ou nas apps, 
                            basta clicar em <v-icon> mdi-delete </v-icon> da respetiva turma.</span> 
                          </v-col>
                        </v-row>
                      </v-card>
                  </v-slide-y-transition>
                  <br>
                <v-combobox
                    id="anoletivo"
                    label="Ano Letivo"
                    prepend-icon="mdi-counter"
                    v-model="anoletivo"
                    color="#009263"
                    :items="anosletivos"
                    @change="getTurmas()"
                ></v-combobox>
                <v-text-field
                    v-model="filtrar"
                    label="Filtrar"
                    prepend-icon="mdi-magnify"
                    color="#009263"
                    single-line
                    ></v-text-field>
                    <v-data-table
                    class="elevation-1"
                    :headers="header_turmas"
                    :items="turmas"
                    :footer-props="footer_props"
                    :search="filtrar"
                    >
                    <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.turma}}</td>
                        <td>{{row.item.anoletivo}}</td>
                        <td class="d-flex align-center">
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                            <v-simple-checkbox
                                v-model="row.item.passportPassword"
                                color="#009263"
                                v-bind="attrs" 
                                v-on="on"
                                :ripple="false"
                            ></v-simple-checkbox>
                            </template>
                            <span>Se selecionar esta opção, a palavra-passe dos alunos do passaporte irá ser preenchida com a palavra-passe gerada pelo Hypatiamat.</span>
                          </v-tooltip>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              color="#009263"
                              icon
                              v-bind="attrs" 
                              v-on="on"
                            >
                            <v-icon @click="getPassaporte(row.item.turma, row.item.passportPassword)"> mdi-passport </v-icon>
                            </v-btn>
                          </template>
                          <span>Gerar um passaporte (PDF) com os alunos da turma.</span>
                        </v-tooltip>
                        </td>
                        <td>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              color="#009263"
                              icon
                              v-bind="attrs" 
                              v-on="on"
                              :disabled="utilizador.type==5"
                            >
                            <v-icon @click="apagarTurma(row.item.id, row.item.turma)"> mdi-delete </v-icon>
                            </v-btn>
                          </template>
                          <span>Apagar esta turma, caso não haja alunos pertencentes à turma, entre outros.</span>
                        </v-tooltip>
                        </td>
                    </tr>
                    </template>
                    </v-data-table>
            </v-container>
        </v-card>
      </v-container>
    </v-main>
</v-app>
</template>



<script>
import axios from "axios"
import {Passaport} from '@/config/passport'
import Swal from 'sweetalert2'
const h = require("@/config/hosts").hostAPI
const nTurmas = require("@/config/confs").limiteTurmas
const anoletivoAtual = require("@/config/confs").anoletivo
const anosletivos1 = require("@/config/confs").anosletivos

  export default {
    data(){
      return {
        token: "",
        turmas: [],
        show:false,
        limiteTurmas: 4,
        anosletivos:["Todos"],
        anoletivo:anoletivoAtual,
        utilizador : {},
         header_turmas: [
            {text: "Turma", value: 'turma', class: 'subtitle-1'},
            {text: "Ano Letivo", value: 'anoletivo', class: 'subtitle-1'},
            {text: "Passaporte", sortable:false, class: 'subtitle-1'},
            {text: "Apagar", sortable:false, class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [15, 30, 45, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        turmasAnoLetivo: 0,
        agrupamento:""
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        var anoAux = this.anoletivo.split("/")
        var ano = anoAux[0]
        var response = await axios.get(h + "professores/" + this.utilizador.codigo + "/turmas?token=" + this.token + "&ano=" + ano)
        this.turmas = response.data
        
        if(this.utilizador.limiteTurmas) this.limiteTurmas = this.utilizador.limiteTurmas
        else this.limiteTurmas = nTurmas
        this.agrupamento = (await axios.get(h + "professores/" + this.utilizador.id + "?token=" + this.token)).data.agrupamento
        this.calculaTurmasAnoLetivo();
        for(var i = 0; i < anosletivos1.length; i++){
          this.anosletivos.push(anosletivos1[i])
        }
    },
    methods: {
      getTurmas: async function(){
        if(this.anoletivo != "Todos"){
          var anoAux = this.anoletivo.split("/")
          var ano = anoAux[0]
          var response = await axios.get(h + "professores/" + this.utilizador.codigo + "/turmas?token=" + this.token + "&ano=" + ano)
          this.turmas = response.data
        }
        else{
          var response = await axios.get(h + "professores/" + this.utilizador.codigo + "/turmas?token=" + this.token)
          this.turmas = response.data
        }
      },
      verTurma : function(id){
        this.$router.push({name:"Ver Turma", params:{ id : id }})
      },
      editarTurma : function(id){
        this.$router.push({name: "Editar Minha Turma", params: { id : id } })
      },
      criarTurma : function(){
        this.$router.push({name: "Criar Turma" })
      },
      apagarTurma: async function(id, turma){
        Swal.fire({
        title: "De certeza que deseja apagar esta turma?",
        showDenyButton: true,
        confirmButtonColor: '#009263',
        confirmButtonText: `Sim`,
        denyButtonText: `Não`,
        }).then(async (result) => {
            if (result.isConfirmed) {
              var deleted = (await axios.delete(h + "turmas/" + turma + "?codprofessor=" + this.utilizador.codigo +"&token=" + this.token)).data
              if(deleted.removed){
                var index = this.turmas.indexOf(this.turmas.find(t => t.id == id))
                this.turmas.splice(index, index+1)
                Swal.fire({
                  icon: 'success',
                  title: deleted.message,
                  confirmButtonColor: '#009263'
                })
              }
              else{
                Swal.fire({
                  icon: 'error',
                  title: deleted.message,
                  confirmButtonColor: '#009263'
                })
              }
            }
          })
      },
      calculaTurmasAnoLetivo: function(){
        this.turmasAnoLetivo = 0;
        this.turmas.forEach(t => {if(t.anoletivo == anoletivoAtual) this.turmasAnoLetivo++})
      },
      getPassaporte : function(turma, passportPassword){
        var passwords = false;
        if(passportPassword) passwords = true
        var codprofessor = this.utilizador.codigo
        if(passwords){
          Passaport.getPassaporteTurmaPassword( turma, codprofessor, this.agrupamento.split(",")[0] )
        }
        else{
          Passaport.getPassaporteTurma( turma, codprofessor, this.agrupamento.split(",")[0] )
        }
        
      }
    }
  }
</script>