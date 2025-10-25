import { getRandomInteger, getRandomArrayElement } from './util.js';

const messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const names = ['Белла', 'Клавдия', 'Артемий', 'Вячеслав', 'Ева', 'Милана', 'Арнольд', 'Джейкоб', 'Эдвард'];

let commentId = 1;
const photosCount = 25;

const createComment = () => {
  const id = commentId++;
  const avatar = `img/avatar-${getRandomInteger(1, 6)}.svg`;
  const sentencesCount = getRandomInteger(1, 2);
  const messageText = Array.from(
    { length: sentencesCount },
    () => getRandomArrayElement(messages)
  ).join(' ');
  const name = getRandomArrayElement(names);

  return { id, avatar, message: messageText, name };
};

const createPhoto = (photoId) => {
  const commentsCount = getRandomInteger(0, 30);
  const comments = Array.from({ length: commentsCount }, () => createComment());

  return {
    id: photoId,
    url: `photos/${photoId}.jpg`,
    description: `Описание фотографии №${photoId}`,
    likes: getRandomInteger(15, 200),
    comments
  };
};

export const generatePhotos = (count = photosCount) =>
  Array.from({ length: count }, (_, i) => createPhoto(i + 1));
