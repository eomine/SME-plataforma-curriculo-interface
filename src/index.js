import 'bootstrap/dist/css/bootstrap-reboot.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import 'components/layout/FullModal.scss';
import './index.scss';

import React, { Fragment, lazy, Suspense, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { history } from 'utils/history';
import { Provider } from 'react-redux';
import {
  Route,
  Routes,
  unstable_HistoryRouter as HistoryRouter,
  useLocation,
  useNavigationType,
} from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider as MuiThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import Alert from 'components/Alert';
import RouteModals from 'components/RouteModals';
import RoutePage from 'components/RoutePage';
import AppLoading from 'components/loading/AppLoading';
import Confirm from 'components/Confirm';
import Snackbar from 'components/Snackbar';
import moment from 'moment';
// Antes do updateLocale abaixo; as páginas carregam depois, sob demanda.
import 'moment/locale/pt-br';
import reducers from 'reducers';
import { curriculoApi } from 'data/curriculoApi';
import theme from 'utils/theme';
import PageLoading from 'components/loading/PageLoading';

// Páginas e modais carregam sob demanda, cada um no seu chunk.
const Activity = lazy(() => import('views/activity/Activity'));
const AnswerBooks = lazy(() => import('views/answerBooks/AnswerBooks'));
const Basic = lazy(() => import('views/curriculum/Basic'));
const Challenge = lazy(() => import('views/challenge/Challenge'));
const Classrooms = lazy(() => import('views/classrooms/Classrooms'));
const Collection = lazy(() => import('views/collection/Collection'));
const ComplementBooks = lazy(() => import('views/complementBooks/ComplementBooks'));
const ConsultationDetail = lazy(() => import('views/consultations/Detail'));
const Consultations = lazy(() => import('views/consultations/Consultations'));
const CreateCollection = lazy(() => import('views/collection/create/CreateCollection'));
const CreateProject = lazy(() => import('views/projects/CreateProject'));
const EditCollection = lazy(() => import('views/collection/edit/EditCollection'));
const EditProfile = lazy(() => import('views/profile/edit/EditProfile'));
const EditProject = lazy(() => import('views/projects/EditProject'));
const Home = lazy(() => import('views/home/Home'));
const KnowledgeMatrix = lazy(() => import('views/knowledgeMatrix/KnowledgeMatrix'));
const KnowledgeMatrixDetail = lazy(() => import('views/knowledgeMatrix/Detail'));
const LearningObjectives = lazy(() => import('views/learningObjectives/LearningObjectives'));
const Login = lazy(() => import('views/login/Login'));
const Medium = lazy(() => import('views/curriculum/Medium'));
const Methodology = lazy(() => import('views/methodology/Methodology'));
const MyResults = lazy(() => import('views/myResults/MyResults'));
const Profile = lazy(() => import('views/profile/Profile'));
const Project = lazy(() => import('views/project/Project'));
const Projects = lazy(() => import('views/projects/Projects'));
const RateSequence = lazy(() => import('views/sequence/rate/RateSequence'));
const Rating = lazy(() => import('views/sequence/rating/Rating'));
const Redirect = lazy(() => import('views/redirect/Redirect'));
const Result = lazy(() => import('views/result/Result'));
const SaveProject = lazy(() => import('views/project/save/SaveProject'));
const SaveSequence = lazy(() => import('views/sequence/save/SaveSequence'));
const SendResult = lazy(() => import('views/result/send/SendResult'));
const Sequence = lazy(() => import('views/sequence/Sequence'));
const Sequences = lazy(() => import('views/sequences/Sequences'));
const SurveyForm = lazy(() => import('views/surveyForm/SurveyForm'));
const SustainableDevGoalDetail = lazy(() => import('views/sustainableDevGoals/Detail'));
const SustainableDevGoals = lazy(() => import('views/sustainableDevGoals/SustainableDevGoals'));
const Technologies = lazy(() => import('views/technologies/Technologies'));

moment.updateLocale('pt-br', {
  relativeTime : {
    past : '%s atrás',
  },
});

// O configureStore já inclui o thunk e liga o Redux DevTools em desenvolvimento.
const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // Não serializáveis de propósito: os argumentos e o meta das queries
      // (padrão do RTK; FormData e arquivos nas mutations) e o Headers da
      // resposta nas actions antigas (data/Api, nenhum reducer lê).
      serializableCheck: {
        ignoredActionPaths: ['meta.arg', 'meta.baseQueryMeta', 'headers'],
      },
    }).concat(curriculoApi.middleware),
});

// Rotas abertas em modal (veja RouteModals).
const modalRoutes = [
  { path: '/ods/:id/*', element: <RoutePage component={SustainableDevGoalDetail} />, handle: 'full' },
  { path: '/consultas-publicas/:id/*', element: <RoutePage component={ConsultationDetail} />, handle: 'full' },
  { path: '/matriz-de-saberes/:index', element: <RoutePage component={KnowledgeMatrixDetail} />, handle: 'full' },
  { path: '/perfil/turmas', element: <RoutePage component={Classrooms} /> },
  { path: '/perfil/criar-colecao', element: <RoutePage component={CreateCollection} /> },
  { path: '/perfil/editar', element: <RoutePage component={EditProfile} /> },
  { path: '/colecao/:id/editar', element: <RoutePage component={EditCollection} /> },
  { path: '/login', element: <RoutePage component={Login} /> },
  { path: '/sequencia/:slug/avaliacao', element: <RoutePage component={Rating} /> },
  { path: '/sequencia/:slug/avaliar', element: <RoutePage component={RateSequence} /> },
  { path: '/sequencia/:slug/criar-colecao', element: <RoutePage component={CreateCollection} /> },
  { path: '/sequencias/:slug/criar-colecao', element: <RoutePage component={CreateCollection} /> },
  { path: '/sequencia/:slug/salvar', element: <RoutePage component={SaveSequence} /> },
  { path: '/sequencias/:slug/salvar', element: <RoutePage component={SaveSequence} /> },
  { path: '/projetos/:slug/criar-colecao', element: <RoutePage component={CreateCollection} /> },
  { path: '/projeto/:slug/salvar', element: <RoutePage component={SaveProject} /> },
  { path: '/projetos/:slug/salvar', element: <RoutePage component={SaveProject} /> },
  { path: '/desafio/:slug/enviar', element: <RoutePage component={SendResult} /> },
  { path: '/desafio/:slug/meus-resultados', element: <RoutePage component={MyResults} /> },
  { path: '/desafio/:slug/resultado/:id', element: <RoutePage component={Result} /> },
];

// Quando o link pede um modal (createModalLink), a página de baixo continua
// mostrando a URL anterior e o modal mostra a nova.
function ModalSwitch() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [state, setState] = useState({ location, previousLocation: null });

  let { previousLocation } = state;
  if (state.location !== location) {
    if (navigationType !== 'POP') {
      previousLocation = state.location;
    }
    setState({ location, previousLocation });
  }

  const isModal = !!(location.state && location.state.isModal && previousLocation);
  const pageLocation = isModal ? previousLocation : location;

  return (
    <Fragment>
      <Suspense fallback={<PageLoading />}>
        <Routes location={pageLocation}>
          <Route path="/cadernos-respostas/*" element={<RoutePage component={AnswerBooks} />} />
          <Route path="/materiais-complementares/*" element={<RoutePage component={ComplementBooks} />} />
          <Route path="/" element={<RoutePage component={Home} />} />
          <Route path="/sequencias/*" element={<RoutePage component={Sequences} />} />
          <Route path="/projetos/*" element={<RoutePage component={Projects} />} />
          <Route path="/projeto/:slug/*" element={<RoutePage component={Project} />} />
          <Route path="/novo-projeto/*" element={<RoutePage component={CreateProject} />} />
          <Route path="/editar-projeto/:slug/*" element={<RoutePage component={EditProject} />} />
          <Route path="/consultas-publicas/*" element={<RoutePage component={Consultations} />} />
          <Route path="/sequencias/ods/:ods" element={<RoutePage component={Sequences} />} />
          <Route path="/sequencias/matriz-de-saberes/:mds" element={<RoutePage component={Sequences} />} />
          <Route path="/sequencias/objetivos-de-aprendizagem/:oda" element={<RoutePage component={Sequences} />} />
          <Route path="/sequencia/:slug/*" element={<RoutePage component={Sequence} />} />
          <Route path="/imprimir/sequencia/:slug/*" element={<RoutePage component={Sequence} key="print" />} />
          <Route path="/atividade/:slug1/:slug2" element={<RoutePage component={Activity} />} />
          <Route path="/imprimir/atividade/:slug1/:slug2" element={<RoutePage component={Activity} key="print" />} />
          <Route path="/curriculo-ensino-fundamental" element={<RoutePage component={Basic} />} />
          <Route path="/curriculo-ensino-medio" element={<RoutePage component={Medium} />} />
          <Route path="/pesquisas/:id/criar-resposta/*" element={<RoutePage component={SurveyForm} />} />
          <Route path="/ods/*" element={<RoutePage component={SustainableDevGoals} />} />
          <Route path="/matriz-de-saberes/*" element={<RoutePage component={KnowledgeMatrix} />} />
          <Route path="/objetivos-de-aprendizagem" element={<RoutePage component={LearningObjectives} />} />
          <Route path="/perfil/*" element={<RoutePage component={Profile} />} />
          <Route path="/colecao/:id/*" element={<RoutePage component={Collection} />} />
          <Route path="/desafio/:slug/*" element={<RoutePage component={Challenge} />} />
          <Route path="/tecnologias-para-aprendizagem/*" element={<RoutePage component={Technologies} />} />
          <Route path="/metodologia/:slug" element={<RoutePage component={Methodology} />} />
          <Route path="/redirect/*" element={<RoutePage component={Redirect} />} />
          {/* Rotas só de modal (ex.: /login aberto direto) não têm página de fundo. */}
          <Route path="*" element={null} />
        </Routes>
      </Suspense>
      <RouteModals routes={modalRoutes} />
    </Fragment>
  );
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <HistoryRouter history={history}>
      <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={theme}>
          <ModalSwitch />
          <AppLoading />
          <Snackbar />
          <Alert />
          <Confirm />
        </MuiThemeProvider>
      </StyledEngineProvider>
    </HistoryRouter>
  </Provider>
);

