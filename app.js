// Variables globales para los datos de la empresa
let datosEmpresa = {};

// Función para guardar los datos y continuar
function continuarTipoEntidad() {
  const form = document.getElementById("datos-form");
  datosEmpresa = {
    nombre: form.nombre.value,
    nit: form.nit.value,
    sector: form.sector.value,
    anio: form.anio.value
  };

  // Ocultar este paso y mostrar el tipo de entidad
  document.getElementById("step-datos").style.display = "none";
  document.getElementById("step1").style.display = "block";
}

// Actualizar la función `descargarPDF` (incluir datos de la empresa)
function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Encabezado con datos de la empresa
  doc.setFontSize(16);
  doc.setTextColor(0, 91, 150);
  doc.text("Clasificación NIIF Colombia", 20, 20);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Empresa: ${datosEmpresa.nombre}`, 20, 35);
  doc.text(`NIT: ${datosEmpresa.nit}`, 20, 42);
  doc.text(`Sector: ${datosEmpresa.sector || "No especificado"}`, 20, 49);
  doc.text(`Año fiscal: ${datosEmpresa.anio}`, 20, 56);
  doc.line(20, 58, 190, 58); // Línea divisoria

  // Resultado de clasificación
  doc.setFontSize(12);
  doc.setTextColor(0, 91, 150);
  doc.text("Resultado de clasificación:", 20, 70);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const resultadoTexto = document.getElementById("result-text").innerText;
  const lines = doc.splitTextToSize(resultadoTexto, 170);
  doc.text(lines, 20, 80);

  // Pie de página
  doc.setFontSize(8);
  doc.text("Fuente: Resolución 057 de 2017 (Ministerio de Hacienda) | Basado en Siigo.com", 20, 250);

  doc.save(`clasificacion_niif_${datosEmpresa.nombre.replace(/\s/g, "_")}.pdf`);
}
