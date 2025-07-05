document.addEventListener("DOMContentLoaded", () => {
  const postId = new URLSearchParams(window.location.search).get("id");
  if (!postId) {
    document.getElementById("noticia-destacada").innerHTML = "<p>No se especificó ninguna noticia.</p>";
    return;
  }

  fetch(`http://localhost/noticias/wp-json/wp/v2/posts/${postId}?_embed`)
    .then(res => res.json())
    .then(post => {
      const titulo = post.title.rendered;
      const contenido = post.content.rendered;
      const fecha = new Date(post.date).toLocaleDateString();
      const autor = post._embedded.author[0].name;
      const imagen = post._embedded['wp:featuredmedia']
        ? post._embedded['wp:featuredmedia'][0].source_url
        : 'images/default.jpg';

      const html = `
        <header>
          <div class="title">
            <h2>${titulo}</h2>
            <p>${post.excerpt.rendered}</p>
          </div>
          <div class="meta">
            <time class="published">${fecha}</time>
            <a href="#" class="author"><span class="name">${autor}</span><img src="images/avatar.jpg" alt="" /></a>
          </div>
        </header>
        <span class="image featured"><img src="${imagen}" alt="" /></span>
        ${contenido}
        <footer>
          <ul class="stats">
            <li><a href="#">Noticia</a></li>
          </ul>
        </footer>
      `;

      document.getElementById("noticia-destacada").innerHTML = html;
    })
    .catch(err => {
      document.getElementById("noticia-destacada").innerHTML = "<p>Error al cargar la noticia.</p>";
      console.error(err);
    });
});