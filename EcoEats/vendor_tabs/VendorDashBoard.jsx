import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const VendorDashBoard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isLoaded) {
      getUserInfo();
      setIsLoaded(true);
    }
  }, []);

  const getUserInfo = () => {
    const user = auth().currentUser;
    firestore()
      .collection('Users')
      .doc(user.uid)
      .get()
      .then(querySnapshot => {
        setUserInfo(querySnapshot.data());
        setItems(querySnapshot.data().items);
        setOrders(querySnapshot.data().ordersReceived);
      });
  };

  const renderItem = ({ item }) => {
    const handleNavigation = () => {
      // Navigate to another page
      navigation.navigate('AddItems',{navigation: navigation});
    };

    return (
      <View style={styles.itemView}>
        <TouchableOpacity onPress={handleNavigation} style={styles.navigationButton}>
          <Text style={styles.navigationButtonText}>Navigate</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.nameText}>Name: {item.name}</Text>
          <Text style={styles.descText}>Description: {item.description}</Text>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        </View>
      </View>
    );
  };

  const openLocationInMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const renderOrder = ({ item }) => {
    const { latitude, longitude } = item.location;

    return (
      <View style={styles.itemView}>
        <Text style={styles.TextBox}>Name: {item.name}</Text>
        <TouchableOpacity
          onPress={() => openLocationInMap(latitude, longitude)}
          style={styles.locationButton}
        >
          <Text style={styles.locationButtonText}>View Location</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.TextBox}>Welcome {userInfo.name}</Text>
        <Text style={styles.TextBox}>Email ID: {userInfo.email}</Text>
        <Text style={styles.TextBox}>User type: {userInfo.userType}</Text>
        <View style={styles.container}>
          <Text style={styles.TextBox}>Items:</Text>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.TextBox}>Orders:</Text>
          <FlatList
            data={orders}
            renderItem={renderOrder}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
};

export default VendorDashBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  itemView: {
    padding: 10,
    margin: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  navigationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  descText: {
    fontSize: 14,
    color: '#000',
  },
  itemImage: {
    width: 50,
    height: 50,
  },
  TextBox: {
    color: '#000',
    fontSize: 18,
    marginBottom: 10,
  },
  locationButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
