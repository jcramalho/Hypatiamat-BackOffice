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
              <v-text-field prepend-icon="mdi-barcode" v-model="codigoHypatia" color="#009263" name="Código Hypatiamat" label="Código Hypatiamat" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <span class="pl-8 caption" style="display: inline-block; cursor: pointer" @click="dialogEmailCodigo = true"> Não possuí um código hypatiamat? </span>
            </v-col>
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
                  <v-text-field prepend-icon="mdi-card-account-details" v-model="user" color="#009263" name="Username (Código)" label="Username (Código)" :rules="[string15, codigoAlunoExistente]" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">  
                  <v-text-field prepend-icon="mdi-account" v-model="nome" name="Nome" color="#009263" label="Nome" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon="mdi-bank" v-model="pais" name="País" color="#009263" label="País" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon="mdi-calendar" v-model="datanascimento" color="#009263" name="Data de Nascimento" label="Data de Nascimento" type="date" :format="format" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon="mdi-email" v-model="email" name="Email" color="#009263" label="Email" :rules="[emailValido, emailAlunoExistente]" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field @change="onProfessorChange" prepend-icon='mdi-human-male-board' v-model="codprofessor" color="#009263" name="Código do Professor" label="Código do seu Professor" :rules="[codigoProfessorAluno]" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-combobox
                    id="turma"
                    prepend-icon="mdi-book-account"
                    label="Turma"
                    :return-object="true"
                    v-model="turma"
                    color="#009263"
                    item-text="turma"
                    :items="turmas"
                  ></v-combobox>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon="mdi-numeric-1-box-multiple-outline" v-model="numero" color="#009263" name="Número" label="Número" type="number" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon="mdi-key" v-model="password" color="#009263" name="Password" label="Password" type="password" required></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="12" lg="12"  xl="12">
                  <v-text-field prepend-icon="mdi-key" v-model="password2" color="#009263" name="Confirmação Password" label="Confirmação Password" type="password" required></v-text-field>
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
    <v-dialog v-model="dialogEmailCodigo" width="70%">
      <v-card class="pa-4">
        <v-card-title class="green--text justify-center"> Pedido de Código Hypatiamat </v-card-title>
        <v-combobox
            id="escola2"
            prepend-icon="mdi-school"
            label="Agrupamento de Escolas"
            v-model="escola"
            color="#009263"
            :items="escolas"
        ></v-combobox>
        <v-text-field prepend-icon="mdi-email" v-model="email" color="#009263" name="Email" label="Email" required></v-text-field>
        <v-text-field prepend-icon="mdi-account" v-model="nome" color="#009263" name="Nome" label="Nome" required></v-text-field>
        <v-btn 
          class="justifiy-center white--text" 
          block color="#009263"
          :disabled="!((escola && escola != '') && (nome && nome != '') && (email && email != ''))"
          @click="enviarSolicitacao"
        > Enviar Solicitação 
        </v-btn>
      </v-card>
    </v-dialog>
  </v-container>
  <Footer/>
</div>
</template>

<script>
  const h = require("@/config/hosts").hostAPI
  const anoAtual = require("@/config/confs").anoAtual
  import Swal from 'sweetalert2'
  import Footer from '../components/Footer.vue';
  import axios from "axios"
  export default {
    components: { Footer },
    data(){
      return {
        token: "",
        dialogEmailCodigo: false,
        isProfessor: true,
        nome : "",
        codigoHypatia: "",
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
        turmas:[],
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
          if(this.codigosprofs.find(e => e.codigo.toUpperCase() == v.toUpperCase()) || this.codigosalunos.find(e => e.user.toUpperCase() == v.toUpperCase())) 
                      {this.disabledCodigo = true ; return 'Código já utilizado. Escolha outro por favor.'}
          else {this.disabledCodigo = false; return true}
        },
        codigoAlunoExistente: v =>{
          if(this.codigosalunos.find(e => e.user.toUpperCase() == v.toUpperCase()) || this.codigosprofs.find(e => e.codigo.toUpperCase() == v.toUpperCase())) 
                      {this.disabledCodigo = true ; return 'Código já utilizado. Escolha outro por favor.'}
          else {this.disabledCodigo = false; return true}
        },
        emailProfExistente: v =>{
          if(this.codigosprofs.find(e => e.email == v) || this.codigosalunos.find(e => e.email == v)) {this.disabledEmail = true; return 'Email já utilizado. Escolha outro por favor.'}
          else {this.disabledEmail = false; return true}
        },
        emailAlunoExistente: v =>{
          if(this.codigosalunos.find(e => e.email == v) || this.codigosprofs.find(e => e.email == v)) {this.disabledEmail = true; return 'Email já utilizado. Escolha outro por favor.'}
          else {this.disabledEmail = false; return true}
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
          this.token = localStorage.getItem("tokenInterface")
          var response = await axios.get(h + "escolas?token=" + this.token)
          this.escolasIds = response.data
          var responseProf = await axios.get(h + "professores/codigos?token=" + this.token)
          this.codigosprofs = responseProf.data
          var responseAlunos = await axios.get(h + "alunos/codigos?token=" + this.token)
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
        
        
        if (this.nome != "" && this.email != "" && this.codigo != "" && this.escola != "" && this.password != "" && this.password2 && this.codigoHypatia){ 
          if(this.password == this.password2){
            var aux = this.escola.split(" - ")
            var escolaEscolhida = this.escolasIds.find(element => element.nome == aux[1]).cod
            let data = {
                codigoHypatia: this.codigoHypatia,
                nome : this.nome,
                email : this.email,
                codigo : this.codigo,
                escola : escolaEscolhida,
                password : this.password
            }
            axios.post(h + "quarentenas/", data)
                 .then((dados)=>{
                   Swal.fire({
                    icon: 'success',
                    text: 'O seu pedido de inscrição está realizado! \n Aguarde agora pela autorização necessária.',
                    confirmButtonColor: '#009263'
                   })
                  if(dados.data.inserido){
                    axios.post(h + "emails/registo", {user:{nome:this.nome, email: this.email, codigo: this.codigo, escola: this.escola}})
                    this.$emit("login")
                  }
                  else{
                    this.codigoHypatia = ""
                    Swal.fire({
                      icon: 'error',
                      html: dados.data.message.replaceAll('\n', '<br>'),
                      confirmButtonColor: '#009263'
                    })
                  }
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
      onProfessorChange: async function(){
        if(!this.disabledCodProfAluno && this.codprofessor != ""){
          axios.get(h + "professores/" + this.codprofessor + "/turmas?ano=" + (anoAtual-1) + "&token=" + this.token)
               .then(response => this.turmas = response.data)
               .catch(async () => {
                 var resToken = await axios.get(h + "login/interface")
                 localStorage.setItem("tokenInterface", resToken.data.token)
                 this.token = resToken.data.token
               })
        }
        else {this.turma = ""; this.turmas = []}
      }, 
      registarAluno : async function(){
        /*
        [aluno.user, aluno.numero, aluno.nome, aluno.datanascimento, 
                aluno.escola, aluno.turma, aluno.email, md5(aluno.password), 
                aluno.codprofessor, aluno.pais]  */
        if(this.user != "" && this.numero != "" && this.nome != "" && this.datanascimento != "" &&
            this.turma != "" && this.email != "" && this.password != "" && this.codprofessor != "" 
            && this.pais != ""){
            if(this.password2 != this.password){
              Swal.fire({
                    icon: 'error',
                    text: 'As passwords não são iguais.',
                    confirmButtonColor: '#009263'
                  })
              
            }
            else{
              var date = this.datanascimento.split("-")
              var dataNascimento = date[2] + "/" + date[1] + "/" + date[0]
              let aluno = {
                user: this.user,
                numero: this.numero,
                nome: this.nome,
                datanascimento: dataNascimento,
                turma: this.turma.turma,
                email: this.email,
                password: this.password,
                codprofessor: this.codprofessor,
                pais: this.pais,
                confirmacao: 0
              }
              axios.post(h + "alunos?token=" + this.token, aluno)
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
      },
      enviarSolicitacao: function(){
        if((this.escola && this.escola != '') && (this.nome && this.nome != '') && (this.email && this.email != '')){
           var body = {
             agrupamento: this.escola,
             nome: this.nome,
             email: this.email
           }
           axios.post(h + 'emails/solicitacaocodigo?token=' + this.token, body)
                .then(() => {
                  Swal.fire({
                    icon: 'success',
                    text: 'A sua solicitação foi enviada.\nAguarde por uma resposta.\nObrigado.',
                    confirmButtonColor: '#009263'
                  })
                  this.nome = this.email = this.escola = ""
                  this.dialogEmailCodigo = false
                })
                .catch(() =>{
                  Swal.fire({
                    icon: 'error',
                    text: 'Pedimos desculpa, mas de momento não é possível enviar uma solicitação.',
                    confirmButtonColor: '#009263'
                  })
                  this.nome = this.email = this.escola = ""
                  this.dialogEmailCodigo = false
                })
        }
      }
    },
  }
</script>

