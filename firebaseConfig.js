
//import firebase from '../node_modules/firebase';

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD563AzuhZsQtAZxYJ47oJQbSqUsVg5xg0',
  authDomain: 'hotelsbooking-c8e77.firebaseapp.com',
  databaseURL: 'https://hotelsbooking-c8e77-default-rtdb.firebaseio.com',
  projectId: 'hotelsbooking-c8e77',
  storageBucket: 'hotelsbooking-c8e77.appspot.com',
  messagingSenderId: '1038650046133',
  appId: '1:1038650046133:web:9100459ee7e2558c8870fc',
  measurementId: 'G-859CT8XF2E'
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
