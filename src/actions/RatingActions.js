import { openAlert } from 'reducers/messagesSlice';
import { curriculoApi } from 'data/curriculoApi';
import getTeacherId from 'data/getTeacherId';

const RatingActions = {
  save(slug, answers) {
    return dispatch => {
      const ratings = [];

      for (let id in answers) {
        ratings.push({ rating_id: id, score: answers[id] });
      }

      const rating = {
        activity_sequence_rating: {
          teacher_id: getTeacherId(),
          ratings,
        },
      };

      return dispatch(curriculoApi.endpoints.saveSequenceRating.initiate({ slug, rating }))
        .unwrap()
        .then(() => dispatch(openAlert('Avaliação salva com sucesso!')))
        // O erro já foi mostrado no alerta do curriculoApi.
        .catch(() => {});
    };
  },
};

export default RatingActions;
