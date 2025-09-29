// localStorage.removeItem("cart");

document.addEventListener("DOMContentLoaded", () => {
    const add_busket_buttons = document.querySelectorAll(".add-busket");
    const openCartButton = document.getElementById("openCart");
    const closeCartButton = document.getElementById("closeCart");
    const modal = document.querySelector(".modal");
    const modalContainer = document.querySelector(".modal-container");

    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    // Обновление текста на кнопках
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

    // Рендер корзины
    function renderCart() {
        modalContainer.innerHTML = "";

        const entries = Object.entries(cart);

        if (entries.length === 0) {
            modalContainer.innerHTML = `<p>Товаров нет</p>`;
            return;
        }

        const list = document.createElement("ul");
        list.style.listStyle = "none";
        list.style.padding = "0";
        list.style.margin = "0";

        entries.forEach(([id, quantity]) => {
            const productCard = document.querySelector(`[data-product="${id}"]`).closest(".product-card");
            const title = productCard.querySelector(".product-title").textContent;
            const priceText = productCard.querySelector(".product-price").textContent;
            const price = parseInt(priceText);

            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.alignItems = "center";
            li.style.textAlign = "left";
            li.style.marginBottom = "10px";
            li.style.paddingBottom = "8px";
            li.style.borderBottom = "1px solid #ddd";

            li.innerHTML = `
                <span>${title}</span>
                <span>${quantity} x ${price} ₽ = <b>${quantity * price} ₽</b></span>
            `;

            list.appendChild(li);
        });

        modalContainer.appendChild(list);
    }

    // Добавление в корзину
    add_busket_buttons.forEach(button => {
        button.addEventListener("click", () => {
            const productName = button.dataset.product;

            cart[productName] = (cart[productName] || 0) + 1;

            localStorage.setItem("cart", JSON.stringify(cart));
            updateButtons();
        });
    });

    // Открытие корзины
    openCartButton.addEventListener("click", () => {
        renderCart();
        modal.classList.add("active");
    });

    // Закрытие корзины по крестику
    closeCartButton.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    // Закрытие корзины по клику вне области
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });

    // Восстановление кнопок при загрузке
    updateButtons();
});
