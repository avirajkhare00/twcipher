document.addEventListener('DOMContentLoaded', async () => {
  // Check if keys already exist
  const keys = await chrome.storage.local.get(['privateKey', 'publicKey', 'email']);
  if (keys.privateKey && keys.publicKey) {
    document.getElementById('setup-section').style.display = 'none';
    document.getElementById('keys-section').style.display = 'block';
    document.getElementById('public-key').textContent = keys.publicKey;
  }

  // Generate GPG Keys
  document.getElementById('generate-keys').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    try {
      const { privateKey, publicKey } = await openpgp.generateKey({
        type: 'rsa',
        rsaBits: 4096,
        userIDs: [{ email }],
        format: 'armored'
      });

      await chrome.storage.local.set({
        privateKey,
        publicKey,
        email
      });

      document.getElementById('setup-section').style.display = 'none';
      document.getElementById('keys-section').style.display = 'block';
      document.getElementById('public-key').textContent = publicKey;
    } catch (error) {
      alert('Error generating keys: ' + error.message);
    }
  });

  // Copy Public Key
  document.getElementById('copy-public-key').addEventListener('click', () => {
    const publicKey = document.getElementById('public-key').textContent;
    navigator.clipboard.writeText(publicKey);
    alert('Public key copied to clipboard!');
  });

  // Encrypt Message
  document.getElementById('encrypt').addEventListener('click', async () => {
    const recipientEmail = document.getElementById('recipient-email').value;
    const message = document.getElementById('message').value;

    if (!recipientEmail || !message) {
      alert('Please enter recipient email and message');
      return;
    }

    try {
      const publicKeyArmored = document.getElementById('public-key').textContent;
      const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

      const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }),
        encryptionKeys: publicKey
      });

      navigator.clipboard.writeText(encrypted);
      alert('Encrypted message copied to clipboard!');
    } catch (error) {
      alert('Error encrypting message: ' + error.message);
    }
  });

  // Decrypt Message
  document.getElementById('decrypt').addEventListener('click', async () => {
    const encryptedMessage = document.getElementById('encrypted-message').value;
    if (!encryptedMessage) {
      alert('Please enter an encrypted message');
      return;
    }

    try {
      const keys = await chrome.storage.local.get(['privateKey']);
      const privateKey = await openpgp.readPrivateKey({ armoredKey: keys.privateKey });

      const message = await openpgp.readMessage({
        armoredMessage: encryptedMessage
      });

      const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey
      });

      alert('Decrypted message: ' + decrypted);
    } catch (error) {
      alert('Error decrypting message: ' + error.message);
    }
  });
});
