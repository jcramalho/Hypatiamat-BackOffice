<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
              <v-card-title primary-title class="justify-center green--text">
                    Meus Agrupamentos
                </v-card-title>

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
                        <td><v-icon color="#009263" @click="verProfessores(row.item.cod)"> mdi-eye </v-icon></td>
                    </tr>
                    </template>
                    </v-data-table>
            </v-container>
        </v-card>
      </v-container>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
const h = require("@/config/hosts").hostAPI

  export default {
    data(){
      return {
        token: "",
        loading:false,

        escolas: [],

        agrupamentoAtual : {},
        header_escolas: [
            {text: "Nome", sortable: true, value: 'nome', class: 'subtitle-1'},
            {text: "Localidade", value: 'localidade', class: 'subtitle-1'},
            {text: "Ver Professores", class: 'subtitle-1'},
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
      verProfessores: function(codEscola){
        this.$router.push({name: "Professores Agrupamento", params: { escola : codEscola } })
      },
      
    }
  }
</script>