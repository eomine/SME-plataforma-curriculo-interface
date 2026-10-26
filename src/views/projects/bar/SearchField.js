import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Search from '@mui/icons-material/Search';
import { connect } from 'react-redux';
import ProjectFiltersActions from 'actions/ProjectFiltersActions';
import ProjectsActions from 'actions/ProjectsActions';
import styles from './SearchField.module.scss';

class SearchField extends Component {
  onChangedQuery = e => {
    this.props.setQuery(e.target.value);
  };

  onKeyPress = e => {
    if (e.key === 'Enter') {
      this.props.search();
    }
  };

  onSubmit = () => {
    this.props.search();
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <FormControl fullWidth={true}>
          <InputLabel htmlFor="query">Buscar projetos por tema</InputLabel>
          <Input
            id="query"
            value={this.props.query}
            onChange={this.onChangedQuery}
            onKeyPress={this.onKeyPress}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="Buscar" onClick={this.onSubmit} size="large">
                  <Search />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>
    );
  }
}

SearchField.propTypes = {
  query: PropTypes.string,
  setQuery: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    query: state.ProjectFiltersReducer.query,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    search: value => {
    //   dispatch(BodyActions.showLoading());
      dispatch(ProjectsActions.search());
    },
    setQuery: value => {
      dispatch(ProjectFiltersActions.setQuery(value));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchField);
