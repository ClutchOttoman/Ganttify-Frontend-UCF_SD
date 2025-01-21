import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuEofkd7RIg-4MTCbP-umA06fqwWp3U1s",
  authDomain: "ganttify-431d6.firebaseapp.com",
  projectId: "ganttify-431d6",
  storageBucket: "ganttify-431d6.firebasestorage.app",
  messagingSenderId: "975126548824",
  appId: "1:975126548824:web:c4170b99368effa842552d",
  measurementId: "G-6SD615SKVZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Service Worker registered with scope: ', registration.scope);
    })
    .catch(function(error) {
      console.error('Service Worker registration failed: ', error);
    });
}

// Request permission for notifications
function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      getNotificationToken();
    } else {
      console.log('Notification permission denied.');
    }
  });
}

// Get the notification token
function getNotificationToken() {
  getToken(messaging, { vapidKey: 'BOhvg-BxznJxvqAhqUA5JIIN25LYE9StAVKhyu8EI1VQ8L8BD8i1pFgDOkefUEjKXbqhRIdBfd8aMdVnm0LWO7M' })
    .then((currentToken) => {
      if (currentToken) {
        console.log('Notification token:', currentToken);
        // Send token to your server, if needed
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token: ', err);
    });
}

requestPermission();
