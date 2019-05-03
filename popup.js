chrome.tabs.getSelected(null, function ({ url }) {
  const app = new App(url);
});

class App {
  constructor(tabUrl) {
    this.tabUrl = tabUrl;
    this.action = '';
    this.input = document.getElementById('idField');
    this.init();
  }

  init() {
    this._addEventListeners();
    this._setMessageListener();
    this._storageWorker();
  }

  _addEventListeners() {
    document.forms['submit-form'].addEventListener('submit', e => {
      e.preventDefault();
    });
    document.querySelector('.btn-container').addEventListener('click', event => {
      this.action = event.target.name;
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" });
      });
    });
    this.input.addEventListener('change', (event) => {
      const id = event.target.value;
      chrome.storage.sync.set({ [`${this.tabUrl}-id`]: id })
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
      fetch('http://127.0.0.1/test', {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(data => console.log(data)).catch(err => {

      });
    });
  }

  _storageWorker() {
    chrome.storage.sync.get(`${this.tabUrl}-id`, (data) => {
      this.input.value = data[`${this.tabUrl}-id`] || '';
    });
  }
}
