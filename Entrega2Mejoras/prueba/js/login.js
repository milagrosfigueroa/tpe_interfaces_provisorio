const loginForm = document.getElementById('login-form');
const registroForm = document.getElementById('register-form');
const irAregistro = document.getElementById('ir-a-registro');
const irAlogin = document.getElementById('ir-a-login');
const formRegistro = document.getElementById('form-registro');
const successMessage = document.getElementById('success-message');
const inicioSesion = document.getElementById('inicioSesion');

irAregistro.addEventListener('click', function(e) {
  e.preventDefault();
  loginForm.classList.add('hidden');
  registroForm.classList.remove('hidden');
});

irAlogin.addEventListener('click', function(e) {
  e.preventDefault();
  registroForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
});

formRegistro.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const contrasenia = document.getElementById('register-password').value;
  const confirmarContrasenia = document.getElementById('register-confirm').value;
  
  if (contrasenia !== confirmarContrasenia) {
    alert('Las contraseñas no coinciden');
    return;
  }

  // Ocultar formulario de registro
  registroForm.classList.add('hidden');

  // Mostrar mensaje de éxito
  successMessage.classList.remove('hidden');

  // Permitir que la animación de CSS ocurra
  setTimeout(() => {
    successMessage.classList.add('show');
  }, 50);

  // Volver al login después de 2.5 segundos
  setTimeout(() => {
    successMessage.classList.remove('show');

    setTimeout(() => {
      successMessage.classList.add('hidden');
      loginForm.classList.remove('hidden');
      formRegistro.reset();
    }, 500);
  }, 2500);
});


inicioSesion.addEventListener('submit', function(e) {
  e.preventDefault(); 
  window.location.href = 'home.html';
});

