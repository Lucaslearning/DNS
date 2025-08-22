# LIVTI DNS - Gerenciador de Links DDNS

Sistema de gerenciamento de links DDNS para equipamentos de rede desenvolvido pela LIVTI Tecnologia.

## 🚀 Sobre o Projeto

O LIVTI DNS é uma ferramenta web moderna e intuitiva para gerenciar links DDNS de clientes, permitindo acesso rápido e organizado a equipamentos de rede como Fortigate, MikroTik, pfSense e Unifi.

### ✨ Funcionalidades

- **Gerenciamento de Clientes**: Adicionar, editar e excluir clientes
- **Links DDNS**: Acesso direto aos equipamentos através de links clicáveis
- **Suporte Multi-Equipamentos**: Fortigate, MikroTik, pfSense, Unifi
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- **Design Moderno**: Interface limpa com as cores da LIVTI Tecnologia

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React para produção
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de interface modernos
- **Lucide React** - Ícones SVG otimizados

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn
- Git

## 🚀 Instalação e Execução

### 1. Clone o repositório
\`\`\`bash
git clone https://github.com/seu-usuario/livti-dns.git
cd livti-dns
\`\`\`

### 2. Instale as dependências
\`\`\`bash
npm install
\`\`\`

### 3. Execute em modo desenvolvimento
\`\`\`bash
npm run dev
\`\`\`

### 4. Acesse no navegador
\`\`\`
http://localhost:3000
\`\`\`

## 📦 Build para Produção

\`\`\`bash
# Gerar build otimizado
npm run build

# Executar em produção
npm start
\`\`\`

## 🌐 Deploy

O projeto está configurado para deploy automático no Vercel:

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente (se necessário)
3. Deploy automático a cada push na branch main

**URL de Produção**: [dns-beta.vercel.app](https://dns-beta.vercel.app)

## 📱 Como Usar

1. **Adicionar Cliente**: Clique em "Adicionar Cliente" e preencha os dados
2. **Acessar Equipamento**: Clique no link DDNS para abrir em nova aba
3. **Editar Cliente**: Use o botão de edição para modificar informações
4. **Excluir Cliente**: Confirme a exclusão no modal de confirmação

## 🎨 Identidade Visual

O projeto utiliza as cores oficiais da LIVTI Tecnologia:
- **Primária**: Laranja (#f97316)
- **Secundária**: Branco (#ffffff)
- **Tipografia**: Poppins (títulos) e Inter (texto)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da LIVTI Tecnologia. Todos os direitos reservados.

## 📞 Contato

**LIVTI Tecnologia**
- Website: [livti.com.br](https://livti.com.br)
- Email: contato@livti.com.br

## 🔄 Versionamento

- **v1.0.0** - Versão inicial com funcionalidades básicas de CRUD
- **v1.1.0** - Melhorias na interface e responsividade
- **v1.2.0** - Modal nativo de confirmação e otimizações

---

Desenvolvido com ❤️ pela equipe LIVTI Tecnologia
