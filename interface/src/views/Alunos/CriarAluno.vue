<template>
 <v-app id="inspire">
  <v-container>
    <v-layout row class="text-xs-center">
        <v-container style="position: relative;top: 15%; width: 80%;" class="text-xs-center">
          <v-card class="pa-5">
            <v-form>
            <v-text-field prepend-icon="mdi-card-account-details" v-model="codigo" name="Username (Código)" label="Username (Código)" :rules="[string15, existeCodigo]" required></v-text-field>
            <v-text-field prepend-icon="mdi-account" v-model="nome" name="Nome" label="Nome" required></v-text-field>
            <v-text-field prepend-icon="mdi-email" v-model="email" name="Email" label="Email" :rules="[emailCheck, existeEmail]" required></v-text-field>
            <v-text-field prepend-icon="mdi-calendar" v-model="datanasc" name="Data de Nascimento" label="Data de Nascimento" type="date" required></v-text-field>
            <v-text-field prepend-icon="mdi-bank" v-model="pais" name="País" label="País" required></v-text-field>
            <v-combobox
                id="escola"
                prepend-icon="mdi-school"
                label="Agrupamento de Escolas"
                v-model="escola"
                :items="escolas"
                @change="onEscolaChange"
            ></v-combobox>
            <v-combobox
                id="professor"
                prepend-icon="mdi-teach"
                label="Professor"
                v-model="codprofessor"
                :items="professores"
                @change="onProfessorChange"
            ></v-combobox>
            <v-combobox
                id="turma"
                prepend-icon="mdi-book-account"
                label="Turma"
                v-model="turma"
                :items="turmas"
            ></v-combobox>
            <v-text-field prepend-icon="mdi-numeric-1-box-multiple-outline" v-model="numero" name="Número" label="Número" type="number" required></v-text-field>
            <v-text-field prepend-icon="mdi-key" v-model="password" name="Password" label="Password" type="password" required></v-text-field>
            <v-text-field prepend-icon="mdi-key" v-model="password2" name="Confirmação Password" label="Confirmação Password" type="password" required></v-text-field>
            <v-card-actions>
              <v-btn class="white--text" primary large block style="background-color: #009263;" @click="registarAluno">Confirmar</v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        </v-container>
    </v-layout>
  </v-container>
 </v-app>
</template>

<script>
  const h = require("@/config/hosts").hostAPI
  import Swal from 'sweetalert2'
  import axios from "axios"
  import moment from 'moment';

  export default {
    data(){
      return {
        codigos:[],
        nome : "",
        escola : "",
        escolas: [],
        escolasIds : [],
        email : "",
        pais: "",
        codprofessor:"",
        datanasc:"",
        codigo : "",
        numero: "",
        turma:"",
        password : "",
        professores:[],
        turmas: [],
        password2 : "",
        token: "",
        string15: v  => {
          if(v.length <= 15) return true
          else return "Apenas pode conter 15 caractéres"
        },
        isNumber: v=>{

        },
        existeCodigo: v =>{
          if(this.codigos.find(element => element.user == v)) return 'Esse username já existe. Escolha outro por favor.'
          else return true
        },
        emailCheck: v =>{
          return true
        },
        existeEmail: v =>{
          if(this.codigos.find(element => element.email == v)) return 'Esse email já existe. Escolha outro por favor.'
          else return true
        }
      }
    },
    created : async function() {
        try {
          this.token = localStorage.getItem("token")
          var response = await axios.get(h + "escolas")
          this.escolasIds = response.data
          var i
          for(i = 0; i < this.escolasIds.length; i++){
            var string = this.escolasIds[i].localidade + " - " + this.escolasIds[i].nome 
            this.escolas.push(string)
          }
          var responseCodigos = await axios.get(h + "alunos/codigos?token=" + this.token)
          this.codigos = responseCodigos.data
        } catch (e) {
        return e
        }
    },
     methods: {
      format(value, event) {
        return moment(value).format('DD/MM/YYYY')
      },
      onEscolaChange: async function(item){
          if(this.escola == "") this.professores = []
          else{
              var aux = this.escola.split(" - ")
              var escolaEscolhida = this.escolasIds.find(element => element.nome == aux[1]).cod
              var response = await axios.get(h + "escolas/" + escolaEscolhida + "/professores?token=" + this.token)
              var listaP = response.data
              listaP.forEach(element => this.professores.push(element.codigo))
          }
      },
      onProfessorChange: async function(item){
          if(this.codprofessor == "") this.turmas = []
          else{
              var response = await axios.get(h + "professores/" + this.codprofessor + "/turmas?token=" + this.token)
              var listaP = response.data
              listaP.forEach(element => this.turmas.push(element.turma))
          }
      },
       login: function(){
         this.$emit("login");
       },
      registarAluno: function () {
        
        /* var args = [aluno.user, aluno.numero, aluno.nome, aluno.datanascimento, 
                aluno.escola, aluno.turma, aluno.email, md5(aluno.password), 
                aluno.codprofessor, aluno.pais] */
        
        if (this.nome != "" && this.email != "" && this.codigo != "" && this.escola != "" && this.password != "" 
            && this.password2 && this.pais != "" && this.codprofessor != "" && this.numero != "" && this.datanasc != ""
            && this.turma != ""){ 
          if(this.password == this.password2){
            var aux = this.escola.split(" - ")
            var date = this.datanasc.split("-")
            var dataNascimento = date[2] + "/" + date[1] + "/" + date[0]
            var escolaEscolhida = this.escolasIds.find(element => element.nome == aux[1]).cod
            let data = {
                numero: this.numero,
                nome : this.nome,
                email : this.email,
                user : this.codigo,
                escola : escolaEscolhida,
                datanascimento: dataNascimento,
                turma: this.turma,
                codprofessor : this.codprofessor,
                pais: this.pais,
                password : this.password
            }
            axios.post(h + "alunos/", data)
                 .then(()=>{
                   Swal.fire({
                    icon: 'success',
                    title: 'Aluno registado com sucesso.',
                    confirmButtonColor: '#009263'
                  })
                   this.$router.push({name: "Alunos"})
                 })
                .catch(erro=> console.log(erro))
          }
          else {
            this.password2 = ""
            Swal.fire({
                  icon: 'error',
                  title: "As palavra passe e a sua confirmação não são iguais!",
                  confirmButtonColor: '#009263'
            })
          }
        }
        else {
          Swal.fire({
                  icon: 'error',
                  title: 'Ainda possuí campos por preencher!',
                  confirmButtonColor: '#009263'
                })
        }
      }

    }
  }
</script>

