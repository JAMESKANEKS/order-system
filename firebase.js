// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCdwCFv4lzgNM8dAMu87CSO6ByCr5ypbH0",
  authDomain: "order-system-836c6.firebaseapp.com",
  databaseURL: "https://order-system-836c6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "order-system-836c6",
  storageBucket: "order-system-836c6.firebasestorage.app",
  messagingSenderId: "364301147744",
  appId: "1:364301147744:web:cb381f3a602108d4cbed05",
  measurementId: "G-KWZPKDETBB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Load orders from database
export async function loadOrders() {
  const snap = await get(ref(db, "orders"));
  return snap.exists() ? snap.val() : {};
}

// Add or increase order
export async function addOrder(name, price) {
  const orders = await loadOrders();
  if (!orders[name]) orders[name] = { qty: 1, price };
  else orders[name].qty += 1;
  await set(ref(db, "orders"), orders);
}

// Remove or decrease order
export async function removeOrder(name) {
  const orders = await loadOrders();
  if (!orders[name]) return;
  orders[name].qty -= 1;
  if (orders[name].qty <= 0) delete orders[name];
  await set(ref(db, "orders"), orders);
}
