const crypto = require('crypto');
const BufferList = require('bl');
class CryptLib {
	constructor() {
		this._maxKeySize = 32;
		this._maxIVSize = 16;
		this._algorithm = 'AES-256-CBC';
		this._charset = 'utf8';
		this._encoding = 'base64';
		this._hashAlgo = 'sha256';
		this._digestEncoding = 'hex';

		this._characterMatrixForRandomIVStringGeneration = [
			'A',
			'B',
			'C',
			'D',
			'E',
			'F',
			'G',
			'H',
			'I',
			'J',
			'K',
			'L',
			'M',
			'N',
			'O',
			'P',
			'Q',
			'R',
			'S',
			'T',
			'U',
			'V',
			'W',
			'X',
			'Y',
			'Z',
			'a',
			'b',
			'c',
			'd',
			'e',
			'f',
			'g',
			'h',
			'i',
			'j',
			'k',
			'l',
			'm',
			'n',
			'o',
			'p',
			'q',
			'r',
			's',
			't',
			'u',
			'v',
			'w',
			'x',
			'y',
			'z',
			'0',
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'-',
			'_',
		];
	}

	/**
	 * private function: _encryptDecrypt
	 * encryptes or decrypts to or from text or encrypted text given an iv and key
	 * @param  {string}  text        can be plain text or encrypted text
	 * @param  {string}  key         the key used to encrypt or decrypt
	 * @param  {string}  initVector  the initialization vector to encrypt or
	 *                               decrypt
	 * @param  {bool}    isEncrypt   true = encryption, false = decryption
	 * @return {string}              encryted text or plain text
	 */
	_encryptDecrypt(text, key, initVector, isEncrypt) {
		if (!text || !key) {
			throw (
				'cryptLib._encryptDecrypt: -> key and plain or encrypted text ' +
				'required'
			);
		}

		let ivBl = new BufferList(),
			keyBl = new BufferList(),
			keyCharArray = key.split(''),
			ivCharArray = [],
			encryptor,
			decryptor,
			clearText;

		if (initVector && initVector.length > 0) {
			ivCharArray = initVector.split('');
		}

		for (let i = 0; i < this._maxIVSize; i++) {
			ivBl.append(ivCharArray.shift() || [null]);
		}

		for (let i = 0; i < this._maxKeySize; i++) {
			keyBl.append(keyCharArray.shift() || [null]);
		}

		if (isEncrypt) {
			encryptor = crypto.createCipheriv(
				this._algorithm,
				keyBl.toString(),
				ivBl.toString()
			);
			encryptor.setEncoding(this._encoding);
			encryptor.write(text);
			encryptor.end();
			return encryptor.read();
		}

		decryptor = crypto.createDecipheriv(
			this._algorithm,
			keyBl.toString(),
			ivBl.toString()
		);
		let dec = decryptor.update(text, this._encoding, this._charset);
		dec += decryptor.final(this._charset);
		return dec;
	}

	/**
	 * private function: _isCorrectLength
	 * checks if length is preset and is a whole number and > 0
	 * @param  {int}  length
	 * @return {bool}
	 */
	_isCorrectLength(length) {
		return length && /^\d+$/.test(length) && parseInt(length, 10) !== 0;
	}

	generateRandomIV(length) {
		if (!this._isCorrectLength(length)) {
			throw 'cryptLib.generateRandomIV() -> needs length or in wrong format';
		}

		let randomBytes = crypto.randomBytes(length),
			_iv = [];

		for (let i = 0; i < length; i++) {
			let ptr =
				randomBytes[i] %
				this._characterMatrixForRandomIVStringGeneration.length;
			_iv[i] = this._characterMatrixForRandomIVStringGeneration[ptr];
		}
		return _iv.join('');
	}

	generateRandomIV16() {
		let randomBytes = crypto.randomBytes(16),
			_iv = [];

		for (let i = 0; i < 16; i++) {
			let ptr =
				randomBytes[i] %
				this._characterMatrixForRandomIVStringGeneration.length;
			_iv[i] = this._characterMatrixForRandomIVStringGeneration[ptr];
		}
		return _iv.join('');
	}
	getHashSha256(key, length) {
		if (!key) {
			throw 'cryptLib.getHashSha256() -> needs key';
		}

		if (!this._isCorrectLength(length)) {
			throw 'cryptLib.getHashSha256() -> needs length or in wrong format';
		}

		return crypto
			.createHash(this._hashAlgo)
			.update(key)
			.digest(this._digestEncoding)
			.substring(0, length);
	}

	encrypt(plainText, key, initVector) {
		return this._encryptDecrypt(plainText, key, initVector, true);
	}

	decrypt(encryptedText, key, initVector) {
		return this._encryptDecrypt(encryptedText, key, initVector, false);
	}

	encryptPlainTextWithRandomIV(plainText, key) {
		return this._encryptDecrypt(
			this.generateRandomIV16() + plainText,
			this.getHashSha256(key, 32),
			this.generateRandomIV16(),
			true
		);
	}

	decryptCipherTextWithRandomIV(cipherText, key) {
		let out = this._encryptDecrypt(
			cipherText,
			this.getHashSha256(key, 32),
			this.generateRandomIV16(),
			false
		);
		return out.substring(16, out.length);
	}
}

module.exports = new CryptLib();
