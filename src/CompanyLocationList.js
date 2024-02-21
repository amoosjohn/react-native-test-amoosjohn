import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    FlatList
} from 'react-native';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CompanyLocationList = ({ navigation }) => {

    const [companyList, setCompanyList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [loginUser, setLoginUser] = useState([]);
   

    const getAccessToken = async () => await AsyncStorage.getItem('access_token'); 

    const getCurrentUser = async () => {
        const currentUser = JSON.parse(await AsyncStorage.getItem('user'));
        setLoginUser(currentUser);
    }; 

    const checkLoginStatus = async () => {
        const token = await getAccessToken(); 
        if(!token) {
            navigation.navigate('Login');
        }
    };

    const getHeaders = async () => {
        const token = await getAccessToken();
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Security-Check': 'true'
        };

        return headers;
    }


    const getAllCompanies = async () => {
        try {
            const headers = await getHeaders();
            
            const response = await axios.get(`${process.env.API_URL}/api/companies`,{headers});
            const {data} = response.data;
            setCompanyList(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const getAllLocations = async () => {
        try {
            const headers = await getHeaders();
            
            const response = await axios.get(`${process.env.API_URL}/api/locations`,{headers});
            const {data} = response.data;
            setLocationList(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleLogout = async () => {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('user');
        navigation.navigate('Login');
    };

    useEffect(() => {
        checkLoginStatus();
        getCurrentUser();
        getAllCompanies();
        getAllLocations();
    }, []);


    return (
        <View style={styles.container}>
            <View style={[styles.logoWrap, styles.alignCenter]}>
                <Image source={require('../assets/images/logo.png')} style={[styles.logo, styles.smLogo]} />
            </View>
            <Text style={styles.subTitle}> {loginUser.name ?? ''} </Text>
            <Button  title="Logout" onPress={handleLogout} />
            <Text style={styles.subTitle}> Company List </Text>
            <FlatList
                data={companyList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                <View style={styles.companyItem}>
                    <Text style={styles.primaryColor}>{item.name}</Text>
                </View>
                )}
            />

            <Text style={styles.subTitle}> Location List </Text>
            <FlatList
                data={locationList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                <View style={styles.companyItem}>
                    <Text style={styles.primaryColor}>{item.name}</Text>
                </View>
                )}
            />

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#2d3748',
        alignItems: 'center',
    },
    subTitle: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#CBD5e0",
        marginBottom: 20,
        marginTop: 20,
    },
    inputText: {
        height: 50,
        color: "#000000"
    },
    forgotAndSignUpText: {
        color: "white",
        fontSize: 11
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
    companyItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color: "#CBD5e0",

    },
    primaryColor: {
        color: "#CBD5e0",
    },
});
export default CompanyLocationList;
