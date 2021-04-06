const UserGroupMeetings = artifacts.require("UserGroupMeetings");

contract("UserGroupMeetings", async accounts => {
    let instance;

    before(async () => {
        instance = await UserGroupMeetings.deployed();
    })

    it("initially has no meetings", async () => {
        let meetings = await instance.getMeetings();

        assert.isEmpty(meetings);
    });

});

contract("UserGroupMeetings with meeting", async accounts => {
    let instance;

    before(async () => {
        instance = await UserGroupMeetings.deployed();
        await instance.addMeeting("Fun with Ethereum");
    })

    it("has a meeting", async () => {
        let meetings = await instance.getMeetings();

        assert.includeMembers(meetings, ["Fun with Ethereum"]);
    });

    it("allows address to book reservation", async () => {
        await instance.bookReservation(0, {from: accounts[1]});
        let reservations = await instance.getReservations(0);

        assert.includeMembers(reservations, [accounts[1]])
    });

    it("attendance increases balance", async () => {
        await instance.bookReservation(0, {from: accounts[4]});
        await instance.confirmAttendance(0, accounts[4], {from: accounts[0]})

        let balance = await instance.balances(accounts[4]);

        assert.equal(balance.toNumber(), 10);
    });

    it("can't confirm attendance without reservation", async () => {
        try {
            await instance.confirmAttendance(0, accounts[7], {from: accounts[0]});
            assert.fail("Transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "revert", "Error message should contain 'revert'");
        }
    });

    it("only owner can confirm", async () => {
        try {
            await instance.bookReservation(0, {from: accounts[8]});
            await instance.confirmAttendance(0, accounts[8], {from: accounts[2]});
            assert.fail("Transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "revert", "Error message should contain 'revert'");
        }
    });

});

contract("UserGroupMeetings can't have duplicate reservations", async accounts => {
    let instance;

    before(async () => {
        instance = await UserGroupMeetings.deployed();
        await instance.addMeeting("Fun with Ethereum");
    })

    it("address only occurs once in the reservations", async () => {
        await instance.bookReservation(0, {from: accounts[1]});
        await instance.bookReservation(0, {from: accounts[1]});
        let reservations = await instance.getReservations(0);

        assert.deepEqual(reservations, [accounts[1]])
    });

});