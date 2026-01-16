// UVT 2025: $52.782 (para proyecciones 2026)
const UVT_2025 = 52782;
const UVT_2024 = 47052;
const UVT_2023 = 42412;

let datosEmpresa = {};

function continuarTipoEntidad() {
  const form = document.getElementById("datos-form");
  datosEmpresa = {
    nombre: form.nombre.value,
    nit: form.nit.value,
    sector: form.sector.value,
    anio: form.anio.value
  };

  // Validación básica de formato NIT (no bloqueante)
  if (!/^[0-9]{9,15}-[0-9]{1}$/.test(datosEmpresa.nit)) {
    alert("⚠️ Formato de NIT inválido. Ej: 123456789-0 (pero puede continuar)");
  }

  // Ocultar este paso y mostrar el tipo de entidad
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
  const form = document.getElementById("profit-form");
  const interes_publico = form.interes_publico.value;
  const empleados = form.empleados.value;
  const ingresos = form.ingresos.value;
  const activos = form.activos.value;

  if (!interes_publico || !empleados || !ingresos || !activos) {
    alert("Por favor responde todas las preguntas.");
    return;
  }

  let grupo = "2";
  let razones = [];

  if (interes_publico === "si") {
    grupo = "1";
    razones.push("Es entidad de interés público (cotiza en bolsa, tiene 100+ aportantes, es vigilada, etc.)");
  } else if (empleados === "si") {
    grupo = "1";
    razones.push("Tiene más de 250 empleados");
  } else if (ingresos === "si") {
    grupo = "1";
    razones.push("Ingresos anuales superan 50.000 UVT");
  } else if (activos === "si") {
    grupo = "1";
    razones.push("Activos superan 30.000 UVT");
  } else {
    razones.push("No cumple ninguna condición para el Grupo 1");
  }

  mostrarResultado(grupo, razones, "empresa");
}

function clasificarGrupo3() {
  const form = document.getElementById("nonprofit-form");
  const interes_publico = form.interes_publico_efil.value;
  const tamano = form.tamano_efil.value;

  if (!interes_publico || !tamano) {
    alert("Por favor responde todas las preguntas.");
    return;
  }

  let grupo = "3";
  let razones = [];

  if (interes_publico === "si") {
    grupo = "1";
    razones.push("Es entidad de interés público (100+ aportantes, recursos públicos, vigilada, etc.)");
  } else if (tamano === "si") {
    grupo = "1";
    razones.push("Supera umbrales de tamaño (empleados, ingresos o activos)");
  } else {
    razones.push("No es de interés público y está bajo los umbrales de tamaño");
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

  // Configurar UVT según año seleccionado
  let uvtValor, uvtTexto;
  if (datosEmpresa.anio == "2026") {
    uvtValor = UVT_2025;
    uvtTexto = "52.782 (2025)";
  } else if (datosEmpresa.anio == "2025") {
    uvtValor = UVT_2024;
    uvtTexto = "47.052 (2024)";
  } else {
    uvtValor = UVT_2023;
    uvtTexto = "42.412 (2023)";
  }

  // Encabezado
  doc.setFontSize(18);
  doc.setTextColor(0, 91, 150);
  doc.text("Clasificación NIIF Colombia", 20, 20);

  // Datos de la empresa
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Empresa: ${datosEmpresa.nombre}`, 20, 35);
  doc.text(`NIT: ${datosEmpresa.nit}`, 20, 42);
  doc.text(`Sector: ${datosEmpresa.sector || "No especificado"}`, 20, 49);
  doc.text(`Año fiscal: ${datosEmpresa.anio} (UVT: $${uvtValor.toLocaleString()})`, 20, 56);
  doc.line(20, 58, 190, 58); // Línea divisoria

  // Resultado
  doc.setFontSize(14);
  doc.setTextColor(0, 91, 150);
  doc.text("Resultado:", 20, 70);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const resultadoHTML = document.getElementById("result-text").innerHTML;
  const resultadoTexto = resultadoHTML.replace(/<[^>]*>/g, ""); // Eliminar etiquetas HTML
  const lines = doc.splitTextToSize(resultadoTexto, 170);
  doc.text(lines, 20, 80);

  // Pie de página
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Fuente: Resolución 057 de 2017 (MinHacienda) | Basado en Siigo.com", 20, 260);
  doc.text("Este documento no sustituye asesoría contable profesional.", 20, 265);

  // Descargar
  doc.save(`NIIF_${datosEmpresa.nombre.replace(/\s/g, "_")}_${datosEmpresa.anio}.pdf`);
}

function resetApp() {
  document.getElementById("result").style.display = "none";
  document.getElementById("step-datos").style.display = "block";
  document.getElementById("profit-form").reset();
  document.getElementById("nonprofit-form").reset();
  document.getElementById("datos-form").reset();
}
