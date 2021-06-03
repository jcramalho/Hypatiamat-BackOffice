<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
        <v-container>
            <v-card class="pa-5">
                <v-container>
                    <v-card-title primary-title class="justify-center green--text">
                        Monitorização de Campeonatos por Turmas ({{this.codprofessor}})
                    </v-card-title>
                    <center>
                        <v-btn v-if="!show" text @click="show=!show"><span>Mostrar Ajuda</span><v-icon color="#009263"> mdi-help-circle </v-icon> </v-btn>
                        <v-btn v-else text @click="show=!show">Esconder Ajuda</v-btn> 
                    </center>
                    <v-slide-y-transition>
                        <v-card v-show="show" class="elevation-6 pa-3" style="border: 2px solid green !important;" color="grey lighten-3">
                            <v-row class="justify-center">
                                <v-col cols="12">
                                <span> 1. Selecione a turma sobre a qual quer ver o desempenho.</span>
                                </v-col>
                                <v-col cols="12">
                                    <span> 2. Selecione o campeonato do qual pretende averiguar o desempenho dos seus alunos através do campo "Campeonato". 
                                        Apenas serão disponibilizados os campeonatos em que a sua turma participou.
                                    </span>
                                </v-col>
                                <v-col cols="12">
                                    <span> 3. Estando os dois primeiros passos realizados, poderá visualizar os dados de cada aluno da turma inscrito no campeonato. </span> 
                                </v-col>
                                <v-col cols="12">
                                    <span> 4. Caso os certificados se encontrem disponíveis, pode obter o certificado através do clique no botão 
                                        <v-btn class="text-none white--text" rounded small color="#009263">
                                            <v-icon color="white"> mdi-download </v-icon> Certificado
                                        </v-btn>. </span> 
                                </v-col>
                                <v-col cols="9">
                                    <v-card class="mx-auto" color="grey lighten-4">
                                        <center> <h3 class="green--text"> Legenda da Tabela: </h3> </center>
                                        <ul> 
                                            <li> <span> <b>Posição (Turma)</b> - Posição do aluno na turma. </span> </li>
                                            <li> <span> <b>Posição (Agr. Escolas)</b> - Posição do aluno no Agrupamento de Escolas. </span> </li>
                                            <li> <span> <b>Posição (Hypatia)</b> - Posição do aluno em todo o campeonato Hypatiamat. </span> </li>
                                            <li> <span> <b>Pontuação</b> - Melhor pontuação obtida pelo aluno no campeonato. </span> </li>
                                            <li> <span> <b>#Jogos</b> - Nº de vezes que o aluno jogou no campeonato. </span> </li>
                                        </ul>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-slide-y-transition>
                        <center><v-btn v-if="items.length>0" class="white--text" style="background-color: #009263;" @click="exportPDF()"> <v-icon> mdi-pdf-box </v-icon> Exportar </v-btn></center>
                        <br v-if="items.length>0">
                        <center>
                        <v-container style="width:80%">
                        <v-card class="pa-5">
                            <v-combobox
                                id="turmas"
                                v-model="turmaSel"
                                label="Turma"
                                color="green"
                                :items="turmas"
                                @change="onTurmaChange"
                            ></v-combobox>
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
                        <br>
                        <div v-if="campeonato">
                        <center><span v-if="this.estatisticasGerais"> <b>Neste campeonato:</b></span></center>
                        <EstatisticasGeraisCampeonato v-if="this.estatisticasGerais" :estatisticasGerais="this.estatisticasGerais"/>
                        <center><span v-if="this.estastisticasMunicipio"> <b> Neste campeonato em {{this.municipio}}: </b> </span> </center>
                        <CampeonatoMunicipio v-if="this.estastisticasMunicipio" :estatisticasGerais="this.estastisticasMunicipio"/>
                        <center><span v-if="this.estatisticasAgrupamento"> <b> Neste campeonato no seu Agrupamento de Escolas: </b> </span> </center>
                        <CampeonatoAgrupamento v-if="this.estatisticasAgrupamento" :estatisticasGerais="this.estatisticasAgrupamento"/>
                        </div>
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
                    <template v-slot:item="row">
                        <tr>
                            <td>{{row.item.numero}}</td>
                            <td>{{row.item.nome}}</td>
                            <td>{{row.item.posTurma}}</td>
                            <td>{{row.item.posEscola}}</td>
                            <td>{{row.item.posHypatia}}</td>
                            <td>{{row.item.pontuacao}}</td>
                            <td>{{row.item.njogos}}</td>
                            <td>
                                <v-btn class="text-none white--text" rounded small color="#009263" @click="download(row.item.posHypatia, row.item.user)" :disabled="utilizador.type == 5">
                                    <v-icon color="white"> mdi-download </v-icon> Certificado
                                </v-btn>
                            </td>

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
import Swal from 'sweetalert2'
import 'jspdf-autotable'
import EstatisticasGeraisCampeonato from '@/components/Campeonatos/EstatisticasGeraisCampeonato.vue'
import CampeonatoMunicipio from '@/components/Campeonatos/CampeonatoMunicipio.vue'
import CampeonatoAgrupamento from '@/components/Campeonatos/CampeonatoAgrupamento.vue'
const h = require("@/config/hosts").hostAPI
const hostCampeonatos = require("@/config/hosts").hostCampeonatos
const hypatiaImg = require("@/assets/hypatiamat.png")

  export default {
    components:{
         EstatisticasGeraisCampeonato,
         CampeonatoMunicipio,
         CampeonatoAgrupamento
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
            {text: "Certificado", class: 'subtitle-1'}
        ],
        items:[],
        campeonatos:[],
        campeonato:"",
        escola: "",
        escolaOriginal: "",
        estatisticasGerais: undefined,
        estastisticasMunicipio: undefined,
        estatisticasAgrupamento: undefined,
        municipio:"",
        turmaSel: "",
        turmas:[],
        show:false,
        nomeProf:""
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.codprofessor = this.$route.params.codprofessor 
        if(this.$route.params.campeonato && this.$route.params.municipio && this.$route.params.escola){
            this.campeonato = this.$route.params.campeonato
            this.municipio = this.$route.params.municipio
            this.escola = this.escolaOriginal = this.$route.params.escola
        } 
        else{
            if(this.utilizador.type != 20){
                var response2 = await axios.get(h + "professores/codigos/" + this.codprofessor + "/?token=" + this.token )
                this.nomeProf = response2.data.nome
                this.escola = response2.data.escola
                this.escolaOriginal = response2.data.escola
                
           }
           else this.escola = this.escolaOriginal = this.utilizador.escola
        } 
        var response3 = await axios.get(h + "escolas/" + this.escola + "/?token=" + this.token )
        this.municipio = response3.data.localidade
        var response = await axios.get(h + "professores/" + this.codprofessor + "/turmas?token=" + this.token)
        var i = 0
        for(i = 0; i < response.data.length; i++){
          this.turmas.push(response.data[i].turma)
        }
        this.atualizaCampeonatos()
        this.onCampeonatoChange()  
        if(!response2){
            var response2 = await axios.get(h + "professores/codigos/" + this.codprofessor + "/?token=" + this.token )
            this.nomeProf = response2.data.nome
        }
    },
    methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      atualizaCampeonatos: async function(){
          if(this.turmaSel && this.turmaSel != ''){
            var response = await axios.get(hostCampeonatos + "turmas/" + this.turmaSel + "/campeonatos/?codprofessor=" + this.codprofessor + "&token=" + this.token)
            this.campeonatos = response.data
            this.onCampeonatoChange()
          }
      },
      onCampeonatoChange: function(item){
          if(this.campeonato){
            var camp = this.campeonatos.find(e => e.campeonatoID == this.campeonato.campeonatoID)
            this.campeonato = camp
            if(camp){
                this.atualizaEstatisticas()
                this.atualizaConteudo()
            }
            else this.campeonato = undefined
          }
      },
      onTurmaChange: async function(item){
          if(this.turmaSel != "" && this.turmaSel){
            this.escola = this.escolaOriginal
            var responseAlunos = await axios.get(h + "turmas/" + this.turmaSel + 
                                                    "/alunos?codprofessor=" + this.codprofessor
                                                    + "&token=" + this.token)

            var escolas = []
            for(var i = 0; i < responseAlunos.data.length; i++){
                    var auxEscola = escolas.find(a => a.escola == responseAlunos.data[i].escola)
                    if(auxEscola) auxEscola.numero++;
                    else escolas.push({escola: responseAlunos.data[i].escola, numero:1})
            }
            if(escolas.length > 1){
                var res = Math.max.apply(Math, escolas.map(function(o){return o.numero;}))
                var escolaAux = escolas.find(function(o){ return o.numero == res; })
                if(escolaAux && escolaAux.escola != this.escola) this.escola = escolaAux.escola;
            }
                                                        
            this.items = []

            await this.atualizaCampeonatos()
          }
      },
      atualizaEstatisticas: async function(){
          this.estatisticasGerais = await this.atualizaEstatisticasGerais()
          this.estastisticasMunicipio = await this.atualizaEstatisticasGeraisMunicipio()
          this.estatisticasAgrupamento = await this.atualizaEstatisticasGeraisAgrupamento()
      },
      atualizaEstatisticasGeraisMunicipio: async function(){
        if(this.campeonato){
            var response = await axios.get(hostCampeonatos + this.campeonato.campeonatoID + "/municipios/" + this.municipio +"/gerais?token=" + this.token)
        }
        return response.data
      },
      atualizaEstatisticasGeraisAgrupamento: async function(){
        if(this.campeonato){
            var response = await axios.get(hostCampeonatos + this.campeonato.campeonatoID + "/escolas/" + this.escola +"/gerais?token=" + this.token)
            return response.data
        }
      },
      atualizaEstatisticasGerais: async function(){
          if(this.campeonato){
            var response = await axios.get(hostCampeonatos + this.campeonato.campeonatoID + "/municipios/gerais?token=" + this.token)
            return response.data
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
        doc.text("Professor: " + this.nomeProf, 15, 56)
        doc.text("Turma: " + this.turmaSel, 130, 56)
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
      download: async function(posicao, user){
         if(posicao > 11) var posFinal = 11
         else var posFinal = posicao
         var response1 = await axios.get(hostCampeonatos + this.campeonato.campeonatoID + "/certificados/nome?jogo=" + this.campeonato.jogo + 
                        "&posicao=" + posFinal + "&user=" + user + "&token=" + this.token) 
         if(response1.data){
            var nome = response1.data.ficheiro
            axios({
                method: "get",
                url: hostCampeonatos + this.campeonato.campeonatoID + "/certificados/download?jogo=" + this.campeonato.jogo + 
                            "&posicao=" + posFinal + "&user=" + user + "&token=" + this.token,
                responseType: 'arraybuffer'
            })
                .then(function (response) {
                        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                        var fileLink = document.createElement('a');
                        fileLink.href = fileURL;
                        console.log(response)
                        fileLink.setAttribute('download', nome);
                        document.body.appendChild(fileLink);
                        fileLink.click();
                    })
                .catch(erro => {console.log("DEUUUU ERROOOOO "); console.log(erro.response)})
         }
         else Swal.fire({
            icon: 'error',
            text: 'Pedimos desculpa, mas o certificado ainda não se encontra disponível.',
            confirmButtonColor: '#009263'
          })
      },
    }
  }
</script>