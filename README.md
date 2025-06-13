# Aplicativo de Trocas e Doações

Este é um aplicativo simples desenvolvido em React Native para Android, voltado para trocas e doações de itens entre usuários. Ideal para um projeto acadêmico de apresentação na faculdade.

## Funcionalidades

- **Login/Cadastro**: Sistema simples de autenticação com armazenamento local
- **Lista de Itens**: Visualização de itens disponíveis para troca ou doação
- **Detalhes do Item**: Informações detalhadas sobre cada item
- **Adicionar Item**: Formulário para cadastrar novos itens
- **Perfil do Usuário**: Visualização e gerenciamento de dados do usuário

## Requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI
- Um dispositivo Android ou emulador

## Instalação

1. Clone este repositório:
\`\`\`bash
git clone https://github.com/AntonioELP/eco-troca-app
cd eco-troca-app
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

3. Instale as dependências específicas:
\`\`\`bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage @rneui/themed
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
\`\`\`

## Executando o Aplicativo

1. Inicie o servidor de desenvolvimento:
\`\`\`bash
npx expo start
\`\`\`

2. Escaneie o QR code com o aplicativo Expo Go no seu dispositivo Android ou pressione 'a' no terminal para abrir no emulador Android.

## Estrutura do Projeto

- **App.js**: Arquivo principal com a configuração de navegação
- **screens/**: Pasta contendo todas as telas do aplicativo
  - **LoginScreen.js**: Tela de login e cadastro
  - **HomeScreen.js**: Tela inicial com lista de itens
  - **ItemDetailsScreen.js**: Tela de detalhes do item
  - **AddItemScreen.js**: Tela para adicionar novos itens
  - **ProfileScreen.js**: Tela de perfil do usuário
- **data.js**: Arquivo com dados mockados para demonstração

## Tecnologias Utilizadas

- React Native
- Expo
- React Navigation
- AsyncStorage para armazenamento local
- Componentes funcionais e hooks

## Observações

- Este aplicativo utiliza AsyncStorage para simular um banco de dados local
- Não há backend real, todos os dados são armazenados localmente
- O aplicativo foi desenvolvido para fins educacionais e de demonstração

## Autor

- Lúcio Flávio Marques Santos
- Kevin Santana de Freitas
- Gidnilson Paulo Brandão dos Santos
- Antonio Emilio Lima Pereira

## Licença

MIT
