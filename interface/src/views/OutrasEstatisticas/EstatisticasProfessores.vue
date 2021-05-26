<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
              <v-card-title primary-title class="justify-center green--text">
                    Estatísticas Gerais - {{this.nomeEscola}}
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
                      <TotalEstatisticasMunicipios v-if="!loading" :estatisticasGerais="totalEstatisticas" :professor="true"/>
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
                      ></v-data-table>

                    </v-container>
            </v-container>
        </v-card>
      </v-container>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI
const anoletivo = require("@/config/confs").anoletivo
const anosletivos = require('@/config/confs').anosletivos
import Swal from 'sweetalert2'
import jsPDF from 'jspdf' 
import 'jspdf-autotable'
const hypatiaImg = require("@/assets/hypatiamat.png")
import TotalEstatisticasMunicipios from '@/components/Estatisticas/TotalEstatisticasMunicipios'

  export default {
    data(){
      return {
        token: "",
        loading:false,
        ano:anoletivo,
        estatisticas:[],
        anos: anosletivos,
        escolas: [],
        header_estatisticas: [
            {text: "Professor", value: 'nome', class: 'subtitle-1'},
            {text: "#Turmas", value: 'nturmas', class: 'subtitle-1'},
            {text: "#TurmasMistas", value: 'turmasmistas', class: 'subtitle-1'},
            {text: "#Alunos", value: 'nalunos', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        escola:"",
        nomeEscola: "",
        totalEstatisticas:{}
      }
    },
    components:{
      TotalEstatisticasMunicipios
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.escola = this.$route.params.escola
        if(this.$route.params.nomeEscola) this.nomeEscola = this.$route.params.nomeEscola
        else{
            var response = await axios.get(h + "escolas/" + this.escola + "?token=" + this.token)
            this.nomeEscola = response.data.nome
        }
        if(this.$route.params.ano){
            this.ano = this.$route.params.ano
        }
        this.getEstatisticas()
    },
    methods: {
      calculaTotais: async function(){
        this.totalEstatisticas = {totalTurmas: 0, totalTurmasMistas: 0, totalAlunos:0}
        for(var i = 0; i < this.estatisticas.length; i++){
          this.totalEstatisticas.totalTurmas += this.estatisticas[i].nturmas
          this.totalEstatisticas.totalTurmasMistas += this.estatisticas[i].turmasmistas
          this.totalEstatisticas.totalAlunos += this.estatisticas[i].nalunos
        }
        return true
      },
      getEstatisticas: async function(){
        this.loading = true
        if(this.anos.find(element=> element == this.ano)){
          var aux = this.ano.split("/")[0]
          var response = await axios.get(h + "escolas/" + this.escola + "/estatisticas/professores/?ano=" +  
                                           aux + "&token=" + this.token)
          this.estatisticas = response.data
          await this.calculaTotais()
        }
        this.loading = false
      },
      parseEstatisticas: async function(){
        var listaRes = []
        var total = ["Todos", 0, 0, 0]
        for(var i = 0; i<this.estatisticas.length; i++){
            var aux = [];
            aux.push(this.estatisticas[i].nome)
            aux.push(this.estatisticas[i].nturmas)
            total[1] += this.estatisticas[i].nturmas
            aux.push(this.estatisticas[i].turmasmistas)
            total[2] += this.estatisticas[i].turmasmistas
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
        var pdfName = "EstatisticasGerais-" + this.escola + ".pdf"
        doc.addImage(hypatiaImg, 'PNG', doc.internal.pageSize.getWidth() / 4, 4);
        doc.setFontSize(11)
        doc.text("Ano Letivo: " + this.ano, 15, 50)
        doc.text("Estatisticas Gerais - " + this.nomeEscola, doc.internal.pageSize.getWidth() / 2, 56, null, null, 'center')

        var listaRes = await this.parseEstatisticas()
        
        doc.autoTable({
            head: [['Professor', '#Turmas', '#TurmasMistas', '#Alunos']],
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin:{top: 65, bottom:25},
            didDrawPage: function (data) {
                    // Reseting top margin. The change will be reflected only after print the first page.
                    data.settings.margin.top = 10;
                    ytotal = doc.internal.pageSize.getHeight()
                    doc.setFontSize(8)
                    //doc.setFontType('bold'
                    doc.text("Legenda:" , 10, ytotal -18)
                    doc.text("#Turmas - N.º total de turmas existentes", 10, ytotal -14)
                    doc.text("#TurmasMistas - N.º total de turmas mistas", 10, ytotal -10)
                    doc.text("#Alunos - N.º total de alunos existentes", 10, ytotal-6)
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