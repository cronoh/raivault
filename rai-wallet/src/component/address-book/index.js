const { app } = require('electron');

const fs = require('fs');
const path = require('path');
const bluebird = require('bluebird');

const read = bluebird.promisify(fs.readFile);
const write = bluebird.promisify(fs.writeFile);

function getAddressBookPath() {
  return path.resolve(path.join(app.getPath('userData'), 'address-book.json'));
}

async function loadJsonFile(path) {
  return JSON.parse(await read(path));
}
async function saveJsonFile(path, data) {
  return await write(path, JSON.stringify(data));
}

async function createAddressBook() {
  return await saveJsonFile(getAddressBookPath(), []);
}

async function saveAddressBook(data) {
  return await saveJsonFile(getAddressBookPath(), data);
}

async function getAddressBook() {
  try {
    return await loadJsonFile(getAddressBookPath());
  } catch (err) {
    return await createAddressBook();
  }

}

module.exports = {
  getAddressBook,
  saveAddressBook,
};