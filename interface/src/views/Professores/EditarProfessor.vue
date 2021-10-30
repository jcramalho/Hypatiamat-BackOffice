<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card>
            <v-container>
                <v-card-title primary-title class="justify-center green--text">
                    Editar Professor ({{professor.codigo}})
                </v-card-title>
                        
              <v-text-field prepend-icon="mdi-account" label="Nome Completo" placeholder="Nome Completo" v-model="professor.nome" color="#009263" required/>
              <v-combobox
                    id="escola"
                    prepend-icon="mdi-school"
                    label="Agrupamento de Escolas"
                    v-model="escolaAtual"
                    color="#009263"
                    :items="escolas"
              ></v-combobox>
              <v-text-field prepend-icon="mdi-email" label="Email" placeholder="Email" v-model="professor.email" :rules="[existeEmail]" color="#009263" required/>
              <v-text-field prepend-icon="mdi-ticket-confirmation-outline" label="Confirmação (0 ou 1)" placeholder="Confirmação (0 ou 1) " v-model="professor.confirmacao" :rules="[number0or1]" color="#009263" required/>
              <v-combobox
                    id="premium"
                    prepend-icon="mdi-vpn"
                    label="Premium"
                    v-model="premiumAtual"
                    color="#009263"
                    :items="typePremium"
                ></v-combobox>
              <v-text-field prepend-icon="mdi-calendar" label="Validade (YYYY-MM-DD)" placeholder="Validade (YYYY-MM-DD)" v-model="professor.validade" type="date" :format="format" color="#009263" required/>
              <v-text-field prepend-icon="mdi-handshake" label="Número de Sócio" placeholder="Número de Sócio" v-model="professor.socionum" type="number" color="#009263" :rules="[number]" required/>
              <v-text-field prepend-icon="mdi-projector-screen-outline" label="Projeto" placeholder="Projeto" v-model="professor.projeto" type="number" color="#009263" :rules="[number]" required/>
              <br>
              <center><v-btn class="white--text" style="background-color: #009263;" @click="dialogPassword = true"> Alterar password </v-btn></center>
              <br>
              <center><v-btn class="white--text" style="background-color: #009263;" @click="verTurmas()"> Ver Turmas </v-btn></center>
              <br>
              <v-dialog
                v-model="dialogTurmas"
                width="40%"
                >
                    <v-card class="pa-5">
                    <v-text-field
                    v-model="filtrar"
                    prepend-icon="mdi-magnify"
                    color="#009263"
                    label="Filtrar"
                    single-line
                    ></v-text-field>
                    <v-data-table
                    class="elevation-1"
                    :headers="header_turmas"
                    :items="turmas"
                    :footer-props="footer_props"
                    :search="filtrar"
                    @click:row="editarTurma"
                    >
                    </v-data-table>
                    </v-card>
                </v-dialog>

              <v-dialog
                v-model="dialogPassword"
                width="40%"
                >
                    <v-card class="pa-5">
                      <v-card-title primary-title class="justify-center green--text">
                      Alterar Password
                      </v-card-title>
                      <v-text-field label="Password Nova" placeholder="Password nova" v-model="password1" color="#900000" type="password" required />
                      <v-text-field label="Confirmação Password" placeholder="Confirmação Password" v-model="password2" color="#900000" type="password" required />
                      <v-btn class="white--text" primary large block style="background-color: #009263;" @click="editarPassword()">Confirmar alteração</v-btn>
                    </v-card>
              </v-dialog>



              <center><v-btn :disabled="disabledEmail" class="white--text" style="background-color: #009263;" @click="editarProfessor()"> Confirmar Alterações </v-btn></center>
            
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
        turmas: [],
        dialogPassword: false,
        dialogTurmas: false,
        filtrar: "",
        header_turmas: [
            {text: "Turma", value: 'turma', class: 'subtitle-1'},
            {text: "Ano Letivo", value: 'anoletivo', class:'subtitle-1'}
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [15, 30, -1],
            "items-per-page-all-text": "Todos"
        },
        token: "",
        professor: {},
        id : 0,
        password1: "",
        password2: "",
        escolasIds:[],
        typePremium:[
            "0 - Não confirmado",
            "1 - Professor",
            "2 - Município",
            "3 - Agrupamento",
            "5 - Admin"
        ],
        escolas: [],
        escolaAtual:"",
        codigosprof:[],
        codigosalunos:[],
        emailOriginal:"",
        disabledEmail: false,
        premiumAtual: "",
        number0or1: v  => {
          //if (!v.trim()) return true;
          if (!isNaN(parseInt(v)) && (v == 0 || v == 1)) return true;
          return 'Tem que ser 0 ou 1';
        },
        number: v  => {
          //if (!v.trim()) return true;
          if (!isNaN(parseInt(v))) return true;
          return 'Tem que ser um inteiro';
        },
        existeEmail: v => {
          if(this.emailOriginal != v && ( this.codigosprof.find(e => e.email == v) || this.codigosalunos.find(e => e.email == v) ) ){
            this.disabledEmail = true
            return 'Email já utilizado.'
          }
          
          if(v != "" && this.reg.test(v)) {this.disabledEmail = false; return true}
          else {this.disabledEmail = true; return false}
        }

      }
    },
    props:["idProp"],
    created: async function(){
        this.token = localStorage.getItem("token")
        this.id = this.$route.params.id
        // caso o id seja passado por prop e não por parametro
        if(!this.id) this.id = this.idProp
        var response = await axios.get(h + "professores/" + this.id + "?token=" + this.token)
        this.professor = response.data
        this.emailOriginal = this.professor.email
        var responseEscolas = await axios.get(h + "escolas")
        this.escolasIds = responseEscolas.data
        this.escolaAtual = this.escolasIds.find(e => e.cod == this.professor.escola).nome
        this.premiumAtual = this.typePremium.find(e => e.split(" - ")[0] == this.professor.premium)
        this.parseEscolas()
        this.getCodigos()
    },
    methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      getCodigos: async function(){
        var response1 = await axios.get(h + "professores/codigos?token=" + this.token)
        this.codigosprof = response1.data
        var response2 = await axios.get(h + "alunos/codigos?token=" + this.token)
        this.codigosalunos = response2.data
      },
      parseEscolas: async function(){
        var aux = []
        for(var i = 0; i < this.escolasIds.length; i++){
          aux.push(this.escolasIds[i].nome)
        }
        this.escolas = aux
      },
      verTurmas : async function(id){
          var response = await axios.get(h + "professores/" + this.professor.codigo + "/turmas?token=" + this.token)
          this.turmas = response.data
          this.dialogTurmas = true
      },
      editarTurma : async function(turma){
        var id = turma.id
        this.$router.push({name: "Editar Turma", params: { id : id } })
      },
      editarProfessor : function(){
          this.professor.premium = this.premiumAtual.split(" - ")[0]
          this.professor.escola = this.escolasIds.find(e => e.nome == this.escolaAtual).cod
          if(this.professor.premium && this.professor.escola){
            
            axios.put(h + "professores/" + this.professor.codigo + "?token=" + this.token, this.professor)
                .then(dados => {
                  alert("Dados alterados com sucesso!")
                })
                .catch(error => alert("Não foi possível guardar as alterações."))
          }
      },
      editarPassword : async function(){
          if(this.password1 != "" && this.password2 != ""){
            if(this.password1 == this.password2){
              if(confirm("Tem a certeza que pretende alterar a sua password?")){
                await axios.put(h + "professores/" + this.professor.codigo + "/password?token=" + this.token, {password: this.password1})
                this.dialogPassword = false
              }
            }
            else{
              this.password2 = ""
              alert("As palavra passe de confirmação não coincide com a palavra passe primeiramente definida!")
            }
          }
          else alert("Tem de preencher os dois campos!")
      },
    }
  }
</script>