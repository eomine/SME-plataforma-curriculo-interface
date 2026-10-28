import React, { Suspense, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { matchRoutes, useLocation, useRoutes } from 'react-router';
import { history } from 'utils/history';
import PageLoading from 'components/loading/PageLoading';

// Classes de entrada/saída (index.scss e FullModal.scss) e a duração da saída.
const variants = {
  modal: {
    className: { base: 'modal', afterOpen: 'modalIn', beforeClose: 'modalOut' },
    closeTimeoutMS: 300,
  },
  full: {
    className: { base: 'fullModal', afterOpen: 'fullModalIn', beforeClose: 'fullModalOut' },
    closeTimeoutMS: 500,
  },
};

const overlayClassName = {
  base: 'modalOverlay',
  afterOpen: 'modalOverlayIn',
  beforeClose: 'modalOverlayOut',
};

function ModalContent({ routes, location }) {
  return useRoutes(routes, location);
}

// Mostra num modal a rota que casa com a URL atual, por cima da página.
// `handle: 'full'` na rota usa o modal de tela cheia.
export default function RouteModals({ routes }) {
  const location = useLocation();
  const matches = matchRoutes(routes, location);
  const element = matches && <ModalContent routes={routes} location={location} />;
  const [last, setLast] = useState(null);

  // Guarda o último modal aberto, para ele continuar na tela enquanto a
  // animação de saída roda depois que a URL já mudou.
  if (element && (!last || last.pathname !== location.pathname)) {
    setLast({ pathname: location.pathname, element, variant: matches[0].route.handle || 'modal' });
  }

  if (!last) {
    return null;
  }

  return (
    <Modal
      key={last.pathname}
      isOpen={!!element}
      onRequestClose={history.back}
      overlayClassName={overlayClassName}
      bodyOpenClassName="modalOpen"
      {...variants[last.variant]}
    >
      {/* O código do modal carrega sob demanda (veja index.js). */}
      <Suspense fallback={<PageLoading />}>{element || last.element}</Suspense>
    </Modal>
  );
}

RouteModals.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};
