(function () {
  const LABELS = [
    { label: "Estimated Repair", regex: /est\.\s*\$([\d,]+(\.\d{2})?)/i },
    { label: "Refurbished", regex: /Refurbished.*?\$([\d,]+(\.\d{2})?)/i },
    { label: "Never Used - Radwell Packaging", regex: /Never Used - Radwell Packaging.*?\$([\d,]+(\.\d{2})?)/i },
    { label: "Never Used - Original Packaging", regex: /Never Used - Original Packaging.*?\$([\d,]+(\.\d{2})?)/i },
    { label: "New Product", regex: /New Product.*?\$([\d,]+(\.\d{2})?)/i }
  ];

  const DISCOUNTS = [10, 15, 20];

  function findPrices() {
    const prices = {};
    const elements = Array.from(document.querySelectorAll("body *"));
    for (let el of elements) {
      const text = el.textContent;
      for (let { label, regex } of LABELS) {
        if (!(label in prices)) {
          const match = text.match(regex);
          if (match) {
            prices[label] = parseFloat(match[1].replace(/,/g, ""));
          }
        }
      }
    }
    return prices;
  }

  function findLastValueUpdateDate() {
    const elements = Array.from(document.querySelectorAll("body *"));
    for (let el of elements) {
      const text = el.textContent.trim();
      const match = text.match(/^Last Value Update:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i); // only date part
      if (match) {
        return match[1]; // returns just the date (e.g. "10/30/2025")
      }
    }
    return null;
  }

  function createBox(prices, lastUpdatedDate) {
    const box = document.createElement("div");
    box.style.position = "fixed";
    box.style.left = "10px";
    box.style.top = "100px";
    box.style.background = "#fefcea";
    box.style.color = "#333";
    box.style.padding = "14px";
    box.style.border = "2px solid #ffa500";
    box.style.borderRadius = "10px";
    box.style.zIndex = "9999";
    box.style.fontSize = "14px";
    box.style.fontFamily = "Arial, sans-serif";
    box.style.boxShadow = "2px 2px 8px rgba(0,0,0,0.25)";
    box.innerHTML = `<strong>Discounted Price Tiers:</strong><br/><br/>`;

    DISCOUNTS.forEach(percent => {
      box.innerHTML += `<div style="margin-bottom: 6px;"><u><b>${percent}% Discounted Prices</b></u></div>`;
      for (let label in prices) {
        const discounted = (prices[label] * (1 - percent / 100)).toFixed(2);
        box.innerHTML += `<div style="margin-left: 12px;"><b>${label}:</b> $${discounted}</div>`;
      }
      box.innerHTML += `<br/>`;
    });

    if (lastUpdatedDate) {
      box.innerHTML += `<div style="font-size: 12px; color: #666; margin-top: 10px;"><b>Radwell Last Value Update:</b><br/>${lastUpdatedDate}</div>`;
    }

    document.body.appendChild(box);
  }

  window.addEventListener("load", () => {
    const prices = findPrices();
    const lastUpdateDate = findLastValueUpdateDate();

    if (Object.keys(prices).length > 0) {
      createBox(prices, lastUpdateDate);
    }
  });
})();
