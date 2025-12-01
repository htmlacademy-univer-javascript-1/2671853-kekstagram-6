const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const EFFECTS = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    unit: '',
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
    filter: 'grayscale',
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
    filter: 'sepia',
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    filter: 'invert',
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
    filter: 'blur',
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
    filter: 'brightness',
  },
};

const DEFAULT_EFFECT = 'none';

const scaleControl = document.querySelector('.scale__control--value');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const imagePreview = document.querySelector('.img-upload__preview img');
const effectsList = document.querySelector('.effects__list');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');

let currentScale = SCALE_DEFAULT;
let currentEffect = DEFAULT_EFFECT;

const updateScale = (value) => {
  currentScale = value;
  scaleControl.value = `${value}%`;
  imagePreview.style.transform = `scale(${value / 100})`;
};

const onScaleSmallerClick = () => {
  const newValue = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
  updateScale(newValue);
};

const onScaleBiggerClick = () => {
  const newValue = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
  updateScale(newValue);
};

const applyEffect = (sliderValue) => {
  const effect = EFFECTS[currentEffect];

  if (currentEffect === 'none') {
    imagePreview.style.filter = 'none';
    return;
  }

  const percentage = sliderValue / 100;
  let filterValue;

  if (effect.filter === 'grayscale' || effect.filter === 'sepia') {
    filterValue = percentage.toFixed(1);
  } else if (effect.filter === 'invert') {
    filterValue = `${Math.round(percentage * 100)}%`;
  } else if (effect.filter === 'blur') {
    filterValue = `${(percentage * 3).toFixed(1)}px`;
  } else if (effect.filter === 'brightness') {
    filterValue = (1 + percentage * 2).toFixed(1);
  }

  imagePreview.style.filter = `${effect.filter}(${filterValue})`;
};

const initSlider = () => {
  if (!effectLevelSlider || !noUiSlider) {
    return;
  }

  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: (value) => Number.isInteger(value) ? value : value.toFixed(1),
      from: (value) => parseFloat(value),
    },
  });

  effectLevelSlider.noUiSlider.on('update', () => {
    const value = effectLevelSlider.noUiSlider.get();
    effectLevelValue.value = value;
    applyEffect(value);
  });
};

const resetEffect = () => {
  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.updateOptions({
      range: {
        min: 0,
        max: 100,
      },
      start: 100,
      step: 1,
    });
    effectLevelSlider.noUiSlider.set(100);
  }
  applyEffect(100);
};

const onEffectChange = (evt) => {
  if (!evt.target.matches('input[type="radio"]')) {
    return;
  }

  currentEffect = evt.target.value;

  if (currentEffect === 'none') {
    effectLevelContainer.classList.add('hidden');
    imagePreview.style.filter = 'none';
  } else {
    effectLevelContainer.classList.remove('hidden');
    resetEffect();
  }
};

const resetImageEditor = () => {
  updateScale(SCALE_DEFAULT);
  currentEffect = DEFAULT_EFFECT;

  const noneEffectRadio = document.querySelector('#effect-none');
  if (noneEffectRadio) {
    noneEffectRadio.checked = true;
  }

  effectLevelContainer.classList.add('hidden');
  imagePreview.style.filter = 'none';

  if (effectLevelSlider.noUiSlider) {
    resetEffect();
  }
};

const initImageEditor = () => {
  updateScale(SCALE_DEFAULT);
  scaleSmaller.addEventListener('click', onScaleSmallerClick);
  scaleBigger.addEventListener('click', onScaleBiggerClick);

  initSlider();

  effectsList.addEventListener('change', onEffectChange);

  effectLevelContainer.classList.add('hidden');
};

export { initImageEditor, resetImageEditor };
