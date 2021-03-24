const SHA256 = require('crypto-js/sha256');

class MoulaBlock
{
	constructor(index, timestamp, data, precedingHash=" ")
	{
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.precedingHash = precedingHash;
		this.hash = this.computeHash();
	}
	computeHash()
	{
			return SHA256 (this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();	
	}
	checkChainValidity()
	{
		for(let i = 1; i < this.blockchain.length; i++)
		{
			const currentBlock = this.blockchain[i];
			const precedingBlock= this.blockchain[i-1];
			if(currentBlock.hash !== currentBlock.computeHash())
				return false;
			if(currentBlock.precedingHash !== precedingBlock.hash)
				return false;
		}
		return true;
	}
	proofOfWork(difficulty)
	{
		while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0"))
		{
			this.nonce++;
			this.hash = this.computeHash();
		}
	}
}

class MoulaBlockchain
{
	constructor()
	{
		this.blockchain = [this.startGenesisBlock()];
	}
	startGenesisBlock()
	{
		return new MoulaBlock(0, "24/03/2021", "First Block of the Moula", "0");
	}
	obtainLatestBlock()
	{
		return this.blockchain[this.blockchain.length - 1];
	}
	addNewBlock(newBlock){
		newBlock.precedingHash = this.obtainLatestBlock().hash;
		newBlock.hash = newBlock.computeHash();        
		this.blockchain.push(newBlock);
	}
}


let moulaCoin = new MoulaBlockchain();

moulaCoin.addNewBlock(new MoulaBlock(1, "24/03/2021", {sender: "Theo Jacquelin", recipient: "Thomas Hallard-Clot", quantity: 100}));

moulaCoin.addNewBlock(new MoulaBlock(2, "24/03/2021", {sender: "Thomas Hallard-Clot", recipient: "Quentin Robert de Beauchamps", quantity: 100}) );

console.log(JSON.stringify(moulaCoin, null, 4));