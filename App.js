import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadAsync, useFonts } from 'expo-font';
import { ActivityIndicator } from 'react-native';
import Landing from './screens/Landing';
import OnBoarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import Services from './screens/Services';
import Wallet from './screens/Wallet';
import { AntDesign, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import Notifications from './screens/Notifications';
import PRofile from './screens/Profile';
import Airtime from './screens/Airtime';
import Data from './screens/Data';
import Cable from './screens/Cable';
import Education from './screens/Education';
import Internet from './screens/Internet';
import Electricity from './screens/Electricity';
import { Image } from 'expo-image'
import axios from 'axios';
import query from './constants/query';
import FundWallet from './screens/FundWallet';
import SignIn from './screens/SignIn';
import AirtimeReciept from './components/services/AirtimeReciept';
import CableReciept from './components/services/CableReceipt';
import DataReciept from './components/services/DataReceipt';
import EduReciept from './components/services/EduReceipt';
import SignUp from './screens/SignUp';
import Verify from './screens/Verify';
import Forget from './screens/Forget';
import ElectricityReciept from './components/services/ElectricityReceipt';
import Welcome from './screens/Welcome';
import CreatePin from './screens/CreatePin';
import Settings from './screens/Settings';
import EditInfo from './screens/EditInfo';
import ChangePassword from './screens/ChangePassword';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const UserInNav = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [dp, setDp] = useState('');
    const [loading, setLoading] = useState(true)
    const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
    const fetchNow = async (user) => {
        try {
            const response = await axios.get(`${query.baseUrl}user/${user}`);
            if (response.data) {
                setUsername(response.data[0].username);
                setDp(response.data[0].display_picture);
                if (response.data[0].tpin === null) {
                    navigation.replace('CreatePin')
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const isOnline = async () => {
        setLoading(true)
        try {
            await AsyncStorage.getItem('UserName')
                .then(value => {
                    if (value != null) {
                        fetchNow(value);
                    } else {
                        navigation.replace('SignIn')
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        isOnline();
    }, []);

    if (loading) {
        return <SplashScreen />
    }

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: '#040F16',
                tabBarShowLabel: true,
                tabBarInactiveTintColor: '#fff',
                tabBarStyle: {
                    height: 75,
                    backgroundColor: "#004aad",
                    paddingTop: 10
                },
                tabBarLabelStyle: {
                    fontSize: 13,
                    marginBottom: 10,
                    marginTop: 5,
                    fontFamily: 'Rubik-Medium',
                    textTransform: 'uppercase',
                    color: 'white'
                }
            }}
        >
            <Tab.Screen
                name='dashboard'
                component={Dashboard}
                options={{
                    headerShown: true,
                    title: "Dashboard",
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={focused ? 35 : 30} />
                    ),
                    tabBarLabel: 'Dashboard',
                    headerTitle: () => {
                        return (
                            <>
                                <Text style={styles.username}>
                                    {username.toUpperCase()}
                                </Text>
                            </>
                        )
                    },
                    headerLeft: () => {
                        return (
                            <>
                                <Pressable
                                    onPress={() => {
                                        navigation.navigate('Profile')
                                    }}
                                >
                                    <Image
                                        style={styles.image}
                                        source={dp}
                                        placeholder={blurhash}
                                        contentFit="cover"
                                        transition={1000}
                                    />
                                </Pressable>
                            </>
                        )
                    },
                    headerRight: () => {
                        return (
                            <>
                                <Pressable
                                    onPress={() => {
                                        navigation.navigate('Notifications')
                                    }}
                                >
                                    <Ionicons name="notifications-outline" size={28} color="white" style={{ marginRight: 20 }} />
                                </Pressable>
                            </>
                        )
                    },
                    headerStyle: {
                        backgroundColor: '#004aad',

                    },
                    headerTitleStyle: {
                        color: 'white',
                        fontFamily: 'Rubik-Bold'
                    },
                    headerTintColor: '#004aad',
                    headerShadowVisible: false
                }}
            />
            <Tab.Screen
                name='Services'
                component={Services}
                options={{
                    title: 'Services',
                    tabBarIcon: ({ focused, color, size }) => (
                        <AntDesign name="shoppingcart" color={color} size={focused ? 35 : 30} />
                    ),
                    tabBarLabel: 'Services',
                    headerTitle: () => {
                        return (
                            <Text
                                style={styles.headerText}
                            >
                                SERVICES
                            </Text>
                        )
                    },
                    headerStyle: {
                        backgroundColor: '#004AAD'
                    },
                    headerShadowVisible: false,

                }}
            />
            <Tab.Screen
                name='Wallet'
                component={Wallet}
                options={{
                    title: 'Wallet',
                    tabBarIcon: ({ focused, color, size }) => (
                        <SimpleLineIcons name="wallet" color={color} size={focused ? 35 : 30} />
                    ),
                    tabBarLabel: 'Wallet',
                    headerTitle: () => {
                        return (
                            <Text style={styles.headerText}>
                                MY WALLET
                            </Text>
                        )
                    },
                    headerStyle: {
                        backgroundColor: '#004AAD'
                    },
                    headerShadowVisible: false,
                }}
            />
            <Tab.Screen
                name='Profile'
                component={PRofile}
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused, color, size }) => (
                        <AntDesign name="profile" color={color} size={focused ? 35 : 30} />
                    ),
                    tabBarLabel: 'Profile',
                    headerTitle: () => {
                        return (
                            <Text
                                style={styles.headerText}
                            >
                                PROFILE
                            </Text>
                        )
                    },
                    headerStyle: {
                        backgroundColor: '#004AAD',
                    },
                    headerShadowVisible: false,
                }}
            />
        </Tab.Navigator>
    );
}

const App = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const [initialName, setInitialName] = useState('Landing')

    const getUserToken = async () => {
        try {
            await AsyncStorage.getItem('isLoggedIn')
                .then(value => {
                    if (value != null) {
                        setUserToken(value);
                        AsyncStorage.getItem('RememberPassword')
                            .then(value => {
                                if (value != null) {
                                    setInitialName('Welcome')
                                } else {
                                    setInitialName('Home');
                                }
                            })
                    } else {
                        setInitialName('Landing')
                    }
                })

        } finally {
            setIsLoading(false);
        }
    };

    const [fontsLoaded, fontError] = useFonts({
        'Ubuntu-Regular': require('./assets/fonts/Ubuntu-Regular.ttf'),
        'Ubuntu-Medium': require('./assets/fonts/Ubuntu-Medium.ttf'),
        'Ubuntu-Bold': require('./assets/fonts/Ubuntu-Bold.ttf'),
        'Rubik-Regular': require('./assets/fonts/Rubik-Regular.ttf'),
        'Rubik-Medium': require('./assets/fonts/Rubik-Medium.ttf'),
        'Rubik-Bold': require('./assets/fonts/Rubik-Bold.ttf'),
    });

    useEffect(() => {
        getUserToken();
    }, []);

    if (isLoading || !fontsLoaded) {
        return <SplashScreen />;
    }

    if (fontError) {
        return (<View>
            <Text>
                INvalid font
            </Text>
        </View>)
    }

    const config = {
        animation: 'spring',
        config: {
            stiffness: 1000,
            damping: 500,
            mass: 3,
            overshootClamping: true,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
        },
    };

    return (
        <NavigationContainer

        >
            <Stack.Navigator
                initialRouteName={initialName}
                screenOptions={{
                    transitionSpec: {
                        open: config,
                        close: config,
                    },
                }}
            >
                <Stack.Group>
                    <Stack.Screen name="Home" options={{ headerShown: false }} component={UserInNav} />
                    <Stack.Screen name="Notifications" component={Notifications} />
                    <Stack.Group
                        screenOptions={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: '#004AAD',
                            },
                            headerBackTitleStyle: {
                                color: 'white'
                            },
                            headerShadowVisible: false,
                            headerLeft: () => {
                                <MaterialCommunityIcons name="chevron-left-box-outline" size={25} style={{ margin: 8, padding: 2, textAlign: 'center', flex: 0, height: 30, alignItems: 'center', justifyContent: 'center', }} color="#fff" />
                            },
                            headerTitleStyle: {
                                color: '#fff'
                            }
                        }}
                    >
                        <Stack.Screen
                            name="Airtime"
                            options={{
                                title: 'Airtime Purchase'
                            }}
                            component={Airtime}
                        />

                        <Stack.Screen
                            name="AirtimeReceipt"
                            component={AirtimeReciept}
                        />

                        <Stack.Screen name="Cable" options={{
                            title: 'Cable TV Sub'
                        }}
                            component={Cable}
                        />

                        <Stack.Screen
                            name="CableReceipt"
                            component={CableReciept}
                        />

                        <Stack.Screen name="Data" options={{
                            title: 'Data Subscription'
                        }}
                            component={Data}
                        />

                        <Stack.Screen
                            name="DataReceipt"
                            component={DataReciept}
                        />

                        <Stack.Screen name="Electricity" options={{
                            title: 'Electricity Bills'
                        }}
                            component={Electricity}
                        />

                        <Stack.Screen
                            name="ElectricityReceipt"
                            component={ElectricityReciept}
                        />

                        <Stack.Screen name="Internet" options={{
                            title: 'Internet Subscription'
                        }}
                            component={Internet}
                        />

                        <Stack.Screen name="Education" options={{
                            title: 'Result Checker'
                        }}
                            component={Education}
                        />

                        <Stack.Screen
                            name="EduReceipt"
                            component={EduReciept}
                        />
                    </Stack.Group>

                    <Stack.Group
                        screenOptions={{
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: '#004AAD',
                            },
                            headerBackTitleStyle: {
                                color: 'white'
                            },
                            headerShadowVisible: false,
                            headerTitleStyle: {
                                color: '#fff'
                            },
                        }}
                    >
                        <Stack.Screen name="FundWallet" title={'Fund Wallet'} component={FundWallet} />
                    </Stack.Group>
                </Stack.Group>

                <Stack.Group screenOptions={{ headerShown: false }}>
                    <Stack.Screen
                        name='Landing'
                        options={{
                            title: 'Welcome to Bidsub'
                        }}
                        component={Landing}
                    />
                    <Stack.Screen
                        name='OnBoarding'
                        options={{
                            title: 'Welcome to Bidsub'
                        }}
                        component={OnBoarding}
                    />
                    <Stack.Screen name="Welcome" component={Welcome} />
                    <Stack.Screen name="SignIn" component={SignIn} />
                    <Stack.Screen name="SignUp" component={SignUp} />
                    <Stack.Screen name="Verify" component={Verify} />
                    <Stack.Screen
                        name="ForgetPassword"
                        component={Forget}
                        options={{
                            title: 'Welcome to Bidsub'
                        }}
                    />
                </Stack.Group>

                <Stack.Group
                    screenOptions={{
                        presentation: 'modal',
                        headerStyle: {
                            backgroundColor: '#004aad',
                        },
                        headerTintColor: '#ffffff',
                        headerTitleStyle: {
                            fontSize: 25,
                            fontFamily: 'Rubik-Bold'
                        }

                    }}
                >
                    <Stack.Screen
                        options={{
                            title: 'Transaction Pin',
                        }}
                        name="CreatePin"
                        component={CreatePin}
                    />
                    <Stack.Screen
                        options={{
                            title: 'Change Account Password',
                        }}
                        name="ChangePassword"
                        component={ChangePassword}
                    />
                    <Stack.Screen
                        options={{
                            title: 'Settings',
                        }}
                        name="Settings"
                        component={Settings}
                    />
                    <Stack.Screen
                        options={{
                            title: 'Edit Personal Information',
                        }}
                        name="EditInfo"
                        component={EditInfo}
                    />
                    <Stack.Screen
                        options={{
                            title: 'Bidsub Help Desk',
                        }}
                        name="Help"
                        component={Help}
                    />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App

const Help = () => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            <Text>
                Our Help Desk
            </Text>
        </View>
    );
}

function SplashScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#004aad' }}>
            <Image
                source={require('./assets/images/logo.jpg')}
                style={{
                    width: 200,
                    height: 200
                }}
            />
            <ActivityIndicator size={'large'} color={'white'} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: 34,
        fontFamily: 'Rubik-Regular',
        fontWeight: 'bold',
        marginTop: 10,
        lineHeight: 35,
        color: '#ffffff',
    },
    image: {
        width: 40,
        height: 40,
        borderWidth: 2,
        margin: 20,
        marginRight: 0,
        borderRadius: 7,
        backgroundColor: 'white'
    },
    username: {
        fontSize: 27,
        fontFamily: 'Ubuntu-Medium',
        textTransform: 'capitalize',
        color: 'white'
    }
})