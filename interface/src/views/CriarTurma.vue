<template>
<v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card>
        
        <v-container style="position: relative;top: 15%; width: 60%;" class="text-xs-center">
            <v-card-title primary-title class="justify-center green--text">
                Criar Turma
            </v-card-title>
            <v-form>
            <v-combobox
                id="escola"
                v-if="escolher"
                prepend-icon="mdi-school"
                label="Escola"
                v-model="escola"
                :items="escolas"
                @change="onEscolaChange"
            ></v-combobox>
            <v-combobox
                id="professor"
                v-if="escolher"
                prepend-icon="mdi-teach"
                label="Professor"
                v-model="codigo"
                :items="professores"
                @change="onProfessorChange"
            ></v-combobox>
            <v-text-field v-if="!escolher" prepend-icon="mdi-account" v-model="utilizador.codigo" name="Username do Professor" label="Username do Professor" required disabled></v-text-field>
            <v-text-field prepend-icon="mdi-book-account" v-model="turma" name="Nome da Turma (Ex: 7A-14-1)" label="Nome da Turma (Ex: 7A-14-1)" :rules="[formatoTurma]" required></v-text-field>
            <v-card-actions>
              <v-btn class="white--text" primary large block style="background-color: #009263;" @click="criarTurma">Confirmar</v-btn>
            </v-card-actions>
            </v-form>
        </v-container>
    </v-card>
    </v-main>
</v-app>
</template>

<script>
  const h = require("@/config/hosts").hostAPI
  import axios from "axios"
import TurmasVue from './Turmas.vue'
  export default {
    data(){
      return {
        utilizador : {},
        turma : "",
        token: "",
        escolher: false,
        escolasIds:[],
        escolas:[],
        escola: "",
        turmas:[],
        professores:[],
        codigo: "",
        formatoTurma: v =>{
          var aux = v.split("-")
          if(aux.length != 3) return 'Formato Incorreto (Exemplo: 7A-14-1)'
          else{
            if(aux[0].length != 2) return 'Formato Incorreto (Exemplo: 7A-14-1)'
            else{
              // verificar se é numero seguida de letra
              if(this.turmas.find(element => element.turma == v)) return 'Já existe uma turma com este identificador na escola selecionada.'
              else {
                return true
              }
            }
          }
        }
      }
    },
    created : async function() {
        try {
            this.token = localStorage.getItem("token")
            this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
            if(this.utilizador.type == 50){
              this.escolher = true
              var response = await axios.get(h + "escolas")
              this.escolasIds = response.data
              var i
              for(i = 0; i < this.escolasIds.length; i++){
                var string = this.escolasIds[i].localidade + " - " + this.escolasIds[i].nome 
                this.escolas.push(string)
              }
            }
            else{
              this.escola = this.utilziador.escola
              var response = await axios.get(h + "escolas/" + this.escola + "/turmas/?token=" + this.token)
              this.turmas = response.data
            }

        } catch (e) {
        return e
        }
    },
     methods: {
      onEscolaChange: async function(){
        var aux = this.escola.split(" - ")
        var escolaEscolhida = this.escolasIds.find(element => element.nome == aux[1]).cod
        var response = await axios.get(h + "escolas/" + escolaEscolhida + "/turmas/?token=" + this.token)
        this.turmas = response.data
        console.log("Turmas: " + this.turmas)
        var responseP = await axios.get(h + "escolas/" + escolaEscolhida + "/professores/?token=" + this.token)
        responseP.data.forEach(element =>{
          this.professores.push(element.codigo)
        })

      },
      onProfessorChange: async function(){
        var response = await axios.get(h + "professores/" + this.codigo + "/turmas/?token=" + this.token)
        var turmas = response.data
        if(turmas.length >= 5){
          alert("Escolha outro professor. Este já possuí, pelo menos, 5 turmas.")
          this.codigo = ""
        }
      },
      criarTurma: async function () {
        if (this.turma != ""){ 
            if(this.escolher){
              let data = {
                idprofessor: this.codigo,
                turma:this.turma
              }
            }
            else{
              let data = {
                  idprofessor: this.utilizador.codigo,
                  turma: this.turma
              }
            }
            
            var response = await axios.post(h + "turmas?token=" + this.token, data)
            this.$router.push({name: "Editar Turma", params: { id : response.data.insertedId } })   
        }
        else {
            alert('Ainda possuí campos por preencher!')
        }
      }
    }
  }
</script>

