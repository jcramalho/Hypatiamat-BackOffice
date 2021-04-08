<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
        <v-container>
            <v-card class="pa-5">
                <v-container>
                    <v-card-title primary-title class="justify-center green--text">
                        Ranking de Campeonatos Geral
                    </v-card-title>
                   
                        <center><v-btn v-if="items.length>0" class="white--text" style="background-color: #009263;" @click="exportPDF()"> <v-icon> mdi-pdf-box </v-icon> Exportar </v-btn></center>
                        <br v-if="items.length>0">
                        <center>
                        <v-container style="width:80%">
                        <v-card class="pa-5">
                            <v-combobox
                                id="campeonatos"
                                v-model="campeonato"
                                label="Campeonato"
                                item-text="descricaoBackOffice"
                                color="green"
                                :items="campeonatos"
                                @change="onCampeonatoChange"
                            ></v-combobox>
                        </v-card>
                        </v-container>
                        </center>

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
                >
                </v-data-table>
                </v-container>
                </v-container>
            </v-card>
        </v-container>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
import jsPDF from 'jspdf' 
import 'jspdf-autotable'
const h = require("@/config/hosts").hostAPI
const hostCampeonatos = require("@/config/hosts").hostCampeonatos
const hypatiaImg = require("@/assets/hypatiamat.png")

  export default {
    components:{
    },
    data(){
      return {
        token: "",
        loading: false,
        filtrar:"",
        utilizador : {},
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        headers:[
            {text: "Posição", value: 'posicao', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Pontos", value: 'pontuacao', class: 'subtitle-1'},
            {text: "Agrupamento", value: 'agrupamento', class: 'subtitle-1'},
            {text: "#Jogos", value: 'njogos', class: 'subtitle-1'},
        ],
        items:[],
        campeonatos:[],
        campeonato:"",
        show:false
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        var responseCamp = await axios.get(hostCampeonatos + "?token=" + this.token)
        this.campeonatos = responseCamp.data
    },
    methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      onCampeonatoChange: function(item){
          if(this.campeonato){
            var camp = this.campeonatos.find(e => e.campeonatoID == this.campeonato.campeonatoID)
            if(camp){
                this.atualizaEstatisticas()
                this.atualizaConteudo()
            }
            else this.campeonato = undefined
          }
      },

      atualizaConteudo: async function(){
          if(this.campeonato && this.escola && this.turmaSel && this.codprofessor){
               this.loading = true
               var response = await axios.get(hostCampeonatos + this.campeonato.campeonatoID + "/turmas/" + this.turmaSel 
                                                + "?codprofessor=" + this.codprofessor + "&escola=" + this.escola 
                                                + "&jogo=" + this.campeonato.jogo + "&token=" + this.token)
               this.items = response.data
               this.loading = false
          }
      },
      exportPDF: async function(){
        var doc = new jsPDF({
        })

        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = this.campeonato.campeonatoID + "-" + this.escola + ".pdf"

        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text(this.campeonato.descricaoBackOffice, 15, 50)
        var listaRes = []
        //var total = ["Todos", 0, 0, 0, 0, 0, 0]
        for(var i = 0; i<this.items.length; i++){
            var aux = [];
            aux.push(this.items[i].numero)
            aux.push(this.items[i].nome)
            aux.push(this.items[i].posTurma)
            aux.push(this.items[i].posEscola)
            aux.push(this.items[i].posHypatia)
            aux.push(this.items[i].pontuacao)
            aux.push(this.items[i].njogos)

            listaRes.push(aux)
        }
        doc.setFontSize(10)
        doc.autoTable({
            head: [['N.º', 'Nome', "Posição (Turma)", "Posição (Escola)", "Posição (Hypatia)", "Pontuação", "#Jogos"]],
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            styles:{fontSize:9},
            margin:{top: 65, bottom:35},
            didDrawPage: function (data) {
                    // Reseting top margin. The change will be reflected only after print the first page.
                    data.settings.margin.top = 10;
                    ytotal = doc.internal.pageSize.getHeight()
                    doc.setFontSize(8)
                    doc.text("Legenda:" , 10, ytotal -26)
                    doc.text("Nº - Número do Aluno", 10, ytotal -22)
                    doc.text("#Jogos - Número de vezes que o jogo foi jogado pelo professor", 10, ytotal - 18)
                },
            willDrawCell: function (data) {
                /*
                var rows = data.table.body;
                if (data.row.index === rows.length - 1) {
                    doc.setFillColor(5, 179, 123);
                    doc.setTextColor(255, 255, 255)
                }*/
            },
        })
        
        

        doc.save(pdfName)
       
      },
      
    }
  }
</script>