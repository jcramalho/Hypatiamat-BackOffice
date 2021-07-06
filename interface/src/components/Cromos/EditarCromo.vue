<template>
<v-card class="pa-5">
    <v-layout row class="text-xs-center">
        <v-container  class="text-xs-center">
            <v-form>
            <v-combobox
                id="anoletivo"
                label="Ano Letivo"
                prepend-icon="mdi-counter"
                v-model="cromo.anoletivo"
                color="#009263"
                :items="anos"
                @change="getCromos()" 
            ></v-combobox>
            <v-text-field color="#009263" prepend-icon="mdi-card-account-details" v-model="cromo.numero" name="Número" label="Número" type="number" required></v-text-field>
            <v-text-field color="#009263" prepend-icon="mdi-account" v-model="cromo.nome" name="Nome" label="Nome" :rules="[existeNome, string45]" :counter="45" required></v-text-field>
            <v-combobox
                id="image"
                label="Imagem"
                prepend-icon="mdi-image"
                v-model="cromo.imagem"
                color="#009263"
                :items="imagens"
            ></v-combobox>
            <div v-if="cromo.imagem">
                <center>
                    <v-img 
                        width="150"
                        :src="host + 'cromos_imgs/' + cromo.imagem"
                    ></v-img>
                </center>
            </div>
            <v-combobox
                id="tipo"
                label="Tipo de Cromo"
                prepend-icon="mdi-wrench-outline"
                v-model="cromo.tipo"
                color="#009263"
                item-text="nome"
                :items="tipos"
                @change="changeTipo()"
            ></v-combobox>
            <v-text-field v-if="cromo.tipo && (cromo.tipo.num == 0 || cromo.tipo.num == 1)" 
                color="#009263" prepend-icon="mdi-gamepad-variant" v-model="cromo.jogos" name="Nº. de Jogos Realizados" label="Jogos" type="number" required></v-text-field>

             <v-text-field v-if="cromo.tipo && (cromo.tipo.num == 2 || cromo.tipo.num == 3)" 
                color="#009263" prepend-icon="mdi-apps" v-model="cromo.apps" name="Nº. de Aplicações Realizadas" label="Nº. de Aplicações Realizadas" type="number" required></v-text-field>

            <v-text-field v-if="cromo.tipo && (cromo.tipo.num == 0 || cromo.tipo.num == 2)" 
                color="#009263" prepend-icon="mdi-calendar-blank" v-model="cromo.dias" name="Dias Consecutivos" label="Dias Consecutivos" type="number" required></v-text-field>
            
            <v-text-field v-if="cromo.tipo && (cromo.tipo.num == 1 || cromo.tipo.num == 3)" 
                color="#009263" prepend-icon="mdi-counter" v-model="cromo.diferentes" name="Jogos/Apps Realizadas Diferentes" label="Jogos/Apps Realizadas Diferentes" type="number" required></v-text-field>

            <v-text-field v-if="cromo.tipo && (cromo.tipo.num == 4)" 
                color="#009263" prepend-icon="mdi-trophy" v-model="cromo.campeonatos" name="Campeonatos Realizados" label="Campeonatos Realizados" type="number" required></v-text-field>

            <v-text-field color="#009263" prepend-icon="mdi-saw-blade" v-model="cromo.descricao" name="Descrição" label="Descrição" :rules="[string100]" :counter="100" required></v-text-field>
            <v-card-actions>
              <v-btn class="white--text" :disabled="disabled" primary large block style="background-color: #009263;" @click="registarCromo">Confirmar</v-btn>
            </v-card-actions>
            </v-form>
        </v-container>
    </v-layout>
</v-card>
</template>

<script>
  const h = require("@/config/hosts").host
  const hostCromos = require("@/config/hosts").hostCromos
  import Swal from 'sweetalert2'
  import axios from "axios"
  import moment from 'moment';
  const anoletivoAtual = require("@/config/confs").anoletivo
  const alunosLim = require("@/config/confs").limiteAlunos
  const anosCromos = require("@/config/confs").anosCromos


  export default {
    props:["cromoOriginal", "imagens"],
    data(){
      return {
        cromo:{
            anoletivo: anoletivoAtual,
            numero: null,
            tipo: null,
            nome: '',
            jogos: null,
            apps: null,
            campeonatos: null,
            diferentes: null,
            dias: null,
            estrelas: false,
            imagem: null,
            descricao: ''
        },
        tipos: [
            {num: 0, nome: "Jogos - Dias (com estrelas)"},
            {num: 1, nome: "Jogos - Frequência (sem estrelas)"},
            {num: 2, nome: "Apps - Dias (com estrelas)"},
            {num: 3, nome: "Apps - Frequência (sem estrelas)"},
            {num: 4, nome: "Campeonatos (sem estrelas)"}
        ],
        host:h,
        anos: anosCromos,
        utilizador:[],
        cromos:[],
        token: "",
        disabledNome: false,
        string45: v  => {
          if(v.length <= 45) return true
          else return "Apenas pode conter 45 caractéres."
        },
        string100: v =>{
          if(v.length <= 100) return true
          else return "Apenas pode conter 100 caractéres."
        },
        existeNome: v =>{
          if(this.cromoOriginal.nome != v && this.cromos.find(e => e.nome == v) ) {
            this.disabledNome = true
            return 'Esse nome de cromo já existe no ano selecionado. Escolha outro por favor.'
          }
          this.disabledNome = false
          return true
        },
      }
    },
    created : async function() {
        try {
          this.token = localStorage.getItem("token")
          this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
          this.cromo = JSON.parse(JSON.stringify(this.cromoOriginal))
          this.getCromos()
          if(this.cromo.jogos && this.cromo.dias) this.cromo.tipo = this.tipos[0]
          else if(this.cromo.jogos && this.cromo.diferentes) this.cromo.tipo = this.tipos[1]
          else if(this.cromo.apps && this.cromo.dias) this.cromo.tipo = this.tipos[2]
          else if(this.cromo.apps && this.cromo.diferentes) this.cromo = this.tipos[3]
          else if(this.cromo.campeonatos) this.cromo.tipo = this.tipos[4]

        } catch (e) {
        return e
        }
    },
    computed:{
        disabled(){
            var verifyTipo = false

            if(this.cromo.tipo) {
                if(this.cromo.tipo.num == 0){
                    verifyTipo = (this.cromo.jogos && this.cromo.jogos > 0) && (this.cromo.dias && this.cromo.dias > 0)
                }
                else if(this.cromo.tipo.num == 1){
                    verifyTipo = (this.cromo.jogos && this.cromo.jogos > 0) && (this.cromo.diferentes && this.cromo.diferentes > 0)
                }
                else if(this.cromo.tipo.num == 2){
                    verifyTipo = (this.cromo.apps && this.cromo.apps > 0) && (this.cromo.dias && this.cromo.dias > 0)
                }
                else if(this.cromo.tipo.num == 3){
                    verifyTipo = (this.cromo.apps && this.cromo.apps > 0) && (this.cromo.diferentes && this.cromo.diferentes > 0)
                }
                else if(this.cromo.tipo.num == 4){
                    verifyTipo = (this.cromo.campeonatos && this.cromo.campeonatos > 0)
                }
            }
            if(this.disabledNome || 
                (this.cromo.nome.length > 45) || (this.cromo.descricao.length == 0 || this.cromo.descricao.length > 100)
                || !this.cromo.imagem || !verifyTipo
                ){
                    return true
                }
            else return false
        }
    },
     methods: {
      getCromos: async function(){
        this.loading = true
        var response = await axios.get(hostCromos + "?anoletivo=" + this.cromo.anoletivo + "&token=" + this.token)
        this.cromos = response.data
        this.loading = false
      },
      changeTipo(){
          if(this.cromo.tipo.num == 0){
              this.cromo.diferentes = this.cromo.apps = this.cromo.campeonatos = null
              this.cromo.estrelas = true
          }
          else if(this.cromo.tipo.num == 1){
              this.cromo.dias = this.cromo.apps = this.cromo.campeonatos = null
              this.cromo.estrelas = false
          }
          else if(this.cromo.tipo.num == 2){
              this.cromo.diferentes = this.cromo.jogos = this.cromo.campeonatos = null
              this.cromo.estrelas = true
          }
          else if(this.cromo.tipo.num == 3){
              this.cromo.dias = this.cromo.jogos = this.cromo.campeonatos = null
              this.cromo.estrelas = false
          }
          else if(this.cromo.tipo.num == 4){
              this.cromo.dias = this.cromo.diferentes = this.cromo.apps = this.cromo.jogos = null
              this.cromo.estrelas = false
          }
      },
      format(value, event) {
        return moment(value).format('DD/MM/YYYY')
      },
      registarCromo: function () {
        
        /* var args = [aluno.user, aluno.numero, aluno.nome, aluno.datanascimento, 
                aluno.escola, aluno.turma, aluno.email, md5(aluno.password), 
                aluno.codprofessor, aluno.pais] */
        
        if (!this.disabled){ 
        
            axios.put(hostCromos + this.cromoOriginal.id + "?token=" + this.token, this.cromo)
                 .then(()=>{
                   Swal.fire({
                    icon: 'success',
                    title: 'Cromo editado com sucesso.',
                    confirmButtonColor: '#009263'
                  })
                    this.$emit("editado")
                 })
                .catch(erro=> console.log(erro))          
        }
        else {
          Swal.fire({
                  icon: 'error',
                  title: 'Os campos não se encontram preenchidos corretamente!',
                  confirmButtonColor: '#009263'
                })
        }
      }

    }
  }
</script>

