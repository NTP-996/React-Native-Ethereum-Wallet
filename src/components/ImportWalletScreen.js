import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content, Segment, Text, Icon, Button, Header, Left, Body, Title, Right, Form, Textarea, Input, Item } from 'native-base'; 

export default class ImportWalletScreen extends Component {
  static navigationOptions = {
		header: null
	}
	
	constructor(props) {
		super(props);

		this.state = {
			activeIndex: 0
		}
	}

	segmentClicked = (activeIndex) => {
		this.setState({ activeIndex });
	}

	renderSection = () => {
		switch(this.state.activeIndex) {
			case 0:
				return (
					<View>
						<Text note>Type wallet mnemonics (12 words in English) with spaces.</Text>
						<Form>
							<Textarea rowSpan={5} bordered />
						</Form>
					</View>
				)
			default:
				return (
					<View>
						<Text note>Enter the private key address of your wallet.</Text>
						<Item regular>
							<Input />
						</Item>
					</View>
				)
		}
	}

  render() {
    return (
			<Container>
				<Header hasSegment androidStatusBarColor='black'>
					<Left>
						<Button transparent
							onPress={() => this.props.navigation.goBack()}>
							<Icon name="arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Import Wallet</Title>
					</Body>
					<Right />
				</Header>
				<Segment style={{ paddingHorizontal: 10 }}>
					<Button first 
						style={{ flex:1, justifyContent:'center' }}
						active={this.state.activeIndex === 0}
						onPress={() => this.segmentClicked(0)}>
						<Text>Mnemonic</Text>
					</Button>
					<Button last
						style={{ flex:1, justifyContent:'center' }}
					 	active={this.state.activeIndex === 1}
					 	onPress={() => this.segmentClicked(1)}>
						<Text>Private key</Text>
					</Button>
				</Segment>
				<Content padder>
					{
						this.renderSection()
					}
					<View>
						<Button block primary>
							<Text>Import</Text>
						</Button>
					</View>
				</Content>
            </Container>
		);
  }
}

const styles = StyleSheet.create({
  container: {
		// flex: 1,
  },
});