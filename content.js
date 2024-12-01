// Add encryption/decryption buttons to tweet compose box
function addEncryptButton() {
  const tweetBoxes = document.querySelectorAll('[data-testid="tweetTextarea_0"]');
  
  tweetBoxes.forEach(tweetBox => {
    if (!tweetBox.parentElement.querySelector('.twcipher-encrypt')) {
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'twcipher-buttons';
      
      const encryptButton = document.createElement('button');
      encryptButton.className = 'twcipher-encrypt';
      encryptButton.textContent = '🔒 Encrypt';
      encryptButton.onclick = async () => {
        const text = tweetBox.value;
        if (!text) {
          alert('Please enter a message to encrypt');
          return;
        }

        // Get recipient's email (you might want to implement a better UI for this)
        const recipientEmail = prompt("Enter recipient's email:");
        if (!recipientEmail) return;

        try {
          // Get recipient's public key (this should be implemented)
          // For now, we'll use our own public key for demonstration
          const keys = await chrome.storage.local.get(['publicKey']);
          if (!keys.publicKey) {
            alert('No public key found. Please generate your keys first.');
            return;
          }

          const publicKey = await openpgp.readKey({ armoredKey: keys.publicKey });
          const message = await openpgp.createMessage({ text });
          
          const encrypted = await openpgp.encrypt({
            message,
            encryptionKeys: publicKey,
            format: 'armored'
          });

          // Ensure the message starts and ends with proper PGP markers
          if (!encrypted.startsWith('-----BEGIN PGP MESSAGE-----')) {
            alert('Encrypted message is too long for Twitter. Please shorten your message.');
            return;
          }

          tweetBox.value = encrypted;
        } catch (error) {
          console.error('Encryption error:', error);
          alert('Error encrypting message: ' + error.message);
        }
      };

      buttonContainer.appendChild(encryptButton);
      tweetBox.parentElement.appendChild(buttonContainer);
    }
  });
}

// Add decryption button to tweets
function addDecryptButtons() {
  const tweets = document.querySelectorAll('[data-testid="tweet"]');
  
  tweets.forEach(tweet => {
    const tweetText = tweet.querySelector('[data-testid="tweetText"]');
    if (tweetText && !tweet.querySelector('.twcipher-decrypt')) {
      const text = tweetText.textContent;
      
      // Check if the tweet contains a proper PGP message
      if (text.includes('-----BEGIN PGP MESSAGE-----') && text.includes('-----END PGP MESSAGE-----')) {
        const decryptButton = document.createElement('button');
        decryptButton.className = 'twcipher-decrypt';
        decryptButton.textContent = '🔓 Decrypt';
        decryptButton.onclick = async () => {
          try {
            const keys = await chrome.storage.local.get(['privateKey']);
            if (!keys.privateKey) {
              alert('No private key found. Please generate your keys first.');
              return;
            }

            const privateKey = await openpgp.readPrivateKey({ armoredKey: keys.privateKey });
            
            // Extract the PGP message block
            const messageMatch = text.match(/-----BEGIN PGP MESSAGE-----([\s\S]*?)-----END PGP MESSAGE-----/);
            if (!messageMatch) {
              throw new Error('Invalid PGP message format');
            }
            
            const pgpMessage = messageMatch[0];
            const message = await openpgp.readMessage({
              armoredMessage: pgpMessage
            });

            const { data: decrypted } = await openpgp.decrypt({
              message,
              decryptionKeys: privateKey
            });

            alert('Decrypted message: ' + decrypted);
          } catch (error) {
            console.error('Decryption error:', error);
            alert('Error decrypting message: ' + error.message);
          }
        };

        tweet.appendChild(decryptButton);
      }
    }
  });
}

// Monitor for new tweets and compose boxes
const observer = new MutationObserver(() => {
  addEncryptButton();
  addDecryptButtons();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial setup
addEncryptButton();
addDecryptButtons();
