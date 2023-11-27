import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.css';

const refs = {
  searchInput: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
  apiKey: '40912309-48da47788ffd5e56fff0d133f',
  page: 0,
};

document.addEventListener('submit', handleSubmit);
refs.loadMore.addEventListener('click', handleSubmit);
refs.searchInput.addEventListener('input', handleInputChange);

function handleSubmit(e) {
  e.preventDefault();
  const query = refs.searchInput.value.toLowerCase();

  if (query === '') {
    Notiflix.Notify.warning('Please enter your search query');
    return;
  }

  searchImages(query);
}

function handleInputChange() {
  refs.gallery.innerHTML = '';
  refs.page = 0;
  refs.loadMore.style.display = 'none';
}

async function searchImages(request) {
  try {
    refs.loadMore.style.display = 'none';
    refs.page += 1;
    const response = await axios.get(
      `https://pixabay.com/api/?key=${refs.apiKey}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=${refs.page}&per_page=40`
    );
    const images = response.data.hits;

    if (refs.page === 1) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
    }

    if (images.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    images.forEach(image => {
      const div = document.createElement('div');
      div.classList.add('photo-card');
      div.innerHTML = `
      <a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <span>${image.likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b>
          <span>${image.views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <span>${image.comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <span>${image.downloads}</span>
        </p>
      </div>
      `;

      refs.gallery.appendChild(div);
    });

    const gallery = new SimpleLightbox('.photo-card a');
  } catch (error) {
    console.error(error);
    throw new Error('Error found');
  } finally {
    refs.loadMore.style.display = 'block';
  }
}
