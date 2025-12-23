const SUCCESS_TEMPLATE = document.querySelector('#success');
const ERROR_TEMPLATE = document.querySelector('#error');
const MESSAGE_TEMPLATE = document.querySelector('#messages');

const OVERLAY_Z_INDEX = '1000';
const OVERLAY_BACKGROUND = 'rgba(0, 0, 0, 0.8)';
const ESC_KEY = 'Escape';

const createMessage = (template, className) =>
  template.content.cloneNode(true).querySelector(`.${className}`);

const showOverlayMessage = ({ element, innerSelector, onClose }) => {
  const innerElement = element.querySelector(innerSelector);

  const onDocumentKeydown = (evt) => {
    if (evt.key === ESC_KEY) {
      evt.preventDefault();
      evt.stopPropagation();
      close();
    }
  };

  const onDocumentClick = (evt) => {
    if (innerElement && !innerElement.contains(evt.target)) {
      close();
    }
  };

  const close = () => {
    element.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onDocumentClick);
    onClose?.();
  };

  document.addEventListener('keydown', onDocumentKeydown, true);

  setTimeout(() => {
    document.addEventListener('click', onDocumentClick);
  }, 0);

  return close;
};

const showSuccess = () => {
  const successElement = createMessage(SUCCESS_TEMPLATE, 'success');
  document.body.append(successElement);

  const closeButton = successElement.querySelector('.success__button');

  const close = showOverlayMessage({
    element: successElement,
    innerSelector: '.success__inner',
  });

  closeButton.addEventListener('click', close);
};

const showError = (message, buttonText = 'Загрузить другой файл', onRetry = null) => {
  const errorElement = createMessage(ERROR_TEMPLATE, 'error');

  const titleElement = errorElement.querySelector('.error__title');
  const buttonElement = errorElement.querySelector('.error__button');

  if (titleElement && message) {
    titleElement.textContent = message;
  }

  if (buttonElement && buttonText) {
    buttonElement.textContent = buttonText;
  }

  errorElement.style.position = 'fixed';
  errorElement.style.inset = '0';
  errorElement.style.zIndex = OVERLAY_Z_INDEX;
  errorElement.style.backgroundColor = OVERLAY_BACKGROUND;

  document.body.append(errorElement);

  const close = showOverlayMessage({
    element: errorElement,
    innerSelector: '.error__inner',
    onClose: onRetry,
  });

  buttonElement.addEventListener('click', close);
};

const showLoading = () => {
  const loadingElement = createMessage(MESSAGE_TEMPLATE, 'img-upload__message');
  loadingElement.classList.add('img-upload__message--loading');
  document.body.append(loadingElement);
  return loadingElement;
};

const hideLoading = (loadingElement) => {
  if (loadingElement) {
    loadingElement.remove();
  }
};

export {
  showSuccess,
  showError,
  showLoading,
  hideLoading
};
