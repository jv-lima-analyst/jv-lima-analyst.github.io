/* =========================================================
   data.js — TODO o conteúdo do portfólio mora aqui.
   ---------------------------------------------------------
   Quer adicionar um projeto, uma skill ou um certificado?
   Edite SÓ este arquivo. O main.js lê este objeto e monta
   as seções sozinho.

   Por que .js e não .json? Porque assim o site funciona até
   abrindo o index.html com duplo clique (o navegador bloqueia
   fetch() de arquivos locais, mas não bloqueia <script>).
   ========================================================= */

window.PORTFOLIO = {
  perfil: {
    nome: 'João Victor Lima',
    inicioNaArea: 2024,          // usado para calcular "anos com BI"
    dashboardsEntregues: 10,     // TODO: confira esse número
    areasAtendidas: ['Frota', 'Sinistro', 'Estoque', 'RH', 'Movimentação', 'Financeiro'],
    atualizadoEm: 'outubro de 2026',
  },

  // Deixe vazio ('') o que não quiser exibir — o link some sozinho.
  contato: {
    email: 'joao.vsanto23@gmail.com',
    linkedin: '',   // TODO: ex. 'https://www.linkedin.com/in/seu-usuario'
    github: 'https://github.com/jv-lima-analyst',
    telefone: '(92) 98809-6946',  // como aparece escrito no site
    whatsapp: '5592988096946',    // só números, com 55 + DDD (usado no link wa.me)
  },

  /* -------------------------------------------------------
     STACK — item pode ser texto simples ou objeto:
     { nome: 'Docker', estudando: true } mostra a tag "estudando"
     ------------------------------------------------------- */
  skills: [
    {
      grupo: 'BI & Analytics',
      icone: 'grafico',
      descricao: 'Do dado bruto ao painel que a diretoria usa.',
      itens: ['Power BI', 'DAX', 'Power Query (M)', 'Modelagem dimensional', 'Power BI Service', 'Storytelling com dados'],
    },
    {
      grupo: 'Dados & Engenharia',
      icone: 'camadas',
      descricao: 'Bases confiáveis antes de qualquer gráfico.',
      itens: [
        'SQL Server',
        'SQL (consultas e views)',
        'Datamarts',
        'Python',
        { nome: 'Microsoft Fabric', estudando: true },
        { nome: 'Lakehouse & Pipelines', estudando: true },
      ],
    },
    {
      grupo: 'IA & Automação',
      icone: 'ia',
      descricao: 'IA aplicada a problemas reais de dados.',
      itens: ['Chatbots com LLM', 'Engenharia de prompt', 'Integrações via API', 'Automação de processos', 'Claude Code & Cowork', 'Vibe coding'],
    },
    {
      grupo: 'Dev, Cloud & Design',
      icone: 'codigo',
      descricao: 'O que sustenta e dá cara às soluções.',
      itens: [
        'HTML, CSS e JS',
        'Git & GitHub',
        'Figma',
        'Scrum',
        { nome: 'Docker', estudando: true },
        { nome: 'Azure', estudando: true },
      ],
    },
  ],

  /* -------------------------------------------------------
     PROJETOS — copie um bloco, cole no topo e edite.
     status:      'producao' | 'construcao' | 'concluido'
     categorias:  a 1ª define o ícone do card
                  (Power BI, IA, Automação, Fabric, Cloud, Web)
     imagem:      opcional, ex. 'assets/projetos/meu-print.png'
     confidencial: true mostra o aviso de dados protegidos
     links:       demo | codigo | video | artigo | powerbi

     ⚠ Os textos abaixo são RASCUNHOS baseados no currículo.
       Reescreva com as suas palavras e números reais.
     ------------------------------------------------------- */
  projetos: [
    {
      id: 'assistente-metricas',
      titulo: 'Assistente de Métricas',
      resumo: 'Um visual próprio que coloca IA dentro do relatório Power BI para explicar cada métrica, com base no glossário de métricas da empresa.',
      categorias: ['IA', 'Power BI', 'Cloud'],
      status: 'construcao',
      ano: 2026,
      imagem: 'assets/projetos/assistente-metricas.png',
      stack: ['Power BI Custom Visual', 'TypeScript', 'API backend', 'Docker', 'Azure'],
      problema: 'Levar perguntas em linguagem natural para dentro do próprio relatório, sem o usuário precisar sair do Power BI para entender o que uma métrica mede.',
      solucao: 'Visual customizado (pbiviz) que envia a pergunta para um backend próprio. O backend monta o contexto a partir de uma planilha com o glossário de métricas e consulta o modelo de IA. Tudo empacotado em container Docker e publicado no Azure.',
      resultado: 'Em construção: o case completo, com arquitetura e aprendizados, entra aqui em breve.',
      aprendizados: [],
      links: {},
    },
    {
      id: 'assistente-teams',
      titulo: 'Assistente de IA no Teams',
      resumo: 'Assistente no Teams que entende a necessidade do usuário e indica qual dashboard consultar.',
      categorias: ['IA', 'Teams', 'Power BI'],
      status: 'producao',
      ano: 2026,
      imagem: 'assets/projetos/assistente-teams.png',
      stack: ['LLM', 'Engenharia de prompt', 'Microsoft Teams', 'Power BI', 'API'],
      confidencial: true,
      problema: 'Com vários painéis publicados (Frota, Sinistro, Estoque, RH, Movimentação), nem sempre o usuário sabia qual deles respondia à sua dúvida, e acabava pedindo ajuda ao time de BI.',
      solucao: 'Um assistente conversacional no Teams que recebe a pergunta em linguagem natural e, com base na descrição de cada painel, recomenda o dashboard certo com o link direto para abrir.',
      resultado: 'Menos atrito para encontrar informação e mais autonomia para as áreas consultarem os dados sozinhas.',
      aprendizados: [
        'Dar contexto bem estruturado ao modelo importa mais do que buscar o prompt "perfeito".',
      ],
      links: {},
    },
    {
      id: 'monitoramento-atualizacao',
      titulo: 'Monitoramento de Atualização',
      resumo: '33 painéis, zero conferência manual: monitoramento automático da atualização com aprovação em sequência no Teams.',
      categorias: ['Automação', 'Power BI'],
      status: 'producao',
      ano: 2026,
      imagem: 'assets/projetos/monitoramento-atualizacao.png',
      stack: ['Power Automate', 'Power BI Service', 'Microsoft Teams', 'Aprovações'],
      confidencial: true,
      problema: 'Conferir manualmente, todo dia, se cada um dos 33 painéis tinha atualizado corretamente tomava tempo e deixava falhas passarem despercebidas.',
      solucao: 'Fluxo no Power Automate que roda às 12h e às 17h, verifica o status de atualização de cada painel e envia o resultado para aprovação em sequência no Teams: primeiro o validador, depois o gestor.',
      resultado: 'A conferência deixou de ser manual e qualquer falha de atualização chega no Teams com quem precisa agir.',
      aprendizados: [],
      links: {},
    },
    {
      id: 'portfolio',
      titulo: 'Este portfólio',
      resumo: 'O site onde reúno meus projetos e cases de BI, automação e IA, feito do zero com HTML, CSS e JavaScript puros.',
      categorias: ['Web'],
      status: 'producao',
      ano: 2026,
      imagem: 'assets/projetos/portfolio.png',
      stack: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
      problema: 'Queria um lugar para mostrar meu trabalho que fosse rápido, bonito e fácil de manter.',
      solucao: 'Site estático sem frameworks: o HTML é o esqueleto, o data.js guarda o conteúdo e o JavaScript monta as seções. Tema claro/escuro, animações que respeitam acessibilidade e layout responsivo.',
      resultado: 'Adicionar um projeto novo é editar um único arquivo.',
      aprendizados: [
        'Separar dados de apresentação deixa o código mais simples de evoluir.',
        'IntersectionObserver, <dialog> e variáveis CSS resolvem muito sem biblioteca nenhuma.',
      ],
      links: { codigo: 'https://github.com/jv-lima-analyst/jv-lima-analyst.github.io' },
    },
  ],

  experiencia: [
    {
      cargo: 'Assistente de Power BI',
      empresa: 'Reche Galdeano (Reche.co)',
      logo: 'assets/empresas/reche.png', // opcional: some se não existir
      local: 'Manaus, AM',
      periodo: 'Nov 2025 — atual',
      atual: true,
      itens: [
        'Desenvolvo e mantenho dashboards de Frota, Sinistro, Estoque, RH e Movimentação de Veículos, conectados a um datamart em SQL Server.',
        'Criei um chatbot com IA integrado aos painéis que indica qual dashboard consultar conforme a necessidade do usuário.',
        'Automatizo processos e integrações via API entre sistemas internos (Euroit, SharePoint, Navixy).',
        'Prototipo no Figma e proponho novos painéis, apoiando a diretoria na tomada de decisão.',
        'Trabalho com Scrum no setor de Projetos/BI: sprints, tasks e backlog.',
      ],
      stack: ['Power BI', 'SQL Server', 'DAX', 'APIs', 'IA', 'Figma', 'Scrum'],
    },
    {
      cargo: 'Jovem Aprendiz',
      empresa: 'Expresso Coroado',
      logo: 'assets/empresas/expresso-coroado.png',
      local: 'Manaus, AM',
      periodo: '2024 — 2025',
      itens: [
        'Desenvolvi e mantive 5 dashboards em Power BI (financeiro, estoque, motoristas e empresarial). Foi meu primeiro contato profissional com BI.',
      ],
      stack: ['Power BI', 'Power Query', 'DAX'],
    },
  ],

  formacao: [
    { curso: 'Análise e Desenvolvimento de Sistemas', instituicao: 'Faculdade Martha Falcão', periodo: '2024 — atual', detalhe: '5º / último período' },
    { curso: 'Ensino Médio', instituicao: 'Instituto Adventista de Manaus', periodo: '2022 — 2024' },
  ],

  idiomas: [
    { idioma: 'Inglês', nivel: 'Intermediário (cursando)' },
    { idioma: 'Espanhol', nivel: 'Básico' },
  ],

  certificados: [
    {
      grupo: 'Dados, BI e Automação',
      itens: [
        { nome: 'Fundamentos de Análise de Dados', emissor: 'Xperiun' },
        { nome: 'Modelagem de Dados Essencial 2.0', emissor: 'Xperiun' },
        { nome: 'Power Query Essencial 2.0', emissor: 'Xperiun' },
        { nome: 'Linguagem DAX Essencial 2.0', emissor: 'Xperiun' },
        { nome: 'Visualização de Dados Essencial', emissor: 'Xperiun' },
        { nome: 'Power BI Serviço Essencial 2.0', emissor: 'Xperiun' },
        { nome: 'Design de Dashboards com Figma 2.0', emissor: 'Xperiun' },
        { nome: 'Formação de ChatGPT', emissor: 'Viver de IA' },
        { nome: 'Prompting Responsável: Maximizar a IA no seu Negócio' },
        { nome: 'Introdução à Ciência de Dados' },
        { nome: 'Minicurso de SQL' },
        { nome: 'Lógica de Programação Web', emissor: 'IFPK / Instituto Flex' },
      ],
    },
    {
      grupo: 'Desenvolvimento Profissional',
      itens: [
        { nome: 'LinkedIn Champion 2.0', emissor: 'Xperiun' },
        { nome: 'Marketing Pessoal e Técnicas de Vendas' },
        { nome: 'Storytelling para Marketing Digital' },
        { nome: 'Planejamento e Controle Financeiro' },
        { nome: 'Ferramentas Digitais para Negócios' },
        { nome: 'Informática Básica / Intermediária', emissor: 'Grupo Acesso' },
      ],
    },
  ],
};
