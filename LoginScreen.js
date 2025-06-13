"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const LoginScreen = ({ route, navigation }) => {
  // Estados para controlar os campos do formulário
  const [isLogin, setIsLogin] = useState(true)
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const { setIsLoggedIn } = route.params

  // Função para lidar com o login
  const handleLogin = async () => {
    // Validação básica
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos")
      return
    }

    try {
      // Em um app real, aqui seria feita a autenticação com um backend
      // Para este exemplo, apenas verificamos se o email existe no AsyncStorage
      const usuariosString = await AsyncStorage.getItem("usuarios")
      const usuarios = usuariosString ? JSON.parse(usuariosString) : []

      const usuario = usuarios.find((u) => u.email === email)

      if (!usuario) {
        Alert.alert("Erro", "Usuário não encontrado")
        return
      }

      if (usuario.senha !== senha) {
        Alert.alert("Erro", "Senha incorreta")
        return
      }

      // Salvar dados do usuário logado
      await AsyncStorage.setItem("userToken", "token-dummy")
      await AsyncStorage.setItem("usuarioAtual", JSON.stringify(usuario))

      // Atualizar estado de login no App.js
      setIsLoggedIn(true)
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer login: " + error.message)
    }
  }

  // Função para lidar com o cadastro
  const handleCadastro = async () => {
    // Validação básica
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos")
      return
    }

    try {
      // Verificar se o email já está cadastrado
      const usuariosString = await AsyncStorage.getItem("usuarios")
      const usuarios = usuariosString ? JSON.parse(usuariosString) : []

      if (usuarios.some((u) => u.email === email)) {
        Alert.alert("Erro", "Este email já está cadastrado")
        return
      }

      // Adicionar novo usuário
      const novoUsuario = { nome, email, senha }
      usuarios.push(novoUsuario)

      // Salvar no AsyncStorage
      await AsyncStorage.setItem("usuarios", JSON.stringify(usuarios))
      await AsyncStorage.setItem("userToken", "token-dummy")
      await AsyncStorage.setItem("usuarioAtual", JSON.stringify(novoUsuario))

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!")

      // Atualizar estado de login no App.js
      setIsLoggedIn(true)
    } catch (error) {
      Alert.alert("Erro", "Falha ao cadastrar: " + error.message)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{isLogin ? "Entrar" : "Cadastrar"}</Text>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome</Text>
              <TextInput style={styles.input} placeholder="Seu nome completo" value={nome} onChangeText={setNome} />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="seu.email@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={isLogin ? handleLogin : handleCadastro}>
            <Text style={styles.buttonText}>{isLogin ? "Entrar" : "Cadastrar"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchButtonText}>
              {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Faça login"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#4CAF50",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 20,
    alignItems: "center",
  },
  switchButtonText: {
    color: "#4CAF50",
    fontSize: 14,
  },
})

export default LoginScreen
