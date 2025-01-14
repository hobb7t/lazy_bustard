export async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('RandomURLSaverDB', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('urls')) {
        db.createObjectStore('urls', { keyPath: 'id', autoIncrement: true });
      }
      console.log('Database setup complete');
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function addUrl(db, url) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('urls', 'readwrite');
    const store = transaction.objectStore('urls');
    const request = store.add({ url });

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function getAllUrls(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('urls', 'readonly');
    const store = transaction.objectStore('urls');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function deleteUrl(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('urls', 'readwrite');
    const store = transaction.objectStore('urls');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
}
