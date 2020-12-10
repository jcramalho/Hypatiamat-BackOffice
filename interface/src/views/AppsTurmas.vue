<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
            <v-card-title primary-title class="justify-center green--text">
                Monotorização de Apps por turmas do professor ({{this.codProf}})
            </v-card-title>
                <center>
                <v-card class="pa-5" width="60%">
                    <v-combobox
                        id="turmas"
                        v-model="turmaSel"
                        label="Turma"
                        color="green"
                        :items="turmas"
                        @change="onTurmaChange"
                    ></v-combobox>
                    <v-combobox
                        id="apps"
                        v-model="app"
                        label="App"
                        color="green"
                        :items="apps"
                        @change="onAppChange"
                    ></v-combobox>
                    <v-combobox
                        id="anos"
                        v-model="anoLetivo"
                        label="Ano Letivo"
                        color="green"
                        :items="anosLetivos"
                        @change="onAnoChange"
                    ></v-combobox>
                    <v-layout row class="text-xs-center" justify-center align-center>
                        <v-flex xs5>
                        <v-text-field @change="onDataInChange" prepend-icon="mdi-calendar" v-model="dataInicio" label="Data Inicio" type="date" :format="format" required></v-text-field>
                        </v-flex>
                        <v-flex xs5>
                            <v-text-field @change="onDataFimChange" prepend-icon="mdi-calendar" v-model="dataFim" label="Data Fim" type="date" :format="format" required></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-card>
                </center>
                <br>
        <v-container v-if="loading">
            <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
        </v-container>
        <v-container v-else>
        <v-text-field
            v-model="filtrar"
            label="Filtrar"
            prepend-icon="mdi-magnify"
            color="#009263"
            single-line
            ></v-text-field>
        <v-data-table
            class="elevation-4"
            :headers="headers"
            :items="items"
            :footer-props="footer_props"
            :search="filtrar"
            @click:row="goToProfessores"
        >
            
        </v-data-table>
        </v-container>
        </v-container>
    </v-card>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
import jsPDF from 'jspdf' 
import domtoimage from "dom-to-image";
import 'jspdf-autotable'
import html2canvas from "html2canvas";
const h = require("@/config/hosts").hostAPI
const hostApps = require("@/config/hosts").hostApps
const hypatiaImg = require("@/assets/hypatiamat.png")

  export default {
    data(){
      return {
        token: "",
        loading: false,
        app:"",
        filtrar:"",
        dataInicio: "2019-09-01",
        dataFim: "2020-09-01",
        turmaSel: "",
        utilizador : {},
        alunos:[],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        anosLetivos:["2013/2014", "2014/2015", "2015/2016", "2016/2017", "2017/2018", "2018/2019", "2019/2020", "2020/2021"],
        anoLetivo: "2019/2020",
        apps:["Todas"],
        appsInfo:["Todas"],
        headers:[
            {text: "Nº", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "NTRC", value: 'ncertas', class: 'subtitle-1'},
            {text: "NTR", value: 'ntotal', class: 'subtitle-1'},
            {text: "Acerto(%)", value: 'acerto', class: 'subtitle-1'},
            {text: "DP", value: 'onpeak', class: 'subtitle-1'},
            {text: "FP", value: 'offpeak', class: 'subtitle-1'},
            {text: "#", value:'frequencia', class:"subtitle-1"}
        ],
        items:[],
        codProf:"",
        turmas:[],
        turmaSel:""
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.codProf = this.$route.params.idprofessor

        var response = await axios.get(h + "professores/" + this.codProf + "/turmas?token=" + this.token)
        var i = 0
        for(i = 0; i < response.data.length; i++){
          this.turmas.push(response.data[i].turma)
        }
        
        if(this.$route.params.anoLetivo && this.$route.params.dataInicio && this.$route.params.dataFim){
            this.dataInicio = this.$route.params.dataInicio
            this.dataFim = this.$route.params.dataFim
            this.anoLetivo = this.$route.params.anoLetivo
        }
        // ir buscar as apps disponíveis
        
        
    },
    methods: {
      onTurmaChange: async function(item){
          if(this.turmaSel != ""){
              this.atualizaConteudo()
          }

      },
      onAnoChange: async function(item){
          if(this.anoLetivo != ""){
             var aux = this.anoLetivo.split("/")
             this.dataInicio = aux[0] + "-09-01"
             this.dataFim = aux[1] + "-09-01"
             this.atualizaConteudo()
          }
      },
      onAppChange: async function(item){
            this.atualizaConteudo()
      },
      onDataInChange: async function(item){
          if(this.dataInicio){
              this.atualizaConteudo()
          }
      },
      onDataFimChange: async function(item){
          if(this.dataFim){
              this.atualizaConteudo()
          }
      },
      atualizaConteudo: async function(){
            if(this.app != "" && this.dataFim != "" && this.dataInicio != "" && this.turmaSel != ""){

                if(this.app == "Todas"){

                    this.loading = true
                    var response = await axios.get(hostApps + "turmas/" + this.turmaSel
                                            + "/?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                            + "&codProf=" + this.codProf + "&token=" + this.token)
            
                    this.items = response.data
                    this.loading = false
              
                }
                else{
                    // Fazer para uma app em particular
                }

          } 
      },
    }
  }
</script>