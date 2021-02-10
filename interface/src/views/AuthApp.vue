<template>

<div class="grey lighten-3"> 

    <Navbar @refreshLogout="refreshLogout"/>

    <v-container>
      <router-view/>
    </v-container>
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
