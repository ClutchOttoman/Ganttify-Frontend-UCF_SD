importScripts('https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.8.0/firebase-messaging.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyDuEofkd7RIg-4MTCbP-umA06fqwWp3U1s",
  authDomain: "ganttify-431d6.firebaseapp.com",
  projectId: "ganttify-431d6",
  storageBucket: "ganttify-431d6.firebasestorage.app",
  messagingSenderId: "975126548824",
  appId: "1:975126548824:web:c4170b99368effa842552d",
  measurementId: "G-6SD615SKVZ"
});

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[Service Worker] Background Message received: ', payload);
  // Customize the notification here
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
  });
});
