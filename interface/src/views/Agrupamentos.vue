<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-card class="pa-5">
        <v-container>
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
                    <td>
                    <v-icon @click="editarEscola(row.item.id)"> mdi-pencil </v-icon>
                    <v-icon @click="apagarEscola(row.item.cod)"> mdi-delete </v-icon>
                    </td>
                </tr>
                </template>
                </v-data-table>
        </v-container>
    </v-card>
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
        escolas: [],
         header_escolas: [
            {text: "Nome", sortable: true, value: 'nome', class: 'subtitle-1'},
            {text: "Localidade", value: 'localidade', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
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
          if(confirm("De certeza que deseja apagar esta escola?")){
              var a = await axios.delete(h + "escolas/" + id + "?token=" + this.token)
              var apagado = a.data
              console.log(apagado)
              if(apagado.removed){
                var response = await axios.get(h + "escolas/localidades/" + this.municipio.infoEscola.localidade +"?token=" + this.token)
                this.escolas = response.data
              }
              else{
                alert(apagado.message)
              }
          }
      },
    }
  }
</script>