import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

import { useFonts } from 'expo-font'
import { Slot, SplashScreen, Stack } from 'expo-router'

import GlobalProvider from '../context/GlobalProvider'

import "../global.css";

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {

  const [fontsLoaded, error] = useFonts({
    'Poppins-Black' : require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Thin' : require('../assets/fonts/Poppins-Thin.ttf'),
    'Poppins-SemiBold' : require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Regular' : require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium' : require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Light' : require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-ExtraLight' : require('../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-ExtraBold' : require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-Bold' : require('../assets/fonts/Poppins-Bold.ttf')
  })

  useEffect(() => {

    if (error) throw error

    if (fontsLoaded) SplashScreen.hideAsync()

  }, [fontsLoaded, error])

  if (!fontsLoaded && !error) return null

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }}/>
        <Stack.Screen name='(auth)' options={{ headerShown: false }}/>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }}/>
        <Stack.Screen name='search/[query]' options={{ headerShown: false }}/>
      </Stack>
    </GlobalProvider>
  )
}

export default RootLayout