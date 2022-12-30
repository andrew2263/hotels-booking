const createOffer = (onSuccess, onError) => fetch(
  'https://hotelsbooking-c8e77-default-rtdb.firebaseio.com/data.json',
  {
    method: 'GET',
    credentials: 'same-origin'
  },
)
  .then((response) => {
    if(response.ok) {
      return response.json();
    }

    throw new Error(`${response.status} ${response.statusText}`);
  })
  .then((data) => {
    onSuccess(data);
  })
  .catch((err) => {
    onError(err);
  });

const sendData = (onSuccess, onFail, body) => {
  fetch(
    'https://hotelsbooking-c8e77-default-rtdb.firebaseio.com//apartments.json',
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if(response.ok) {
        onSuccess();
      } else {
        throw new Error('Не удалось отправить форму. Попробуйте ещё раз.');
      }
    })
    .catch((err) => {
      onFail(err);
    });
};

export { createOffer, sendData };
