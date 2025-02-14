# Sistema de Gerenciamento de Estoque

Um sistema web moderno para gerenciamento de estoque, desenvolvido com PHP, JavaScript e MySQL.

## 🚀 Funcionalidades

- Adicionar, editar e remover peças
- Busca em tempo real
- Interface responsiva
- Paginação automática
- Validação de dados em tempo real
- Prevenção de duplicidade de códigos
- Design moderno e intuitivo

## 💻 Tecnologias Utilizadas

- Frontend:
  - HTML5
  - CSS3 (com Flexbox e Grid)
  - JavaScript (ES6+)
  - Font Awesome Icons
  - Google Fonts (Poppins)

- Backend:
  - PHP 7+
  - MySQL/MariaDB
  - PDO para conexão segura com banco de dados

## 📋 Pré-requisitos

- XAMPP (ou similar com PHP 7+ e MySQL)
- Navegador web moderno
- Conexão com internet (para CDN de fontes e ícones)

## 🔧 Instalação

1. Clone o repositório para a pasta htdocs do XAMPP:
```bash
cd c:/xampp/htdocs
git clone [url-do-repositorio] estoque
```

2. Importe o banco de dados:
```sql
CREATE DATABASE estoque;
USE estoque;

CREATE TABLE pecas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE,
    nome VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    localizacao VARCHAR(100),
    dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

3. Configure a conexão com o banco em `/php/config.php`

## 🌟 Características

- Design responsivo para mobile e desktop
- Animações suaves para melhor experiência do usuário
- Validação em tempo real de entradas
- Feedback visual para ações do usuário
- Proteção contra submissões duplicadas
- Pesquisa dinâmica sem reload da página

## 📱 Responsividade

- Desktop: Layout completo com todas as funcionalidades
- Tablet: Layout adaptativo com reorganização de elementos
- Mobile: Interface otimizada para toque com cards verticais

## 🛠️ Estrutura do Projeto

```
estoque/
├── css/
│   └── styles.css
├── javascript/
│   └── script.js
├── php/
│   ├── api.php
│   └── config.php
├── index.html
└── README.md
```

## 🔒 Segurança

- Validação de dados no cliente e servidor
- Prevenção contra SQL Injection usando PDO
- Escape de HTML para prevenir XSS
- Validação de tipos de dados
- Tratamento de erros consistente

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## ✨ Próximas Atualizações

- [ ] Exportação para Excel/PDF
- [ ] Modo escuro
- [ ] Histórico de alterações
- [ ] Sistema de usuários e permissões
- [ ] Dashboard com estatísticas

## 📞 Suporte

Para suporte, envie um email para [seu-email] ou abra uma issue no repositório.
