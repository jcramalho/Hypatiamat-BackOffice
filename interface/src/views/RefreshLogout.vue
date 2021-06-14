
<template>
  <v-app>
    <v-main>
      
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'RefreshLogout',
  data: () => ({
    //
  }),
  mounted(){
      console.log("cheguuueiiiii logout")
      this.$emit("refreshLogout")
  }
};
</script>

<style>
</style>