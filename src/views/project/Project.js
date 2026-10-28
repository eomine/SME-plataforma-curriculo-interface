import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Cover from './Cover';
import Title from './Title';
import Page from 'components/layout/Page';
import ProjectActions from 'actions/ProjectActions';
import { withProject } from 'data/itemQueries';
import ProjectChars from './chars/ProjectChars';
import styles from './Project.module.scss';
import getTeacherId from 'data/getTeacherId';
import RichTextEditor from 'components/RichTextEditor';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import iconClose from 'images/icons/close.svg';
import { openAlert } from 'reducers/messagesSlice';

class Project extends Component {
  state = {
    isCharsExpanded: false,
    isPrint: false,
    isOldProject: false,
    comment: {
      teacher_id: getTeacherId(),
      project_id: '',
      body: null,
    },
    theme: 'snow',
  };

  commentChange = (html) => {
    this.setState({
      comment: {
        ...this.state.comment,
        body: html,
      },
    });
  }

  getLinkUrl = (href) => {
    let validateUrl = href.search(/http/i);
    if (validateUrl !== -1) {
      return href;
    } else {
      return `https://${href}`;
    }
  }

  submitComment = async (e) => {
    e.preventDefault();
    await this.setState({
      comment: {
        ...this.state.comment,
        project_id: this.props.data.id,
      },
    });
    if (this.state.comment.body) {
      await this.props.createComment(this.state.comment, this.props.match.params.slug);
      await this.setState({
        comment: {
          ...this.state.comment,
          body: null,
        },
      });
    } else {
      await alert("O campo de comentário não pode ficar em branco.");
    }
  }

  deleteComment = async (e, id) => {
    e.preventDefault();
    await this.props.deleteComment(id, this.props.match.params.slug);
  }

  componentDidMount() {
    if (this.props.location.pathname.match(/imprimir/)) {
      this.setState({
        ...this.state,
        isPrint: true
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.data !== prevProps.data) {
      if(this.props.data.old_project && !this.props.data.updated_by_admin) {
        this.props.openAlert('Alerta! Em breve esse projeto será ajustado.');
      }
    }
  }

  render() {
    const { data, isSaved, comments } = this.props;
    const { isPrint } = this.state;
    const  cardsComment = comments.map((comment, index) => {
      return (
        <div key={index}>
          <br></br>
          <Card>
            <CardContent>
              <div className="row">
                <div className="col-6">
                  <h5>Autor:</h5> <label>{comment.teacher_name}</label>
                </div>
                <div className="col-6">
                  { getTeacherId() === comment.teacher_id.toString() && (
                    <Button
                      className={styles.deleteButton}
                      size="large"
                      onClick={(e) => this.deleteComment(e, comment.id)}
                      fullWidth={false}
                    >
                      <img src={iconClose} alt="Excluir comentário" />
                    </Button>
                  )}
                </div>
              </div>
              <br></br>
              <hr></hr>
              <br></br>
              <div className="col-12" dangerouslySetInnerHTML={{ __html: comment.body }} />
          </CardContent>
          </Card>
        </div>
      )
    });

    const modules = {
      toolbar: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'},
         {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      clipboard: {
        matchVisual: false,
      }
    }

    const formats = [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'indent',
      'link', 'image', 'video'
    ]

    return (
      <Page>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-lg-8">
              <Cover
                project={data}
              />
              <Title
                text="Projeto TCA"
                project={data}
                slug={data.slug}
                isSaved={isSaved}
                hasButton={true}
              />
              <h3>Resumo</h3>
              <br></br>
              <div className="container">
                <p className={styles.summary}>{data.summary}</p>
              </div>
              <br></br>
              <h3>Desenvolvimento do projeto</h3>
              <br></br>
              <div className='container'>
                <div dangerouslySetInnerHTML={{ __html: data.description }} />
              </div>
              <h3>Informações</h3>
              <br></br>
              <div className="container">
                <p className={styles.dre}>{data.regional_education_board}</p>
                <p><b>Unidade Escolar</b> - {data.school}</p>
                <p><b>Ano Letivo</b> - {data.development_year}</p>
                {data.development_class  && (
                  <p><b>Etapa/Ano Turma</b> - {data.development_class}</p>
                )}
                <p><b>Professor(es)</b> - {data.teacher_name}</p>
                <p><b>Estudante(s)</b> - {data.owners}</p>
                <p><b>Criado em:</b> - {data.created_at}</p>
                <p><b>Atualizado em:</b> - {data.updated_at}</p>
              </div>
              <br></br>
              <h3>Links relacionados</h3>
              <br></br>
              <div className="container">
                {data.links && (data.links.map((link, idx) => {
                  return (
                    <p key={idx}>
                      <a className={styles.links} href={this.getLinkUrl(link.link)}>
                        {link.link}
                      </a>
                    </p>
                  );
                }))}
              </div>
            </div>
            <br></br>
            <div className={styles.chars}>
              <ProjectChars data={data} isPrint={isPrint} />
            </div>
          </div>
          <br></br>
          <br></br>
          <hr></hr>
          <br></br>
          <br></br>
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 co-xl-12">
              <h3>Comentários:</h3>
              {cardsComment.length ? cardsComment : <div className={styles.commentMessage}><p>Ainda não existe nenhum comentário. Seja o primeiro(a) a comentar!</p></div>}
            </div>
          </div>
          <br></br>
          {this.state.comment.teacher_id && (
            <div className="row">
              <div className='col-sm-12 col-md-12 col-lg-12 co-xl-12'>
                <h3>Novo Comentário:</h3>
                <RichTextEditor
                  style={{marginTop: '5%', marginBottom: '5%'}}
                  theme={this.state.theme}
                  onChange={(html) => this.commentChange(html)}
                  value={this.state.comment.body}
                  modules={modules}
                  formats={formats}
                  bounds={'.app'}
                  placeholder="Escreva alguma coisa."
                  />
                  <Button
                    className={styles.submitButton}
                    size="large"
                    onClick={(e) => this.submitComment(e)}
                    fullWidth={false}
                  >
                    Salvar Comentário
                  </Button>
              </div>

            </div>
          )}

        </div>
        <br></br>
        <br></br>
      </Page>
    );
  }
}

Project.propTypes = {
  data: PropTypes.object,
  comments: PropTypes.array,
  isSaved: PropTypes.bool,
  isSearching: PropTypes.bool.isRequired,
};

// "Salvo" só depois de salvar nesta sessão: a página não carrega em quais
// coleções o projeto está (como antes).
const mapStateToProps = (state, { data }) => {
  return {
    comments: data.comments || [],
    isSaved: state.project.savedIds.includes(data.id),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createComment: (comment, slug) => {
      dispatch(ProjectActions.createComment(comment, slug));
    },
    deleteComment: (id, slug) => {
      dispatch(ProjectActions.deleteComment(id, slug));
    },
    openAlert: message => {
      dispatch(openAlert(message));
    },
  };
};

export default withProject(connect(
  mapStateToProps,
  mapDispatchToProps
)(Project));
