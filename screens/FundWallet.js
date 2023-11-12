import React, { useEffect, useRef, useState } from 'react';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { View, Text, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import query from '../constants/query';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../constants/Loader';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import SubmitButton from '../constants/SubmitButton';
import SuccessBox from '../components/SuccessBox';

const FundWallet = ({ navigation }) => {
    const paystackWebViewRef = useRef(paystackProps.PayStackRef);

    const isFocused = useIsFocused();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [pKEy, setPKey] = useState('')
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [spinning, setSpinning] = useState(true);
    const [error, setError] = useState('');

    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('')

    const fetchNow = async (user) => {
        try {
            const response = await axios.get(`${query.baseUrl}user/${user}`);
            if (response.data) {
                setUsername(response.data[0].username)
                setEmail(response.data[0].email)
            } else {
                setError(response.data.error)
            }
            const res = axios.get(`${query.baseUrl}public`);
            if (res.data) {
                console.log(res._token);
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setSpinning(false)
        }
    }

    const pubNow = async () => {
        try {
            const res = await axios.get(`${query.baseUrl}public`);
            if (res.data) {
                setPKey(res.data._token);
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setSpinning(false)
        }
    }

    const isOnline = async () => {
        setSpinning(true);
        setError('')
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
        if (isFocused) {
            pubNow();
            isOnline();
        }
    }, [isFocused]);

    const onSuccess = (reference) => {
        purchaseAirtime(reference);
    };

    // you can call this function anything
    const onClose = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed');
    }

    const purchaseAirtime = async (reference) => {
        setIsLoading(true);
        setAmountError(null)
        const data = {
            amount: amount,
            username: username,
            reference: reference.reference,
            status: reference.status,
        }
        try {
            const response = await axios.post(`${query.baseUrl}wallet/fund`, data);

            if (response.data.success) {
                console.log("Success");
                setMessage('Wallet Funded');
                setSuccess(true);

                setTimeout(() => {
                    setSuccess(false);
                    navigation.goBack();
                }, 3000);
            } else {
                console.log('error')
                setAmountError(response.data.error.message);
            }
        } catch (error) {
            console.log(error);
            console.log("This error")
        } finally {
            setIsLoading(false);
        }
    }

    if (spinning) {
        return (
            <Loader />
        )
    }
    return (
        <ScrollView>
            {success ? <SuccessBox message={message} /> : null}
            <View style={{ flex: 1 }}>
                <Paystack
                    paystackKey={pKEy}
                    billingEmail={email}
                    amount={amount}
                    onCancel={(e) => {
                        onClose()
                    }}
                    onSuccess={(res) => {
                        onSuccess(res.data.transactionRef)
                    }}
                    ref={paystackWebViewRef}
                />
            </View>
            <View>
                <Text style={styles.text}>
                    Amount
                </Text>

                <View style={{ width: '90%', alignSelf: 'center', marginTop: 15 }}>
                    <MaterialCommunityIcons name="currency-ngn" size={21} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
                    <TextInput
                        style={{
                            borderWidth: 0,
                            height: 48,
                            backgroundColor: 'rgba(0,0,0, 0.03)',
                            padding: 5,
                            paddingLeft: 35,
                            borderRadius: 8,
                            fontWeight: '700',
                            fontSize: 16,
                            color: "rgba(0,0,0,0.3)"
                        }}
                        value={amount}
                        onChangeText={
                            (text) => {
                                setAmount(text);
                                setAmountError(null)
                            }
                        }
                        autoCorrect={false}
                        inputMode={'numeric'}
                        autoComplete='off'
                        placeholder={'Amount'}
                    />
                    {amountError !== null ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                </View>

                {amountError !== null ? (
                    <>
                        <Text style={{ color: 'red', fontSize: 12, marginTop: 10, marginLeft: 25 }} >{amountError}</Text>
                    </>
                ) : null}
            </View>
            <SubmitButton
                title={'Proceed'}
                handleSubmit={
                    () => {
                        if (amount < 200) {
                            setAmountError('Minimum funding amount is #200');
                            return;
                        }
                        setIsLoading(true);
                        paystackWebViewRef.current.startTransaction()
                    }
                }
                loading={isLoading}
                disabled={isLoading}
            />
        </ScrollView>
    );
}

export default FundWallet


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    text: {
        fontSize: 20,
        fontFamily: 'Rubik-Bold',
        fontWeight: 'normal',
        marginBottom: 2,
        marginHorizontal: 10,
        marginTop: 15,
        lineHeight: 32,
        color: '#000000',
    },
    iconLeft: {
        position: 'absolute',
        left: 8,
        top: 12
    },
    iconRight: {
        position: 'absolute',
        right: 12,
        top: 7,
        padding: 5
    }
})