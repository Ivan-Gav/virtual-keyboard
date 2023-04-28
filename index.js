import layoutUS from './modules/layoutUS.js';
import Key from './modules/key.js';

const body = document.querySelector('body');

// function clearBody() {
//   body.innerHTML = '<script src="index.js" type="module"></script>';
// }

// clearBody();

function buildSite() {
  const main = document.createElement('main');
  main.className = 'main';
  main.insertAdjacentHTML('beforeend', '<h1>RSS Virtual Keyboard</h1>');
  main.insertAdjacentHTML('beforeend', '<textarea name="text" id="output" cols="30" rows="10" autofocus></textarea>');
  main.insertAdjacentHTML('beforeend', '<section class="keyboard"></section>');
  main.insertAdjacentHTML('beforeend', '<p>OS - Windows. To switch layout use left ctrl + alt</p>');
  return main;
}

body.prepend(buildSite());

const keyboard = document.querySelector('.keyboard');
const output = document.querySelector('#output');

function buildRow(layout, startInd, endInd) {
  const row = document.createElement('div');
  row.className = 'key-row';
  for (let i = startInd; i <= endInd; i += 1) {
    const key = new Key(layout[i]);
    row.append(key.generateKey());
  }
  return row;
}

function buildKeyboard(layout) {
  keyboard.append(buildRow(layout, 0, 13));
  keyboard.append(buildRow(layout, 14, 28));
  keyboard.append(buildRow(layout, 29, 41));
  keyboard.append(buildRow(layout, 42, 54));
  keyboard.append(buildRow(layout, 55, 63));
}

buildKeyboard(layoutUS);

function display(symbol) {
  let start = output.selectionStart;
  let end = output.selectionEnd;
  const { length } = output.textContent;
  if (symbol === 'Backspace') {
    if (end !== start) {
      output.setRangeText('', start, end, 'end');
    } else if (end === 0) {
      start = length - 1;
      end = length;
      output.setRangeText('', start, end, 'end');
    } else {
      start = end - 1;
      output.setRangeText('', start, end, 'end');
    }
  } else if (symbol === 'Del') {
    if (end !== start) {
      output.setRangeText('', start, end, 'end');
    } else if (start === 0) {
      end = 1;
      output.setRangeText('', start, end, 'end');
    } else {
      end = start + 1;
      output.setRangeText('', start, end, 'end');
    }
  } else if (symbol === 'Tab') {
    output.insertAdjacentText('beforeend', '    ');
  } else if (symbol === 'Enter') {
    output.insertAdjacentHTML('beforeend', '\n');
  } else if ((symbol === 'CapsLock')
    || (symbol === 'Shift')
    || (symbol === 'Ctrl')
    || (symbol === 'Alt')
    || (symbol === '⊞')) {
    // do nothing;
  } else if (symbol === '') {
    output.insertAdjacentText('beforeend', ' ');
    start = length;
    end = length;
  } else {
    output.insertAdjacentText('beforeend', symbol);
    start = length;
    end = length;
  }
}

function clickListeners() {
  keyboard.addEventListener('mouseover', (event) => {
    const key = event.target;
    if (key.dataset.code) {
      key.classList.add('key_hover');
      key.addEventListener('mouseout', () => {
        key.classList.remove('key_hover');
      });
    }
  });
  keyboard.addEventListener('mousedown', (event) => {
    const key = event.target;
    if (key.dataset.code) {
      output.focus();
      key.classList.add('key_active');
      display(key.innerText);
      key.addEventListener('mouseup', () => {
        key.classList.remove('key_active');
      });
      key.addEventListener('mouseout', () => {
        key.classList.remove('key_active');
      });
    }
  });
}

clickListeners();
