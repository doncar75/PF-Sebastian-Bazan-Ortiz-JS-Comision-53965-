// Función asíncrona para obtener los datos de las hamburguesas desde el archivo JSON
async function obtenerHamburguesasDisponibles() {
    try {
        const response = await fetch('./data/hamburguesas.json');
        if (!response.ok) {
            throw new Error('Error al obtener los datos de las hamburguesas');
        }
        const data = await response.json();
        const hamburguesasDisponibles = data.hamburguesasDisponibles;
        renderBurgers(hamburguesasDisponibles);
    } catch (error) {
        console.error(error);
        // Mostrar un mensaje de error al usuario
        alert('Ocurrió un error al obtener los datos de las hamburguesas. Por favor, inténtalo de nuevo más tarde.');
    }
}

// Llamar a la función para obtener los datos de las hamburguesas
obtenerHamburguesasDisponibles();

const contenedorhamburguesasDisponibles = document.querySelector("#hamburguesasDisponibles");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");
const carrito = [];

// Funcion para renderizar hamburguesas
const renderBurgers = (hamburguesasDisponibles) => {
    const hamburguesasDisponiblesContainer = document.getElementById("hamburguesasDisponibles");
    hamburguesasDisponibles.forEach((hamburguesa) => {
        const Div = document.createElement("div");
        Div.classList.add("hamburguesasDisponibles");
        Div.innerHTML = `
            <div class="hamburguesa-imagen">
                <img src="${hamburguesa.imagen}" alt="${hamburguesa.nombre}">
            </div>
            <div class="hamburguesa-detalles">
                <h3>${hamburguesa.nombre}</h3>
                <p>${hamburguesa.descripcion}</p>
                <span class="price">$${hamburguesa.precio}</span>
            </div>
            <div class="ingredientes-disponibles">
                ${renderIngredientes(hamburguesa.ingredientes)}
            </div>
            <button class="add-to-cart-button" data-name="${hamburguesa.nombre}" data-price="${hamburguesa.precio}">Agregar al carrito</button>
        `;
        hamburguesasDisponiblesContainer.appendChild(Div);
    });
};

// Función para renderizar ingredientes
const renderIngredientes = (ingredientes) => {
    let html = "";
    ingredientes.forEach((ingrediente) => {
        html += `
            <button class="add-ingredient-button" data-name="${ingrediente.nombre}" data-price="${ingrediente.precioAdicional}">Agregar ${ingrediente.nombre}</button>
        `;
    });
    return html;
};

// Función para agregar una hamburguesa al carrito
function agregarHamburguesaAlCarrito(hamburguesa) {
    carrito.push(hamburguesa);
    renderCart();
    guardarCarritoEnStorage();
}

// Event listener para el botón de agregar al carrito
const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const hamburguesa = getHamburguesaSeleccionada();
        if (hamburguesa) {
            agregarHamburguesaAlCarrito(hamburguesa);
        }
    });
});

// Event listener para el botón de agregar ingrediente
const addIngredientButtons = document.querySelectorAll(".add-ingredient-button");
addIngredientButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const hamburguesa = getHamburguesaSeleccionada();
        if (hamburguesa) {
            const ingredienteName = button.getAttribute("data-name");
            const ingredientePrice = parseFloat(button.getAttribute("data-price"));

            hamburguesa.ingredientes.push({ nombre: ingredienteName, precioAdicional: ingredientePrice });
            hamburguesa.precio += ingredientePrice;

            agregarHamburguesaAlCarrito(hamburguesa);
            renderHamburguesaSeleccionada(hamburguesa);
        }
    });
});

// Función para obtener la hamburguesa seleccionada
const getHamburguesaSeleccionada = () => {
    // Busca en el DOM la hamburguesa seleccionada
    // Por ejemplo, puedes agregar una clase "selected" a la hamburguesa seleccionada
    // y luego buscarla en el DOM
    const selectedBurger = document.querySelector('.hamburguesasDisponibles.selected');
    if (selectedBurger) {
        // Obtén los datos de la hamburguesa seleccionada
        const name = selectedBurger.querySelector('h3').textContent;
        const price = parseFloat(selectedBurger.querySelector('.price').textContent.replace('$', ''));
        const ingredients = Array.from(selectedBurger.querySelectorAll('.add-ingredient-button')).map(button => ({
            nombre: button.getAttribute('data-name'),
            precioAdicional: parseFloat(button.getAttribute('data-price'))
        }));
        return { nombre: name, precio: price, ingredientes };
    }
    return null;
};

// Función para renderizar la hamburguesa seleccionada
const renderHamburguesaSeleccionada = (hamburguesa) => {
    // Agrega el código HTML necesario para mostrar la hamburguesa seleccionada
    // Por ejemplo, puedes agregar un elemento en el DOM que muestre los detalles de la hamburguesa
};

// Función para guardar el carrito en el Storage
function guardarCarritoEnStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para cargar el carrito del Storage
function cargarCarritoDelStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito.push(...JSON.parse(carritoGuardado));
        renderCart();
    }
}

// Llamar a la función para cargar el carrito del Storage
cargarCarritoDelStorage();

// Función para renderizar el carrito
const renderCart = () => {
    carritoProductos.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
        carritoTotal.textContent = "$0";
        return;
    }

    carritoVacio.classList.add("d-none");
    carritoProductos.classList.remove("d-none");

    carrito.forEach((hamburguesa) => {
        const Div = document.createElement("div");
        Div.classList.add("carrito-product");
        Div.innerHTML = `
            <h3>${hamburguesa.nombre}</h3>
            <span class="ingredientes">${renderIngredientes(hamburguesa.ingredientes)}</span>
            <span class="price">$${hamburguesa.precio}</span>
        `;
        carritoProductos.appendChild(Div);

        total += hamburguesa.precio;
    });

    carritoTotal.textContent = `$${total}`;
};

// Event listener para el botón de comprar
const comprarButton = document.querySelector(".comprar-button");
comprarButton.addEventListener("click", () => {
    const totalAPagar = document.querySelector("#carrito-total").textContent;
    mostrarMensajeCompra(totalAPagar); // Llama a la función para mostrar el mensaje
});

// Función para mostrar el mensaje de agradecimiento y el monto total a pagar
function mostrarMensajeCompra(montoTotal) {
    const mensaje = `Monto total a pagar: ${montoTotal}. Gracias por su compra.`;
    const mensajeCompraElement = document.querySelector("#mensaje-compra");
    mensajeCompraElement.textContent = mensaje;
}
