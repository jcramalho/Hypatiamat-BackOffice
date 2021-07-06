<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
            <v-container>
              <v-card-title primary-title class="justify-center green--text">
                    Gestão de Cromos
                </v-card-title>
                <center>
                    <v-btn class="white--text" color="#009263" @click="dialogCriarCromo = true">
                        Inserir Cromo
                    </v-btn>
                </center>
                <br>
                <center>
                    <v-btn class="white--text" color="#009263" @click="dialogCriarImagem = true">
                        Inserir Nova Imagem
                    </v-btn>
                </center>
                <br>
                <center>
                    <v-btn class="white--text" color="#009263" @click="dialogCopiarCromos = true">
                        Copiar Cromos
                    </v-btn>
                </center>
                    <v-combobox
                      id="anoletivo"
                      label="Ano Letivo"
                      prepend-icon="mdi-counter"
                      v-model="ano"
                      color="#009263"
                      :items="anos"
                      @change="getCromos()" 
                    ></v-combobox>
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
                        class="elevation-2"
                        :headers="header_cromos"
                        :items="cromos"
                        :footer-props="footer_props"
                        :search="filtrar"
                      >
                        <template v-slot:item="row">
                            <tr>
                                <td>{{row.item.numero}}</td>
                                <td>{{row.item.nome}}</td>
                                <td>
                                    <span v-if="row.item.jogos"> 
                                       <span v-if="row.item.dias">
                                           Jogos - Dias
                                       </span>
                                       <span v-else>
                                           Jogos - Frequência
                                       </span> 
                                    </span>
                                    <span v-else-if="row.item.apps"> 
                                       <span v-if="row.item.dias">
                                           Apps - Dias
                                       </span>
                                       <span v-else>
                                           Apps - Frequência
                                       </span> 
                                    </span>
                                    <span v-else>
                                        Campeonatos
                                    </span>
                                </td>
                                <td>
                                     <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn
                                            icon
                                            v-bind="attrs" 
                                            v-on="on"
                                            >
                                            <v-icon color="#009263">mdi-information-outline</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{row.item.descricao}}</span>
                                     </v-tooltip>  
                                     <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn
                                            icon
                                            v-bind="attrs" 
                                            v-on="on"
                                            @click="pathImage = row.item.imagem; dialogImage = true"
                                            >
                                            <v-icon color="#009263">mdi-image</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Pré-visualização da imagem do cromo.</span>
                                     </v-tooltip> 
                                     <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn
                                            icon
                                            v-bind="attrs" 
                                            v-on="on"
                                            @click="editarCromo(row.item)"
                                            >
                                            <v-icon color="#009263">mdi-pencil</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Editar o cromo.</span>
                                     </v-tooltip> 
                                     <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn
                                            icon
                                            v-bind="attrs" 
                                            v-on="on"
                                            @click="apagarCromo(row.index, row.item.id)"
                                            >
                                            <v-icon color="#009263">mdi-delete</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Apagar o cromo, caso ainda nenhum aluno o tenha conquistado.</span>
                                     </v-tooltip> 
                                     
                                </td>
                            </tr>
                        </template>
                      </v-data-table>
                    </v-container>
                    <v-dialog v-model="dialogImage" width="60%">
                        <v-card class="pa-2">
                            <center>
                                <v-img
                                    width="200"
                                    :src="host + pastaCromos + pathImage"
                                ></v-img>
                            </center>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogCriarCromo" width="80%">
                        <CriarCromo v-if="dialogCriarCromo" @inserido="cromoCriado()" />
                    </v-dialog>
                    <v-dialog v-model="dialogCriarImagem" width="60%">
                        <v-card class="pa-4">
                            <v-combobox
                                id="pasta"
                                label="Pasta da Imagem"
                                prepend-icon="mdi-folder"
                                v-model="pastaSel"
                                color="#009263"
                                :items="pastas"
                            ></v-combobox>
                            <v-text-field label="Nome da Imagem" color="#009263" prepend-icon="mdi-image"
                             v-model="nomeImagem" name="Nome da Imagem" :rules="[existeImagem]"
                            ></v-text-field>
                            <center>
                            <v-btn
                                color="#009263"
                                class="text-none white--text"
                                rounded
                                :loading="isSelecting"
                                @click="onButtonClick"
                                >
                                  <v-icon left>mdi-cloud-upload-outline</v-icon> {{buttonText}} 
                            </v-btn>
                            </center>
                            <input
                                id="upload"
                                ref="uploader"
                                class="d-none"
                                type="file"
                                multiple
                                accept="image/*"
                                @change="onFileChanged"
                            >
                            <br>
                            <center>
                            <v-btn rounded 
                                v-if="this.selectedFile" 
                                color="green" 
                                class="text-none white--text"
                                @click="postImagem"> Colocar Imagem 
                            </v-btn>
                            </center>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogEditarCromo" width="80%">
                      <EditarCromo v-if="dialogEditarCromo" :cromoOriginal="cromoSel" :imagens="imagens" @editado="updateCromo()"/>
                    </v-dialog>
                    <v-dialog v-model="dialogCopiarCromos" width="90%">
                      <CopiarCromos v-if="dialogCopiarCromos" :anoletivoSel="ano" :cromosSel="cromos" @copiados="(value)=>cromosCopiados(value)"/>
                    </v-dialog>
            </v-container>
        </v-card>
      </v-container>
    </v-main>
  </v-app> 
</template>



<script>
import axios from "axios"
const h = require("@/config/hosts").host
const hostCromos = require("@/config/hosts").hostCromos
const anoletivo = require("@/config/confs").anoletivo
const anoletivo2 = require("@/config/confs").anoAtual
const anosletivos = require('@/config/confs').anosCromos
const anosleivos2 = require('@/config/confs').anosCromos2
import Swal from 'sweetalert2'
const hypatiaImg = require("@/assets/hypatiamat.png")
import CriarCromo from '@/components/Cromos/CriarCromo.vue'
import EditarCromo from '@/components/Cromos/EditarCromo.vue'
import CopiarCromos from '@/components/Cromos/CopiarCromos.vue'


  export default {
    name: 'GestaoCromos',
    components:{
        CriarCromo, 
        EditarCromo,
        CopiarCromos
    },
    data(){
      return {
        token: "",
        loading:false,
        ano:anoletivo,
        pastaSel: anoletivo2,
        pastas: anosleivos2,
        nomeImage: '',
        anos: anosletivos,
        host: h,
        imagens: [],
        dialogImage: false,
        dialogCriarCromo: false,
        dialogEditarCromo: false,
        dialogCriarImagem: false,
        dialogCopiarCromos: false,
        cromoSel: null,
        pathImage: '',
        pastaCromos: 'cromos_imgs/',
        cromos: [],
        selectedFile: null,
        nomeImagem: '',
        isSelecting: false,
        header_cromos: [
            {text: "Número", value: 'numero', class: 'subtitle-1',},
            {text: "Nome", value: 'nome', class: 'subtitle-1'},
            {text: "Tipo", class: 'subtitle-1'},
            {text: "Operações", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [50, 100, 200, -1],
            "items-per-page-all-text": "Todos"
        },
        filtrar : "",
        existeImagem: v =>{
          if(this.imagens.find(e => e == this.pastaSel + "/" + v) ) {
            return 'Coloque outro nome de imagem, pois esse cromo já existe. A não ser que pretenda substituir a imagem.'
          }
          return true
        },
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.utilizador = JSON.parse(localStorage.getItem("utilizador"))
        var response = await axios.get(hostCromos + "?token=" + this.token)
        this.cromos = response.data
        response = await axios.get(hostCromos + "imagens/nome?token=" + this.token)
        this.imagens = response.data
    },
    computed:{
      buttonText() {
          return this.selectedFile ? 'Imagem Carregada' : 'Imagem'
      },
    },
    methods: {
      getCromos: async function(){
        this.loading = true
        var response = await axios.get(hostCromos + "?anoletivo=" + this.ano + "&token=" + this.token)
        this.cromos = response.data
        this.loading = false
      },
      getImagens: async function(){
        var response = await axios.get(hostCromos + "imagens/nome?token=" + this.token)
        this.imagens = response.data
      },
      cromoCriado: async function(){
          await this.getCromos()
          this.dialogCriarCromo = false
      },
      apagarCromo: async function(index, id){
          Swal.fire({
          title: "De certeza que deseja apagar este cromo?",
          showDenyButton: true,
          confirmButtonColor: '#009263',
          confirmButtonText: `Sim`,
          denyButtonText: `Não`,
        }).then(async (result) => {
          if (result.isConfirmed) {
              var a = await axios.delete(hostCromos + id + "?token=" + this.token)
              var apagado = a.data
              if(apagado.removed){
                this.cromos.splice(index, 1)
              }
              else{
                Swal.fire({
                  icon: 'error',
                  text: apagado.message,
                  confirmButtonColor: '#009263'
                })
              }
          }
        })
      },
      onFileChanged(e) {
          this.selectedFile = e.target.files[0]
          this.nomeImagem = this.selectedFile.name
      },
      postImagem(){
        if(this.imagens.find(e => e == this.pastaSel + "/" + this.nomeImagem)){
            Swal.fire({
            title: "De certeza que pretende substituir a imagem " + this.nomeImagem + " já existente na pasta?",
            showDenyButton: true,
            confirmButtonColor: '#009263',
            confirmButtonText: `Sim`,
            denyButtonText: `Não`,
          }).then(async (result) => {
            if (result.isConfirmed) {
              let formData = new FormData();
              formData.append("file", this.selectedFile);

              axios.post(hostCromos + "imagem?nome=" + this.nomeImagem + "&pasta=" + this.pastaSel
                                + "&token=" + this.token, formData, {headers: {'Content-Type': 'multipart/form-data'}})
                    .then(response => { 
                        this.selectedFile = null;
                        this.pastaSel = anoletivo2
                        this.nomeImagem = ''
                        this.dialogCriarImagem = false  
                        this.doClear()
                        this.getImagens()

                        Swal.fire({
                          icon: 'success',
                          text: 'Imagem substituída com sucesso.',
                          confirmButtonColor: '#009263'
                        })
                        
                    })
                    .catch(erro => console.log(erro))
            }
          })
        }
        else{
          Swal.fire({
            title: "Pretende colocar esta nova imagem?",
            showDenyButton: true,
            confirmButtonColor: '#009263',
            confirmButtonText: `Sim`,
            denyButtonText: `Não`,
          }).then(async (result) => {
            if (result.isConfirmed) {
              let formData = new FormData();
              formData.append("file", this.selectedFile);

              axios.post(hostCromos + "imagem?nome=" + this.nomeImagem + "&pasta=" + this.pastaSel
                                + "&token=" + this.token, formData, {headers: {'Content-Type': 'multipart/form-data'}})
                    .then(response => {  
                        this.selectedFile = null;
                        this.pastaSel = anoletivo2
                        this.nomeImagem = ''
                        this.dialogCriarImagem = false  
                        this.doClear()
                        this.getImagens()

                        Swal.fire({
                          icon: 'success',
                          text: 'Imagem inserida com sucesso.',
                          confirmButtonColor: '#009263'
                        })
                    })
                    .catch(erro => console.log(erro))
            }
          })
        }
      },
      onButtonClick() {
            this.isSelecting = true
            window.addEventListener('focus', () => {
                this.isSelecting = false
            }, { once: true })

            this.$refs.uploader.click()
        },
      doClear() {
        document.querySelector('#upload').value = '';
      },
      editarCromo : function(cromo){
        this.cromoSel = cromo;
        this.dialogEditarCromo = true
      },
      updateCromo: async function(){
        this.dialogEditarCromo = false
        var response = await axios.get(hostCromos + this.cromoSel.id + "/?token=" + this.token)
        var al = this.cromos.find(a => a.id == this.cromoSel.id) 
        var index = this.cromos.indexOf(al)
        this.cromos.splice(index, 1, response.data)
      },
      cromosCopiados: function(value){
        this.ano = value
        this.getCromos()
        this.dialogCopiarCromos = false
      }
    }
  }
</script>