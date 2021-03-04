<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
              <v-card-title primary-title class="justify-center green--text">
                    Meus Agrupamentos
                </v-card-title>
                <center>
                <v-row justify="center space-around">
                  <v-btn @click="verEstatisticasMun()" class="white--text mr-2" color="#009263" ><v-icon>mdi-home-analytics</v-icon>Estatisticas Globais</v-btn>
                  <v-btn @click="verEstatisticasAgruMun()" class="white--text" color="#009263"><v-icon>mdi-home-analytics</v-icon>Estatisticas por cada Agrupamento</v-btn>
                </v-row>
                
                <v-dialog v-model="dialogAgruMun" width="75%">
                  <v-card class="pa-4">
                    <v-card-title primary-title class="justify-center green--text">
                      Estatisticas por Agrupamento de Escolas do Município
                    </v-card-title>
                    <center><v-btn v-if="!loading && estatisticasAgruMun.length>0" class="white--text" style="background-color: #009263;" @click="exportPDF()"> 
                      <v-icon> mdi-pdf-box </v-icon> Exportar 
                    </v-btn></center>
                    <v-combobox
                      id="anoletivo2"
                      label="Ano Letivo"
                      prepend-icon="mdi-counter"
                      v-model="ano"
                      color="#009263"
                      :items="anos"
                      @change="getEstatisticasAgruMun()" 
                    ></v-combobox>
                    <v-container v-if="loading">
                      <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
                    </v-container>
                    <v-container v-else>
                      <v-text-field
                        v-model="filtrar2"
                        label="Filtrar"
                        prepend-icon="mdi-magnify"
                        color="#009263"
                        single-line
                      ></v-text-field>
                        <v-data-table
                        class="elevation-2"
                        :headers="header_estatisticas_escolas"
                        :items="estatisticasAgruMun"
                        :footer-props="footer_props"
                        :search="filtrar2"
                      ></v-data-table>

                    </v-container>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogEstatisticasMun" width="60%">
                  <v-card class="pa-4">
                    <v-card-title primary-title class="justify-center green--text">
                      Estatisticas do Município por Ano Letivo
                    </v-card-title>
                    <v-combobox
                      id="anoletivo"
                      label="Ano Letivo"
                      prepend-icon="mdi-counter"
                      v-model="ano"
                      color="#009263"
                      :items="anos"
                      @change="getEstatisticasMun()" 
                    ></v-combobox>
                    <v-container v-if="loading || estatisticasMun.nturmas == undefined">
                      <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
                    </v-container>
                    <v-container  v-else>
                        <center>
                        <ul style="list-style: none;">
                            <li>
                                Nº de turmas:  {{estatisticasMun.nturmas}}
                            </li>
                            <br>
                            <li>
                                Nº de professores:  {{estatisticasMun.nprofessores}}
                            </li>
                            <br>
                            <li>
                                Nº de alunos:  {{estatisticasMun.nalunos}}
                            </li>
                        </ul>
                      </center>
                    </v-container>
                  </v-card>
                </v-dialog>
                </center>
                <v-text-field
                    v-model="filtrar"
                    label="Filtrar"
                    prepend-icon="mdi-magnify"
                    color="#009263"
                    single-line
                    ></v-text-field>
                    <v-data-table
                    class="elevation-1"
                    :headers="header_escolas"
                    :items="escolas"
                    :footer-props="footer_props"
                    :search="filtrar"
                    >
                    <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.nome}}</td>
                        <td>{{row.item.localidade}}</td>
                        <td><v-icon @click="verEstatisticasAgru(row.item)"> mdi-home-analytics </v-icon></td>
                        <td><v-icon @click="verProfessores(row.item.cod)"> mdi-eye </v-icon></td>
                    </tr>
                    </template>
                    </v-data-table>
                    <v-dialog v-model="dialogEstatisticasAgru" width="60%">
                      <v-card class="pa-4">
                        <v-card-title primary-title class="justify-center green--text">
                          Estatisticas por Ano Letivo ({{agrupamentoAtual.nome}})
                        </v-card-title>
                        <v-combobox
                          id="anoletivo2"
                          label="Ano Letivo"
                          prepend-icon="mdi-counter"
                          v-model="ano"
                          color="#009263"
                          :items="anos"
                          @change="getEstatisticasAgru()" 
                        ></v-combobox>
                        <v-container v-if="loading || estatisticasAgru.nturmas == undefined">
                          <center><v-img :src="require('@/assets/loading.gif')" width="150px" heigth="150px"> </v-img></center>
                        </v-container>
                        <v-container v-else>
                      <center>
                        <ul style="list-style: none;">
                            <li>
                                Nº de turmas:  {{estatisticasAgru.nturmas}}
                            </li>
                            <br>
                            <li>
                                Nº de professores:  {{estatisticasAgru.nprofessores}}
                            </li>
                            <br>
                            <li>
                                Nº de alunos:  {{estatisticasAgru.nalunos}}
                            </li>
                        </ul>
                      </center>
                    </v-container>
                      </v-card>
                    </v-dialog>
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
import Swal from 'sweetalert2'

  export default {
    data(){
      return {
        token: "",
        loading:false,
        ano:anoletivo,
        estatisticasMun:{},
        estatisticasAgru:{},
        estatisticasAgruMun:{},
        anos: ["14/15", "15/16", "16/17", "17/18", "18/19", "19/20", "20/21"],
        escolas: [],
        dialogEstatisticasMun: false,
        dialogEstatisticasAgru: false,
        dialogAgruMun: false,
        agrupamentoAtual : {},
         header_escolas: [
            {text: "Nome", sortable: true, value: 'nome', class: 'subtitle-1'},
            {text: "Localidade", value: 'localidade', class: 'subtitle-1'},
            {text: "Estatisticas Globais", class: 'subtitle-1'},
            {text: "Ver Professores", class: 'subtitle-1'},
        ],
        header_estatisticas_escolas: [
            {text: "Agrupamento", value: 'nome', class: 'subtitle-1'},
            {text: "#Turmas", value: 'nturmas', class: 'subtitle-1'},
            {text: "#Professores", value: 'nprofessores', class: 'subtitle-1'},
            {text: "#Alunos", value: 'nalunos', class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        filtrar2 : "",
        municipio:{}
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.municipio = JSON.parse(localStorage.getItem("utilizador"))
        var response = await axios.get(h + "escolas/localidades/" + this.municipio.infoEscola.localidade +"?token=" + this.token)
        this.escolas = response.data
    },
    methods: {
      editarEscola : function(id){
          this.$router.push({name: "Editar Escola", params: { id : id } })
      },
      apagarEscola: async function(id){
        Swal.fire({
          title: "De certeza que deseja apagar este agrupamento?",
          showDenyButton: true,
          confirmButtonColor: '#009263',
          confirmButtonText: `Sim`,
          denyButtonText: `Não`,
        }).then(async (result) => {
          if (result.isConfirmed) {
              var a = await axios.delete(h + "escolas/" + id + "?token=" + this.token)
              var apagado = a.data
              if(apagado.removed){
                var response = await axios.get(h + "escolas/localidades/" + this.municipio.infoEscola.localidade +"?token=" + this.token)
                this.escolas = response.data
              }
              else{
                Swal.fire({
                  icon: 'error',
                  title: apagado.message,
                  confirmButtonColor: '#009263'
                })
              }
          }
        })
      },
      verProfessores: function(codEscola){
        this.$router.push({name: "Professores Agrupamento", params: { escola : codEscola } })
      },
      getEstatisticasMun: async function(){
        this.loading = true
        if(this.anos.find(element=> element == this.ano)){
          var aux = this.ano.split("/")[0]
          var response = await axios.get(h + "escolas/localidades/" + this.municipio.infoEscola.localidade + "/estatisticas?ano=" + aux + "&token=" + this.token)
          this.estatisticasMun = response.data
        }
        this.loading = false
      },
      verEstatisticasMun: async function(){
          this.dialogEstatisticasMun = true
          await this.getEstatisticasMun()
          
      },
      getEstatisticasAgru: async function(){
        this.loading = true
        if(this.anos.find(element=> element == this.ano)){
          var aux = this.ano.split("/")[0]
          var response = await axios.get(h + "escolas/" + this.agrupamentoAtual.id + "/estatisticas?ano=" + aux + "&token=" + this.token)
          this.estatisticasAgru = response.data
        }
        this.loading = false
      },
      getEstatisticasAgruMun: async function(){
        this.loading = true
        if(this.anos.find(element=> element == this.ano)){
          var aux = this.ano.split("/")[0]
          var response = await axios.get(h + "escolas/localidades/" + this.municipio.infoEscola.localidade + 
                                          "/estatisticas?ano=" + aux + "&agrupamentos=true " + "&token=" + this.token)
          this.estatisticasAgruMun = response.data
        }
        this.loading = false
      },
      verEstatisticasAgruMun: async function(){
        this.dialogAgruMun = true
        await this.getEstatisticasAgruMun()
      },
      verEstatisticasAgru: async function(escola){
        this.agrupamentoAtual.nome = escola.nome
        this.agrupamentoAtual.id = escola.cod
        this.dialogEstatisticasAgru = true
        await this.getEstatisticasAgru()
      }
    }
  }
</script>