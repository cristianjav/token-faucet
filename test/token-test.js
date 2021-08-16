const { expect } = require("chai");

describe("Token Faucet", function() {
  beforeEach( async function () {
    Token = await ethers.getContractFactory("TokenFaucet");
    this.token = await Token.deploy();
    await this.token.deployed();
  });

  it("Debería devolver la cantidad inicial de tokens.", async function() {
    expect(await this.token.totalSupply()).to.equal(ethers.BigNumber.from('1000000000000000000000'));
  });

  it("El total del supply debería estar en el contrato.", async function() {
    const totalSupply = await this.token.totalSupply();
    const balanceContrato = await this.token.balanceOf(this.token.address);
    expect(totalSupply).to.equal(balanceContrato);
  });

  it("Debería cambiar la cantidad de tokens que entrega la faucet a 1.", async function() {
    //Seteo cantidad
    const cantidad = ethers.BigNumber.from('1000000000000000000');
    await this.token.setAmount(cantidad);
    
    //Result
    expect(await this.token.amount()).to.equal(cantidad);
  });

  it("La faucet entrega 1 token al usuario.", async function() {
    const [, user] = await ethers.getSigners();
    await this.token.deployed();
    //Seteo la cantidad a entregar
    const cantidad = ethers.BigNumber.from('1000000000000000000');
    await this.token.setAmount(cantidad);

    //Uso la faucet con una address que no es el owner
    console.log('[Test] Address del usuario: ', user.address);
    await this.token.connect(user).faucet();
    const balance = ethers.BigNumber.from(await this.token.balanceOf(user.address));
    
    //Result
    expect(balance).to.equal(cantidad);
  });

  it("El usuario no puede reclamar 2 veces de la faucet por el timelock.", async function() {
    const [, user] = await ethers.getSigners();
    //Seteo la cantidad a entregar
    const cantidad = ethers.BigNumber.from('1000000000000000000');
    await this.token.setAmount(cantidad);
    //Seteo la cantidad de minutos de espera
    await this.token.setMinutos(5);

    //Uso la faucet con una address que no es el owner 2 veces
    //la segunda debería fallar
    await this.token.connect(user).faucet();

    //Result
    expect(await this.token.connect(user).checkPermiso(user.address)).to.equal(false);
  });
});
