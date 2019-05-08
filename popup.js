chrome.tabs.getSelected(null, function ({ url }) {
  const app = new App(url);
});

class App {
  constructor(tabUrl) {
    this.tabUrl = tabUrl;
    this.action = '';
    this.url = 'http://52.191.130.125:5000/';
    this.input = document.getElementById('idField');
    this.errorContainer = document.getElementById('errorContainer');
    this.form = document.forms['submit-form'];
    this.init();
  }

  init() {
    this._addEventListeners();
    this._setMessageListener();
    this._storageWorker();
  }

  _addEventListeners() {
    this.form.addEventListener('submit', event => {
      event.preventDefault();
    });
    document.querySelector('.btn-container').addEventListener('click', event => {
      this.action = event.target.name;
      if (this.form.checkValidity()) {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" });
        });
      }
    });
    this.input.addEventListener('change', (event) => {
      const id = event.target.value;
      chrome.storage.sync.set({ [`${this.tabUrl}-id`]: id });
    });
  }

  _setMessageListener() {
    chrome.runtime.onMessage.addListener(event => {
      this._resetError();
      const data = {
        id: this.input.value,
        url: this.tabUrl,
        html: event.html
      };
      fetch(`${this.url}${this.action}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(this._handleErrors)
      .then(data => {
        const contentType = data.headers.get("content-type");
        
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return data.json();
        } else {
          return true;
        }})
      .then((data) => this._mapDataToTemplate(data))
      .catch(err => this._errorHandler(err));
    });
  }

  _mapDataToTemplate(data) {
    if (data) {
      const innerData = (typeof data === 'string') ? JSON.parse(data) : data;
      if (innerData.generated_description) {
        document.querySelector('.content-description').innerHTML = `
          <p class="content-description__text">
            <strong>Description:</strong>
            ${innerData.generated_description}
          </p>
          <p class="content-description__text">
            <strong>Indian description:</strong> 
            ${innerData.indian_description}
          </p>
        `;
        chrome.storage.sync.set({ [`${this.tabUrl}-content`]: JSON.stringify(innerData) });
        return;
      }
      if (!document.querySelector('.content-description_success')) {
        document.querySelector('.content-description').innerHTML += `
          <p class="content-description_success">
            Successfully saved to database
          </p>`;
      }
    }
  }

  _errorHandler(err) {
    console.log(err);
    this.errorContainer.innerHTML = 'Something went wrong, please try again.';
  }

  _handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
  }

  _resetError() {
    this.errorContainer.innerHTML = '';
  }

  _storageWorker() {
    chrome.storage.sync.get(`${this.tabUrl}-id`, data => {
      this.input.value = data[`${this.tabUrl}-id`] || '';
    });
    chrome.storage.sync.get(`${this.tabUrl}-content`, data => {
      this._mapDataToTemplate(data[`${this.tabUrl}-content`]);
    });
  }
}
