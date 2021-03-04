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
          <v-text-field prepend-icon="mdi-email" label="Email" placeholder="Email" v-model="professor.email" color="#009263" required/>
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



          <center><v-btn class="white--text" style="background-color: #009263;" @click="editarProfessor()"> Confirmar Alterações </v-btn></center>
        
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
            "items-per-page-options": [50, 100, 200, -1],
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
        var responseEscolas = await axios.get(h + "escolas")
        this.escolasIds = responseEscolas.data
        this.escolaAtual = this.escolasIds.find(e => e.cod == this.professor.escola).nome
        this.premiumAtual = this.typePremium.find(e => e.split(" - ")[0] == this.professor.premium)
        this.parseEscolas()
    },
    methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
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