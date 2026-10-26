// As sequências da home vêm do curriculoApi (getSequences, a mesma lista da
// página de sequências); aqui fica só a prévia expandida.
const HomeActions = {
  TOGGLE_PREVIEW: 'HomeActions.TOGGLE_PREVIEW',

  togglePreview(id) {
    return { type: HomeActions.TOGGLE_PREVIEW, id };
  },
};

export default HomeActions;
