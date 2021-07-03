const { expect } = require("chai");

describe("Deploy & Initial Supply", function() {
  it("Debería devolver la cantidad inicial de tokens.", async function() {
    const Token = await ethers.getContractFactory("TokenFaucet");
    const token = await Token.deploy("Token Faucet", "TKNFCT");
    await token.deployed();

    expect(await token.totalSupply()).to.equal(ethers.BigNumber.from('1000000000000000000000'));
  });
});

describe("Custodia del supply", function(){
  it("El total del supply debería estar en el contrato.", async function() {
    const Token = await ethers.getContractFactory("TokenFaucet");
    const token = await Token.deploy("Token Faucet", "TKNFCT");
    await token.deployed();
    const totalSupply = await token.totalSupply();
    const balanceContrato = await token.balanceOf(token.address);
    expect(totalSupply).to.equal(balanceContrato);
  });
});

describe("El owner setea la cantidad de tokens que entrega la faucet.", function() {
  it("Debería cambiar la cantidad de tokens que entrega la faucet a 1.", async function() {
    //Deploy
    const Token = await ethers.getContractFactory("TokenFaucet");
    const token = await Token.deploy("Token Faucet", "TKNFCT");
    await token.deployed();
    //Seteo cantidad
    const cantidad = ethers.BigNumber.from('1000000000000000000');
    await token.setAmount(cantidad);
    
    //Result
    expect(await token.amount()).to.equal(cantidad);
  });
});

describe("Faucet.", function() {
 
  it("La faucet entrega 1 token al usuario.", async function() {
    const [, user] = await ethers.getSigners();
    //Deploy
    const Token = await ethers.getContractFactory('TokenFaucet');
    const token = await Token.deploy('TokenFaucet', 'TKNFCT');
    await token.deployed();
    //Seteo la cantidad a entregar
    const cantidad = ethers.BigNumber.from('1000000000000000000');
    await token.setAmount(cantidad);

    //Uso la faucet con una address que no es el owner
    console.log('[Test] Address del owner: ', await token.owner());
    console.log('[Test] Address del usuario: ', user.address);
    await token.connect(user).faucet();
    const balance = ethers.BigNumber.from(await token.balanceOf(user.address));
    
    //Result
    expect(balance).to.equal(cantidad);
  });

  it("El usuario no puede reclamar 2 veces de la faucet por el timelock.", async function() {
    const [, user] = await ethers.getSigners();
    //Deploy
    const Token = await ethers.getContractFactory('TokenFaucet');
    const token = await Token.deploy('TokenFaucet', 'TKNFCT');
    await token.deployed();
    //Seteo la cantidad a entregar
    const cantidad = ethers.BigNumber.from('1000000000000000000');
    await token.setAmount(cantidad);
    //Seteo la cantidad de minutos de espera
    await token.setMinutos(5);

    //Uso la faucet con una address que no es el owner 2 veces
    //la segunda debería fallar
    await token.connect(user).faucet();

    //Result
    expect(await token.connect(user).checkPermiso(user.address)).to.equal(false);
  });
});
