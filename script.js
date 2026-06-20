/* ============================================
   GST Invoice Calculator — Application Logic
   ============================================ */

(function () {
  'use strict';

  // --- DOM References ---
  const baseAmountInput = document.getElementById('baseAmount');
  const gstRateSelect   = document.getElementById('gstRate');
  const calculateBtn    = document.getElementById('btnCalculate');
  const clearBtn        = document.getElementById('btnClear');
  const resultsPanel    = document.getElementById('resultsPanel');

  // Result value elements
  const elBaseAmount  = document.getElementById('resBaseAmount');
  const elGstRate     = document.getElementById('resGstRate');
  const elGstAmount   = document.getElementById('resGstAmount');
  const elCgst        = document.getElementById('resCgst');
  const elSgst        = document.getElementById('resSgst');
  const elTotalAmount = document.getElementById('resTotalAmount');

  // --- Utilities ---

  /**
   * Format a number as Indian Rupee currency string.
   * e.g. 123456.5 → "₹1,23,456.50"
   */
  function formatINR(value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  /**
   * Validate the base amount input.
   * Returns the parsed number if valid, otherwise null.
   */
  function validateBaseAmount() {
    const raw = baseAmountInput.value.trim();

    if (raw === '' || isNaN(raw) || Number(raw) <= 0) {
      // Show error feedback
      baseAmountInput.classList.add('input-error');
      baseAmountInput.closest('.form-group').classList.add('shake');

      // Remove error styles after animation
      setTimeout(() => {
        baseAmountInput.closest('.form-group').classList.remove('shake');
      }, 400);

      return null;
    }

    baseAmountInput.classList.remove('input-error');
    return parseFloat(raw);
  }

  // --- Core Calculation ---

  function calculate() {
    const baseAmount = validateBaseAmount();
    if (baseAmount === null) {
      resultsPanel.classList.remove('visible');
      return;
    }

    const gstRate    = parseFloat(gstRateSelect.value);
    const gstAmount  = (baseAmount * gstRate) / 100;
    const cgst       = gstAmount / 2;
    const sgst       = gstAmount / 2;
    const totalAmount = baseAmount + gstAmount;

    // Populate result fields
    elBaseAmount.textContent  = formatINR(baseAmount);
    elGstRate.textContent     = gstRate + '%';
    elGstAmount.textContent   = formatINR(gstAmount);
    elCgst.textContent        = formatINR(cgst);
    elSgst.textContent        = formatINR(sgst);
    elTotalAmount.textContent = formatINR(totalAmount);

    // Reveal results panel
    resultsPanel.classList.add('visible');
  }

  // --- Clear / Reset ---

  function clearForm() {
    baseAmountInput.value = '';
    gstRateSelect.selectedIndex = 2; // Default to 18%
    baseAmountInput.classList.remove('input-error');
    resultsPanel.classList.remove('visible');
    baseAmountInput.focus();
  }

  // --- Event Listeners ---

  calculateBtn.addEventListener('click', calculate);
  clearBtn.addEventListener('click', clearForm);

  // Live recalculate when inputs change (only if results are already visible)
  baseAmountInput.addEventListener('input', function () {
    baseAmountInput.classList.remove('input-error');
    if (resultsPanel.classList.contains('visible')) {
      calculate();
    }
  });

  gstRateSelect.addEventListener('change', function () {
    if (resultsPanel.classList.contains('visible')) {
      calculate();
    }
  });

  // Allow Enter key to trigger calculation
  baseAmountInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculate();
    }
  });

  // Set current year in footer
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
