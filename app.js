// UVT 2024: $47,052 (ajustar cada año)
const UVT = 47052;
const INGRESOS_LIMITE = 50000 * UVT;
const ACTIVOS_LIMITE = 30000 * UVT;

function startForProfit() {
  document.getElementById("step1").style.display = "none";
  document.getElementById("step-profit").style.display = "block";
}

function startNonProfit() {
  document.getElementById("step1").style.display = "none";
  document.getElementById("step-nonprofit").style.display = "block";
}

function clasificarGrupo1() {
  const form = document.getElementById("profit-form");
  const bolsa = form.bolsa.value;
  const empleados = form.empleados.value;
  const ingresos = form.ingresos.value;
  const activos = form.activos.value;

  if (!bolsa || !empleados || !ingresos || !activos) {
    alert("Por favor responde todas las preguntas.");
    return;
  }

  let grupo = "2";
  let razones = [];

  if (bolsa === "si") {
    grupo = "1";
    razones.push("Cotiza en bolsa o ha emitido deuda pública");
  } else if (empleados === "si") {
    grupo = "1";
    razones.push("Tiene más de 250 empleados");
  } else if (ingresos === "si") {
    grupo = "1";
    razones.push("Ingresos anuales superan 50.000 UVT (~$2.352.600.000)");
  } else if (activos === "si") {
    grupo = "1";
    razones.push("Activos superan 30.000 UVT (~$1.411.560.000)");
  } else {
    razones.push("No cumple ninguna condición para el Grupo 1");
  }

  mostrarResultado(grupo, razones, "empresa");
}

function clasificarGrupo3() {
  const form = document.getElementById("nonprofit-form");
  const bolsa = form.bolsa_efil.value;
  const tamano = form.tamano_efil.value;

  if (!bolsa || !tamano) {
    alert("Por favor responde todas las preguntas.");
    return;
  }

  let grupo = "3";
  let razones = [];

  if (bolsa === "si") {
    grupo = "1";
    razones.push("Cotiza en bolsa o ha emitido deuda pública");
  } else if (tamano === "si") {
    grupo = "1";
    razones.push("Supera umbrales de tamaño (empleados, ingresos o activos)");
  } else {
    razones.push("No cotiza, no emite deuda y está bajo los umbrales de tamaño");
  }

  mostrarResultado(grupo, razones, "efil");
}

function mostrarResultado(grupo, razones, tipo) {
  document.getElementById("step-profit").style.display = "none";
  document.getElementById("step-nonprofit").style.display = "none";
  const resultDiv = document.getElementById("result");
  const resultText = document.getElementById("result-text");

  let grupoTexto = "";
  let norma = "";
  let enlace = "https://www.minhacienda.gov.co";

  if (grupo === "1") {
    grupoTexto = "Grupo 1 (NIIF Completas)";
    norma = "NIIF Completas";
  } else if (grupo === "2") {
    grupoTexto = "Grupo 2 (NIIF para PYMES)";
    norma = "NIIF para PYMES";
  } else {
    grupoTexto = "Grupo 3 (NIIF para entidades sin fines de lucro)";
    norma = "NIIF para EFIL";
  }

  resultText.innerHTML = `
    <h3>🏢 ${grupoTexto}</h3>
    <p><strong>Norma aplicable:</strong> ${norma}</p>
    <p><strong>Razones:</strong></p>
    <ul>${razones.map(r => `<li>${r}</li>`).join('')}</ul>
    <p>📄 <a href="${enlace}" target="_blank">Consulta la Resolución 057 de 2017</a></p>
    <p>💡 Recuerda revisar tu clasificación cada año.</p>
  `;

  resultDiv.style.display = "block";
}

function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.setTextColor(0, 91, 150);
  doc.text("NIIF Colombia Clasificador", 20, 20);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const texto = document.getElementById("result-text").innerText;
  const lines = doc.splitTextToSize(texto, 170);
  doc.text(lines, 20, 40);

  doc.setFontSize(10);
  doc.text("Basado en la Resolución 057 de 2017. No sustituye asesoría contable.", 20, 250);

  doc.save("clasificacion_niif.pdf");
}

function resetApp() {
  document.getElementById("result").style.display = "none";
  document.getElementById("step1").style.display = "block";
  document.getElementById("profit-form").reset();
  document.getElementById("nonprofit-form").reset();
}
