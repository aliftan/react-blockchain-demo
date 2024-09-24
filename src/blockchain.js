import crypto from 'crypto-js';

class Block {
    constructor(timestamp, data, previousHash = '') {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return crypto.SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(Date.now(), "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

export class ProductCRUD {
    constructor() {
        this.blockchain = new Blockchain();
    }

    createProduct(product) {
        const newBlock = new Block(Date.now(), { action: 'CREATE', product });
        this.blockchain.addBlock(newBlock);
    }

    updateProduct(productId, updatedProduct) {
        const newBlock = new Block(Date.now(), { action: 'UPDATE', productId, updatedProduct });
        this.blockchain.addBlock(newBlock);
    }

    deleteProduct(productId) {
        const newBlock = new Block(Date.now(), { action: 'DELETE', productId });
        this.blockchain.addBlock(newBlock);
    }

    getAllProducts() {
        const products = {};
        for (const block of this.blockchain.chain) {
            if (block.data && typeof block.data === 'object') {
                if (block.data.action === 'CREATE' && block.data.product) {
                    products[block.data.product.id] = block.data.product;
                } else if (block.data.action === 'UPDATE' && block.data.updatedProduct) {
                    products[block.data.updatedProduct.id] = block.data.updatedProduct;
                } else if (block.data.action === 'DELETE' && block.data.productId) {
                    delete products[block.data.productId];
                }
            }
        }
        return Object.values(products);
    }

    getBlockchain() {
        return this.blockchain;
    }

    // Demo function to tamper with a block
    tamperWithBlock(index, newData) {
        if (index > 0 && index < this.blockchain.chain.length) {
            this.blockchain.chain[index].data = newData;
        }
    }

    // Demo function to validate the chain
    validateChain() {
        return this.blockchain.isChainValid();
    }

    reset() {
        this.blockchain = new Blockchain();
    }
}