<template>
    <v-card class="pa-5">
        <v-container>
            <v-card-title class="justify-center green--text"> Editar Novidade (ID : {{idEditar}}) </v-card-title>
            <v-form>
                <v-text-field prepend-icon="mdi-card-account-details" color="#009263"
                    v-model="novidade.titulo" name="Título da Novidade" :rules="[string70]" label="Título da Novidade" 
                    required
                ></v-text-field>
                <v-text-field prepend-icon="mdi-link-variant" color="#009263"
                    v-model="novidade.link" name="Link da Novidade" label="Link da Novidade"
                ></v-text-field>
                <v-container>
                    <v-card class="pa-3" outlined>
                        <v-container fluid>
                        <v-textarea prepend-icon="mdi-sitemap" color="#009263"
                            v-model="subnovidade" name="Subnovidade" label="Subnovidade"
                        ></v-textarea>
                        </v-container>
                        <v-btn class="white--text" :disabled="subnovidade==''" 
                            block style="background-color: #009263;" @click="insertSubNovidade()">
                            Criar Sub Novidade
                        </v-btn>
                        <v-text-field
                            v-model="filtrar2"
                            label="Filtrar"
                            prepend-icon="mdi-magnify"
                            color="#009263"
                            single-line
                        ></v-text-field>
                        <v-data-table
                            class="elevation-1"
                            :headers="header_subnovidades"
                            :items="novidade.subnovidades"
                            :footer-props="footer_props"
                            :search="filtrar2"
                            color="#009263"
                        >
                            <template v-slot:item="row">
                                <tr>
                                    <td>{{row.item.subnovidade}}</td>
                                    <td>
                                    <!--<v-icon @click="verProfessor(row.item.id)"> mdi-eye </v-icon>-->
                                    <v-icon @click="apagarSubNovidadeCriada(row)"> mdi-delete </v-icon>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-container>
            </v-form>
            <v-btn class="white--text" :disabled="disabledTitulo" 
            block style="background-color: #009263;" @click="updateNovidade()">
                Guardar Alterações
            </v-btn>
        </v-container>
    </v-card>
</template>

<script>
import axios from "axios"
import Swal from 'sweetalert2'
const h = require("@/config/hosts").hostAPI

  export default {
    components:{
    },
    data(){
      return {
        token: "",
        novidade:{titulo:"", link:"", subnovidades:[]},
        subnovidade:"",
        loading:false,
        disabledTitulo:false,
        subNovidadesInserir:[],
        header_subnovidades: [
            {text: "Sub Novidade", sortable: true, value: 'subnovidade', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        filtrar2 : "",
        subnovidadesEliminar:[],
        string15: v =>{
            if(v.length > 15) return 'Não pode ter mais que 15 caractéres.'
            return true
        },
        string70: v =>{
            if(v.length > 70) {this.disabledTitulo = true; return 'Não pode ter mais que 70 caractéres.'}
            if(v.length == 0) {this.disabledTitulo = true; return 'Precisa de um título.'}
            this.disabledTitulo = false
            return true
        },
      }
    },
    props:["idEditar"],
    created: async function(){
        this.token = localStorage.getItem("token")
        var response = await axios.get(h + "novidades/" + this.idEditar + "?token=" + this.token)
        this.novidade = response.data
    },
    methods: {
      atualizaNovidades: async function(){
        var response = await axios.get(h + "novidades?token=" + this.token)
        console.log(response.data)
        this.novidade = response.data
      },
      apagarSubNovidadeCriada: async function(row){
          Swal.fire({
          title: "De certeza que deseja apagar esta subnovidade?",
          showDenyButton: true,
          confirmButtonColor: '#009263',
          confirmButtonText: `Sim`,
          denyButtonText: `Não`,
            }).then(async (result) => {
                await axios.delete(h + "novidades/subnovidades/" + row.item.id + "?token=" + this.token)
                this.novidade.subnovidades.splice(row.index, row.index)
                this.$emit("subnovidades", this.novidade.subnovidades.length)
            })
      },
      insertSubNovidade: async function(){
          var response = await axios.post(h + "novidades/" + this.idEditar + "/subnovidade?token=" + this.token, {subnovidade: this.subnovidade})
          this.novidade.subnovidades.push({id:response.data.insertId, subnovidade: this.subnovidade})
          this.$emit("subnovidades", this.novidade.subnovidades.length)
      },
      updateNovidade: async function(){
          var novidade
          if(this.novidade.link != "") novidade = {id: this.idEditar, titulo: this.novidade.titulo, link: this.novidade.link}
          else novidade = {id: this.idEditar, titulo: this.novidade.titulo}
          await axios.put(h + "novidades/" + this.idEditar + "?token=" + this.token, novidade)
          Swal.fire({
            icon: 'success',
            title: 'Novidade alterada com sucesso.',
            confirmButtonColor: '#009263'
          })
          this.$emit("atualizaNovidade", novidade)
      },

      
    }
  }
</script>
