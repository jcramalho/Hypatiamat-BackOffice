<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
                <v-card-title primary-title class="justify-center green--text">
                    Gestão de Novidades
                </v-card-title>
                <center><v-btn class="white--text" style="background-color: #009263;" @click="criarNovidade()"><v-icon> mdi-account-plus </v-icon> Criar Novidade </v-btn></center>
                                         
                    <v-text-field
                    v-model="filtrar"
                    label="Filtrar"
                    prepend-icon="mdi-magnify"
                    color="#009263"
                    single-line
                    ></v-text-field>
                    <v-data-table
                    class="elevation-1"
                    :headers="header_novidades"
                    :items="novidades"
                    :footer-props="footer_props"
                    :search="filtrar"
                    color="#009263"
                    >
                    <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.data}}</td>
                        <td>{{row.item.titulo}}</td>
                        <td>{{row.item.subnovidades}}</td>
                        <td>
                        <!--<v-icon @click="verProfessor(row.item.id)"> mdi-eye </v-icon>-->
                            <v-icon v-if="row.item.link" @click="goToLink(row.item.link)" color="#009263">mdi-link-variant</v-icon>
                            <v-icon @click="editarNovidade(row.item.id, row.index)" color="#009263"> mdi-pencil </v-icon>
                            <v-icon @click="apagarNovidade(row.index, row.item.id)" color="#009263"> mdi-delete </v-icon>
                        </td>
                    </tr>
                    </template>
                    </v-data-table>

                    <v-dialog v-model="dialogCriar" width="70%">
                        <v-card class="pa-5">
                            <v-container>
                                <v-form>
                                    <v-text-field prepend-icon="mdi-card-account-details" color="#009263"
                                        v-model="novaNovidade.titulo" name="Título da Novidade" :rules="[string70]" label="Título da Novidade" 
                                        required
                                    ></v-text-field>
                                    <v-text-field prepend-icon="mdi-card-account-details" color="#009263"
                                        v-model="novaNovidade.data" name="Data da Novidade" label="Data da Novidade" 
                                        type="date"
                                        required
                                    ></v-text-field>
                                    <v-text-field prepend-icon="mdi-link-variant" color="#009263"
                                        v-model="novaNovidade.link" name="Link da Novidade" label="Link da Novidade"
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
                                                :items="novaNovidade.subnovidades"
                                                :footer-props="footer_props"
                                                :search="filtrar2"
                                                color="#009263"
                                            >
                                                <template v-slot:item="row">
                                                    <tr>
                                                        <td>{{row.item.subnovidade}}</td>
                                                        <td>
                                                        <!--<v-icon @click="verProfessor(row.item.id)"> mdi-eye </v-icon>-->
                                                        <v-icon @click="apagarSubNovidadeCriada(row)" color="#009263"> mdi-delete </v-icon>
                                                        </td>
                                                    </tr>
                                                </template>
                                            </v-data-table>
                                        </v-card>
                                    </v-container>
                                </v-form>
                                <v-btn class="white--text" :disabled="disabledTitulo" 
                                block style="background-color: #009263;" @click="insertNovidade()">
                                  Criar Novidade
                                </v-btn>
                            </v-container>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogEditar" width="77%">
                      <EditarNovidade v-if="dialogEditar" :idEditar="this.idEditar" @atualizaNovidade="(novidade) => atualizaNovidade(novidade)"
                          @subnovidades="(subnovidades) => {atualizaSubNovidades(subnovidades)}"/>
                    </v-dialog>
                    
            </v-container>
        </v-card>
      </v-container>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
import Swal from 'sweetalert2'
import EditarNovidade from '@/components/Novidades/EditarNovidade.vue'
const h = require("@/config/hosts").hostAPI

  export default {
    components:{
      EditarNovidade
    },
    data(){
      return {
        token: "",
        novaNovidade:{
            titulo: "",
            link: "",
            data: (new Date()).toISOString().split("T")[0],
            subnovidades:[]
        },
        subnovidade:"",
        loading:false,
        novidades: [],
        disabledTitulo:false,
        dialogCriar: false,
        dialogEditar: false,
        idEditar: -1,
        indexEditar: -1,
        header_novidades: [
            {text: "Data", sortable: true, value: 'data', class: 'subtitle-1'},
            {text: "Título", sortable: true, value: 'titulo', class: 'subtitle-1'},
            {text: "Sub Novidades", sortable: true, value: 'subnovidades', class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
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
    created: async function(){
        this.token = localStorage.getItem("token")
        this.atualizaNovidades()

    },
    methods: {
      atualizaNovidades: async function(){
        var response = await axios.get(h + "novidades?token=" + this.token)
        this.novidades = response.data
      },
      insertSubNovidade: function(){
          this.novaNovidade.subnovidades.push({subnovidade: this.subnovidade})
      },
      editarNovidade: async function(id, index){
        this.idEditar = id
        this.indexEditar = index
        this.dialogEditar = true;
      },
      insertNovidade: async function(){
        var novidade = {titulo: this.novaNovidade.titulo, data: this.novaNovidade.data}
        if(this.novaNovidade.link != "") novidade.link = this.novaNovidade.link 
        var response = await axios.post(h + "novidades/?token=" + this.token, novidade)
        var idNovidade = response.data.insertId
        for(var i = 0; i < this.novaNovidade.subnovidades.length; i++){
            await axios.post(h + "novidades/" + idNovidade + "/subnovidade?token="+this.token, {subnovidade: this.novaNovidade.subnovidades[i].subnovidade})
        }
        this.atualizaNovidades()
        this.novaNovidade = {titulo: "", link: "", subnovidades:[], data: (new Date()).toISOString().split("T")[0]}
        this.dialogCriar = false
        Swal.fire({
            icon: 'success',
            title: 'Novidade registada com sucesso.',
            confirmButtonColor: '#009263'
        })
      },
      apagarNovidade: async function(index, idNovidade){
        Swal.fire({
          title: "De certeza que deseja apagar esta novidade?",
          showDenyButton: true,
          confirmButtonColor: '#009263',
          confirmButtonText: `Sim`,
          denyButtonText: `Não`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            await axios.delete(h + "novidades/" + idNovidade + "?token=" + this.token)
            this.novidades.splice(index, index+1)
          }
        })
      },
      criarNovidade: async function(){
          this.dialogCriar = true
      },
      apagarSubNovidadeCriada: async function(row){
          this.novaNovidade.subnovidades.splice(row.index, row.index+1)
      },
      atualizaNovidade: async function(novidade){
        this.novidades[this.indexEditar].titulo = novidade.titulo
        if(novidade.link) this.novidades[this.indexEditar].link = novidade.link
        else {this.novidades[this.indexEditar].link = null}
        this.novidades[this.indexEditar].data = novidade.data
        this.dialogEditar = false
      },
      atualizaSubNovidades: async function(subnovidades){
        this.novidades[this.indexEditar].subnovidades = subnovidades
      },  
      goToLink: function(link){
        window.open(link, '_blank')
      }
    }
  }
</script>