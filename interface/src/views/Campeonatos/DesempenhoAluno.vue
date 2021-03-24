<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
        <v-container>
            <v-card class="pa-5">
                <v-container>
                    <center><v-icon large color="#009263">mdi-podium</v-icon></center>
                    <v-card-title primary-title class="justify-center green--text">
                        Campeonatos
                    </v-card-title>
                        <v-container style="width:70%">
                        <ClassificacaoAluno :posicoes="desempenhoUltimo"/>
                        </v-container>

                        <center>
                        <v-container style="width:80%">
                            <v-card class="pa-5">
                                <v-combobox
                                    id="campeonatos"
                                    v-model="campeonato"
                                    label="Campeonato"
                                    color="#009263"
                                    item-text="descricaoBackOffice"
                                    :items="campeonatos"
                                    @change="onCampeonatoChange"
                                ></v-combobox>
                            </v-card>
                        </v-container>
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
                                color="#009263"
                            >
                                <template v-slot:item="row">
                                    <tr :class="row.item.user==userAluno ? 'style-positivo' : 'none'" >
                                        <td>{{row.item.numero}}</td>
                                        <td>{{row.item.nome}}</td>
                                        <td>{{row.item.posTurma}}</td>
                                        <td>{{row.item.posEscola}}</td>
                                        <td>{{row.item.posHypatia}}</td>
                                        <td>{{row.item.pontuacao}}</td>
                                        <td>{{row.item.njogos}}</td>
                                    </tr>
                                </template>
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
import ClassificacaoAluno from '@/components/Campeonatos/ClassificacaoAluno.vue'
const h = require("@/config/hosts").hostAPI
const hostCampeonatos = require("@/config/hosts").hostCampeonatos
const hypatiaImg = require("@/assets/hypatiamat.png")

  export default {
    components:{
         ClassificacaoAluno
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
            {text: "Número", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Posição (Turma)", value: 'posTurma', class: 'subtitle-1'},
            {text: "Posição (Agr. Escolas)", value: 'posEscola', class: 'subtitle-1'},
            {text: "Posição (Hypatia)", value: 'posHypatia', class: 'subtitle-1'},
            {text: "Pontuação", value: 'pontuacao', class: 'subtitle-1'},
            {text: "#Jogos", value: 'njogos', class: 'subtitle-1'},
        ],
        items:[],
        campeonatos:[],
        campeonato:"",
        show:false,
        userAluno: "",
        ultimoCampeonato:{},
        desempenhoUltimo:{posTurma: "-", posEscola: "-", posHypatia: "-", pontuacao: 0}
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.escola = this.utilizador.escola
        this.userAluno = this.$route.params.user 
        this.getCampeonatos()
        this.calculaUltimoCampeonato()
        //this.onCampeonatoChange()  
    },
    methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      getCampeonatos: async function(){
        var responseCamp = await axios.get(hostCampeonatos + "alunos/" + this.userAluno + "/campeonatos?token=" + this.token)
        this.campeonatos = responseCamp.data 
      },
      calculaUltimoCampeonato: async function(){
        var ultimo = await axios.get(hostCampeonatos + "alunos/" + this.userAluno + "/ultimocampeonato?token=" + this.token)
        this.ultimoCampeonato = ultimo.data
        if(this.ultimoCampeonato){
            var response = await axios.get(hostCampeonatos + this.ultimoCampeonato.campeonatoID + "/alunos/" + this.userAluno
                                        + "?jogo=" + this.ultimoCampeonato.jogo + "&codprofessor=" + this.ultimoCampeonato.codprofessor
                                        + "&turma=" + this.ultimoCampeonato.turma + "&escola=" + this.utilizador.escola + "&token=" + this.token)
            if(response.data) {
                this.desempenhoUltimo = response.data
            }
        } 
      },
      
      onCampeonatoChange: async function(item){
          var camp = this.campeonatos.find(e => e.campeonatoID == this.campeonato.campeonatoID)
          if(camp){
            this.loading = true
            var response = await axios.get(hostCampeonatos + this.campeonato.campeonatoID + "/turmas/" + this.campeonato.turma  
                                            + "?codprofessor=" + this.campeonato.codprofessor  + "&escola=" + this.utilizador.escola +
                                            "&jogo=" + this.campeonato.jogo + "&token=" + this.token)
            this.items = response.data
            this.loading = false
          }
      },
      exportPDF: async function(){
        var doc = new jsPDF({
        })

        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = this.campeonato + "-" + this.escola + ".pdf"

        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text(this.campeonato, 15, 50)
        doc.text(this.nomeEscola, 15, 55)
        var listaRes = []
        //var total = ["Todos", 0, 0, 0, 0, 0, 0]
        for(var i = 0; i<this.items.length; i++){
            var aux = [];
            aux.push(this.items[i].nome)
            if(this.items[i].jogo == 0) aux.push("ADD (1.º)")
            else if(this.items[i].jogo == 1) aux.push("ADD (2.º)")
            else if(this.items[i].jogo == 2) aux.push("SAM (2.º)")
            else if(this.items[i].jogo == 3) aux.push("SAM (3.º)")
            else if(this.items[i].jogo == 4) aux.push("SAMD (3.º)")
            else if(this.items[i].jogo == 5) aux.push("SAMD (4.º)")
            else if(this.items[i].jogo == 6) aux.push("SAMD (5/6.º)")
            else if(this.items[i].jogo == 7) aux.push("SAMD (7/8/9.º)")
            else if(this.items[i].jogo == 8) aux.push("SUBADD (1.º)")
            else aux.push("SUBADD (2.º)")
            aux.push(this.items[i].max)
            aux.push(this.items[i].min)
            aux.push(this.items[i].media)
            aux.push(this.items[i].njogos)
            aux.push(this.items[i].nusers)
            aux.push(this.items[i].jogosAluno)

            listaRes.push(aux)
        }
        doc.setFontSize(10)
        doc.autoTable({
            head: [['Professor', 'Jogo', "Max", "Min", "Média", "#Jogos", "#Alunos", '#J/#A']],
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
                    doc.text("Max - Máximo de pontuação obtida pelo professor no jogo do campeonato", 10, ytotal -22)
                    doc.text("Min - Mínimo de pontuação obtida pelo professor no jogo do campeonato", 10, ytotal -18)
                    doc.text("#Jogos - Número de vezes que o jogo foi jogado pelo professor", 10, ytotal - 14)
                    doc.text("#Alunos - Número de alunos do professor que participaram naquele jogo do campeonato", 10, ytotal -10)
                    doc.text("#J/#A - Número médio de vezes que um aluno do professor jogou", 10, ytotal-6)
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

<style >
.style-positivo {
  background-color: #10de16
}
</style>