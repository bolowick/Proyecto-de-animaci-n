const formPago = document.getElementById('form-pago');
const mensajePago = document.getElementById('mensaje-pago');

formPago.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!formPago.checkValidity()) {
    mensajePago.textContent = 'Por favor complete correctamente todos los campos.';
    mensajePago.className = 'alerta error';
    return;
  }

  // Validar patrón de tarjeta y fecha ya hecho por HTML pattern, pero podemos agregar lógica adicional si se quiere.

  // Simular pago
  mensajePago.textContent = 'Procesando pago...';
  mensajePago.className = 'alerta';

  setTimeout(() => {
    // Vaciar carrito
    localStorage.removeItem('carrito');
    // Actualizar contador carrito si está presente en la página
    if (window.opener && window.opener.actualizarContador) {
      window.opener.actualizarContador();
    }

    mensajePago.textContent = '¡Pago realizado con éxito! Gracias por tu compra.';
    mensajePago.className = 'alerta exito';

    formPago.reset();

    // Después de 3 segundos, redirigir a inicio
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
  }, 2000);
});
