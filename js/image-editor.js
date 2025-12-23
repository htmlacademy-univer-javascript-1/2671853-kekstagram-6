const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const SLIDER_RANGE_MIN = 0;
const SLIDER_RANGE_MAX = 100;
const SLIDER_START = 100;

const DEFAULT_EFFECT = 'none';
const HIDDEN_CLASS = 'hidden';

const EFFECTS = {
  none: null,
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    filter: 'grayscale',
    unit: '',
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    filter: 'sepia',
    unit: '',
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    filter: 'invert',
    unit: '%',
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    filter: 'blur',
    unit: 'px',
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    filter: 'brightness',
    unit: '',
  },
};

const scaleValueElement = document.querySelector('.scale__control--value');
const scaleSmallerElement = document.querySelector('.scale__control--smaller');
const scaleBiggerElement = document.querySelector('.scale__control--bigger');
const imagePreviewElement = document.querySelector('.img-upload__preview img');
const effectsListElement = document.querySelector('.effects__list');
const effectLevelContainerElement = document.querySelector('.img-upload__effect-level');
const effectLevelSliderElement = document.querySelector('.effect-level__slider');
const effectLevelValueElement = document.querySelector('.effect-level__value');

let currentScale = SCALE_DEFAULT;
let currentEffect = DEFAULT_EFFECT;
let isSliderInitialized = false;

const updateScale = (value) => {
  currentScale = value;
  scaleValueElement.value = `${value}%`;
  imagePreviewElement.style.transform = `scale(${value / 100})`;
};

const onScaleSmallerClick = () => {
  updateScale(Math.max(currentScale - SCALE_STEP, SCALE_MIN));
};

const onScaleBiggerClick = () => {
  updateScale(Math.min(currentScale + SCALE_STEP, SCALE_MAX));
};

const hideSlider = () => {
  effectLevelContainerElement.classList.add(HIDDEN_CLASS);
};

const showSlider = () => {
  effectLevelContainerElement.classList.remove(HIDDEN_CLASS);
};

const applyEffect = (value) => {
  if (currentEffect === DEFAULT_EFFECT) {
    imagePreviewElement.style.filter = 'none';
    return;
  }

  const effect = EFFECTS[currentEffect];
  let filterValue = value;

  if (effect.filter === 'grayscale' || effect.filter === 'sepia') {
    filterValue = value.toFixed(1);
  }

  if (effect.filter === 'invert') {
    filterValue = `${value}%`;
  }

  if (effect.filter === 'blur') {
    filterValue = `${value}px`;
  }

  imagePreviewElement.style.filter = `${effect.filter}(${filterValue})`;
};

const updateSliderForEffect = () => {
  const effect = EFFECTS[currentEffect];

  effectLevelSliderElement.noUiSlider.updateOptions({
    range: {
      min: effect.min,
      max: effect.max,
    },
    start: effect.max,
    step: effect.step,
  });

  effectLevelSliderElement.noUiSlider.set(effect.max);
};

const onEffectChange = (evt) => {
  if (!evt.target.matches('input[type="radio"]')) {
    return;
  }

  currentEffect = evt.target.value;

  if (currentEffect === DEFAULT_EFFECT) {
    hideSlider();
    imagePreviewElement.style.filter = 'none';
    effectLevelValueElement.value = '';
    return;
  }

  showSlider();
  updateSliderForEffect();
  applyEffect(EFFECTS[currentEffect].max);
  effectLevelValueElement.value = EFFECTS[currentEffect].max;
};

const initSlider = () => {
  if (isSliderInitialized || !effectLevelSliderElement || !window.noUiSlider) {
    return;
  }

  noUiSlider.create(effectLevelSliderElement, {
    range: {
      min: SLIDER_RANGE_MIN,
      max: SLIDER_RANGE_MAX,
    },
    start: SLIDER_START,
    step: 1,
    connect: 'lower',
  });

  effectLevelSliderElement.noUiSlider.on('update', () => {
    const value = Number(effectLevelSliderElement.noUiSlider.get());
    effectLevelValueElement.value = value;
    applyEffect(value);
  });

  isSliderInitialized = true;
  hideSlider();
};

const resetImageEditor = () => {
  updateScale(SCALE_DEFAULT);
  currentEffect = DEFAULT_EFFECT;

  const noneEffectRadio = document.querySelector('#effect-none');
  if (noneEffectRadio) {
    noneEffectRadio.checked = true;
  }

  hideSlider();
  imagePreviewElement.style.filter = 'none';
  effectLevelValueElement.value = '';

  if (isSliderInitialized) {
    effectLevelSliderElement.noUiSlider.set(SLIDER_START);
  }
};

const initImageEditor = () => {
  updateScale(SCALE_DEFAULT);
  initSlider();

  scaleSmallerElement.removeEventListener('click', onScaleSmallerClick);
  scaleBiggerElement.removeEventListener('click', onScaleBiggerClick);
  effectsListElement.removeEventListener('change', onEffectChange);

  scaleSmallerElement.addEventListener('click', onScaleSmallerClick);
  scaleBiggerElement.addEventListener('click', onScaleBiggerClick);
  effectsListElement.addEventListener('change', onEffectChange);
};

export { initImageEditor, resetImageEditor };
