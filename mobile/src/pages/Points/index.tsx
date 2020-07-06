import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

const Points = () => {
    // return <View />;
    const [items, setItems] = useState<Item[]>([]);

    const [points, setPoints] = useState<Point[]>([]);

    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    
    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    useEffect(() => {
      async function loadPosition() {
        const { status } = await Location.requestPermissionsAsync();
        
        if ( status !== 'granted') {
          Alert.alert('Oooops...', 'Precisamos de sua permissão para obter a localização');
          return;
        }

        const location = await Location.getCurrentPositionAsync();

        const { latitude, longitude } = location.coords;

        console.log(latitude, longitude);

        setInitialPosition([
          latitude,
          longitude
        ])
      }
      loadPosition();
    }, [])

    useEffect(() => {
      api.get('Items').then(response => {
        setItems(response.data);
      })
    }, []);

    useEffect(() => { 
      api.get('points', {
         params: {
          //  city: 'Rio do Sul',
          //  uf: 'SC',
          //  items: [1, 2],
          //  city: 'Goiânia',
          //  uf: 'GO',
          //  items: [1, 2],
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems
         }
       }).then(response => {
         console.log([response.data], 'teste');
         setPoints(response.data);
       })
  }, [selectedItems]);

    function handleNavigateBack() {
        navigation.goBack();
    };

    function handleNavigateToDetail(id : number) {
        // navigation.navigate('Detail');
        navigation.navigate('Detail', { point_id : id });
    };

    function handleSelecitItem(id: number) {
      console.log('teste', id);
    // setSelectedItems([id]);
    const alreadySelected = selectedItems.findIndex(item => item === id); 

    if (alreadySelected >= 0) {
        const filteredItems = selectedItems.filter(item => item !== id);

        setSelectedItems(filteredItems);
    } else {
        setSelectedItems([...selectedItems, id]);
    }
  }


    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79"/>
                </TouchableOpacity>

                <Text style={styles.title}>Bem vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer}>
                    {/* <MapView 
                      style={styles.map}
                      loadingEnabled={initialPosition[0] === 0}
                      initialRegion={{
                          // latitude: -27.2092052,
                          // longitude: -49.6401092,
                          latitude: initialPosition[0],
                          longitude: initialPosition[1],
                          latitudeDelta: 0.014,
                          longitudeDelta: 0.014,
                      }}
                    >
                        <Marker
                            style={styles.mapMarker}
                            onPress={handleNavigateToDetail}
                            coordinate={{
                                latitude: -27.2092052,
                                longitude: -49.6401092  
                            }}
                        >
                            <View style={styles.mapMarkerContainer}> 
                                <Image
                                style={styles.mapMarkerImage}  
                                source={{uri: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60'}}
                                />
                                <Text style={styles.mapMarkerTitle}>Mercado</Text>
                            </View>
                        </Marker>
                    </MapView> */}

                    {initialPosition[0] !== 0 && (
                              // <MapView 
                              //       style={styles.map}
                              //       loadingEnabled={initialPosition[0] === 0}
                              //       initialRegion={{
                              //           // latitude: -27.2092052,
                              //           // longitude: -49.6401092,
                              //           latitude: initialPosition[0],
                              //           longitude: initialPosition[1],
                              //           latitudeDelta: 0.014,
                              //           longitudeDelta: 0.014,
                              //       }}
                              //       >
                              //        <Marker
                              //             style={styles.mapMarker}
                              //             onPress={handleNavigateToDetail}
                              //             coordinate={{
                              //                 latitude: -27.2092052,
                              //                 longitude: -49.6401092  
                              //             }}
                              //         >
                              //             <View style={styles.mapMarkerContainer}> 
                              //                 <Image
                              //                 style={styles.mapMarkerImage}  
                              //                 source={{uri: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60'}}
                              //                 />
                              //                 <Text style={styles.mapMarkerTitle}>Mercado</Text>
                              //             </View>
                              //         </Marker> 
                              // </MapView>
                              
                          <MapView 
                              style={styles.map}
                              loadingEnabled={initialPosition[0] === 0}
                              initialRegion={{
                                  // latitude: -27.2092052,
                                  // longitude: -49.6401092,
                                  latitude: initialPosition[0],
                                  longitude: initialPosition[1],
                                  latitudeDelta: 0.014,
                                  longitudeDelta: 0.014,
                              }}
                              >
                               {console.log(points)}  
                               {points.map(point => (
                               <Marker
                                    key={String(point.id)}
                                    style={styles.mapMarker}
                                    // onPress={handleNavigateToDetail}
                                    onPress={ () => handleNavigateToDetail(point.id)}
                                    coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude,  
                                    }}
                                >
                                    <View style={styles.mapMarkerContainer}> 
                                        <Image
                                        style={styles.mapMarkerImage}  
                                        // source={{uri: point.image}}
                                        source={{uri: point.image_url}}
                                        />
                                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker> 
                              ))}
                        </MapView>   
                    )}
                </View>
            </View>

            <View style={styles.itemsContainer}>
                <ScrollView 
                  horizontal 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20}}
                >
                    {/* <TouchableOpacity style={styles.item}>
                        <SvgUri width={42} height={42} uri="http://128.104.101.9:3333/uploads/lampadas.svg"></SvgUri>
                        <Text style={styles.itemTitle}>Lâmpadas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item}>
                        <SvgUri width={42} height={42} uri="http://128.104.101.9:3333/uploads/lampadas.svg"></SvgUri>
                        <Text style={styles.itemTitle}>Lâmpadas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item}>
                        <SvgUri width={42} height={42} uri="http://128.104.101.9:3333/uploads/lampadas.svg"></SvgUri>
                        <Text style={styles.itemTitle}>Lâmpadas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item}>
                        <SvgUri width={42} height={42} uri="http://128.104.101.9:3333/uploads/lampadas.svg"></SvgUri>
                        <Text style={styles.itemTitle}>Lâmpadas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item}>
                        <SvgUri width={42} height={42} uri="http://128.104.101.9:3333/uploads/lampadas.svg"></SvgUri>
                        <Text style={styles.itemTitle}>Lâmpadas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item}>
                        <SvgUri width={42} height={42} uri="http://128.104.101.9:3333/uploads/lampadas.svg"></SvgUri>
                        <Text style={styles.itemTitle}>Lâmpadas</Text>
                    </TouchableOpacity> */}


                    {items.map(item => 
                      <TouchableOpacity 
                        key={String(item.id)} 
                        // style={styles.item}
                        style={[
                          styles.item,
                          selectedItems.includes(item.id) ? styles.selectedItem : {}
                        ]}
                        // onPress={() => {}}
                        onPress={() => handleSelecitItem(item.id)}
                        activeOpacity={0.6}
                      >
                        <SvgUri width={42} height={42} uri={item.image_url}></SvgUri>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                      </TouchableOpacity>
                      )}

                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 50,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80,
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center',
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Points;