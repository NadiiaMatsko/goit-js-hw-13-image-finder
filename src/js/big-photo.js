'use strict';
import { refs } from './refs';
import * as basicLightbox from 'basiclightbox';

refs.galleryList.addEventListener('click', onImgClick);
function onImgClick(e) {
  const imgBtn = e.target;
  if (imgBtn.tagName !== 'IMG') {
    return;
  }
  const src = imgBtn.getAttribute('src');
  const alt = imgBtn.getAttribute('alt');
  basicLightbox
    .create(
      `
		<img src=${src}" alt=${alt}>
	`,
    )
    .show();
}
