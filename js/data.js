import { createPopupElement } from './card.js';
import { createOfferMarker } from './map.js';

const OFFERS_COUNT = 10;
const LOW_PRICE = 120;
const HIGH_PRICE = 700;
const cardTemplate = document.querySelector('#card').content;
const cardPopup = cardTemplate.querySelector('.popup');
const housingTypeInput = document.querySelector('#housing-type');
const housingPriceInput = document.querySelector('#housing-price');
const housingRoomsInput = document.querySelector('#housing-rooms');
const housingGuestsInput = document.querySelector('#housing-guests');
const housingFeaturesInput = document.querySelector('#housing-features').querySelectorAll('input[type=checkbox]');

const filterPrice = (value, price) => {
  if (value === 'middle' && price >= LOW_PRICE && price <= HIGH_PRICE) {
    return true;
  }
  if (value === 'low' && price < LOW_PRICE) {
    return true;
  }
  if (value === 'high' && price > HIGH_PRICE) {
    return true;
  }
  return value === 'any';
};

const setHousingType = (cb) => {
  housingTypeInput.addEventListener('change', () => {
    cb();
  });
};

const setHousingPrice = (cb) => {
  housingPriceInput.addEventListener('change', () => {
    cb();
  });
};

const setHousingRooms = (cb) => {
  housingRoomsInput.addEventListener('change', () => {
    cb();
  });
};

const setHousingGuests = (cb) => {
  housingGuestsInput.addEventListener('change', () => {
    cb();
  });
};

const setHousingFeatures = (cb) => {
  for (const housingFeature of housingFeaturesInput) {
    housingFeature.addEventListener('change', () => {
      cb();
    });
  }
};

const getOfferRank = (obj) => {
  let rank = 0;
  for (const housingFeature of housingFeaturesInput) {
    if (obj.offer.features && housingFeature.checked) {
      obj.offer.features.forEach((feature) => {
        if (feature === housingFeature.value) {
          rank += 1;
        }
      });
    }
  }
  return rank;
};

const compareOffers = (offerA, offerB) => {
  const rankA = getOfferRank(offerA);
  const rankB = getOfferRank(offerB);
  return rankB - rankA;
};

const renderOffers = (offers, mapElement) => {
  mapElement.clearLayers();
  offers
    .filter((obj) => obj.offer.type === housingTypeInput.value || housingTypeInput.value === 'any')
    .filter((obj) => filterPrice(housingPriceInput.value, obj.offer.price))
    .filter((obj) => obj.offer.rooms === Number(housingRoomsInput.value) || housingRoomsInput.value === 'any')
    .filter((obj) => obj.offer.guests === Number(housingGuestsInput.value) || housingGuestsInput.value === 'any')
    .sort(compareOffers)
    .slice(0, OFFERS_COUNT)
    .forEach((offer) => {
      createOfferMarker(offer, mapElement, createPopupElement(cardPopup, offer));
    });
};

export { renderOffers, setHousingType, setHousingPrice, setHousingRooms, setHousingGuests, setHousingFeatures };
