pragma solidity ^0.8.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleToken.sol";

contract TestSimpleToken {

    function testInitialBalanceOfDeployer() public {
        SimpleToken tokenContract = SimpleToken(DeployedAddresses.SimpleToken());

        uint expected = 10000;
        uint balance = tokenContract.balances(tx.origin);

        Assert.equal(balance, expected, "Initial tokens");

    }

}