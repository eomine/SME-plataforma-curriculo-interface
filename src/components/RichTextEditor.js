import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// O Quill 2 troca todos os espaços do HTML por &nbsp;, e o texto salvo deixa
// de quebrar linha. Aqui o onChange recebe espaços normais, como no Quill 1.
const withSpaces = html => html.replaceAll('&nbsp;', ' ');

class RichTextEditor extends React.Component {
  // Último HTML emitido pelo editor, ainda com &nbsp;.
  lastHtml = null;

  handleChange = html => {
    this.lastHtml = html;
    this.props.onChange(withSpaces(html));
  };

  render() {
    const { value, onChange, ...props } = this.props;
    // Se o value é o que o editor acabou de emitir, devolve o HTML original dele;
    // senão o editor acha que o conteúdo mudou e se recarrega no meio da digitação.
    const editorValue =
      this.lastHtml !== null && withSpaces(this.lastHtml) === value ? this.lastHtml : value;

    return <ReactQuill {...props} value={editorValue} onChange={this.handleChange} />;
  }
}

RichTextEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default RichTextEditor;
