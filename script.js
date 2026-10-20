/* =====================================================
   DADOS DO PROJETO (edite aqui)
===================================================== */
const criadoras = ["Emanuelle", "Ana Luiza"];

const equipe = ["Emanuelle", "Matheus", "Ana Luiza", "Gabriela", "Maria Coneglian", "Anne"];

const turmaInfo = "Projeto de Química · Professor(a): Cida Borges";

// Cole aqui o link do Kahoot entre as aspas
const linkDoKahoot = "";

const referencias = [
  {
    texto: "SCIENCE BUDDIES. Charge from Change: Make a Coin Battery.",
    url: "https://www.sciencebuddies.org/stem-activities/charge-from-change-make-a-coin-battery"
  },
  {
    texto: "EXPLORATORIUM (Julie Yu). Penny Battery.",
    url: "https://www.exploratorium.edu/snacks/penny-battery"
  },
  {
    texto: "ROYAL SOCIETY OF CHEMISTRY. Global Experiment: build a coin battery.",
    url: "https://edu.rsc.org/global-experiment/how-to-take-part/investigation-1"
  },
  {
    texto: "INFOESCOLA. Alessandro Volta.",
    url: "https://www.infoescola.com/biografias/alessandro-volta"
  },
  {
    texto: "INFOPÉDIA. Pilha de Volta.",
    url: "https://www.infopedia.pt/artigos/$pilha-de-volta"
  }
];

// Valores de exemplo para as simulações
const TENSAO_CELULA = 0.8;  // volts por célula (aproximado)
const TENSAO_LED = 3.0;     // tensão aproximada para o LED acender
const MAX_CELULAS = 8;

function formatarVolts(v) {
  return v.toFixed(1).replace(".", ",") + " V";
}

/* =====================================================
   NAVEGAÇÃO ENTRE PÁGINAS (com transição)
===================================================== */
const paginas = Array.from(document.querySelectorAll(".pagina"));
const menuLista = document.getElementById("menu-lista");
const rodape = document.querySelector(".rodape");
const contador = document.getElementById("contador");
const barra = document.getElementById("barra");
const nomePagina = document.getElementById("nome-pagina");
const btnAnterior = document.getElementById("anterior");
const btnProximo = document.getElementById("proximo");

let atual = 0;
const visitadas = new Set([0]);
const itensMenu = [];

paginas.forEach((pag, i) => {
  const cor = pag.style.getPropertyValue("--cor").trim();

  const num = pag.querySelector(".num");
  if (num) num.textContent = String(i + 1).padStart(2, "0");

  const botao = document.createElement("button");
  botao.className = "item";
  botao.style.setProperty("--cor", cor);
  botao.title = pag.dataset.titulo;
  botao.innerHTML =
    '<span class="chip">' + pag.dataset.icone + "</span>" +
    '<span class="nome">' + pag.dataset.titulo + "</span>" +
    '<span class="visto">✓</span>';
  botao.addEventListener("click", () => irPara(i));

  menuLista.appendChild(botao);
  itensMenu.push(botao);
});

function atualizarInterface() {
  itensMenu.forEach((b, i) => {
    b.classList.toggle("ativo", i === atual);
    b.classList.toggle("visitado", visitadas.has(i) && i !== atual);
  });

  const pag = paginas[atual];
  rodape.style.setProperty("--cor", pag.style.getPropertyValue("--cor").trim());

  contador.textContent = (atual + 1) + " / " + paginas.length;
  barra.style.width = ((atual + 1) / paginas.length * 100) + "%";
  nomePagina.textContent = pag.dataset.icone + " " + pag.dataset.titulo;
  btnAnterior.disabled = atual === 0;
  btnProximo.disabled = atual === paginas.length - 1;

  itensMenu[atual].scrollIntoView({ block: "nearest" });
}

function irPara(novo) {
  if (novo === atual || novo < 0 || novo >= paginas.length) return;

  const direcao = novo > atual ? "dir" : "esq";
  const velha = paginas[atual];
  const nova = paginas[novo];

  velha.classList.remove("ativa", "entra-dir", "entra-esq");
  velha.classList.add("saindo", "sai-" + direcao);
  setTimeout(() => velha.classList.remove("saindo", "sai-dir", "sai-esq"), 350);

  nova.classList.remove("saindo", "sai-dir", "sai-esq", "entra-dir", "entra-esq");
  nova.classList.add("ativa", "entra-" + direcao);
  nova.scrollTop = 0;

  atual = novo;
  visitadas.add(novo);
  atualizarInterface();

  if (nova.id === "p-circuito") ajustarCena();
}

btnAnterior.addEventListener("click", () => irPara(atual - 1));
btnProximo.addEventListener("click", () => irPara(atual + 1));

// Botões que levam a uma página pelo nome (id)
document.querySelectorAll("[data-ir-id]").forEach((b) => {
  b.addEventListener("click", () => {
    const destino = paginas.findIndex((p) => p.id === b.dataset.irId);
    if (destino >= 0) irPara(destino);
  });
});

document.addEventListener("keydown", (e) => {
  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
  if (e.key === "ArrowRight") irPara(atual + 1);
  if (e.key === "ArrowLeft") irPara(atual - 1);
});

/* =====================================================
   CARTAS QUE VIRAM
===================================================== */
document.querySelectorAll(".carta").forEach((carta) => {
  const virar = () => carta.classList.toggle("virada");
  carta.addEventListener("click", virar);
  carta.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      virar();
    }
  });
});

/* =====================================================
   SEGURANÇA: REGRAS
===================================================== */
const regras = document.querySelectorAll(".regra");
const msgRegras = document.getElementById("msg-regras");

regras.forEach((r) => {
  r.addEventListener("click", () => {
    r.classList.toggle("lida");
    const n = document.querySelectorAll(".regra.lida").length;
    const completo = n === regras.length;
    msgRegras.textContent = completo
      ? "🏅 Parabéns! Você é um cientista seguro e já pode ir para o experimento!"
      : "Você leu " + n + " de " + regras.length + " regras.";
    msgRegras.classList.toggle("pronto", completo);
  });
});

/* =====================================================
   VOLT: CAIXA D'ÁGUA
===================================================== */
const sliderAgua = document.getElementById("slider-agua");
const cano = document.getElementById("cano");

function atualizarAgua() {
  const n = Number(sliderAgua.value);
  document.getElementById("n-agua").textContent = n;
  document.getElementById("volt-agua").textContent = formatarVolts(n * TENSAO_CELULA);
  document.getElementById("nivel").style.height = (n / 6 * 100) + "%";
  cano.style.setProperty("--vel", (2.4 - n * 0.3) + "s");

  let texto;
  if (n === 1) texto = "Caixa baixinha: o empurrão é fraquinho.";
  else if (n < 4) texto = "A caixa está subindo! Mais células, mais empurrão.";
  else texto = "Caixa bem alta! Agora o empurrão é forte.";
  document.getElementById("txt-agua").textContent = texto;
}

sliderAgua.addEventListener("input", atualizarAgua);
atualizarAgua();

/* =====================================================
   MATERIAIS: CHECKLIST
===================================================== */
const materiais = document.querySelectorAll(".mat");
const msgMateriais = document.getElementById("msg-materiais");

materiais.forEach((m) => {
  m.addEventListener("click", () => {
    m.classList.toggle("pronto");
    const n = document.querySelectorAll(".mat.pronto").length;
    const completo = n === materiais.length;
    msgMateriais.textContent = completo
      ? "🎉 Tudo separado! Podemos montar a pilha."
      : "Separados: " + n + " de " + materiais.length + ".";
    msgMateriais.classList.toggle("pronto", completo);
  });
});

/* =====================================================
   LÍQUIDOS: VOTAÇÃO E TABELA
===================================================== */
const votos = { vinagre: 0, sal: 0, empate: 0 };

function atualizarVotos() {
  const total = votos.vinagre + votos.sal + votos.empate;
  Object.keys(votos).forEach((k) => {
    document.getElementById("cont-" + k).textContent = votos[k];
    document.getElementById("barra-" + k).style.width =
      (total ? votos[k] / total * 100 : 0) + "%";
  });
}

document.querySelectorAll("[data-voto]").forEach((b) => {
  b.addEventListener("click", () => {
    votos[b.dataset.voto]++;
    atualizarVotos();
  });
});

document.getElementById("comparar").addEventListener("click", () => {
  const linhas = document.querySelectorAll("#tabela tbody tr");
  let vitV = 0, vitS = 0, emp = 0, somaV = 0, somaS = 0, n = 0;

  linhas.forEach((linha) => {
    const campos = linha.querySelectorAll("input");
    const a = parseFloat(campos[0].value.replace(",", "."));
    const b = parseFloat(campos[1].value.replace(",", "."));
    if (!isNaN(a) && !isNaN(b)) {
      n++;
      somaV += a;
      somaS += b;
      if (a > b) vitV++;
      else if (b > a) vitS++;
      else emp++;
    }
  });

  const resultado = document.getElementById("resultado-comparar");

  if (n === 0) {
    resultado.textContent = "Preencha pelo menos uma linha com os dois valores.";
    return;
  }

  const mediaV = (somaV / n).toFixed(2).replace(".", ",");
  const mediaS = (somaS / n).toFixed(2).replace(".", ",");
  let texto;

  if (somaV > somaS) {
    texto = "🍶 O vinagre rendeu mais! Média: " + mediaV + " V contra " + mediaS +
      " V. Pense: o H⁺ do ácido recebe elétrons rápido no cobre.";
  } else if (somaS > somaV) {
    texto = "🧂 A água com sal rendeu mais! Média: " + mediaS + " V contra " + mediaV +
      " V. Interessante! O resultado pode mudar com a montagem e a quantidade de líquido. Cientistas repetem os testes!";
  } else {
    texto = "🤝 Empate! As médias foram iguais (" + mediaV + " V).";
  }

  resultado.textContent = texto + " (Vinagre ganhou " + vitV + ", água com sal ganhou " + vitS + ", empates " + emp + ".)";
});

/* =====================================================
   MONTAGEM DA PILHA
===================================================== */
let liquido = "vinagre";

const ordemCerta = ["zinco", "papel", "cobre"];
const areaMontagem = document.getElementById("montagem-pilha");
const msgMontagem = document.getElementById("msg-montagem");
let montagem = [];

function nomeCamada(tipo) {
  if (tipo === "papel") {
    return "papel molhado (" + (liquido === "vinagre" ? "vinagre" : "água com sal") + ")";
  }
  return tipo;
}

function desenharCamadas(area, lista) {
  area.innerHTML = "";
  lista.forEach((tipo) => {
    const div = document.createElement("div");
    div.className = "camada " + tipo + (tipo === "papel" ? " " + liquido : "");
    area.appendChild(div);
  });
}

function mensagem(texto, classe) {
  msgMontagem.textContent = texto;
  msgMontagem.className = "mensagem " + (classe || "");
}

document.querySelectorAll(".material").forEach((botao) => {
  botao.addEventListener("click", () => {
    if (montagem.length >= 9) return;

    const tipo = botao.dataset.tipo;
    const esperado = ordemCerta[montagem.length % 3];

    if (tipo === esperado) {
      montagem.push(tipo);
      desenharCamadas(areaMontagem, montagem);

      const total = montagem.length;
      if (total === 9) {
        mensagem("🎉 Parabéns! Você montou 3 células em série!", "certo");
      } else if (total % 3 === 0) {
        mensagem("✅ Célula " + (total / 3) + " pronta! Continue para somar mais volts.", "certo");
      } else {
        mensagem("✅ Certo! Agora: " + nomeCamada(ordemCerta[total % 3]) + ".", "certo");
      }
    } else {
      mensagem("❌ Ops! Agora precisa ser: " + nomeCamada(esperado) + ".", "erro");
      areaMontagem.classList.remove("tremer");
      void areaMontagem.offsetWidth;
      areaMontagem.classList.add("tremer");
    }
  });
});

document.getElementById("limpar-montagem").addEventListener("click", () => {
  montagem = [];
  desenharCamadas(areaMontagem, montagem);
  mensagem("Comece pelo zinco!", "");
});

document.querySelectorAll(".chip-liq").forEach((chip) => {
  chip.addEventListener("click", () => {
    liquido = chip.dataset.liq;
    document.querySelectorAll(".chip-liq").forEach((c) => c.classList.toggle("ativo", c === chip));
    desenharCamadas(areaMontagem, montagem);
    atualizarLab();
    mensagem("Líquido escolhido: " + (liquido === "vinagre" ? "vinagre 🍶" : "água com sal 🧂") + ".", "");
  });
});

/* =====================================================
   EXPERIMENTO: PASSO A PASSO
===================================================== */
const passosExp = document.querySelectorAll(".exp-passo");
const barraExp = document.getElementById("barra-exp");
const msgExp = document.getElementById("msg-exp");

passosExp.forEach((passoExp) => {
  const botao = passoExp.querySelector(".exp-feito");

  botao.addEventListener("click", () => {
    const feito = passoExp.classList.toggle("feito");
    botao.textContent = feito ? "✔ Feito!" : "Feito!";

    const n = document.querySelectorAll(".exp-passo.feito").length;
    const total = passosExp.length;
    const completo = n === total;

    barraExp.style.width = (n / total * 100) + "%";
    msgExp.textContent = completo
      ? "🏆 Experimento completo! Agora vamos para a conclusão."
      : "Passos feitos: " + n + " de " + total + ".";
    msgExp.classList.toggle("pronto", completo);
  });
});

/* =====================================================
   CIRCUITO: PASSO A PASSO
===================================================== */
const passosCircuito = [
  {
    titulo: "1. Conheça a pilha",
    texto: "Temos um copo com líquido (vinagre ou água com sal), uma placa de zinco e uma de cobre. Elas estão ligadas por um fio com uma lâmpada. Por enquanto, nada acontece!"
  },
  {
    titulo: "2. O zinco solta elétrons",
    texto: "O zinco é um metal que gosta de “soltar” elétrons, aquelas bolinhas minúsculas com carga elétrica. Quando ele solta elétrons, dizemos que ele oxida (perde elétrons)."
  },
  {
    titulo: "3. Fio aberto: ninguém passa",
    texto: "Os elétrons querem ir para o cobre, mas o fio está aberto, como uma ponte levadiça levantada. Sem um caminho fechado (o circuito), eles ficam em fila, esperando. Por isso a lâmpada não acende."
  },
  {
    titulo: "4. Fechou o circuito: corre, elétron!",
    texto: "Agora o fio está ligado! Os elétrons correm do zinco até o cobre passando pela lâmpada, como crianças numa corrida de revezamento. Esse movimento é a corrente elétrica, e ela faz a luz acender!"
  },
  {
    titulo: "5. Dentro do copo também tem movimento",
    texto: "No líquido, partículas chamadas íons também andam: as laranjas (+) e as roxas (−). Elas fecham o caminho por dentro do copo. No cobre, os elétrons são recebidos (redução). Enquanto houver zinco para gastar, a pilha funciona."
  }
];

let passo = 0;
const cena = document.getElementById("cena");
const pontosDiv = document.getElementById("pontos");
const btnPassoAnt = document.getElementById("passo-ant");
const btnPassoProx = document.getElementById("passo-prox");

passosCircuito.forEach((_, i) => {
  const ponto = document.createElement("button");
  ponto.className = "ponto";
  ponto.setAttribute("aria-label", "Passo " + (i + 1));
  ponto.addEventListener("click", () => mostrarPasso(i));
  pontosDiv.appendChild(ponto);
});

function mostrarPasso(n) {
  passo = n;
  cena.dataset.passo = n;
  cena.classList.toggle("fechado", n >= 3);

  document.getElementById("leg-titulo").textContent = passosCircuito[n].titulo;
  document.getElementById("leg-texto").textContent = passosCircuito[n].texto;

  pontosDiv.querySelectorAll(".ponto").forEach((p, i) => {
    p.classList.toggle("ativo", i === n);
    p.classList.toggle("feito", i < n);
  });

  btnPassoAnt.disabled = n === 0;
  btnPassoProx.disabled = n === passosCircuito.length - 1;
}

btnPassoAnt.addEventListener("click", () => { if (passo > 0) mostrarPasso(passo - 1); });
btnPassoProx.addEventListener("click", () => { if (passo < passosCircuito.length - 1) mostrarPasso(passo + 1); });

// Ajusta o tamanho da cena para caber na tela
function ajustarCena() {
  const wrap = document.getElementById("cena-wrap");
  const largura = wrap.parentElement.clientWidth - 46;
  if (largura <= 0) return;
  const escala = Math.min(1, largura / 640);
  cena.style.transform = "scale(" + escala + ")";
  wrap.style.width = (640 * escala) + "px";
  wrap.style.height = (340 * escala) + "px";
}

window.addEventListener("resize", ajustarCena);
mostrarPasso(0);

/* =====================================================
   VOLTÍMETRO E LED
===================================================== */
let celulas = 1;

const labPilha = document.getElementById("lab-pilha");
const voltagem = document.getElementById("voltagem");
const led = document.getElementById("led");
const msgLab = document.getElementById("msg-lab");

function atualizarLab() {
  const camadas = [];
  for (let i = 0; i < celulas; i++) {
    camadas.push("zinco", "papel", "cobre");
  }
  desenharCamadas(labPilha, camadas);

  const volts = celulas * TENSAO_CELULA;
  voltagem.textContent = formatarVolts(volts);

  if (volts >= TENSAO_LED) {
    const extra = celulas - Math.ceil(TENSAO_LED / TENSAO_CELULA);
    led.classList.add("aceso");
    led.style.boxShadow = "0 0 " + (40 + extra * 10) + "px " + (18 + extra * 4) + "px #ffe44d99";
    msgLab.textContent = "💡 O LED acendeu! As tensões somadas foram suficientes.";
    msgLab.className = "mensagem certo";
  } else {
    led.classList.remove("aceso");
    led.style.boxShadow = "";
    const plural = celulas === 1 ? "célula" : "células";
    msgLab.textContent = celulas + " " + plural + ": ainda é pouco para o LED. Adicione mais!";
    msgLab.className = "mensagem";
  }
}

document.getElementById("mais").addEventListener("click", () => {
  if (celulas < MAX_CELULAS) {
    celulas++;
    atualizarLab();
  }
});

document.getElementById("menos").addEventListener("click", () => {
  if (celulas > 1) {
    celulas--;
    atualizarLab();
  }
});

atualizarLab();

/* =====================================================
   NO DIA A DIA: ESCADA DE VOLTS
===================================================== */
const itensVolts = [
  { emoji: "🪙", nome: "Uma célula da nossa pilha", v: 0.8, texto: "Bem pouquinho! Por isso a gente empilha várias células para acender o LED.", cor: "#2f9e44" },
  { emoji: "🔋", nome: "Pilha AA (brinquedos)", v: 1.5, texto: "É a pilha comum de brinquedos e controles. O controle remoto costuma usar 2, somando 3 V.", cor: "#1971c2" },
  { emoji: "📱", nome: "Bateria do celular", v: 3.7, texto: "A bateria do celular tem cerca de 3,7 V. O carregador entrega uns 5 V.", cor: "#7c4dff" },
  { emoji: "🚗", nome: "Bateria de carro", v: 12, texto: "Dá a partida no motor. Nunca mexa nela sem um adulto!", cor: "#e8710a" },
  { emoji: "🔌", nome: "Tomada da parede", v: 127, texto: "⚠️ MUITO mais forte que qualquer pilha (127 V ou 220 V, conforme a cidade). É perigosa! Crianças nunca mexem em tomadas.", cor: "#e5484d" }
];

const escada = document.getElementById("escada");
const detalheVolts = document.getElementById("detalhe-volts");

itensVolts.forEach((item) => {
  const botao = document.createElement("button");
  botao.className = "escada-item";
  botao.style.setProperty("--c", item.cor);

  const largura = Math.max(3, item.v / 127 * 100);
  const valor = String(item.v).replace(".", ",") + " V";

  botao.innerHTML =
    "<span>" + item.emoji + " " + item.nome + "</span>" +
    '<span class="trilho-e"><span style="width:' + largura + '%"></span></span>' +
    "<strong>" + (item.v === 127 ? "127 / 220 V" : valor) + "</strong>";

  botao.addEventListener("click", () => {
    document.querySelectorAll(".escada-item").forEach((b) => b.classList.remove("ativo"));
    botao.classList.add("ativo");
    detalheVolts.textContent = item.emoji + " " + item.texto;
  });

  escada.appendChild(botao);
});

/* =====================================================
   CONCLUSÃO: PREENCHER COM OS DADOS DA TABELA
===================================================== */
document.getElementById("preencher-conclusao").addEventListener("click", () => {
  const hipotese = document.getElementById("hipotese").value.trim();
  document.getElementById("hipotese-final").textContent =
    hipotese !== "" ? hipotese : "(a turma não escreveu a hipótese)";

  const linhas = document.querySelectorAll("#tabela tbody tr");
  const partes = [];
  let somaV = 0, somaS = 0, n = 0;

  linhas.forEach((linha, i) => {
    const campos = linha.querySelectorAll("input");
    const a = parseFloat(campos[0].value.replace(",", "."));
    const b = parseFloat(campos[1].value.replace(",", "."));
    if (!isNaN(a) && !isNaN(b)) {
      n++;
      somaV += a;
      somaS += b;
      partes.push(
        (i + 1) + " célula(s): vinagre " + a.toFixed(2).replace(".", ",") +
        " V, água com sal " + b.toFixed(2).replace(".", ",") + " V."
      );
    }
  });

  const campo = document.getElementById("obs-final");

  if (n === 0) {
    campo.value = "Ainda não temos medidas na tabela. Volte à página “Vinagre × água com sal”, digite os volts e clique de novo aqui. Você também pode escrever à mão.";
    return;
  }

  let vencedor;
  if (somaV > somaS) vencedor = "No nosso teste, o vinagre rendeu mais volts.";
  else if (somaS > somaV) vencedor = "No nosso teste, a água com sal rendeu mais volts.";
  else vencedor = "No nosso teste, os dois líquidos renderam o mesmo.";

  campo.value = partes.join("\n") + "\n" + vencedor +
    "\nO LED acendeu? (escreva aqui: sim / não / com quantas células)";
});

/* =====================================================
   KAHOOT
===================================================== */
const botaoKahoot = document.getElementById("linkKahoot");

if (linkDoKahoot.trim() !== "") {
  botaoKahoot.href = https://kahoot.it/?pin=178372&refer_method=link;
} else {
  botaoKahoot.addEventListener("click", (e) => {
    e.preventDefault();
    alert("https://kahoot.it/?pin=178372&refer_method=link");
  });
}

/* =====================================================
   CRÉDITOS E REFERÊNCIAS
===================================================== */
document.getElementById("menu-creditos").textContent = criadoras.join(" e ");
document.getElementById("criadoras").textContent = criadoras.join(" e ");
document.getElementById("equipe-final").textContent = equipe.join(", ");
document.getElementById("info-turma").textContent = turmaInfo;

const listaRefs = document.getElementById("refs");
referencias.forEach((ref) => {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(ref.texto + " Disponível em: "));
  const a = document.createElement("a");
  a.href = ref.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = ref.url;
  li.appendChild(a);
  listaRefs.appendChild(li);
});

/* =====================================================
   COMEÇAR
===================================================== */
atualizarInterface();