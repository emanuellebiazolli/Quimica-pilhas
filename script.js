
document.addEventListener("DOMContentLoaded", () => {
  const paginas = [...document.querySelectorAll(".pagina")];
  const menu = document.getElementById("menu-lista");
  const barra = document.getElementById("barra");
  const contador = document.getElementById("contador");
  const tituloAtual = document.getElementById("titulo-atual");
  const nomePagina = document.getElementById("nome-pagina");

  let paginaAtual = 0;

  // MENU E NAVEGAÇÃO
  paginas.forEach((pagina, indice) => {
    const botao = document.createElement("button");
    botao.className = "item-menu";
    botao.type = "button";
    botao.textContent =
      `${pagina.dataset.icone || "📄"} ${pagina.dataset.titulo || "Página"}`;

    botao.addEventListener("click", () => mostrarPagina(indice));
    menu.appendChild(botao);
  });

  const botoesMenu = [...menu.querySelectorAll(".item-menu")];

  function mostrarPagina(indice) {
    paginaAtual = Math.max(0, Math.min(indice, paginas.length - 1));

    paginas.forEach((pagina, i) => {
      pagina.classList.toggle("ativa", i === paginaAtual);
    });

    botoesMenu.forEach((botao, i) => {
      botao.classList.toggle("ativo", i === paginaAtual);

      if (i === paginaAtual) {
        botao.setAttribute("aria-current", "page");
      } else {
        botao.removeAttribute("aria-current");
      }
    });

    const pagina = paginas[paginaAtual];
    const titulo = `${pagina.dataset.icone || ""} ${pagina.dataset.titulo || ""}`;

    tituloAtual.textContent = titulo;
    nomePagina.textContent = pagina.dataset.titulo || "";
    contador.textContent = `${paginaAtual + 1} / ${paginas.length}`;
    barra.style.width = `${((paginaAtual + 1) / paginas.length) * 100}%`;

    document.getElementById("anterior").disabled = paginaAtual === 0;
    document.getElementById("proximo").disabled =
      paginaAtual === paginas.length - 1;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll("[data-ir]").forEach(botao => {
    botao.addEventListener("click", () => {
      const destino = paginas.findIndex(p => p.id === botao.dataset.ir);
      if (destino >= 0) mostrarPagina(destino);
    });
  });

  document.getElementById("anterior").addEventListener("click", () => {
    mostrarPagina(paginaAtual - 1);
  });

  document.getElementById("proximo").addEventListener("click", () => {
    mostrarPagina(paginaAtual + 1);
  });

  // CARTÕES DE SEGURANÇA
  const regras = [...document.querySelectorAll(".regra")];
  const msgRegras = document.getElementById("msg-regras");

  regras.forEach(regra => {
    regra.addEventListener("click", () => {
      regra.classList.toggle("lida");

      const total = regras.filter(r => r.classList.contains("lida")).length;

      msgRegras.textContent = total === regras.length
        ? "🎉 Todas as regras foram lidas! Segurança em primeiro lugar!"
        : `Você leu ${total} de ${regras.length} regras.`;

      regra.querySelector(".marcador").textContent =
        regra.classList.contains("lida")
          ? "Regra lida!"
          : "Marcar como lida";
    });
  });

  // CARTÕES DE PALAVRAS: VIRAR E DESVIRAR
  document.querySelectorAll(".carta").forEach(carta => {
    carta.addEventListener("click", () => {
      carta.classList.toggle("virada");
    });
  });

  // SIMULAÇÃO DE TENSÃO E BOLINHAS
  const sliderAgua = document.getElementById("slider-agua");

  function atualizarAgua() {
    const quantidade = Number(sliderAgua.value);
    const volts = quantidade * 0.8;

    document.getElementById("n-agua").textContent = quantidade;

    document.getElementById("volt-agua").textContent =
      `${volts.toFixed(1).replace(".", ",")} V`;

    document.getElementById("nivel").style.height =
      `${Math.min(quantidade * 15, 95)}%`;

    document.getElementById("txt-agua").textContent =
      `Simulação: ${quantidade} célula(s), com tensão ilustrativa de ` +
      `${volts.toFixed(1).replace(".", ",")} V. ` +
      "Uma pilha real pode apresentar outros valores.";
  }

  sliderAgua.addEventListener("input", atualizarAgua);
  atualizarAgua();

  // LISTA DE MATERIAIS
  const materiais = [...document.querySelectorAll(".material")];
  const msgMateriais = document.getElementById("msg-materiais");

  function atualizarMateriais() {
    const selecionados = materiais.filter(m =>
      m.classList.contains("selecionado")
    ).length;

    msgMateriais.textContent = selecionados === materiais.length
      ? "🎉 Todos os materiais foram separados!"
      : `Itens separados: ${selecionados} de ${materiais.length}.`;
  }

  materiais.forEach(material => {
    material.addEventListener("click", () => {
      material.classList.toggle("selecionado");
      atualizarMateriais();
    });
  });

  // ILUSTRAÇÃO DA PILHA POR CAMADAS
  const pilhaMontagem = document.getElementById("montagem-pilha");
  const msgMontagem = document.getElementById("msg-montagem");
  let celulas = 2;

  function desenharPilha() {
    pilhaMontagem.innerHTML = "";

    for (let i = 0; i < celulas; i++) {
      ["zinco", "papel", "cobre"].forEach(tipo => {
        const camada = document.createElement("div");
        camada.className = `camada ${tipo}`;

        const nomes = {
          zinco: "Zinco",
          papel: "Papel umedecido",
          cobre: "Cobre"
        };

        camada.textContent = nomes[tipo];
        pilhaMontagem.appendChild(camada);
      });
    }

    msgMontagem.textContent =
      `Ilustração: ${celulas} célula(s), com ${celulas * 3} camadas representadas.`;
  }

  document.getElementById("mais-camada").addEventListener("click", () => {
    if (celulas < 6) {
      celulas++;
      desenharPilha();
    }
  });

  document.getElementById("menos-camada").addEventListener("click", () => {
    if (celulas > 1) {
      celulas--;
      desenharPilha();
    }
  });

  desenharPilha();

  // CAMINHO DOS ELÉTRONS
  const passos = [
    {
      titulo: "1. A reação começa",
      texto: "Uma reação química em um dos metais pode liberar elétrons.",
      eletrons: "●  e⁻  ●  e⁻",
      lampada: false
    },
    {
      titulo: "2. Os elétrons percorrem o fio",
      texto: "Quando há um caminho externo fechado, os elétrons podem circular pelo condutor.",
      eletrons: "● ➜ e⁻ ➜ ● ➜ e⁻",
      lampada: false
    },
    {
      titulo: "3. A energia chega ao LED",
      texto: "Se a tensão e a corrente forem adequadas e o LED estiver ligado na orientação correta, ele pode acender.",
      eletrons: "● ➜ e⁻ ➜ ● ➜ e⁻ ➜",
      lampada: true
    },
    {
      titulo: "4. Os íons também se movimentam",
      texto: "Dentro da pilha, os íons do eletrólito se movimentam e ajudam a manter o equilíbrio das cargas.",
      eletrons: "● ➜ e⁻ ➜ circuito fechado",
      lampada: true
    }
  ];

  let passoAtual = 0;

  function atualizarPasso() {
    const passo = passos[passoAtual];

    document.getElementById("leg-titulo").textContent = passo.titulo;
    document.getElementById("leg-texto").textContent = passo.texto;
    document.getElementById("eletrons").textContent = passo.eletrons;

    document.getElementById("passo-num").textContent =
      `Passo ${passoAtual + 1} de ${passos.length}`;

    document.getElementById("lampada").classList.toggle(
      "ligada",
      passo.lampada
    );

    document.getElementById("passo-ant").disabled = passoAtual === 0;
    document.getElementById("passo-prox").disabled =
      passoAtual === passos.length - 1;
  }

  document.getElementById("passo-ant").addEventListener("click", () => {
    if (passoAtual > 0) {
      passoAtual--;
      atualizarPasso();
    }
  });

  document.getElementById("passo-prox").addEventListener("click", () => {
    if (passoAtual < passos.length - 1) {
      passoAtual++;
      atualizarPasso();
    }
  });

  atualizarPasso();

  // VOLTÍMETRO E LED VIRTUAIS
  let celulasSimuladas = 1;

  function atualizarLaboratorio() {
    const volts = celulasSimuladas * 0.8;
    const valor = `${volts.toFixed(1).replace(".", ",")} V`;

    document.getElementById("voltagem").textContent = valor;

    document.getElementById("msg-lab").textContent =
      `${celulasSimuladas} célula(s) simulada(s).`;

    const pilhaMini = document.getElementById("lab-pilha");
    pilhaMini.innerHTML = "";

    for (let i = 0; i < celulasSimuladas; i++) {
      const camada = document.createElement("span");
      pilhaMini.appendChild(camada);
    }

    // Regra visual da simulação, não um teste real.
    const ledLigado = celulasSimuladas >= 3;

    document.getElementById("led").classList.toggle("ligado", ledLigado);

    document.getElementById("msg-led").textContent = ledLigado
      ? "Na simulação, o LED está aceso."
      : "Na simulação, o LED está apagado.";
  }

  document.getElementById("mais").addEventListener("click", () => {
    if (celulasSimuladas < 6) {
      celulasSimuladas++;
      atualizarLaboratorio();
    }
  });

  document.getElementById("menos").addEventListener("click", () => {
    if (celulasSimuladas > 1) {
      celulasSimuladas--;
      atualizarLaboratorio();
    }
  });

  atualizarLaboratorio();

  // VOLTS NO DIA A DIA
  document.querySelectorAll(".item-volt").forEach(item => {
    item.addEventListener("click", () => {
      const nome = item.dataset.nome;
      const valor = item.dataset.valor;
      const descricao = item.dataset.desc;

      const detalhe = document.getElementById("detalhe-volts");
      detalhe.innerHTML = "";

      const titulo = document.createElement("h2");
      titulo.textContent = `${nome}: ${valor}`;

      const texto = document.createElement("p");
      texto.textContent = descricao;

      detalhe.append(titulo, texto);
    });
  });

  // INICIAR NA PRIMEIRA PÁGINA
  mostrarPagina(0);
});
