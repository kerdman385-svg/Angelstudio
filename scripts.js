document.addEventListener("DOMContentLoaded", function () {
    // 1. Підрахунок вартості
    const checkboxes = document.querySelectorAll('.service-item input[type="checkbox"]');
    const totalPriceElement = document.getElementById('total-price');
    const totalPriceInput = document.getElementById('total-price-input');

    function calculateTotal() {
        let total = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                total += parseInt(checkbox.getAttribute('data-price')) || 0;
            }
        });
        
        if (totalPriceElement) {
            totalPriceElement.textContent = total;
        }
        if (totalPriceInput) {
            totalPriceInput.value = total + " грн";
        }
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateTotal);
    });

    calculateTotal();

    // 2. Відправка форми через AJAX
    const form = document.getElementById("my-form");
    const status = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");

    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Забороняємо стандартне перезавантаження
            
            const data = new FormData(form);
            
            if (status) {
                status.innerHTML = "Надсилання...";
                status.style.color = "#00f2fe";
            }
            if (submitBtn) {
                submitBtn.disabled = true;
            }

            fetch(form.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    if (status) {
                        status.innerHTML = "Дякуємо! Ваше замовлення успішно надіслано!";
                        status.style.color = "#4caf50";
                    }
                    form.reset();
                    calculateTotal();
                } else {
                    response.json().then(data => {
                        if (status) {
                            if (Object.hasOwn(data, 'errors')) {
                                status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                            } else {
                                status.innerHTML = "Помилка при відправці. Спробуйте ще раз.";
                            }
                            status.style.color = "#f44336";
                        }
                    });
                }
            }).catch(error => {
                if (status) {
                    status.innerHTML = "Помилка мережі. Перевірте з'єднання.";
                    status.style.color = "#f44336";
                }
            }).finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                }
            });
        });
    }
});