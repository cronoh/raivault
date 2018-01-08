const addressBook = require('./index');

async function getAddressBookEndpoint(req, res) {
  try {
    return res.json(await addressBook.getAddressBook());
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function saveAddressBookEndpoint(req, res) {
  const account = req.body.account;
  const name = req.body.name;
  if (!account || !name) return res.status(400).json({ error: `Account and name are required` });
  const newAccount = {
    account,
    name,
  };
  try {
    const accounts = await addressBook.getAddressBook();
    const accountIndex = accounts.findIndex(a => a.account.toLowerCase() === account.toLowerCase());
    if (accountIndex !== -1) {
      accounts.splice(accountIndex, 1, newAccount); // Overwrite if the account already exists
    } else {
      accounts.push(newAccount);
    }

    await addressBook.saveAddressBook(accounts);

    return res.json(accounts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deleteAddressBookEndpoint(req, res) {
  const account = req.body.account;
  if (!account) return res.status(400).json({ error: `Account is required` });
  try {
    const accounts = await addressBook.getAddressBook();
    console.log(`Deleting? All:`, accounts);
    console.log(`Searching: ${account}`);
    const accountIndex = accounts.findIndex(a => a.account.toLowerCase() === account.toLowerCase());
    console.log(`Matching index?`);
    if (accountIndex !== -1) {
      accounts.splice(accountIndex, 1);
      await addressBook.saveAddressBook(accounts);
    }

    return res.json(accounts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAddressBookEndpoint,
  saveAddressBookEndpoint,
  deleteAddressBookEndpoint,
};