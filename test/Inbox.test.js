const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const {interface, bytecode} = require('../compile');

let accounts;
let inbox;
const INITIAL_STRING = 'Hi there!';

beforeEach(async () =>{
  // get a list of all acounts
  //web3.eth.getAccounts().then(fetchedAccounts => {
  //  console.log(fetchedAccounts);
  //});
  accounts = await web3.eth.getAccounts();
  // use one of those accounts to deploy the contract
  //once when contract is ocmpiled it spits out an interface and bytecode
  //using await, as the call is asynhronous
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments: [INITIAL_STRING]})
    .send({from: accounts[0], gas: '1000000'});

    //inbox.setPtovider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });
  it('has a default message', async () => {
    const message = await inbox.methods.message().call(); // use call when just viewing
    assert.equal(message, INITIAL_STRING);
  });
  it('can change the message', async () => {
    await inbox.methods.setMessage('Hello World!').send({from: accounts[0]}); // use send to modify add who is paying the gas
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Hello World!');
  });
});
