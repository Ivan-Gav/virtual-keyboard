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
  main.insertAdjacentHTML('beforeend', '<textarea name="text" class="output" cols="30" rows="10"></textarea>');
  main.insertAdjacentHTML('beforeend', '<section class="keyboard"></section>');
  main.insertAdjacentHTML('beforeend', '<p>OS - Windows. To switch layout use left ctrl + alt</p>');
  return main;
}

body.prepend(buildSite());

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
  const keyboard = document.querySelector('.keyboard');
  keyboard.append(buildRow(layout, 0, 13));
  keyboard.append(buildRow(layout, 14, 28));
  keyboard.append(buildRow(layout, 29, 41));
  keyboard.append(buildRow(layout, 42, 54));
  keyboard.append(buildRow(layout, 55, 63));
}

buildKeyboard(layoutUS);
