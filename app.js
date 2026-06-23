/* ============================================================
   app.js — Papel & Pixel | Lógica da Aplicação
   Organização: estado global → UI helpers → módulos funcionais
   ============================================================ */


/* ============================================================
   MÓDULO 1 — ESTADO GLOBAL DA APLICAÇÃO
   Objeto centralizado com os preços editáveis pelo administrador.
   É atualizado via painel ADM e consultado pelo motor de cálculo.
   ============================================================ */
const tabelaPrecos = {
    abnt:         120.00,  // Formatação Acadêmica ABNT
    adm:           55.00,  // Serviços Adm & Jurídico
    inovacao:      85.00,  // Inovação Radical (QR Code / Blockchain)
    pbPerPage:      0.50,  // Impressão Preto & Branco por página
    colorPerPage:   1.50,  // Impressão Colorida por página
    delivery:      15.00,  // Taxa de entrega por motoboy
};

/* Flags de estado de sessão */
let interacoesCurtasContador = 0; // Conta respostas curtas consecutivas no chat
let atendimentoEncerrado    = false; // Bloqueia novas mensagens após encerramento
let admAutenticado          = false; // Controla se o administrador já fez login nesta sessão


/* ============================================================
   MÓDULO 2 — INICIALIZAÇÃO
   Executa ao carregar a página: define preço inicial e vincula
   o Enter do chat ao botão de envio.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Calcula o preço do serviço selecionado por padrão
    atualizarPrecoLiveSystem();

    // Permite enviar mensagem no chat com a tecla Enter
    const chatInput = document.getElementById('chat-input-text');
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') dispararMensagemChat();
        });
    }
});


/* ============================================================
   MÓDULO 3 — NAVEGAÇÃO & ROLAGEM
   Controla links especiais da nav que abrem painéis ou rolam a página.
   ============================================================ */

/**
 * toggleFooterContact()
 * Exibe o formulário de contato no rodapé e rola suavemente até ele.
 * Disparado pelo link "Contato" na nav e no footer.
 *
 * @param {Event} event - Evento de clique (prevenido para não mudar URL)
 */
function toggleFooterContact(event) {
    event.preventDefault();
    const contactBox = document.getElementById('footer-contact-box');
    contactBox.style.display = 'block';
    contactBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


/* ============================================================
   MÓDULO 4 — PAINEL ADMINISTRATIVO
   Gerencia autenticação e edição da tabela de preços pelo proprietário.
   ============================================================ */

/**
 * toggleAdminPanel()
 * Intercepta o clique no link "Painel ADM" da nav.
 * Se não autenticado, solicita login e senha via prompt nativo.
 * Após autenticação bem-sucedida, exibe o terminal de gerência.
 *
 * Credenciais padrão: login = "admpp01" | senha = "admpp01"
 *
 * @param {Event} event - Evento de clique (prevenido para não navegar)
 */
function toggleAdminPanel(event) {
    event.preventDefault();
    const adminBox = document.getElementById('sys-admin-panel');

    // Se o painel já está visível, fecha ao clicar novamente
    if (adminBox.style.display === 'block') {
        adminBox.style.display = 'none';
        return;
    }

    // Exige autenticação caso ainda não tenha sido feita nesta sessão
    if (!admAutenticado) {
        const promptLogin = prompt('ÁREA RESTRITA — Digite o Login Administrativo:');
        const promptSenha = prompt('ÁREA RESTRITA — Digite a Senha Administrativa:');

        if (promptLogin === 'admpp01' && promptSenha === 'admpp01') {
            admAutenticado = true;
            alert('Autenticação bem-sucedida! Terminal liberado, proprietário.');
        } else {
            alert('Acesso Negado! Credenciais inválidas para o Painel Administrativo.');
            return;
        }
    }

    adminBox.style.display = 'block';
    adminBox.scrollIntoView({ behavior: 'smooth' });
}

/**
 * salvarNovosValoresAdmin()
 * Lê os valores dos inputs do painel ADM, aplica ao objeto tabelaPrecos
 * e força o recálculo do orçamento visível ao cliente.
 * Fecha o painel automaticamente após salvar (segurança física).
 */
function salvarNovosValoresAdmin() {
    tabelaPrecos.abnt         = parseFloat(document.getElementById('adm-val-abnt').value)     || 0;
    tabelaPrecos.adm          = parseFloat(document.getElementById('adm-val-adm').value)      || 0;
    tabelaPrecos.inovacao     = parseFloat(document.getElementById('adm-val-inovacao').value) || 0;
    tabelaPrecos.pbPerPage    = parseFloat(document.getElementById('adm-val-pb').value)       || 0;
    tabelaPrecos.colorPerPage = parseFloat(document.getElementById('adm-val-color').value)    || 0;
    tabelaPrecos.delivery     = parseFloat(document.getElementById('adm-val-delivery').value) || 0;

    alert('Tabela de novos valores gravada com sucesso! Fechando painel operacional...');
    document.getElementById('sys-admin-panel').style.display = 'none';

    // Atualiza imediatamente o preço exibido ao cliente com os novos valores
    atualizarPrecoLiveSystem();
}


/* ============================================================
   MÓDULO 5 — MOTOR DE ORÇAMENTO
   Calcula o preço total em tempo real conforme as seleções do formulário.
   Equação: Ptotal = Ψservico + Σ(Qpag × Ktipo) + Λlogistica
   ============================================================ */

/**
 * selectServiceCard()
 * Gerencia a seleção visual dos cards de serviço.
 * Remove a classe "selected" de todos e aplica no card clicado.
 * Marca o radio button correspondente e aciona o recálculo.
 *
 * @param {string} serviceType - Valor do serviço (ex: "academico_abnt")
 * @param {Event}  event       - Evento do clique para acessar o currentTarget
 */
function selectServiceCard(serviceType, event) {
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('selected');
    });

    const cardSelecionado = event.currentTarget;
    cardSelecionado.classList.add('selected');
    cardSelecionado.querySelector('input[type="radio"]').checked = true;

    atualizarPrecoLiveSystem();
}

/**
 * atualizarPrecoLiveSystem()
 * Motor reativo de precificação — disparado a cada interação no formulário.
 */
function atualizarPrecoLiveSystem() {
    const radioSelecionado = document.querySelector('input[name="srv-radio-group"]:checked');
    if (!radioSelecionado) return;

    let total = 0;

    // Passo 1 — Taxa base do serviço (Ψservico)
    const servicoValor = radioSelecionado.value;
    if      (servicoValor === 'lanhouse_base')   total = 10.00;
    else if (servicoValor === 'adm_juridico')    total = tabelaPrecos.adm;
    else if (servicoValor === 'academico_abnt')  total = tabelaPrecos.abnt;
    else if (servicoValor === 'inovacao_radical') total = tabelaPrecos.inovacao;

    // Passo 2 — Adicional de impressões: Qpag × Ktipo
    const tipoImpressao = document.getElementById('addon-print-type').value;
    const qtdPaginas    = parseInt(document.getElementById('addon-pages-qty').value) || 0;

    if      (tipoImpressao === 'pb')    total += qtdPaginas * tabelaPrecos.pbPerPage;
    else if (tipoImpressao === 'color') total += qtdPaginas * tabelaPrecos.colorPerPage;

    // Passo 3 — Taxa de entrega física (Λlogistica)
    const modalidadeLogistica = document.getElementById('delivery-method').value;
    if (modalidadeLogistica === 'delivery') total += tabelaPrecos.delivery;

    // Passo 4 — Alerta de volume alto (>150 páginas → redireciona ao comercial)
    const alertaComercial = document.getElementById('comercial-shortcut');
    alertaComercial.style.display = qtdPaginas > 150 ? 'flex' : 'none';

    // Passo 5 — Exibe o total formatado no padrão monetário brasileiro
    document.getElementById('system-live-total').innerText =
        `R$ ${total.toFixed(2).replace('.', ',')}`;
}


/* ============================================================
   MÓDULO 6 — CHATBOT (P&P_Chat)
   Atendimento automatizado de primeiro nível via análise de texto.
   ============================================================ */

function dispararMensagemChat() {
    if (atendimentoEncerrado) {
        alert('Atendimento concluído. Para nova consulta, recarregue a página.');
        return;
    }

    const inputField = document.getElementById('chat-input-text');
    const textoOriginal = inputField.value.trim();
    const textoLower    = textoOriginal.toLowerCase();

    if (!textoOriginal) return;

    inserirMensagemUI('user', textoOriginal);
    inputField.value = '';

    const ehCurta = textoOriginal.length <= 3 || ['oi', 'sim', 'nao', 'não'].includes(textoLower);
    interacoesCurtasContador = ehCurta ? interacoesCurtasContador + 1 : 0;

    setTimeout(() => {
        const querEncerrar = textoLower.includes('tchau') || textoLower.includes('obrigado');
        if (interacoesCurtasContador >= 2 || querEncerrar) {
            inserirMensagemUI('bot', '<strong>[P&P_Chat]:</strong> Teria mais alguma dúvida?');
            const negacao = textoLower.includes('nao') || textoLower.includes('não');
            if (negacao || querEncerrar) {
                atendimentoEncerrado = true;
                document.getElementById('chat-status-indicator').innerText = '○ CONCLUÍDO';
                inserirMensagemUI('bot', '<strong>[P&P_Chat]:</strong> Atendimento encerrado. Volte sempre!');
            }
            return;
        }

        const pedidoImpressao = textoLower.includes('impress') || textoLower.includes('copia') || textoLower.includes('imprimir');

        if (pedidoImpressao) {
            const temTipo      = textoLower.includes('preto') || textoLower.includes('branco') || textoLower.includes('color');
            const temQuantidade = /\d+/.test(textoLower);

            if (temTipo && temQuantidade) {
                const qtdDetectada = textoLower.match(/\d+/)[0];
                const tipoDetectado = textoLower.includes('color') ? 'color' : 'pb';
                const labelTipo = tipoDetectado === 'color' ? 'Colorida' : 'P&B';

                document.getElementById('addon-print-type').value    = tipoDetectado;
                document.getElementById('addon-pages-qty').value     = qtdDetectada;
                atualizarPrecoLiveSystem();

                inserirMensagemUI('bot',
                    `<strong>[P&P_Chat]:</strong> Pedido registrado! <strong>${qtdDetectada} pág. ${labelTipo}</strong>. Orçamento updated.`
                );
            } else {
                inserirMensagemUI('bot', `
                    <strong>[P&P_Chat]:</strong> Para orçar suas impressões, preciso do tipo (P&B ou Colorida) e da quantidade de páginas.
                    Como não identifiquei esses dados, vou te transferir ao nosso Comercial:<br><br>
                    <a href="https://wa.me/5586988303158?text=Olá,%20preciso%20de%20um%20orçamento%20de%20impressões."
                       target="_blank"
                       style="color:var(--neon-green);font-weight:bold;font-family:'Orbitron',sans-serif;
                              text-transform:uppercase;text-decoration:none;border:1px solid var(--neon-green);
                              padding:5px 10px;display:inline-block;border-radius:4px;">
                        WhatsApp Comercial
                    </a>
                `);
            }
            return;
        }

        if (textoLower.includes('abnt')) {
            inserirMensagemUI('bot',
                `<strong>[P&P_Chat]:</strong> Formatação Acadêmica ABNT: <strong>R$ ${tabelaPrecos.abnt.toFixed(2).replace('.', ',')}</strong>.`
            );
            return;
        }

        inserirMensagemUI('bot',
            '<strong>[P&P_Chat]:</strong> Sou especializado em ABNT, Contratos e Impressões. Para outras dúvidas, acesse nosso Comercial.'
        );

    }, 400);
}

function inserirMensagemUI(role, texto) {
    const container  = document.getElementById('chat-messages-container');
    const msgEl      = document.createElement('div');
    msgEl.className  = `chat-msg ${role}`;
    msgEl.innerHTML  = texto;
    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;
}


/* ============================================================
   MÓDULO 7 — FORMULÁRIOS DE ENVIO & REINICIALIZAÇÃO (CORRIGIDO)
   ============================================================ */

/**
 * executarOrdemSalvarTxt()
 * Captura o envio do formulário, incluindo o metadado do arquivo selecionado.
 */
function executarOrdemSalvarTxt(event) {
    event.preventDefault();
    const nome    = document.getElementById('c-name').value;
    const email   = document.getElementById('c-email').value;
    const total   = document.getElementById('system-live-total').innerText;
    
    // Captura corrigida e validada do arquivo anexado
    const fileInput = document.getElementById('c-file');
    const nomeArquivo = fileInput && fileInput.files.length > 0 ? fileInput.files[0].name : 'Nenhum arquivo detectado';
    
    alert(`Ordem de ${nome} (${email}) registrada com sucesso!\nArquivo Enviado: ${nomeArquivo}\nValor: ${total}`);
    
    if (confirm("Orçamento concluído com sucesso! Deseja limpar a página para iniciar um novo trabalho?")) {
        reiniciarSistema();
    }
}

/**
 * reiniciarSistema()
 * Reseta o formulário principal, redefine as seleções visuais padrão,
 * limpa as flags do chatbot e restaura o estado limpo inicial da página.
 */
function reiniciarSistema() {
    // 1. Reseta os campos nativos do formulário
    const formOrdem = document.getElementById('order-form-system');
    if (formOrdem) formOrdem.reset();

    // 2. Reseta a seleção visual dos cartões de serviço (Volta para Lanhouse Base)
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const cardPadrao = document.querySelector(".service-card[onclick*='lanhouse_base']");
    if (cardPadrao) {
        cardPadrao.classList.add('selected');
        const radioInterno = cardPadrao.querySelector('input[type="radio"]');
        if (radioInterno) radioInterno.checked = true;
    }

    // 3. Reseta o estado e histórico do Chatbot
    interacoesCurtasContador = 0;
    atendimentoEncerrado    = false;
    
    const indicadorStatus = document.getElementById('chat-status-indicator');
    if (indicadorStatus) indicadorStatus.innerText = '● OPERACIONAL';

    const containerMensagens = document.getElementById('chat-messages-container');
    if (containerMensagens) {
        containerMensagens.innerHTML = `
            <div class="chat-msg bot">
                Olá! Eu sou o <strong>P&amp;P_Chat</strong>. Posso lhe dar suporte sobre
                formatação e soluções digitais.<br><br>
                Se precisar de <strong>impressões adicionais</strong>, fale o tipo
                (Preto e Branco ou Colorida) e a quantidade de páginas.
                Caso não saiba a quantidade, me avise para eu lhe transferir ao Comercial!
            </div>
        `;
    }

    // 4. Força o recálculo do motor para resetar o display de preço
    atualizarPrecoLiveSystem();
    console.log("Sistema reiniciado e pronto para um novo ciclo de trabalho.");
}

function gravarContatoAdminTxt(event) {
    event.preventDefault();
    const nome = document.getElementById('fc-admin-name').value;
    alert(`Mensagem de "${nome}" transmitida com sucesso à administração!`);
}
