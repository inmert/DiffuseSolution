//Web3 initialization
//Connecting to Polygon Mainnet
var Web3 = require('web3');
var axios = require('axios')
var nodeUrl = 'https://polygon-rpc.com';
var web3 = new Web3(nodeUrl);



//Addresses
const Wallet_Address = '0x008062acA356B5F93F2F14b71Fd73db91A606d0C';
const DAI_Address = '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063';
const ApeSwap_Contract = '0xC0788A3aD43d79aa53B09c2EaCc313A787d1d607';
const CafeSwap_Contract = '0x5eDe3f4e7203Bf1F12d57aF1810448E5dB20f46C';

let Token_Addresses = {
    SHI3LD: '0xf239e69ce434c7fb408b05a0da416b14917d934e',
    KOGE: '0x13748d548D95D78a3c83fe3F32604B4796CFfa23',
    PEAR: '0xc8bcb58caEf1bE972C0B638B1dD8B0748Fdc8A44',
    SING: '0xCB898b0eFb084Df14dd8E018dA37B4d0f06aB26D'
}


//ABI to getBalance of Tokens
const ABI = [  
    {    
      constant: true, 
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",  
      outputs: [{ name: "balance", type: "uint256" }],
      type: "function",
    }
]

async function getBalance(key, contract) {
    let balance = await contract.methods.balanceOf(Wallet_Address).call();
    let result = web3.utils.fromWei(balance);
    console.log(`${key} Balance: ${result}`);
}

//Loop to getBalance and print result
for (const [key, value] of Object.entries(Token_Addresses)) {

    let contract = new web3.eth.Contract(ABI, value);
    getBalance(key,contract);    
}


// __________________________________________ 1Inch Exchange Rates ______________________________________________

const apiBaseUrl = 'https://api.1inch.io/v4.0/137/';

//Creates fetch URL
function apiRequestUrl(methodName, queryParams) {
    return apiBaseUrl + methodName + '?' + (new URLSearchParams(queryParams)).toString();
}

//Grabs result from API
async function getQuote(url, key){

    let result = await axios.get(url)
    let data = result.data.toTokenAmount;
    let convertedData = web3.utils.fromWei(data);
    console.log(`${key} 1Inch: ${convertedData}`);
}

//Gets Exchange Rate in DAI
async function getExchange(key, value, contract) {
    let balance = await contract.methods.balanceOf(Wallet_Address).call();
    
    let params = {
        fromTokenAddress: value,
        toTokenAddress: DAI_Address,
        amount: balance
    };

    let url = apiRequestUrl('quote', params);
    await getQuote(url,key);
}

//Prints results for Exchange Rates
for (const [key, value] of Object.entries(Token_Addresses)) {

    let contract = new web3.eth.Contract(ABI, value);
    getExchange(key, value,contract);

    
}



