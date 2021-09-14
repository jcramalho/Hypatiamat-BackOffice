<template>
<v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card>
            
            <v-container style="position: relative;top: 15%; width: 80%;" class="text-xs-center">
                <v-card-title primary-title class="justify-center green--text">
                    Criar Turma
                </v-card-title>
                <v-form>
                <v-combobox
                    id="escola"
                    v-if="escolher"
                    prepend-icon="mdi-school"
                    label="Agrupamento de Escolas"
                    v-model="escola"
                    :items="escolas"
                    @change="onEscolaChange"
                ></v-combobox>
                <v-combobox
                    id="professor"
                    v-if="escolher"
                    prepend-icon="mdi-human-male-board"
                    label="Professor"
                    v-model="codigo"
                    :items="professores"
                    @change="onProfessorChange"
                ></v-combobox>
                <v-text-field v-if="!escolher" prepend-icon="mdi-account" v-model="utilizador.codigo" name="Username do Professor" label="Username do Professor" required disabled></v-text-field>
                <v-combobox
                  id="ano_escolaridade"
                  label="Ano de Escolaridade"
                  prepend-icon="mdi-numeric-1-box-outline"
                  v-model="ano_escolaridade"
                  :items="anosEscolaridade"
                  @change="onAnoChange"
                >
                </v-combobox>
                <v-combobox
                  id="letra"
                  label="Letra da Turma"
                  prepend-icon="mdi-alpha-a-box-outline"
                  v-model="letra_turma"
                  :items="['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']"
                  @change="onLetraChange"
                >
                </v-combobox>
                <v-text-field v-if="!escolher" prepend-icon="mdi-book-account" v-model="turma" 
                        name="Nome da Turma" label="Nome da Turma" :rules="[formatoTurma]" required disabled></v-text-field>
                <v-text-field v-else prepend-icon="mdi-book-account" v-model="turma" 
                        name="Nome da Turma" label="Nome da Turma" :rules="[formatoTurma]" required></v-text-field>
                <v-card-actions>
                  <v-btn class="white--text" primary large block style="background-color: #009263;" @click="criarTurma" :disabled="utilizador.type == 5">Confirmar</v-btn>
                </v-card-actions>
                </v-form>
            </v-container>
        </v-card>
      </v-container>
    </v-main>
</v-app>
</template>

<script>
  const h = require("@/config/hosts").hostAPI
  const AnoAtual = require("@/config/confs").anoAtual
  const anoLetivoAtual = require("@/config/confs").anoletivo
  import Swal from 'sweetalert2'
  import axios from "axios"
  export default {
    data(){
      return {
        utilizador : {},
        turma : "",
        token: "",
        escolher: false,
        ano_escolaridade: "",
        letra_turma: "",
        ano_escolaridade_number: 0,
        anosEscolaridade: ["1ºano", "2ºano", "3ºano", "4ºano", "5ºano", "6ºano", "7ºano", "8ºano", "9ºano"],
        escolasIds:[],
        escolas:[],
        escola: "",
        turmas:[],
        professores:[],
        anoAtual:AnoAtual,
        codigo: "",
        formatoTurma: v =>{
          var aux = v.split("-")
          if(aux.length != 3) return 'Formato Incorreto (Exemplo: 7A-14-1)'
          else{
            if(aux[0].length != 2) return 'Formato Incorreto (Exemplo: 7A-14-1)'
            else{
              // verificar se é numero seguida de letra
              if(this.turmas.find(element => element.turma == v)) return 'Já existe uma turma com este identificador no agrupamento selecionado.'
              else {
                return true
              }
            }
          }
        }
      }
    },
    created : async function() {
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
        this.escola = this.utilizador.escola
        var response = await axios.get(h + "escolas/" + this.escola + "/turmas/?token=" + this.token)
        this.turmas = response.data
      }

    },
     methods: {
      onEscolaChange: async function(){
        var aux = this.escola.split(" - ")
        var escolaEscolhida = this.escolasIds.find(element => element.nome == aux[1]).cod
        var response = await axios.get(h + "escolas/" + escolaEscolhida + "/turmas/?token=" + this.token + "&ano=" + (parseInt(this.anoAtual)-1))
        this.turmas = response.data
        this.professores = []
        this.codigo = ""
        console.log("Turmas: " + this.turmas)
        var responseP = await axios.get(h + "escolas/" + escolaEscolhida + "/professores/?token=" + this.token)
        responseP.data.forEach(element =>{
          this.professores.push(element.codigo)
        })
        this.changeNomeTurma()
      },
      onProfessorChange: async function(){
        var response = await axios.get(h + "professores/" + this.codigo + "/turmas/?token=" + this.token + "&ano=" + (parseInt(this.anoAtual)-1))
        var turmas = response.data
        if(turmas.length >= 4){
          Swal.fire({
                  icon: 'warning',
                  text: "Escolha outro professor. Este já possuí, pelo menos, 4 turmas neste ano letivo.",
                  confirmButtonColor: '#009263'
                })
          //this.codigo = ""
        }
      },
      criarTurma: async function () {
        if (this.turma != "" && this.anosEscolaridade.find(element => element == this.ano_escolaridade) && this.letra_turma.length ==1){ 
            let data = {}
            if(this.escolher){
              data = {
                idprofessor: this.codigo,
                turma:this.turma,
                anoletivo: anoLetivoAtual,

              }
              var response = await axios.post(h + "turmas?token=" + this.token, data)
                                        .then(()=> {
                                          Swal.fire({
                                              icon: 'success',
                                              text: 'Turma inserida com sucesso.',
                                              confirmButtonColor: '#009263'
                                            })
                                          this.$router.push({name: "Turmas"}) 
                                        })
                                        .catch(error => console.log(error))
            }
            else{
              data = {
                  idprofessor: this.utilizador.codigo,
                  turma: this.turma,
                  anoletivo: anoLetivoAtual
              }
              var response = await axios.post(h + "turmas?token=" + this.token, data)
                                        .then(()=> {
                                          Swal.fire({
                                              icon: 'success',
                                              text: 'Turma inserida com sucesso.',
                                              confirmButtonColor: '#009263'
                                            })
                                          this.$router.push({name: "Gestão de Turmas"}) 
                                        })
                                        .catch(error => console.log(error))
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
      onAnoChange: async function(){
        if(this.anosEscolaridade.find(element => element == this.ano_escolaridade)){
          this.ano_escolaridade_number = this.ano_escolaridade.charAt(0)
          this.changeNomeTurma()
        }
      },
      onLetraChange: async function(){
        if(this.letra_turma != ""){
          this.changeNomeTurma()
        }
      },
      changeNomeTurma: async function(){
        if(this.letra_turma != "" && this.anosEscolaridade.find(e => e == this.ano_escolaridade)){
          console.log(this.anoAtual)
          var nome = this.ano_escolaridade_number + this.letra_turma
          nome += "-" + this.anoAtual + "-"
          var i = 1 
          for(i = 1; i < 99; i++){
            var aux = nome + i
            var turma = this.turmas.find(element => element.turma == aux)
            if(turma == undefined) break;
          }
          nome += i
          this.turma = nome
        }
      }
    }
  }
</script>

