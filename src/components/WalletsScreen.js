import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage } from "react-native";
import { Container, Content, Card, CardItem, Body, Text, Icon, Button } from "native-base";
import { NavigationEvents } from 'react-navigation';
import { ethers } from 'ethers';

import WalletComponent from './WalletComponent';

export default class WalletsScreen extends Component {
    static navigationOptions = {
        title: "Ethereum Wallet",
    }

    constructor(props) {
        super(props);
        this.state = {
            wallets: []
        }
    }

    // Called when the component is foreground again.
    _onWillFocus = payload => {
        // Storage brings up a list of wallets.
        AsyncStorage.getItem('WALLETS').then(wallets => {
            this.setState({
                wallets: JSON.parse(wallets) || [],
            })
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationEvents onWillFocus={this._onWillFocus} />
                <Container style={styles.container}>
                    <Content padder>
                        {
                            this.state.wallets.map((wallet) => {
                                return (
                                    <WalletComponent wallet={wallet} onPress={() => {
                                        this.props.navigation.navigate('WalletInfo', wallet)
                                    }} />
                                )
                            })
                        }
                        <Card>
                            <CardItem>
                                <Body>
                                    <Button transparent iconLeft large block onPress={() => { this.props.navigation.navigate('ImportWallet')}}>
								        <Icon name='import' type='MaterialCommunityIcons' ></Icon>
                                        <Text>Import Wallet</Text>
							        </Button>
                                </Body>
                            </CardItem>
                            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, }}/>
                            <CardItem>
                                <Body>
                                    <Button transparent iconLeft large block onPress={() => { this.props.navigation.navigate("CreateWallet")}}>
                                        <Icon name='ios-add-circle-outline' />
                                        <Text>Create Wallet</Text>
                                    </Button>
                                </Body>
                            </CardItem>
                        </Card>
                    </Content>
                </Container>
            </View>    
        );
    }

    componentWillMount() {

        // 1. Create the provider
        let provider = ethers.getDefaultProvider('ropsten');

        const pollingInterval = 20 * 1000; // 20 seconds
        this.poller = setInterval(() => {
            const wallets = [...this.state.wallets];

            // 2. Start viewing Wallet Balance
            wallets.forEach(wallet => {
                provider.getBalance(wallet.address).then((balance) => {
                    // Convert the ethereum balance wei to ether
                    const etherString = ethers.utils.formatEther(balance);
                    wallet.balance = etherString;
                });
            });

            // 3. Refresh Wallet list and update Storage
            this.setState({ wallets }, () => {
                AsyncStorage.setItem('WALLETS', JSON.stringify(wallets));
            });
        }, pollingInterval); // Perform every 20 seconds

    } // componentWillMount

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});