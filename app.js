let resultadoFinal = "";

function continuarTipoEntidad() {
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

function clasificarGrupo1() {
  const interes = document.getElementById("interes_publico").value;
  const empleados = document.getElementById("empleados_activos").value;
  const bolsa = document.getElementById("cotiza_bolsa").value;

  if (interes === "si" || empleados === "si" || bolsa === "si") {
    resultadoFinal = "La entidad pertenece al **Grupo 1 – NIIF Plenas**.";
  } else {
    resultadoFinal = "La entidad pertenece al **Grupo 2 – NIIF para PYMES**.";
  }

  mostrarResultado();
}

function clasificarGrupo3() {
  const interes = document.getElementById("interes_publico_efil").value;
  const tamano = document.getElementById("tamano_efil").value;

  if (interes === "si" || tamano === "si") {
    resultadoFinal = "La entidad aplica **NIIF Plenas (Grupo 1)**.";
  } else {
    resultadoFinal = "La entidad aplica **Normas de Información Financiera para ESAL**.";
  }

  mostrarResultado();
}

function mostrarResultado() {
  document.getElementById("step-profit").style.display = "none";
  document.getElementById("step-nonprofit").style.display = "none";

  document.getElementById("result-text").innerHTML = resultadoFinal;
  document.getElementById("result").style.display = "block";
}

function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const nombre = document.getElementById("nombreEmpresa").value;
  const sector = document.getElementById("sector").value;
  const anio = document.getElementById("anio").value;

  doc.setFontSize(14);
  doc.text("MIA – IA aplicada para todos los sectores", 20, 20);
  doc.setFontSize(11);

  doc.text(`Empresa: ${nombre}`, 20, 35);
  doc.text(`Sector: ${sector}`, 20, 45);
  doc.text(`Año fiscal: ${anio}`, 20, 55);

  doc.line(20, 60, 190, 60);

  doc.setFontSize(12);
  doc.text("Resultado de clasificación NIIF:", 20, 75);
  doc.text(resultadoFinal.replace(/\*\*/g, ""), 20, 90);

  doc.setFontSize(9);
  doc.text("Generado por MIA – by Mario Andrés Narváez Delgado", 20, 280);

  doc.save("Clasificacion_NIIF_MIA.pdf");
}

function resetApp() {
  location.reload();
}
