let datos = {};

function continuarTipoEntidad() {
  const empresa = document.getElementById("empresa").value;
  const anio = document.getElementById("anio").value;

  if (!empresa || !anio) {
    alert("Completa los datos obligatorios");
    return;
  }

  datos.empresa = empresa;
  datos.sector = document.getElementById("sector").value;
  datos.anio = anio;

  document.getElementById("step-datos").style.display = "none";
  document.getElementById("step1").style.display = "block";
}

function startForProfit() {
  document.getElementById("step1").style.display = "none";
  document.getElementById("step-profit").style.display = "block";
}

function startNonProfit() {
  document.getElementById("step1").style.display = "none";
  document.getElementById("step-nonprofit").style.display = "block";
}

function clasificar() {
  const interes = document.getElementById("interes_publico").value;
  const tamano = document.getElementById("tamano").value;

  if (!interes || !tamano) {
    alert("Responde todas las preguntas");
    return;
  }

  let grupo = "Grupo 2 (NIIF para PYMES)";

  if (interes === "si" || tamano === "si") {
    grupo = "Grupo 1 (NIIF Plenas)";
  }

  mostrarResultado(grupo);
}

function clasificarESAL() {
  const interes = document.getElementById("interes_publico_esal").value;

  if (!interes) {
    alert("Selecciona una opción");
    return;
  }

  const grupo = interes === "si"
    ? "Grupo 1 (NIIF Plenas – ESAL)"
    : "Grupo 3 (Contabilidad Simplificada)";

  mostrarResultado(grupo);
}

function mostrarResultado(grupo) {
  datos.grupo = grupo;

  document.getElementById("step-profit").style.display = "none";
  document.getElementById("step-nonprofit").style.display = "none";
  document.getElementById("result").style.display = "block";

  document.getElementById("result-text").innerHTML = `
    <p><strong>Empresa:</strong> ${datos.empresa}</p>
    <p><strong>Sector:</strong> ${datos.sector || "No indicado"}</p>
    <p><strong>Año fiscal:</strong> ${datos.anio}</p>
    <p><strong>Clasificación:</strong> ${grupo}</p>
  `;
}

function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("MIA – Clasificación NIIF Colombia", 20, 20);

  doc.setFontSize(11);
  doc.text(`Empresa: ${datos.empresa}`, 20, 40);
  doc.text(`Sector: ${datos.sector || "No indicado"}`, 20, 50);
  doc.text(`Año fiscal: ${datos.anio}`, 20, 60);
  doc.text(`Resultado: ${datos.grupo}`, 20, 80);

  doc.setFontSize(9);
  doc.text("Elaborado por MIA – Mario Andrés Narváez Delgado", 20, 280);

  doc.save("Clasificacion_NIIF_MIA.pdf");
}

function resetApp() {
  location.reload();
}
