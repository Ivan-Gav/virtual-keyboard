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
  let char = symbol;
  if (symbol === 'Backspace') {
    if ((output.selectionEnd === output.selectionStart)
    && (output.selectionEnd !== 0)) {
      output.selectionStart = output.selectionEnd - 1;
    }
    char = '';
  } else if (symbol === 'Del') {
    if (output.selectionEnd === output.selectionStart) {
      output.selectionEnd = output.selectionStart + 1;
    }
    char = '';
  } else if (symbol === 'Tab') {
    char = '    ';
  } else if (symbol === 'Enter') {
    char = '\n';
  } else if ((symbol === 'CapsLock')
    || (symbol === 'Shift')
    || (symbol === 'Ctrl')
    || (symbol === 'Alt')
    || (symbol === '⊞')) {
    char = '';
  } else if (symbol === '') {
    char = ' ';
  }
  output.setRangeText(char, output.selectionStart, output.selectionEnd, 'end');
  output.focus();
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
      // output.focus();
      key.classList.add('key_active');
      display(key.innerText);
      // console.log(key.innerText);
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

function blockRealKeyboard() {
  ['keydown', 'keyup', 'keypress'].forEach((event) => {
    output.addEventListener(event, (e) => {
      e.preventDefault();
    });
  });
}

blockRealKeyboard();
