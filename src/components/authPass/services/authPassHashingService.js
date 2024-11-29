const Argon2 = require('argon2');

class PassHashingService {

    constructor(Utils) {

        const { Logger } = Utils;

        this.logger = Logger;
    }

    /**
     * Hash a password using Argon2id
     * @param {string} password password to hash
     * @returns {Promise<string>} hashed password
     */
    async hashPassword(password) {

        this.logger.info('<PassHashing> - Start Hash Password');

        return await Argon2.hash(password, {

            type: Argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 5,
            parallelism: 1
        });
    }

    /**
     * Verify a password with a given hash
     * @param {string} hash hashed password
     * @param {string} password password to verify
     * @returns {Promise<boolean>} true if the password is valid, false otherwise
     */
    async verifyPassword(hash, password) {

        this.logger.info('<PassHashing> - Start Verify Password');

        return await Argon2.verify(hash, password);
    }
}

module.exports = PassHashingService;