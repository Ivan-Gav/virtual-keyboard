import layoutUS from './modules/layoutUS.js';
import layoutRU from './modules/layoutRU.js';
import Key from './modules/key.js';

const body = document.querySelector('body');
let switchUpper = false;
let layoutCurrent = layoutUS;

if (!localStorage.getItem('layoutCurrent')) {
  localStorage.setItem('layoutCurrent', 'US');
} else if (localStorage.getItem('layoutCurrent') === 'RU') {
  layoutCurrent = layoutRU;
}

function buildPage() {
  const main = document.createElement('main');
  main.className = 'main';
  main.insertAdjacentHTML('beforeend', '<h1>RSS Virtual Keyboard</h1>');
  main.insertAdjacentHTML('beforeend', '<textarea name="text" id="output" cols="30" rows="10" autofocus></textarea>');
  main.insertAdjacentHTML('beforeend', '<section class="keyboard"></section>');
  main.insertAdjacentHTML('beforeend', '<p>OS - Windows. To switch layout use <strong>Ctrl + Shift</strong></p>');
  return main;
}

body.prepend(buildPage());

const keyboard = document.querySelector('.keyboard');
const output = document.querySelector('#output');

function buildKeyRow(layout, startInd, endInd) {
  const row = document.createElement('div');
  row.className = 'key-row';
  for (let i = startInd; i <= endInd; i += 1) {
    const key = new Key(layout[i]);
    row.append(key.generateKey());
  }
  return row;
}

function buildKeyboard(layout) {
  keyboard.append(buildKeyRow(layout, 0, 13));
  keyboard.append(buildKeyRow(layout, 14, 28));
  keyboard.append(buildKeyRow(layout, 29, 41));
  keyboard.append(buildKeyRow(layout, 42, 54));
  keyboard.append(buildKeyRow(layout, 55, 63));
}

function switchToUpperCase(layout) {
  keyboard.querySelectorAll('.key').forEach((element, i) => {
    const key = element;
    const keyData = layout[i];
    if (keyData.upperCase) {
      key.innerText = keyData.upperCase;
    } else {
      key.innerText = keyData.lowerCase.toUpperCase();
    }
  });
}

function switchToLowerCase(layout) {
  keyboard.querySelectorAll('.key').forEach((element, i) => {
    const key = element;
    key.innerText = layout[i].lowerCase;
  });
}

function switchCase() {
  if (switchUpper) {
    switchToUpperCase(layoutCurrent);
  } else {
    switchToLowerCase(layoutCurrent);
  }
}

function shift() {
  switchUpper = !switchUpper;
  switchCase();
}

buildKeyboard(layoutCurrent);

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
    char = '\t';
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

// -----------------------------------------------------------

(function handleClicks() {
  keyboard.addEventListener('mouseover', (event) => {
    const { target: key } = event;
    if (key.dataset.code) {
      key.classList.add('key_hover');
      key.addEventListener('mouseout', () => {
        key.classList.remove('key_hover');
      });
    }
  });
  keyboard.addEventListener('mousedown', (event) => {
    const { target: key } = event;
    const { code } = key.dataset;

    function remove() {
      if (code !== 'CapsLock') {
        key.classList.remove('key_active');
      }
      if ((code === 'ShiftLeft')
        || (code === 'ShiftRight')) {
        shift();
      }
      const unclickedKey = new CustomEvent('leave-key-signal', { detail: { code: `${code}` } });
      keyboard.dispatchEvent(unclickedKey);

      key.removeEventListener('mouseup', remove);
      key.removeEventListener('mouseout', remove);
    }

    if (code) {
      if (code === 'CapsLock') {
        key.classList.toggle('key_active');
      } else {
        key.classList.add('key_active');
      }
      display(key.innerText);

      const clickedKey = new CustomEvent('key-signal', { detail: { code: `${code}` } });
      keyboard.dispatchEvent(clickedKey);

      if ((code === 'ShiftLeft')
        || (code === 'ShiftRight')
        || (code === 'CapsLock')) {
        shift();
      }
      key.addEventListener('mouseup', remove);
      key.addEventListener('mouseout', remove);
    }
  });
}());

// -----------------------------------------------------------

(function blockRealKeyboard() {
  ['keydown', 'keyup', 'keypress'].forEach((event) => {
    output.addEventListener(event, (e) => {
      e.preventDefault();
    });
  });
}());

// -----------------------------------------------------------

function handleKeyPresses(layout) {
  body.addEventListener('keydown', (event) => {
    let { code } = event;
    code = (code === 'MetaRight') ? 'MetaLeft' : code;

    function remove(e) {
      if (e.code === code) {
        if (code !== 'CapsLock') {
          keyboard.querySelector(`[data-code=${code}]`).classList.remove('key_active');
        }
        if ((code === 'ShiftLeft')
        || (code === 'ShiftRight')) {
          shift();
        }

        const unpressedKey = new CustomEvent('leave-key-signal', { detail: { code: `${code}` } });
        keyboard.dispatchEvent(unpressedKey);

        body.removeEventListener('keyup', remove);
      }
    }

    if ((layout.find((keyObj) => keyObj.code === code))
    && (!event.repeat)) {
      const key = keyboard.querySelector(`[data-code=${code}]`);
      if (code === 'CapsLock') {
        key.classList.toggle('key_active');
      } else {
        key.classList.add('key_active');
      }
      if ((code === 'ShiftLeft')
        || (code === 'ShiftRight')
        || (code === 'CapsLock')) {
        shift();
      }

      const pressedKey = new CustomEvent('key-signal', { detail: { code: `${code}` } });
      keyboard.dispatchEvent(pressedKey);

      display(key.innerText);
      body.addEventListener('keyup', remove);
    }
  });
}

// ------------------------------------------------------------

handleKeyPresses(layoutCurrent);

function toggleLayout() {
  if (layoutCurrent === layoutUS) {
    layoutCurrent = layoutRU;
    localStorage.setItem('layoutCurrent', 'RU');
  } else {
    layoutCurrent = layoutUS;
    localStorage.setItem('layoutCurrent', 'US');
  }
  switchCase();
}

(function handleLayoutSwitchCombo() {
  const pressed = new Set();

  keyboard.addEventListener('key-signal', (event) => {
    pressed.add(event.detail.code);
    if (((pressed.has('ShiftLeft')) || (pressed.has('ShiftRight')))
    && ((pressed.has('ControlLeft')) || (pressed.has('ControlRight')))) {
      pressed.clear();
      toggleLayout();
    }
  });
  keyboard.addEventListener('leave-key-signal', (event) => {
    pressed.delete(event.detail.code);
  });
}());
