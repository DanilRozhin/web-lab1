document.addEventListener("DOMContentLoaded", () => {
    const add_busket_buttons = document.querySelectorAll(".add-busket");
    const openCartButton = document.getElementById("openCart");
    const closeCartButton = document.getElementById("closeCart");
    const modal = document.querySelector(".modal");

    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    // Восстанавление состояния кнопок
    add_busket_buttons.forEach(button => {
        const productName = button.dataset.product;
        if (cart[productName]) {
            button.textContent = "В корзине: ${cart[productName]}";
            button.style.background = "#ffffff";
            button.style.color = "#000000";
            button.style.border = "3px solid #000000";
        }
    });

    // Добавление в корзину
    add_busket_buttons.forEach(button => {
        button.addEventListener("click", () => {
            const productName = button.dataset.product;
            
            cart[productName] = (cart[productName] || 0) + 1;
            
            button.textContent = "В корзине: ${cart[productName]}";
            button.style.background = "#ffffff";
            button.style.color = "#000000";
            button.style.border = "3px solid #000000";
            
            localStorage.setItem("cart", JSON.stringify(cart));
        });
    });

    // Открытие корзины
    openCartButton.addEventListener("click", () => {
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
});
