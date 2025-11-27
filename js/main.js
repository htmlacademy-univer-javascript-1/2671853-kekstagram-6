import { generatePhotos } from './data.js';
import { renderPictures } from './draw_picture.js';
import './form.js';
const photos = generatePhotos();

renderPictures(photos);
