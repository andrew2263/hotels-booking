import { createOffer } from './api.js';
import { adForm, toggleFormState, setAdFormSubmit, showMessage, successMessageElement } from './form.js';
import { marker } from './map.js';
import { renderOffers, setHousingType, setHousingPrice, setHousingRooms, setHousingGuests, setHousingFeatures } from './data.js';
import { debounce } from './util.js';
import { onAvatarChange, onOfferPhotoChange, onFormResetPhoto } from './photo.js';

const resetButton = adForm.querySelector('.ad-form__reset');
const addressInput = adForm.querySelector('#address');
const mapFiltersForm = document.querySelector('.map__filters');
// eslint-disable-next-line
const map = L.map('map-canvas');
// eslint-disable-next-line
const markerGroup = L.layerGroup().addTo(map);
const RERENDER_DELAY = 500;

window.onload = () => {
  toggleFormState(adForm, 'ad-form--disabled');
  toggleFormState(mapFiltersForm, 'map__filters--disabled');
};

const resetMap = () => {
  marker.setLatLng({
    lat: 52.5247197,
    lng: 13.4293054,
  });

  map.setView({
    lat: 52.5247197,
    lng: 13.4293054,
  }, 13);

  map.closePopup();

  addressInput.value = '52.51172, 13.40031';
};

map
  .on('load', () => {
    toggleFormState(adForm, 'ad-form--disabled');
    toggleFormState(mapFiltersForm, 'map__filters--disabled');
    addressInput.value = '52.51172, 13.40031';
    
    createOffer((data) => {
      renderOffers(data, markerGroup);
      setHousingType(debounce(() => {
        renderOffers(data, markerGroup);
        resetMap();
      }, RERENDER_DELAY));
      setHousingPrice(debounce(() => {
        renderOffers(data, markerGroup);
        resetMap();
      }, RERENDER_DELAY));
      setHousingRooms(debounce(() => {
        renderOffers(data, markerGroup);
        resetMap();
      }, RERENDER_DELAY));
      setHousingGuests(debounce(() => {
        renderOffers(data, markerGroup);
        resetMap();
      }, RERENDER_DELAY));
      setHousingFeatures(debounce(() => {
        renderOffers(data, markerGroup);
        resetMap();
      }, RERENDER_DELAY));
    }, alert);
  })
  .setView({
    lat: 52.5247197,
    lng: 13.4293054,
  }, 13);

// eslint-disable-next-line
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

marker.addTo(map);

marker.on('moveend', (evt) => {
  addressInput.value = `${evt.target.getLatLng().lat.toFixed(5)}, ${evt.target.getLatLng().lng.toFixed(5)}`;
});

const onSuccess = () => {
  adForm.reset();
  onFormResetPhoto();
  showMessage(successMessageElement);
  resetMap();
};

resetButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  adForm.reset();
  onFormResetPhoto();
  resetMap();
});

onAvatarChange();
onOfferPhotoChange();
setAdFormSubmit(onSuccess);
