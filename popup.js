chrome.tabs.getSelected(null, function ({ url }) {
  const app = new App(url);
});

class App {
  constructor(tabUrl) {
    this.tabUrl = tabUrl;
    this.action = '';
    this.input = document.getElementById('idField');
    this.url = document.getElementById('url');
    chrome.storage.sync.get('url', data => this.url.value = data['url'] || '');
    this.init();
  }

  init() {
    this._addEventListeners();
    this._setMessageListener();
    this._storageWorker();
  }

  _addEventListeners() {
    document.forms['submit-form'].addEventListener('submit', event => {
      event.preventDefault();
    });
    document.querySelector('.btn-container').addEventListener('click', event => {
      this.action = event.target.name;
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" });
      });
    });
    this.input.addEventListener('change', (event) => {
      const id = event.target.value;
      chrome.storage.sync.set({ [`${this.tabUrl}-id`]: id });
    });
  }

  _setMessageListener() {
    chrome.runtime.onMessage.addListener(event => {
      const data = {
        id: this.input.value,
        url: this.tabUrl,
        html: event.html,
        action: this.action
      };

      if (this.url.value) {
        chrome.storage.sync.set({ url: this.url.value });
        fetch(this.url.value, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(data => data.json())
        .then((data) => this._mapDataToTemplate(data))
        .catch(err => {
  
        });
      }
    });
  }

  _mapDataToTemplate(data) {
    if (data) {
      console.log(typeof data)
      const innerData = (typeof data === 'string') ? JSON.parse(data) : data;
      document.querySelector('.content-description').innerHTML = `
        <p class="content-description__generated">Description: ${innerData.generated_description}</p>
        <p class="content-description__indian">Indian description: ${innerData.indian_description}</p>
      `;
      console.log(this);
      chrome.storage.sync.set({ [`${this.tabUrl}-content`]: JSON.stringify(innerData) });
    }
    
  }

  _storageWorker() {
    chrome.storage.sync.get(`${this.tabUrl}-id`, data => {
      this.input.value = data[`${this.tabUrl}-id`] || '';
    });
    chrome.storage.sync.get(`${this.tabUrl}-content`, data => {
      console.log(data);
      this._mapDataToTemplate(data[`${this.tabUrl}-content`]);
    });

  }
}
