'use strict';

const Telegram = require('telegram-node-bot'),
    fs = require('fs');

class PersistentMemoryStorage extends Telegram.BaseStorage {
    constructor(userStoragePath, chatStoragePath) {
        super();

        this.userStoragePath = userStoragePath;
        this.chatStoragePath = chatStoragePath;
        this.isClean = false;

        this._storage = {
            userStorage: require(userStoragePath),
            chatStorage: require(chatStoragePath)
        };
    }

    get(storage, key) {
        return new Promise((resolve) => {
            resolve(this._storage[storage][key] || {});
        });
    }

    set(storage, key, data) {
        return new Promise((resolve) => {
            this._storage[storage][key] = data;
            if (this.clean) this.clean = false;
            resolve();
        });
    }

    remove(storage, key) {
        return new Promise((resolve) => {
            if (this.clean) this.clean = false;
            delete this._storage[storage][key];
            resolve();
        });
    }

    flush() {
        if (this.clean) return;
        fs.writeFileSync(this.userStoragePath, JSON.stringify(this._storage.userStorage));
        fs.writeFileSync(this.chatStoragePath, JSON.stringify(this._storage.chatStorage));
        this.clean = true;
    }
}

module.exports = PersistentMemoryStorage;