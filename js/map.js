// eslint-disable-next-line
const mainPinIcon = L.icon({
  iconUrl: '../img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

// eslint-disable-next-line
const marker = L.marker(
  {
    lat: 52.5117197,
    lng: 13.4003054,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

const createOfferMarker = (offer, map, popupElement) => {
  // eslint-disable-next-line
  const offerIcon = L.icon({
    iconUrl: '../img/pin.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  // eslint-disable-next-line
  const offerMarker = L.marker(
    {
      lat: offer.location.lat,
      lng: offer.location.lng,
    },
    {
      icon: offerIcon,
    },
  );

  offerMarker
    .addTo(map)
    .bindPopup(popupElement);
};

export { marker, createOfferMarker };
