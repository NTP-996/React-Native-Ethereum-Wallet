import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Container, Content, Segment, Text, Icon, Button, Header, Left, Body, Title, Right, Form, Textarea, Input, Item } from 'native-base';
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";

import bip39 from 'react-native-bip39';
import hdkey from 'hdkey';
import * as ethUtil from 'ethereumjs-util';


export default class CreateWalletScreen extends Component {
    static navigationOptions = {
        title: 'Create Wallet'
    }

    constructor(props) {
        super(props);
        
        this.state = {
            mnemonic: null
        }
    }

    componentWillMount = () => {
        // Mnemonic generation
        bip39.generateMnemonic().then(mnemonic => {
            this.setState({ mnemonic })
        });
    }

    _storeData = async (wallet, privateKey) => {
        try {
            // Get your old Wallet listing information
            const wallets = JSON.parse(await AsyncStorage.getItem('WALLETS')) || [];
            // Add to existing Wallet list
            wallets.push(wallet);
            // Saving wallet listing information
            await AsyncStorage.setItem('WALLETS', JSON.stringify(wallets));
            // Storing private keys in a secure zone
            await RNSecureKeyStore.set(wallet.address, privateKey, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY});
        } catch (error) {
            // Error saving data
            console.log(error);
        }
    };

    _createWallet = async () => {

        // 1. Seed calculation in mnemonic
        const seed = bip39.mnemonicToSeed(this.state.mnemonic);

        // 2. Master key generation in seed (HDPrivateKey)
        const root = hdkey.fromMasterSeed(seed);

        // 3. Derived child private key generation (derived)
        const xPrivKey = root.derive("m/44'/60'/0'/0/0");
        const privKey = root.privateKey.toString('hex');

        // 4. Calculate Ethernet address from public key
        const pubKey = ethUtil.privateToPublic(xPrivKey._privateKey);
        let address = ethUtil.publicToAddress(pubKey).toString('hex');
        address = ethUtil.toChecksumAddress(address);
       
        // Generate wallet information to save
        const wallet = {
            name: 'Ethereum',
            coinType: 'ETH',
            symbol: 'ETH',
            address
        }

        // Save
        await this._storeData(wallet, privKey);

        // Back to wallet list screen
        this.props.navigation.goBack();
    }

    render() {
        return (
            <Container style={styles.container}>
                <View style={{ flex: 1, padding: 10 }}> 
                    <View style={{ flex: 1 }}>
                        <Text note>Please copy and backup the 12 mnemonics below. This is very important data to recover your wallet.</Text>
                        <Form>
                            <Textarea rowSpan={5} bordered disabled value={this.state.mnemonic}/>
                        </Form>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button block primary onPress={() => {
                            this._createWallet()
                        }}>
                            <Text>Create</Text>
                        </Button>
                    </View>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});