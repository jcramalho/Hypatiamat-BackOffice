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
    }
  },
  computed: {
    mobile() {
      if (this.$vuetify.breakpoint.xs) return this.mini
      return true
    },
  },
  methods:{
    refreshLogout : function(){
      this.$emit("refreshLogout")
    }
  }

}
</script>
