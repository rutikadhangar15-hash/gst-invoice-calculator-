const itemsBody = document.getElementById("itemsBody");
const addItemBtn = document.getElementById("addItemBtn");

const subtotalElement = document.getElementById("subtotal");
const taxAmountElement = document.getElementById("taxAmount");
const grandTotalElement = document.getElementById("grandTotal");
const taxLabelElement = document.getElementById("taxLabel");

const generateBtn = document.getElementById("generateBtn");
const invoicePreview = document.getElementById("invoicePreview");

let items = [
  {
    name: "",
    quantity: 1,
    price: 0,
    gst: 18
  }
];

function formatCurrency(amount) {
  return `₹${amount.toFixed(2)}`;
}

function renderItems() {
  itemsBody.innerHTML = "";

  items.forEach((item, index) => {
    const row = document.createElement("tr");

    const itemTotal = item.quantity * item.price;
    const gstAmount = itemTotal * (item.gst / 100);
    const totalWithGst = itemTotal + gstAmount;

    row.innerHTML = `
      <td>
        <input
          class="item-input"
          type="text"
          value="${item.name}"
          placeholder="Item name"
          oninput="updateItem(${index}, 'name', this.value)"
        />
      </td>

      <td>
        <input
          class="item-input"
          type="number"
          min="1"
          value="${item.quantity}"
          oninput="updateItem(${index}, 'quantity', this.value)"
        />
      </td>

      <td>
        <input
          class="item-input"
          type="number"
          min="0"
          value="${item.price}"
          oninput="updateItem(${index}, 'price', this.value)"
        />
      </td>

      <td>
        <select onchange="updateItem(${index}, 'gst', this.value)">
          <option value="0" ${item.gst == 0 ? "selected" : ""}>0%</option>
          <option value="5" ${item.gst == 5 ? "selected" : ""}>5%</option>
          <option value="12" ${item.gst == 12 ? "selected" : ""}>12%</option>
          <option value="18" ${item.gst == 18 ? "selected" : ""}>18%</option>
          <option value="28" ${item.gst == 28 ? "selected" : ""}>28%</option>
        </select>
      </td>

      <td>${formatCurrency(totalWithGst)}</td>

      <td>
        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      </td>
    `;

    itemsBody.appendChild(row);
  });

  calculateTotals();
}

function updateItem(index, field, value) {
  if (field === "name") {
    items[index][field] = value;
  } else {
    items[index][field] = Number(value);
  }

  renderItems();
}

function removeItem(index) {
  if (items.length === 1) {
    alert("At least one item is required.");
    return;
  }

  items.splice(index, 1);
  renderItems();
}

function calculateTotals() {
  let subtotal = 0;
  let totalTax = 0;

  items.forEach((item) => {
    const itemAmount = item.quantity * item.price;
    const gstAmount = itemAmount * (item.gst / 100);

    subtotal += itemAmount;
    totalTax += gstAmount;
  });

  const grandTotal = subtotal + totalTax;
  const gstType = document.querySelector('input[name="gstType"]:checked').value;

  if (gstType === "intra") {
    taxLabelElement.textContent = `CGST + SGST (₹${(totalTax / 2).toFixed(2)} + ₹${(totalTax / 2).toFixed(2)})`;
  } else {
    taxLabelElement.textContent = "IGST";
  }

  subtotalElement.textContent = formatCurrency(subtotal);
  taxAmountElement.textContent = formatCurrency(totalTax);
  grandTotalElement.textContent = formatCurrency(grandTotal);

  return { subtotal, totalTax, grandTotal, gstType };
}

function generateInvoice() {
  const businessName =
    document.getElementById("businessName").value || "Your Business Name";

  const customerName =
    document.getElementById("customerName").value || "Walk-in Customer";

  const invoiceNumber =
    document.getElementById("invoiceNumber").value || "INV-001";

  const invoiceDate =
    document.getElementById("invoiceDate").value ||
    new Date().toISOString().split("T")[0];

  const totals = calculateTotals();

  document.getElementById("previewBusinessName").textContent = businessName;
  document.getElementById("previewCustomerName").textContent = customerName;
  document.getElementById("previewInvoiceNumber").textContent = invoiceNumber;
  document.getElementById("previewInvoiceDate").textContent = invoiceDate;

  const previewItemsBody = document.getElementById("previewItemsBody");
  previewItemsBody.innerHTML = "";

  items.forEach((item) => {
    const itemAmount = item.quantity * item.price;
    const gstAmount = itemAmount * (item.gst / 100);
    const total = itemAmount + gstAmount;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name || "Unnamed Item"}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${item.gst}%</td>
      <td>${formatCurrency(total)}</td>
    `;

    previewItemsBody.appendChild(row);
  });

  document.getElementById("previewSubtotal").textContent =
    formatCurrency(totals.subtotal);

  document.getElementById("previewTaxAmount").textContent =
    formatCurrency(totals.totalTax);

  document.getElementById("previewGrandTotal").textContent =
    formatCurrency(totals.grandTotal);

  const previewTaxLabel = document.getElementById("previewTaxLabel");

  if (totals.gstType === "intra") {
    previewTaxLabel.innerHTML = `
      CGST: <strong>${formatCurrency(totals.totalTax / 2)}</strong>
      + SGST: <strong>${formatCurrency(totals.totalTax / 2)}</strong>
    `;
  } else {
    previewTaxLabel.innerHTML = `
      IGST: <strong>${formatCurrency(totals.totalTax)}</strong>
    `;
  }

  invoicePreview.classList.remove("hidden");
  invoicePreview.scrollIntoView({ behavior: "smooth" });
}

addItemBtn.addEventListener("click", () => {
  items.push({
    name: "",
    quantity: 1,
    price: 0,
    gst: 18
  });

  renderItems();
});

document.querySelectorAll('input[name="gstType"]').forEach((radio) => {
  radio.addEventListener("change", calculateTotals);
});

generateBtn.addEventListener("click", generateInvoice);

document.getElementById("invoiceDate").value =
  new Date().toISOString().split("T")[0];

renderItems();
