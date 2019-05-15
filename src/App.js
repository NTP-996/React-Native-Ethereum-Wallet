import { createStackNavigator, createAppContainer } from 'react-navigation';
import WalletsScreen from "./components/WalletsScreen";
import CreateWalletScreen from "./components/CreateWalletScreen";

const AppStackNavigator = createStackNavigator({
    Wallets: { screen: WalletsScreen },
    CreateWallet: { screen: CreateWalletScreen },
},
{
    defaultNavigationOptions: {
        headerBackTitle: null, // Back button Remove title.
    }
});

export default createAppContainer(AppStackNavigator);
