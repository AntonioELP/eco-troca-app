"use client"

import { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"

// Importação das telas
import LoginScreen from "./screens/LoginScreen"
import HomeScreen from "./screens/HomeScreen"
import ItemDetailsScreen from "./screens/ItemDetailsScreen"
import AddItemScreen from "./screens/AddItemScreen"
import ProfileScreen from "./screens/ProfileScreen"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

// Componente para o TabNavigator (navegação inferior)
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Início") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Adicionar") {
            iconName = focused ? "add-circle" : "add-circle-outline"
          } else if (route.name === "Perfil") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Adicionar" component={AddItemScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar se o usuário já está logado ao iniciar o app
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken")
        setIsLoggedIn(userToken !== null)
      } catch (error) {
        console.log("Erro ao verificar status de login:", error)
        setIsLoggedIn(false) // Fallback para não logado em caso de erro
      } finally {
        setIsLoading(false)
      }
    }

    checkLoginStatus()
  }, [])

  if (isLoading) {
    // Poderia adicionar uma tela de splash aqui
    return null
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          // Rota de autenticação
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
            initialParams={{ setIsLoggedIn }}
          />
        ) : (
          // Rotas principais do app
          <>
            <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
            <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} options={{ title: "Detalhes do Item" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
