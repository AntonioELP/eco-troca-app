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
import { Ionicons } from "@expo/vector-icons"

const AddItemScreen = ({ navigation }) => {
  // Estados para controlar os campos do formulário
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [tipo, setTipo] = useState("Doação") // 'Doação' ou 'Troca'
  const [interessesTroca, setInteressesTroca] = useState("")

  // Função para adicionar um novo item
  const handleAdicionarItem = async () => {
    // Validação básica
    if (!nome || !descricao) {
      Alert.alert("Erro", "Por favor, preencha os campos obrigatórios")
      return
    }

    try {
      // Obter o usuário atual
      const usuarioString = await AsyncStorage.getItem("usuarioAtual")
      if (!usuarioString) {
        Alert.alert("Erro", "Usuário não encontrado")
        return
      }

      const usuario = JSON.parse(usuarioString)

      // Obter a lista atual de itens
      const itensString = await AsyncStorage.getItem("itens")
      const itens = itensString ? JSON.parse(itensString) : []

      // Criar um novo item
      const novoItem = {
        id: Date.now(), // ID único baseado no timestamp
        nome,
        descricao,
        tipo,
        interessesTroca: tipo === "Troca" ? interessesTroca : null,
        proprietario: {
          nome: usuario.nome,
          email: usuario.email,
          telefone: "(XX) XXXXX-XXXX", // Telefone fictício para o exemplo
        },
        dataCriacao: new Date().toISOString(),
      }

      // Adicionar o novo item à lista
      const novosItens = [...itens, novoItem]
      await AsyncStorage.setItem("itens", JSON.stringify(novosItens))

      Alert.alert("Sucesso", "Item adicionado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            // Limpar o formulário
            setNome("")
            setDescricao("")
            setTipo("Doação")
            setInteressesTroca("")

            // Navegar para a tela inicial
            navigation.navigate("Início")
          },
        },
      ])
    } catch (error) {
      Alert.alert("Erro", "Falha ao adicionar item: " + error.message)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Adicionar Item</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do Item *</Text>
            <TextInput style={styles.input} placeholder="Ex: Livro de Matemática" value={nome} onChangeText={setNome} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o item em detalhes..."
              multiline
              numberOfLines={4}
              value={descricao}
              onChangeText={setDescricao}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo de Oferta *</Text>
            <View style={styles.tipoContainer}>
              <TouchableOpacity
                style={[styles.tipoButton, tipo === "Doação" && styles.tipoButtonActive]}
                onPress={() => setTipo("Doação")}
              >
                <Ionicons
                  name={tipo === "Doação" ? "gift" : "gift-outline"}
                  size={20}
                  color={tipo === "Doação" ? "white" : "#4CAF50"}
                />
                <Text style={[styles.tipoButtonText, tipo === "Doação" && styles.tipoButtonTextActive]}>Doação</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tipoButton, tipo === "Troca" && styles.tipoButtonActive]}
                onPress={() => setTipo("Troca")}
              >
                <Ionicons
                  name={tipo === "Troca" ? "swap-horizontal" : "swap-horizontal-outline"}
                  size={20}
                  color={tipo === "Troca" ? "white" : "#2196F3"}
                />
                <Text style={[styles.tipoButtonText, tipo === "Troca" && styles.tipoButtonTextActive]}>Troca</Text>
              </TouchableOpacity>
            </View>
          </View>

          {tipo === "Troca" && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Interesses para Troca</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="O que você gostaria de receber em troca?"
                multiline
                numberOfLines={3}
                value={interessesTroca}
                onChangeText={setInteressesTroca}
              />
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleAdicionarItem}>
            <Text style={styles.buttonText}>Adicionar Item</Text>
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
  },
  header: {
    padding: 16,
    backgroundColor: "#4CAF50",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "white",
    margin: 16,
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  tipoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tipoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 1,
    marginHorizontal: 5,
  },
  tipoButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  tipoButtonText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },
  tipoButtonTextActive: {
    color: "white",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default AddItemScreen
