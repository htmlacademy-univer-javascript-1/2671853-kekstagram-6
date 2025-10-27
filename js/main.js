import { generatePhotos } from './data.js';
import { drawPicture } from './draw_picture.js';

const photos = generatePhotos();

drawPicture(photos);
