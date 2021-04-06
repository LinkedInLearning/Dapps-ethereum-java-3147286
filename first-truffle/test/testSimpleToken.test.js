const SimpleToken = artifacts.require("SimpleToken")

contract("SimpleToken", async accounts => {
    let instance;

    before(async () => {
        instance = await SimpleToken.deployed();
    });

    it("deployer address has initial tokens", async () => {
        let balance = await instance.balances(accounts[0]);
        assert.equal(balance.toNumber(), 10000);
    })

    it("other address has no initial tokens", async () => {
        let balance = await instance.balances(accounts[4]);
        assert.equal(balance.toNumber(), 0);
    })

    it("tokens can be transferred", async () => {
        await instance.transfer(accounts[1], 10, {from: accounts[0]});

        let balance0 = await instance.balances(accounts[0]);
        let balance1 = await instance.balances(accounts[1]);

        assert.equal(balance0.toNumber(), 9990);
        assert.equal(balance1.toNumber(), 10);
    })




})