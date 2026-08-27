import React, { useState } from "react";

// --- DATOS SIMULADOS (MOCK) ---
// Ahora las fallas vienen como una lista (array) para generar el checklist dinámico
const ordenesIniciales = [
  { id: "OT-001", bus: "420", fallasReportadas: ["Foco delantero derecho quemado", "Luz de freno izquierda no enciende", "Espejo trizado"], estado: "Pendiente", fechaSolicitud: "2026-08-27" },
  { id: "OT-002", bus: "315", fallasReportadas: ["Ruido extraño al frenar", "Fuga de aire en puerta delantera"], estado: "Pendiente", fechaSolicitud: "2026-08-27" },
  { id: "OT-003", bus: "102", fallasReportadas: ["Asiento 14 no reclina"], estado: "Pendiente", fechaSolicitud: "2026-08-27" },
  { id: "OT-004", bus: "88", fallasReportadas: ["Neumático trasero derecho desinflado", "Limpia parabrisas no funciona"], estado: "Pendiente", fechaSolicitud: "2026-08-28" }
];

export default function Mecanicos() {
  const [ordenes, setOrdenes] = useState(ordenesIniciales);
  const [filtro, setFiltro] = useState("Pendiente"); 
  const [ordenActiva, setOrdenActiva] = useState(null);

  // Estados para la orden activa
  const [mecanicoInput, setMecanicoInput] = useState("");
  const [mecanicosAsignados, setMecanicosAsignados] = useState([]);
  const [itemsReparados, setItemsReparados] = useState([]); // Guarda las fallas que el mecánico marcó como listas
  const [trabajoAdicional, setTrabajoAdicional] = useState("");

  // --- FUNCIONES DE LÓGICA ---

  const abrirOrden = (orden) => {
    setOrdenActiva(orden);
    setMecanicosAsignados([]);
    setItemsReparados([]);
    setTrabajoAdicional("");
    setMecanicoInput("");
  };

  const agregarMecanico = () => {
    if (mecanicoInput.trim() !== "") {
      setMecanicosAsignados([...mecanicosAsignados, mecanicoInput.trim()]);
      setMecanicoInput("");
    }
  };

  const toggleReparacion = (falla) => {
    if (itemsReparados.includes(falla)) {
      setItemsReparados(itemsReparados.filter((item) => item !== falla));
    } else {
      setItemsReparados([...itemsReparados, falla]);
    }
  };

  const resolverOrden = () => {
    if (mecanicosAsignados.length === 0) {
      alert("Por favor, agrega al menos un mecánico antes de resolver.");
      return;
    }
    
    const fechaActual = new Date().toLocaleString("es-CL");

    const ordenesActualizadas = ordenes.map((o) => {
      if (o.id === ordenActiva.id) {
        return {
          ...o,
          estado: "Resuelto",
          responsables: mecanicosAsignados,
          reparaciones: itemsReparados,
          adicionales: trabajoAdicional,
          fechaResolucion: fechaActual
        };
      }
      return o;
    });

    setOrdenes(ordenesActualizadas);
    setOrdenActiva(null); 
  };

  // --- RENDERIZADO CONDICIONAL ---

  if (ordenActiva) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>🛠️ Orden: {ordenActiva.id} | Bus: {ordenActiva.bus}</h2>
          <button style={styles.btnVolver} onClick={() => setOrdenActiva(null)}>⬅ Volver</button>
        </div>

        {/* PASO 1: AGREGAR MECÁNICOS */}
        <div style={styles.section}>
          <h3>1. ¿Quién realiza el trabajo?</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input 
              type="text" 
              placeholder="Nombre del mecánico..." 
              value={mecanicoInput}
              onChange={(e) => setMecanicoInput(e.target.value)}
              style={styles.inputGrande}
            />
            <button onClick={agregarMecanico} style={styles.btnAgregar}>+ Agregar</button>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {mecanicosAsignados.map((mec, index) => (
              <span key={index} style={styles.etiquetaMecanico}>👤 {mec}</span>
            ))}
          </div>
        </div>

        {/* PASO 2: CHECKLIST DINÁMICO (Basado en lo que reportó el chofer) */}
        <div style={styles.section}>
          <h3>2. Fallas reportadas por el conductor (Toca las que reparaste)</h3>
          <div style={styles.listaFallas}>
            {ordenActiva.fallasReportadas.map((falla, index) => {
              const seleccionado = itemsReparados.includes(falla);
              return (
                <button 
                  key={index}
                  onClick={() => toggleReparacion(falla)}
                  style={{
                    ...styles.btnChecklist,
                    backgroundColor: seleccionado ? "#e0f7fa" : "#f5f5f5",
                    borderColor: seleccionado ? "#00838f" : "#ddd",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{seleccionado ? "✅" : "⭕"}</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: seleccionado ? "bold" : "normal", textAlign: "left" }}>
                    {falla}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PASO 3: TRABAJOS ADICIONALES */}
        <div style={styles.section}>
          <h3>3. Trabajos extras no reportados (Opcional)</h3>
          <textarea 
            placeholder="Ej: Se cambió también un foco trasero que estaba quemado..."
            value={trabajoAdicional}
            onChange={(e) => setTrabajoAdicional(e.target.value)}
            style={styles.textArea}
          />
        </div>

        {/* PASO 4: RESOLVER */}
        <button onClick={resolverOrden} style={styles.btnResolver}>
          ✅ MARCAR COMO RESUELTO
        </button>
      </div>
    );
  }

  // VISTA 1: LISTADO DE ORDENES
  const ordenesFiltradas = ordenes.filter(o => o.estado === filtro);

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Taller - Mecánicos</h1>
      
      <div style={styles.contenedorFiltros}>
        <button 
          onClick={() => setFiltro("Pendiente")}
          style={{...styles.btnFiltro, backgroundColor: filtro === "Pendiente" ? "#ff9800" : "#e0e0e0", color: filtro === "Pendiente" ? "white" : "black"}}
        >
          Pendientes 🕒
        </button>
        <button 
          onClick={() => setFiltro("Resuelto")}
          style={{...styles.btnFiltro, backgroundColor: filtro === "Resuelto" ? "#4caf50" : "#e0e0e0", color: filtro === "Resuelto" ? "white" : "black"}}
        >
          Resueltas ✅
        </button>
      </div>

      <div style={styles.listaOrdenes}>
        {ordenesFiltradas.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#666" }}>No hay órdenes en este estado.</p>
        ) : (
          ordenesFiltradas.map((orden) => (
            <div key={orden.id} style={styles.tarjetaOrden} onClick={() => filtro === "Pendiente" ? abrirOrden(orden) : null}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={styles.tagId}>{orden.id}</span>
                <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Bus: {orden.bus}</span>
              </div>
              
              {/* Mostrar resumen de fallas en la tarjeta */}
              <div style={{ marginTop: "10px" }}>
                <strong>🚨 Fallas reportadas:</strong>
                <ul style={{ margin: "5px 0", paddingLeft: "20px", color: "#444" }}>
                  {orden.fallasReportadas.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              
              {filtro === "Resuelto" && (
                <div style={styles.infoResolucion}>
                  <p><strong>Reparado por:</strong> {orden.responsables.join(", ")}</p>
                  <p><strong>Fecha:</strong> {orden.fechaResolucion}</p>
                </div>
              )}

              {filtro === "Pendiente" && (
                <button style={styles.btnAbrir}>Abrir para Resolver ➔</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- ESTILOS EN LÍNEA ---
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh"
  },
  contenedorFiltros: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  btnFiltro: {
    flex: 1,
    padding: "15px",
    fontSize: "1.2rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  listaOrdenes: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  tarjetaOrden: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    cursor: "pointer",
    borderLeft: "6px solid #ff9800"
  },
  tagId: {
    backgroundColor: "#eee",
    padding: "5px 10px",
    borderRadius: "5px",
    fontWeight: "bold",
    color: "#555"
  },
  btnAbrir: {
    width: "100%",
    padding: "15px",
    marginTop: "15px",
    backgroundColor: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  btnVolver: {
    padding: "10px 15px",
    backgroundColor: "#ccc",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  section: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
  },
  inputGrande: {
    flex: 1,
    padding: "15px",
    fontSize: "1.1rem",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  btnAgregar: {
    padding: "0 20px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    cursor: "pointer"
  },
  etiquetaMecanico: {
    backgroundColor: "#e3f2fd",
    color: "#1565c0",
    padding: "8px 12px",
    borderRadius: "20px",
    fontWeight: "bold"
  },
  listaFallas: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  btnChecklist: {
    display: "flex",
    alignItems: "center",
    padding: "15px",
    borderRadius: "8px",
    border: "2px solid #ddd",
    cursor: "pointer",
    gap: "15px",
    transition: "all 0.2s ease",
    width: "100%"
  },
  textArea: {
    width: "100%",
    minHeight: "100px",
    padding: "15px",
    fontSize: "1.1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
  },
  btnResolver: {
    width: "100%",
    padding: "20px",
    backgroundColor: "#4caf50",
    color: "white",
    fontSize: "1.3rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)"
  },
  infoResolucion: {
    marginTop: "15px",
    paddingTop: "15px",
    borderTop: "1px solid #eee",
    fontSize: "0.95rem",
    color: "#555"
  }
};