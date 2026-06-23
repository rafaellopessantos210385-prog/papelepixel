/* ============================================================
   app.js — Papel & Pixel | Lógica da Aplicação Corrigida e Otimizada
   Organização: estado global → UI helpers → módulos funcionais
   ============================================================ */

/* ============================================================
   MÓDULO 1 — ESTADO GLOBAL DA APLICAÇÃO
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
let interacoesCurtasContador = 0;
let atendimentoEncerrado    = false;
let admAutenticado          = false;

/* ============================================================
   MÓDULO 2 — INICIALIZAÇÃO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    atualizarPrecoLiveSystem();

    const chatInput = document.getElementById('chat-input-text');
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') dispararMensagemChat();
        });
    }
});

/* ============================================================
   MÓDULO 3 — NAVEGAÇÃO & ROLAGEM
   ============================================================ */
function toggleFooterContact(event) {
    event.preventDefault();
    const contactBox = document.getElementById('footer-contact-box');
    contactBox.style.display = 'block';
    contactBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ============================================================
   MÓDULO 4 — PAINEL ADMINISTRATIVO
   ============================================================ */
function toggleAdminPanel(event) {
    event.preventDefault();
    const adminBox = document.getElementById('sys-admin-panel');

    if (adminBox.style.display === 'block') {
        adminBox.style.display = 'none';
        return;
    }

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

function salvarNovosValoresAdmin() {
    tabelaPrecos.abnt         = parseFloat(document.getElementById('adm-val-abnt').value)     || 0;
    tabelaPrecos.adm          = parseFloat(document.getElementById('adm-val-adm').value)      || 0;
    tabelaPrecos.inovacao     = parseFloat(document.getElementById('adm-val-inovacao').value) || 0;
    tabelaPrecos.pbPerPage    = parseFloat(document.getElementById('adm-val-pb').value)       || 0;
    tabelaPrecos.colorPerPage = parseFloat(document.getElementById('adm-val-color').value)    || 0;
    tabelaPrecos.delivery     = parseFloat(document.getElementById('adm-val-delivery').value) || 0;

    alert('Tabela de novos valores gravada com sucesso! Fechando painel operacional...');
    document.getElementById('sys-admin-panel').style.display = 'none';
    atualizarPrecoLiveSystem();
}

/* ============================================================
   MÓDULO 5 — MOTOR DE ORÇAMENTO
   ============================================================ */
function selectServiceCard(serviceType, event) {
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('selected');
    });

    const cardSelecionado = event.currentTarget;
    cardSelecionado.classList.add('selected');
    cardSelecionado.querySelector('input[type="radio"]').checked = true;

    atualizarPrecoLiveSystem();
}

function atualizarPrecoLiveSystem() {
    const radioSelecionado = document.querySelector('input[name="srv-radio-group"]:checked');
    if (!radioSelecionado) return;

    let total = 0;
    const servicoValor = radioSelecionado.value;
    if      (servicoValor === 'lanhouse_base')   total = 10.00;
    else if (servicoValor === 'adm_juridico')    total = tabelaPrecos.adm;
    else if (servicoValor === 'academico_abnt')  total = tabelaPrecos.abnt;
    else if (servicoValor === 'inovacao_radical') total = tabelaPrecos.inovacao;

    const tipoImpressao = document.getElementById('addon-print-type').value;
    const qtdPaginas    = parseInt(document.getElementById('addon-pages-qty').value) || 0;

    if      (tipoImpressao === 'pb')    total += qtdPaginas * tabelaPrecos.pbPerPage;
    else if (tipoImpressao === 'color') total += qtdPaginas * tabelaPrecos.colorPerPage;

    const modalidadeLogistica = document.getElementById('delivery-method').value;
    if (modalidadeLogistica === 'delivery') total += tabelaPrecos.delivery;

    const alertaComercial = document.getElementById('comercial-shortcut');
    if (alertaComercial) {
        alertaComercial.style.display = qtdPaginas > 150 ? 'flex' : 'none';
    }

    document.getElementById('system-live-total').innerText =
        `R$ ${total.toFixed(2).replace('.', ',')}`;
}

/* ============================================================
   MÓDULO 6 — CHATBOT (P&P_Chat)
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
   MÓDULO 7 — FORMULÁRIOS DE ENVIO, DOWNLOAD TXT & RESET COMPLETO
   ============================================================ */

/**
 * Função utilitária para gerar e baixar arquivos TXT dinamicamente no cliente
 */
function downloadTxtFile(filename, textContent) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textContent));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * executarOrdemSalvarTxt()
 * Processa o orçamento, gera o arquivo manifesto TXT e limpa a tela de imediato.
 */
function executarOrdemSalvarTxt(event) {
    event.preventDefault();
    
    const nome    = document.getElementById('c-name').value;
    const email   = document.getElementById('c-email').value;
    const whatsapp = document.getElementById('c-whatsapp').value;
    const total   = document.getElementById('system-live-total').innerText;
    
    const fileInput = document.getElementById('c-file');
    const nomeArquivo = fileInput && fileInput.files.length > 0 ? fileInput.files[0].name : 'Nenhum arquivo detectado';
    
    const radioSelecionado = document.querySelector('input[name="srv-radio-group"]:checked');
    const servicoNome = radioSelecionado ? radioSelecionado.parentNode.querySelector('h3').innerText : 'Não selecionado';
    
    const tipoImpressao = document.getElementById('addon-print-type').value;
    const qtdPaginas    = document.getElementById('addon-pages-qty').value;
    const modalidadeLogistica = document.getElementById('delivery-method').value;

    // Montando a estrutura do documento TXT de Orçamento
    const txtContent = `==================================================
PAPEL & PIXEL - COMPROVANTE DE SOLICITAÇÃO DE ORÇAMENTO
==================================================
Data/Hora da Emissão: ${new Date().toLocaleString('pt-BR')}
--------------------------------------------------
DADOS DO CLIENTE:
Nome Completo: ${nome}
E-mail Corporativo: ${email}
WhatsApp: ${whatsapp}
--------------------------------------------------
DETALHES DO TRABALHO:
Serviço Principal: ${servicoNome}
Arquivo Enviado: ${nomeArquivo}
Adicional de Impressões: ${qtdPaginas} páginas (${tipoImpressao.toUpperCase()})
Logística Escolhida: ${modalidadeLogistica === 'delivery' ? 'Motoboy Parceiro' : 'Nuvem (Digital)'}
--------------------------------------------------
VALOR TOTAL CONSOLIDADO: ${total}
--------------------------------------------------
© 2026 Papel & Pixel - Dark Office Técnico.
==================================================`;

    // Baixa o documento TXT automaticamente
    downloadTxtFile(`orcamento_${nome.toLowerCase().replace(/\s+/g, '_')}.txt`, txtContent);
    
    alert(`Orçamento de ${nome} processado com sucesso! O arquivo TXT de comprovação foi gerado.\nA tela será zerada automaticamente.`);
    
    // Limpeza mandatória da área de trabalho
    reiniciarSistema();
}

/**
 * gravarContatoAdminTxt()
 * Processa a mensagem direta, gera o TXT de protocolo administrativo e fecha/limpa a área.
 */
function gravarContatoAdminTxt(event) {
    event.preventDefault();
    
    const nome = document.getElementById('fc-admin-name').value;
    const msg  = document.getElementById('fc-admin-msg').value;
    
    // Montando a estrutura do documento TXT de Mensagem Direta
    const txtContent = `==================================================
PAPEL & PIXEL - PROTOCOLO DE TRANSMISSÃO ADMINISTRATIVA
==================================================
Data/Hora de Envio: ${new Date().toLocaleString('pt-BR')}
--------------------------------------------------
DADOS DO EMISSOR:
Nome Identificado: ${nome}
--------------------------------------------------
CONTEÚDO DA MENSAGEM TRANSMITIDA:
"${msg}"
--------------------------------------------------
Status do Protocolo: Enviado com sucesso ao terminal ADM.
--------------------------------------------------
© 2026 Papel & Pixel - Dark Office Técnico.
==================================================`;

    // Baixa o documento TXT administrativo automaticamente
    downloadTxtFile(`contato_adm_${nome.toLowerCase().replace(/\s+/g, '_')}.txt`, txtContent);
    
    alert(`Mensagem enviada com sucesso! O arquivo TXT de protocolo foi gerado e baixado.`);
    
    // Reseta o formulário de contato do rodapé e o esconde
    const formContato = event.target;
    formContato.reset();
    document.getElementById('footer-contact-box').style.display = 'none';
}

/**
 * reiniciarSistema()
 * Reseta completamente a aplicação, limpando formulários, seletores dinâmicos e o chatbot.
 */
function reiniciarSistema() {
    // 1. Reseta os campos nativos do formulário principal
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

    // 4. Força o recálculo do motor para resetar o display de preço ao valor inicial base
    atualizarPrecoLiveSystem();
    console.log("Área limpa e redefinida com sucesso.");
}
