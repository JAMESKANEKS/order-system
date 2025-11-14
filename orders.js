// orders.js
import { addOrder, removeOrder, loadOrders } from "./firebase.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
  const orderListEl = document.getElementById("order-list");
  const subtotalEl = document.getElementById("subtotal");
  const orderNowBtn = document.getElementById("order-now");

  if (!orderListEl || !subtotalEl || !orderNowBtn) return;

  async function updateFooterDisplay() {
    try {
      const orders = await loadOrders();
      orderListEl.innerHTML = "";
      let subtotal = 0;

      for (const name in orders) {
        const item = orders[name];
        subtotal += item.qty * item.price;

        const div = document.createElement("div");
        div.classList.add("order-item");
        div.innerHTML = `
          <span>${name} x${item.qty}</span>
          <button class="remove-btn" data-name="${name}">-</button>
        `;
        orderListEl.appendChild(div);
      }

      subtotalEl.textContent = `P${subtotal}`;

      document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const name = btn.dataset.name;
          if (!name) return;
          await removeOrder(name);
          updateFooterDisplay();
        });
      });
    } catch (err) {
      console.error("Error updating orders:", err);
    }
  }

  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      if (!name || isNaN(price)) return;
      try {
        await addOrder(name, price);
        updateFooterDisplay();
      } catch (err) {
        console.error("Error adding order:", err);
      }
    });
  });

  // Order Now functionality
  orderNowBtn.addEventListener("click", async () => {
    const confirmed = confirm("Are you sure you want to place the order?");
    if (!confirmed) return;

    const orders = await loadOrders();
    if (!orders || Object.keys(orders).length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const db = getDatabase();
    const orderNumber = Math.floor(100000 + Math.random() * 900000); // Short 6-digit number

    // Save order to Firebase
    await set(ref(db, `orderHistory/${orderNumber}`), orders);

    // Clear cart
    await set(ref(db, "orders"), {});

    // Redirect to receipt page
    window.location.href = `receipt.html?order=${orderNumber}`;
});

  updateFooterDisplay();
});
