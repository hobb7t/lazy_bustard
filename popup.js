import { openDatabase, addUrl, getAllUrls, deleteUrl } from './dbUtils.js';

// Save the current tab URL
document.getElementById('saveUrl').addEventListener('click', async () => {
  try {
    const db = await openDatabase();
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentUrl = tabs[0].url;
      console.log('Saving URL:', currentUrl);
      await addUrl(db, currentUrl);
      alert('URL saved!');
    });
  } catch (error) {
    console.error('Error saving URL:', error);
  }
});

// Open a random URL and auto-remove it if enabled
document.getElementById('randomUrl').addEventListener('click', async () => {
  try {
    const db = await openDatabase();
    const urls = await getAllUrls(db);

    if (urls.length === 0) {
      alert('No URLs saved!');
      return;
    }

    const randomIndex = Math.floor(Math.random() * urls.length);
    const randomUrl = urls[randomIndex];
    chrome.tabs.create({ url: randomUrl.url });

    chrome.storage.local.get({ autoRemove: false }, async (settings) => {
      if (settings.autoRemove) {
        console.log('Auto-removing URL:', randomUrl.url);
        await deleteUrl(db, randomUrl.id);
      }
    });
  } catch (error) {
    console.error('Error opening random URL:', error);
  }
});

// Open the settings page
document.getElementById('settings').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});
