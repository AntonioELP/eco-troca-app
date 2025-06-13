import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const ItemDetailsScreen = ({ route, navigation }) => {
  // Obter o item dos parâmetros da rota
  const { item } = route.params

  // Função para lidar com o interesse no item
  const handleInteresse = () => {
    Alert.alert(
      "Confirmar Interesse",
      `Você tem interesse em ${item.tipo === "Doação" ? "receber" : "trocar"} este item?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim, tenho interesse",
          onPress: () => {
            Alert.alert(
              "Interesse Registrado",
              "O proprietário do item será notificado sobre seu interesse. Em breve ele entrará em contato!",
              [{ text: "OK" }],
            )
          },
        },
      ],
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.titulo}>{item.nome}</Text>
          <View style={[styles.tipoBadge, { backgroundColor: item.tipo === "Doação" ? "#4CAF50" : "#2196F3" }]}>
            <Text style={styles.tipoTexto}>{item.tipo}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.descricao}>{item.descricao}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato do Proprietário</Text>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{item.proprietario.nome}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{item.proprietario.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{item.proprietario.telefone}</Text>
          </View>
        </View>

        {item.tipo === "Troca" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interesses para Troca</Text>
            <Text style={styles.descricao}>{item.interessesTroca || "Aberto a ofertas"}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleInteresse}>
          <Text style={styles.buttonText}>Quero este item</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    margin: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
  tipoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  tipoTexto: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  descricao: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#444",
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ItemDetailsScreen
