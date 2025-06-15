// Manejo de carrito usando LocalStorage para persistencia

const botonesAgregar = document.querySelectorAll('.agregar-carrito');
const carritoContador = document.getElementById('carrito-contador');

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContador();
}

function actualizarContador() {
  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  carritoContador.textContent = totalItems;
}

function agregarAlCarrito(id, nombre, precio) {
  let carrito = obtenerCarrito();
  const productoIndex = carrito.findIndex(p => p.id === id);

  if (productoIndex !== -1) {
    carrito[productoIndex].cantidad++;
  } else {
    carrito.push({ id, nombre, precio: parseFloat(precio), cantidad: 1 });
  }
  guardarCarrito(carrito);
  alert(`Se agregó "${nombre}" al carrito.`);
}

botonesAgregar.forEach(boton => {
  boton.addEventListener('click', () => {
    const id = boton.getAttribute('data-id');
    const nombre = boton.getAttribute('data-nombre');
    const precio = boton.getAttribute('data-precio');
    agregarAlCarrito(id, nombre, precio);
  });
});

actualizarContador();

// Código para carrito.html

if (document.getElementById('carrito-productos')) {
  const contenedorCarrito = document.getElementById('carrito-productos');
  const totalSpan = document.getElementById('total');
  const btnPagar = document.getElementById('btn-pagar');

  function renderizarCarrito() {
    const carrito = obtenerCarrito();
    contenedorCarrito.innerHTML = '';

    if (carrito.length === 0) {
      contenedorCarrito.innerHTML = '<p>El carrito está vacío.</p>';
      totalSpan.textContent = '0.00';
      btnPagar.disabled = true;
      return;
    }

    let total = 0;

    carrito.forEach(item => {
      total += item.precio * item.cantidad;

      const articulo = document.createElement('article');
      articulo.innerHTML = `
        <div>${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}</div>
        <button aria-label="Eliminar ${item.nombre} del carrito" data-id="${item.id}">Eliminar</button>
      `;
      contenedorCarrito.appendChild(articulo);
    });

    totalSpan.textContent = total.toFixed(2);
    btnPagar.disabled = false;

    // Agregar evento eliminar
    contenedorCarrito.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        eliminarDelCarrito(id);
      });
    });
  }

  function eliminarDelCarrito(id) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito(carrito);
    renderizarCarrito();
  }

  btnPagar.addEventListener('click', () => {
    window.location.href = 'pago.html';
  });

  renderizarCarrito();
}
