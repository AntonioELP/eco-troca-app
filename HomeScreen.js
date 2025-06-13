"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, SafeAreaView } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import { dadosIniciais } from "../data"

const HomeScreen = ({ navigation }) => {
  const [itens, setItens] = useState([])
  const [filtro, setFiltro] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("Todos") // 'Todos', 'Doação', 'Troca'

  // Carregar itens ao iniciar a tela
  useEffect(() => {
    carregarItens()

    // Adicionar listener para atualizar a lista quando voltar para esta tela
    const unsubscribe = navigation.addListener("focus", () => {
      carregarItens()
    })

    return unsubscribe
  }, [navigation])

  // Função para carregar itens do AsyncStorage
  const carregarItens = async () => {
    try {
      // Verificar se já existem itens salvos
      const itensString = await AsyncStorage.getItem("itens")

      if (itensString) {
        // Se existirem, usar os itens salvos
        setItens(JSON.parse(itensString))
      } else {
        // Se não existirem, usar os dados iniciais e salvá-los
        await AsyncStorage.setItem("itens", JSON.stringify(dadosIniciais))
        setItens(dadosIniciais)
      }
    } catch (error) {
      console.log("Erro ao carregar itens:", error)
    }
  }

  // Função para filtrar itens
  const itensFiltrados = () => {
    return itens.filter((item) => {
      // Filtrar por texto (nome ou descrição)
      const matchTexto =
        item.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        item.descricao.toLowerCase().includes(filtro.toLowerCase())

      // Filtrar por tipo (Doação ou Troca)
      const matchTipo = tipoFiltro === "Todos" || item.tipo === tipoFiltro

      return matchTexto && matchTipo
    })
  }

  // Renderizar cada item da lista
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemCard} onPress={() => navigation.navigate("ItemDetails", { item })}>
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
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Itens Disponíveis</Text>
      </View>

      <View style={styles.filtroContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Buscar itens..." value={filtro} onChangeText={setFiltro} />
        </View>

        <View style={styles.tipoFiltroContainer}>
          <TouchableOpacity
            style={[styles.filtroButton, tipoFiltro === "Todos" && styles.filtroButtonActive]}
            onPress={() => setTipoFiltro("Todos")}
          >
            <Text style={[styles.filtroButtonText, tipoFiltro === "Todos" && styles.filtroButtonTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filtroButton, tipoFiltro === "Doação" && styles.filtroButtonActive]}
            onPress={() => setTipoFiltro("Doação")}
          >
            <Text style={[styles.filtroButtonText, tipoFiltro === "Doação" && styles.filtroButtonTextActive]}>
              Doações
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filtroButton, tipoFiltro === "Troca" && styles.filtroButtonActive]}
            onPress={() => setTipoFiltro("Troca")}
          >
            <Text style={[styles.filtroButtonText, tipoFiltro === "Troca" && styles.filtroButtonTextActive]}>
              Trocas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={itensFiltrados()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum item encontrado</Text>
          </View>
        }
      />
    </SafeAreaView>
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
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  filtroContainer: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  tipoFiltroContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filtroButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  filtroButtonActive: {
    backgroundColor: "#4CAF50",
  },
  filtroButtonText: {
    color: "#666",
  },
  filtroButtonTextActive: {
    color: "white",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemNome: {
    fontSize: 18,
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
})

export default HomeScreen
