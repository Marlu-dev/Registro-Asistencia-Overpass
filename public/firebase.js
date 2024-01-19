// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB-uy9WUnV4e-TdOj5y5mWKO8f6xwsFvgQ',
  authDomain: 'asistencia-overpass.firebaseapp.com',
  projectId: 'asistencia-overpass',
  storageBucket: 'asistencia-overpass.appspot.com',
  messagingSenderId: '1022223583693',
  appId: '1:1022223583693:web:b1dc56aba4f0867e171c84'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
