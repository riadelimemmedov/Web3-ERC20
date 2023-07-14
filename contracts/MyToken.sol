// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//ERC20
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


//!MyToken
contract MyToken is ERC20{
    constructor(string memory name,string memory symbol) ERC20(name,symbol){
        _mint(msg.sender,100 * 10 ** uint(decimals()));
    }

    function mint(uint amount) external{
        _mint(msg.sender, amount);
    }

    function burn(uint amount) external{
        _burn(msg.sender, amount);
    }
}