# TwCipher

A Chrome extension that enables GPG encryption and decryption of Twitter messages.

## Features

- Generate GPG key pairs based on email address
- Encrypt messages for specific recipients
- Decrypt messages using your private key
- Seamless integration with Twitter's compose box and tweet display
- Secure storage of keys using Chrome's storage API

## Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon to open the popup
2. Enter your email and generate your GPG keys
3. Share your public key with others who want to send you encrypted messages
4. When composing a tweet, click the 🔒 button to encrypt your message
5. When viewing an encrypted tweet, click the 🔓 button to decrypt it

## Security Notes

- Your private key never leaves your browser
- Keys are stored securely using Chrome's storage API
- Always verify you're using the correct public key for encryption

## Dependencies

- OpenPGP.js for encryption/decryption

## Development

To modify the extension:

1. Make your changes to the source files
2. Reload the extension in Chrome
3. Test your changes

## Known Limitations and Security Considerations

### Email Spoofing Risks
- No email verification during key generation
- Users can generate keys for any email address without verification
- Multiple key pairs could exist for the same email address
- No way to verify if a public key legitimately belongs to the claimed email address

### Key Management Issues
- No secure key distribution mechanism
- Manual sharing of public keys required
- No central trusted key server
- No way to verify the authenticity of received public keys
- No key revocation system in place

### Missing Security Features
- No Web of Trust implementation
- No Certificate Authority integration
- No email ownership verification
- No mechanism to handle compromised keys
- No revocation list maintenance
- No alerts for compromised or revoked keys

### Multi-Recipient Limitations
- One-to-one encryption only
- No group encryption support
- Twitter's 280 character limit restricts encrypted message length
- Each additional recipient would increase encrypted message size

These limitations are important to consider when using this extension for sensitive communications. Future versions may implement additional security features to address these concerns.

## License

MIT
