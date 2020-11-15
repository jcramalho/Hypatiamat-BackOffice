<template>
  <v-content>
    <div >
      <transition
        name="fade"
        mode="out-in"
      >
        <router-view :key="$route.fullPath" @refreshLogout="refreshLogout" />
      </transition>
    </div>
  </v-content>
</template>

<script>
export default {
  metaInfo () {
    return {
      title: 'Vuetify Material Dashboard by CreativeTim'
    }
  },
  methods:{
      refreshLogout :function(){
       this.$emit('refreshLogout')
     },
  }
}
</script>

<style>
#core-view {
  padding-bottom: 100px;
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
