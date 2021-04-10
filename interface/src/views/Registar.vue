<template>
 <div id="app">
  <v-container>
    <v-row class="text-xs-center">
        <v-col cols="12">
        <v-container class="text-xs-center">
          <v-card class="pa-5 elevation-4">
            <v-container>
            <v-row class="text-xs-center" no-gutters>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
              <center>
              <v-img v-if="!mobile" class="mx-auto" :src="require('@/assets/hypatiamat.png')" width="20%">
              </v-img>
              <v-img v-else-if="$vuetify.breakpoint.sm" class="mx-auto" :src="require('@/assets/hypatiamat.png')" width="50%">
              </v-img>
              <v-img v-else class="mx-auto" :src="require('@/assets/hypatiamat.png')" width="60%">
              </v-img>
              </center>
              <v-divider></v-divider>
            </v-col>
            
            <v-col  cols="12" xs="12" sm="6" md="6" lg="6"  xl="6">
              <v-btn v-if="isProfessor" class="white--text" large block style="background-color: #27451e;" width="100%"> Professor </v-btn>
              <v-btn v-else class="white--text" @click="disabledCodigo = false; disabledEmail = false; isProfessor=!isProfessor" large block style="background-color: #009263;"> Professor </v-btn>
            </v-col>
            <v-col cols="12" xs="12" sm="6" md="6" lg="6"  xl="6">
              <v-btn v-if="isProfessor" class="white--text" @click="disabledCodigo = false; disabledEmail = false; isProfessor=!isProfessor" primary large block style="background-color: #009263;"> Aluno </v-btn>
              <v-btn v-else class="white--text"  primary large block style="background-color: #27451e;"> Aluno </v-btn> 
            </v-col>
            </v-row>
            </v-container>
            
            <v-form v-if="isProfessor">
            <v-row no-gutters>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
            <v-text-field prepend-icon="mdi-card-account-details" v-model="codigo" color="#009263" name="Username (Código)" label="Username (Código)" :rules="[string15, codigoProfExistente]" required></v-text-field>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
            <v-text-field prepend-icon="mdi-account" v-model="nome" color="#009263" name="Nome" label="Nome" required></v-text-field>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
            <v-text-field prepend-icon="mdi-email" v-model="email" color="#009263" name="Email" label="Email" :rules="[emailValido, emailProfExistente]" required></v-text-field>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
            <v-combobox
                id="escola"
                prepend-icon="mdi-school"
                label="Agrupamento de Escolas"
                :return-object="true"
                v-model="escola"
                color="#009263"
                :items="escolas"
            ></v-combobox>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
            <v-text-field prepend-icon="mdi-key" color="#009263" v-model="password" name="Password" label="Password" type="password" required></v-text-field>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
            <v-text-field prepend-icon="mdi-key" color="#009263" v-model="password2" name="Confirmação Password" label="Confirmação Password" type="password" required></v-text-field>
            </v-col>
            </v-row>
            <v-card-actions>
              <v-btn :disabled="disabledCodigo || disabledEmail" class="white--text" primary large block style="background-color: #009263;" @click="registarProfessor">Confirmar</v-btn>
            </v-card-actions>
            </v-form>
            <v-form v-else>
              <v-row no-gutters>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon="mdi-card-account-details" v-model="user" name="Username (Código)" label="Username (Código)" :rules="[string15, codigoAlunoExistente]" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">  
                  <v-text-field prepend-icon="mdi-account" v-model="nome" name="Nome" label="Nome" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon="mdi-bank" v-model="pais" name="País" label="País" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon="mdi-calendar" v-model="datanascimento" name="Data de Nascimento" label="Data de Nascimento" type="date" :format="format" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon="mdi-email" v-model="email" name="Email" label="Email" :rules="[emailValido, emailAlunoExistente]" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-combobox
                      id="escola"
                      prepend-icon="mdi-school"
                      label="Agrupamento de Escolas"
                      :return-object="true"
                      v-model="escola"
                      :items="escolas"
                  ></v-combobox>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon='mdi-teach' v-model="codprofessor" name="Código do Professor" label="Código do seu Professor" :rules="[codigoProfessorAluno]" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon="mdi-book-account" v-model="turma" name="Turma" label="Turma" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon="mdi-numeric-1-box-multiple-outline" v-model="numero" name="Número" label="Número" type="number" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon="mdi-key" v-model="password" name="Password" label="Password" type="password" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon="mdi-key" v-model="password2" name="Confirmação Password" label="Confirmação Password" type="password" required></v-text-field>
                </v-col>
              </v-row>
            <v-card-actions>
              <v-btn :disabled="disabledCodigo || disabledEmail || disabledCodProfAluno" class="white--text" primary large block style="background-color: #009263;" @click="registarAluno">Confirmar</v-btn>
            </v-card-actions>
            </v-form>
            <v-card-actions class="justify-center">
            <v-btn class="white--text"  primary large block style="background-color: #009263;" @click="login">Voltar</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
        </v-col>
    </v-row>
  </v-container>
</div>
</template>

<script>
  const h = require("@/config/hosts").hostAPI
  import Swal from 'sweetalert2'
  import axios from "axios"
  export default {
    data(){
      return {
        isProfessor: true,
        nome : "",
        codigosprofs:[],
        codigosalunos:[],
        disabledEmail: false,
        disabledCodigo: false,
        disabledCodProfAluno: false,
        escola : "",
        escolas: [],
        escolasIds : [],
        datanascimento: "",
        pais: "Portugal",
        email : "",
        codigo : "",
        user:"",
        codprofessor:"",
        turma:"",
        numero:"",
        password : "",
        password2 : "",
        reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
        ,
        emailValido: v =>{
          if(v != "" && this.reg.test(v)) {this.disabledEmail = false; return true}
          else {this.disabledEmail = true; return false}
        },
        string15: v  => {
          if(v.length <= 15) {this.disabledCodigo = false; return true}
          else {this.disabledCodigo = true; return "Apenas pode conter 15 caractéres"}
        },
        codigoProfExistente: v => {
          if(this.codigosprofs.find(e => e.codigo.toUpperCase() == v.toUpperCase())) {this.disabledCodigo = true ; return 'Código já utilizado por outro professor. Escolha outro por favor.'}
          else {this.disabledCodigo = false; return true}
        },
        codigoAlunoExistente: v =>{
          if(this.codigosalunos.find(e => e.user.toUpperCase() == v.toUpperCase())) {this.disabledCodigo = true ; return 'Código já utilizado por outro professor. Escolha outro por favor.'}
          else {this.disabledCodigo = false; return true}
        },
        emailProfExistente: v =>{
          if(this.codigosprofs.find(e => e.email == v)) {this.disabledEmail = true; return 'Email já utilizado por outro professor. Escolha outro por favor.'}
          else {this.disabledEmail = false; return true}
        },
        emailAlunoExistente: v =>{
          if(this.codigosalunos.find(e => e.codigo == v)) {this.disabledCodigo = true ; return 'Código já utilizado por outro professor. Escolha outro por favor.'}
          else {this.disabledCodigo = false; return true}
        },
        codigoProfessorAluno: v=>{
          if(this.codigosprofs.find(e => e.codigo == v)) {this.disabledCodProfAluno = false; return true;}
          else {this.disabledCodProfAluno = true; return 'Não existe nenhum professor com esse código.';}
        }
      }
    },
    computed: {
      mobile() {
        if (this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm) return true
        return false
      }
    },
    created : async function() {
        try {
          var response = await axios.get(h + "escolas")
          this.escolasIds = response.data
          var responseProf = await axios.get(h + "professores/codigos")
          this.codigosprofs = responseProf.data
          var responseAlunos = await axios.get(h + "alunos/codigos")
          this.codigosalunos = responseAlunos.data
          var i
          var aux = []
          for(i = 0; i < this.escolasIds.length; i++){
            var string = this.escolasIds[i].localidade + " - " + this.escolasIds[i].nome 
            aux.push(string)
          }
          this.escolas = aux
        } catch (e) {
        return e
        }
    },
     methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
       login: function(){
         this.$emit("login");
       },
      registarProfessor: function () {
        
        
        if (this.nome != "" && this.email != "" && this.codigo != "" && this.escola != "" && this.password != "" && this.password2){ 
          if(this.password == this.password2){
            var aux = this.escola.split(" - ")
            var escolaEscolhida = this.escolasIds.find(element => element.nome == aux[1]).cod
            let data = {
                nome : this.nome,
                email : this.email,
                codigo : this.codigo,
                escola : escolaEscolhida,
                password : this.password
            }
            axios.post(h + "quarentenas/", data)
                 .then(()=>{
                   Swal.fire({
                    icon: 'success',
                    text: 'O seu pedido de inscrição está realizado! \n Aguarde agora pela autorização necessária.',
                    confirmButtonColor: '#009263'
                  })
                   axios.post(h + "emails/registo", {user:{nome:this.nome, email: this.email, codigo: this.codigo, escola: this.escola}})
                   this.$emit("login")
                 })
                .catch(erro=> console.log(erro))
          }
          else {
            this.password2 = ""
            Swal.fire({
                    icon: 'error',
                    text: "As palavra passe e a sua confirmação não são iguais!",
                    confirmButtonColor: '#009263'
                  })
          }
        }
        else {
            Swal.fire({
                    icon: 'error',
                    text: 'Ainda possuí campos por preencher!',
                    confirmButtonColor: '#009263'
                  })
        }
      },
      registarAluno : async function(){
        /*
        [aluno.user, aluno.numero, aluno.nome, aluno.datanascimento, 
                aluno.escola, aluno.turma, aluno.email, md5(aluno.password), 
                aluno.codprofessor, aluno.pais]  */
        if(this.user != "" && this.numero != "" && this.nome != "" && this.datanascimento != "" &&
            this.escola != "" && this.turma != "" && this.email != "" && this.password != "" && this.codprofessor != "" 
            && this.pais != ""){
            if(this.password2 != this.password){
              Swal.fire({
                    icon: 'error',
                    text: 'As passwords não são iguais.',
                    confirmButtonColor: '#009263'
                  })
              
            }
            else{
              var aux = this.escola.split(" - ")
              var escolaEscolhida = this.escolasIds.find(element => element.nome == aux[1]).cod
              var date = this.datanascimento.split("-")
              var dataNascimento = date[2] + "/" + date[1] + "/" + date[0]
              let aluno = {
                user: this.user,
                numero: this.numero,
                nome: this.nome,
                datanascimento: dataNascimento,
                escola: escolaEscolhida,
                turma: this.turma,
                email: this.email,
                password: this.password,
                codprofessor: this.codprofessor,
                pais: this.pais,
                confirmacao: 0
              }
              axios.post(h + "alunos", aluno)
                   .then(()=>{
                      Swal.fire({
                        icon: 'success',
                        text: 'O seu pedido de inscrição está realizado! \n Aguarde agora pela autorização necessária.',
                        confirmButtonColor: '#009263'
                      })
                      this.$emit("login")
                    })
                    .catch(erro=> console.log(erro))
            }
        }
        else{
          Swal.fire({
                    icon: 'error',
                    text: 'Ainda possuí campos por preencher!',
                    confirmButtonColor: '#009263'
                  })
        }
      }
    },
  }
</script>

