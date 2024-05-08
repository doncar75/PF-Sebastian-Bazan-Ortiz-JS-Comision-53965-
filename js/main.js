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

    burger.ingredientes.forEach(ingredient => {
        const ingredientBtn = document.createElement('button');
        ingredientBtn.textContent = `${ingredient.nombre} (+$${ingredient.precioAdicional})`;
        ingredientBtn.addEventListener('click', () => addIngredientToCart(burger, ingredient));
        ingredientButtons.appendChild(ingredientBtn);
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

// Función para agregar un ingrediente al carrito
function addIngredientToCart(burger, ingredient) {
    const cartItem = cart.find(item => item.nombre === burger.nombre);
    if (cartItem) {
        cartItem.ingredientes.push(ingredient);
        updateCart();
        saveCartToLocalStorage();
    }
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
        const ingredientElement = document.createElement('span');
        ingredientElement.textContent = ingredient.nombre;
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
    const paymentMethod = paymentMethodElement.value;
    if (paymentMethod === 'efectivo' || paymentMethod === 'tarjeta') {
        alert(`¡Gracias por tu compra! Tu pago con ${paymentMethod} ha sido procesado.`);
        limpiarCarrito(); // Limpia el carrito
        totalPriceElement.textContent = '$0'; // Limpia el total acumulado
        // Limpiar el total acumulado en el localStorage
        localStorage.removeItem('cartTotal');
    } else {
        alert('Por favor, selecciona un método de pago válido.');
    }
});

// Función para limpiar el carrito
function limpiarCarrito() {
    cart = []; // Vacía el array de carrito
    updateCart(); // Actualiza la interfaz del carrito
    saveCartToLocalStorage(); // Guarda el carrito vacío en el localStorage
}
