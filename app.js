let resultadoTexto = "";

function clasificar() {
  const tipo = document.getElementById("tipoEntidad").value;
  const activos = Number(document.getElementById("activos").value);
  const ingresos = Number(document.getElementById("ingresos").value);
  const resultado = document.getElementById("resultado");

  if (!tipo || !activos || !ingresos) {
    resultado.innerHTML = "⚠️ Completa todos los campos.";
    return;
  }

  let grupo = "";

  if (activos <= 5000 * 49798 && ingresos <= 3000 * 49798) {
    grupo = "Grupo 3 – Contabilidad simplificada";
  } else if (activos <= 30000 * 49798) {
    grupo = "Grupo 2 – NIIF para PYMES";
  } else {
    grupo = "Grupo 1 – NIIF plenas";
  }

  resultadoTexto = `
Tipo de entidad: ${tipo}
Activos: $${activos.toLocaleString()}
Ingresos: $${ingresos.toLocaleString()}
Clasificación: ${grupo}
`;

  resultado.innerHTML = `
✅ <strong>Resultado:</strong><br>
${grupo}
`;

  document.getElementById("btnPDF").style.display = "block";
}

function generarPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.setFontSize(16);
  pdf.text("MIA", 105, 20, { align: "center" });

  pdf.setFontSize(10);
  pdf.text(
    "Métodos de Inteligencia Artificial\nIA aplicada para todos los sectores",
    105,
    28,
    { align: "center" }
  );

  pdf.line(20, 35, 190, 35);

  pdf.setFontSize(12);
  pdf.text("Resultado de Clasificación NIIF", 20, 50);

  pdf.setFontSize(10);
  pdf.text(resultadoTexto, 20, 65);

  pdf.setFontSize(9);
  pdf.text(
    "by Mario Andrés Narváez Delgado",
    105,
    280,
    { align: "center" }
  );

  pdf.save("Clasificacion_NIIF_MIA.pdf");
}
