// Formata as fórmulas da página com o MathJax, que o index.html carrega do
// CDN de forma assíncrona. Se ele ainda não carregou, não faz nada: ao
// terminar de carregar, o MathJax formata a página sozinho.
export default function typesetMath() {
  if (window.MathJax && window.MathJax.Hub) {
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
  }
}
