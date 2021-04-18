<template>
  <v-footer
    dark
    padless
  >
    <v-card
      padless
      width="100%"
      color="#009263"
      class="white--text text-center"
    >
      <v-card-text>
        <v-tooltip top v-for="icon in icons"
              :key="icon.icon">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="icon.icon!='mdi-information-outline'"
              class="mx-4 white--text"
              v-bind="attrs" 
              v-on="on"
              icon
              :href="icon.href"
            >
              <v-icon size="24px">
                {{ icon.icon }}
              </v-icon>
            </v-btn>
            <v-btn v-else
              class="mx-4 white--text"
              v-bind="attrs" 
              v-on="on"
              icon
              @click="creditosOpen = true"
            >
              <v-icon size="24px">
                {{ icon.icon }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{icon.descricao}}</span>
        </v-tooltip>
      </v-card-text>

      <v-card-text class="white--text pt-0">
        Hypatiamat.
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text align-center">
        <span style="font-size:17px">&#0169;</span>{{ new Date().getFullYear() }} — <strong>Hypatiamat</strong>
      </v-card-text>
    </v-card>
    <v-dialog v-model="creditosOpen" :width="mobile ? '100%' : '70%'">
    <v-card>
      <v-container>
        <v-row class="justify-center align-center">
          <v-col cols="9" sm="7" md="4">
            <div>
              <v-img  
                src="https://admin.googleusercontent.com/logo-scs-key2555945"
              >
              </v-img>
            </div>
          </v-col>
          <hr v-if="mobile">
          <v-col cols="9" sm="7" md="4">
            <div>
              <v-img  :src="require('@/assets/hypatiamat.png')">
              </v-img>
            </div>
          </v-col>
          <br>
          <v-col cols="9" >
            <v-card outlined>
                <center><span class="green--text">Orientadores:</span></center>
                <center><span>José Ramalho</span></center>
                <center><span>Ricardo Pinto</span></center>
            </v-card>
          </v-col>
          <v-col cols="9" >
            <v-card outlined>
                <center><span class="green--text">Desenvolvimento:</span></center>
                <center><span>Luís Martins</span></center>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
  </v-footer>
  
</template>

<script>
  export default {
    data: () => ({
      icons: [
        {icon:'mdi-information-outline', href:"https://www.hypatiamat.com", descricao:"Créditos"},
        {icon:'mdi-web', href:"https://www.hypatiamat.com",  descricao:"Web Site do Hypatiamat"},
        {icon: 'mdi-facebook', href:"https://www.facebook.com/hypatiamat", descricao:"Facebook do Hypatiamat"},
        {icon: 'mdi-instagram', href:"https://www.instagram.com/hypatiamate/", descricao:"Instagram do Hypatiamat"},
        {icon: 'mdi-youtube', href:"https://www.youtube.com/channel/UCk3CN9sYSXY60jtaIQreMzw", descricao:"Canal do Youtube do Hypatiamat"}
      ],
      creditosOpen: false
    }),
    computed: {
      mobile() {
        if (this.$vuetify.breakpoint.xs) return true
        return false
      },
    },
  }
</script>