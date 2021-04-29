<template>
<v-card class="pa-5">
    <v-layout row class="text-xs-center">
        <v-container  class="text-xs-center">
            <v-form>
            <v-text-field color="#009263" prepend-icon="mdi-card-account-details" v-model="codigo" name="Username (Código)" label="Username (Código)" :rules="[string15, existeCodigo]" required></v-text-field>
            <v-text-field color="#009263" prepend-icon="mdi-account" v-model="nome" name="Nome" label="Nome" required></v-text-field>
            <v-text-field color="#009263" prepend-icon="mdi-email" v-model="email" name="Email" label="Email" :rules="[emailValido, existeEmail]" required></v-text-field>
            <v-text-field color="#009263" prepend-icon="mdi-calendar" v-model="datanasc" name="Data de Nascimento" label="Data de Nascimento" type="date" required></v-text-field>
            <v-text-field color="#009263" prepend-icon="mdi-bank" v-model="pais" name="País" label="País" required></v-text-field>
            <v-combobox
                color="#009263"
                v-if="utilizador.type == 50"
                id="escola"
                prepend-icon="mdi-school"
                label="Agrupamento de Escolas"
                v-model="escola"
                :items="escolas"
                @change="onEscolaChange"
            ></v-combobox>
            <v-text-field
              v-else
              color="#009263"
              id="escola"
              prepend-icon="mdi-school"
              label="Agrupamento de Escolas"
              v-model="escola"
              disabled
              ></v-text-field>
            <v-combobox
                v-if="utilizador.type == 50"
                color="#009263"
                id="professor"
                prepend-icon="mdi-teach"
                label="Professor"
                v-model="codprofessor"
                :items="professores"
                @change="onProfessorChange"
            ></v-combobox>
            <v-text-field
                v-else
                color="#009263"
                id="professor"
                prepend-icon="mdi-teach"
                label="Professor"
                v-model="codprofessor"
                disabled
            ></v-text-field>
            <div>
              <v-combobox
                  class="ma-0 pa-0"
                  id="turma"
                  color="#009263"
                  prepend-icon="mdi-book-account"
                  label="Turma"
                  v-model="turma"
                  :error="(this.alunosTurma && this.alunosTurma.length >= this.limiteAlunos)"
                  :items="turmas"
                  @change="onTurmaChange"
              ></v-combobox>
              <span class="caption red--text ml-4 pl-4" v-if="(this.alunosTurma && this.alunosTurma.length >= this.limiteAlunos)">
                Atingiu o limite máximo de alunos nesta turma ({{this.limiteAlunos}}). Escolha outra por favor.
              </span>
            </div>
            <v-text-field color="#009263" prepend-icon="mdi-numeric-1-box-multiple-outline" v-model="numero" name="Número" label="Número" type="number" required></v-text-field>
            <v-text-field color="#009263" prepend-icon="mdi-key" v-model="password" name="Password" label="Password" type="password" required></v-text-field>
            <v-text-field color="#009263" prepend-icon="mdi-key" v-model="password2" name="Confirmação Password" label="Confirmação Password" type="password" required></v-text-field>
            <v-card-actions>
              <v-btn class="white--text" :disabled="disabledCodigo || disabledEmail || (this.alunosTurma && this.alunosTurma.length >= this.limiteAlunos)" primary large block style="background-color: #009263;" @click="registarAluno">Confirmar</v-btn>
            </v-card-actions>
            </v-form>
        </v-container>
    </v-layout>
</v-card>
</template>

<script>
  const h = require("@/config/hosts").hostAPI
  import Swal from 'sweetalert2'
  import axios from "axios"
  import moment from 'moment';
  const anoletivoAtual = require("@/config/confs").anoletivo
  const alunosLim = require("@/config/confs").limiteAlunos


  export default {
    data(){
      return {
        utilizador:[],
        codigos:[],
        nome : "",
        escola : "",
        limiteAlunos: alunosLim,
        alunosTurma: [],
        escolas: [],
        escolasIds : [],
        email : "",
        pais: "Portugal",
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
        codigosprof:[],
        disabledCodigo: false,
        disabledEmail: false,
        reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
        string15: v  => {
          if(v.length <= 15) return true
          else return "Apenas pode conter 15 caractéres"
        },
        isNumber: v =>{

        },
        existeCodigo: v =>{
          if(this.codigos.find(e => e.user == v) || this.codigosprof.find(e => e.codigo == v)) {
            this.disabledCodigo = true
            return 'Esse username já existe. Escolha outro por favor.'
          }
          this.disabledCodigo = false
          return true
        },
        existeEmail: v =>{
          if(this.codigos.find(e => e.email == v) || this.codigosprof.find(e => e.email == v)) {
            this.disabledEmail = true
            return 'Esse email já existe. Escolha outro por favor.'
          }
          this.disabledEmail = false
          return true
        },
        emailValido: v =>{
          if(v != "" && this.reg.test(v)) {this.disabledEmail = false; return true}
          else {this.disabledEmail = true; return false}
        },
        turmaValida: v =>{
          
        }
      }
    },
    created : async function() {
        try {
          this.token = localStorage.getItem("token")
          this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
          if(this.utilizador.type == 50){
            
            var response = await axios.get(h + "escolas")
            this.escolasIds = response.data
            var i
            for(i = 0; i < this.escolasIds.length; i++){
              var string = this.escolasIds[i].localidade + " - " + this.escolasIds[i].nome 
              this.escolas.push(string)
            }

          }
          else {
            var response = await axios.get(h + "professores/" + this.utilizador.id + "?token=" + this.token)
            this.utilizador = response.data
            this.escola = this.utilizador.agrupamento
            this.codprofessor = this.utilizador.codigo
            var anoAux = anoletivoAtual.split("/")
            var ano = anoAux[0]
            var response = await axios.get(h + "professores/" + this.utilizador.codigo + "/turmas?token=" + this.token + "&ano=" + ano)
            response.data.forEach(element => this.turmas.push(element.turma))
          }
          this.getCodigos()
        } catch (e) {
        return e
        }
    },
     methods: {
      format(value, event) {
        return moment(value).format('DD/MM/YYYY')
      },
      getCodigos: async function(){
        var response1 = await axios.get(h + "professores/codigos?token=" + this.token)
        this.codigosprof = response1.data
        var response2 = await axios.get(h + "alunos/codigos?token=" + this.token)
        this.codigos = response2.data
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
      onTurmaChange: function(item){
        if(this.turmas.find(e => e == this.turma)){
          axios.get(h + "turmas/" + this.turma + "/alunos?atuais=true&codprofessor=" + this.codprofessor + 
                                          "&token=" + this.token)
                .then( (response) => {
                  this.alunosTurma = response.data
                })
        }
        else {this.turma = ""; this.alunosTurma = [];}
      },
      registarAluno: function () {
        
        /* var args = [aluno.user, aluno.numero, aluno.nome, aluno.datanascimento, 
                aluno.escola, aluno.turma, aluno.email, md5(aluno.password), 
                aluno.codprofessor, aluno.pais] */
        
        if (this.nome != "" && this.email != "" && this.codigo != "" && this.escola != "" && this.password != "" 
            && this.password2 && this.pais != "" && this.codprofessor != "" && this.numero != "" && this.datanasc != ""
            && this.turma != ""){ 
          if(this.password == this.password2){
            var date = this.datanasc.split("-")
            var dataNascimento = date[2] + "/" + date[1] + "/" + date[0]
            
            if(this.utilizador.type == 50){
              var aux = this.escola.split(" - ")
              var escolaEscolhida = this.escolasIds.find(element => element.nome == aux[1]).cod
            }
            else var escolaEscolhida = this.utilizador.escola
            
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
            axios.post(h + "alunos/admin?token="+this.token, data)
                 .then(()=>{
                   Swal.fire({
                    icon: 'success',
                    title: 'Aluno registado com sucesso.',
                    confirmButtonColor: '#009263'
                  })
                   if(this.utilizador.type == 50) this.$router.push({name: "Alunos"})
                   else{
                     //this.$router.push({name: "Gestão de Alunos"})
                     this.$emit("inserido")
                   }
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

