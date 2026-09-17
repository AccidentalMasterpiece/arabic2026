/* Firebase Cloud Messaging service worker.
   This file must sit next to index.html and be served from the site root, because the
   browser wakes it up on its own to deliver notifications while the app is closed. */

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDiNSqQ0LkxdLKC3tmFGFlM4SECxdaL3Go",
  authDomain: "arab-app-e0625.firebaseapp.com",
  projectId: "arab-app-e0625",
  storageBucket: "arab-app-e0625.firebasestorage.app",
  messagingSenderId: "23557152420",
  appId: "1:23557152420:web:57146e65be05ff74301031"
});

const messaging = firebase.messaging();

/* Fired when a message arrives and the app is not in the foreground.
   A payload that already carries a `notification` block is shown by the browser on its
   own - handling it here as well produced two banners for one message. So we only render
   data-only payloads, and always use the same tag so a repeat replaces the old banner. */
messaging.onBackgroundMessage((payload) => {
  if (payload && payload.notification) return;
  const d = (payload && payload.data) || {};
  if (!d.title && !d.body) return;
  self.registration.showNotification(d.title || 'הגיע הזמן לתרגל! 📚', {
    body: d.body || 'כמה דקות של תרגול ויש רצף!',
    dir: 'rtl',
    lang: 'he',
    tag: 'daily-reminder'
  });
});

// Tapping the notification focuses an open tab, or opens the app if none is running.
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
