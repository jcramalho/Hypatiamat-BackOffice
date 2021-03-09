import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
const h = require("@/config/hosts").hostAPI

import AuthApp from '../views/AuthApp.vue'
import MyProfile from '../views/MyProfile.vue'
import Professores from '../views/Professores.vue'
import CodigosProfessores from '../views/CodigosProfessores.vue'
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
import CriarAluno from '../views/CriarAluno.vue'
import CriarEscola from '../views/CriarEscola.vue'
import CriarProfessor from '../views/CriarProfessor.vue'
import Pendentes from '../views/Pendentes.vue'
import Jogos from '../views/Jogos.vue'
import JogosTurma from '../views/JogosTurma.vue'
import JogosAluno from '../views/JogosAluno.vue'
import JogosMunicipios from '../views/JogosMunicipios.vue'
import JogosEscolas from '../views/JogosEscolas.vue'
import JogosProfessores from '../views/JogosProfessores.vue'
import AppsMunicipios from '../views/AppsMunicipios.vue'
import AppsEscolas from '../views/AppsEscolas.vue'
import AppsProfessores from '../views/AppsProfessores.vue'
import AppsTurmas from '../views/AppsTurmas.vue'
import Apps from '../views/Apps.vue'
import AppsAluno from '../views/AppsAluno.vue'
import AlunosTurma from '../views/AlunosTurma.vue'
import MonotorizacaoJogos from '../views/MonotorizacaoJogos.vue'
import Agrupamentos from '../views/Agrupamentos.vue'
import AgrupamentoProfessores from '../views/AgrupamentoProfessores.vue'
import EstatisticasMunicipios from '../views/EstatisticasMunicipios.vue'
import EstatisticasAgrupamentos from '../views/EstatisticasAgrupamentos.vue'
import EstatisticasProfessores from '../views/EstatisticasProfessores.vue'
import Pendentes2 from '../views/Pendentes2.vue'
import GestaoTurmas from '../views/GestaoTurmas.vue'
import GestaoAlunos from '../views/GestaoAlunos.vue'
import RankingJogos from '../views/RankingJogos.vue'
import RankingApps from '../views/RankingApps.vue'
import RankingJogosAdmin from '../views/RankingJogosAdmin.vue'
import RankingAppsAdmin from '../views/RankingAppsAdmin.vue'
import CampeonatosMunicipios from '../views/CampeonatosMunicipios.vue'
import CampeonatosAgrupamentos from '../views/CampeonatosAgrupamentos.vue'
import CampeonatosProfessores from '../views/CampeonatosProfessores.vue'
import CampeonatosTurmas from '../views/CampeonatosTurmas.vue'
import Comunidades from '../views/Comunidades.vue'




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
    path: '/comunidades',
    name: 'Comunidades',
    component: Comunidades,
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
    path: '/profspendentes',
    name: 'Professores Pendentes',
    component: Pendentes2,
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
    path: '/codigosprof',
    name: 'Códigos Professores',
    component: CodigosProfessores,
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
    path: '/gestaoTurmas',
    name: 'Gestão de Turmas',
    component: GestaoTurmas,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 20){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/gestaoAlunos',
    name: 'Gestão de Alunos',
    component: GestaoAlunos,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 20){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/agrupamentos',
    name: 'Agrupamentos',
    component: Agrupamentos,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 30){
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
      if( utilizador.type == 20 ){
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
    path: '/classificacoes/jogos',
    name: 'Ranking Jogos',
    component: RankingJogos,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 50 || utilizador.type == 20)){
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
    path: '/classificacoes/jogos/admin',
    name: 'Ranking Jogos Admin',
    component: RankingJogosAdmin,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 50)){
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
    path: '/classificacoes/apps',
    name: 'Ranking Apps',
    component: RankingApps,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 50 || utilizador.type == 20)){
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
    path: '/classificacoes/apps/admin',
    name: 'Ranking Apps Admin',
    component: RankingAppsAdmin,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 50)){
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
    path: '/jogos/municipios',
    name: 'Jogos Municipio',
    component: JogosMunicipios,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 50)){
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
    path: '/estatisticas/municipios',
    name: 'Estatisticas Municipio',
    component: EstatisticasMunicipios,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 50)){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    },
    meta: {
      title: "Esatísticas",
      icon:"../assets/logo.png" 
    }
  },
  {
    path: '/estatisticas/municipios/:municipio',
    name: 'Estatisticas Agrupamentos',
    component: EstatisticasAgrupamentos,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 50)){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    },
    meta: {
      title: "Esatísticas",
      icon:"../assets/logo.png" 
    }
  },
  {
    path: '/estatisticas/escolas/:escola',
    name: 'Estatisticas Professores',
    component: EstatisticasProfessores,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 50)){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    },
    meta: {
      title: "Esatísticas",
      icon:"../assets/logo.png" 
    }
  },
  {
    path: '/apps/municipios',
    name: 'Apps Municipios',
    component: AppsMunicipios,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 50)){
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
    path: '/campeonatos/municipios',
    name: 'Campeonatos Municipios',
    component: CampeonatosMunicipios,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 50)){
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
    path: '/campeonatos/municipios/:municipio',
    name: 'Campeonatos Agrupamentos',
    component: CampeonatosAgrupamentos,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 50)){
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
    path: '/campeonatos/escolas/:escola',
    name: 'Campeonatos Professores',
    component: CampeonatosProfessores,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 50)){
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
    path: '/campeonatos/professores/:codprofessor',
    name: 'Campeonatos Turmas',
    component: CampeonatosTurmas,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 50) || (utilizador.type == 20 && utilizador.codigo == to.params.codprofessor)){
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
    path: '/jogos/:idprofessor',
    name: 'Jogos Turma',
    component: JogosTurma,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 30){
        // ir buscar os professores pertencentes ao municipio
      }
      if( utilizador.type == 50 || (utilizador.type == 30) || (utilizador.type == 20 && utilizador.codigo == to.params.idprofessor)){
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
    path: '/apps/:idprofessor',
    name: 'Apps Turmas',
    component: AppsTurmas,
    beforeEnter: async (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      let token = localStorage.getItem("token")
      var professores = []
      if(utilizador.type == 40){
        var response = await axios.get(h + "escolas/" + utilizador.escola + "/professores?token=" + token)
        professores = response.data
      }
      if( utilizador.type == 50 || utilizador.type == 30 || (utilizador.type == 20 && utilizador.codigo == to.params.idprofessor)
              || (utilizador.type == 40 && professores.find(element=> element.codigo == to.params.idprofessor))){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    },
    meta: {
      title: "Apps",
      icon:"../assets/logo.png" 
    }
  },
  {
    path: '/jogos/:municipio/escolas',
    name: 'Jogos Escolas',
    component: JogosEscolas,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      // fazer algo para garantir que o municipio apenas entre para ver escolas do seu municipio e não de outros municipios
      if((utilizador.type == 50) || (utilizador.type == 30 || to.params.municipio == utilizador.infoEscola.localidade)){
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
    path: '/apps/:municipio/escolas',
    name: 'Apps Escolas',
    component: AppsEscolas,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      // fazer algo para garantir que o municipio apenas entre para ver escolas do seu municipio e não de outros municipios
      if((utilizador.type == 50) || (utilizador.type == 30 && to.params.municipio == utilizador.infoEscola.localidade)){
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
    path: '/escolas/:id/jogos',
    name: 'Jogos Professores',
    component: JogosProfessores,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      // fazer algo para garantir que o municipio apenas entre para ver escolas do seu municipio e não de outros municipios
      if((utilizador.type == 50) || (utilizador.type == 30 && utilizador.escolas.find(element => element.cod == to.params.id)) 
                    || (utilizador.type == 40 && utilizador.escola == to.params.id)){
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
    path: '/escolas/:escola/apps',
    name: 'Apps Professores',
    component: AppsProfessores,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      // fazer algo para garantir que o municipio apenas entre para ver escolas do seu municipio e não de outros municipios
      if((utilizador.type == 50) || (utilizador.type == 30 && utilizador.escolas.find(element=>element.cod == to.params.escola)) 
          || (utilizador.type == 40 && utilizador.escola == to.params.escola)){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    },
    meta: {
      title: "Apps Escola",
      icon:"../assets/logo.png" 
    }
  },
  {
    path: '/escolas/:escola/professores',
    name: 'Professores Agrupamento',
    component: AgrupamentoProfessores,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      // fazer algo para garantir que o municipio apenas entre para ver escolas do seu municipio e não de outros municipios
      if((utilizador.type == 50) || (utilizador.type == 30 && utilizador.escolas.find(element=>element.cod == to.params.escola)) || (utilizador.type == 40)){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    },
    meta: {
      title: "Professores Agrupamento",
      icon:"../assets/logo.png" 
    }
  },
  {
    path: '/monotorizacaojogos',
    name: 'Monotorizacao Jogos',
    component: MonotorizacaoJogos,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 50){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    },
    meta: {
      title: "Monotorização",
      icon:"../assets/logo.png" 
    }
  },
  {
    path: '/apps',
    name: 'Apps',
    component: Apps,
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
      title: "Apps",
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
    path: '/appsAluno',
    name: 'Apps Alunos',
    component: AppsAluno,
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
      if(utilizador.type == 50 || (utilizador.type == 20) || (utilizador.type == 10 && utilizador.id == to.params.id)){
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
    path: '/editarTurma/:idprofessor/:turma',
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
    path: '/verTurma/:id',
    name: 'Ver Turma',
    component: AlunosTurma,
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
      if(utilizador.type == 50 || utilizador.type == 20 || utilizador.type == 40){
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
      if(utilizador.type == 50 || utilizador.type == 20){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/criarProfessor',
    name: 'Criar Professor',
    component: CriarProfessor,
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
    path: '/criarEscola',
    name: 'Criar Escola',
    component: CriarEscola,
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
    path: '/criarAluno',
    name: 'Criar Aluno',
    component: CriarAluno,
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
