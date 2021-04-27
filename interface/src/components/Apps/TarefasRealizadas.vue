<template>
    <div>
        <v-card class="pa-5">
        <v-card-title class="justify-center green--text"><span>Resultados Por Tarefa</span></v-card-title>
        <center>
            <span><b>App: {{propsTarefas.app}}</b></span>
            <br>
            <span>{{propsTarefas.numero}} - {{propsTarefas.nome}}</span>
        </center>
        <br>
        <v-layout row class="text-xs-center" justify-center align-center>
            <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
            <v-text-field @change="atualizaTarefas" v-model="dataInicio" label="Data Inicio" type="date" required></v-text-field>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                <v-text-field @change="atualizaTarefas" v-model="dataFim" label="Data Fim" type="date" required></v-text-field>
            </v-col>
        </v-layout>
        <v-container v-if="loading">
            <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
        </v-container>
        <v-container v-else>
            <v-data-table
            class="elevation-4"
            :headers="header_resultados"
            :items="items"
            :footer-props="footer_props"
            >
            </v-data-table>
        </v-container>

        </v-card>   
    </div> 
</template>

<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI
const hostApps = require("@/config/hosts").hostApps

  export default {
    data(){
      return {
        items: [],
        header_resultados: [
            {text: "Frame", value: 'frame', class: 'subtitle-1'},
            {text: "NTRC", value: 'ncertas', class: 'subtitle-1'},
            {text: "NTR", value: 'ntotal', class: 'subtitle-1'},
            {text: "Acerto(%)", value: 'acerto', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        dataInicio: "",
        dataFim: "",
        token: "",
        loading: false

      }
    },
    props:["propsTarefas"],
    created: async function(){
        this.token = localStorage.getItem("token")

        this.dataInicio = this.propsTarefas.dataInicio;
        this.dataFim = this.propsTarefas.dataFim;

        this.atualizaTarefas()
    },
    
    methods: {
        atualizaTarefas: async function(){
            if(this.dataInicio && this.dataInicio != "" && this.dataFim && this.dataFim != ""){
                this.loading = true
                var response = await axios.get(hostApps + "tarefas/alunos/" + this.propsTarefas.userid + "?table=" 
                    + this.propsTarefas.table + "&dataInicio=" + this.dataInicio + "&dataFim=" 
                    + this.dataFim + "&token=" + this.token)
                
                if(response) this.items = response.data
                this.loading = false
            }
        }
     
    }
  }
</script>