// Para elementos com role="button": aciona o handler com Enter ou espaço,
// como um <button> faria.
export default function onKeyActivate(handler) {
  return event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handler(event);
    }
  };
}
