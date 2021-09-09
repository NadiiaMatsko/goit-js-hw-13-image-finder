'use strict';
export default class ApiService {
  BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '23307014-2de8c17ee8df3c3ecd2ec38e8';

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 12;
  }
  fetchImages() {
    return fetch(
      `${this.BASE_URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${
        this.page
      }&per_page=${this.per_page}&key=${this.#API_KEY}`,
    )
      .then(response => response.json())
      .then(data => {
        if (data.status > 400) {
          return Promise.reject('Not found');
        }
        return data;
      })
      .catch(err => console.log(err.message));
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
