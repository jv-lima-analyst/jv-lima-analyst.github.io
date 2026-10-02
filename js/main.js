/* =========================================================
   main.js — comportamento do portfólio
   ---------------------------------------------------------
   Fluxo: o HTML traz o esqueleto → data.js cria
   window.PORTFOLIO → este arquivo lê esses dados e monta as
   partes dinâmicas (KPIs, stack, projetos, experiência…).

   Cada função faz UMA coisa. Todas são chamadas no final,
   dentro de iniciar(). Comece a leitura por lá.
   ========================================================= */

(() => {
  'use strict';

  const D = window.PORTFOLIO;
  const $ = (seletor, ctx = document) => ctx.querySelector(seletor);
  const $$ = (seletor, ctx = document) => [...ctx.querySelectorAll(seletor)];
  const semAnimacao = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const espera = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Escapa texto antes de colocar no innerHTML.
  // Sem isso, um "<" num título quebraria o HTML (e abriria brecha para XSS).
  const esc = (valor) => String(valor ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  /* ---------- Ícones: SVG inline, herdam a cor do texto ---------- */
  const SVG = {
    grafico: '<path d="M4 20h16"/><path d="M7 16v-4"/><path d="M11 16V8"/><path d="M15 16v-6"/><path d="M19 16V4"/>',
    ia: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/>',
    fluxo: '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 6h4a4 4 0 0 1 4 4v5"/>',
    camadas: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    nuvem: '<path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1 0 8z"/>',
    codigo: '<path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="M13.5 5l-3 14"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7"/><path d="M8 7v.01"/><path d="M12 17v-7"/><path d="M12 13a3 3 0 0 1 6 0v4"/>',
    github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    whatsapp: '<path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    download: '<path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/>',
    seta: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    externo: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    lua: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    fechar: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    copiar: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    cadeado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    capelo: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    globo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>',
    medalha: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/>',
  };

  const icone = (nome) => (SVG[nome]
    ? `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVG[nome]}</svg>`
    : '');

  // Preenche os <span data-icon="..."> que estão escritos direto no HTML
  function hidratarIcones() {
    $$('[data-icon]').forEach((el) => { el.innerHTML = icone(el.dataset.icon); });
  }

  /* ---------- Tema claro/escuro ---------- */
  function iniciarTema() {
    $('#btn-tema').addEventListener('click', () => {
      const novo = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = novo;
      try { localStorage.setItem('tema', novo); } catch (e) { /* aba anônima: tudo bem não salvar */ }
    });
  }

  /* ---------- Header: fundo ao rolar + menu mobile ---------- */
  function iniciarHeader() {
    const header = $('.header');
    const atualizar = () => header.classList.toggle('is-scrolled', scrollY > 8);
    addEventListener('scroll', atualizar, { passive: true });
    atualizar();

    const btn = $('#btn-menu');
    const nav = $('#nav');
    const definirMenu = (aberto) => {
      nav.classList.toggle('is-open', aberto);
      btn.setAttribute('aria-expanded', String(aberto));
      btn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    };
    btn.addEventListener('click', () => definirMenu(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) definirMenu(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') definirMenu(false); });
  }

  /* ---------- Terminal: "digita" a query SQL do hero ---------- */
  // Cada pedaço = [texto, classe de cor]. kw = palavra-chave, cm = comentário, str = texto
  const SQL = [
    ['-- quem é o João?\n', 'cm'],
    ['SELECT ', 'kw'], ['nome, foco, stack\n'],
    ['FROM   ', 'kw'], ['portfolio.profissional\n'],
    ['WHERE  ', 'kw'], ['paixao = '], ["'dados + IA'", 'str'], [';'],
  ];

  async function digitarSQL() {
    const alvo = $('#sql');
    alvo.textContent = '';
    for (const [texto, classe] of SQL) {
      const span = document.createElement('span');
      if (classe) span.className = `tk-${classe}`;
      alvo.append(span);
      if (semAnimacao) { span.textContent = texto; continue; }
      for (const letra of texto) {
        span.textContent += letra;
        await espera(letra === '\n' ? 220 : 25 + Math.random() * 45);
      }
    }
    await espera(semAnimacao ? 0 : 350);
    $('#sql-resultado').classList.add('is-on');
  }

  /* ---------- Faixa rolante: usa os nomes da própria stack ---------- */
  const nomeSkill = (item) => (typeof item === 'string' ? item : item.nome);

  function renderMarquee() {
    const itens = D.skills.flatMap((g) => g.itens.map(nomeSkill))
      .map((nome) => `<span>${esc(nome)}</span>`).join('');
    $('#marquee').innerHTML = itens + itens; // duplicado para o loop não ter "emenda"
  }

  /* ---------- KPIs: calculados a partir dos próprios dados ---------- */
  function renderKpis() {
    const totalCerts = D.certificados.reduce((soma, g) => soma + g.itens.length, 0);
    const anos = new Date().getFullYear() - D.perfil.inicioNaArea;
    const kpis = [
      { medida: 'Anos com BI', valor: anos, sufixo: '+', detalhe: `Desde ${D.perfil.inicioNaArea}, em 2 empresas` },
      { medida: 'Dashboards Entregues', valor: D.perfil.dashboardsEntregues, sufixo: '+', detalhe: 'Power BI em produção' },
      { medida: 'Áreas Atendidas', valor: D.perfil.areasAtendidas.length, detalhe: D.perfil.areasAtendidas.join(' · ') },
      { medida: 'Certificações', valor: totalCerts, detalhe: 'Dados, BI, IA e negócios' },
    ];
    $('#kpis').innerHTML = kpis.map((k, i) => `
      <article class="card kpi reveal" style="--delay:${i * 80}ms">
        <p class="kpi__medida mono">[${esc(k.medida)}]</p>
        <p class="kpi__valor"><span data-contar="${k.valor}">0</span>${k.sufixo ? `<small>${esc(k.sufixo)}</small>` : ''}</p>
        <p class="kpi__detalhe">${esc(k.detalhe)}</p>
      </article>`).join('');
  }

  // Conta de 0 até o valor final, desacelerando no fim (easeOutCubic)
  function animarContador(el) {
    const fim = Number(el.dataset.contar);
    if (semAnimacao) { el.textContent = fim; return; }
    const duracao = 1200;
    const inicio = performance.now();
    const passo = (agora) => {
      const t = Math.min((agora - inicio) / duracao, 1);
      el.textContent = Math.round(fim * (1 - (1 - t) ** 3));
      if (t < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  /* ---------- Stack ---------- */
  function renderSkills() {
    $('#skills').innerHTML = D.skills.map((g, i) => `
      <article class="card skill-grupo reveal" style="--delay:${i * 80}ms">
        <div class="skill-grupo__head">
          <span class="skill-grupo__icone">${icone(g.icone)}</span>
          <div><h3>${esc(g.grupo)}</h3><p>${esc(g.descricao)}</p></div>
        </div>
        <ul class="chips">
          ${g.itens.map((item) => {
            const estudando = typeof item === 'object' && item.estudando;
            return `<li class="${estudando ? 'estudando' : ''}">${esc(nomeSkill(item))}${estudando ? ' <span class="tag-estudo">estudando</span>' : ''}</li>`;
          }).join('')}
        </ul>
      </article>`).join('');
  }

  /* ---------- Projetos: cards, filtros e modal ---------- */
  const STATUS = { producao: 'Em produção', construcao: 'Em construção', concluido: 'Concluído' };
  const ICONE_CATEGORIA = { 'Power BI': 'grafico', IA: 'ia', 'Automação': 'fluxo', Fabric: 'camadas', Cloud: 'nuvem', Web: 'codigo' };
  const ROTULO_LINK = { demo: 'Ver demo', codigo: 'Ver código', video: 'Ver vídeo', artigo: 'Ler artigo', powerbi: 'Abrir relatório' };

  const chips = (lista) => `<ul class="chips">${lista.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`;

  function cardProjeto(p) {
    const capa = p.imagem
      ? `<img src="${esc(p.imagem)}" alt="" loading="lazy">`
      : `<span class="projeto__icone">${icone(p.icone || ICONE_CATEGORIA[p.categorias[0]] || 'grafico')}</span>`;
    return `
      <article class="card projeto reveal" data-id="${esc(p.id)}" data-cats="${esc(p.categorias.join('|'))}">
        <div class="projeto__capa">
          ${capa}
          <span class="status cor--${esc(p.status)}">${STATUS[p.status] ?? ''}</span>
        </div>
        <div class="projeto__corpo">
          <p class="projeto__meta">${esc(p.categorias.join(' · '))} · ${esc(p.ano)}</p>
          <h3>${esc(p.titulo)}</h3>
          <p class="projeto__resumo">${esc(p.resumo)}</p>
          ${chips(p.stack.slice(0, 4))}
          <button class="projeto__abrir" type="button">Ver detalhes ${icone('seta')}</button>
        </div>
      </article>`;
  }

  function renderProjetos() {
    const grid = $('#projetos-grid');
    grid.innerHTML = D.projetos.map(cardProjeto).join('');
    // Um único "ouvinte" no grid em vez de um por card (event delegation)
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.projeto');
      if (card) abrirProjeto(card.dataset.id);
    });
    renderFiltros();
  }

  function renderFiltros() {
    const contagem = {};
    D.projetos.forEach((p) => p.categorias.forEach((c) => { contagem[c] = (contagem[c] || 0) + 1; }));
    const categorias = ['Todos', ...Object.keys(contagem)];

    const wrap = $('#filtros');
    wrap.innerHTML = categorias.map((c) => `
      <button class="filtro" type="button" data-cat="${esc(c)}" aria-pressed="${c === 'Todos'}">
        ${esc(c)}<span class="n">${c === 'Todos' ? D.projetos.length : contagem[c]}</span>
      </button>`).join('');

    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.filtro');
      if (!btn) return;
      $$('.filtro', wrap).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      filtrar(btn.dataset.cat);
    });
  }

  function filtrar(categoria) {
    let ordem = 0;
    $$('.projeto').forEach((card) => {
      const mostra = categoria === 'Todos' || card.dataset.cats.split('|').includes(categoria);
      card.hidden = !mostra;
      if (!mostra) return;
      card.classList.remove('is-visible');
      void card.offsetWidth; // truque: força o navegador a reiniciar a animação
      card.style.setProperty('--delay', `${ordem++ * 60}ms`);
      card.classList.add('is-visible');
    });
  }

  function abrirProjeto(id) {
    const p = D.projetos.find((x) => x.id === id);
    if (!p) return;

    const bloco = (titulo, texto) => (texto
      ? `<section class="modal__bloco"><h3>${titulo}</h3><p>${esc(texto)}</p></section>`
      : '');
    const links = Object.entries(p.links || {}).filter(([, url]) => url);

    const dlg = $('#modal-projeto');
    $('.modal__conteudo', dlg).innerHTML = `
      <p class="projeto__meta">${esc(p.categorias.join(' · '))} · ${esc(p.ano)} · <span class="cor--${esc(p.status)}">${STATUS[p.status] ?? ''}</span></p>
      <h2 id="modal-titulo">${esc(p.titulo)}</h2>
      <p class="modal__resumo">${esc(p.resumo)}</p>
      ${p.confidencial ? `<p class="aviso">${icone('cadeado')} Projeto corporativo: dados, nomes e telas reais não são exibidos.</p>` : ''}
      ${bloco('O problema', p.problema)}
      ${bloco('A solução', p.solucao)}
      ${bloco('Resultado', p.resultado)}
      ${p.aprendizados?.length ? `
        <section class="modal__bloco">
          <h3>O que aprendi</h3>
          <ul class="lista">${p.aprendizados.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
        </section>` : ''}
      <section class="modal__bloco"><h3>Stack</h3>${chips(p.stack)}</section>
      ${links.length ? `
        <div class="modal__links">
          ${links.map(([tipo, url]) => `<a class="btn btn--ghost" href="${esc(url)}" target="_blank" rel="noopener">${esc(ROTULO_LINK[tipo] ?? tipo)} ${icone('externo')}</a>`).join('')}
        </div>` : ''}`;

    dlg.showModal();
    $('.modal__caixa', dlg).scrollTop = 0;
  }

  function iniciarModal() {
    const dlg = $('#modal-projeto');
    // Fecha ao clicar no "X" ou fora da caixa (no fundo escurecido). O ESC o <dialog> já resolve.
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg || e.target.closest('[data-fechar]')) dlg.close();
    });
  }

  /* ---------- Experiência ---------- */
  function renderExperiencia() {
    $('#timeline').innerHTML = D.experiencia.map((x, i) => `
      <article class="card exp reveal ${x.atual ? 'exp--atual' : ''}" style="--delay:${i * 100}ms">
        <span class="exp__ponto" aria-hidden="true"></span>
        <div class="exp__cabecalho">
          ${x.logo ? `<img class="exp__logo" src="${esc(x.logo)}" alt="Logo ${esc(x.empresa)}" width="56" height="56" loading="lazy" onerror="this.remove()">` : ''}
          <div class="exp__titulos">
            <div class="exp__topo">
              <h3>${esc(x.cargo)}</h3>
              <span class="exp__periodo">${esc(x.periodo)}</span>
            </div>
            <p class="exp__empresa">${esc(x.empresa)} · ${esc(x.local)}</p>
          </div>
        </div>
        <ul class="lista">${x.itens.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        ${chips(x.stack)}
      </article>`).join('');
  }

  /* ---------- Formação, idiomas e certificados ---------- */
  function renderFormacao() {
    $('#educacao').innerHTML = D.formacao.map((f) => `
      <li>
        <strong>${esc(f.curso)}</strong>
        <span>${esc(f.instituicao)}</span>
        <span class="mono">${esc(f.periodo)}${f.detalhe ? ` · ${esc(f.detalhe)}` : ''}</span>
      </li>`).join('');

    $('#idiomas').innerHTML = D.idiomas.map((l) => `
      <li><strong>${esc(l.idioma)}</strong><span>${esc(l.nivel)}</span></li>`).join('');

    $('#certificados').innerHTML = D.certificados.map((g, i) => `
      <details ${i === 0 ? 'open' : ''}>
        <summary>${esc(g.grupo)}<span class="n mono">${g.itens.length}</span></summary>
        <ul>
          ${g.itens.map((c) => `<li><span>${esc(c.nome)}</span>${c.emissor ? `<span class="emissor">${esc(c.emissor)}</span>` : ''}</li>`).join('')}
        </ul>
      </details>`).join('');
  }

  /* ---------- Contato e redes ---------- */
  const REDES = {
    linkedin: { rotulo: 'LinkedIn', url: (v) => v },
    github: { rotulo: 'GitHub', url: (v) => v },
    whatsapp: { rotulo: 'WhatsApp', url: (v) => `https://wa.me/${v}` },
    email: { rotulo: 'E-mail', url: (v) => `mailto:${v}` },
  };

  function linksSociais() {
    return Object.entries(REDES)
      .filter(([chave]) => D.contato[chave]) // só mostra o que estiver preenchido
      .map(([chave, rede]) => {
        const url = rede.url(D.contato[chave]);
        const externo = url.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
        return `<li><a class="icon-btn" href="${esc(url)}"${externo} aria-label="${rede.rotulo}" title="${rede.rotulo}">${icone(chave)}</a></li>`;
      }).join('');
  }

  function renderContato() {
    const redes = linksSociais();
    $('#hero-social').innerHTML = redes;
    $('#contato-social').innerHTML = redes;
    $('#btn-email').href = `mailto:${D.contato.email}`;
    $('#email-texto').textContent = D.contato.email;

    // Botão de WhatsApp: some se o número não estiver preenchido no data.js
    const btnZap = $('#btn-whatsapp');
    if (D.contato.whatsapp) {
      btnZap.href = `https://wa.me/${D.contato.whatsapp}`;
      $('#telefone-texto').textContent = D.contato.telefone || D.contato.whatsapp;
    } else {
      btnZap.remove();
    }

    const btn = $('#btn-copiar');
    const rotulo = $('.rotulo', btn);
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(D.contato.email);
      } catch (e) {
        location.href = `mailto:${D.contato.email}`; // navegador sem permissão de copiar
        return;
      }
      rotulo.textContent = 'E-mail copiado!';
      setTimeout(() => { rotulo.textContent = 'Copiar e-mail'; }, 2000);
    });
  }

  /* ---------- Animação de entrada (IntersectionObserver) ---------- */
  // O navegador avisa quando cada elemento entra na tela, sem precisar ficar
  // escutando o scroll o tempo todo. Mais leve que window.onscroll.
  function iniciarReveal() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        target.classList.add('is-visible');
        $$('[data-contar]', target).forEach(animarContador);
        obs.unobserve(target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => obs.observe(el));
  }

  /* ---------- Destaca no menu a seção que está na tela ---------- */
  function iniciarNavAtiva() {
    const links = $$('.nav a');
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach((s) => obs.observe(s));
  }

  /* ---------- Holofote que segue o mouse nos cards ---------- */
  function iniciarHolofote() {
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest?.('.card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  /* ---------- Rodapé ---------- */
  function renderRodape() {
    $('#ano').textContent = new Date().getFullYear();
    $('#atualizado').textContent = D.perfil.atualizadoEm;
  }

  /* ========================================================= */
  function iniciar() {
    hidratarIcones();
    iniciarTema();
    iniciarHeader();

    renderMarquee();
    renderKpis();
    renderSkills();
    renderProjetos();
    renderExperiencia();
    renderFormacao();
    renderContato();
    renderRodape();

    iniciarModal();
    iniciarReveal(); // depois dos renders, para enxergar os elementos criados
    iniciarNavAtiva();
    iniciarHolofote();
    digitarSQL();
  }

  iniciar();
})();
