const catalog = document.getElementById("catalog");
const sectionsNav = document.getElementById("sectionsNav");
const search = document.getElementById("search");
const productCount = document.getElementById("productCount");
const generatedDate = document.getElementById("generatedDate");
const backToTop = document.getElementById("backToTop");

let produtos = [];
let dados = null;

async function carregarCatalogo() {
  try {
    const response = await fetch("produtos.json");

    if (!response.ok)
      throw new Error("Não foi possível carregar produtos.json");

    dados = await response.json();

    produtos = dados.produtos;

    productCount.textContent = dados.quantidade;

    generatedDate.textContent = new Date(dados.geradoEm).toLocaleDateString(
      "pt-BR",
    );

    renderizar(produtos);
  } catch (erro) {
    catalog.innerHTML = `
            <h2>Erro ao carregar catálogo</h2>
            <p>${erro.message}</p>
        `;

    console.error(erro);
  }
}

function renderizar(lista) {
  catalog.innerHTML = "";
  sectionsNav.innerHTML = "";

  const secoes = {};

  lista.forEach((produto) => {
    if (!secoes[produto.secao]) {
      secoes[produto.secao] = [];
    }

    secoes[produto.secao].push(produto);
  });

  Object.keys(secoes).forEach((secao) => {
    const id = criarId(secao);

    sectionsNav.innerHTML += `
            <a href="#${id}">
                ${secao}
            </a>
        `;

    const cards = secoes[secao]
      .sort((a, b) => a.preco - b.preco)
      .map((produto) => criarCard(produto))
      .join("");

    catalog.innerHTML += `

            <section
                class="section"
                id="${id}"
            >

                <h2>

                    ${secao}

                    <small>
                        (${secoes[secao].length})
                    </small>

                </h2>

                <div class="cards">

                    ${cards}

                </div>

            </section>

        `;
  });
}

function criarCard(produto) {
  return `

        <article class="card">

            <img
                loading="lazy"
                src="${produto.imagem}"
                alt="${produto.titulo}"
            >

            <div class="card-body">

                <div class="card-title">

                    ${produto.titulo}

                </div>

                <div class="card-description">

                    ${produto.descricao || "Sem descrição"}

                </div>

                <div class="card-footer">

                    <span class="price">

                        R$ ${produto.preco.toFixed(2).replace(".", ",")}

                    </span>


                    <span class="allowed">

                        ✔ Permitido

                    </span>

                </div>
                                    <span class="priceFree">

                        Livre para pedir

                    </span>

            </div>

        </article>

    `;
}

function criarId(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

search.addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase().trim();

  if (!termo) {
    renderizar(produtos);

    return;
  }

  const filtrados = produtos.filter(
    (produto) =>
      produto.titulo.toLowerCase().includes(termo) ||
      produto.descricao.toLowerCase().includes(termo) ||
      produto.secao.toLowerCase().includes(termo),
  );

  renderizar(filtrados);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,

    behavior: "smooth",
  });
});

window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 400 ? "block" : "none";
});

carregarCatalogo();
