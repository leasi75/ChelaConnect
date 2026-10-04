const P = [
  ['Michelada Clásica', 'Micheladas', 85],
  ['Michelada Mango', 'Micheladas', 95],
  ['Michelada Tamarindo', 'Micheladas', 95],
  ['Gomichela', 'Chelas preparadas', 115],
  ['Azulito Chelero', 'Chelas preparadas', 110],
  ['Cerveza Clara', 'Cervezas', 55],
  ['Cerveza Oscura', 'Cervezas', 60],
  ['Paloma', 'Coctelería', 105],
  ['Mojito', 'Coctelería', 110],
  ['Piña Colada', 'Coctelería', 120],
  ['Papas Gajo', 'Botanas', 75],
  ['Nachos', 'Botanas', 95],
  ['Alitas', 'Botanas', 125],
  ['Combo Pareja', 'Combos', 260],
  ['Combo Amigos', 'Combos', 420]
].map((x, i) => ({
  id: i,
  name: x[0],
  cat: x[1],
  price: x[2]
}));

let plan = 'premium';
let filter = 'Todos';
let q = '';
let cart = [];

const $ = s => document.querySelector(s);
const money = n => '$' + n;


/* =========================
   IMÁGENES DE PRODUCTOS
========================= */

function productImage(id) {

  const images = {

    0: 'assets/images/products/michelada-clasica.png',

    1: 'assets/images/products/michelada-mango.png',

    2: 'assets/images/products/michelada-tamarindo.png',

    3: 'assets/images/products/gomichela.png',

    4: 'assets/images/products/azulito-chelero.png',

    5: 'assets/images/products/cerveza-clara.png',

    6: 'assets/images/products/cerveza-oscura.png',

    7: 'assets/images/products/paloma.png',

    8: 'assets/images/products/mojito.png',

    9: 'assets/images/products/pina-colada.png',

    10: 'assets/images/products/papas-gajo.png',

    11: 'assets/images/products/nachos.png',

    12: 'assets/images/products/alitas.png',

    13: 'assets/images/products/combo-pareja.png',

    14: 'assets/images/products/combo-amigos.png'
  };

  return images[id] ||
    'assets/images/products/michelada-clasica.png';
}


/* =========================
   PLAN
========================= */

function list() {

  return plan === 'basic'
    ? P.slice(0, 12)
    : P;
}


/* =========================
   RENDER PRODUCTOS
========================= */

function render() {

  const cats = [
    'Todos',
    ...new Set(
      list().map(x => x.cat)
    )
  ];

  $('#filters').innerHTML =
    cats.map(c => `

      <button
        class="${filter === c ? 'active' : ''}"
        onclick="filter='${c}';render()"
      >
        ${c}
      </button>

    `).join('');


  $('#grid').innerHTML =
    list()

      .filter(x =>

        (
          filter === 'Todos' ||
          x.cat === filter
        )

        &&

        x.name
          .toLowerCase()
          .includes(q)

      )

      .map(x => `

        <article class="card">

          <div class="pic">

            <img
              src="${productImage(x.id)}"
              alt="${x.name}"
              loading="lazy"
            >

          </div>

          <div class="info">

            <small>
              ${x.cat}
            </small>

            <h3>
              ${x.name}
            </h3>

            <div class="price">
              ${money(x.price)}
            </div>

            <button
              class="add"
              onclick="openProduct(${x.id})"
            >

              ${
                plan === 'premium'
                  ? 'Personalizar'
                  : 'Pedir por WhatsApp'
              }

            </button>

          </div>

        </article>

      `).join('');
}


/* =========================
   CAMBIAR PLAN
========================= */

function setPlan(p) {

  plan = p;

  filter = 'Todos';

  cart = [];

  update();

  render();
}


/* =========================
   OPCIONES
========================= */

const size = () => `

  <label>

    Tamaño

    <select id="size">

      <option>
        Chico
      </option>

      <option selected>
        Mediano
      </option>

      <option>
        Grande (+$20)
      </option>

    </select>

  </label>

`;


const beer = () => `

  <label>

    Cerveza / base

    <select id="beer">

      <option>
        Clara
      </option>

      <option>
        Oscura
      </option>

      <option>
        Sin alcohol
      </option>

    </select>

  </label>

`;


const rim = () => `

  <label>

    Escarchado

    <select id="rim">

      <option>
        Clásico
      </option>

      <option>
        Chamoy
      </option>

      <option>
        Miguelito
      </option>

      <option>
        Sin escarchar
      </option>

    </select>

  </label>

`;


const spicy = () => `

  <label>

    Picante

    <select id="spicy">

      <option>
        Sin picante
      </option>

      <option selected>
        Medio
      </option>

      <option>
        Picante
      </option>

    </select>

  </label>

`;


const qty = () => `

  <label>

    Cantidad

    <select id="qty">

      <option selected>
        1
      </option>

      <option>
        2
      </option>

      <option>
        3
      </option>

      <option>
        4
      </option>

      <option>
        5
      </option>

    </select>

  </label>

`;


const extra = () => `

  <label>

    <input
      id="extra"
      type="checkbox"
    >

    Extra gomitas/chamoy (+$15)

  </label>

`;


const notes = () => `

  <label>

    Indicaciones especiales

    <textarea
      id="special"
      placeholder="Ej. salsa aparte..."
    ></textarea>

  </label>

`;


/* =========================
   OPCIONES POR CATEGORÍA
========================= */

function options(p) {

  if (
    p.cat === 'Micheladas' ||
    p.cat === 'Chelas preparadas'
  ) {

    return (
      size() +
      beer() +
      rim() +
      spicy() +
      extra()
    );
  }


  if (p.cat === 'Cervezas') {

    return qty();
  }


  if (p.cat === 'Coctelería') {

    return (
      size() +
      rim()
    );
  }


  if (
    p.cat === 'Botanas' ||
    p.cat === 'Combos'
  ) {

    return (
      qty() +
      notes()
    );
  }


  return qty();
}


/* =========================
   ABRIR PRODUCTO
========================= */

function openProduct(id) {

  const p = P[id];


  if (plan === 'basic') {

    window.open(

      'https://wa.me/?text=' +

      encodeURIComponent(

        `Hola, me interesa ${p.name} (${money(p.price)}). ¿Me confirman disponibilidad?`

      ),

      '_blank'
    );

    return;
  }


  $('#modalBody').innerHTML = `

    <div class="pic modal-product-image">

      <img
        src="${productImage(p.id)}"
        alt="${p.name}"
      >

    </div>


    <small>
      ${p.cat}
    </small>


    <h2>
      ${p.name}
    </h2>


    <h3>
      ${money(p.price)}
    </h3>


    ${options(p)}


    <button
      class="add"
      onclick="add(${id})"
    >

      Agregar al pedido

    </button>

  `;


  $('#modal')
    .classList
    .remove('hidden');
}


/* =========================
   CERRAR MODAL
========================= */

function closeModal() {

  $('#modal')
    .classList
    .add('hidden');
}


/* =========================
   AGREGAR AL CARRITO
========================= */

function add(id) {

  const p = P[id];

  const s = $('#size');

  const b = $('#beer');

  const r = $('#rim');

  const sp = $('#spicy');

  const qe = $('#qty');

  const e = $('#extra');

  const n = $('#special');


  const d = {

    size:
      s
        ? s.value
        : '',


    beer:
      b
        ? b.value
        : '',


    rim:
      r
        ? r.value
        : '',


    spicy:
      sp
        ? sp.value
        : '',


    qty:
      qe
        ? Number(qe.value)
        : 1,


    extra:
      e
        ? e.checked
        : false,


    special:
      n
        ? n.value.trim()
        : ''
  };


  let unit = p.price;


  if (
    d.size.startsWith('Grande')
  ) {

    unit += 20;
  }


  if (d.extra) {

    unit += 15;
  }


  cart.push({

    ...p,

    ...d,

    final:
      unit * d.qty

  });


  closeModal();

  update();
}


/* =========================
   DETALLES
========================= */

function details(x) {

  const a = [];


  if (x.size) {

    a.push(

      x.size.replace(
        ' (+$20)',
        ''
      )

    );
  }


  if (x.beer) {

    a.push(x.beer);
  }


  if (x.rim) {

    a.push(
      'Escarchado ' +
      x.rim
    );
  }


  if (x.spicy) {

    a.push(
      'Picante ' +
      x.spicy
    );
  }


  if (x.extra) {

    a.push(
      'Extra gomitas/chamoy'
    );
  }


  if (x.qty > 1) {

    a.push(
      'Cantidad ' +
      x.qty
    );
  }


  if (x.special) {

    a.push(
      x.special
    );
  }


  return a.join(' · ');
}


/* =========================
   ACTUALIZAR CARRITO
========================= */

function update() {

  $('#count').textContent =

    cart.reduce(

      (s, x) =>
        s + x.qty,

      0

    );


  $('#items').innerHTML =

    cart.map((x, i) => `

      <div class="row">

        <span>

          <b>

            ${
              x.qty > 1
                ? x.qty + ' × '
                : ''
            }

            ${x.name}

          </b>


          ${
            details(x)

              ? `
                <br>
                <small>
                  ${details(x)}
                </small>
              `

              : ''
          }

        </span>


        <span>

          ${money(x.final)}

          <button
            onclick="
              cart.splice(${i},1);
              update()
            "
          >
            ×
          </button>

        </span>

      </div>

    `).join('')

    ||

    '<p>Tu pedido está vacío.</p>';


  $('#total').textContent =

    money(

      cart.reduce(

        (s, x) =>
          s + x.final,

        0

      )

    );
}


/* =========================
   CARRITO
========================= */

function openCart() {

  $('#cart')
    .classList
    .add('open');
}


function closeCart() {

  $('#cart')
    .classList
    .remove('open');
}


/* =========================
   WHATSAPP
========================= */

function send() {

  if (!cart.length) {

    return alert(
      'Agrega productos.'
    );
  }


  const lines =

    cart.map(
      (x, i) =>

`${i + 1}. ${
  x.qty > 1
    ? x.qty + ' x '
    : ''
}${x.name}${
  details(x)
    ? ' — ' + details(x)
    : ''
} — ${money(x.final)}`

    ).join('\n');


  const msg = `Hola, quiero realizar este pedido en LA CHELERÍA:

${lines}

Total: ${$('#total').textContent}

Nombre:
${$('#name').value || 'No indicado'}

Mesa:
${$('#table').value || 'No indicada'}

Indicaciones generales:
${$('#notes').value || 'Sin indicaciones'}`;


  window.open(

    'https://wa.me/?text=' +

    encodeURIComponent(msg),

    '_blank'

  );
}


/* =========================
   BUSCADOR
========================= */

$('#search').oninput = e => {

  q =
    e.target
      .value
      .toLowerCase();

  render();
};


/* =========================
   INICIO
========================= */

render();

update();
