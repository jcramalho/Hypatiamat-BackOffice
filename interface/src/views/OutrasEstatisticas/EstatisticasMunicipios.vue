<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
              <v-card-title primary-title class="justify-center green--text">
                    Estatísticas Gerais - Municípios
                </v-card-title>

                    <center><v-btn v-if="!loading && estatisticas.length>0" class="white--text" style="background-color: #009263;" @click="exportPDF()"> 
                      <v-icon> mdi-pdf-box </v-icon> Exportar 
                    </v-btn></center>
                    <v-container style="width:80%">
                    <v-card class="pa-5" >
                      <v-combobox
                        id="anoletivo"
                        label="Ano Letivo"
                        prepend-icon="mdi-counter"
                        v-model="ano"
                        color="#009263"
                        :items="anos"
                      ></v-combobox>
                      <v-combobox
                        id="comunidade"
                        label="Comunidade"
                        prepend-icon="mdi-google-circles-communities"
                        v-model="comunidade"
                        color="#009263"
                        :items="comunidades"
                      ></v-combobox>
                      <v-combobox
                        id="anosescolaridade"
                        label="Anos de Escolaridade"
                        prepend-icon="mdi-numeric-1-box-outline"
                        v-model="anosEscolaridadeSel"
                        color="#009263"
                        :items="anosEscolaridade"
                        item-text="texto"
                        multiple
                        chips
                        @change="changeAnosEscolaridade" 
                      ></v-combobox>
                      <v-row class="justify-center align-center">
                          <v-btn class="white--text" color="#009263" @click="getEstatisticas()">
                              <v-icon>mdi-refresh</v-icon>
                              Aplicar
                          </v-btn>
                      </v-row>
                    </v-card>
                    </v-container>
                    <v-container v-if="loading">
                      <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
                    </v-container>
                    <v-container v-else>
                      <TotalEstatisticasMunicipios v-if="!loading" :estatisticasGerais="totalEstatisticas"/>
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
import TotalEstatisticasMunicipios from '@/components/Estatisticas/TotalEstatisticasMunicipios'
const hypatiaImg = require("@/assets/hypatiamat.png")
const anosescolaridade = require('@/config/confs').anosescolaridade

  export default {
  components: { TotalEstatisticasMunicipios },
    name: 'EstatisticasMunicipios',
    data(){
      return {
        token: "",
        loading:false,
        ano:anoletivo,
        comunidades:[],
        comunidade: "Nenhuma",
        comunidadesId:[],
        estatisticas:[],
        anos: anosletivos,
        anosEscolaridade: [{ano: "Todos", texto: "Todos"}].concat(anosescolaridade),
        anosEscolaridadeSel: [{ano: "Todos", texto: "Todos"}],
        anosEscolaridadeAnt: [{ano: "Todos", texto: "Todos"}],
        escolas: [],
        header_estatisticas: [
            {text: "Município", value: 'localidade', class: 'subtitle-1',},
            {text: "#Turmas", value: 'nturmas', class: 'subtitle-1'},
            {text: "#TurmasMistas", value: 'turmasmistas', class: 'subtitle-1'},
            {text: "#Professores", value: 'nprofessores', class: 'subtitle-1'},
            {text: "#Alunos", value: 'nalunos', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        totalEstatisticas:{}
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.loading = true
        var aux = this.ano.split("/")[0]
        var response = await axios.get(h + "escolas/localidades/estatisticas/?ano=" + aux + "&token=" + this.token)
        this.estatisticas = response.data
        this.calculaTotais()
        this.loading = false
        this.parseComunidades()
    },
    methods: {
      parseComunidades: async function(){
        var response = await axios.get(h + "comunidades?token=" + this.token)
        this.comunidadesId = response.data
        var aux = ["Nenhuma"]
        for(var i = 0; i < this.comunidadesId.length; i++){
          aux.push(this.comunidadesId[i].nome)
        }
        this.comunidades = aux
      },
      changeAnosEscolaridade: function(item){
        var aux
        if(this.anosEscolaridadeSel.length == this.anosEscolaridade.length - 1) this.anosEscolaridadeSel = [{ano: "Todos", texto: "Todos"}]
        else if(this.anosEscolaridadeSel.length == 0) this.anosEscolaridadeSel = [{ano: "Todos", texto: "Todos"}]
        else if((aux = this.anosEscolaridadeAnt.find(e => e.ano == "Todos") && this.anosEscolaridadeSel.find(e => e.ano == "Todos"))) {
          var index = this.anosEscolaridadeSel.indexOf(aux)
          this.anosEscolaridadeSel.splice(index, 1)
        }
        else if(this.anosEscolaridadeSel.find(e => e.ano == "Todos")) this.anosEscolaridadeSel = [{ano: "Todos", texto: "Todos"}]
        this.anosEscolaridadeAnt = this.anosEscolaridadeSel
        //this.getEstatisticas()
      },
      parseAnosEscolaridade : function(){
        var result = []
        if(this.anosEscolaridadeSel.find(e => e.ano == "Todos")) return result
        for(var i = 0; i < this.anosEscolaridadeSel.length; i++)
          result.push(this.anosEscolaridadeSel[i].ano)
        return result
      },
      getEstatisticas: async function(){
        this.loading = true
        if(this.anos.find(element=> element == this.ano)){
          var aux = this.ano.split("/")[0]
          var anosParsed = await this.parseAnosEscolaridade()
          if(this.comunidade == "Nenhuma"){
            if(anosParsed.length == 0) var response = await axios.get(h + "escolas/localidades/estatisticas?ano=" + aux + "&token=" + this.token)
            else var response = await axios.get(h + "escolas/localidades/estatisticas?ano=" + aux + "&anosescolaridade="+ anosParsed + "&token=" + this.token)
            
            this.estatisticas = response.data
            await this.calculaTotais()
          }
          else{
            if(this.comunidade){
              var comunidadeId = this.comunidadesId.find(e => e.nome == this.comunidade)
              var response = await axios.get(h + "escolas/localidades/estatisticas?ano=" + aux + "&comunidade="+ comunidadeId.codigo + "&token=" + this.token)
              this.estatisticas = response.data
              await this.calculaTotais()
            }
          }
        }
        this.loading = false
      },
      calculaTotais: async function(){
        this.totalEstatisticas = {totalTurmas: 0, totalTurmasMistas: 0, totalProfessores:0, totalAlunos:0}
        for(var i = 0; i < this.estatisticas.length; i++){
          this.totalEstatisticas.totalTurmas += this.estatisticas[i].nturmas
          this.totalEstatisticas.totalTurmasMistas += this.estatisticas[i].turmasmistas
          this.totalEstatisticas.totalProfessores += this.estatisticas[i].nprofessores
          this.totalEstatisticas.totalAlunos += this.estatisticas[i].nalunos
        }
        return true
      },
      goToAgrupamentos: async function(item){
          var municipio = item.localidade
          this.$router.push({name: "Estatisticas Agrupamentos", params: { municipio : municipio }, query: {ano: this.ano, anosescolaridade: JSON.stringify(this.anosEscolaridadeSel)} })
      },
      parseEstatisticas: async function(){
        var listaRes = []
        var total = ["Todos",0, 0, 0, 0]
        for(var i = 0; i<this.estatisticas.length; i++){
            var aux = [];
            aux.push(this.estatisticas[i].localidade)
            aux.push(this.estatisticas[i].nturmas)
            total[1] += this.estatisticas[i].nturmas
            aux.push(this.estatisticas[i].turmasmistas)
            total[2] += this.estatisticas[i].turmasmistas
            aux.push(this.estatisticas[i].nprofessores)
            total[3] += this.estatisticas[i].nprofessores
            aux.push(this.estatisticas[i].nalunos)
            total[4] += this.estatisticas[i].nalunos
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
        doc.text("Estatisticas Gerais - Municípios", doc.internal.pageSize.getWidth() / 2, 50, null, null, 'center')
        doc.text("Ano Letivo: " + this.ano, 15, 54)
        var top = 63
        if(!this.anosEscolaridadeSel.find(e => e.ano == "Todos")){
          top = 67
          doc.text("Anos de escolaridade selecionados: ", 15, 58)
          for(var i = 0; i < this.anosEscolaridadeSel.length; i++){
            doc.text("- " + this.anosEscolaridadeSel[i].texto, 15, 62 + i*4)
            top += 4
          }
             
        }
        var listaRes = await this.parseEstatisticas()
        
        doc.autoTable({
            head: [['Município', '#Turmas', '#TurmasMistas', '#Professores', '#Alunos']],
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin:{top: top, bottom:25},
            didDrawPage: function (data) {
                    // Reseting top margin. The change will be reflected only after print the first page.
                    data.settings.margin.top = 10;
                    ytotal = doc.internal.pageSize.getHeight()
                    doc.setFontSize(8)
                    //doc.setFontType('bold'
                    doc.text("Legenda:" , 10, ytotal -22)
                    doc.text("#Turmas - N.º total de turmas existentes", 10, ytotal -18)
                    doc.text("#TurmasMistas - N.º total de turmas mistas", 10, ytotal -14)
                    doc.text("#Professores- N.º total de professores que possuem turmas", 10, ytotal-10)
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