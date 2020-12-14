<template>
 <div id="app">
  <v-container>
    <v-layout row class="text-xs-center">
        <v-container style="position: relative;top: 15%; width: 60%;" class="text-xs-center">
          <v-card class="pa-5">
            
            <v-form>
            <v-text-field prepend-icon="mdi-card-account-details" v-model="codigo" color="#009263" name="Username (Código)" label="Username (Código)" :rules="[string15, existeCodigo]" required></v-text-field>
            <v-text-field prepend-icon="mdi-account" v-model="nome" color="#009263" name="Nome" label="Nome" required></v-text-field>
            <v-text-field prepend-icon="mdi-email" v-model="email" color="#009263" name="Email" label="Email" required></v-text-field>
            <v-combobox
                id="escola"
                prepend-icon="mdi-school"
                label="Agrupamento"
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
              <v-btn class="white--text" primary large block style="background-color: #009263;" @click="registarProfessor">Confirmar</v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        </v-container>
    </v-layout>
  </v-container>
</div>
</template>

<script>
  const h = require("@/config/hosts").hostAPI
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
        token: "",
        string15: v  => {
          if(v.length <= 15) return true
          else return "Apenas pode conter 15 caractéres"
        },
        existeCodigo: v =>{
            if(this.codigos.find(element => element.codigo == this.codigo)){
                return 'Esse código de professor já existe. Tente outro por favor.'
            }
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
          var responseCodigos = await axios.get(h + "professores/codigos?token=" + this.token)
          this.codigos = responseCodigos.data
        } catch (e) {
        return e
        }
    },
     methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      registarProfessor: function () {
        
        if (this.nome != "" && this.email != "" && this.codigo != "" && this.escola != "" && this.password != "" && this.password2 != "" && this.premium != ""){ 
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
                   alert('O professor foi criado com sucesso.')
                   this.$router.push({name:"Professores"})
                 })
                .catch(erro=> console.log(erro))
          }
          else {
            this.password2 = ""
            alert("As palavra passe e a sua confirmação não são iguais!")
          }
        }
        else {
            alert('Ainda possuí campos por preencher!')
        }
      }

    }
  }
</script>

