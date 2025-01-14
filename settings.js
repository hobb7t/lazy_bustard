import { openDatabase, getAllUrls, deleteUrl } from './dbUtils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const db = await openDatabase();
  const urlList = document.getElementById('urlList');
  const autoRemoveCheckbox = document.getElementById('autoRemove');

  // Load and display URLs
  const urls = await getAllUrls(db);
  urlList.innerHTML = '';
  urls.forEach((urlEntry) => {
    const li = document.createElement('li');
    li.textContent = urlEntry.url;
    li.dataset.id = urlEntry.id;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Delete';
    removeBtn.addEventListener('click', async () => {
      await deleteUrl(db, urlEntry.id);
      li.remove();
    });

    li.appendChild(removeBtn);
    urlList.appendChild(li);
  });

  // Load Auto Remove setting
  chrome.storage.local.get({ autoRemove: false }, (settings) => {
    autoRemoveCheckbox.checked = settings.autoRemove;
  });

  // Save Auto Remove setting
  document.getElementById('saveSettings').addEventListener('click', () => {
    const autoRemove = autoRemoveCheckbox.checked;
    chrome.storage.local.set({ autoRemove }, () => {
      alert('Settings saved!');
    });
  });
});
