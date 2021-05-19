<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
    <v-toolbar class="fixed-bar align-center" flat height="90">
        <v-row class="justify-center align-center">
        <v-col cols="6">
        <a href="https://hypatiamat.com">
            <img :src="require('@/assets/hypatiamat.png')" height="60" class="logo" style="margin-left:3%;"/>
        </a>
        </v-col>
        <v-col cols="6">
        <a href="https://backoffice.hypatiamat.com">
        <img  :src="require('@/assets/logo.png')" height="80" class="logo"> 
        </a>
        </v-col>
        </v-row>
    </v-toolbar>
        <v-card>
            <v-card class="pa-5" width="100%" color="#30bc8c">
                <center><span class="white--text" style="font-size:25px"><b> Novidades </b></span></center>
            </v-card>
            <!--<v-list v-model="novidades" 
                <v-list-item v-for="novidade in novidades" v-bind:key="novidade.id">-->
            <div style='background-color:#009263'>
                <v-row v-for="novidade in novidadesView" v-bind:key="novidade.id">
                    <v-card class="elevation-3 ma-3 ml-md-16 ml-xs-1 pa-5" outlined color="#30bc8c" :min-width="mobile ? 100 : 500">
                        <v-row no-gutters v-if="mobile">
                            <v-col cols="12" sm="3">
                                <b class="white--text">[{{novidade.data}}]</b> 
                            </v-col>
                            <v-col cols="12" sm="8">
                            <span class="white--text">{{novidade.titulo}}</span>
                            </v-col> 
                            <v-col cols="12" sm="1">
                                <span class="white--text" v-if="novidade.link" @click="goToLink(novidade.link)">[+] Ver</span>
                            </v-col>
                        </v-row>
                        <v-list-item-title v-else class="white--text">
                            <b>[{{novidade.data}}] </b> <span>{{novidade.titulo}}</span> <span v-if="novidade.link" @click="goToLink(novidade.link)"> [+] Ver</span>
                        </v-list-item-title>
                        <v-list-item-group class="white--text">
                            <div>
                                <ul>
                                    <li class="white--text" v-for="subnovidade in novidade.subnovidades" v-bind:key="subnovidade.id">
                                        <span class="white-text">{{subnovidade.subnovidade}}</span>
                                    </li>
                                </ul>
                            </div>
                        </v-list-item-group>
                    </v-card>
                </v-row>
                <v-row>
                    <v-btn
                    class="text-none white--text ma-3 ml-md-16 ml-xs-1 pa-5"
                    v-if="pagination.total > pagination.page"
                    text
                    @click="
                        pagination.page++;
                        showNovidades();
                    "
                    >
                    Ver novidades mais antigas
                    </v-btn>
                </v-row>
            </div>
               <!-- </v-list-item>
            </v-list> -->
        </v-card>
          <v-footer
                dark
                padless
            >
                <v-card
                padless
                width="100%"
                color="#10381b"
                class="white--text"
                >
                    
                <v-row>
                    <v-col class="pa-4" cols="12" sm="6" md="3" lg="2">
                        <h3>SOBRE</h3>
                        <ul class="no-bullets">
                            <li><a class="li-color"  href="https://www.hypatiamat.com/projeto.php">O projeto</a></li>
                            <li><a class="li-color" href="https://www.hypatiamat.com/equipa.php">A equipa</a></li>
                            <li><a class="li-color" href="https://www.hypatiamat.com/novidades.php">Novidades</a></li>
                            <!--<li><a href="#">Estatísticas</a></li>-->
                            <li><a class="li-color" href="https://www.hypatiamat.com/oquedizem.php">O que dizem</a></li>
                            <li><a class="li-color" href="https://www.hypatiamat.com/apoiopdf/biografiaDaHypatia.pdf">A Hypatia</a></li>
                        </ul>
                    </v-col>
                    <v-col class="pa-4" cols="12" sm="6" md="3" lg="2">
                        <h3>AJUDA</h3>
                        <ul class="no-bullets">
                            <li><a class="li-color" href="https://www.hypatiamat.com/faqs.php">Faqs</a></li>
                        </ul>
                    </v-col>
                    <v-col class="pa-4" cols="12" sm="6" md="3" lg="2">
                        <h3>CONTACTOS</h3>
                        <ul class="no-bullets">
                            <li><a class="li-color" href="https://www.hypatiamat.com/contacto.php">Contacto</a></li>
                        </ul>
                    </v-col>
                    <v-col class="pa-4" cols="12" sm="6" md="3" lg="2">
                        <h3>CONTRIBUTOS</h3>
                        <ul class="no-bullets">
                            <li><a class="li-color" href="https://www.hypatiamat.com/contributos.php">Contributos</a></li>
                            <!--<li><a href="#">Voluntários</a></li>
                            <li><a href="#">Donativos</a></li>-->
                        </ul>
                        <span style="color:white "></span>
                    </v-col>
                    <v-col class="pa-4" cols="12" sm="6" md="3" lg="2">
                        <h3>FORMAÇÃO</h3>
                        <ul class="no-bullets">
                            <li><a class="li-color" href="https://www.hypatiamat.com/formacaopalestrasworkshops.php">Formação, Palestras e Workshops</a></li>
                        </ul>
                    </v-col>
                    <v-col class="pa-4" cols="12" sm="6" md="3" lg="2">
                        <h3>SOCIAL</h3>
                        <ul class="no-bullets">
                            <li><a class="li-color" href="https://www.facebook.com/hypatiamat" target="_blank">Facebook</a></li>
                            <li><a class="li-color" href="https://www.youtube.com/channel/UCk3CN9sYSXY60jtaIQreMzw" target="_blank">Youtube</a></li>
                            <li><a class="li-color" href="https://www.instagram.com/hypatiamate/" target="_blank">Instagram</a></li>
                        </ul>
                    </v-col>
                    <v-col class="pa-4" cols="12" sm="6" md="3" lg="2">
                        <h3>TERMOS E CONDIÇÕES</h3>
                        <ul class="no-bullets">
                            <li><a class="li-color" href="https://www.hypatiamat.com/termosCondicoes.php" target="_blank">Termos e condições</a></li>
                            <li><a class="li-color" href="https://www.hypatiamat.com/termosCondicoes.php" target="_blank">Política de Privacidade</a></li>
                        </ul>
                    </v-col>
                    <v-col class="pa-4" cols="12" sm="6" md="3" lg="2">
                        <h3>HINO</h3>
                        <ul class="no-bullets">
                            <li><a class="li-color" href="https://youtu.be/TD0Y0r5lLvc" target="_blank">Hino do Hypatiamat</a></li>
                        </ul>
                    </v-col>
                </v-row>

                <v-divider></v-divider>

                <v-card-text class="white--text align-center">
                   <center> <span style="font-size:17px">&#0169;</span>{{ new Date().getFullYear() }} — <strong>Hypatiamat</strong></center>
                </v-card-text>

                </v-card>
            </v-footer>
    </v-main>
  </v-app> 
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
        novidades:[],
        novidadesView:[],
        pagination: {
            page: 1,
            total: 0,
            perPage: 8,
        },
      }
    },
    created: async function(){
        this.token = localStorage.getItem("token")
        this.atualizaNovidades()

    },
    computed:{
        mobile(){
            return this.$vuetify.breakpoint.xs
        }
    },
    methods: {
      atualizaNovidades: async function(){
        var response = await axios.get(h + "novidades/info?token=" + this.token)
        this.novidades = response.data
        this.pagination.total = Math.ceil(
        this.novidades.length / this.pagination.perPage
        );
        this.showNovidades();
      },
      showNovidades: function () {
        this.novidadesView = [];
        for (
            var i = 0;
            i < this.novidades.length &&
            i < this.pagination.page * this.pagination.perPage;
            i++
        ) {
            this.novidadesView.push(this.novidades[i]);
        }
    },
      goToLink: function(link){
        window.open(link, '_blank')
      }
    }
  }
</script>


<style scoped>
.fixed-bar {
  position: sticky;
  position: -webkit-sticky; /* for Safari */
  top: 2;
  z-index: 2;
  transform: translate3d(0, 0, 0);
  transition: 0.2s all ease-out;
}

ul.no-bullets {
  list-style-type: none; /* Remove bullets */
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
  color: white;
}

a.li-color {
    color: #009263;
    text-decoration: none;
    font-size: 14px;
}

</style>