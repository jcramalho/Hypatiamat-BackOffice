<template>
 <div id="app">
  <v-container>
    <v-layout row class="text-xs-center">
        <v-container style="position: relative;top: 15%; width: 60%;" class="text-xs-center">
          <v-card class="pa-5">
            <v-layout row class="text-xs-center">
            <v-flex xs6>
              <v-btn v-if="isProfessor" class="white--text" primary large block style="background-color: #27451e;"> Professor (atualmente selecionado) </v-btn>
              <v-btn v-else class="white--text" @click="isProfessor=!isProfessor"  primary large block style="background-color: #009263;"> Professor </v-btn>
            </v-flex>
            <v-flex xs6>
              <v-btn v-if="isProfessor" class="white--text" @click="isProfessor=!isProfessor" primary large block style="background-color: #009263;"> Aluno </v-btn>
              <v-btn v-else class="white--text"  primary large block style="background-color: #27451e;"> Aluno (atualmente selecionado) </v-btn>
            </v-flex>
          </v-layout>
            
            <v-form v-if="isProfessor">
            <v-text-field prepend-icon="mdi-card-account-details" v-model="codigo" color="#009263" name="Username (Código)" label="Username (Código)" :rules="[string15]" required></v-text-field>
            <v-text-field prepend-icon="mdi-account" v-model="nome" color="#009263" name="Nome" label="Nome" required></v-text-field>
            <v-text-field prepend-icon="mdi-email" v-model="email" color="#009263" name="Email" label="Email" required></v-text-field>
            <v-combobox
                id="escola"
                prepend-icon="mdi-school"
                label="Agrupamento de Escolas"
                :return-object="true"
                v-model="escola"
                color="#009263"
                :items="escolas"
            ></v-combobox>
            <v-text-field prepend-icon="mdi-key" color="#009263" v-model="password" name="Password" label="Password" type="password" required></v-text-field>
            <v-text-field prepend-icon="mdi-key" color="#009263" v-model="password2" name="Confirmação Password" label="Confirmação Password" type="password" required></v-text-field>
            <v-card-actions>
              <v-btn class="white--text" primary large block style="background-color: #009263;" @click="registarProfessor">Confirmar</v-btn>
            </v-card-actions>
            </v-form>
            <v-form v-else>
            <v-text-field prepend-icon="mdi-card-account-details" v-model="codigo" name="Username (Código)" label="Username (Código)" :rules="[string15]" required></v-text-field>
            <v-text-field prepend-icon="mdi-account" v-model="nome" name="Nome" label="Nome" required></v-text-field>
            <v-text-field prepend-icon="mdi-email" v-model="email" name="Email" label="Email" required></v-text-field>
            <v-text-field prepend-icon="mdi-school" v-model="escola" name="Escola" label="Escola" required></v-text-field>
            <v-combobox
                id="escola"
                prepend-icon="mdi-school"
                label="Agrupamento de Escolas"
                :return-object="true"
                v-model="escola"
                :items="escolas"
            ></v-combobox>
            <v-text-field prepend-icon="mdi-key" v-model="password" name="Password" label="Password" type="password" required></v-text-field>
            <v-text-field prepend-icon="mdi-key" v-model="password2" name="Confirmação Password" label="Confirmação Password" type="password" required></v-text-field>
            <v-card-actions>
              <v-btn class="white--text" primary large block style="background-color: #009263;" @click="registarProfessor">Confirmar</v-btn>
            </v-card-actions>
            </v-form>
            <v-card-actions class="justify-center">
            <v-btn class="white--text"  primary large block style="background-color: #009263;" @click="login">Voltar</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
    </v-layout>
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
        escola : "",
        escolas: [],
        escolasIds : [],
        email : "",
        codigo : "",
        password : "",
        password2 : "",
        string15: v  => {
          if(v.length <= 15) return true
          else return "Apenas pode conter 15 caractéres"
        },
      }
    },
    created : async function() {
        try {
          var response = await axios.get(h + "escolas")
          this.escolasIds = response.data
          var i
          for(i = 0; i < this.escolasIds.length; i++){
            var string = this.escolasIds[i].localidade + " - " + this.escolasIds[i].nome 
            this.escolas.push(string)
          }
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
      }

    }
  }
</script>

