'use strict';
import './sass/main.scss';

import { notice, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import '@pnotify/core/dist/BrightTheme.css';
import { defaults } from '@pnotify/core';
defaults.delay = '2000';

import './js/big-photo';
import { refs } from './js/refs';
import makePhotoCardMarkup from './templates/photoCard.hbs';
import ImagesApiService from './js/apiService';

const api = new ImagesApiService();

refs.form.addEventListener('submit', onFormSumbit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onFormSumbit(e) {
  e.preventDefault();
  clearGalleryList();
  refs.form.elements.btn.textContent = 'Searching...';
  refs.form.elements.btn.setAttribute('disabled', '');

  refs.loadMoreBtn.classList.add('is-hidden');

  api.query = e.currentTarget.elements.query.value;
  api.resetPage();

  if (api.query === '') {
    ifError('Please enter your request');
    activateSearchBtn();
    return;
  }

  api.fetchImages().then(({ hits, total }) => {
    if (hits.length === 0) {
      ifError('Enter a valid request');
      activateSearchBtn();
      return;
    }
    renderImages(hits);
    activateSearchBtn();
    refs.loadMoreBtn.classList.remove('is-hidden');
    onLastPage(total);
  });
}

function onLoadMore() {
  api.incrementPage();

  refs.loadMoreBtn.setAttribute('disabled', '');
  refs.spinner.classList.remove('is-hidden');
  refs.loadMoreText.textContent = 'Loading...';

  api.fetchImages().then(({ hits, total }) => {
    renderImages(hits);
    onLastPage(total);
    refs.loadMoreBtn.removeAttribute('disabled');
    refs.spinner.classList.add('is-hidden');
    refs.loadMoreText.textContent = 'Load more';
  });
}

function renderImages(images) {
  const markup = makePhotoCardMarkup(images);
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
}

function clearGalleryList() {
  refs.galleryList.innerHTML = '';
}

function onLastPage(all) {
  const allPage = Math.ceil(all / api.per_page);
  if (api.page >= allPage) {
    notice({
      text: 'These are all photos found by your request',
    });
    refs.loadMoreBtn.classList.add('is-hidden');
  }
}

function activateSearchBtn() {
  refs.form.elements.btn.textContent = 'Search';
  refs.form.elements.btn.removeAttribute('disabled');
}

function ifError(message) {
  error({
    text: message,
  });
}
