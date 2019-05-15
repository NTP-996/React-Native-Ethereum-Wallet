import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Container, Content, Card, CardItem, Body, Text, Icon, Button } from "native-base";

export default class WalletsScreen extends Component {
    static navigationOptions = {
        title: "Ethereum Wallet",
    }

    render() {
        return (
            <Container style={styles.container}>
                <Content padder>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});