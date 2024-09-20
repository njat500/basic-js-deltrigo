document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".item");
    const productCompra = document.getElementById("productCompra");
    const totalElement = document.getElementById("total");
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    items.forEach(item => {
        item.querySelector(".btn-add-cart").addEventListener("click", () => {
            const title = item.querySelector(".itemTitle").innerText;
            const price = parseFloat(item.querySelector(".price").innerText.replace('$', ''));
            addItemToCart(title, price);
            mostrarNoti(`${title} añadido al carrito`);
        });
    });

    function addItemToCart(title, price) {
        const product = carrito.find(item => item.title === title);
        if (product) {
            product.quantity += 1;
        } else {
            carrito.push({ title, price, quantity: 1 });
        }
        saveCart();
        renderCart();
    }

    function renderCart() {
        productCompra.innerHTML = '';
        let total = 0;

        carrito.forEach(product => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('itemCompra');
            itemElement.innerHTML = `
                <span>${product.title}</span>
                <span>${product.quantity} x $${product.price}</span>
                <span>$${(product.price * product.quantity).toFixed(2)}</span>
            `;
            productCompra.appendChild(itemElement);
            total += product.price * product.quantity;
        });

        totalElement.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
    }

    function saveCart() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    document.getElementById("x").addEventListener("click", () => {
        carrito.length = 0;
        saveCart();
        renderCart();
        mostrarNoti("El carrito ha sido vaciado.");
    });

    document.getElementById("finalizarCompra").addEventListener("click", () => {
        if (carrito.length === 0) {
            mostrarNoti("El carrito está vacío.", true);
        } else {
            const data = {
                carrito: carrito,
                total: carrito.reduce((sum, item) => sum + item.price * item.quantity, 0)
            };

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "https://git.heroku.com/server-deltrigo.git", true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            xhr.onreadystatechange = function (){
                if (xhr.readyState === 4 && xhr.status === 200){
                    alert("Compra finalizada!");
                    carrito.length = 0;
                    saveCart();
                    renderCart();
                }
            };

            xhr.send(JSON.stringify(data));
        }
    });

    renderCart();
});

function cerrarCarrito(){
    const exit = document.getElementById("cart-wrap");
    exit.classList.add("animate__animated", "animate__slideOutUp");

    setTimeout(() => {
        document.getElementById("fondo-oscuro").style.display = "none";
        exit.style.display = "none";
        exit.classList.remove("animate__animated", "animate__slideOutUp", "animate__slideInDown");
    }, 1000);
}

function mostrarNoti(message, esError = false){
    const noti = document.createElement("div");
    noti.className = esError ? "notificacion error" : "notification success";
    noti.innerText = message;
    document.body.appendChild(noti);

    setTimeout(() => {
        noti.remove();
    }, 3000);
}

function revelarCarrito(){
    const cartWrap = document.getElementById("cart-wrap");
    cartWrap.classList.remove("animate__slideOutUp");
    cartWrap.classList.add("animate__animated", "animate__slideInDown");
    document.getElementById("fondo-oscuro").style.display = "block";
    cartWrap.style.display = "block";
}
