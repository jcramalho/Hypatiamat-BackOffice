import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
const h = require("@/config/hosts").hostAPI

import AuthApp from '../views/AuthApp.vue'
import MyProfile from '../views/MyProfile.vue'
import Professores from '../views/Professores.vue'
import Alunos from '../views/Alunos.vue'
import Escolas from '../views/Escolas.vue'
import Turmas from '../views/Turmas.vue'
import Professor from '../views/Professor.vue'
import Aluno from '../views/Aluno.vue'
import EditarProfessor from '../views/EditarProfessor.vue'
import EditarAluno from '../views/EditarAluno.vue'
import EditarEscola from '../views/EditarEscola.vue'
import EditarTurma from '../views/EditarTurma.vue'
import EditarMinhaTurma from '../views/EditarMinhaTurma.vue'
import MinhasTurmas from '../views/MinhasTurmas.vue'
import CriarTurma from '../views/CriarTurma.vue'
import Pendentes from '../views/Pendentes.vue'
import Jogos from '../views/Jogos.vue'
import JogosAluno from '../views/JogosAluno.vue'





Vue.use(VueRouter)

function pertence(turmas, idTurma){
  var i
  var result = false
  for(i = 0; i < turmas.length; i++){
    if(turmas[i].id == idTurma) {result = true; break}
  }
  return result
}

const routes = [
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/professores',
    name: 'Professores',
    component: Professores,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 50){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/jogos',
    name: 'Jogos',
    component: Jogos,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 20){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    },
    meta: {
      title: "Jogos",
      icon:"../assets/logo.png" 
    }
  },
  {
    path: '/jogosAluno',
    name: 'Jogos Alunos',
    component: JogosAluno,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 10){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/alunos',
    name: 'Alunos',
    component: Alunos,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 50){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/escolas',
    name: 'Escolas',
    component: Escolas,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 50){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/turmas',
    name: 'Turmas',
    component: Turmas,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 50){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/',
    name: 'Meu Perfil',
    component: MyProfile
  },
  {
    path: '/professores/:id',
    name: 'Ver Professor',
    component: Professor,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 50){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/editarProfessor/:id',
    name: 'Editar Professor',
    component: EditarProfessor,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 50 || utilizador.id == to.params.id){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/editarAluno/:id',
    name: 'Editar Aluno',
    component: EditarAluno,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 50 || (utilizador.type == 10 && utilizador.id == to.params.id)){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/editarEscola/:id',
    name: 'Editar Escola',
    component: EditarEscola,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 50){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/editarTurma/:id/:minhaTurma',
    name: 'Editar Turma',
    component: EditarTurma,
    beforeEnter: async (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      let token = localStorage.getItem("token")
      // falta permitir um professor que possua turma puder alterar
      //var response = await axios.get(h + "professores/" + utilizador.codigo + "/turmas?token=" + token)
      //console.log(response.data)
      if(utilizador.type == 50 || (utilizador.type == 20 && (pertence(response.data, to.params.id)))){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/editarMinhaTurma/:id',
    name: 'Editar Minha Turma',
    component: EditarMinhaTurma,
    beforeEnter: async (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      let token = localStorage.getItem("token")
      // falta permitir um professor que possua turma puder alterar
      var response = await axios.get(h + "professores/" + utilizador.codigo + "/turmas?token=" + token)
      //console.log(response.data)
      if(utilizador.type == 50 || (utilizador.type == 20 && (pertence(response.data, to.params.id)))){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/alunos/:id',
    name: 'Aluno',
    component: Aluno,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 50){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/minhasturmas',
    name: 'Minhas Turmas',
    component: MinhasTurmas,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 50 || utilizador.type == 20){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/criarTurma',
    name: 'Criar Turma',
    component: CriarTurma,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 50 || utilizador.type == 10){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/pendentes',
    name: 'Pendentes',
    component: Pendentes,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 50){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  }


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { selector: to.hash }
    }
    return { x: 0, y: 0 }
  },
})

export default router
