// Props de um <NavLink> que abre `path` como modal sobre a página atual.
export default function createModalLink(path) {
  return {
    to: path,
    state: { isModal: true },
  };
}
