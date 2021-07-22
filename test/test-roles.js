const { expect } = require("chai");

describe("Deploy & Initial Supply", function() {
  it("Debería devolver la cantidad inicial de tokens.", async function() {
    const Token = await ethers.getContractFactory("TokenFaucet");
    const token = await Token.deploy();
    await token.deployed();

    expect(await token.totalSupply()).to.equal(ethers.BigNumber.from('1000000000000000000000'));
  });

  it("El owner debería tener el rol de Manager.", async function() {
    const Token = await ethers.getContractFactory("TokenFaucet");
    const token = await Token.deploy();
    await token.deployed();

    rol = await token.comprobarSiManager();
    expect(rol).to.equal(true);
  })

  it("Otra address no debería tener el rol de Manager.", async function() {
    [owner, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("TokenFaucet");
    const token = await Token.deploy();
    await token.deployed();

    rol = await token.connect(user).comprobarSiManager();
    expect(rol).to.equal(false);
  })
});