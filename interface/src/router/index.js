import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
const h = require("@/config/hosts").hostAPI

import AuthApp from '../views/AuthApp.vue'
import Perfil from '../views/Perfil.vue'


import Pendentes from '../views/Pendentes/Pendentes.vue'
import Pendentes2 from '../views/Pendentes/Pendentes2.vue'


import EditarTurma from '../views/Turmas/EditarTurma.vue'
import EditarMinhaTurma from '../views/Turmas/EditarMinhaTurma.vue'
import MinhasTurmas from '../views/Turmas/MinhasTurmas.vue'
import CriarTurma from '../views/Turmas/CriarTurma.vue'
import Turmas from '../views/Turmas/Turmas.vue'
import AlunosTurma from '../views/Turmas/AlunosTurma.vue'
import GestaoTurmas from '../views/Turmas/GestaoTurmas.vue'
import GestaoAlunos from '../views/Turmas/GestaoAlunos.vue'
import DesempenhoTurmas from '../views/Turmas/DesempenhoTurmas.vue'
import TurmasProf from '../views/Turmas/TurmasProf.vue'


import CriarProfessor from '../views/Professores/CriarProfessor.vue'
import CodigosProfessores from '../views/Professores/CodigosProfessores.vue'
import EditarProfessor from '../views/Professores/EditarProfessor.vue'
import Professores from '../views/Professores/Professores.vue'
import EnviarMensagem from '../views/Professores/EnviarMensagem.vue'


import CriarAluno from '../views/Alunos/CriarAluno.vue'
import EditarAluno from '../views/Alunos/EditarAluno.vue'
import Alunos from '../views/Alunos/Alunos.vue'
import MensagensAluno from '../views/Alunos/MensagensAluno.vue'
import Cromos from '../views/Alunos/Cromos.vue'




import CriarEscola from '../views/Escolas/CriarEscola.vue'
import Escolas from '../views/Escolas/Escolas.vue'
import EditarEscola from '../views/Escolas/EditarEscola.vue'
import Agrupamentos from '../views/Escolas/Agrupamentos.vue'
import AgrupamentoProfessores from '../views/Escolas/AgrupamentoProfessores.vue'


import Jogos from '../views/Jogos/Jogos.vue'
import JogosTurma from '../views/Jogos/JogosTurma.vue'
import JogosAluno from '../views/Jogos/JogosAluno.vue'
import JogosMunicipios from '../views/Jogos/JogosMunicipios.vue'
import JogosEscolas from '../views/Jogos/JogosEscolas.vue'
import JogosProfessores from '../views/Jogos/JogosProfessores.vue'
import MonotorizacaoJogos from '../views/Jogos/MonotorizacaoJogos.vue'


import AppsMunicipios from '../views/Apps/AppsMunicipios.vue'
import AppsEscolas from '../views/Apps/AppsEscolas.vue'
import AppsProfessores from '../views/Apps/AppsProfessores.vue'
import AppsTurmas from '../views/Apps/AppsTurmas.vue'
import Apps from '../views/Apps/Apps.vue'
import AppsAluno from '../views/Apps/AppsAluno.vue'


import EstatisticasMunicipios from '../views/OutrasEstatisticas/EstatisticasMunicipios.vue'
import EstatisticasAgrupamentos from '../views/OutrasEstatisticas/EstatisticasAgrupamentos.vue'
import EstatisticasProfessores from '../views/OutrasEstatisticas/EstatisticasProfessores.vue'


import CampeonatosMunicipios from '../views/Campeonatos/CampeonatosMunicipios.vue'
import CampeonatosAgrupamentos from '../views/Campeonatos/CampeonatosAgrupamentos.vue'
import CampeonatosProfessores from '../views/Campeonatos/CampeonatosProfessores.vue'
import CampeonatosTurmas from '../views/Campeonatos/CampeonatosTurmas.vue'
import DesempenhoAluno from '../views/Campeonatos/DesempenhoAluno.vue'
import GestaoCampeonatos from '../views/Campeonatos/GestaoCampeonatos.vue'
import CampeonatosGeralAdmin from '../views/Campeonatos/CampeonatosGeralAdmin.vue'


import RankingJogos from '../views/Rankings/RankingJogos.vue'
import RankingApps from '../views/Rankings/RankingApps.vue'
import RankingJogosAdmin from '../views/Rankings/RankingJogosAdmin.vue'
import RankingAppsAdmin from '../views/Rankings/RankingAppsAdmin.vue'
import RankingJogosMunicipio from '../views/Rankings/RankingJogosMunicipio.vue'
import RankingAppsMunicipio from '../views/Rankings/RankingAppsMunicipio.vue'
import RankingJogosAgrupamento from '../views/Rankings/RankingJogosAgrupamento.vue'
import RankingAppsAgrupamento from '../views/Rankings/RankingAppsAgrupamento.vue'



import GestaoNovidades from '../views/Novidades/GestaoNovidades.vue'
import Novidades from '../views/Novidades/Novidades.vue'


import Comunidades from '../views/Comunidades/Comunidades.vue'

import GestaoCromos from '../views/Cromos/GestaoCromos.vue'


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
    path: '/novidades',
    name: 'Gestão Novidades',
    component: GestaoNovidades,
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
    path: '/novidades/lista',
    name: 'Novidades',
    component: Novidades,
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
    path: '/gestao/campeonatos',
    name: 'Gestão Campeonatos',
    component: GestaoCampeonatos,
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
    path: '/gestao/cromos',
    name: 'Gestão Cromos',
    component: GestaoCromos,
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
    path: '/classificacoes/jogos/municipio',
    name: 'Ranking Jogos Município',
    component: RankingJogosMunicipio,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 30)){
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
    path: '/classificacoes/jogos/escola',
    name: 'Ranking Jogos Agrupamento',
    component: RankingJogosAgrupamento,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 40)){
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
    path: '/classificacoes/apps/municipio',
    name: 'Ranking Apps Municipio',
    component: RankingAppsMunicipio,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 30)){
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
    path: '/classificacoes/apps/escola',
    name: 'Ranking Apps Agrupamento',
    component: RankingAppsAgrupamento,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 40)){
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
      if((utilizador.type == 50) || (utilizador.type == 30 && utilizador.infoEscola.localidade == to.params.municipio)){
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
      if((utilizador.type == 50) || (utilizador.type == 30 && utilizador.escolas.find(e => e.cod == to.params.escola)) 
            || (utilizador.type == 40 && utilizador.escola == to.params.escola) ){
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
    path: '/campeonatos/geral',
    name: 'Ranking Geral Campeonatos',
    component: CampeonatosGeralAdmin,
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
    path: '/professores/mensagens',
    name: 'Enviar Mensagens',
    component: EnviarMensagem,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 20)){
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
    path: '/alunos/mensagens',
    name: 'Mensagens',
    component: MensagensAluno,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 10)){
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
    path: '/alunos/cromos',
    name: 'Caderneta',
    component: Cromos,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if((utilizador.type == 10)){
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
      if((utilizador.type == 50) || (utilizador.type == 30 && utilizador.infoEscola.localidade == to.params.municipio) ){
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
      if((utilizador.type == 50) || (utilizador.type == 30 && utilizador.escolas.find(e => e.cod == to.params.escola)) ||
         (utilizador.type == 40 && utilizador.escola == to.params.escola)){
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
    beforeEnter: async (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      let token = localStorage.getItem("token")
      var professor
      if(utilizador.type == 40 || utilizador.type == 30){
        var response = await axios.get(h + "professores/codigos/" + to.params.codprofessor + "?token=" + token)
                                  .catch(() => next({name: "Meu Perfil"}))
        professor = response.data
      }
    
      if((utilizador.type == 50) || (utilizador.type == 20 && utilizador.codigo == to.params.codprofessor)
        || (utilizador.type == 30 && professor) || (utilizador.type == 40 && professor.escola == utilizador.escola)){
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
    path: '/campeonatos/alunos/:user',
    name: 'Campeonatos Alunos',
    component: DesempenhoAluno,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 10 && utilizador.user == to.params.user){
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
    beforeEnter: async (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      let token = localStorage.getItem("token")
      var professor
      if(utilizador.type == 30 || utilizador.type == 40){
        var response = await axios.get(h + "professores/codigos/" + to.params.idprofessor + "?token=" + token)
                                  .catch(() => next({name: "Meu Perfil"}))
        professor = response.data
      }
      if( utilizador.type == 50 || (utilizador.type == 30 && professor) || (utilizador.type == 40 && professor) ||
        (utilizador.type == 20 && utilizador.codigo == to.params.idprofessor)){
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
      if( utilizador.type == 50 || utilizador.type == 30 || 
            (utilizador.type == 20 && utilizador.codigo == to.params.idprofessor)
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
      if((utilizador.type == 50) || (utilizador.type == 30 && utilizador.escolas.find(element=>element.cod == to.params.escola)) 
          || (utilizador.type == 40 && utilizador.escola == to.params.escola)){
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
    component: Perfil
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
      var response
      if(utilizador.type==20) response = await axios.get(h + "professores/" + utilizador.codigo + "/turmas?token=" + token)
     // else if(utilizador.type==30) response = await axios.get(h + "professores/codigos/" + to.params.codigo + "?token=" + token) 
       //                                                  .catch(() => next({name: "Meu Perfil"}))
      //console.log(response.data)
      if(utilizador.type == 50 || (utilizador.type == 20 && (pertence(response.data, to.params.id))) ||
         (utilizador.type == 30) || (utilizador.type == 40)){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  /*
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
  },*/
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
  },
  {
    path: '/professores/:codigo/turmas',
    name: 'Turmas Professor',
    component: TurmasProf,
    beforeEnter: async (to, from, next) => {
      let token = localStorage.getItem('token')
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      var professor
      if(utilizador.type == 40 || utilizador.type == 30){
        var response = await axios.get(h + "professores/codigos/" + to.params.codigo + "?token=" + token)
                                  .catch(() => next({name: "Meu Perfil"}))
        professor = response.data
      }
      if(utilizador.type == 50 || (utilizador.type == 30 && professor) || (utilizador.type == 40 && professor)){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    }
  },
  {
    path: '/desempenho/:codprofessor/turmas',
    name: 'Desempenho Geral',
    component: DesempenhoTurmas,
    beforeEnter: (to, from, next) => {
      let utilizador = JSON.parse(localStorage.getItem("utilizador"))
      if(utilizador.type == 20 && utilizador.codigo == to.params.codprofessor){
        next()
      }
      else{
        next({name: "Meu Perfil"})
      }
    },
    
  },


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
