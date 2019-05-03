// console.log('Hello from content');
// const selectorId = 'selector-color-hl';
// let isSelectorShown = false;
// const colors = [
//   {
//     color: '#eeffee',
//     name: 'some color'
//   },
//   {
//     color: '#eeffee',
//     name: 'some color'
//   },
//   {
//     color: '#eeffee',
//     name: 'some color'
//   },
//   {
//     color: '#eeffee',
//     name: 'some color'
//   },
//   {
//     color: '#eeffee',
//     name: 'some color'
//   }
// ];

// createColourSelector();

// document.onmouseup = mouseUpHandler;

// function mouseUpHandler(event) {
//   const selection = window.getSelection();
//   console.log(event);
//   if (event.target.tagName !== 'LABEL') {
//     hideSelector();
//   }
//   if (selection &&
//     selection.rangeCount &&
//     !selection.isCollapsed &&
//     !isSelectorShown) {
//     showSelector(event);
//     const range = selection.getRangeAt(0);
//     const span = document.createElement('span');

//   }
// }

// function createColourSelector() {
//   const selectorElement = document.createElement('div');
//   selectorElement.id = selectorId;
//   selectorElement.innerHTML = `
//     <div class="content">
//       <h3>Select color<h3>
//       <div class="colors">
//       </div>
//     </div>`;
//   const container = selectorElement.querySelector('.colors');
//   colors.forEach((item, index) => {
//     createColorInput(item, index, container);
//   });
//   document.body.appendChild(selectorElement);
// }

// function changeHandler(event, span, range) {
//   console.log(event);
//   span.className = 'highlight';
//   span.style.background = 'blue';
//   span.appendChild(range.extractContents());
//   range.insertNode(span);
// }

// function createColorInput(item, index, container) {
//   const input = document.createElement('input');
//   const label = document.createElement('label');
//   input.type = 'radio';
//   input.name = 'color';
//   input.onchange = changeHandler;
//   input.id = `color${index}`;
//   label.attributes.for = `color${index}`;
//   label.style.background = item.color;
//   container.appendChild(input);
//   container.appendChild(label);
// }

// function showSelector(event) {
//   const {pageX, pageY} = event;
//   const selector = document.getElementById(selectorId);
//   selector.style.top = `${pageY}px`;
//   selector.style.left = `${pageX}px`;
//   selector.style.display = 'block';
//   isSelectorShown = true;
// }

// function hideSelector() {
//   const selector = document.getElementById(selectorId);
//   selector.style.display = 'none';
//   isSelectorShown = false;
// }
chrome.runtime.onMessage.addListener(function (msg, sender) {
  // First, validate the message's structure
  chrome.runtime.sendMessage({html: document.body.innerHTML}, function(response) {
    console.log(response.farewell);
  });
});