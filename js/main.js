import { generatePhotos } from './data.js';
import { renderPictures } from './draw_picture.js';

const photos = generatePhotos();

renderPictures(photos);
