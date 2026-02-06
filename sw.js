// Service Worker - Elite Tracker PWA

// Écouter les notifications programmées
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, delay } = event.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body: body,
        icon: 'logo.png',
        badge: 'logo.png',
        vibrate: [200, 100, 200],
        tag: 'elite-tracker-' + Date.now()
      });
    }, delay);
  }
});

// Clic sur la notification -> ouvrir l'app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
