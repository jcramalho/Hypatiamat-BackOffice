<template>
<v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            sm="2"
            align="center"
            justify="center"
          >
            <v-sheet
              rounded="lg"
              min-height="268"
            >

            <v-container>
                <v-dialog
                    v-model="dialogImage"
                    width="500"

                >
                        <v-card>
                          <v-img
                            :src= user.profileImg
                          />
                        </v-card>
                </v-dialog>
                    <v-avatar color="grey darken-3" style="display: inline-block; cursor: pointer;" size="130">
                        <v-img
                            class="elevation-6"
                            :src= user.profileImg
                            @click="dialogImage = true"
                        ></v-img>
                    </v-avatar>
                    <br>
                    <v-card-text class="text-xs-center">
                        <h3> {{user.username}} </h3>
                        <br>
                        <h4 @click="showFollowers()" style="display: inline-block; cursor: pointer;"> Seguidores ({{user.followers}}) </h4>
                        <br>
                        <h4 @click="showFollowing()" style="display: inline-block; cursor: pointer;"> A seguir ({{user.following}}) </h4>
                        <br>
                        <br>
                        <h4> Score : {{user.score}} </h4>
                        <h4> Apostas Ganhas : {{user.betsWin}} </h4>
                        <h4> Odd Média : {{user.MeanOdd}} </h4>
                        <h4> Nº de cópias : {{user.copies}} </h4>
                        <br>
                        <v-btn :color= color class="white--text" @click="updateProfile()">
                            <v-icon>mdi-pencil</v-icon> Editar Perfil
                        </v-btn>

                    </v-card-text>
                        <v-dialog
                        v-model="dialogFollower"
                        width="40%"
                        >
                            <v-card>
                            <v-text-field
                            v-model="filter"
                            label="Filtrar"
                            single-line
                            ></v-text-field>
                            <v-data-table
                            :headers="header_follow"
                            :items="followers"
                            :footer-props="footer_props"
                            :search="filter"
                            >
                            <template v-slot:item="row">
                            <tr>
                                <td>
                                <v-avatar color="grey darken-3" style="display: inline-block; cursor: pointer;" >
                                    <v-img
                                        :src= row.item.profileImg
                                        @click="goToProfile(row.item.iduser)"
                                    ></v-img>
                                </v-avatar>
                                </td>
                                <td @click="goToProfile(row.item.iduser)" style="display: inline-block; cursor: pointer;" >{{row.item.username}}</td>
                                <td>
                                <v-icon @click="deleteFollower(user.iduser, row.item.iduser)"> mdi-delete </v-icon>
                                </td>
                            </tr>
                            </template>
                            </v-data-table>
                            </v-card>
                        </v-dialog>
                        <v-dialog
                        v-model="dialogFollowing"
                        >
                            <v-card width="40%">
                            <v-text-field
                            v-model="filter"
                            label="Filtrar"
                            single-line
                            ></v-text-field>
                            <v-data-table
                            :headers="header_follow"
                            :items="following"
                            :footer-props="footer_props"
                            :search="filter"
                            >
                            <template v-slot:item="row">
                            <tr>
                                <td>
                                <v-avatar color="grey darken-3" style="display: inline-block; cursor: pointer;" >
                                    <v-img
                                        :src= row.item.profileImg
                                        @click="goToProfile(row.item.iduser)"
                                    ></v-img>
                                </v-avatar>
                                </td>
                                <td @click="goToProfile(row.item.iduser)" style="display: inline-block; cursor: pointer;" >{{row.item.username}}</td>
                                <td>
                                <v-icon @click="deleteFollower(row.item.iduser, user.iduser)"> mdi-delete </v-icon>
                                </td>
                            </tr>
                            </template>
                            </v-data-table>
                            </v-card>
                        </v-dialog>
            </v-container>

            </v-sheet>
          </v-col>

          <v-col
            cols="12"
            sm="10"
          >
            <v-sheet
              min-height="70vh"
              rounded="lg"
            >
              <!--  -->
              <v-container >
                <v-card-title primary-title class="justify-center"> Suas Publicações </v-card-title>
              </v-container>

            </v-sheet>
          </v-col>


        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios"

export default {
  components:{
  },
  data(){
    return {
        color: "#FF0000",
        dialogImage: false,
        dialogFollowing : false,
        header_follow: [
            {text: "Foto", sortable: true, value: 'profileImg', class: 'subtitle-1'},
            {text: "Username", value: 'username', class: 'subtitle-1'},
            {text: "Apagar", class: 'subtitle-1'},
        ],
        footer_props: {
            "items-per-page-text": "Mostrar",
            "items-per-page-options": [5, 10, 20, -1],
            "items-per-page-all-text": "Todos"
        },
        filter : "",
        dialogFollower : false,
        user:{
            iduser : 1,
            username : "Luizz",
            birthdate : "1997-01-01",
            email : "loles@loles.com",
            name : "Luis",
            followers : 100,
            following : 20,
            score : 99,
            profileImg : 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
            betsWin : 1000,
            MeanOdd : 2.00,
            copies : 0
        },
        followers:[
            {
                iduser : 2,
                username : "lol1",
                profileImg : 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
            },
            {
                iduser : 3,
                username : "lol2",
                profileImg : 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
            }
        ],
        following:[
            {
                iduser : 2,
                username : "lol1",
                profileImg : 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
            },
            {
                iduser : 3,
                username : "lol2",
                profileImg : 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
            }
        ]
    }
  },
    created: async function() {
        // ir ao token, buscar informações do user (com autenticação)
    },
    methods:{
        updateProfile: function(){
            this.$router.push({ name: 'Editar Perfil'})
        },
        showFollowers: function(){
            // ir buscar os seguidores à api
            this.dialogFollower = true
        },
        showFollowing: function(){
            // ir buscar quem ele segue à api
            this.dialogFollowing = true
        },
        deleteFollower: function(follower, following){

        },
        goToProfile: function(iduser){
          this.$router.push({name: 'Perfil', params:{ id : iduser}})
        }
    }

}
</script>
