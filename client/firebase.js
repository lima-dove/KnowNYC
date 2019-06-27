import * as firebase from 'firebase'
import 'firebase/storage'
import 'firebase/database'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyD8jzuWIMLYbadbQ19s3Yjyh0wvpwdJvtA',
  authDomain: 'knownyc-d8d29.firebaseapp.com',
  databaseURL: 'https://knownyc-d8d29.firebaseio.com',
  projectId: 'knownyc-d8d29',
  storageBucket: 'knownyc-d8d29.appspot.com',
  messagingSenderId: '763596326918',
  appId: '1:763596326918:web:e1b7ca9eace55252'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()
