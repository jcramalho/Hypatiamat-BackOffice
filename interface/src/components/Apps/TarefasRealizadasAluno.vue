<template>
    <div>
        <v-card class="pa-5">
        <v-card-title class="justify-center green--text"><span>Resultados Por Tarefa</span></v-card-title>
        <center>
            <span><b>App: {{propsTarefas.app}}</b></span>
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
        <v-row v-if="items.length > 0" class="justify-center align-center">
            <v-btn class="white--text" color="#009263" @click="atualizaTarefas()">
                <v-icon>mdi-refresh</v-icon>
                Atualizar
            </v-btn>
        </v-row>
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
            <template v-slot:item="row">
                <tr :class="row.item.acerto>=50 ? 'style-positivo' : 'style-negativo'">
                    <td>{{row.item.frame}}</td>
                    <td>{{row.item.ncertas}}</td>
                    <td>{{row.item.ntotal}}</td>
                    <td>{{row.item.acerto}}</td>
                </tr>
            </template>
            </v-data-table>
        </v-container>

        </v-card>   
    </div> 
</template>

<script>
import axios from "axios"
import jsPDF from 'jspdf' 
import 'jspdf-autotable'

const h = require("@/config/hosts").hostAPI
const hostApps = require("@/config/hosts").hostApps
const hypatiaImg = require("@/assets/hypatiamat.png")

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
                console.log(this.items)
                this.loading = false
            }
        },
        
     
    }
  }
</script>

<style>
.style-negativo {
  background-color: #f26755
}
.style-positivo {
  background-color: #10de16
}
</style>