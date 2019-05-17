import React, { Component } from 'react';
import { StyleSheet, View, Slider, TouchableOpacity, Alert, AsyncStorage, BackHandler } from 'react-native';
import { Container, Spinner, Content, Header, Card, CardItem, Body, Text, Icon, Button, Left, Right, Thumbnail, Title, Toast, Form, Item, Input, Label } from 'native-base'; 
import { ethers } from 'ethers';
import Loader from './Loader';

import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";

export default class ConfimTxScreen extends Component {
  static navigationOptions = {
    title: "withdraw",
	}

	constructor(props) {
		super(props);

		const {
			fromAddress,
			toAddress,
			gasPrice,
			gasLimit,
			value
		} = props.navigation.state.params;
		console.log('params', props.navigation.state.params);

		// Fee (gas price) calculation (gas price * gas consumption)
		let estimateFee = ethers.utils.bigNumberify(gasPrice).mul(gasLimit);

        // Convert gas price (gwei) to ether unit
		let fee = ethers.utils.formatUnits(estimateFee, 'gwei').toString();
		// console.log(estimateFee);
		
		// Calculate the total amount required (withdrawal fee + commission)
		let totalAmount = ethers.utils.parseEther(value).add(ethers.utils.parseEther(fee));
		totalAmount = ethers.utils.formatEther(totalAmount).toString();

		this.state = {
			loading: false, // Whether the loading screen is displayed
			fromAddress, // Send address
			toAddress, // Incoming address
			gasPrice, // Gas price
			gasLimit, // Maximum gas usage
			value, // Withdrawal amount
			fee, // fees
			totalAmount, // The total amount
		}
	}

	sign = async () => {

        // Loading image output
		this.setState({
            loading: true
		});

		let { 
			fromAddress, 
			toAddress,
			gasPrice,
			gasLimit,
			value
		} = this.state;

		// #1. ropsten test net provider creation
		let provider = ethers.getDefaultProvider('ropsten');

		// #2. nonce value lookup (transaction sequence number, increment every time you trade from 0)
		let nonce = await provider.getTransactionCount(fromAddress);
		console.log({ nonce });

		// #3 . Transaction Data Generation
		let transaction = {
			to: toAddress,
			value: ethers.utils.parseEther(value), //ethers => gwei
			gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'), // gwei => wei
			gasLimit: ethers.utils.bigNumberify(gasLimit), 
			nonce: nonce,
			data: '0x',
			// This ensures the transaction cannot be replayed on different networks
			chainId: ethers.utils.getNetwork('homestead').chainId
		};
		console.log({ transaction });

		// #4. View your private key (signing key)
		let privKey = await RNSecureKeyStore.get(fromAddress);
		let privateKey = '0x'+ privKey;
		console.log(privateKey);

		// #5. Create wallet to sign
		let wallet = new ethers.Wallet(privateKey);
		console.log(wallet.address)
		
		// #6. Signing Ethernet Transaction
		let sign = await wallet.sign(transaction);
		console.log('sign: ' + sign);
		// #7. Deploying a signed Ethernet transaction
		try {
			// getTransactionCount
			const tx = await provider.sendTransaction(sign);
			console.log('sendTransaction', tx.hash);

			// #8. Go to the completion screen
			// this.props.navigation.navigate('CompleteScreen', tx.hash);
			this.props.navigation.replace('CompleteScreen', tx.hash);

		} catch(error) {
			console.log(error);
			Alert.alert('ERROR', `${error.code}\n${error.message}`);
		}

		this.setState({
      		loading: false
		});
	}

  render() {
		let state = this.state;

        return (
            <Container style={styles.container}>
                <View>
                    <View style={{ padding: 20, backgroundColor: '#F9FAFA', alignItems:'center', borderBottomColor: '#D2D8DD', borderBottomWidth: 1 }}>
                        <Text note>Withdrawal amount</Text>
                        <Text style={{ fontSize: 30, fontWeight: '600', marginBottom: 20}}>{state.value} ETH</Text>
                        <Text note>Incoming address</Text>
                        <Text ellipsizeMode="middle" numberOfLines={1}>{state.toAddress}</Text>
                    </View>
                    <View style={{ marginHorizontal: 25, marginVertical: 20 }}>
                        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical: 20, borderBottomColor: '#D2D8DD', borderBottomWidth: 1 }}>
                            <Text note>Fee (gas cost)</Text>
                            <View style={{ alignItems:'flex-end'}}>
                                <Text style={{ color: '#4d4d4d', fontSize: 17.5 }}>{state.fee} ETH</Text>
                                <Text note>Gas price { state.gasPrice } Gwei</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical: 20 }}>
                            <Text note>Total</Text>
                            <Text style={{ color: '#4d4d4d', fontSize: 17.5 }}>{ state.totalAmount } ETH</Text>
                        </View>
                    </View>
                    <View style={styles.hintBox}>
                        <Text style={styles.hintText}>‧ Please check the above transaction.</Text>
                        <Text style={styles.hintText}>‧ Select the approve button below to continue the transaction.</Text>
                    </View>
                </View>
                <View style={{ marginHorizontal: 10, marginBottom: 30 }}>
                    <Button block
                            disabled={false}
                            onPress={ this.sign }>
                            <Text>approved</Text>
                            {/* <Spinner size='small'/> */}
                    </Button>
                </View>
                <Loader loading={this.state.loading} />
            </Container>
	    );
  }
}

const styles = StyleSheet.create({
  container: {
		flex: 1,
		backgroundColor: 'white',
		justifyContent: 'space-between'
	},
	hintBox: {
		borderWidth:1, 
		borderColor: 'rgb(220,220,220)', 
		padding: 10, 
		marginHorizontal: 20
	},
	hintText: {
		fontSize: 13,
		color: '#4d4d4d'
	}
});