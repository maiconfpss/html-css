/**
 * ============================================================================
 * ARQUIVO: logic.ts (script.js)
 * OBJETIVO: Lógica do site "Premium" (Carrinho, Abas, Scroll)
 * ============================================================================
 */

// 1. DADOS DOS PRODUTOS (Nosso "banco de dados")
const PRODUTOS = [
  // Hambúrgueres
  { id: 1, nome: "Gaita's Classic", preco: 28.00, desc: "Pão brioche, burger 180g, cheddar e maionese.", img: "https://images.unsplash.com/photo-1583011482205-844cac1d6337?w=500", cat: "burgers" },
  { id: 2, nome: "X-Bacon Master", preco: 35.00, desc: "Dois burgers 150g, muito bacon e barbecue.", img: "https://images.unsplash.com/photo-1651843465180-5965076f7368?w=500", cat: "burgers" },
  { id: 3, nome: "Smash Duplo", preco: 24.00, desc: "Pão de batata, dois smash 70g e american cheese.", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500", cat: "burgers" },
  
  // Acompanhamentos
  { id: 4, nome: "Batata Rústica", preco: 18.00, desc: "Com alecrim, alho e maionese da casa.", img: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500", cat: "sides" },
  { id: 5, nome: "Onion Rings", preco: 22.00, desc: "Anéis de cebola empanados e crocantes.", img: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=500", cat: "sides" },
  
  // Bebidas
  { id: 6, nome: "Coca-Cola", preco: 6.00, desc: "Lata 350ml gelada.", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500", cat: "drinks" },
  { id: 7, nome: "Milkshake Morango", preco: 18.00, desc: "Sorvete de creme com calda de fruta real.", img: "https://images.unsplash.com/photo-1579954115563-e72bf1381629?w=500", cat: "drinks" }
];

// Estado Global
let carrinho = [];
let filtroAtual = "burgers";

// --- FUNÇÕES PRINCIPAIS ---

function iniciarSite() {
  console.log("Iniciando Gaita's Lanches Premium...");

  // 1. Renderizar menu inicial
  renderizarMenu();

  // 2. Configurar eventos de clique
  configurarAbas();
  configurarCarrinho();

  // 3. Configurar Scroll da Navbar
  window.addEventListener('scroll', function () {
    var header = document.querySelector('header');
    if (!header) return;
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });
}

// --- RENDERIZAÇÃO DO CARDÁPIO ---

function renderizarMenu() {
  var grid = document.getElementById('menu-grid');
  if (!grid) return;

  grid.innerHTML = '';

  var itens = PRODUTOS.filter(function (p) { return p.cat === filtroAtual; });

  itens.forEach(function (item) {
    var card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = "\n      <div class=\"product-img-wrapper\">\n        <img src=\"" + item.img + "\" alt=\"" + item.nome + "\">\n      </div>\n      <div class=\"product-content\">\n        <div class=\"product-header\">\n          <h3 class=\"product-title\">" + item.nome + "</h3>\n          <span class=\"product-price\">R$ " + item.preco.toFixed(2).replace('.', ',') + "</span>\n        </div>\n        <p class=\"product-desc\">" + item.desc + "</p>\n        <button class=\"btn-add\" onclick=\"window.addItem(" + item.id + ")\">\n          ADICIONAR AO PEDIDO\n        </button>\n      </div>\n    ";
    grid.appendChild(card);
  });
}

function configurarAbas() {
  var btns = document.querySelectorAll('.tab-btn');
  btns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      btns.forEach(function (b) { b.classList.remove('active'); });
      e.target.classList.add('active');
      filtroAtual = e.target.dataset.cat;
      renderizarMenu();
    });
  });
}

// --- LÓGICA DO CARRINHO ---

function configurarCarrinho() {
  var trigger = document.getElementById('cart-btn');
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('overlay');
  var close = document.getElementById('close-cart');

  var toggleCart = function () {
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  };

  if (trigger) trigger.addEventListener('click', toggleCart);
  if (close) close.addEventListener('click', toggleCart);
  if (overlay) overlay.addEventListener('click', toggleCart);

  // Fecha o sidebar ao redimensionar para desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) {
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    }
  });
}

// Adicionar Item (Global)
window.addItem = function (id) {
  var item = PRODUTOS.find(function (p) { return p.id === id; });
  if (!item) return;

  var existe = carrinho.find(function (i) { return i.id === id; });
  if (existe) {
    existe.qtd++;
  } else {
    var novo = Object.assign({}, item);
    novo.qtd = 1;
    carrinho.push(novo);
  }

  atualizarCarrinhoUI();
  var cartBtn = document.querySelector('.cart-trigger');
  if (cartBtn) {
    cartBtn.classList.add('bump');
    setTimeout(function () { cartBtn.classList.remove('bump'); }, 300);
  }
};

// Alterar Quantidade (Global)
window.alterarQtd = function (id, delta) {
  var item = carrinho.find(function (i) { return i.id === id; });
  if (!item) return;

  item.qtd += delta;

  if (item.qtd <= 0) {
    carrinho = carrinho.filter(function (i) { return i.id !== id; });
  }

  atualizarCarrinhoUI();
};

function atualizarCarrinhoUI() {
  var container = document.getElementById('cart-items-container');
  var countBadge = document.getElementById('cart-count');
  var totalEl = document.getElementById('cart-total-value');

  if (!container || !countBadge || !totalEl) return;

  var totalItens = carrinho.reduce(function (acc, i) { return acc + i.qtd; }, 0);
  countBadge.innerText = totalItens.toString();

  var totalPreco = carrinho.reduce(function (acc, i) { return acc + (i.preco * i.qtd); }, 0);
  totalEl.innerText = totalPreco.toFixed(2).replace('.', ',');

  container.innerHTML = '';
  if (carrinho.length === 0) {
    container.innerHTML = '<p style="text-align:center; color: #666; margin-top: 2rem;">Seu carrinho está vazio.</p>';
    return;
  }

  carrinho.forEach(function (item) {
    var div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = "\n      <img src=\"" + item.img + "\" class=\"cart-item-img\">\n      <div class=\"cart-item-info\">\n        <h4>" + item.nome + "</h4>\n        <div style=\"display:flex; justify-content:space-between; margin-top:4px;\">\n          <span style=\"color:var(--cor-gold-site); font-weight:bold;\">R$ " + (item.preco * item.qtd).toFixed(2).replace('.', ',') + "</span>\n        </div>\n        <div class=\"cart-item-controls\">\n          <button class=\"qty-btn\" onclick=\"window.alterarQtd(" + item.id + ", -1)\">-</button>\n          <span>" + item.qtd + "</span>\n          <button class=\"qty-btn\" onclick=\"window.alterarQtd(" + item.id + ", 1)\">+</button>\n        </div>\n      </div>\n    ";
    container.appendChild(div);
  });
}

// Finalizar Pedido WhatsApp
window.checkout = function () {
  if (carrinho.length === 0) return alert('Carrinho vazio!');

  var msg = "Olá! Gostaria de fazer um pedido:\n\n";
  var total = 0;

  carrinho.forEach(function (i) {
    var sub = i.preco * i.qtd;
    total += sub;
    msg += i.qtd + "x " + i.nome + " (R$ " + sub.toFixed(2) + ")\n";
  });

  msg += "\n*TOTAL: R$ " + total.toFixed(2) + "*";
  window.open('https://wa.me/5511999999999?text=' + encodeURIComponent(msg), '_blank');
};

// Inicializa após carregar o DOM
document.addEventListener('DOMContentLoaded', function () {
  try { iniciarSite(); } catch (e) { console.error(e); }
});
