import { adForm } from './form.js';

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const avatarInput = adForm.querySelector('#avatar');
const avatarImgElement = adForm.querySelector('.ad-form-header__preview').querySelector('img');
const offerPhotoInput = adForm.querySelector('.ad-form__upload').querySelector('input[type=file]');
const offerPhotoElement = adForm.querySelector('.ad-form__photo');
const offerPhotoImgElement = document.createElement('img');
offerPhotoImgElement.width = 70;
offerPhotoImgElement.height = 70;

const addPhoto = (fileInput, photoElement) => {
  const file = fileInput.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((item) => fileName.endsWith(item));

  if (matches) {
    photoElement.src = URL.createObjectURL(file);
  }
};

avatarInput.addEventListener('change', () => {
  addPhoto(avatarInput, avatarImgElement);
});

offerPhotoInput.addEventListener('change', () => {
  addPhoto(offerPhotoInput, offerPhotoImgElement);
  offerPhotoElement.appendChild(offerPhotoImgElement);
});

adForm.addEventListener('reset', () => {
  avatarImgElement.src = '../img/muffin-grey.svg';
  offerPhotoElement.innerHTML = '';
});
