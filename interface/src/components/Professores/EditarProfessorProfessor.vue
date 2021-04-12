<template>
  <v-container>
    <v-card class="justify-center">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Editar Professor ({{professor.codigo}})
            </v-card-title>
                     
          <v-text-field prepend-icon="mdi-account" label="Nome" placeholder="Nome" v-model="professor.nome" color="#009263" required/>
          <v-combobox
                id="escola"
                prepend-icon="mdi-school"
                label="Agrupamento de Escolas"
                v-model="escolaAtual"
                color="#009263"
                :items="escolas"
          ></v-combobox>
          <v-text-field prepend-icon="mdi-email" label="Email" placeholder="Email" v-model="professor.email" :rules="[existeEmail]" color="#009263" required/>
          <br>
          <center><v-btn class="white--text" style="background-color: #009263;" @click="dialogPassword = true"> Alterar password </v-btn></center>
          <br>
          
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
</template>



<script>
import axios from "axios"
import Swal from 'sweetalert2'
const h = require("@/config/hosts").hostAPI

  export default {
    data(){
      
      return {
        dialogPassword: false,
        filtrar: "",
        header_turmas: [
            {text: "Turma", value: 'turma', class: 'subtitle-1'},
            {text: "Ano Letivo", value: 'anoletivo', class:'subtitle-1'}
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        token: "",
        professor: {},
        id : 0,
        password1: "",
        password2: "",
        escolasIds:[],

        escolas: [],
        escolaAtual:"",
        codigosprof:[],
        codigosalunos:[],
        emailOriginal:"",
        disabledEmail: false,
        premiumAtual: "",
        reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
        existeEmail: v => {
          if(this.emailOriginal != v && ( this.codigosprof.find(e => e.email == v) || this.codigosalunos.find(e => e.email == v) ) ){
            this.disabledEmail = true
            return 'Email já utilizado.'
          }
          
          if(v != "" && this.reg.test(v)) {this.disabledEmail = false; return true}
          else {this.disabledEmail = true; return false}
        },
        emailValido: v =>{
          
        },

      }
    },
    props:["idProp"],
    created: async function(){
        this.token = localStorage.getItem("token")
        // caso o id seja passado por prop e não por parametro
        this.id = this.idProp
        var response = await axios.get(h + "professores/" + this.id + "?token=" + this.token)
        this.professor = response.data
        this.emailOriginal = this.professor.email
        var responseEscolas = await axios.get(h + "escolas")
        this.escolasIds = responseEscolas.data
        this.escolaAtual = this.escolasIds.find(e => e.cod == this.professor.escola).nome
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
      editarProfessor : function(){
          this.professor.escola = this.escolasIds.find(e => e.nome == this.escolaAtual).cod
          if(this.professor.premium && this.professor.escola){
            
            axios.put(h + "professores/" + this.professor.codigo + "?token=" + this.token, this.professor)
                .then(dados => {
                  Swal.fire({
                    icon: 'success',
                    text: "Professor alterado com sucesso.",
                    confirmButtonColor: '#009263'
                  })
                  this.$emit("alteracao")
                })
                .catch(error => Swal.fire({
                                      icon: 'error',
                                      text: "Não foi possível guardar as informações alteradas.",
                                      confirmButtonColor: '#009263'
                                    }))
          }
      },
      editarPassword : async function(){
          if(this.password1 != "" && this.password2 != ""){
            if(this.password1 == this.password2){
               Swal.fire({
                title: 'De certeza que deseja alterar a password deste professor?',
                showDenyButton: true,
                confirmButtonColor: '#009263',
                confirmButtonText: `Sim`,
                denyButtonText: `Não`,
              }).then(async (result) => {
                    if (result.isConfirmed) {
                      await axios.put(h + "professores/" + this.professor.codigo + "/password?token=" + this.token, {password: this.password1})
                                 .then(() => {
                                    Swal.fire({
                                        icon: 'success',
                                        text: "Password alterada com sucesso.",
                                        confirmButtonColor: '#009263'
                                      })
                                  })
                                  .catch(() => {
                                    Swal.fire({
                                      icon: 'error',
                                      text: "Não foi possível guardar a nova password.",
                                      confirmButtonColor: '#009263'
                                    })
                                  })
                      this.dialogPassword = false
                    }
              })
            }
            else{
              this.password2 = ""
              Swal.fire({
                icon: 'error',
                text: "A password a alterar e a sua confirmação devem ser iguais.",
                confirmButtonColor: '#009263'
              })
            }
          }
          else Swal.fire({
                icon: 'error',
                text: "Tem de preencher os dois campos.",
                confirmButtonColor: '#009263'
              })
      },
    }
  }
</script>