"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"

const ProfileScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState(null)
  const [itensUsuario, setItensUsuario] = useState([])

  // Carregar dados do usuário ao iniciar a tela
  useEffect(() => {
    carregarDadosUsuario()

    // Adicionar listener para atualizar os dados quando voltar para esta tela
    const unsubscribe = navigation.addListener("focus", () => {
      carregarDadosUsuario()
    })

    return unsubscribe
  }, [navigation])

  // Função para carregar dados do usuário e seus itens
  const carregarDadosUsuario = async () => {
    try {
      // Carregar dados do usuário
      const usuarioString = await AsyncStorage.getItem("usuarioAtual")
      if (usuarioString) {
        const usuarioAtual = JSON.parse(usuarioString)
        setUsuario(usuarioAtual)

        // Carregar itens do usuário
        const itensString = await AsyncStorage.getItem("itens")
        if (itensString) {
          const todosItens = JSON.parse(itensString)
          // Filtrar apenas os itens do usuário atual (em um app real, isso seria feito pelo backend)
          // Aqui estamos simulando, assumindo que o email do proprietário é o mesmo do usuário logado
          const itensDoUsuario = todosItens.filter((item) => item.proprietario.email === usuarioAtual.email)
          setItensUsuario(itensDoUsuario)
        }
      }
    } catch (error) {
      console.log("Erro ao carregar dados do usuário:", error)
    }
  }

  // Função para fazer logout
  const handleLogout = async () => {
    Alert.alert("Confirmar Saída", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        onPress: async () => {
          try {
            // Remover token de autenticação
            await AsyncStorage.removeItem("userToken")
            await AsyncStorage.removeItem("usuarioAtual")

            // Redirecionar para a tela de login
            // Isso será capturado pelo useEffect no App.js
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            })
          } catch (error) {
            Alert.alert("Erro", "Falha ao fazer logout: " + error.message)
          }
        },
      },
    ])
  }

  // Se o usuário não estiver carregado, mostrar uma mensagem
  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{usuario.nome.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.userName}>{usuario.nome}</Text>
        <Text style={styles.userEmail}>{usuario.email}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Meus Itens</Text>

        {itensUsuario.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Você ainda não adicionou nenhum item</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Adicionar")}>
              <Text style={styles.addButtonText}>Adicionar Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          itensUsuario.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              onPress={() => navigation.navigate("ItemDetails", { item })}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <View style={[styles.tipoBadge, { backgroundColor: item.tipo === "Doação" ? "#4CAF50" : "#2196F3" }]}>
                  <Text style={styles.tipoTexto}>{item.tipo}</Text>
                </View>
              </View>
              <Text style={styles.itemDescricao} numberOfLines={2}>
                {item.descricao}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  profileCard: {
    backgroundColor: "white",
    margin: 16,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#F44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  sectionContainer: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  tipoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipoTexto: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  itemDescricao: {
    fontSize: 14,
    color: "#666",
  },
})

export default ProfileScreen
