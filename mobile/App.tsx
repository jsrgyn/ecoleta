import React from 'react'; 
// import { StyleSheet, Text, View } from 'react-native';
import { AppLoading } from 'expo';

import { StatusBar, View } from 'react-native';

import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';

//  import Home from './src/pages/Home';
import Routes from './src/routes';

// JSX: XML dentro do JavaScript
export default function App() {
  
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  });

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    //  <View style={styles.container}>
    //    {/* <Text>Open up App.tsx to start working on your app!</Text> */}
    //    <Text>Hello World</Text>
    //  </View>
    // <Home />

    // <View>
    //    <StatusBar />
    //    <Home />
    // </View>

    //  ou assim
    <> 
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
      {/* <Home /> */}
      <Routes />
    </>
  );
}

// const styles = StyleSheet.create({
//    container: {
//      flex: 1,
//       //backgroundColor: '#fff',
//       backgroundColor: '#7159c1',
//      alignItems: 'center',
//      justifyContent: 'center',
//    },
//  });
