let data = [];

// Debounce para evitar travamentos ao digitar
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function handleInboundInput() {
  const inboundZip = document.getElementById("inboundZip").value.trim();
  const outboundContainer = document.getElementById("outboundContainer");

  if (inboundZip.length > 0) {
    outboundContainer.style.display = "block";
    document.getElementById("inboundZip").readOnly = true;
  } else {
    outboundContainer.style.display = "none";
    document.getElementById("outboundZip").value = "";
    document.getElementById("tabela").style.display = "none";
  }
}

function loadDataForOutbound(outbound) {
  if (!outbound) {
    data = [];
    document.getElementById("tabela").style.display = "none";
    return;
  }

  fetch(`${outbound}.json`)
    .then(response => response.json())
    .then(json => {
      data = json;
      filterTable();
    })
    .catch(error => {
      console.error('Erro ao carregar o arquivo JSON:', error);
      data = [];
      document.getElementById("tabela").style.display = "none";
    });
}

document.getElementById("outboundZip").addEventListener("change", function () {
  const outbound = this.value.trim().toUpperCase();
  loadDataForOutbound(outbound);
});

function filterTable() {
  const outboundZipInput = document.getElementById("outboundZip").value.trim().toUpperCase();
  const inboundZip = document.getElementById("inboundZip").value.trim();
  const tbody = document.getElementById("dadosTabela");
  const thead = document.querySelector("#tabela thead tr");
  const table = document.getElementById("tabela");

  tbody.innerHTML = "";

  const results = data.filter(entry =>
    (outboundZipInput === "" || entry.outbound.includes(outboundZipInput)) &&
    (inboundZip === "" || entry.inboundZip.includes(inboundZip))
  );

  if (results.length === 0) {
    table.style.display = "none";
    return;
  }

  const carriers = ["AACT", "CNWY", "CTII", "DAFG", "EXLA", "OAKH", "ODFL", "PITD", "PYLE", "RLCA", "SAIA", "SEFL", "TAXA", "TFIN"];

  const visibleCarriers = carriers.filter(carrier =>
    results.some(entry => typeof entry[carrier] === "number" && entry[carrier] > 0)
  );

  thead.innerHTML = `
    <th>Outbound</th>
    <th>Outbound Zip</th>
    <th>Inbound</th>
    <th>Inbound Zip</th>
    ${visibleCarriers.map(c => `<th>${c}</th>`).join("")}
  `;

  results.forEach(entry => {
    let row = "<tr>";
    row += `<td>${entry.outbound}</td>`;
    row += `<td>${entry.outboundZip}</td>`;
    row += `<td>${entry.inbound}</td>`;
    row += `<td>${entry.inboundZip}</td>`;

    visibleCarriers.forEach(carrier => {
      const value = entry[carrier];
      row += `<td>${typeof value === "number" && value > 0 ? value : ""}</td>`;
    });

    row += "</tr>";
    tbody.innerHTML += row;
  });

  table.style.display = "table";
}

function calculateDays() {
  const outboundZip = document.getElementById("outboundZip").value.trim().toUpperCase();
  const inboundZip = document.getElementById("inboundZip").value.trim();
  const deliveryDateInput = document.getElementById("deliveryDate").value;
  const result = document.getElementById("resultado");

  if (!outboundZip || !inboundZip || !deliveryDateInput) {
    result.innerHTML = "Please enter both zips and the desired delivery date.";
    return;
  }

  const deliveryDate = new Date(deliveryDateInput + "T00:00:00");

  if (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
    result.innerHTML = "⚠️ Deliveries cannot be made on weekends. Please select a valid date (Monday to Friday).";
    return;
  }

  const match = data.find(d =>
    d.outbound === outboundZip &&
    d.inboundZip === inboundZip
  );

  if (match) {
    const days = [match.AACT, match.CNWY, match.CTII, match.DAFG, match.EXLA, match.OAKH, match.ODFL, match.PITD, match.PYLE, match.RLCA, match.SAIA, match.SEFL, match.TAXA, match.TFIN]
      .filter(v => typeof v === "number" && v > 0);

    if (days.length > 0) {
      const minDays = Math.min(...days);
      const shippingDate = new Date(deliveryDate);
      shippingDate.setDate(deliveryDate.getDate() - minDays);

      const shippingFormatted = shippingDate.toLocaleDateString('en-US');
      const deliveryFormatted = deliveryDate.toLocaleDateString('en-US');

      result.innerHTML = `
        The transport time between <b>${outboundZip}</b> and <b>${inboundZip}</b> is <b>${minDays} day(s)</b>.<br>
        To ensure delivery on <b>${deliveryFormatted}</b>, you must RDD on <b>${shippingFormatted}</b>.
      `;
    } else {
      result.innerHTML = "No information available for this route.";
    }
  } else {
    result.innerHTML = "Route not found.";
  }
}

function resetSearch() {
  document.getElementById("inboundZip").value = "";
  document.getElementById("inboundZip").readOnly = false;

  document.getElementById("outboundZip").value = "";
  document.getElementById("deliveryDate").value = "";
  document.getElementById("resultado").innerHTML = "";

  data = [];
  document.getElementById("dadosTabela").innerHTML = "";
  document.querySelector("#tabela thead tr").innerHTML = "";
  document.getElementById("tabela").style.display = "none";
  document.getElementById("outboundContainer").style.display = "none";

  document.getElementById("inboundZip").focus();
}

// Aplica o tema preferido do sistema ou o tema salvo
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.body.classList.toggle("dark", savedTheme === "dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.classList.toggle("dark", prefersDark);
  }

  const btn = document.querySelector(".theme-toggle");
  if (btn) {
    btn.textContent = document.body.classList.contains("dark")
      ? "☀️ Change to white mode"
      : "🌙 Change to dark mode";
  }

  // ⬇️ Adiciona debounce ao campo Inbound Zip
  document.getElementById("inboundZip").addEventListener("input", debounce(() => {
    handleInboundInput();
    filterTable();
  }, 3000));
});

// Alterna o tema e salva preferência
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem("theme", isDark ? "dark" : "light");

  const btn = document.querySelector('.theme-toggle');
  btn.textContent = isDark
    ? '☀️ Change to white mode'
    : '🌙 Change to dark mode';
}
