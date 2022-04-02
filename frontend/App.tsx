import { HARDHAT_PORT, HARDHAT_PRIVATE_KEY } from '@env';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import localhost from 'react-native-localhost';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import greeterInfo from './GreeterInfo';

import Hello from '../artifacts/contracts/Hello.sol/Hello.json';
import Greeter from '../artifacts/contracts/Greeter.sol/Greeter.json';

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  // eslint-disable-next-line react-native/no-color-literals
  white: { backgroundColor: 'white' },
});

const shouldDeployContract = async (web3, abi, data, from: string) => {
  const deployment = new web3.eth.Contract(abi).deploy({ data });
  const gas = await deployment.estimateGas();
  const {
    options: { address: contractAddress },
  } = await deployment.send({ from, gas });
  return new web3.eth.Contract(abi, contractAddress);
};

const greeterContract = async (web3, abi) => {
  const greeterContract = new web3.eth.Contract(abi);
  return greeterContract;
}

export default function App(): JSX.Element {
  const connector = useWalletConnect();
  const [message, setMessage] = React.useState<string>('Loading...');
  const web3 = React.useMemo(
    //() => new Web3(new Web3.providers.HttpProvider(`https://${localhost}:8545/`)),
    () => new Web3(new Web3.providers.HttpProvider(`https://alfajores-forno.celo-testnet.org/`)),
    []
  );

  /*
  async function readGreet(){
    const address = connector.accounts[0];
    console.log(address);

    const contract = new web3.eth.Contract(greeterInfo.abi as AbiItem[], greeterInfo.address);
    const greeting = await contract.methods.greet.call( function(err, res){
      console.log(res)
    });

    console.log(greeting);
    setMessage(greeting);
  }*/

  async function setGreet(){
    const address = connector.accounts[0];
    console.log(address);
    const data = web3.eth.abi.encodeFunctionCall({
      name: 'setGreeting',
      type: 'function',
      inputs: [{
          type: 'string',
          name: '_greeting'
      }]
    }, ["Hello Testing!!!"]);

    const estimatedGas = await web3.eth.estimateGas({
      from: address,
      to: greeterInfo.address,
      data: data
    })

    console.log("Estimated Gas: "+estimatedGas);
    
    const txHash = await connector.sendTransaction({
      from: address,
      to: greeterInfo.address,
      gas: estimatedGas,
      gasPrice: estimatedGas+estimatedGas*.10,
      value: "0x00",
      data: data,
      nonce: await web3.eth.getTransactionCount(greeterInfo.address)
    })

    console.log("TX: ")
    console.log(txHash);
  }

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);
  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);
  return (
    <View style={[StyleSheet.absoluteFill, styles.center, styles.white]}>
      <Text testID="tid-message">{message}</Text>
      {!connector.connected && (
        <TouchableOpacity onPress={connectWallet}>
          <Text>Connect a Wallet</Text>
        </TouchableOpacity>
      )}
      {!!connector.connected && (
        <>
          <TouchableOpacity onPress={killSession}>
            <Text>Kill Session</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={setGreet}>
            <Text>Contract Call</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={readGreet}>
            <Text>Read Greeting</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}