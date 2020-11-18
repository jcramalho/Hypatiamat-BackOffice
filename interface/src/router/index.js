import Vue from 'vue'
import VueRouter from 'vue-router'

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
import MinhasTurmas from '../views/MinhasTurmas.vue'
import CriarTurma from '../views/CriarTurma.vue'



Vue.use(VueRouter)

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
    component: Professores
  },
  {
    path: '/alunos',
    name: 'Alunos',
    component: Alunos
  },
  {
    path: '/escolas',
    name: 'Escolas',
    component: Escolas
  },
  {
    path: '/turmas',
    name: 'Turmas',
    component: Turmas
  },
  {
    path: '/',
    name: 'Meu Perfil',
    component: MyProfile
  },
  {
    path: '/professores/:id',
    name: 'Ver Professor',
    component: Professor
  },
  {
    path: '/editarProfessor/:id',
    name: 'Editar Professor',
    component: EditarProfessor
  },
  {
    path: '/editarAluno/:id',
    name: 'Editar Aluno',
    component: EditarAluno
  },
  {
    path: '/editarEscola/:id',
    name: 'Editar Escola',
    component: EditarEscola
  },
  {
    path: '/editarTurma/:id',
    name: 'Editar Turma',
    component: EditarTurma
  },
  {
    path: '/professores/:id',
    name: 'Professor',
    component: Professor
  },
  {
    path: '/alunos/:id',
    name: 'Aluno',
    component: Aluno
  },
  {
    path: '/minhasturmas',
    name: 'Minhas Turmas',
    component: MinhasTurmas
  },
  {
    path: '/criarTurma',
    name: 'Criar Turma',
    component: CriarTurma
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
