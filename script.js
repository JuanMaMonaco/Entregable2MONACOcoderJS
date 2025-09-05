const formulario = document.getElementById('formulario-id');
const saludoUser = document.getElementById('saludo');
const miTiendaDiv = document.getElementById('tienda');
const miCarritoDiv = document.getElementById('carrito');


const listaCarrito = document.getElementById('lista-carrito');
const totalElemento = document.getElementById('total-compra');
const mensajeFinal = document.getElementById('mensaje-final');

let mensaje = ""; 

const botonFinalizar = document.getElementById('finalizar-compra');
const botonCancelar = document.getElementById('cancelar-compra');
const inputMail = document.getElementById('input-mail');
const botonEnviarLink = document.getElementById('enviar-link');
const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');

const productos = [
    { id:1, nombre: 'Anti-Age Complex', precio: 25000 },
    { id:2, nombre: 'Antioxidantes con Vitamina C', precio: 24000 },
    { id:3, nombre: 'Bioserum con Niacinamida', precio: 24000 },
    { id:4, nombre: 'Concentrado con Celulas Madre de Rosa Alpina', precio: 30000 },
    { id:5, nombre: 'Gel de Limpieza', precio: 20000 },
    { id:6, nombre: 'Leche de Limpieza', precio: 18000 }
];

let carrito = [];

const nombreGuardado = localStorage.getItem('nombreUsuario');
const edadGuardada = localStorage.getItem('edadUsuario');
if (nombreGuardado && edadGuardada >= 18) {
    document.getElementById('nombre-input').value = nombreGuardado;
    document.getElementById('edad-input').value = edadGuardada;
    saludoUser.textContent = `¡Hola de nuevo, ${nombreGuardado}! Bienvenido/a a nuestro Catalogo Web`;
    miTiendaDiv.style.display = 'block';
    miCarritoDiv.style.display = 'block';
}

const carritoGuardado = localStorage.getItem('carrito');
if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarritoHTML(); 
}

function recompensa(total) {
    switch (true) {
        case total >= 160000:
            mensaje = "¡Tienes 6 cuotas sin interes!";
            break; 
        case total >= 120000:
            mensaje = "¡Con tu compra te llevas un agua micelar de regalo!";
            break; 
        case total >= 80000:
            mensaje = "¡Felicitaciones! Has ganado un envío gratis.";
            break;
        case total >= 40000:
            mensaje = "¡Genial! Recibirás un cupón de 10% de descuento para tu próxima compra.";
            break;
        default: 
            mensaje = "¡Gracias por elegirnos!";
            break;
    }
}

function actualizarCarritoHTML() {
    listaCarrito.innerHTML = '';
    
    let total = 0;

    carrito.forEach(producto => {
        const nuevoLi = document.createElement('li');
        
        const infoProducto = document.createElement('span');
        infoProducto.textContent = `${producto.nombre} - Cantidad: ${producto.cantidad} - $${producto.precio * producto.cantidad}`;

        const botonRestar = document.createElement('button');
        botonRestar.textContent = '-';
        botonRestar.onclick = () => {
            restarProducto(producto.id);
        };

        const botonSumar = document.createElement('button');
        botonSumar.textContent = '+';
        botonSumar.onclick = () => {
            sumarProducto(producto.id);
        };

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => {
            eliminarProducto(producto.id);
        };

        nuevoLi.appendChild(infoProducto);
        nuevoLi.appendChild(botonRestar);
        nuevoLi.appendChild(botonSumar);
        nuevoLi.appendChild(botonEliminar);
        listaCarrito.appendChild(nuevoLi);
        
        total += producto.precio * producto.cantidad;
    });

    totalElemento.textContent = `Total: $${total}`;

    recompensa(total);
    mensajeFinal.textContent = mensaje;

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function sumarProducto(idProducto) {
    const productoEncontrado = carrito.find(p => p.id === idProducto);
    if (productoEncontrado) {
        productoEncontrado.cantidad++;
        actualizarCarritoHTML(); 
    }
}

function restarProducto(idProducto) {
    const productoEncontrado = carrito.find(p => p.id === idProducto);
    if (productoEncontrado && productoEncontrado.cantidad > 1) {
        productoEncontrado.cantidad--;
        actualizarCarritoHTML();
    } else if (productoEncontrado && productoEncontrado.cantidad === 1) {
        eliminarProducto(idProducto);
    }
}

function eliminarProducto(idProducto) {
    carrito = carrito.filter(p => p.id !== idProducto);
    actualizarCarritoHTML();
}

formulario.addEventListener('submit', (evento) => {
    
    evento.preventDefault();

    const nombreInput = document.getElementById('nombre-input');
    const edadInput = document.getElementById('edad-input');

    const nombre = nombreInput.value;
    const edad = edadInput.value;

    if (edad >= 18) {
        localStorage.setItem('nombreUsuario', nombre);
        localStorage.setItem('edadUsuario', edad);

        saludoUser.textContent = `¡Hola, ${nombre}! Bienvenido/a a nuestro Catalogo Web`;
        
        miTiendaDiv.style.display = 'block';
        miCarritoDiv.style.display = 'block';

    } else {
        saludoUser.textContent = `¡Hola, ${nombre}! Lo sentimos, pero debes ser mayor de edad para ver nuestro Catalogo Web`;

        miTiendaDiv.style.display = 'none';
        miCarritoDiv.style.display = 'none';
    }

   
    
});

const botonesAgregar = document.querySelectorAll('.agregar-carrito');

botonesAgregar.forEach(boton => {
    boton.addEventListener('click', (evento) => {
        const idBoton = evento.target.id;
        
        const idProducto = parseInt(idBoton);
        
        const productoEncontrado = productos.find(producto => producto.id === idProducto);

        if (productoEncontrado) {
            const productoEnCarrito = carrito.find(p => p.id === productoEncontrado.id);
            
            if (productoEnCarrito) {
                productoEnCarrito.cantidad++;
            } else {
                carrito.push({ ...productoEncontrado, cantidad: 1 });
            }
            
        }
        actualizarCarritoHTML();
    });
});

botonFinalizar.addEventListener('click', () => {
    
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos para finalizar la compra.');
        return;
    }
    inputMail.style.display = 'block'; 
    botonEnviarLink.style.display = 'block'; 
    botonFinalizar.style.display = 'none'; 
});

botonEnviarLink.addEventListener('click', () => {
    const email = inputMail.value;
    if (email) {
        alert(`Se ha enviado el link de pago a: ${email}`);
        
        
        mensajeConfirmacion.textContent = "¡Gracias por tu compra! En breve recibirás un correo con el link de pago.";
        
        carrito = [];
        actualizarCarritoHTML(); 
        inputMail.value = ''; 
        inputMail.style.display = 'none'; 
        botonEnviarLink.style.display = 'none'; 
        botonFinalizar.style.display = 'block'; 
    } else {
        alert('Por favor, ingresa tu correo electrónico.');
    }
});


botonCancelar.addEventListener('click', () => {
    if (carrito.length > 0) {
        carrito = [];
        actualizarCarritoHTML();
        inputMail.style.display = 'none';
        botonEnviarLink.style.display = 'none';
        botonFinalizar.style.display = 'block';
        mensajeConfirmacion.textContent = ""; 
        alert('Compra cancelada. Tu carrito ha sido vaciado.');
        } else {
        alert('El carrito ya está vacío.');
    }
});



