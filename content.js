
(function () {
  const DISCOUNTS = [10, 15, 20];

  function parseMoney(str) {
    if (!str) return null;
    const m = str.match(/\$[\d,]+(?:\.\d{2})?/);
    if (!m) return null;
    return parseFloat(m[0].replace(/[$,]/g, ""));
  }

  function findPrices() {
    const prices = {};

    const estStrong = document.querySelector(".price-container strong");
    const estPrice = estStrong ? parseMoney(estStrong.textContent) : null;
    if (estPrice != null) prices["Estimated Repair"] = estPrice;

    const refurbBtn = document.querySelector('button.modal-option[data-id="USPP"] .ActualPrice');
    const refurbPrice = refurbBtn ? parseMoney(refurbBtn.textContent) : null;
    if (refurbPrice != null) prices["Refurbished"] = refurbPrice;

    const nuOriginalBtn = document.querySelector('button.modal-option[data-id="NSFP"] .ActualPrice');
    const nuOriginalPrice = nuOriginalBtn ? parseMoney(nuOriginalBtn.textContent) : null;
    if (nuOriginalPrice != null) prices["Never Used - Original Packaging"] = nuOriginalPrice;

    const nuRadwellBtn = document.querySelector('button.modal-option[data-id="NSPP"] .ActualPrice');
    const nuRadwellPrice = nuRadwellBtn ? parseMoney(nuRadwellBtn.textContent) : null;
    if (nuRadwellPrice != null) prices["Never Used - Radwell Packaging"] = nuRadwellPrice;

    return prices;
  }

  function createBox(prices) {
    const box = document.createElement("div");
    box.style.position = "fixed";
    box.style.left = "10px";
    box.style.top = "100px";
    box.style.background = "#fefcea"; // original yellow
    box.style.color = "#333";
    box.style.padding = "12px";
    box.style.border = "2px solid #ffa500";
    box.style.borderRadius = "10px";
    box.style.zIndex = "9999";
    box.style.fontSize = "11px";
    box.style.fontFamily = "Arial, sans-serif";
    box.style.boxShadow = "2px 2px 8px rgba(0,0,0,0.25)";
    box.style.width = "240px";
    box.style.lineHeight = "1.25";

    const map = {
      "Estimated Repair": "re_price",
      "Refurbished": "us_price",
      "Never Used - Original Packaging": "fn_price",
      "Never Used - Radwell Packaging": "ns_price"
    };

    const out = {};
    for (let label in prices) {
      if (map[label]) {
        let discounted = prices[label] * 0.90;
        let rounded = Math.round(discounted / 5) * 5;
        out[map[label]] = rounded;
      }
    }
    const jsonString = JSON.stringify(out, null, 2);

    // Build HTML
    let html = `<strong style="font-size:12px;">Discounted Price Tiers:</strong><br/><br/>`;

    DISCOUNTS.forEach(percent => {
      html += `<div style="margin-bottom:4px;"><u><b style="font-size:12px;">${percent}% Discounted Prices</b></u></div>`;
      for (let label in prices) {
        const discounted = (prices[label] * (1 - percent / 100)).toFixed(2);
        html += `<div style="margin-left: 10px;"><b>${label}:</b> $${discounted}</div>`;
      }
      html += `<br/>`;
    });

    html += `
    <hr style="margin:8px 0;">
    <div style="font-weight:bold; margin-bottom:4px; font-size:12px;">JSON (10% rounded)</div>
    <pre style="white-space:pre-wrap; margin:0; padding:6px; background:#eee; border-radius:6px; font-size:10px; line-height:1.2;">${jsonString}</pre>
    <button id="rw-copy-json" style="
      margin-top:8px;
      width:100%;
      padding:4px;
      background:#007bff;
      color:#fff;
      border:none;
      border-radius:5px;
      cursor:pointer;
      font-size:11px;
    ">Copy JSON</button>
    `;

    const now = new Date();
    const dateString = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`;
    html += `<div style="margin-top: 8px; font-size:10px; color:#666;"><em>Last Evaluated: ${dateString}</em></div>`;

    box.innerHTML = html;
    document.body.appendChild(box);

    // Flash red on copy
    document.getElementById("rw-copy-json").addEventListener("click", () => {
      navigator.clipboard.writeText(jsonString);

      const originalBg = box.style.background;
      box.style.transition = "background 0.4s ease";
      box.style.background = "#ff4d4d"; // red flash

      setTimeout(() => {
        box.style.background = originalBg; // fade back to yellow
      }, 600);
    });
  }

  window.addEventListener("load", () => {
    const prices = findPrices();
    if (Object.keys(prices).length > 0) createBox(prices);
  });
})();
