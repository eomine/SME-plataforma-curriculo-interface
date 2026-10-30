import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useParams } from 'react-router';
import { history } from 'utils/history';

// Passa match, location e history para a página, como o <Route component>
// do React Router 4, para as páginas continuarem lendo this.props.match etc.
export default function RoutePage({ component: Component }) {
  const params = useParams();
  const location = useLocation();
  return <Component match={{ params }} location={location} history={history} />;
}

RoutePage.propTypes = {
  component: PropTypes.elementType.isRequired,
};
