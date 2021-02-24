<template>
<div class="grey lighten-3"> 
      <!--<v-row class="grey lighten-3" no-gutters>
    <v-col
      class="grey lighten-3"
      cols="12"
      xs="12"
      sm="12"
      md="2"
      lg="1"
      xl="1"
    >-->
    <Navbar @refreshLogout="refreshLogout" @miniEvent="(value)=>{this.mini=value}"/>

    <!--</v-col>-->
    
    <!--
    <v-col
      class="grey lighten-3"
      cols="12"
      xs="12"
      sm="12"
      md="10"
      lg="11"
      xl="11"
    >-->
  <v-container v-if="mobile" >
      <router-view v-if="mobile" />
  </v-container>
  <v-container v-else class="grey lighten-3">
      <v-main class="grey lighten-3">
        <p :style="styleP"> Dado que se encontra no telemóvel ou num dispositivo pequeno, para visualizar os dados de forma clara, <b> minimize a barra de navegação </b> através do botão '<'. </p> 
      </v-main>
  </v-container>
    <!--</v-col>
    
    </v-row>-->
</div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Views from '@/components/View.vue'

export default {
  components:{
    Navbar,
    Views
  },
  data(){
      return {
      color: "#FF0000",
      mini:true,
      miniVariant: false,
      windowWidth: 0,
      styleP: 'font-size:20px'
    }
  },
  computed: {
    mobile() {
      if (this.$vuetify.breakpoint.xs) return this.mini
      return true
    },
    
    
  },
  created: function(){
    this.windowWidth = window.innerWidth
    this.size()
  },
  mounted: function(){
    window.onresize = () => {
      this.size()
    }
  },
  methods:{
    refreshLogout : function(){
      this.$emit("refreshLogout")
    },
    size(){
        if(window.innerWidth > 500){
          this.styleP = 'font-size:20px'
        }
        else if(window.innerWidth > 400){
          this.styleP = 'font-size:16px'
        }
        else{
          this.styleP = 'font-size:9px'
        }
    }
  }

}
</script>
