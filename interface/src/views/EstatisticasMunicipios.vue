<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
          <v-card-title primary-title class="justify-center green--text">
                Estatísticas Gerais - Municípios
            </v-card-title>

                <center><v-btn v-if="!loading && estatisticas.length>0" class="white--text" style="background-color: #009263;" @click="exportPDF()"> 
                  <v-icon> mdi-pdf-box </v-icon> Exportar 
                </v-btn></center>
                <v-combobox
                  id="anoletivo"
                  label="Ano Letivo"
                  prepend-icon="mdi-counter"
                  v-model="ano"
                  color="#009263"
                  :items="anos"
                  @change="getEstatisticas()" 
                ></v-combobox>
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
                    class="elevation-2"
                    :headers="header_estatisticas"
                    :items="estatisticas"
                    :footer-props="footer_props"
                    :search="filtrar"
                    @click:row="goToAgrupamentos"
                  ></v-data-table>

                </v-container>
        </v-container>
    </v-card>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI
const anoletivo = require("@/config/confs").anoletivo
import Swal from 'sweetalert2'
import jsPDF from 'jspdf' 
import 'jspdf-autotable'
const hypatiaImg = require("@/assets/hypatiamat.png")

  export default {
    data(){
      return {
        token: "",
        loading:false,
        ano:anoletivo,
        estatisticas:[],
        anos: ["20/21", "19/20", "18/19", "17/18", "16/17", "15/16", "14/15" ],
        escolas: [],
        header_estatisticas: [
            {text: "Município", value: 'localidade', class: 'subtitle-1',},
            {text: "#Turmas", value: 'nturmas', class: 'subtitle-1'},
            {text: "#Professores", value: 'nprofessores', class: 'subtitle-1'},
            {text: "#Alunos", value: 'nalunos', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.loading = true
        var response = await axios.get(h + "escolas/localidades/estatisticas/?ano=20&token=" + this.token)
        this.estatisticas = response.data
        this.loading = false
    },
    methods: {
      getEstatisticas: async function(){
        this.loading = true
        if(this.anos.find(element=> element == this.ano)){
          var aux = this.ano.split("/")[0]
          var response = await axios.get(h + "escolas/localidades/estatisticas?ano=" + aux + "&token=" + this.token)
          this.estatisticas = response.data
        }
        this.loading = false
      },
      goToAgrupamentos: async function(item){
          var municipio = item.localidade
          this.$router.push({name: "Estatisticas Agrupamentos", params: { municipio : municipio, ano: this.ano } })
      },
      parseEstatisticas: async function(){
        var listaRes = []
        var total = ["Todos", 0, 0, 0]
        for(var i = 0; i<this.estatisticas.length; i++){
            var aux = [];
            aux.push(this.estatisticas[i].localidade)
            aux.push(this.estatisticas[i].nturmas)
            total[1] += this.estatisticas[i].nturmas
            aux.push(this.estatisticas[i].nprofessores)
            total[2] += this.estatisticas[i].nprofessores
            aux.push(this.estatisticas[i].nalunos)
            total[3] += this.estatisticas[i].nalunos

            listaRes.push(aux)
        }
        listaRes.push(total)
        return listaRes
      },
      exportPDF: async function(){
        var doc = new jsPDF({})
        var ytotal = 0

        // nome do PDF e algumas informacoes sobre o relatório gerado
        var pdfName = "EstatisticasGerais-Municípios.pdf"
        doc.addImage(hypatiaImg, 'PNG', doc.internal.pageSize.getWidth() / 4, 4);
        doc.setFontSize(11)
        doc.text("Ano Letivo: " + this.ano, 15, 50)
        doc.text("Estatisticas Gerais - Municípios", doc.internal.pageSize.getWidth() / 2, 56, null, null, 'center')

        var listaRes = await this.parseEstatisticas()
        
        doc.autoTable({
            head: [['Município', '#Turmas', '#Professores', '#Alunos']],
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin:{top: 65, bottom:20},
            didDrawPage: function (data) {
                    // Reseting top margin. The change will be reflected only after print the first page.
                    data.settings.margin.top = 10;
                    ytotal = doc.internal.pageSize.getHeight()
                    doc.setFontSize(8)
                    //doc.setFontType('bold'
                    doc.text("Legenda:" , 10, ytotal -18)
                    doc.text("#Turmas - N.º de turmas existentes", 10, ytotal -14)
                    doc.text("#Professores- N.º de professores existentes", 10, ytotal-10)
                    doc.text("#Alunos - N.º de alunos existentes", 10, ytotal-6)
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
      }
 

    }
  }
</script>