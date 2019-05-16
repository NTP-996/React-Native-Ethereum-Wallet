import React, { Component } from 'react';
import { StyleSheet, View, Clipboard, Share } from 'react-native';
import { Container, Content, Header, Card, CardItem, Body, Text, Icon, Button, Left, Right, Thumbnail, Title, Toast } from 'native-base'; 
import QRCode from 'react-native-qrcode';

export default class ReceiveScreen extends Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const wallet = this.props.navigation.state.params;
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button 
              transparent
              onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{ wallet.symbol } Deposit</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Card transparent>
            <CardItem>
              <Body style={ styles.center }>
                <Thumbnail 
                  circle
                  source={{uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'}} />  
              </Body>
            </CardItem>
            <CardItem>
              <Body style={[styles.center, {marginVertical: 20}]}>
                <QRCode
                  value={wallet.address}
                  bgColor='black'
                  fgColor='white'
                  size={200}
                />
              </Body>
            </CardItem>
            <CardItem>
              <Body style={[styles.center, {padding:10, backgroundColor:'#EFEFEF'}]}>
                <Text 
                  note
                  onPress={() => {
                    Clipboard.setString(wallet.address);
                    Toast.show({
                      text: "Address copying is complete.",
                      position: "bottom",
                      duration: 1000
                    });
                  }}>
                  {wallet.address} &nbsp;
                  <Icon name='content-copy' type="MaterialCommunityIcons" style={{fontSize:15, color:'#777'}}/>
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Button bordered info block
                  style={{marginHorizontal:100}}
                  onPress={() => {
                    Share.share({
                      message: wallet.address
                    });
                  }
                }><Text>Share address</Text></Button>
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
    justifyContent: 'center',
  }
});