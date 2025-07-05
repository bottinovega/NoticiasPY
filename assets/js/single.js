fetch("http://localhost/noticias/wp-json/wp/v2/posts?categories=1&per_page=1&_embed")
  .then(res => res.json())
  .then(data => {
    const post = data[0];

    const titulo = post.title.rendered;
    const contenido = post.content.rendered;
    const resumen = post.excerpt.rendered;
    const fecha = new Date(post.date).toLocaleDateString();
    const autor = post._embedded.author[0].name;
    const imagen = post._embedded['wp:featuredmedia']
      ? post._embedded['wp:featuredmedia'][0].source_url
      : 'images/default.jpg';
    const link = `single.html?id=${post.id}`;

    // Seleccionar elementos existentes y actualizar su contenido
    const noticiaDestacada = document.getElementById("noticia-destacada");
    
    // Actualizar título
    const titleElement = noticiaDestacada.querySelector(".title h2 a");
    titleElement.textContent = titulo;
    titleElement.href = link;
    
    // Actualizar resumen
    const subtitleElement = noticiaDestacada.querySelector(".title p");
    subtitleElement.innerHTML = resumen;
    
    // Actualizar fecha
    const dateElement = noticiaDestacada.querySelector(".meta time");
    dateElement.textContent = fecha;
    dateElement.datetime = post.date;
    
    // Actualizar autor
    const authorElement = noticiaDestacada.querySelector(".meta .name");
    authorElement.textContent = autor;
    
    // Actualizar imagen destacada
    const imageElement = noticiaDestacada.querySelector(".image.featured img");
    imageElement.src = imagen;
    imageElement.alt = titulo;
    
    // Actualizar contenido
    const contentElements = noticiaDestacada.querySelectorAll("p:not(.title p)");
    contentElements.forEach(el => el.remove());
    
    // Insertar el nuevo contenido manteniendo la estructura
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = contenido;
    const paragraphs = tempDiv.querySelectorAll("p, h1, h2, h3, h4, h5, h6, img, ul, ol");
    
    const featuredImageContainer = noticiaDestacada.querySelector(".image.featured");
    paragraphs.forEach(el => {
      featuredImageContainer.insertAdjacentElement("afterend", el);
    });
    
    // Actualizar footer si es necesario
    const footerStats = noticiaDestacada.querySelector(".stats");
    if (footerStats) {
      footerStats.innerHTML = `
        <li><a href="#">Noticia</a></li>
        <li><a href="#" class="icon solid fa-heart">${post.meta.likes || 0}</a></li>
        <li><a href="#" class="icon solid fa-comment">${post.meta.comments || 0}</a></li>
      `;
    }
  })
  .catch(err => {
    console.error("Error cargando noticia destacada:", err);
    document.getElementById("noticia-destacada").innerHTML = `
      <header>
        <div class="title">
          <h2>Error al cargar la noticia</h2>
          <p>No se pudo cargar el contenido solicitado.</p>
        </div>
      </header>
    `;
  });