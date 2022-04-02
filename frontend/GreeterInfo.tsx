const greeterInfo = {
    address: "0x5af1B89630128844CF34fC13D703F2960DceEe97",
    abi: [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_greeting",
                    "type": "string"
                }
            ],
            "name": "setGreeting",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_greeting",
                    "type": "string"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "greet",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
}

export default greeterInfo;