import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage } from "react-native";
import { Container, Content, Card, CardItem, Body, Text, Icon, Button } from "native-base";
import { NavigationEvents } from 'react-navigation';

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
                                    <Button transparent iconLeft large block onPress={() => this.props.navigation.navigate("CreateWallet")}>
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});