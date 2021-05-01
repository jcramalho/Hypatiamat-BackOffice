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
        <center>
            <v-btn v-if="items.length>0" class="white--text" style="background-color: #009263;" @click="exportPDF()"> 
                <v-icon> mdi-pdf-box </v-icon> Exportar 
            </v-btn>
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
                this.loading = false
            }
        },
        exportPDF: async function(){
            var doc = new jsPDF({
            })

            var xImage = doc.internal.pageSize.getWidth() / 4
            var ytotal = 0
            var pdfName = "Tarefas-" + this.propsTarefas.app + "-"+ this.propsTarefas.userid +".pdf"
            
            doc.addImage(hypatiaImg, 'PNG', xImage, 4);
            //doc.text("Jogo:")
            //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
            doc.setFontSize(11)
            
            doc.text("Professor: " + this.propsTarefas.nomeProf, 15, 50)
            doc.text("Turma: " + this.propsTarefas.turma, 130, 50)
            doc.text("Período: " + "Período: " + this.dataInicio + " até " + this.dataFim, 15, 56)
            doc.text("App de Conteúdos: " + this.propsTarefas.app, 15, 62)
            doc.text("Aluno: " + this.propsTarefas.nome, 15, 68)
            var listaRes = []
            var total =["Total", 0, 0, 0]
            for(var i = 0; i<this.items.length; i++){
                var aux = [];
                aux.push(this.items[i].frame)
                aux.push(this.items[i].ncertas)
                aux.push(this.items[i].ntotal)
                aux.push(this.items[i].acerto)
                total[1] += this.items[i].ncertas
                total[2] += this.items[i].ntotal

                listaRes.push(aux)
            }
            total[3] = Math.round((total[1]/total[2]) * 100)
            listaRes.push(total)
            doc.autoTable({
                head: [['Frame', 'NTRC', "NTR", "Acerto(%)"]],
                body: listaRes,
                headStyles: { fillColor: [0, 146, 99] },
                margin:{top: 73, bottom: 25},
                didDrawPage: function (data) {
                        // Reseting top margin. The change will be reflected only after print the first page.
                        data.settings.margin.top = 10;
                        ytotal = doc.internal.pageSize.getHeight()
                        doc.setFontSize(8)
                        //doc.setFontType('bold'
                        doc.text("Legenda:" , 10, ytotal -18)
                        doc.text("NTRC - N.º de tarefas realizadas corretamente", 10, ytotal -14)
                        doc.text("NTR- N.º de tarefas realizadas", 10, ytotal -10)
                        doc.text("Acerto (%) - (NTRC/NTR)*100", 10, ytotal - 6)
                },
                willDrawCell: function (data) {
                        var rows = data.table.body;
                        if (data.row.index === rows.length - 1) {
                            doc.setFillColor(5, 179, 123);
                            doc.setTextColor(255, 255, 255)
                        }
                    },
            })
            

            doc.save(pdfName)
        
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