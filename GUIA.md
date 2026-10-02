# Guia do portfólio: como ele funciona e como evoluir

Este guia existe para você **entender** o código e conseguir explicar cada decisão numa entrevista.
Leia com o código aberto do lado.

---

## 1. Por que HTML, CSS e JS puros?

- **Zero instalação**: não precisa de Node, npm nem build. Abriu o `index.html`, funcionou.
- **Você explica cada linha**: não tem "mágica" de framework escondendo o que acontece.
- **Hospedagem grátis** no GitHub Pages, que serve arquivos estáticos.
- **Rápido**: a página carrega quase instantaneamente.

> Quando o site crescer (blog, várias páginas de case, versão em inglês), uma evolução natural é o **Astro**.
> Mas você só deve migrar quando sentir a dor. Antes disso, é complexidade sem motivo.

---

## 2. Estrutura de pastas

```
portfolio/
├── index.html        → o ESQUELETO: textos fixos e os "espaços vazios" (ids) que o JS preenche
├── css/style.css     → o VISUAL: cores, layout, animações, responsivo
├── js/data.js        → o CONTEÚDO: projetos, skills, experiência, certificados
├── js/main.js        → o COMPORTAMENTO: lê o data.js e monta as seções
├── assets/           → foto, currículo em PDF, imagens dos projetos, favicon
└── GUIA.md           → este arquivo
```

**A regra de ouro:** o que muda muito (projetos, cursos) fica no `data.js`. O que muda pouco (textos do hero e do "sobre") fica no HTML.
Isso se chama **separar dados de apresentação**, a mesma ideia de separar a base do relatório no Power BI.

---

## 3. Rodando no seu computador

**Opção A (mais simples):** dê duplo clique no `index.html`.

**Opção B (recomendada):** use um servidor local, que se comporta igual ao site publicado:

```powershell
cd C:\Users\COMP-209\portfolio
python -m http.server 5500
```

Depois abra http://localhost:5500. Para parar, aperte `Ctrl + C`.

**Opção C:** instale a extensão **Live Server** no VS Code. Ela recarrega a página sozinha a cada vez que você salva.

---

## 4. Como o código funciona (o fluxo)

```
1. O navegador lê o <head> e roda o scriptzinho de tema (antes de pintar a tela)
2. Carrega o style.css
3. Monta o HTML (esqueleto)
4. Roda data.js   → cria window.PORTFOLIO = { perfil, skills, projetos, ... }
5. Roda main.js   → função iniciar() chama cada render*() que preenche um pedaço da página
```

Abra o `main.js` e **comece a leitura pela função `iniciar()`** no final. Ela é o índice do arquivo.

### Conceitos usados (e onde estudar)

| Conceito | Onde aparece | Para que serve |
|---|---|---|
| **Variáveis CSS** (`--accent`) | topo do `style.css` | Tema claro/escuro trocando só os valores |
| **`data-theme`** no `<html>` | script no `<head>` + `iniciarTema()` | Liga/desliga o tema e salva no `localStorage` |
| **Template literals** (`` `...${x}...` ``) | todas as funções `render*` | Montar HTML a partir dos dados |
| **`esc()`** | topo do `main.js` | Segurança: impede que um texto vire código (XSS) |
| **Event delegation** | `renderProjetos()` | Um único `addEventListener` no grid em vez de um por card |
| **`IntersectionObserver`** | `iniciarReveal()`, `iniciarNavAtiva()` | Saber quando algo entra na tela sem escutar o scroll |
| **`<dialog>`** | modal de projeto | Modal nativo: ESC, foco e fundo já vêm prontos |
| **`requestAnimationFrame`** | `animarContador()` | Animação suave sincronizada com a tela |
| **`prefers-reduced-motion`** | CSS e JS | Acessibilidade: respeita quem desliga animações no sistema |
| **CSS Grid** + `auto-fill` / `minmax` | grid de projetos | Colunas que se ajustam sozinhas ao tamanho da tela |

Referência para tudo isso: **MDN Web Docs** (developer.mozilla.org/pt-BR).

### Detalhes que mostram que você "manja"

- Os **KPIs são calculados**: anos de experiência e total de certificados saem dos próprios dados. Adicionou um curso no `data.js`, o número sobe sozinho.
- Os rótulos dos KPIs usam colchetes, `[Anos com BI]`, igual a uma medida DAX.
- O hero é uma **query SQL** que "retorna" o seu perfil.
- O site funciona **sem JavaScript** (o conteúdo fixo aparece) e **sem animações** para quem precisa.

---

## 5. Como adicionar um projeto

1. Abra `js/data.js`.
2. Copie um bloco inteiro de projeto (de `{` até `},`).
3. Cole no **topo** da lista `projetos`, porque os mais recentes aparecem primeiro.
4. Edite os campos:

```js
{
  id: 'nome-unico-sem-espaco',
  titulo: 'Título do projeto',
  resumo: 'Uma ou duas linhas que aparecem no card.',
  categorias: ['IA', 'Power BI'],     // a 1ª define o ícone
  status: 'construcao',               // 'producao' | 'construcao' | 'concluido'
  ano: 2026,
  stack: ['Power BI', 'Python', 'Azure'],
  imagem: 'assets/projetos/print.png', // opcional
  confidencial: false,
  problema: 'Qual dor existia?',
  solucao: 'O que você construiu e como.',
  resultado: 'O que mudou. Use NÚMEROS sempre que puder.',
  aprendizados: ['O que você aprendeu fazendo.'],
  links: { codigo: 'https://github.com/...', video: 'https://...' },
},
```

### Como escrever um bom case (o que recrutador quer ler)

- **Problema → Solução → Resultado.** Nessa ordem.
- **Números**: "reduziu de 3h para 10min", "5 áreas usando", "atualização de semanal para diária".
- **Aprendizados**: mostram maturidade e são a melhor prova de que foi *você* quem fez.
- **Imagens**: prints com **dados fictícios** ou borrados. Um GIF curto vale mais que um parágrafo.

---

## 6. Publicando no GitHub Pages (grátis)

1. Crie uma conta em github.com, se ainda não tiver.
2. Crie um repositório **público** chamado `portfolio`.
   - Dica: se você der ao repositório o nome `SEU-USUARIO.github.io`, a URL fica mais curta: `https://SEU-USUARIO.github.io`.
3. No terminal:

```powershell
cd C:\Users\COMP-209\portfolio
git init
git add .
git commit -m "feat: primeira versão do portfólio"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/portfolio.git
git push -u origin main
```

4. No GitHub, vá em **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.
5. Em 1 ou 2 minutos o site fica no ar em `https://SEU-USUARIO.github.io/portfolio/`.

A partir daí, para atualizar o site:

```powershell
git add .
git commit -m "feat: adiciona projeto X"
git push
```

> **Commits pequenos e frequentes** são a sua prova de evolução. Um recrutador que abre o histórico e vê
> "feat: filtro de projetos", "fix: menu no mobile", "feat: case IA no Power BI" enxerga alguém aprendendo e construindo.
> Um único commit com tudo pronto parece copiado.

---

## 7. Checklist antes de postar no LinkedIn

- [ ] Preencher `linkedin` e `github` no `data.js`
- [ ] Colocar sua foto em `assets/foto.jpg` (quadrada, de preferência)
- [ ] Colocar o currículo em `assets/curriculo.pdf` (**versão sem endereço completo e sem telefone**: o PDF fica público!)
- [ ] Revisar o número de `dashboardsEntregues` e os textos dos projetos **com as suas palavras**
- [ ] Confirmar com a empresa o que pode ser divulgado (nomes de sistemas, prints, descrição dos projetos)
- [ ] Criar `assets/og.png` (1200×630) e ativar a tag `og:image` no `index.html` com a URL completa
- [ ] Testar no celular de verdade
- [ ] Rodar o **Lighthouse** (F12 → aba Lighthouse) e buscar nota 90+ em tudo
- [ ] Testar o card do link em linkedin.com/post-inspector

---

## 8. Exercícios: evolua o site por conta própria

Cada item vira um commit e um assunto para contar em entrevista. Faça na ordem.

**Fácil**
1. Troque `--accent` no `style.css` por outra cor e veja o site inteiro mudar. Depois volte ao verde.
2. Adicione um certificado novo no `data.js` e repare que o KPI sobe sozinho.
3. Mude o texto da query SQL do hero (constante `SQL` no `main.js`).

**Médio**
4. **Link direto para um projeto**: fazer `seusite.com/#projeto/ia-no-power-bi` abrir o modal já aberto.
   *Dica: `location.hash` e o evento `hashchange`.*
5. **Embed de Power BI**: publique um relatório com **dados fictícios** usando "Publicar na Web" e mostre o `<iframe>` dentro do modal.
   Esse é **o** diferencial de um portfólio de BI: a pessoa interage com o seu painel.
6. **Versão em inglês**: um botão PT/EN. *Dica: duplicar os textos no `data.js` em `pt` e `en`.*

**Desafio**
7. **Paleta de comandos (Ctrl+K)**: uma caixa de busca que navega pelas seções e projetos.
8. **Página de case completa** para o projeto "IA dentro do Power BI": diagrama de arquitetura
   (Visual → API → Container no Azure → Modelo de IA), decisões técnicas, custos e o que daria errado em produção.

---

## 9. Como explicar o projeto numa entrevista

**"Por que não usou React?"**
Porque o site é estático e pequeno. Um framework traria build, dependências e peso sem resolver nenhum problema que eu tinha.
Escolhi a ferramenta pelo problema, não pela moda.

**"Como funciona a lista de projetos?"**
Os projetos são um array de objetos no `data.js`. O `main.js` percorre o array com `map`, gera o HTML de cada card com template literals
e insere no grid. Os filtros leem as categorias do próprio array, então uma categoria nova vira filtro automaticamente.

**"E segurança?"**
Todo texto passa pela função `esc()` antes de ir para o `innerHTML`, então nenhum conteúdo vira código executável.

**"Você usou IA?"**
Usei, como copiloto, do mesmo jeito que uso no trabalho. Mas eu entendo cada parte e já evoluí o código depois (aqui você cita os exercícios que fez).
