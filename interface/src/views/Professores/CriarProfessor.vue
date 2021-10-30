<template>
 <v-app id="inspire">
   <v-main class="grey lighten-3">
    <v-container>
      <v-layout row class="text-xs-center">
          <v-container style="position: relative;top: 15%; width: 80%;" class="text-xs-center">
            <v-card class="pa-5">
              
              <v-form>
              <v-text-field prepend-icon="mdi-card-account-details" v-model="codigo" color="#009263" name="Username (Código)" label="Username (Código)" :rules="[existeCodigo]" required></v-text-field>
              <v-text-field prepend-icon="mdi-account" v-model="nome" color="#009263" name="Nome Completo" label="Nome Completo" required></v-text-field>
              <v-text-field prepend-icon="mdi-email" v-model="email" color="#009263" name="Email" label="Email" :rules="[existeEmail]" required></v-text-field>
              <v-combobox
                  id="escola"
                  prepend-icon="mdi-school"
                  label="Agrupamento de Escolas"
                  v-model="escola"
                  color="#009263"
                  :items="escolas"
              ></v-combobox>
              <v-combobox
                  id="premium"
                  prepend-icon="mdi-vpn"
                  label="Premium"
                  v-model="premium"
                  color="#009263"
                  :items="typePremium"
              ></v-combobox>
              <v-text-field prepend-icon="mdi-handshake" color="#009263" v-model="socionum" name="Nº de Sócio" label="Nº de Sócio" required></v-text-field>
              <v-text-field prepend-icon="mdi-key" color="#009263" v-model="password" name="Password" label="Password" type="password" required></v-text-field>
              <v-text-field prepend-icon="mdi-key" color="#009263" v-model="password2" name="Confirmação Password" label="Confirmação Password" type="password" required></v-text-field>
              <v-card-actions>
                <v-btn class="white--text" :disabled="disabledCodigo || disabledEmail || disabledOutrosCamposProf" primary large block style="background-color: #009263;" @click="registarProfessor">Confirmar</v-btn>
              </v-card-actions>
              </v-form>
            </v-card>
          </v-container>
      </v-layout>
    </v-container>
   </v-main>
 </v-app>
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
        socionum: 0,
        premium: "1 - Professor",
        typePremium:[
            "1 - Professor",
            "2 - Município",
            "3 - Agrupamento",
            "5 - Admin"
        ],
        projeto:0,
        escola : "",
        escolas: [],
        escolasIds : [],
        email : "",
        codigo : "",
        password : "",
        password2 : "",
        codigos:[],
        codigosalunos:[],
        disabledCodigo: true,
        disabledEmail: true,
        token: "",
        reg2: /\s/,
        reg3: /[ `!@#$%^&*()+=\[\]{};':"\\|,<>\/?~!\/:[`{~ºç´`]/,
        string15: v  => {
          
        },
        existeCodigo: v =>{
            if(v.length <= 15 && !this.reg2.test(v) && !this.reg3.test(v)) {
              if(this.codigos.find(element => element.codigo.toUpperCase() == this.codigo.toUpperCase()) || this.codigosalunos.find(e => e.user.toUpperCase() == this.codigo.toUpperCase())){
                this.disabledCodigo = true
                return 'Esse código já existe. Tente outro por favor.'
              }
              this.disabledCodigo = false
              return true
            }
            else {this.disabledCodigo = true; return  "Apenas pode conter 15 caractéres e não pode conter caractéres especiais, nem espaços."}
            
        },
        existeEmail: v =>{
          if(this.codigos.find(e => e.email == v) || this.codigosalunos.find(e => e.email == v)){
            this.disabledEmail = true
            return 'Esse email já existe. Tente outro por favor.'
          }
          else if(this.reg2.test(v) && this.reg3.test(v)){
            this.disabledEmail = true
            return 'Esse email é inválido. Não pode conter caracteres especiais, nem espaços.';
          }
          else{
            this.disabledEmail = false
            return true
          }
        }
      }
    },
    computed:{
      disabledOutrosCamposProf(){
        console.log(this.nome)
        if(this.nome != "" && this.nome != undefined && this.nome != null
            && this.escola != "" && this.escola != undefined && this.escola != null
            && this.password != "" && this.password != undefined && this.password != null
            && this.password2 != "" && this.password2 != undefined && this.password2 != null
            && this.socionum != "" && this.socionum != undefined && this.socionum != null
            && this.premium != "" && this.premium != undefined && this.premium != null){
              return false
            }
        else return true
      },
    },
    created : async function() {
        try {
          this.token = localStorage.getItem("token")
          var response = await axios.get(h + "escolas?token=" + this.token)
          this.escolasIds = response.data
          var i
          for(i = 0; i < this.escolasIds.length; i++){
            var string = this.escolasIds[i].localidade + " - " + this.escolasIds[i].nome 
            this.escolas.push(string)
          }
          var responseCodigos = await axios.get(h + "professores/codigos?token=" + this.token)
          this.codigos = responseCodigos.data
          var responseCodigos2 = await axios.get(h + "alunos/codigos?token=" + this.token)
          this.codigosalunos = responseCodigos2.data
        } catch (e) {
        return e
        }
    },
     methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      registarProfessor: function () {
        this.existeCodigo(this.codigo)
        if (!this.disabledCodigo && !this.disabledEmail && this.nome != "" && this.email != "" && this.codigo != "" && this.escola != "" && this.password != "" && this.password2 != "" && this.premium != ""){ 
          if(this.password == this.password2 ){
            var aux = this.escola.split(" - ")
            var auxPremium = this.premium.split(" - ")
            var escolaEscolhida = this.escolasIds.find(element => element.nome == aux[1]).cod
            var socionum = 0;
            if(this.socionum){
                socionum = this.socionum
            }
            let data = {
                nome : this.nome,
                email : this.email,
                codigo : this.codigo,
                escola : escolaEscolhida,
                password : this.password,
                premium : auxPremium[0],
                socionum: this.socionum,
                projeto: 0
            }
            axios.post(h + "professores/?token=" + this.token, data)
                 .then(()=>{
                   Swal.fire({
                      icon: 'success',
                      title: 'O professor foi criado com sucesso.',
                      confirmButtonColor: '#009263'
                    })
                   this.$router.push({name:"Professores"})
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

