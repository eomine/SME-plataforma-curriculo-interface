import 'bootstrap/dist/css/bootstrap-reboot.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import 'react-image-gallery/styles/image-gallery.css';
import 'components/layout/FullModal.scss';
import './index.scss';

import React, { Fragment, useState } from 'react';
import { createRoot } from 'react-dom/client';
import thunk from 'redux-thunk';
import { history } from 'utils/history';
import { Provider } from 'react-redux';
import {
  Route,
  Routes,
  unstable_HistoryRouter as HistoryRouter,
  useLocation,
  useNavigationType,
} from 'react-router';
import { applyMiddleware, createStore } from 'redux';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import Activity from 'views/activity/Activity';
import Alert from 'components/Alert';
import RouteModals from 'components/RouteModals';
import RoutePage from 'components/RoutePage';
import AnswerBooks from 'views/answerBooks/AnswerBooks';
import ComplementBooks from 'views/complementBooks/ComplementBooks';
import AppLoading from 'components/loading/AppLoading';
import Challenge from 'views/challenge/Challenge';
import Classrooms from 'views/classrooms/Classrooms';
import Collection from 'views/collection/Collection';
import Confirm from 'components/Confirm';
import Consultations from 'views/consultations/Consultations';
import ConsultationDetail from 'views/consultations/Detail';
import CreateCollection from 'views/collection/create/CreateCollection';
import Basic from 'views/curriculum/Basic';
import Medium from 'views/curriculum/Medium';
import SurveyForm from 'views/surveyForm/SurveyForm';
import EditCollection from 'views/collection/edit/EditCollection';
import EditProfile from 'views/profile/edit/EditProfile';
import Home from 'views/home/Home';
import LearningObjectives from 'views/learningObjectives/LearningObjectives';
import KnowledgeMatrix from 'views/knowledgeMatrix/KnowledgeMatrix';
import KnowledgeMatrixDetail from 'views/knowledgeMatrix/Detail';
import Login from 'views/login/Login';
import Methodology from 'views/methodology/Methodology';
import MyResults from 'views/myResults/MyResults';
import Profile from 'views/profile/Profile';
import RateSequence from 'views/sequence/rate/RateSequence';
import Rating from 'views/sequence/rating/Rating';
import Result from 'views/result/Result';
import SaveSequence from 'views/sequence/save/SaveSequence';
import SaveProject from 'views/project/save/SaveProject';
import SendResult from 'views/result/send/SendResult';
import Sequence from 'views/sequence/Sequence';
import Sequences from 'views/sequences/Sequences';
import Projects from 'views/projects/Projects';
import Project from 'views/project/Project';
import CreateProject from 'views/projects/CreateProject';
import EditProject from 'views/projects/EditProject';
import Snackbar from 'components/Snackbar';
import SustainableDevGoalDetail from 'views/sustainableDevGoals/Detail';
import SustainableDevGoals from 'views/sustainableDevGoals/SustainableDevGoals';
import Technologies from 'views/technologies/Technologies';
import Redirect from 'views/redirect/Redirect';
import moment from 'moment';
import reducers from 'reducers';
// import registerServiceWorker from 'utils/registerServiceWorker';
import theme from 'utils/theme';

moment.updateLocale('pt-br', {
  relativeTime : {
    past : '%s atrás',
  },
});

const store = createStore(reducers, applyMiddleware(thunk));

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
      <RouteModals routes={modalRoutes} />
    </Fragment>
  );
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <HistoryRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <ModalSwitch />
        <AppLoading />
        <Snackbar />
        <Alert />
        <Confirm />
      </MuiThemeProvider>
    </HistoryRouter>
  </Provider>
);

// registerServiceWorker();
