// Constantes SMMLV (2025: $1.528.000)
const SMMLV_2025 = 1528000;
const SMMLV_2024 = 1423500;
const SMMLV_2023 = 1300000;
const ACTIVOS_LIMITE_G1 = 30000 * SMMLV_2025; // $45.840.000.000
const ACTIVOS_LIMITE_MICRO = 500 * SMMLV_2025; // $764.000.000
const INGRESOS_LIMITE_MICRO = 6000 * SMMLV_2025; // $9.168.000.000
const EMPLEADOS_LIMITE_G1 = 200;
const EMPLEADOS_LIMITE_MICRO = 10;

let datosEmpresa = {};

// === PASO 1: Datos de la empresa ===
function continuarTipoEntidad() {
  const form = document.getElementById("datos-form");
  datosEmpresa = {
    nombre: form.nombre.value,
    nit: form.nit.value,
    sector: form.sector.value,
    anio: form.anio.value
  };

  if (!/^[0-9]{9,15}-[0-9]{1}$/.test(datosEmpresa.nit)) {
    alert("⚠️ Formato de NIT inválido. Ej: 123456789-0 (pero puede continuar)");
  }

  document.getElementById("step-datos").style.display = "none";
  document.getElementById("step1").style.display = "block";
}

// === PASO 2: Flujo principal ===
function startForProfit() {
  document.getElementById("step1").style.display = "none";
  if (confirm("¿Su empresa podría ser microempresa? (≤10 trabajadores, activos < $764M, ingresos < $9,168M)")) {
    clasificarMicroempresa();
  } else {
    document.getElementById("step-profit").style.display = "block";
  }
}

function startNonProfit() {
  document.getElementById("step1").style.display = "none";
  document.getElementById("step-nonprofit").style.display = "block";
}

// === PASO 3: Clasificación Grupo 1 (Decreto 2420/2015) ===
function clasificarGrupo1() {
  const form = document.getElementById("profit-form");
  const interes_publico = form.interes_publico.value;
  const empleados_activos = form.empleados_activos.value;
  const cotiza_bolsa = form.cotiza_bolsa.value;
  const rendicion_cuentas = form.rendicion_cuentas.value;
  const import_export = form.import_export.value;
  const matriz_extranjera = form.matriz_extranjera.value;

  if (!interes_publico || !empleados_activos || !cotiza_bolsa || !rendicion_cuentas || !import_export || !matriz_extranjera) {
    alert("Por favor responda todas las preguntas.");
    return;
  }

  let grupo = "2";
  let razones = [];

  // OR lógico para Grupo 1
  if (interes_publico === "si") {
    grupo = "1";
    razones.push("Entidad de interés público o emisor de valores");
  } else if (empleados_activos === "si") {
    grupo = "1";
    razones.push(`≥${EMPLEADOS_LIMITE_G1} empleados o activos ≥${(ACTIVOS_LIMITE_G1/1e9).toFixed(1)} billones (30.000 SMMLV)`);
  } else if (cotiza_bolsa === "si") {
    grupo = "1";
    razones.push("Cotiza en bolsa");
  } else if (rendicion_cuentas === "si") {
    grupo = "1";
    razones.push("Obligado a rendición pública de cuentas");
  } else if (import_export === "si") {
    grupo = "1";
    razones.push(">50% de operaciones en importaciones/exportaciones");
  } else if (matriz_extranjera === "si") {
    grupo = "1";
    razones.push("Matriz/subordinada de empresa extranjera con NIIF plenas");
  }

  if (grupo === "2") {
    razones.push("No cumple ninguna condición para el Grupo 1");
  }

  mostrarResultado(grupo, razones, "empresa");
}

// === PASO 3: Clasificación Grupo 3 (Microempresas) ===
function clasificarMicroempresa() {
  const empleados = prompt("Número de trabajadores (excluyendo consultores):");
  const activos = prompt("Valor total de activos (excluida vivienda):");
  const ingresos = prompt("Ingresos brutos anuales:");

  if (!empleados || !activos || !ingresos) {
    alert("Debe completar todos los datos.");
    return;
  }

  // AND lógico para microempresas
  const esMicro = 
    parseInt(empleados) <= EMPLEADOS_LIMITE_MICRO &&
    parseFloat(activos) < ACTIVOS_LIMITE_MICRO &&
    parseFloat(ingresos) < INGRESOS_LIMITE_MICRO;

  if (esMicro) {
    mostrarResultado("3", [
      `<span class="microempresa-badge">MICROEMPRESA</span>`,
      `✔️ Trabajadores: ${empleados} (límite: ${EMPLEADOS_LIMITE_MICRO})`,
      `✔️ Activos: $${parseFloat(activos).toLocaleString()} (límite: $${ACTIVOS_LIMITE_MICRO.toLocaleString()})`,
      `✔️ Ingresos: $${parseFloat(ingresos).toLocaleString()} (límite: $${INGRESOS_LIMITE_MICRO.toLocaleString()})`,
      "Cumple todos los requisitos (Decreto 2420/2015)"
    ], "empresa");
  } else {
    alert("No califica como microempresa. Será clasificada en Grupo 1 o 2.");
    document.getElementById("step-profit").style.display = "block";
  }
}

// === PASO 3: Clasificación Grupo 3 (EFIL) ===
function clasificarGrupo3() {
  const form = document.getElementById("nonprofit-form");
  const interes_publico = form.interes_publico_efil.value;
  const tamano = form.tamano_efil.value;

  if (!interes_publico || !tamano) {
    alert("Por favor responda todas las preguntas.");
    return;
  }

  let grupo = "3";
  let razones = [];

  if (interes_publico === "si") {
    grupo = "1";
    razones.push("Entidad de interés público");
  } else if (tamano === "si") {
    grupo = "1";
    razones.push("Supera umbrales de tamaño (200+ empleados, activos ≥30.000 SMMLV, cotiza en bolsa)");
  } else {
    razones.push("Entidad sin fines de lucro que no pertenece al Grupo 1");
  }

  mostrarResultado(grupo, razones, "efil");
}

// === PASO 4: Mostrar resultado y PDF ===
function mostrarResultado(grupo, razones, tipo) {
  document.getElementById("step-profit").style.display = "none";
  document.getElementById("step-nonprofit").style.display = "none";
  const resultDiv = document.getElementById("result");
  const resultText = document.getElementById("result-text");

  let grupoTexto = "";
  let norma = "";

  if (grupo === "1") {
    grupoTexto = "Grupo 1 (NIIF Completas)";
    norma = "NIIF Completas";
  } else if (grupo === "2") {
    grupoTexto = "Grupo 2 (NIIF para PYMES)";
    norma = "NIIF para PYMES";
  } else if (grupo === "3") {
    grupoTexto = "Grupo 3 (Contabilidad Simplificada)";
    norma = "NIIF para Microempresas";
  }

  resultText.innerHTML = `
    <h3>🏢 ${grupoTexto}</h3>
    <p><strong>Norma aplicable:</strong> ${norma}</p>
    <p><strong>Requisitos cumplidos:</strong></p>
    <ul>${razones.map(r => `<li>${r}</li>`).join('')}</ul>
    <p>📄 <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.aspx?i=115761" target="_blank">Decreto 2420/2015</a> | 
       <a href="https://www.siigo.com/blog/contador/cuales-son-los-grupos-en-niif/" target="_blank">Guía Siigo</a></p>
  `;

  resultDiv.style.display = "block";
}

function descargarPDF() {
  // En la función descargarPDF(), añadir al inicio:
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("App elaborada por: MG ESP CP Mario Andrés Narváez Delgado", 20, 275);
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Configuración SMMLV
  let smmlvValor, smmlvTexto;
  if (datosEmpresa.anio == "2026") {
    smmlvValor = SMMLV_2025;
    smmlvTexto = "1.528.000 (2025)";
  } else if (datosEmpresa.anio == "2025") {
    smmlvValor = SMMLV_2024;
    smmlvTexto = "1.423.500 (2024)";
  } else {
    smmlvValor = SMMLV_2023;
    smmlvTexto = "1.300.000 (2023)";
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
  doc.text(`Año fiscal: ${datosEmpresa.anio} (SMMLV: $${smmlvValor.toLocaleString()})`, 20, 56);
  doc.line(20, 58, 190, 58);

  // Resultado
  // Reemplazar el bloque de resultado con:
  doc.setFontSize(14);
  doc.setTextColor(0, 91, 150);
  doc.text("Apreciados amigos,", 20, 80);
  doc.text(`usted pertenece al ${grupoTexto} por las siguientes características:`, 20, 90);

  // Lista de características (con mejor formato)
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const razonesTexto = document.getElementById("result-text").innerText;
  const razonesLines = doc.splitTextToSize(razonesTexto.replace(/✓/g, ""), 170);
  doc.text(razonesLines, 20, 100);

  // Pie de página
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Basado en el Decreto 2420/2015. No sustituye asesoría contable profesional.", 20, 260);

  doc.save(`NIIF_${datosEmpresa.nombre.replace(/\s/g, "_")}.pdf`);
}

function resetApp() {
  document.getElementById("result").style.display = "none";
  document.getElementById("step-datos").style.display = "block";
  document.getElementById("profit-form").reset();
  document.getElementById("nonprofit-form").reset();
  document.getElementById("datos-form").reset();
}
