// --- SLIDER ---
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const slider = document.querySelector('.slider');
const sliderList = slider?.querySelector('.list');
const thumbnail = document.querySelector('.thumbnail');
const thumbnailItems = thumbnail?.querySelectorAll('.item');

if (thumbnail && thumbnailItems?.length) {
  thumbnail.appendChild(thumbnailItems[0]);
}

function moveSlider(direction) {
  if (!sliderList || !thumbnail) return;
  const sliderItems = sliderList.querySelectorAll('.item');
  const thumbnailItems = thumbnail.querySelectorAll('.item');

  if (direction === 'next') {
    sliderList.appendChild(sliderItems[0]);
    thumbnail.appendChild(thumbnailItems[0]);
    slider.classList.add('next');
  } else {
    sliderList.prepend(sliderItems[sliderItems.length - 1]);
    thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1]);
    slider.classList.add('prev');
  }

  slider.addEventListener('animationend', () => {
    slider.classList.remove('next', 'prev');
  }, { once: true });
}

nextBtn?.addEventListener('click', () => moveSlider('next'));
prevBtn?.addEventListener('click', () => moveSlider('prev'));

// Pase automático del slider cada 4 segundos
let sliderInterval;
function startAutoSlide() {
  sliderInterval = setInterval(() => {
    moveSlider('next');
  }, 4000);
}
function stopAutoSlide() {
  clearInterval(sliderInterval);
}
startAutoSlide();
slider?.addEventListener('mouseenter', stopAutoSlide);
slider?.addEventListener('mouseleave', startAutoSlide);

// Marcar miniatura activa
thumbnail?.querySelectorAll('.item').forEach((el, idx) => {
  el.classList.toggle('active', idx === 0);
});

// --- CARRITO LOCALSTORAGE ---
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
  const carritoContador = document.getElementById('carrito-contador');
  if (carritoContador) carritoContador.textContent = totalItems;
}
window.actualizarContador = actualizarContador; // Para acceso desde otras ventanas

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

// Asignar eventos a los botones de agregar al carrito
document.querySelectorAll('.agregar-carrito').forEach(boton => {
  boton.addEventListener('click', () => {
    const id = boton.getAttribute('data-id');
    const nombre = boton.getAttribute('data-nombre');
    const precio = boton.getAttribute('data-precio');
    agregarAlCarrito(id, nombre, precio);
  });
});

// Inicializa el contador al cargar la página
actualizarContador();

// --- RENDERIZAR CARRITO EN carrito.html ---
if (document.getElementById('carrito-productos')) {
  function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const contenedor = document.getElementById('carrito-productos');
    const totalSpan = document.getElementById('total');
    const btnPagar = document.getElementById('btn-pagar');

    contenedor.innerHTML = '';

    if (carrito.length === 0) {
      contenedor.innerHTML = '<p style="text-align:center;">Tu carrito está vacío.</p>';
      if (totalSpan) totalSpan.textContent = '$0.00';
      if (btnPagar) btnPagar.disabled = true;
      return;
    }

    let total = 0;
    carrito.forEach((item, idx) => {
      total += item.precio * item.cantidad;
      const div = document.createElement('div');
      div.className = 'item-carrito';
      div.innerHTML = `
        <span>${item.nombre}</span>
        <span>Cantidad: ${item.cantidad}</span>
        <span>Precio: $${item.precio.toFixed(2)}</span>
        <span>Subtotal: $${(item.precio * item.cantidad).toFixed(2)}</span>
        <button class="eliminar-producto" data-index="${idx}" title="Eliminar">🗑️</button>
      `;
      contenedor.appendChild(div);
    });

    // Evento para eliminar productos
    contenedor.querySelectorAll('.eliminar-producto').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = parseInt(this.getAttribute('data-index'));
        eliminarDelCarrito(idx);
      });
    });

    if (totalSpan) totalSpan.textContent = `$${total.toFixed(2)}`;
    if (btnPagar) btnPagar.disabled = false;
  }

  renderizarCarrito();
}

function eliminarDelCarrito(idx) {
  let carrito = obtenerCarrito();
  carrito.splice(idx, 1);
  guardarCarrito(carrito);
  renderizarCarrito();
}

// --- PAGO.HTML ---
const formPago = document.getElementById('form-pago');
const mensajePago = document.getElementById('mensaje-pago');

if (formPago && mensajePago) {
  formPago.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!formPago.checkValidity()) {
      mensajePago.textContent = 'Por favor complete correctamente todos los campos.';
      mensajePago.className = 'alerta error';
      return;
    }

    mensajePago.textContent = 'Procesando pago...';
    mensajePago.className = 'alerta loading';

    setTimeout(() => {
      localStorage.removeItem('carrito');
      if (window.opener && window.opener.actualizarContador) {
        window.opener.actualizarContador();
      }
      mensajePago.textContent = '¡Pago realizado con éxito! Gracias por tu compra.';
      mensajePago.className = 'alerta exito';
      formPago.reset();
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    }, 2000);
  });
}

// --- MENÚ HAMBURGUESA Y SUBMENÚ RESPONSIVE ---
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navUl = document.querySelector('.main-nav ul');

  if (menuToggle && navUl) {
    menuToggle.addEventListener('click', () => {
      navUl.classList.toggle('activo');
    });

    // Cerrar menú al hacer click en un enlace (mejor UX en móvil)
    navUl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navUl.classList.remove('activo');
      });
    });

    // Submenú en móvil: abrir/cerrar al tocar "Tienda"
    navUl.querySelectorAll('.has-submenu > a').forEach(link => {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          this.parentElement.classList.toggle('activo');
        }
      });
    });
  }
});

// --- HEADER DINÁMICO GAMER ---
window.addEventListener('scroll', function() {
  const header = document.querySelector('.main-header');
  if (header) {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
});

// --- PRELOADER ---
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  const body = document.body;
  if (preloader) {
    preloader.style.opacity = "1";
    const fadeOut = setInterval(() => {
      let opacity = parseFloat(preloader.style.opacity);
      if (opacity > 0) {
        preloader.style.opacity = (opacity - 0.05).toString();
      } else {
        clearInterval(fadeOut);
        preloader.style.display = "none";
        body.classList.remove("hidden");
      }
    }, 50);
  }
});

const btnPagar = document.getElementById('btn-pagar');
if (btnPagar) {
  btnPagar.addEventListener('click', function() {
    // Solo redirige si el botón está habilitado
    if (!btnPagar.disabled) {
      window.location.href = 'pago.html';
    }
  });
}
