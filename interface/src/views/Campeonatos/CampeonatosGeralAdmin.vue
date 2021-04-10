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
                            <v-combobox
                                v-if="jogosCampeonato"
                                id="jogosCampeonato"
                                v-model="jogoSel"
                                label="Jogos do Campeonato"
                                item-text="texto"
                                color="green"
                                :items="jogosCampeonato"
                                @change="onJogoChange"
                            ></v-combobox>
                        </v-card>
                        </v-container>
                        </center>

                <v-container v-if="loading">
                    <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
                </v-container>
                <v-container v-else>
                    <center v-if="certificados.length > 0">
                        <v-btn v-if="!showCertificados" text @click="showCertificados=!showCertificados">
                            <span>Mostrar Certificados</span><v-icon color="#009263"> mdi-certificate-outline </v-icon> 
                        </v-btn>
                        <v-btn v-else text @click="showCertificados=!showCertificados">Esconder Certificados</v-btn> 
                    </center>
                    <v-slide-y-transition>
                        <v-list v-show="showCertificados">
                            <v-list-item v-for="(certificado,index) in certificados" v-bind:key="index">
                                <v-list-item-content>
                                <v-card class="pa-1" outlined color="green lighten-3">
                                    <v-row class="align-center">
                                        <v-col cols="3">
                                            <span>Posição <b>{{certificado.posicao}}</b></span>
                                        </v-col>
                                        <v-col cols="5">
                                            <div v-if="certificado.ficheiro">
                                                <v-btn class="text-none" rounded @click="download(certificado)">
                                                    <v-icon color="black"> mdi-download </v-icon> {{certificado.ficheiro}}
                                                </v-btn>
                                            </div>
                                            <div v-else>Sem certificado</div>
                                        </v-col>
                                        <v-col cols="4">
                                            <div class="d-flex">
                                                <v-btn
                                                    color="green"
                                                    class="text-none"
                                                    rounded
                                                    @click="onButtonClick(index)"
                                                >
                                                    <v-icon left>mdi-cloud-upload-outline</v-icon> 
                                                    <span v-if="certificados[index].selectedFile">C.Carregado</span>
                                                    <span v-else>Carregar</span> 
                                                </v-btn>
                                                <input
                                                    ref="uploader"
                                                    class="d-none"
                                                    type="file"
                                                    @change="onFileChanged($event, index)"
                                                >
                                                <v-btn rounded 
                                                    v-if="certificado.selectedFile" 
                                                    color="white" 
                                                    class="text-none"
                                                    @click="postFile(index)">  <v-icon>mdi-check</v-icon>
                                                </v-btn>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-card>
                                </v-list-item-content>
                            </v-list-item> 
                        </v-list>
                    </v-slide-y-transition>
                    <br v-if="certificados.length > 0 && showCertificados">
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
                    <template v-slot:item="row">
                        <tr>
                            <td>{{row.item.posicao}}</td>
                            <td>{{row.item.nome}}</td>
                            <td>{{row.item.pontuacao}}</td>
                            <td>{{row.item.agrupamento}}</td>
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
           // {text: "Certificado", class: 'subtitle-1'}
        ],
        items:[],
        campeonatos:[],
        certificados:[],
        campeonato:"",
        jogosCampeonato: undefined,
        jogoSel: "",
        showCertificados: false,
        selectedFile: ""
      }
    },
    computed:{

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
      onButtonClick(index) {
            this.$refs.uploader[index].click()
      },
      onFileChanged(e, index) {
            var aux = this.certificados[index]
            aux.selectedFile = e.target.files[0]
            this.$set(this.certificados, index, aux)
      },
      postFile(index){
          var certificado = this.certificados[index]
          if(certificado.selectedFile){
              let formData = new FormData();
              formData.append("file", certificado.selectedFile);
              axios.post(hostCampeonatos + this.campeonato.cod + '/certificados?jogo=' + this.jogoSel.jogo + 
                                "&posicao=" + certificado.posicao + "&token=" + this.token, formData, {headers: {'Content-Type': 'multipart/form-data'}})
                                
                    .then(response => {
                        console.log('Ficheiro inserido')
                        console.log(response.data)
                        this.$set(this.certificados, index, response.data)
                    })
                    .catch(erro => console.log(erro))
          }
      },
      download: function(certificado){
         axios({
            method: "get",
            url: hostCampeonatos + this.campeonato.cod + "/certificados/download?jogo=" + this.jogoSel.jogo + 
                        "&posicao=" + certificado.posicao + "&token=" + this.token,
            responseType: 'arraybuffer'
          })
             .then(function (response) {
                     var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                     var fileLink = document.createElement('a');
                     fileLink.href = fileURL;
                     fileLink.setAttribute('download', certificado.ficheiro);
                     document.body.appendChild(fileLink);
                     fileLink.click();
                })
      },
      onCampeonatoChange: async function(item){
          if(this.campeonato){
            var camp = this.campeonatos.find(e => e.cod == this.campeonato.cod)
            if(camp){
                var response = await axios.get(hostCampeonatos + this.campeonato.cod + "/jogos?token=" + this.token)
                this.jogosCampeonato = response.data
                this.jogoSel = ""
            }
            else this.campeonato = undefined
          }
      },
      onJogoChange: function(item){
          if(this.jogosCampeonato.find(e => e == this.jogoSel)){
              this.atualizaConteudo()
          }
          else this.jogoSel = undefined
      },
      atualizaFicheiros: async function(){         
         var response = await axios.get(hostCampeonatos + this.campeonato.cod + "/certificados?jogo=" + this.jogoSel.jogo + "&token=" + this.token)
         var aux = response.data
         for(var i = 0; i < this.items.length && i <= 10; i++){
             if(!aux.find(e => e.posicao == i+1)) aux.push({posicao: i+1, ficheiro: null})
         }
         this.certificados = aux
         return true 
      },
      atualizaConteudo: async function(){
          if(this.campeonato && this.jogoSel){
               this.loading = true
               var response = await axios.get(hostCampeonatos + this.campeonato.cod + "/rankingGeral?jogo="
                                                + this.jogoSel.jogo + "&token=" + this.token)
               
               this.items = response.data
               await this.atualizaFicheiros()
               this.loading = false
          }
      },
      exportPDF: async function(){
        var doc = new jsPDF({
        })

        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = this.campeonato.cod + "-" + this.jogoSel.texto + ".pdf"

        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        doc.text(this.campeonato.descricaoBackOffice, 15, 50)
        doc.text(this.jogoSel.texto, 15, 60)
        var listaRes = []
        //var total = ["Todos", 0, 0, 0, 0, 0, 0]
        for(var i = 0; i<this.items.length; i++){
            var aux = [];
            aux.push(this.items[i].nome)
            aux.push(this.items[i].posicao)
            aux.push(this.items[i].pontuacao)
            aux.push(this.items[i].agrupamento)
            aux.push(this.items[i].njogos)

            listaRes.push(aux)
        }
        doc.setFontSize(10)
        doc.autoTable({
            head: [['Posição', 'Nome', "Pontos", "Agrupamento", "#Jogos"]],
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            styles:{fontSize:9},
            margin:{top: 70, bottom:35},
            didDrawPage: function (data) {
                    // Reseting top margin. The change will be reflected only after print the first page.
                    data.settings.margin.top = 10;
                    
            },
        })
        
        

        doc.save(pdfName)
       
      },
      
    }
  }
</script>