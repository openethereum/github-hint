pragma solidity ^0.4.21;

import "truffle/Assert.sol";
import "../contracts/GithubHint.sol";


contract TestGithubHint {
	function testHintUrl() public {
		GithubHint con = new GithubHint();

		con.hintURL(0x1, "https://paritytech.io");
		bytes20 commit;
	    (,commit,) = con.entries(0x1);
		Assert.equal(commit, 0, "Should hint URL");
	}
}
