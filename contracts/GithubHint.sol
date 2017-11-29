//! Github Hinting contract.
//!
//! Copyright 2016 Gavin Wood, Parity Technologies Ltd.
//!
//! Licensed under the Apache License, Version 2.0 (the "License");
//! you may not use this file except in compliance with the License.
//! You may obtain a copy of the License at
//!
//!     http://www.apache.org/licenses/LICENSE-2.0
//!
//! Unless required by applicable law or agreed to in writing, software
//! distributed under the License is distributed on an "AS IS" BASIS,
//! WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//! See the License for the specific language governing permissions and
//! limitations under the License.

pragma solidity ^0.4.6;

contract GithubHint {
	struct Entry {
		string accountSlashRepo;
		bytes20 commit;
		address owner;
	}

	modifier when_edit_allowed(bytes32 _content) { if (entries[_content].owner != 0 && entries[_content].owner != msg.sender) return; _; }

	function hint(bytes32 _content, string _accountSlashRepo, bytes20 _commit) when_edit_allowed(_content) {
		entries[_content] = Entry(_accountSlashRepo, _commit, msg.sender);
	}

	function hintURL(bytes32 _content, string _url) when_edit_allowed(_content) {
		entries[_content] = Entry(_url, 0, msg.sender);
	}

	function unhint(bytes32 _content) when_edit_allowed(_content) {
		delete entries[_content];
	}

	mapping (bytes32 => Entry) public entries;
}
