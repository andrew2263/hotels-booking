const TYPES = {
  'flat': 'Квартира',
  'bungalow': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец',
  'hotel': 'Отель',
};

const fillElement = (element, data) => {
  if (!data || !data.length) {
    element.classList.add('hidden');
  }
  element.textContent = data;
};

const createList = (listItems, datalist, classNameTemplate) => {
  listItems.forEach((listItem) => {
    const isNecessary = datalist.some(
      (dataItem) => listItem.classList.contains(`${classNameTemplate}${dataItem}`),
    );
    if (!isNecessary) {
      listItem.remove();
    }
  });
};

const createPopupElement = (popup, offer) => {
  const offerInfo = offer.offer;
  const card = popup.cloneNode(true);
  const titleElement = card.querySelector('.popup__title');
  const addressElement = card.querySelector('.popup__text--address');
  const priceElement = card.querySelector('.popup__text--price');
  const typeElement = card.querySelector('.popup__type');
  const сapacityElement = card.querySelector('.popup__text--capacity');
  const timeElement = card.querySelector('.popup__text--time');
  const features = card.querySelectorAll('.popup__feature');
  const descriptionElement = card.querySelector('.popup__description');
  const photosElement = card.querySelector('.popup__photos');
  const avatarElement = card.querySelector('.popup__avatar');

  fillElement(titleElement, offerInfo.title);
  fillElement(addressElement, offerInfo.address);
  fillElement(priceElement, `${offerInfo.price} \u20ac/ночь`);
  fillElement(typeElement, TYPES[offerInfo.type]);
  fillElement(сapacityElement, `${offerInfo.rooms} комнаты для ${offerInfo.guests} гостей`);
  fillElement(timeElement, `Заезд после ${offerInfo.checkin}, выезд до ${offerInfo.checkout}`);
  fillElement(descriptionElement, offerInfo.description);

  if (offerInfo.features) {
    createList(features, offerInfo.features, 'popup__feature--');
  }

  if (!offerInfo.features) {
    features.forEach((feature) => {
      feature.remove();
    });
  }

  if (!offerInfo.photos || offerInfo.photos.length === 0) {
    photosElement.classList.add('hidden');
  }

  if (offerInfo.photos) {
    photosElement.innerHTML = '';
    offerInfo.photos.forEach((offerPhoto) => {
      const photoElement = document.createElement('img');
      photoElement.src = offerPhoto;
      photoElement.classList.add('popup__photo');
      photoElement.width = '45';
      photoElement.height = '40';
      photoElement.alt = 'Фотография жилья';
      photosElement.appendChild(photoElement);
    });
  }

  avatarElement.src = offer.author.avatar;

  return card;
};

export { createPopupElement };
