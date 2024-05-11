// Variables globales
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsElement = document.querySelector('.cart-items');
const totalPriceElement = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const paymentMethodElement = document.getElementById('payment-method');

// Función asincrónica para cargar datos del menú desde un archivo JSON utilizando fetch
async function loadMenuData() {
    try {
        const response = await fetch('data/menu.json');
        const data = await response.json();
        displayMenu(data.hamburguesasDisponibles);
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

// Función para mostrar el menú de hamburguesas en la página
function displayMenu(burgers) {
    const burgerList = document.querySelector('.burger-list');

    burgers.forEach(burger => {
        const burgerItem = createBurgerItem(burger);
        burgerList.appendChild(burgerItem);
    });
}

// Función para crear un elemento de hamburguesa en el menú
function createBurgerItem(burger) {
    const burgerItem = document.createElement('div');
    burgerItem.classList.add('burger-item');

    const image = document.createElement('img');
    image.src = burger.imagen;
    image.alt = burger.nombre;

    const name = document.createElement('h3');
    name.textContent = burger.nombre;

    const description = document.createElement('p');
    description.textContent = burger.descripcion;

    const price = document.createElement('p');
    price.textContent = `Precio: $${burger.precio}`;

    // Crear los botones de ingredientes
    const ingredientButtons = document.createElement('div');
    ingredientButtons.classList.add('ingredient-buttons');

    // En createBurgerItem:
    burger.ingredientes.forEach(ingredient => {
        const ingredientBtn = document.createElement('button');
        ingredientBtn.textContent = `${ingredient.nombre} (+$${ingredient.precioAdicional})`;
        ingredientBtn.addEventListener('click', () => addIngredientToCart(burger, ingredient));
        ingredientButtons.appendChild(ingredientBtn);
        ingredientBtn.dataset.burgerName = burger.nombre; // Agregar un atributo de datos para identificar la hamburguesa
    });


    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = 'Agregar al Carrito';
    addToCartBtn.addEventListener('click', () => addToCart(burger));

    burgerItem.appendChild(image);
    burgerItem.appendChild(name);
    burgerItem.appendChild(description);
    burgerItem.appendChild(price);
    burgerItem.appendChild(ingredientButtons);
    burgerItem.appendChild(addToCartBtn);

    return burgerItem;
}

// Función para agregar una hamburguesa al carrito
function addToCart(burger) {
    cart.push({ ...burger, ingredientes: [] }); // Inicializar la lista de ingredientes vacía
    updateCart();
    saveCartToLocalStorage();
}

// Función para mostrar el modal
function showModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";

    // Botón de cerrar el modal
    const span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    }

    // Cerrar el modal haciendo clic fuera del contenido
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

const ingredientCount = {};

// Función para agregar un ingrediente al carrito
function addIngredientToCart(burger, ingredient) {
    const cartItem = cart.find(item => item.nombre === burger.nombre);
    if (cartItem) {
        // Verificar si el ingrediente ya está en el carrito
        const existingIngredient = cartItem.ingredientes.find(item => item.nombre === ingredient.nombre);
        if (existingIngredient) {
            // Verificar si se ha alcanzado el límite de cantidad del ingrediente
            if (ingredientCount[ingredient.nombre] && ingredientCount[ingredient.nombre] >= 1) {
                showModal();
                return;
            }
            // Incrementar el contador de veces que se agrega el ingrediente
            ingredientCount[ingredient.nombre] = (ingredientCount[ingredient.nombre] || 0) + 1;
        } else {
            // Si el ingrediente no está en el carrito, agregarlo
            cartItem.ingredientes.push(ingredient);
            updateCart();
            saveCartToLocalStorage();
        }
    }
    // Actualizar el carrito después de agregar el ingrediente
    updateCart();
    // Guardar el carrito en el localStorage
    saveCartToLocalStorage();
}

// Función para eliminar una hamburguesa del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    saveCartToLocalStorage();
}

// Función para actualizar el carrito de compras en la interfaz
function updateCart() {
    cartItemsElement.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const cartItem = createCartItem(item, index);
        cartItemsElement.appendChild(cartItem);

        // Calcular el precio total incluyendo los ingredientes
        const itemPrice = item.precio;
        const ingredientPrice = item.ingredientes.reduce((total, ingredient) => total + ingredient.precioAdicional, 0);
        const totalItemPrice = itemPrice + ingredientPrice;
        totalPrice += totalItemPrice;
    });

    totalPriceElement.textContent = `$${totalPrice}`;
}

// Función para crear un elemento de hamburguesa en el carrito
// Función para crear un elemento de hamburguesa en el carrito
function createCartItem(item, index) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    const name = document.createElement('h3');
    name.textContent = item.nombre;

    const price = document.createElement('p');
    price.textContent = `$${item.precio}`;

    const ingredientList = document.createElement('div');
    ingredientList.classList.add('ingredient-list');
    item.ingredientes.forEach(ingredient => {
        // Agregar la cantidad de veces que se ha agregado cada ingrediente
        const ingredientCountText = document.createTextNode(` x${ingredientCount[ingredient.nombre] || 1} `);
        const ingredientElement = document.createElement('span');
        ingredientElement.textContent = ingredient.nombre;
        ingredientElement.appendChild(ingredientCountText);
        ingredientList.appendChild(ingredientElement);
    });

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Eliminar';
    removeBtn.addEventListener('click', () => removeFromCart(index));

    cartItem.appendChild(name);
    cartItem.appendChild(price);
    cartItem.appendChild(ingredientList);
    cartItem.appendChild(removeBtn);

    return cartItem;
}

// Función para guardar el carrito en el localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para cargar el carrito desde el localStorage
function loadCartFromLocalStorage() {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
        cart = savedCart;
        updateCart();
    }
}

// Evento al cargar la página para cargar los datos del menú y el carrito
window.addEventListener('load', () => {
    loadMenuData();
    loadCartFromLocalStorage();
});

// Evento para finalizar la compra
checkoutBtn.addEventListener('click', () => {
    // Mostrar mensaje de agradecimiento en el modal
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = `
        <p class="centerM">¡Muchas gracias por su compra!</p>
    `;

    // Mostrar el modal
    const modal = document.getElementById("myModal");
    modal.style.display = "block";

    // Cerrar el modal al hacer clic en cualquier parte fuera del contenido
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Limpiar el carrito después de la compra
    limpiarCarrito();
});

// Función para limpiar el carrito
function limpiarCarrito() {
    cart = []; // Vacía el array de carrito
    updateCart(); // Actualiza la interfaz del carrito
    saveCartToLocalStorage(); // Guarda el carrito vacío en el localStorage
}


