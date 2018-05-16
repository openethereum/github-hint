"use strict";

const GithubHint = artifacts.require("./GithubHint.sol");

contract("GithubHint", accounts => {
  const assertThrowsAsync = async (fn, msg) => {
    try {
      await fn();
    } catch (err) {
      assert(err.message.includes(msg), "Expected error to include: " + msg);
      return;
    }
    assert.fail("Expected fn to throw");
  };

  const content = 1;
  const accountSlashRepo = "parity-contracts/github-hint";
  const url = "https://paritytech.io";
  const commit = "0x4200000000000000000000000000000000000000";

  it("should map an hash to a github account/repo and commit hash", async () => {
    const githubHint = await GithubHint.deployed();

    await githubHint.hint(content, accountSlashRepo, commit);
    const entry = await githubHint.entries(content);

    assert.equal(entry[0], accountSlashRepo);
    assert.equal(entry[1], commit);
    assert.equal(entry[2], accounts[0]);
  });

  it("should map an hash to an URL", async () => {
    const githubHint = await GithubHint.deployed();

    await githubHint.hintURL(content, url);
    const entry = await githubHint.entries(content);

    assert.equal(entry[0], url);
    assert.equal(entry[1], 0); // commit is set to 0 when hinting url
    assert.equal(entry[2], accounts[0]);
  });

  it("should allow the owner of an entry to edit it", async () => {
    const githubHint = await GithubHint.deployed();

    // accounts[1] is not the owner of the entry so the edit should not be allowed
    await assertThrowsAsync(
      () => githubHint.hint(content, accountSlashRepo, commit, { from: accounts[1] }),
      "revert",
    );

    const newCommit = "0x4300000000000000000000000000000000000000";

    // this goes from owner account (accounts[0]) so should be allowed
    await githubHint.hint(content, accountSlashRepo, newCommit);
    const entry = await githubHint.entries(content);

    assert.equal(entry[0], accountSlashRepo);
    assert.equal(entry[1], newCommit);
    assert.equal(entry[2], accounts[0]);
  });

  it("should allow the owner of an entry to unhint it", async () => {
    const githubHint = await GithubHint.deployed();

    // accounts[1] is not the owner of the entry so the unhint should not be allowed
    await assertThrowsAsync(
      () => githubHint.unhint(content, { from: accounts[1] }),
      "revert",
    );

    // this goes from owner account (accounts[0]) so should be allowed
    await githubHint.unhint(content);
    const entry = await githubHint.entries(content);

    assert.equal(entry[0], 0);
    assert.equal(entry[1], 0);
    assert.equal(entry[2], 0);
  });
});
