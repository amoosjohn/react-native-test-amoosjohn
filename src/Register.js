import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


const Register = ({ navigation }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({}); 

    const validateForm = () => { 
        let errors = {}; 
        // Validate email field 
        if (!name) { 
            errors.name = 'Name is required.'; 
        }
        // Validate email field 
        if (!email) { 
            errors.email = 'Email is required.'; 
        } else if (!/\S+@\S+\.\S+/.test(email)) { 
            errors.email = 'Email is invalid.'; 
        } 
  
        // Validate password field 
        if (!password) { 
            errors.password = 'Password is required.'; 
        } else if (password.length < 6) { 
            errors.password = 'Password must be at least 6 characters.'; 
        } 
        console.log('errors',errors.email)
        // Set the errors
        setErrors(errors); 
        return (Object.keys(errors).length === 0); 
    }; 

    const handleLogin = async () => {
        let isFormValid = validateForm();
        if (isFormValid) { 
            const headers = {
                'Accept': 'application/json'
            };

            const payload = {
                name,
                email,
                password
            };
            await axios.post(`${process.env.API_URL}/api/register`, payload,
                { headers }).then(response  => {
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: response.data.message
                    });
                    navigation.navigate('Login');
                }).catch(error => {
                    console.error('error', error);
                    const {response} = error;
                    if(response.status === 422) {
                        Toast.show({
                            type: 'error',
                            text1: 'Validation Error',
                            text2: response.data.message
                        });
                    }

                });
        }
    };


    const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('access_token'); 
        if(token) {
            navigation.navigate('CompanyLocationList');
        }
    };

    const handleNavigateLogin = () => {
        navigation.navigate('Login');
    }
    
    useEffect(() =>{
        checkLoginStatus();
    },[]);


    return (
        <View style={styles.container}>
            <View style={[styles.logoWrap, styles.alignCenter]}>
                <Image source={require('../assets/images/logo.png')} style={[styles.logo, styles.smLogo]} />
            </View>
            <Text style={styles.title}> Register </Text>

            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Name"
                    placeholderTextColor="#000000"
                    onChangeText={text => setName(text)} />
                    
            </View>
            {Object.values(errors).length > 0 && errors.name !== undefined  ?  
                <Text style={styles.errorText}> 
                    {errors.name} 
                </Text> 
                : <></>
            }
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Email"
                    placeholderTextColor="#000000"
                    onChangeText={text => setEmail(text)} />
                    
            </View>
            {Object.values(errors).length > 0 && errors.email !== undefined  ?  
                <Text style={styles.errorText}> 
                    {errors.email} 
                </Text> 
                : <></>
            }
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    secureTextEntry
                    placeholder="Password"
                    placeholderTextColor="#000000"
                    onChangeText={text => setPassword(text)} />
            </View>
            {Object.values(errors).length > 0 && errors.password !== undefined  ?  
                <Text style={styles.errorText}> 
                    {errors.password} 
                </Text> 
                : <></>
            }

            <TouchableOpacity
                onPress={handleLogin}
                style={styles.loginBtn}>
                <Text style={styles.loginText}>REGISTER </Text>
            </TouchableOpacity>
            <Text style={styles.registerText}> Don't have an account?</Text>
            <TouchableOpacity onPress={handleNavigateLogin}>
                <Text style={styles.registerText}>Login</Text> 
            </TouchableOpacity>
            
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2d3748',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: "bold",
        fontSize: 50,
        color: "#CBD5e0",
        marginBottom: 40,
    },

    inputView: {
        width: "80%",
        backgroundColor: "#ffffff",
        borderRadius: 25,
        height: 50,
        marginBottom: 10,
        justifyContent: "center",
        padding: 20
    },
    inputText: {
        height: 50,
        color: "#000000"
    },
    loginBtn: {
        width: "80%",
        backgroundColor: "#1cb3bc",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10,
        color: "#FFFFFF",
    },
    alignCenter: {
        justifyContent: "center",
        alignItems: "center",
    },
    logoWrap: {
        width: wp('100%'),
        height: hp('10%'),
    },
    logo: {
        width: wp('80%'),
        resizeMode: 'contain',
    },
    smLogo: {
        width: wp('50%'),
        resizeMode: 'contain',
    },
    loginText: {
        color: "#FFFFFF",
    },
    errorText: {
        color: 'red',
        textAlign:'left',
        marginBottom: 10,
    },
    registerText: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#CBD5e0"
    },
});
export default Register;
