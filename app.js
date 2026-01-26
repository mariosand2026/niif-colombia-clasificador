// ===============================
// CONSTANTES SMMLV
// ===============================
const SMMLV_2025 = 1528000;
const SMMLV_2024 = 1423500;
const SMMLV_2023 = 1300000;

const ACTIVOS_LIMITE_G1 = 30000 * SMMLV_2025;
const ACTIVOS_LIMITE_MICRO = 500 * SMMLV_2025;
const INGRESOS_LIMITE_MICRO = 6000 * SMMLV_2025;
const EMPLEADOS_LIMITE_G1 = 200;
const EMPLEADOS_LIMITE_MICRO = 10;

// ===============================
// VARIABLES GLOBALES
// ===============================
let datosEmpresa = {};
let resultadoPDF = {
  grupoTexto: "",
  norma: "",
  razones: []
};

// ===============================
// PASO 1
// ===============================
function continuarTipoEntidad() {
  const form = document.getElementById("datos-form");

  if (!form.checkValidity()) {
    alert("Completa los campos obligatorios");
    return;
  }

  datosEmpresa = {
    nombre: form.nombre.value,
    sector: form.sector.value,
    anio: form.anio.value
  };

  document.getElementById("step-datos").style.display = "none";
  document.getElementById("step1").style.display = "block";
}

// ===============================
// PASO 2
// ===============================
function startForProfit() {
  document.getElementById("step1").style.display = "none";

  if (confirm("¿Su empresa podría ser microempresa?")) {
    clasificarMicroempresa();
  } else {
    document.getElementById("step-profit").style.display = "block";
  }
}

function startNonProfit() {
  document.getElementById("step1").style.display = "none";
  document.getElementById("step-nonprofit").style.display = "block";
}

// ===============================
// GRUPO 1 / 2
// ===============================
function clasificarGrupo1() {
  const form = document.getElementById("profit-form");

  const respuestas = [
    form.interes_publico.value,
    form.empleados_activos.value,
    form.cotiza_bolsa.value,
    form.rendicion_cuentas.value,
    form.import_export.value,
    form.matriz_extranjera.value
  ];

  if (respuestas.includes("")) {
    alert("Responda todas las preguntas");
    return;
  }

  let grupo = "2";
  let razones = [];

  if (form.interes_publico.value === "si") {
    grupo = "1";
    razones.push("Entidad de interés público o emisor de valores");
  } else if (form.empleados_activos.value === "si") {
    grupo = "1";
    razones.push(`≥ ${EMPLEADOS_LIMITE_G1} empleados o activos ≥ 30.000 SMMLV`);
  } else if (form.cotiza_bolsa.value === "si") {
    grupo = "1";
    razones.push("Cotiza en bolsa");
  } else if (form.rendicion_cuentas.value === "si") {
    grupo = "1";
    razones.push("Obligado a rendición pública de cuentas");
  } else if (form.import_export.value === "si") {
    grupo = "1";
    razones.push(">50% de operaciones internacionales");
  } else if (form.matriz_extranjera.value === "si") {
    grupo = "1";
    razones.push("Matriz/subordinada extranjera NIIF plenas");
  }

  if (grupo === "2") {
    razones.push("No cumple criterios de Grupo 1");
  }

  mostrarResultado(grupo, razones);
}

// ===============================
// MICROEMPRESA
// ===============================
function clasificarMicroempresa() {
  const empleados = parseInt(prompt("Número de trabajadores:"));
  const activos = parseFloat(prompt("Valor total de activos:"));
  const ingresos = parseFloat(prompt("Ingresos brutos anuales:"));

  if (isNaN(empleados) || isNaN(activos) || isNaN(ingresos)) {
    alert("Datos inválidos");
    return;
  }

  const esMicro =
    empleados <= EMPLEADOS_LIMITE_MICRO &&
    activos < ACTIVOS_LIMITE_MICRO &&
    ingresos < INGRESOS_LIMITE_MICRO;

  if (esMicro) {
    mostrarResultado("3", [
      "Cumple requisitos de microempresa",
      `Empleados: ${empleados}`,
      `Activos: $${activos.toLocaleString()}`,
      `Ingresos: $${ingresos.toLocaleString()}`
    ]);
  } else {
    alert("No califica como microempresa");
    document.getElementById("step-profit").style.display = "block";
  }
}

// ===============================
// RESULTADO
// ===============================
function mostrarResultado(grupo, razones) {
  document.getElementById("step-profit").style.display = "none";
  document.getElementById("step-nonprofit").style.display = "none";

  let grupoTexto = "";
  let norma = "";

  if (grupo === "1") {
    grupoTexto = "Grupo 1 – NIIF Completas";
    norma = "NIIF Completas";
  } else if (grupo === "2") {
    grupoTexto = "Grupo 2 – NIIF para PYMES";
    norma = "NIIF para PYMES";
  } else {
    grupoTexto = "Grupo 3 – Microempresas";
    norma = "Contabilidad simplificada";
  }

  resultadoPDF = { grupoTexto, norma, razones };

  document.getElementById("result-text").innerHTML = `
    <h3>${grupoTexto}</h3>
    <p><strong>Norma:</strong> ${norma}</p>
    <ul>${razones.map(r => `<li>${r}</li>`).join("")}</ul>
  `;

  document.getElementById("result").style.display = "block";
}

// ===============================
// PDF (FUNCIONANDO)
// ===============================
function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("MIA – Clasificador NIIF Colombia", 20, 20);

  doc.setFontSize(11);
  doc.text(`Empresa: ${datosEmpresa.nombre}`, 20, 35);
  doc.text(`Sector: ${datosEmpresa.sector || "No especificado"}`, 20, 42);
  doc.text(`Año fiscal: ${datosEmpresa.anio}`, 20, 49);

  doc.line(20, 55, 190, 55);

  doc.setFontSize(13);
  doc.text("Resultado de clasificación", 20, 65);

  doc.setFontSize(11);
  doc.text(resultadoPDF.grupoTexto, 20, 75);
  doc.text(`Norma aplicable: ${resultadoPDF.norma}`, 20, 82);

  let y = 92;
  resultadoPDF.razones.forEach(r => {
    doc.text(`• ${r}`, 25, y);
    y += 8;
  });

  doc.setFontSize(9);
  doc.text("MIA – por Mario Andrés Narváez Delgado", 20, 280);

  doc.save(`MIA_NIIF_${datosEmpresa.nombre.replace(/\s+/g, "_")}.pdf`);
}

// ===============================
function resetApp() {
  location.reload();
}
