# Explorador de Países Personalizado por Interesses

## Descrição do Projeto

Este é um sistema web completo que permite aos usuários encontrar países ideais para viagem baseado em suas preferências pessoais. O sistema utiliza a REST Countries API para obter dados atualizados sobre países do mundo todo e implementa um algoritmo de recomendação inteligente.

## Funcionalidades Principais

### 🌍 Formulário de Estilo de Viagem
- **Preferência de clima**: Frio, calor ou ambos
- **Ambiente**: Natureza, cidade grande ou ambos
- **Orçamento**: Baixo, médio ou alto
- **Idioma**: Campo livre para especificar idiomas preferidos
- **Interesses**: Praia, montanha, história ou todos

### 📊 Interface de Exibição de Resultados
- Cards visuais com informações detalhadas de cada país
- Bandeira, capital, população, idiomas e sub-região
- Design responsivo e moderno
- Badges coloridos para identificar regiões

### 🔧 Filtros Manuais Avançados
- Filtro por idioma específico
- Filtro por população mínima e máxima
- Filtro por continente
- Botões para aplicar e limpar filtros

### 🎒 Sistema de Favoritos ("Minha Mochila")
- Salvar países de interesse
- Contador de países salvos
- Visualização dedicada dos favoritos
- Persistência local usando localStorage
- Funcionalidade de remover países da mochila

### 🌙 Modo Dark/Light
- Toggle entre tema claro e escuro
- Persistência da preferência do usuário
- Indicadores visuais dinâmicos
- Design adaptado para ambos os modos

## Tecnologias Utilizadas

- **Frontend**: HTML, CSS, JavaScript
- **API**: REST Countries API v3.1
- **Armazenamento**: localStorage para favoritos e preferências
- **Design**: CSS Grid, Flexbox, Gradientes, Animações CSS

## Estrutura do Projeto

```
country_recommender/
├── index.html          # Página principal
├── css/
│   └── style.css      # Estilos principais
└── js/
    └── script.js      # Lógica da aplicação
```

## Como Usar

1. **Abra o arquivo `index.html` em um navegador web**
2. **Preencha o formulário** com suas preferências de viagem
3. **Clique em "Buscar Países"** para ver as recomendações
4. **Use os filtros manuais** para refinar os resultados
5. **Salve países interessantes** na sua mochila
6. **Alterne entre modo claro/escuro** conforme preferir


## Funcionalidades Extras Implementadas

✅ **Modo Dark/Light** com toggle visual e persistência
✅ **Filtros manuais** por idioma, população e continente  
✅ **Sistema de favoritos** com contador e persistência
✅ **Validação de formulário** com campos obrigatórios
✅ **Feedback visual** com alertas e estados hover

## API Utilizada

**REST Countries API v3.1**
- Endpoint: `https://restcountries.com/v3.1/all`
- Campos utilizados: name, flags, capital, population, languages, region, subregion
- Documentação: https://restcountries.com/

