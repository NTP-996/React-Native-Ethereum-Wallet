import React, { Component } from 'react';
import { StyleSheet, View, Slider, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Header, Card, CardItem, Body, Text, Icon, Button, Left, Right, Thumbnail, Title, Toast, Form, Item, Input, Label } from 'native-base'; 
import { ethers } from 'ethers';

export default class SendScreen extends Component {
    static navigationOptions = {
        header: null
	}

    constructor(props) {
		super(props);

		const wallet = props.navigation.state.params;

		this.state = {
			fromAddress: wallet.address,
			toAddress:'',
			gasPrice: '2',
			gasLimit: '21000',
			value: '',
			isReady: false,
			wallet,
		};
	}

    // Ethereum address check function
    checkAddress = (address) => {
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            return false;
        }
            return true;
    };

    // When the next button is pressed
    next = () => {
        let ehter = 0;

        try {
            // Convert Ehter unit amount to Wei
            ehter = ethers.utils.parseEther(String(this.state.value || 0));
            if(ehter.lte(0)) { // If less than 0
                return Alert.alert('Please check the transfer amount.');
            }

            // Calculation of gas fee (commission)
            let estimateFee = ethers.utils.parseUnits(this.state.gasPrice, 'gwei').mul(String(this.state.gasLimit));

            // Calculate the total amount required to transfer (amount transferred + gas cost)
            let totalRequiredAmount = ehter.add(estimateFee);

            // If the balance is less than the amount required for the transfer ...
            let balance = ethers.utils.parseEther(this.state.wallet.balance);
            if(balance.lt(totalRequiredAmount)) {
                let totalRequiredEther = ethers.utils.formatEther   (totalRequiredAmount);
                return Alert.alert('There is not enough balance.', `Amount required including fees\n${totalRequiredEther} ETH`);
            }
        } catch(e) {
            return Alert.alert('', 'Please check the transfer amount.');
        }

        // Verify incoming address
        try {
            if(!this.checkAddress(this.state.toAddress)) {
                return Alert.alert('', 'Please check your address.');
            }
        } catch(e) {
            return Alert.alert('Please check your address.');
        }
        // Alert.alert('ok');

		let {
			fromAddress,
			toAddress,
			gasPrice,
			gasLimit,
			value,
		} = this.state;
		let transcation = {
			fromAddress,
			toAddress,
			gasPrice,
			gasLimit,
			value
		};
		this.props.navigation.navigate('ConfimTx', transcation);
    }


    render() {
	    const wallet = this.state.wallet;

        return (
            <Container style={styles.container}>
                <Header>
                    <Left>
						<Button transparent
							onPress={() => this.props.navigation.goBack()}>
							<Icon name="arrow-back" />
						</Button>
					</Left>
                    <Body>
						<Title>Withdrawal { wallet.symbol }</Title>
					</Body>
                </Header>
                <Content padder>
					<View style={styles.item}>
						<Text style={styles.label}>Transfer amount</Text>
						<Item last regular style={styles.input}>
							<Input 
								keyboardType='numeric'
								value={this.state.value}
								onChangeText={value => this.setState({ value: value.replace(/[^0-9|\.]/g, '') })}
								placeholder="Please enter the amount you send." placeholderTextColor="#BBB" />
						</Item>
					</View>
					<View style={styles.item}>
						<Text style={styles.label}>Incoming address</Text>
						<Item regular style={styles.input}>
							<Input 
								value={this.state.toAddress}
								onChangeText={toAddress => this.setState({ toAddress })}
								placeholder="Please input ethereum address." placeholderTextColor="#BBB" />
							<TouchableOpacity>
								<Icon name='qrcode-scan' type='MaterialCommunityIcons'/>
							</TouchableOpacity>
						</Item>
					</View>
					<View style={styles.item}>
						<Text style={styles.label}>Gas fee</Text>
						<Slider 
							value={parseFloat(this.state.gasPrice) || 0} 
							onValueChange={gasPrice => this.setState({ gasPrice: gasPrice.toFixed(1) })}
							maximumValue={7} 
							minimumValue={1.1} 
							step={0.1} 
							minimumTrackTintColor="orangered"
							maximumTrackTintColor="royalblue"/>
						<View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>
							<Text note>Slow</Text>
							<Text note>Fastest</Text>
						</View>
					</View>
					<Card style={styles.item}>
						<CardItem header><Text note>Advanced Options</Text></CardItem>
						<CardItem>
							<Body>
								<View style={{width:'100%'}}>
									<Item inlineLabel stackedLabel>
										<Label>Gas price(GWei)</Label>
										<Input 
											value={this.state.gasPrice} 
											onChangeText={gasPrice => this.setState({ gasPrice: gasPrice || '0' })} />
									</Item>
									<Item inlineLabel stackedLabel>
										<Label>Gas limit</Label>
										<Input 
											value={this.state.gasLimit} 
											onChangeText={gasLimit => this.setState({ gasLimit: gasLimit || '0' })} />
									</Item>
								</View>
							</Body>
						</CardItem>
					</Card>
					<View style={styles.item}>
						<Button block 
							// disabled={!this.state.isReady}
							onPress={this.next}>
							<Text>Confirm</Text>
						</Button>
					</View>
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
        justifyContent: 'center',
    },
    item: {
        marginVertical: 10
    },
    input: {
        backgroundColor:'rgba(245, 245, 245, 1.0)', 
        paddingLeft: 10, 
        borderBottomEndRadius: 5,
        borderBottomStartRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    label: {
        marginLeft: 5,
        marginBottom: 10,
        color: '#555'
    }
});