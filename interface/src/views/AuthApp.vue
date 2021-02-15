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
    <Navbar @refreshLogout="refreshLogout"/>
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
  <v-container>
      <router-view/>
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
      color: "#FF0000"
    }
  },
  methods:{
    refreshLogout : function(){
      this.$emit("refreshLogout")
    }
  }

}
</script>
