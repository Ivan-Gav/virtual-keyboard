class Key {
  constructor(keyObject) {
    this.code = keyObject.code;
    this.lowerCase = keyObject.lowerCase;
    this.upperCase = keyObject.upperCase;
    this.emphasized = keyObject.emphasized;
    this.sizeL = keyObject.sizeL;
    this.sizeXL = keyObject.sizeXL;
  }

  generateKey() {
    const key = document.createElement('div');
    key.className = 'key';
    key.setAttribute('data-code', this.code);
    if (this.code === 'Space') {
      key.classList.add('key_size_space');
    } else if (this.sizeL) {
      key.classList.add('key_size_l');
    } else if (this.sizeXL) {
      key.classList.add('key_size_xl');
    }
    if (this.emphasized) {
      key.classList.add('key_emphasized');
    }
    key.innerText = this.lowerCase;
    return key;
  }
}
export default Key;
