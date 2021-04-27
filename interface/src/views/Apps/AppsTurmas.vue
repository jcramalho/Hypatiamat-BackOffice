<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
        <v-container>
            <v-card class="pa-5">
                <v-container>
                    <v-card-title primary-title class="justify-center green--text">
                        Monitorização de Apps por turmas do professor ({{this.codProf}})
                    </v-card-title>
                    <center><v-btn v-if="items.length>0" class="white--text" style="background-color: #009263;" @click="exportPDF()"> <v-icon> mdi-pdf-box </v-icon> Exportar </v-btn></center>
                    <br>
                    <center>
                        <v-btn v-if="!show" text @click="show=!show"><span>Mostrar Ajuda</span><v-icon color="#009263"> mdi-help-circle </v-icon> </v-btn>
                        <v-btn v-else text @click="show=!show">Esconder Ajuda</v-btn> 
                    </center>
                    <v-slide-y-transition>
                      <v-card v-show="show" class="elevation-6 pa-3" style="border: 2px solid green !important;" color="grey lighten-3">
                        <v-row class="justify-center">
                          <v-col cols="12">
                          <span> 1. Pode escolher uma das suas turmas através da seleção no campo "Turma". </span>
                          </v-col>
                          <v-col cols="12">
                            <span> 2. Escolher a aplicação de conteúdo sobre o qual deseja visualizar dados estatísticos de cada um dos seus alunos que a fez. As aplicações disponíveis
                            para a monitorização são aquelas que a turma selecionada fez no intervalo de tempo definido. </span>
                          </v-col>
                          <v-col cols="12">
                            <span> 3. Pode alterar o intervalo de tempo pretendido, selecionando uma data inicial diferente e/ou uma data final diferente. </span> 
                          </v-col>
                          <v-col cols="12">
                            <span> 4. Caso pretenda uma monitorização sobre um ano letivo específico, pode selecionar o ano letivo pretendido. </span> 
                          </v-col>
                          <v-col cols="12">
                            <span> 5. Tendo os campos referidos escolhidos e tendo os dados apresentados, poderá exportar para pdf através do botão 
                                <v-btn small class="white--text" style="background-color: #009263;"> <v-icon> mdi-pdf-box </v-icon> Exportar </v-btn>. 
                            </span> 
                          </v-col>
                          <v-col cols="9">
                              <v-card class="mx-auto" color="grey lighten-4">
                                  <center> <h3 class="green--text"> Legenda da Tabela: </h3> </center>
                                  <ul> 
                                      <li> <span> <b>N.º</b> - Número do aluno; </span> </li>
                                      <li> <span> <b>NTRC</b> - Número de tarefas resolvidas corretamente; </span> </li>
                                      <li> <span> <b>NTR</b> - Número de tarefas resolvidas; </span> </li>
                                      <li> <span> <b>Acerto(%)</b> - Percentagem de acerto (NTRC/NTR); </span> </li>
                                      <li> <span> <b>DP</b> - Dentro do período escolar; </span> </li>
                                      <li> <span> <b>FP</b> - Fora do período escolar; </span> </li>
                                      <li> <span> <b>#</b> - Frequência. </span> </li>
                                  </ul>
                              </v-card>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-slide-y-transition>
                        <br v-if="items.length>0">
                        <center>
                        <v-container style="width:80%">
                        <v-card class="pa-5" >
                            <v-combobox
                                id="turmas"
                                v-model="turmaSel"
                                label="Turma"
                                color="green"
                                :items="turmas"
                                @change="onTurmaChange"
                            ></v-combobox>
                            <v-row v-if="apps" class="align-center">
                                <v-col cols="11">
                                    <v-combobox
                                        id="apps"
                                        v-model="app"
                                        label="App"
                                        color="green"
                                        :items="apps"
                                        @change="onAppChange"
                                    ></v-combobox>
                                </v-col>
                                <v-col v-if="turmaSel && turmaSel != ''" cols="1">
                                    <v-btn icon color="#009263" @click="atualizaApps()">
                                        <v-icon>mdi-refresh</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-combobox
                                id="anos"
                                v-model="anoLetivo"
                                label="Ano Letivo"
                                color="green"
                                :items="anosLetivos"
                                @change="onAnoChange"
                            ></v-combobox>
                            <v-layout row class="text-xs-center" justify-center align-center>
                                <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                                <v-text-field @change="onDataInChange" v-model="dataInicio" label="Data Inicio" type="date" :format="format" required></v-text-field>
                                </v-col>
                                <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                                    <v-text-field @change="onDataFimChange" v-model="dataFim" label="Data Fim" type="date" :format="format" required></v-text-field>
                                </v-col>
                            </v-layout>
                            <v-layout row class="text-xs-center" justify-center align-center>
                                <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                                <v-text-field @change="onHorarioInChange" v-model="horaInicio" label="Hora Inicio" type="time" :format="format" required></v-text-field>
                                </v-col>
                                <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                                    <v-text-field @change="onHorarioFimChange" v-model="horaFim" label="Hora Fim" type="time" :format="format" required></v-text-field>
                                </v-col>
                            </v-layout>
                            <v-row v-if="items.length > 0" class="justify-center align-center">
                                <v-btn class="white--text" color="#009263" @click="atualizaConteudo()">
                                    <v-icon>mdi-refresh</v-icon>
                                    Atualizar
                                </v-btn>
                            </v-row>
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
                >
                    <template v-slot:item="row">
                        <tr :class="row.item.acerto>=50 ? 'style-positivo' : 'style-negativo'">
                            <td>{{row.item.numero}}</td>
                            <td>{{row.item.nome}}</td>
                            <td>{{row.item.ncertas}}</td>
                            <td>{{row.item.ntotal}}</td>
                            <td>{{row.item.acerto}}</td>
                            <td>{{row.item.onpeak}}</td>
                            <td>{{row.item.offpeak}}</td>
                            <td>{{row.item.frequencia}}</td>
                            <td v-if="appTarefa"><v-icon color="grey-lighten-1" @click="showTarefas(row.item)">mdi-eye</v-icon></td>
                        </tr>
                    </template>
                </v-data-table>
                <v-dialog v-model="dialogTarefas" width="75%">
                    <TarefasApps v-if="dialogTarefas" :propsTarefas="propsTarefas"/>
                </v-dialog>
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
import domtoimage from "dom-to-image";
import 'jspdf-autotable'
import html2canvas from "html2canvas";
import TarefasApps from "@/components/Apps/TarefasRealizadas.vue"

const h = require("@/config/hosts").hostAPI
const hostApps = require("@/config/hosts").hostApps
const hypatiaImg = require("@/assets/hypatiamat.png")
const anosletivos2 = require("@/config/confs").anosletivos2
const anoletivoAtual = require("@/config/confs").anoletivo2


  export default {
    components:{
        TarefasApps
    },
    data(){
      return {
        token: "",
        loading: false,
        app:"",
        appTarefa: undefined,
        filtrar:"",
        dataInicio: "2019-09-01",
        dataFim: "2020-09-01",
        horaInicio: "00:00",
        horaFim:"23:59",
        turmaSel: "",
        utilizador : {},
        alunos:[],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        anosLetivos:anosletivos2,
        anoLetivo: anoletivoAtual,
        apps:[],
        appsInfo:[],
        appsComTarefas: [],
        headers:[
            {text: "N.º", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "NTRC", value: 'ncertas', class: 'subtitle-1'},
            {text: "NTR", value: 'ntotal', class: 'subtitle-1'},
            {text: "Acerto(%)", value: 'acerto', class: 'subtitle-1'},
            {text: "DP", value: 'onpeak', class: 'subtitle-1'},
            {text: "FP", value: 'offpeak', class: 'subtitle-1'},
            {text: "#", value:'frequencia', class:"subtitle-1"}
        ],
        headersApps:[
            {text: "N.º", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "NTRC", value: 'ncertas', class: 'subtitle-1'},
            {text: "NTR", value: 'ntotal', class: 'subtitle-1'},
            {text: "Acerto(%)", value: 'acerto', class: 'subtitle-1'},
            {text: "DP", value: 'onpeak', class: 'subtitle-1'},
            {text: "FP", value: 'offpeak', class: 'subtitle-1'},
            {text: "#", value:'frequencia', class:"subtitle-1"}
        ],
        headersTarefas:[
            {text: "N.º", value: 'numero', class: 'subtitle-1'},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "NTRC", value: 'ncertas', class: 'subtitle-1'},
            {text: "NTR", value: 'ntotal', class: 'subtitle-1'},
            {text: "Acerto(%)", value: 'acerto', class: 'subtitle-1'},
            {text: "DP", value: 'onpeak', class: 'subtitle-1'},
            {text: "FP", value: 'offpeak', class: 'subtitle-1'},
            {text: "#", value:'frequencia', class:"subtitle-1"},
            {text: "Ver", class:"subtitle-1"}
        ],
        items:[],
        codProf:"",
        turmas:[],
        turmaSel:"",
        show: false,
        nomeProf:"",
        propsTarefas: undefined,
        dialogTarefas: false,
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        this.codProf = this.$route.params.idprofessor
        var response = await axios.get(hostApps + "temas/?token=" + this.token)
        this.appsInfo = response.data
        var responseT = await axios.get(hostApps + "tarefas/?token=" + this.token)
        this.appsComTarefas = responseT.data
        this.parseApps()

        var response = await axios.get(h + "professores/" + this.codProf + "/turmas?token=" + this.token)
        var i = 0
        for(i = 0; i < response.data.length; i++){
          this.turmas.push(response.data[i].turma)
        }
        
        var response2 = await axios.get(h + "professores/codigos/" + this.codProf + "/?token=" + this.token )
        this.nomeProf = response2.data.nome

        if(this.$route.params.anoLetivo && this.$route.params.dataInicio && this.$route.params.dataFim){
            this.dataInicio = this.$route.params.dataInicio
            this.dataFim = this.$route.params.dataFim
            this.anoLetivo = this.$route.params.anoLetivo
        }
        else{
            this.onAnoChange()
        }
        
        
    },
    methods: {
      format(value, event) {
        return moment(value).format('YYYY-MM-DD')
      },
      atualizaApps: async function(){
          if(this.turmaSel && this.turmaSel != ""){
            this.apps = undefined
            var response = await axios.get(hostApps + "turmas/" + this.turmaSel + "/jogou?codprofessor=" + this.codProf
                                                + "&dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim + "&token=" + this.token)
            this.appsInfo = response.data
            this.parseApps()
          }
      },
      parseApps: async function(){
          var aux = []
          for(var i = 0; i < this.appsInfo.length; i++){
              if(i == 0) aux.push(this.appsInfo[i])
              else if(this.appsInfo[i].codsubtema) aux.push(this.appsInfo[i].subtema)
              else aux.push(this.appsInfo[i].tema)
          }
          this.apps = aux
          if(this.app == "Todas") this.atualizaConteudo()
          else if(this.apps.find(element => element == this.app)) this.atualizaConteudo()
          else {
              this.app = ""
              this.items = []
          }
      },
      onTurmaChange: async function(item){
          if(this.turmaSel && this.turmaSel != ""){
              this.atualizaApps()
              //this.atualizaConteudo()
          }

      },
      onAnoChange: async function(item){
          if(this.anoLetivo != ""){
             var aux = this.anoLetivo.split("/")
             this.dataInicio = aux[0] + "-09-01"
             this.dataFim = aux[1] + "-09-01"
             this.atualizaApps()
             this.atualizaConteudo()
          }
      },
      onAppChange: async function(item){
          if(this.app && this.app != ''){
            this.atualizaHeaders()
            this.atualizaConteudo()
          }
      },
      atualizaHeaders: async function(){
          var appInfo = this.appsInfo.find(element => element.tema == this.app)
          if(appInfo){
              if((this.appTarefa = this.appsComTarefas.find(e => e.codtema == appInfo.codtema))) this.headers = this.headersTarefas
              else {this.appTarefa = false; this.headers = this.headersApps}
          }
          else{
              appInfo = this.appsInfo.find(element => element.subtema == this.app)
              if(appInfo){
                  if((this.appTarefa = this.appsComTarefas.find(e => e.codtema == appInfo.codtema && e.codsubtema == appInfo.codsubtema)))
                      this.headers = this.headersTarefas
                  else {this.appTarefa = undefined; this.headers = this.headersApps}
              }
              else {this.appTarefa = undefined; this.headers = this.headersApps}
          }
          
      },
      onDataInChange: async function(item){
          if(this.dataInicio){
              this.atualizaApps()
              this.atualizaConteudo()
          }
      },
      onDataFimChange: async function(item){
          if(this.dataFim){
              this.atualizaApps()
              //this.atualizaConteudo()
          }
      },
      onHorarioInChange: async function(item){
          if(this.horaInicio){
              //this.atualizaConteudo()
          }  
      },
      onHorarioFimChange: async function(item){
          if(this.horaInicio){
              this.atualizaConteudo()
          }  
      },
      atualizaConteudo: async function(){
            if(this.app != "" && this.dataFim != "" && this.dataInicio != "" && this.turmaSel != ""){
                this.loading = true
                if(this.app == "Todas"){

                    var response = await axios.get(hostApps + "turmas/" + this.turmaSel
                                            + "/?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                            + "&horaInicio=" + this.horaInicio + "&horaFim=" + this.horaFim
                                            + "&codProf=" + this.codProf + "&token=" + this.token)
            
                    this.items = response.data
              
                }
                else{
                    // Fazer para uma app em particular
                    var appInfo = this.appsInfo.find(element => element.tema == this.app)
                    if(appInfo){
                        // é um dos temas
                        var response = await axios.get(hostApps + "turmas/" + this.turmaSel
                                            + "/?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                            + "&codProf=" + this.codProf + "&codtema=" + appInfo.codtema
                                            + "&horaInicio=" + this.horaInicio + "&horaFim=" + this.horaFim
                                            + "&token=" + this.token)
                        
                        this.items = response.data
                    }
                    else{
                        // é um subtema
                        appInfo = this.appsInfo.find(element => element.subtema == this.app)
                        if(appInfo){
                              var response = await axios.get(hostApps + "turmas/" + this.turmaSel
                                            + "/?dataInicio=" + this.dataInicio + "&dataFim=" + this.dataFim
                                            + "&codProf=" + this.codProf + "&codtema=" + appInfo.codtema
                                            + "&horaInicio=" + this.horaInicio + "&horaFim=" + this.horaFim
                                            + "&codsubtema=" + appInfo.codsubtema + "&token=" + this.token)
                        
                            this.items = response.data
                        }
                    }
                }
                this.loading = false
          } 
      },
      exportPDF: async function(){
        var doc = new jsPDF({
        })

        var xImage = doc.internal.pageSize.getWidth() / 4
        var ytotal = 0
        var pdfName = "Apps-" + this.app + "-"+ this.turmaSel +".pdf"
        
        doc.addImage(hypatiaImg, 'PNG', xImage, 4);
        //doc.text("Jogo:")
        //doc.text("Estatisticas dos alunos sobre o jogo " + this.jogo + "da turma " + this.turmaSel, doc.internal.pageSize.getWidth() / 2, 8, null, null, 'center')
        doc.setFontSize(11)
        
        doc.text("Professor: " + this.nomeProf, 15, 50)
        doc.text("Turma: " + this.turmaSel, 130, 50)
        doc.text("Período: " + "Período: " + this.dataInicio + " (" + this.horaInicio + "h) até " + this.dataFim  + " (" + this.horaFim + "h)", 15, 56)
        doc.text("App de Conteúdos: " + this.app, 15, 62)
        var listaRes = []
        var total =["Todos", "Todos", 0, 0, 0, 0, 0, 0]
        for(var i = 0; i<this.items.length; i++){
            var aux = [];
            aux.push(this.items[i].numero)
            aux.push(this.items[i].nome)
            aux.push(this.items[i].ncertas)
            total[2] += this.items[i].ncertas
            aux.push(this.items[i].ntotal)
            total[3] += this.items[i].ntotal
            aux.push(this.items[i].acerto)
            aux.push(this.items[i].onpeak)
            total[5] += this.items[i].onpeak
            aux.push(this.items[i].offpeak)
            total[6] += this.items[i].offpeak
            aux.push(this.items[i].frequencia)
            total[7] += this.items[i].frequencia

            listaRes.push(aux)
        }
        total[4] = Math.round((total[2]/total[3]) * 100)
        listaRes.push(total)
        doc.autoTable({
            head: [['N.º', "Nome", 'NTRC', "NTR", "Acerto(%)", "DP", "FP", "#"]],
            body: listaRes,
            headStyles: { fillColor: [0, 146, 99] },
            margin:{top: 70, bottom: 30},
            didDrawPage: function (data) {
                    // Reseting top margin. The change will be reflected only after print the first page.
                    data.settings.margin.top = 10;
                    ytotal = doc.internal.pageSize.getHeight()
                    doc.setFontSize(8)
                    //doc.setFontType('bold'
                    doc.text("Legenda:" , 10, ytotal -30)
                    doc.text("NTRC - N.º de tarefas realizadas corretamente", 10, ytotal -26)
                    doc.text("NTR- N.º de tarefas realizadas", 10, ytotal -22)
                    doc.text("Acerto (%) - (NTRC/NTR)*100", 10, ytotal - 18)
                    doc.text("DP - Dentro do período escolar", 10, ytotal -14)
                    doc.text("FP - Fora do período escolar", 10, ytotal-10)
                    doc.text("# - Frequência", 10, ytotal-6)
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
      showTarefas: function(utilizador){
        this.propsTarefas = {
            app: this.app,
            table: this.appTarefa.tabela,
            codtema: this.appTarefa.codtema,
            codsubtema: this.appTarefa.codsubtema,
            userid: utilizador.userid,
            nome: utilizador.nome,
            numero: utilizador.numero,
            dataInicio: this.dataInicio,
            dataFim: this.dataFim
        }
        this.dialogTarefas = true
      }
    },
    
      
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