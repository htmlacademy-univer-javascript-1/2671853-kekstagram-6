const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const message = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const names = ['Белла', 'Клавдия', 'Артемий', 'Вячеслав', 'Ева', 'Милана', 'Арнольд', 'Джейкоб', 'Эдвард'];
let commentId = 1; //счетчик для уникальных айди комментариев
const photosCount = 25;

const createComment = () => {
  const id = commentId++;
  const avatar = `img/avatar-${getRandomInteger(1, 6)}.svg`;
  const sentencesCount = getRandomInteger(1, 2); // 1 или 2 предложения
  const messageText = Array.from({ length: sentencesCount }, () => getRandomArrayElement(message)).join(' ');
  const name = getRandomArrayElement(names);

  return {
    id,
    avatar,
    message: messageText,
    name
  };

};

const createPhoto = (photoId) => {
  const commentsCount = getRandomInteger(0,30);
  const comments = Array.from({length: commentsCount}, () => createComment());

  return {
    id: photoId,
    url: `photos/${photoId}.jpg`,
    description: `Описание фотографии №${photoId}`,
    likes: getRandomInteger(15, 200),
    comments
  };
};

const photos = Array.from({ length: photosCount }, (_, i) => createPhoto(i + 1));

window.photos = photos;
console.log('Generated photos:', photos);
