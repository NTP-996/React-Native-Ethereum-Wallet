import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Container, Content, Header, Card, CardItem, Body, Text, Icon, Button, Left, Right, Thumbnail, Title } from 'native-base';

export default class WalletInfoScreen extends Component {
    static navigationOptions = {
        title: 'Detail'
    }

    render() {
        const wallet = this.props.navigation.state.params;
        return (
            <Container style={ styles.container }>
                <Content padder>
                    <Card transparent>
                        <CardItem>
                            <Body style={ styles.center }>
                                <Thumbnail source={{uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'}} />
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body style={ styles.center }>
                                <Text style={{fontSize: 26, fontWeight: '600', marginTop: 10}}>
                                    { wallet.balance || '0.00' } { wallet.symbol }
                                </Text>
                                <Text style={{fontSize: 18, marginTop: 10, color: 'gray'}}>
                                    ≈ $ {wallet.convertPrice || '0.00'}
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body style={ styles.center }>
                                <Text note ellipsizeMode="middle" numberOfLines={1}>
                                    {wallet.address}
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <Button bordered info style={{flex:1, justifyContent:'center', marginRight: 10}} onPress={() => {
                                        this.props.navigation.navigate('ReceiveScreen', wallet)
                                    }}><Text>Deposit</Text></Button>
                                <Button bordered warning style={{flex:1, justifyContent:'center', marginLeft: 10}} onPress={() => {
                                        this.props.navigation.navigate('SendScreen', wallet)
                                    }}><Text>Withdraw</Text></Button>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});