import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActivityChars from './chars/ActivityChars';
import Cover from 'views/sequence/Cover';
import ModuleExercise from 'views/modules/ModuleExercise';
import ModuleGallery from 'views/modules/ModuleGallery';
import ModuleLongText from 'views/modules/ModuleLongText';
import ModuleQuestion from 'views/modules/ModuleQuestion';
import ModuleStudent from 'views/modules/ModuleStudent';
import ModuleTextWithTables from 'views/modules/ModuleTextWithTables';
import ModuleTeacher from 'views/modules/ModuleTeacher';
import Title from 'views/sequence/Title';
import convertQuillToHtml from 'utils/convertQuillToHtml';
import { useGetActivityQuery } from 'data/curriculoApi';
import withQuery from 'utils/withQuery';
import styles from './ActivityPrintItem.module.scss';
import typesetMath from 'utils/typesetMath';

class ActivityPrintItem extends Component {
  componentDidMount() {
    typesetMath();
  }

  render() {
    if (this.props.data == null) {
      return <span />;
    }

    const { data } = this.props;
    const sequence = data.activity_sequence;

    const contentBlocks = data.content_blocks
      ? data.content_blocks.map((block, i) => {
          switch (block.type) {
            case 'to_teacher':
              return (
                <ModuleTeacher
                  key={i}
                  text={convertQuillToHtml(block.content.body)}
                />
              );

            case 'to_student':
              return (
                <ModuleStudent
                  key={i}
                  text={convertQuillToHtml(block.content.body)}
                />
              );

            case 'question':
              return (
                <ModuleQuestion
                  key={i}
                  number={block.content.number}
                  title={block.content.title}
                  text={convertQuillToHtml(block.content.body)}
                />
              );

            case 'predefined_exercise':
              return (
                <ModuleExercise
                  key={i}
                  icon={block.content.icon_url}
                  title={block.content.title}
                  text={convertQuillToHtml(block.content.body)}
                />
              );

            case 'long_text':
              return (
                <ModuleLongText
                  key={i}
                  title={block.content.title}
                  text={convertQuillToHtml(block.content.body)}
                />
              );

            case 'gallery':
              return <ModuleGallery key={i} images={block.images} />;

            default:
              return <ModuleTextWithTables key={i} data={block.content.body} />;
          }
        })
      : null;

    return (
      <section className={styles.wrapper}>
        <Cover data={data} sequence={sequence} />
        <Title
          slug={sequence.slug}
          text={`Atividade ${data.sequence}`}
          title={data.title}
        />
        <ActivityChars data={this.props.data} isPrint={true} />
        <div className={styles.description}>{contentBlocks}</div>
      </section>
    );
  }
}

ActivityPrintItem.propTypes = {
  data: PropTypes.object,
};

export default withQuery(useGetActivityQuery, {
  arg: props => ({ sequenceSlug: props.slug1, activitySlug: props.slug2 }),
  mapResult: result => ({ data: result.currentData || null }),
})(ActivityPrintItem);
