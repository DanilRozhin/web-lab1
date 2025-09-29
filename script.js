document.addEventListener("DOMContentLoaded", () => {
    const add_busket_buttons = document.querySelectorAll(".add-busket");
    const openCartButton = document.getElementById("openCart");
    const modalCart = document.getElementById("cartModal");
    const modalCheckout = document.getElementById("checkoutModal");
    const closeCartButton = document.getElementById("closeCart");
    const closeCheckoutButton = document.getElementById("closeCheckout");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const modalContainer = modalCart.querySelector(".modal-container");
    const cartWarning = document.getElementById("cartWarning");
    const checkoutForm = document.getElementById("checkoutForm");
    const formError = document.getElementById("formError");

    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    function updateButtons() {
        add_busket_buttons.forEach(button => {
            const productName = button.dataset.product;
            if (cart[productName]) {
                button.textContent = `В корзине: ${cart[productName]}`;
                button.style.background = "#ffffff";
                button.style.color = "#000000";
                button.style.border = "3px solid #000000";
            } else {
                button.textContent = "Добавить в корзину";
                button.style.background = "#222";
                button.style.color = "#fff";
                button.style.border = "none";
            }
        });
    }

    // Очистка форм при закрытии
    function clearCheckoutForm() {
        checkoutForm.firstName.value = '';
        checkoutForm.lastName.value = '';
        checkoutForm.address.value = '';
        checkoutForm.phone.value = '';
        formError.style.display = 'none';
    }

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        updateButtons();
    }

    function renderCart() {
        modalContainer.innerHTML = "";
        cartWarning.style.display = "none";

        const entries = Object.entries(cart);

        if (entries.length === 0) {
            modalContainer.innerHTML = `<p>Товаров нет</p>`;
            return;
        }

        const list = document.createElement("ul");
        list.style.listStyle = "none";
        list.style.padding = "0";

        let total = 0;

        entries.forEach(([id, quantity]) => {
            const productCard = document.querySelector(`[data-product="${id}"]`).closest(".product-card");
            const title = productCard.querySelector(".product-title").textContent;
            const priceText = productCard.querySelector(".product-price").textContent;
            const price = parseInt(priceText);

            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.alignItems = "center";
            li.style.marginBottom = "12px";
            li.style.paddingBottom = "8px";
            li.style.borderBottom = "1px solid #ddd";
            li.style.textAlign = "left";

            total += quantity * price;

            li.innerHTML = `
                <span>${title}</span>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <button class="decrease" data-id="${id}">–</button>
                    <span>${quantity}</span>
                    <button class="increase" data-id="${id}">+</button>
                    <span>${quantity * price} ₽</span>
                    <button class="remove" data-id="${id}">Удалить</button>
                </div>
            `;

            list.appendChild(li);
        });

        const totalBlock = document.createElement("p");
        totalBlock.style.textAlign = "right";
        totalBlock.style.fontWeight = "600";
        totalBlock.textContent = `Итого: ${total} ₽`;

        modalContainer.appendChild(list);
        modalContainer.appendChild(totalBlock);

        modalContainer.querySelectorAll(".increase").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                cart[id] = (cart[id] || 0) + 1;
                saveCart();
                renderCart();
            });
        });

        modalContainer.querySelectorAll(".decrease").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                if (cart[id] > 1) {
                    cart[id] -= 1;
                } else {
                    delete cart[id];
                }
                saveCart();
                renderCart();
            });
        });

        modalContainer.querySelectorAll(".remove").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                delete cart[id];
                saveCart();
                renderCart();
            });
        });
    }

    // Добавление в корзину
    add_busket_buttons.forEach(button => {
        button.addEventListener("click", () => {
            const productName = button.dataset.product;
            cart[productName] = (cart[productName] || 0) + 1;
            saveCart();
        });
    });

    // Корзина
    openCartButton.addEventListener("click", () => {
        renderCart();
        modalCart.classList.add("active");
    });

    closeCartButton.addEventListener("click", () => {
        modalCart.classList.remove("active");
    });

    modalCart.addEventListener("click", (e) => {
        if (e.target === modalCart) modalCart.classList.remove("active");
    });

    // Оформление заказа
    checkoutBtn.addEventListener("click", () => {
        if (Object.keys(cart).length === 0) {
            cartWarning.style.display = "block";
            return;
        }
        modalCart.classList.remove("active");
        modalCheckout.classList.add("active");
    });

    closeCheckoutButton.addEventListener("click", () => {
        modalCheckout.classList.remove("active");
        clearCheckoutForm();
    });

    modalCheckout.addEventListener("click", (e) => {
        if (e.target === modalCheckout) {
            modalCheckout.classList.remove("active");
            clearCheckoutForm();
        }
    });

    // Валидация формы
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        formError.style.display = "none";

        const firstName = checkoutForm.firstName.value.trim();
        const lastName = checkoutForm.lastName.value.trim();
        const address = checkoutForm.address.value.trim();
        const phone = checkoutForm.phone.value.trim();

        if (!firstName || !lastName || !address || !phone) {
            formError.style.display = "block";
            return;
        }

        alert("Заказ создан!");
        modalCheckout.classList.remove("active");
        cart = {};
        saveCart();
        clearCheckoutForm();
    });

    // Восстановление кнопок
    updateButtons();
});
