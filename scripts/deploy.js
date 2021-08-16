hre = require('hardhat');

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const FaucetToken = await hre.ethers.getContractFactory('TokenFaucet');
    const faucettoken = await FaucetToken.deploy();

    await faucettoken.deployed();

    const balanceOfContract = await faucettoken.balanceOf(faucettoken.address);
    const manager = await faucettoken.comprobarSiManager(deployer.address);
    const balance = await deployer.getBalance();

    //console.log('Contract deployed by: ', deployer.address);
    console.log('FaucetToken deployed to: ', faucettoken.address);
    console.log('Balance: ', balance.toString());
    //console.log('Balance de TKNFCT en contrato: ', balanceOfContract.toString());
    //console.log('El deployer es manager: ', manager);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
