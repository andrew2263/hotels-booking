import { sendData } from './api.js';
import { isEscapeKey } from './util.js';
import { storage } from '../firebaseConfig.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
const submittingTemplate = document.querySelector('#submitting').content;
const submittingMessageElement = submittingTemplate.querySelector('.submitting');

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
  adCapacityInput.reportValidity();
};

const setAdTitle = () => {
  adTitleInput.addEventListener('input', () => {
    const minLength = Number(adTitleInput.attributes.minlength.value);
    const maxLength = Number(adTitleInput.attributes.maxlength.value);
    const valueLength = adTitleInput.value.length;

    console.log('input title');
  
    if (valueLength < minLength) {
      adTitleInput.setCustomValidity(`Ещё ${ minLength - valueLength } символов`);
    } else if (valueLength > maxLength) {
      adTitleInput.setCustomValidity(`Удалите лишние ${ valueLength - maxLength } символов`);
    } else {
      adTitleInput.setCustomValidity('');
    }
  });
};

adTypeInput.addEventListener('input', () => {
  console.log('input type');
  adPriceInput.min = setMinPrice(adTypeInput.value);
  adPriceInput.placeholder = setMinPrice(adTypeInput.value);
});

const setAdPrice = () => {
  adPriceInput.addEventListener('input', () => {
    adPriceInput.min = setMinPrice(adTypeInput.value);
    console.log('input price');
    if (adPriceInput.value < Number(adPriceInput.min)) {
      adPriceInput.setCustomValidity(`Минимальное значение: ${ adPriceInput.min }`);
    } else if (adPriceInput.value > Number(adPriceInput.max)) {
      adPriceInput.setCustomValidity(`Максимальное значение: ${ adPriceInput.max }`);
    } else {
      adPriceInput.setCustomValidity('');
    }
  });
};

const setAdTimein = () => {
  adTimeinInput.addEventListener('input', () => {
    console.log('imput time in');
    adTimeoutInput.value = adTimeinInput.value;
  });
};

const setAdTimeout = () => {
  adTimeoutInput.addEventListener('input', () => {
    console.log('input time out');
    adTimeinInput.value = adTimeoutInput.value;
  });
};

const setAdCapacity = () => {
  adCapacityInput.addEventListener('input', onRoomsChange);
};

const onMessageEscKeydown = (message) => (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeMessage(message);
  }
};

function showMessage (message) {
  document.body.append(message);
  if (message !== submittingMessageElement) {
    document.addEventListener('keydown', onMessageEscKeydown(message));
  }
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
  setAdTitle();
  setAdPrice();
  setAdTimein();
  setAdTimeout();
  setAdCapacity();

  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    showMessage(submittingMessageElement);

    let obj = {};
    let keys = [];
    const formData = new FormData(evt.target);

    const avatarUpload = formData.get('avatar');
    const imagesUpload = formData.get('images');

    const avatarRef = ref(storage, `avatar/${ avatarUpload.name }`);
    const imagesRef = ref(storage, `images/${ imagesUpload.name }`);

    const uploadFiles = async (ref, data) => {
      await uploadBytes(ref, data);
      const url = await getDownloadURL(ref);
      return url;
    };

    (async function () {
      const imagesUrl = await uploadFiles(imagesRef, imagesUpload);
      const avatarUrl = await uploadFiles(avatarRef, avatarUpload);

      formData.forEach((value, key) => {
        if (keys.includes(key)) {
          obj[key] = `${obj[key]} ${value}`;
        }
        if (!keys.includes(key)) {
          keys.push(key);
          obj[key] = value;
        }
        if (key === 'images') {
          obj[key] = imagesUrl;
        }
        if (key === 'avatar') {
          obj[key] = avatarUrl;
        }
      });
  
      sendData(
        () => {
          closeMessage(submittingMessageElement);
          onSuccess();
        },
        () => {
          closeMessage(submittingMessageElement);
          showMessage(errorMessageElement)
        },
        JSON.stringify(obj)
      );
    })();
  });
};

export { adForm, toggleFormState, setAdFormSubmit, showMessage, successMessageElement };