import { sendData } from './api.js';
import { isEscapeKey } from './util.js';

const adForm = document.querySelector('.ad-form');
const adTitleInput = adForm.querySelector('#title');
const adPriceInput = adForm.querySelector('#price');
const adTypeInput = adForm.querySelector('#type');
const adRoomNumberInput = adForm.querySelector('#room_number');
const adCapacityInput = adForm.querySelector('#capacity');
const adTimeinInput = adForm.querySelector('#timein');
const adTimeoutInput = adForm.querySelector('#timeout');
const errorTemplate = document.querySelector('#error').content;
const errorMessageElement = errorTemplate.querySelector('.error');
const errorButton = errorMessageElement.querySelector('.error__button');
const successTemplate = document.querySelector('#success').content;
const successMessageElement = successTemplate.querySelector('.success');

const toggleFormState = (form, inactiveClass) => {
  form.classList.toggle(inactiveClass);
  const elements = form.elements;
  for (const element of elements) {
    if (element.disabled) {
      element.disabled = false;
    } else {
      element.disabled = true;
    }
  }
};

const setMinPrice = (type) => {
  switch (type) {
    case 'bungalow': {
      return '0';
    }
    case 'flat': {
      return '15';
    }
    case 'hotel': {
      return '40';
    }
    case 'house': {
      return '70';
    }
    case 'palace': {
      return '140';
    }
    default: {
      return '0';
    }
  }
};

const roomsToCapacities = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0],
};

const onRoomsChange = () => {
  const roomNumber = adRoomNumberInput.value;
  const capacityNumber = Number(adCapacityInput.value);
  adCapacityInput.setCustomValidity(roomsToCapacities[roomNumber].includes(capacityNumber) ? '' : 'Количество гостей больше, чем комнат');
};

adTitleInput.addEventListener('input', () => {
  const minLength = Number(adTitleInput.attributes.minlength.value);
  const maxLength = Number(adTitleInput.attributes.maxlength.value);
  const valueLength = adTitleInput.value.length;

  if (valueLength < minLength) {
    adTitleInput.setCustomValidity(`Ещё ${ minLength - valueLength } символов`);
  } else if (valueLength > maxLength) {
    adTitleInput.setCustomValidity(`Удалите лишние ${ valueLength - maxLength } символов`);
  } else {
    adTitleInput.setCustomValidity('');
  }
});

adTypeInput.addEventListener('input', () => {
  adPriceInput.min = setMinPrice(adTypeInput.value);
  adPriceInput.placeholder = setMinPrice(adTypeInput.value);
});

adPriceInput.addEventListener('input', () => {
  adPriceInput.min = setMinPrice(adTypeInput.value);
  if (adPriceInput.value < Number(adPriceInput.min)) {
    adPriceInput.setCustomValidity(`Минимальное значение: ${ adPriceInput.min }`);
  } else if (adPriceInput.value > Number(adPriceInput.max)) {
    adPriceInput.setCustomValidity(`Максимальное значение: ${ adPriceInput.max }`);
  } else {
    adPriceInput.setCustomValidity('');
  }
});

adTimeinInput.addEventListener('input', () => {
  adTimeoutInput.value = adTimeinInput.value;
});

adTimeoutInput.addEventListener('input', () => {
  adTimeinInput.value = adTimeoutInput.value;
});

adCapacityInput.addEventListener('input', onRoomsChange);

const onMessageEscKeydown = (message) => (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeMessage(message);
  }
};

function showMessage (message) {
  document.body.append(message);
  document.addEventListener('keydown', onMessageEscKeydown(message));
}

function closeMessage (message) {
  message.remove();
  document.removeEventListener('keydown', onMessageEscKeydown(message));
}

successMessageElement.addEventListener('click', () => {
  successMessageElement.remove();
});

errorButton.addEventListener('click', () => {
  errorMessageElement.remove();
});

errorMessageElement.addEventListener('click', () => {
  errorMessageElement.remove();
});

const setAdFormSubmit = (onSuccess) => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    let obj = {};
    const formData = new FormData(evt.target);
    formData.forEach((value, key) => obj[key] = value);

    sendData(
      () => onSuccess(),
      () => showMessage(errorMessageElement),
      JSON.stringify(obj)
    );
  });
};

export { adForm, toggleFormState, setAdFormSubmit, showMessage, successMessageElement };
