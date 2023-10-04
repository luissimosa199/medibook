self.addEventListener("push", function (event) {
  var options = {
    body: event.data.text(),
    // You can add more options like icons, actions, etc. For example:
    // icon: 'path-to-icon.png',
    // badge: 'path-to-badge.png',
    // actions: [
    //   {action: 'explore', title: 'Explore', icon: 'path-to-icon.png'}
    // ]
  };

  event.waitUntil(
    self.registration.showNotification("My Notification Title", options)
  );
});

// Handle the 'notificationclick' event - triggered when a notification is clicked
self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // Close the notification

  // Handle the click action here. For instance, open a specific URL:
  event.waitUntil(clients.openWindow("https://panel.doxadoctor.com"));
});
