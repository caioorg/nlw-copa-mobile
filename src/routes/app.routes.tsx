import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { PlusCircle, SoccerBall } from 'phosphor-react-native'
import { useTheme } from 'native-base'
import New from '../screens/New'
import Pools from '../screens/Pools'
import Find from '../screens/Find'
import Details from '../screens/Details'
import { Platform } from 'react-native'

const { Navigator, Screen } = createBottomTabNavigator()


export const AppRoutes = () => {
  const { colors, sizes } = useTheme()


  const screenOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarActiveTintColor: colors.yellow[500],
    tabBarInactiveTintColor: colors.gray[300],
    tabBarLabelPosition: 'beside-icon',
    tabBarStyle: {
      position: 'absolute',
      height: sizes[22],
      borderTopWidth: 0,
      backgroundColor: colors.gray[800],
    },
    tabBarItemStyle: {
      position: 'relative',
      top: Platform.OS === 'android' ? -10 : 0
    }
  }

  const sizesIcon = sizes[6]

  return (
    <Navigator screenOptions={screenOptions}>
      <Screen  name='new' component={New} options={{ tabBarLabel: 'Novo bolão', tabBarIcon: ({ color }) => <PlusCircle color={color} size={sizesIcon} />}} />
      <Screen name='pools' component={Pools} options={{ tabBarLabel: 'Meus bolões', tabBarIcon: ({ color }) => <SoccerBall color={color} size={sizesIcon} />}} />
      <Screen name='find' component={Find} options={{ tabBarButton: () => null }} />
      <Screen name='details' component={Details} options={{ tabBarButton: () => null }} />
    </Navigator>
  )
}
