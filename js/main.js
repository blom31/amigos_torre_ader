// Constantes que necesitas
const PLACE_ID = "ChIJcVkNcKWwvJURbMY4UakSgzk";
const container = document.getElementById("reviews-container");

/**
 * Función de callback de inicio (llamada por Google al cargar la librería).
 */
function initReviews() {
  // 1. Creamos una instancia del servicio de Lugares (PlacesService).
  // El elemento 'container' se pasa como referencia.
  const service = new google.maps.places.PlacesService(container);

  // 2. Definir la solicitud.
  const request = {
    placeId: PLACE_ID,
    fields: ["name", "rating", "reviews", "url"], // Usamos los campos antiguos para consistencia
  };

  // 3. Llamar al servicio usando getDetails y pasando la función de callback.
  service.getDetails(request, placeDetailsCallback);
}

/**
 * Función que maneja la respuesta de la API (Callback).
 * @param {object} place - El objeto de detalles del lugar.
 * @param {string} status - El estado de la solicitud (e.g., OK).
 */
function placeDetailsCallback(place, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    const reviews = place.reviews;
    let htmlContent = "";

    if (reviews && reviews.length > 0) {
      reviews.forEach((review) => {
        // La fecha es un objeto Date y se formatea
        const date = new Date(review.time * 1000).toLocaleDateString();

        // Generación del HTML
        htmlContent += `
                    <div class="review-card">
                    <p class="text">${review.text}</p>
                        <p class="rating">⭐ ${review.rating} estrellas</p>
                        <p class="author">Por: ${review.author_name} (${date})</p>
                    </div>
                `;
      });

      // Usamos el campo 'url' -> dejamos el enlace en un contenedor separado
      const moreHtml = `
        <a href="${place.url}" target="_blank">Ver más reseñas en Google Maps</a>
      `;

      // Insertamos las reseñas en el contenedor principal
      container.innerHTML = htmlContent;

      // Rellenamos el contenedor separado para "more-reviews"
      const moreContainer = document.getElementById("more-reviews-container");
      if (moreContainer) {
        moreContainer.innerHTML = moreHtml;
      }
    } else {
      htmlContent = "<p>Aún no tenemos reseñas para mostrar.</p>";
      container.innerHTML = htmlContent;
    }
  } else {
    // Manejo de errores
    console.error("Error al obtener detalles del lugar:", status);
    container.innerHTML = `<p>Error al cargar las reseñas: ${status}</p>`;
  }
}
