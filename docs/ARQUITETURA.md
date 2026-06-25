# ARQUITETURA — Parte Diária Digital (Petra Agregados)

Este documento é um guia técnico para quem vai pegar o arquivo `parte_diaria_v46.html` e desenvolver/refatorar o sistema. Não substitui a leitura do código, mas serve como mapa: onde está o quê, como as peças se encaixam, e o que NÃO está óbvio só lendo.

---

## 1. Visão geral do produto

**O que é:** sistema operacional de pedreira (quarrying) que substitui um workflow manual de coleta diária de dados de operação (a tradicional "Parte Diária" em papel).

**Quem usa, onde:**

- **Operadores de equipamento** (caminhão, carregadeira, escavadeira, perfuratriz, etc.) — usam um **tablet fixado na cabine** do equipamento. Interface "tablet" do sistema: botões grandes (mínimo 80px de altura), uso com luva, modo alto-contraste pra sol forte.
- **Equipe de gestão / supervisão** — usa o **Painel Gerencial** (web, desktop) pra cadastrar equipamentos/operadores, planejar produção (PCP), acompanhar dashboards e gerir estoque.

Os dois mundos convivem no mesmo arquivo HTML monolítico, e o usuário alterna entre eles pelo header.

**Contexto operacional:**

- Pedreira opera de ~07:15 às 16:45 (turno padrão), 22 dias úteis/mês
- Frota fixa de ~14 equipamentos
- Eventos típicos: viagens de caminhão, paradas (manutenção, refeição, troca de turno), alertas (manutenção, produção, pista), checklists de pré-operação, registros de horímetro, perfuração e detonação, entrada e saída de estoque
- Conectividade não é garantida (tablet em cabine pode ficar offline), por isso o sistema foi desenhado em single-file HTML com tudo client-side

---

## 2. Glossário de domínio

Termos que aparecem o tempo todo no código e que **não são óbvios** se você não é da área:

| Termo | Significado |
|-------|-------------|
| **Parte Diária** | Relatório operacional diário tradicionalmente preenchido a mão pelo operador, registrando todas as atividades do equipamento naquele turno. Esse sistema digitaliza isso. |
| **Horímetro** | Hodômetro de tempo de motor ligado. Equivalente ao odômetro de um carro, mas mede horas. Lido no início e fim do turno. |
| **Viagem (trip)** | Uma rodada completa de carregamento+transporte+descarga feita por um caminhão. Pode ser `productive` (material útil, ex: brita) ou `sterile` (estéril/rejeito da mina). |
| **Concha** | A "pá" de uma carregadeira. Capacidade nominal padrão da frota = **6 toneladas** (constante `TONS_PER_CONCHA`). |
| **Brita 0, 1, 2, 3, 4** | Pedra britada classificada por granulometria. 0 é o mais fino, 4 o mais grosso. |
| **Bica Corrida** | Material britado sem classificação por peneira — sai direto do britador. |
| **Areia Industrial** | Pó de pedra fino, substituto da areia natural pra construção. Produto premium da Petra. |
| **Britagem primária / Rebritagem** | Britagem primária = primeira quebra da rocha grande. Rebritagem = britagens subsequentes pra reduzir granulometria. |
| **PCP** | Planejamento e Controle de Produção. Define metas mensais, distribui por dia útil, e por equipamento (viagens, metros de furação). |
| **Furo / Furação** | Perfuração de rocha em malha, pra inserir explosivo e detonar. Métrica chave: **metros perfurados/dia**. |
| **Rompimento** | Quebra mecânica de matacões grandes (pedras que sobraram do desmonte e não cabem no britador). |
| **DDS** | Diálogo Diário de Segurança. Reunião curta de início de turno. |
| **NR-12 / NR-18** | Normas Regulamentadoras (segurança do trabalho). NR-12 = máquinas e equipamentos. NR-18 = construção. O checklist do tablet implementa partes da NR-12. |
| **Códigos de frota** | `UT-XX` = caminhão (Unidade de Transporte), `UC-XX` = carregadeira/escavadeira (Unidade de Carga), `UP-XX` = perfuratriz (Unidade de Perfuração), `US-XX` = serviço (pipa, etc), `UB-XX` = britagem, `URB-XX` = rebritagem, `MN-XX` = motoniveladora. |
| **CFEM** | Compensação Financeira pela Exploração de Recursos Minerais. Royalty pago à União/Estados/Municípios. Não aparece neste arquivo, mas é mencionado em outros sistemas da Petra. |

---

## 3. Stack técnica

**Single-file HTML, zero build system.** Todo o código (HTML, CSS, JS) está em um único arquivo de ~7.857 linhas.

**Dependências externas (CDN, carregadas no `<head>`):**

- **Tailwind CSS** via `cdn.tailwindcss.com` — utility-first CSS. Config customizado no script inline das linhas ~12–34.
- **Chart.js** via `cdn.jsdelivr.net/npm/chart.js` — gráficos do painel gerencial (dashboards).
- **Google Fonts:** Archivo (display), DM Sans (body), JetBrains Mono (números/monoespaçado).

**Sem dependências runtime adicionais.** Não há React, Vue, jQuery, etc. Tudo é JavaScript "vanilla" com manipulação direta do DOM (via `innerHTML`).

**Assets embutidos:**

- Logo da Petra como base64 inline (constante `LOGO_PATH`, linha ~5770) — para funcionar offline.

---

## 4. Arquitetura

### 4.1 Padrão geral

```
┌────────────────────────────────────────────────────┐
│   State (objeto global único, em memória)          │
└────────────────────────────────────────────────────┘
              ▲                       │
              │ mutação              │ leitura
              │                       ▼
        ┌─────┴─────┐         ┌──────────────┐
        │  Actions  │         │  render()    │
        │ (funções) │         │ reconstrói   │
        └───────────┘         │ DOM inteiro  │
              │                └──────────────┘
              └──────► saveState() → notify() → render()
```

**Fluxo padrão de qualquer interação:**
1. Usuário clica em um botão → handler inline `onclick="..."` chama uma função
2. A função muta `State` diretamente (sem imutabilidade)
3. Chama `saveState()` (que em v46 é no-op — persistência manual via arquivo)
4. Chama `notify()` (dispara listeners registrados em `listeners`)
5. Chama `render()` (reconstrói `app.innerHTML` do zero)

**Padrão é "render full"**: a cada mudança o DOM inteiro é recriado. Funciona porque o sistema é pequeno e os tablets têm hardware moderno, mas é o ponto mais óbvio pra otimizar numa refatoração (virtual DOM, signals, etc).

### 4.2 Sistema de telas (routing)

O routing é controlado por dois campos no State:

- `State.currentView` — `'tablet'` ou `'management'`
- `State.currentScreen` — nome da tela específica dentro da view

Helpers:
- `navigate(screen, params)` — muda de tela
- `setView(view)` — alterna entre tablet e gerencial (e escolhe a tela apropriada baseada no estado da sessão)
- `openModal(type, params)` / `closeModal()` — gerencia o modal único ativo

### 4.3 Sistema de modais

Há apenas **um modal ativo por vez**, gerenciado por `State.modal = { type, params }`. A função `renderModal()` (linha ~2556) faz dispatch por tipo. Existem ~30 tipos de modal (lista completa na seção "Mapa do código").

---

## 5. Modelo de dados (`State`)

O objeto `State` é o coração do sistema. Construído por `buildInitialState()` (linha ~5940).

### 5.1 Estrutura geral

```js
State = {
  schemaVersion: 1,

  // === CADASTROS (configuração do sistema) ===
  operators: [{ id, username, password, name, role: 'admin'|'operator' }],
  equipments: [{ id, code, kind, subtype?, name, icon, capacity?, category, lastHorimeter, ... }],
  materials: [{ id, name, color }],
  truckTypes: [{ name, tons }],  // Toco, Truck, Bi-truck, Carreta
  stopReasons: [{ id, label, color, equipmentKinds[], special? }],
  maintenanceAlertTemplates: [{ id, label, equipmentKinds[] }],
  productionAlertTemplates:  [{ id, label, equipmentKinds[] }],

  // === ESTADO OPERACIONAL CORRENTE ===
  equipmentStates: {                        // estado atual de cada equipamento
    [eqId]: {
      status: 'off'|'operating'|'stopped'|'maintenance',
      operator: string|null,
      since: ISO,                           // desde quando está nesse status
      shiftStart: ISO,                      // início do turno atual
      tripsToday, tonsToday, litersToday, loadsToday,
      stopReason?, alertText?
    }
  },

  tabletSession: {                          // sessão do tablet ATIVO neste device
    boundEquipmentId: string|null,          // qual equipamento esse tablet representa
    operator: string|null,                  // operador logado agora
    checklistDone: boolean,
    checklistResult: object|null,
    checklistDraft: object|null,            // checklist em preenchimento
    initialHorimeter: number|null,
    initialHorimeters: object|null,         // britagem tem múltiplos horímetros
    shiftStartedAt: ISO|null,
    blocked: boolean,
    blockReason: string|null,
    activeStop, activeFurao, activePipa, activeRompimento,  // sessões ativas
    excavatorImplement, truckMode, drillBits,
    britagemStates, rebritagemStates,
    oficinaStartTs, oficinaEquipmentId,
    loaderDraft
  },

  // === HISTÓRICO ===
  events: [                                 // máx CONFIG.MAX_EVENTS (5000)
    { id, type, equipment, operator, ts, ...campos do tipo }
  ],

  // === PLANEJAMENTO ===
  pcp: {
    date,                                   // dia atual sendo planejado
    monthly: { month, targetTons, calendarDays, businessDays, defaultHoursPerDay, autoRedistribute },
    shifts: { [shiftId]: { id, name, start, end, intervalMinutes, effectiveHours } },
    calendar: { [date]: { type, productive, hours, reason } },
    dailyPlans: { [date]: { date, shiftId, start, end, intervalMinutes, effectiveHours, truckIds[], notes } },
    hourlyJustifications: {},
    deviationReasons: string[],
    plans: { [eqId]: { trips|meters, enabled } },
    drillMeters: number,
    notes: string
  },

  // === METAS ===
  goals: { [eqId]: { trips? }, drill: { meters } },

  // === ESTOQUE ===
  stockLevels: { [materialId]: { balance, target, lastUpdated } },

  // === SESSÃO GERENCIAL ===
  managementUser: { id, name } | null,

  // === UI / ROUTING ===
  currentView: 'tablet' | 'management',
  currentScreen: string,                    // ver dispatchers nas linhas 609 e 3898
  modal: { type, params } | null,
  tabletTheme: 'dark' | 'light' | 'hc',     // hc = alto contraste

  // === FILTROS / TABS UI (efêmeros) ===
  _feedFilter, _feedFilterEq, _cadastroTab,

  bootedAt: ISO
}
```

### 5.2 Tipos de evento (`State.events[].type`)

Eventos têm um campo `type` que determina os outros campos. Os principais:

| `type` | Campos extras | Descrição |
|---|---|---|
| `trip` | `equipment, operator, subtype, tons` | Viagem completada por um caminhão |
| `stock-in` | `equipment, operator, material, tons` | Entrada de material no estoque |
| `stock-out` | `equipment, operator, material, truckType, conchas, tons` | Saída de material (carregamento de terceiro) |
| `stop` | `equipment, operator, reason, reasonId, start, end, duration` | Parada operacional |
| `alert-maintenance` | `equipment, operator, text, tag, resolved` | Alerta de manutenção (ex: vidro trincado) |
| `alert-production` | `equipment, operator, text, tag, resolved` | Alerta operacional (ex: pista ruim) |
| `checklist` | `equipment, operator, allOk, issues[]` | Checklist NR-12 pré-operação |
| `horimeter` | `equipment, operator, value, kind` | Leitura de horímetro |

Eventos são apendados no **início** do array (`unshift`) — ordem cronológica reversa. Limite de 5000 eventos (constante `CONFIG.MAX_EVENTS`).

### 5.3 Tipos de equipamento (`equipment.kind`)

```
truck                — caminhão de transporte (UT-XX)
loader               — carregadeira de pneus (UC-XX, geralmente)
excavator            — escavadeira (UC-XX também)
motorgrader          — motoniveladora (MN-XX)
drill                — perfuratriz (UP-XX), subtype: pneumatica | hidraulica
pipa                 — caminhão pipa (US-XX), capacity em litros
support              — equipamentos de apoio (Patrol, Retro, Mini, Comboio, Apoio)
britagem-primaria    — britagem primária (UB-XX)
rebritagem           — linha de rebritagem (URB-XX, múltiplos horímetros)
```

Cada `kind` tem uma tela operacional dedicada (ver seção 7 — Mapa do código).

---

## 6. Sistema de navegação

### 6.1 Telas do TABLET

Definidas em `renderTablet()` (linha 609):

```
tablet-login        → Login do operador
tablet-equipment    → Vincular tablet a um equipamento (requer admin)
tablet-checklist    → Checklist NR-12 pré-operação
tablet-horimeter    → Leitura inicial do horímetro
tablet-blocked      → Bloqueio (checklist com item crítico reprovado)
tablet-operational  → Tela principal de operação (varia por kind)
```

### 6.2 Telas do PAINEL GERENCIAL

Definidas em `renderManagement()` (linha 3898):

```
mgmt-login          → Login do gestor
mgmt-dashboard      → KPIs, gráficos, feed de eventos
mgmt-cadastros      → CRUD de equipamentos, operadores, materiais, etc
mgmt-pcp            → Planejamento e Controle de Produção
mgmt-stock          → Gestão de estoque
mgmt-operadores     → Gestão de operadores (separado do cadastro geral)
```

### 6.3 Lógica do `setView()`

Quando o usuário alterna entre tablet e gerencial (header), `setView()` (linha 6311) escolhe a tela de destino:

```
Se vai pra management → mgmt-dashboard se logado, mgmt-login caso contrário
Se vai pra tablet:
  Se sem equipamento vinculado    → tablet-login
  Senão se sem operador logado    → tablet-login
  Senão se bloqueado              → tablet-blocked
  Senão se sem checklist          → tablet-checklist
  Senão se sem horímetro inicial  → tablet-horimeter
  Senão                           → tablet-operational
```

Esse fluxo é a **máquina de estados implícita** do tablet. Em uma refatoração, vale formalizar isso (XState, ou ao menos um state diagram).

---

## 7. Mapa do código

Linhas aproximadas (v46). Use `Ctrl+F` por `// =====` ou `// ====` no arquivo.

### 7.1 Estrutura macro do arquivo

```
Linhas      Conteúdo
─────────────────────────────────────────────────────────────────
1–11        <head>, imports CDN
12–34       Tailwind config (cores Petra, fontes, animações)
35–312      <style> principal (temas, componentes)
313–343     <style> animação splash + body inicial
344–1387    Script: helpers, render principal, telas TABLET
1390–2016   Script: telas operacionais por kind de equipamento
2019–2552   Script: modais, footers, listagem de eventos
2555–3894   Script: render do painel gerencial + dashboards
3897–5767   Script: PCP, estoque, exportações (PDF/Excel/CSV)
5768–6325   Script: buildInitialState, loadState, navigate, helpers de State
6328–7173   Script: post-render hooks, boot, timers ao vivo
7269–7465   Script: patch v37 — perda de viagem (simplificada)
```

### 7.2 Funções principais e onde estão

#### Render & infraestrutura
| Função | Linha | O que faz |
|---|---|---|
| `render()` | 532 | Reconstrói todo o DOM. Faz dispatch para tablet ou management. |
| `renderHeader()` | 576 | Header fixo no topo (logo, switch tablet/gerencial, reset). |
| `renderModal()` | 2556 | Dispatch de modal por tipo. |
| `postRenderHooks()` | 6334 | Hooks executados após cada render (auto-focus, charts). |

#### Tablet (operador)
| Função | Linha |
|---|---|
| `renderTablet()` (dispatcher) | 609 |
| `renderTabletLogin()` | 620 |
| `renderTabletEquipmentBinding()` | 738 |
| `renderTabletChecklist()` | 877 |
| `renderTabletHorimeter()` | 1084 |
| `renderTabletBlocked()` | 1061 |
| `renderTabletOperational()` (dispatcher) | 1232 |

#### Telas operacionais por tipo de equipamento
| Kind | Função | Linha |
|---|---|---|
| Caminhão | `renderTabletOperationalTruck` | ~1472 |
| Carregadeira | `renderTabletOperationalLoader` | ~1708 |
| Escavadeira | `renderTabletOperationalExcavator` | ~1832 |
| Motoniveladora | `renderTabletOperationalMotorgrader` | ~1919 |
| Apoio | `renderTabletOperationalSupport` | ~1985 |
| Pipa | `renderTabletOperationalPipa` | ~2020 |
| Perfuratriz | `renderTabletOperationalDrill` | ~2120 |
| Britagem primária | `renderTabletOperationalBritagem` | ~2248 |
| Rebritagem | `renderTabletOperationalRebritagem` | ~2360 |

#### Painel Gerencial
| Função | Linha |
|---|---|
| `renderManagement()` (dispatcher) | 3898 |
| `renderMgmtLogin()` | 3909 |
| `renderMgmtDashboard()` | 3950 |
| `renderMgmtOperadores()` | 4327 |
| `renderMgmtCadastros()` | 4428 |
| `renderMgmtPCP()` | 5130 |
| `renderMgmtStock()` | 5199 |

#### Modais (todos em renderModal, linha 2556)
Tipos disponíveis (passados em `State.modal.type`):

**Operacionais:**
`admin-equipment-binding`, `admin-unblock`, `parada`, `alert-maintenance`, `alert-production`, `finalize-shift`, `stock-in`, `loader-stock-out`, `extra-services`, `extra-services-loader`, `observation`, `pipa-start`, `drill-start`, `britagem-event`, `rebritagem-peneira`

**Cadastros (gerencial):**
`mgmt-equipment-detail`, `mgmt-add-equipment`, `mgmt-edit-equipment`, `mgmt-add-operator`, `mgmt-edit-operator`, `mgmt-add-stop`, `mgmt-edit-stop`, `mgmt-add-mnt-alert`, `mgmt-edit-mnt-alert`, `mgmt-add-prod-alert`, `mgmt-edit-prod-alert`, `mgmt-add-material`, `mgmt-edit-material`, `mgmt-add-trucktype`, `mgmt-edit-trucktype`

#### Helpers de State
| Função | Linha | O que faz |
|---|---|---|
| `buildInitialState()` | 5940 | Constrói o State inicial (com dados-semente da demo) |
| `loadState()` | 6162 | Inicializa State. **Em v46: sempre começa do zero.** |
| `applyParsedState(parsed)` | ~6176 | Aplica um State carregado de arquivo (usado em importBackup) |
| `saveState()` | ~6210 | **Em v46: no-op** (persistência manual via arquivo) |
| `resetState()` | ~6213 | Reseta State para o initial |
| `pushEvent(ev)` | 6259 | Adiciona evento no histórico (limite MAX_EVENTS) |
| `navigate(screen, params)` | 6303 | Muda de tela |
| `openModal(type, params)` | 6309 | Abre modal |
| `closeModal()` | 6310 | Fecha modal |
| `setView(view)` | 6311 | Alterna tablet/gerencial |
| `notify()` / `subscribe()` | 6322 / 6321 | Sistema de listeners |

#### Persistência (v46)
| Função | Linha | O que faz |
|---|---|---|
| `exportBackup()` | 4935 | Gera download de JSON com o State |
| `importBackup()` | 4952 | Carrega State de um arquivo JSON e valida |

#### Helpers gerais
| Função | Linha | O que faz |
|---|---|---|
| `uid()` | ~ | Gera ID único curto |
| `toast(msg, type, ms)` | 505 | Notificação flutuante |
| `showConfirm(...)` | 516 | Diálogo de confirmação |
| `showLoading()` / `hideLoading()` | 491 / 498 | Overlay de loading |
| `icon(name, size)` | 406 | Retorna SVG inline de ícone |
| `escapeHtml(s)` | ~ | Escape HTML pra evitar XSS no innerHTML |
| `parseNumberPtBr(...)` | 470 | Parse de número formato BR (vírgula decimal) |

---

## 8. Fluxos principais

### 8.1 Fluxo do operador no tablet (turno completo)

```
1. Tablet ligado, vinculado a um equipamento (UT-08, por exemplo)
   └─ tablet-login (mostra qual equipamento está vinculado)
2. Operador entra com usuário/senha
   └─ doTabletLogin() → State.tabletSession.operator = "Carlos Pereira"
3. Sistema vai pra tablet-checklist
   └─ Operador marca cada item OK / Inapto / Crítico
   └─ Se algum item crítico for inapto → tablet-blocked
   └─ Se não → submitChecklist() → tablet-horimeter
4. Operador insere leitura inicial do horímetro
   └─ submitHorimeter() → tablet-operational
5. Operador opera o turno todo registrando eventos:
   - Botão grande "VIAGEM PRODUTIVA" → pushEvent({type:'trip', ...})
   - Botão "PARADA" → modal escolher motivo → cronômetro
   - Botão "ALERTA MANUTENÇÃO" → modal escolher tag → registra
   - etc.
6. Final do turno → modal "Finalizar Turno" (finalize-shift)
   └─ Confirma totais, leitura final do horímetro
   └─ Volta pra tablet-login pra próximo operador
```

### 8.2 Fluxo do gestor no painel

```
1. mgmt-login → admin/admin
2. mgmt-dashboard
   - KPIs (toneladas hoje, viagens, equipamentos ativos)
   - Gráficos (chart.js)
   - Feed de eventos
   - Botões: Backup / Restaurar / Sair
3. Cadastros:
   - mgmt-cadastros (equipamentos, operadores, paradas, alertas, materiais, tipos de caminhão)
   - mgmt-operadores (separado, mais focado)
4. mgmt-pcp:
   - Define meta mensal em toneladas
   - Calendário de dias produtivos/folga
   - Plano por equipamento (viagens/dia ou metros/dia)
   - Justificativas horárias de desvio
5. mgmt-stock:
   - Saldo de cada material vs. alvo
   - Movimentações
```

---

## 9. Persistência (v46)

**Mudança importante na v46:** o sistema **não** usa mais `localStorage`. A persistência agora é **manual via arquivo JSON**.

- `saveState()` é no-op (a função foi mantida no código pra evitar quebrar as ~dezenas de chamadas espalhadas)
- `loadState()` sempre inicia do `buildInitialState()` (estado de demo)
- Para salvar dados reais: botão **Backup** no painel gerencial (`exportBackup()`)
- Para carregar de volta: botão **Restaurar** (`importBackup()`)

**Implicação importante:** F5 / fechar a aba **perde tudo da sessão** se não houver export. O `beforeunload` (linha ~7193) avisa se há turno aberto.

**Por que isso mudou:** versões anteriores usavam localStorage, mas o State crescia com eventos e estourava a cota do navegador (~5–10 MB). A solução era arquivar eventos antigos automaticamente, mas mesmo isso falhava com frequência. O caminho manual deu o controle de volta ao usuário.

**Numa refatoração séria isso PRECISA mudar:** ou backend com persistência server-side, ou IndexedDB (que tem cotas muito maiores e suporta queries), ou File System Access API (que o usuário já testou em outro tool da Petra — `painel_diario.html`).

---

## 10. Convenções e padrões observados

### 10.1 Versionamento por comentário

O código tem comentários do tipo `v44.1`, `v45 — 4.5`, `v46` para rastrear quando cada trecho foi modificado. Útil pra arqueologia, mas pode ser limpo na refatoração.

### 10.2 Templates inline com template literals

Todo HTML é gerado via template literals JavaScript. **Não há nenhum sistema de templating** (Mustache, Handlebars, JSX, etc).

Exemplo típico:
```js
function renderTabletLogin() {
  return `
    <div class="...">
      <h1>${escapeHtml(title)}</h1>
      <button onclick="doSomething()">Click</button>
    </div>
  `;
}
```

`escapeHtml()` é usado **explicitamente** onde há dado de usuário. Em outros lugares, NÃO. Isso é dívida técnica — XSS é possível teoricamente, embora o sistema seja monousuário sem dados de terceiros.

### 10.3 Event handlers inline

Toda interação usa `onclick="..."`, `onsubmit="..."`, etc. Sem `addEventListener`, sem delegation. Funciona porque o `render()` reconstrói tudo.

### 10.4 Theming

Três temas para o tablet (`State.tabletTheme`):
- `dark` (padrão)
- `light`
- `hc` (alto contraste — pra sol forte na cabine)

CSS via classes (`.tablet-light`, `.tablet-hc`) aplicadas no `<main>`. Painel gerencial sempre claro.

### 10.5 Identidade visual Petra

- Azul Petra: `#043f89`
- Amarelo Petra: `#f4c718`
- Fontes: Archivo (títulos), DM Sans (corpo)

Definidas no Tailwind config (linhas 12–34) e usadas em todo lugar como `petra-blue`, `petra-yellow`, `font-display`, etc.

---

## 11. Dívidas técnicas conhecidas

Coisas a notar antes de mexer (não é uma crítica — o sistema funciona; é só o que você vai encontrar):

1. **Monolito de 7.857 linhas** num só arquivo. Sem modularização. Refatorar pra módulos ES, ou direto para um framework, é o salto óbvio.
2. **Sem build system, sem TypeScript, sem testes.** Tudo client-side puro.
3. **Render full a cada mudança** — funciona em hardware moderno, mas é caro. Virtual DOM ou signals (SolidJS, Svelte) resolveriam.
4. **Mutação direta do State** — Redux/Zustand/qualquer store imutável daria mais previsibilidade.
5. **Persistência manual** (v46) — não escala. Próximo passo: IndexedDB ou backend.
6. **Sem sincronização entre tablets** — cada tablet é uma ilha. Vários operadores em vários tablets, dados não conversam. Backend resolve.
7. **Escape de HTML inconsistente.** XSS é teoricamente possível.
8. **Handlers inline `onclick="..."`** em strings — sem type checking, refatorar nome de função é arriscado.
9. **`saveState()` é no-op mas é chamada em ~60 lugares.** Funciona, mas é confuso de ler. Limpar isso é um bom primeiro PR.
10. **Comentários de versão (v44.1, v45 — X.Y) espalhados** — bom histórico, mas ruído visual. Mover pra changelog.
11. **Limite de 5000 eventos no histórico** — eventos antigos são truncados e baixados como JSON automático. Backend resolve.
12. **Sem `data-testid` ou seletores estáveis** — automação/testes ficam difíceis.

---

## 12. Sugestões para a refatoração

Tomar como **input de especificação**, não como base de código. O HTML mostra **o que** o sistema faz, mas **como** ele faz não é o desejável a longo prazo.

**Caminho sugerido (em ordem de prioridade):**

1. **Backend leve + sync.** Mesmo um Supabase/Firebase básico já elimina os principais problemas (persistência, sincronização entre tablets, histórico ilimitado, multi-usuário). O modelo de dados desta documentação serve de schema inicial.
2. **PWA com IndexedDB para offline-first.** Tablets perdem conexão; o sistema precisa funcionar offline e sincronizar quando voltar.
3. **Framework reativo.** React, Vue ou Svelte — qualquer um — pra parar de re-renderizar tudo a cada clique.
4. **TypeScript.** Modelo de dados é complexo (State tem ~20 campos top-level com sub-objetos). Tipos ajudam muito.
5. **Modularizar por domínio:** cadastros, tablet (operação), gerencial, PCP, estoque, relatórios. Cada um vira um módulo/feature.
6. **Testes** (unit e e2e). O sistema lida com dados operacionais reais, precisa de garantia.

**Plataformas pra considerar:**

- **Tablet em cabine** geralmente é Android. Pode continuar como PWA web (mais simples de manter) ou virar app nativo / React Native (melhor integração com câmera, NFC, leitor de QR pra operador).
- **Painel gerencial** continua web desktop.

**Integrações que provavelmente vão entrar depois** (contexto da Petra, não estão neste arquivo):

- **Protheus (ERP)** — equipamentos cadastrados, ordens de produção, pesagens oficiais
- **Power BI** — exportar eventos pra análise (o Iago já mantém dashboards em Power BI)
- **CFEM / ANM** — registros para royalty mineral

---

## 13. Como rodar o que existe hoje

O arquivo é auto-suficiente:

1. Abrir `parte_diaria_v46.html` em um navegador moderno (Chrome, Edge, Firefox recentes)
2. Aguardar fontes e CDN carregarem
3. **Credenciais de demo:**
   - Tablet: `admin/admin` (admin) ou `operador/123` (operador comum)
   - Gerencial: `admin/admin`
4. O sistema carrega com dados-semente (frota, alguns eventos do dia, estoque). Não há persistência automática — qualquer mudança se perde no refresh.
5. Para salvar progresso: painel gerencial → botão **Backup** (gera JSON)
6. Para carregar: painel gerencial → botão **Restaurar**

---

## 14. Contato e contexto

- **Empresa:** Petra Agregados (pedreira, MG e RJ)
- **Identidade visual:** Azul `#043f89`, Amarelo `#f4c718`. Fontes: Archivo (display), DM Sans (corpo). Mascote: Tião (pedreiro ilustrado).
- **Quem encomendou:** Iago Andrade de Sá — operations analyst que vai ser seu ponto de contato técnico. Tem expertise em BI, ERP, e conhece o domínio (pedreira) profundamente. Comunicação dele é direta e objetiva.

Boa refatoração.
