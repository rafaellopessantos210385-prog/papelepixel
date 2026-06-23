# papelepixel
📑 Papel & Pixel — Hub de Soluções Documentais e Digitais

Ano de Vigência: 2026
Modelo de Operação: Dark Office Técnico Automatizado
Direitos de Propriedade: © 2026 Papel & Pixel — Todos os direitos reservados.
Desenvolvimento e Criação: Rafael Lopes, Wildson Ribeiro e Beatriz Silva.

🚀 Visão Geral do Ecossistema
A Papel & Pixel é uma plataforma monolítica de front-end reativo projetada para intermediar a transição entre as demandas por documentações físicas e a agilidade do ambiente digital na nuvem.
Diferente do modelo tradicional de lanhouses físicas, a empresa opera através do conceito de Dark Office, centralizando a produção técnica em ambiente interno e realizando a entrega dos serviços por meios digitais ou através de parceiros logísticos.

O sistema foi desenvolvido para fornecer:
•	Orçamentos instantâneos;
•	Gestão de serviços acadêmicos;
•	Serviços administrativos e jurídicos;
•	Controle de impressão física;
•	Atendimento automatizado via chatbot;
•	Painel administrativo de gerenciamento de preços.

🏗️ Estrutura do Projeto
papel-pixel/
│
├── index.html      # Estrutura principal da aplicação
├── style.css       # Interface visual e responsividade
├── app.js          # Regras de negócio e interatividade
└── README.md       # Documentação do projeto

🛠️ Tecnologias Aplicadas
HTML5
Responsável pela estrutura semântica da aplicação.
Principais elementos utilizados:
•	Header
•	Navigation
•	Sections
•	Forms
•	Footer
Benefícios:
•	Melhor SEO
•	Acessibilidade
•	Organização estrutural

CSS3
Responsável pela identidade visual Cyberpunk High-Contrast.
Recursos utilizados:
•	CSS Variables
•	CSS Grid
•	Flexbox
•	Media Queries
•	Box Shadows
•	Gradientes
Benefícios:
•	Layout responsivo
•	Fácil manutenção
•	Escalabilidade visual

JavaScript ES6+
Responsável por toda a lógica operacional.
Funcionalidades:
•	Motor de orçamento
•	Chatbot automatizado
•	Painel administrativo
•	Atualização dinâmica da interface
•	Controle de sessão
Benefícios:
•	Sem dependência de frameworks
•	Alto desempenho
•	Baixo consumo de recursos

🎨 Identidade Visual
A plataforma utiliza uma estética tecnológica baseada em:
•	Neon Blue (#00f0ff)
•	Neon Purple (#9d00ff)
•	Neon Green (#39ff14)
•	Neon Red (#ff003c)
Fontes:
•	Orbitron (Títulos)
•	Inter (Corpo do Texto)
Bibliotecas Externas:
•	Google Fonts
•	Font Awesome 6

🧩 Módulos da Aplicação
1. Header Inteligente
Contém:
•	Logo interativa
•	Menu de navegação
•	Indicador de status do chatbot
Funções:
•	Rolagem suave para o topo
•	Navegação entre seções
•	Acesso ao painel administrativo

2. Hero Section
Apresenta:
•	Proposta de valor da empresa
•	Conceito Dark Office
•	Serviços digitais e documentais
Objetivo:
Converter visitantes em clientes.

3. Sobre o Core
Apresenta os pilares da empresa:
Dark Office Eficiente
Operação descentralizada e enxuta.
Conformidade Estrita
Serviços compatíveis com normas técnicas e ABNT.
Infraestrutura Híbrida
Integração entre digital e físico.

4. Painel Administrativo
Área restrita para gerenciamento de preços.
Funções:
•	Atualizar preço ABNT
•	Atualizar preço Jurídico
•	Atualizar preço Inovação
•	Atualizar impressão P&B
•	Atualizar impressão colorida
•	Atualizar taxa de entrega
Credenciais padrão:
Login: admpp01
Senha: admpp01
⚠️ Recomenda-se substituir por autenticação segura em produção.

5. Motor de Orçamento em Tempo Real
Calcula automaticamente:
Preço Total =
Serviço Base
+ Impressões
+ Logística
Fórmula:
Ptotal = Ψservico + Σ(Qpag × Ktipo) + Λlogistica
Recursos:
•	Atualização instantânea
•	Sem recarregar a página
•	Exibição dinâmica do valor final

6. Sistema de Impressões
Permite:
•	Impressão P&B
•	Impressão Colorida
•	Quantidade de páginas variável
Quando:
Páginas > 150
o sistema exibe alerta comercial e sugere atendimento especializado.

7. Chatbot P&P_Chat
Assistente virtual integrado.
Capaz de responder sobre:
•	ABNT
•	Impressões
•	Contratos
•	Serviços digitais
Funcionalidades:
•	Identificação de palavras-chave
•	Extração automática de quantidade de páginas
•	Atualização automática do orçamento
•	Encerramento inteligente de atendimento
Exemplos:
Quero imprimir 50 páginas coloridas
ou
Quanto custa ABNT?

8. Formulário de Ordem de Serviço
Coleta:
•	Nome
•	E-mail
•	WhatsApp
Objetivo:
Registrar solicitações dos clientes.
Atualmente utiliza:
alert()
Como demonstração.
Pontos futuros:
•	Exportação TXT
•	Integração EmailJS
•	Integração WhatsApp
•	Integração Banco de Dados

9. Formulário de Contato Administrativo
Exibido através da função:
toggleFooterContact()
Fluxo:
1.	Usuário clica em Contato
2.	Formulário é exibido
3.	Página rola automaticamente
4.	Usuário envia mensagem

⚙️ Fluxo de Utilização do Sistema
Cliente
Passo 1
Acessar o site.
Passo 2
Selecionar o serviço desejado.
Opções:
•	Lanhouse Base
•	Adm & Jurídico
•	Acadêmico ABNT
•	Inovação Radical
Passo 3
Informar:
•	Tipo de impressão
•	Quantidade de páginas
Passo 4
Escolher:
•	Entrega digital ou
•	Motoboy
Passo 5
Visualizar o orçamento atualizado.
Passo 6
Preencher:
•	Nome
•	E-mail
•	WhatsApp
Passo 7
Enviar a ordem de serviço.

Administrador
Passo 1
Clicar em:
Painel ADM
Passo 2
Realizar autenticação.
Passo 3
Atualizar valores.
Passo 4
Salvar alterações.
Passo 5
Sistema recalcula automaticamente todos os preços.

🔒 Considerações de Segurança
Versão atual:
•	Login via Prompt
•	Sessão em memória
•	Sem banco de dados
Recomendações futuras:
•	JWT
•	Criptografia de senha
•	Backend Node.js
•	Banco PostgreSQL
•	Controle de permissões

📱 Responsividade
Compatível com:
•	Smartphones
•	Tablets
•	Notebooks
•	Monitores widescreen
Breakpoints:
1100px
768px
480px

🚧 Roadmap Futuro
•	Integração WhatsApp API
•	Sistema de Tickets
•	Banco de Dados
•	Área do Cliente
•	Login Multiusuário
•	Dashboard Administrativo
•	Relatórios Financeiros
•	Exportação PDF
•	Integração PIX
•	Integração IA Generativa

📜 Licença
Este projeto é propriedade intelectual da Papel & Pixel.
É proibida a reprodução total ou parcial sem autorização formal dos autores.
© 2026 Papel & Pixel — Todos os direitos reservados.
💻 Equipe de Desenvolvimento
Rafael Lopes
Wildson Ribeiro
Beatriz Silva
Papel & Pixel — Hub de Soluções Documentais e Digitais.
