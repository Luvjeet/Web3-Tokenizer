// SPDX-License-Identifier:MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KycContract is Ownable {
    mapping(address => bool) allowed;

    function setKycCompleted(address _add) public onlyOwner {
        allowed[_add] = true;
    }

    function setKycRevoke(address _add) public onlyOwner {
        allowed[_add] = false;
    }

    function kycCompleted(address _add) public view returns (bool) {
        return allowed[_add];
    }
}
