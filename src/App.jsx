import React, { useState } from "react";

// --- DATOS SIMULADOS (MOCK) ---
const ordenesIniciales = [
  { id: "OT-001", bus: "420", fallasReportadas: ["Foco delantero derecho quemado", "Luz de freno izquierda no enciende", "Espejo trizado"], estado: "Pendiente", fechaSolicitud: "2026-08-27", reparaciones: [], adicionales: "", responsables: [] },
  { id: "OT-002", bus: "315", fallasReportadas: ["Ruido extraño al frenar", "Fuga de aire en puerta delantera"], estado: "Pendiente", fechaSolicitud: "2026-08-27", reparaciones: ["Ruido extraño al frenar"], adicionales: "", responsables: ["Luis"] },
  { id: "OT-003", bus: "102", fallasReportadas: ["Asiento 14 no reclina"], estado: "Pendiente", fechaSolicitud: "2026-08-27", reparaciones: [], adicionales: "", responsables: [] },
  { id: "OT-004", bus: "88", fallasReportadas: ["Neumático trasero derecho desinflado", "Limpia parabrisas no funciona"], estado: "Resuelto", fechaSolicitud: "2026-08-26", reparaciones: ["Neumático trasero derecho desinflado", "Limpia parabrisas no funciona"], adicionales: "", responsables: ["Juan"], fechaResolucion: "2026-08-26 15:30" }
];

const nombresMecanicos = ["Luis Linares", "Juan Ferrada", "Carlos Sanchez", "Ricardo Padilla", "Sebastián Villagran", "Cecil Iturrieta"];

export default function Mecanicos() {
  const [ordenes, setOrdenes] = useState(ordenesIniciales);
  const [filtro, setFiltro] = useState("Pendiente"); 
  const [ordenActiva, setOrdenActiva] = useState(null);

  // Estados para la orden activa
  const [mecanicoInput, setMecanicoInput] = useState("");
  const [mecanicosAsignados, setMecanicosAsignados] = useState([]);
  const [itemsReparados, setItemsReparados] = useState([]); 
  const [trabajoAdicional, setTrabajoAdicional] = useState("");

  // --- FUNCIONES DE LÓGICA ---
  const abrirOrden = (orden) => {
    setOrdenActiva(orden);
    setMecanicoInput("");
    setMecanicosAsignados(orden.responsables || []);
    setItemsReparados(orden.reparaciones || []);
    setTrabajoAdicional(orden.adicionales || "");
  };

  const agregarMecanico = () => {
    const nombre = mecanicoInput.trim();
    if (nombre !== "" && !mecanicosAsignados.includes(nombre)) {
      setMecanicosAsignados([...mecanicosAsignados, nombre]);
    }
    setMecanicoInput(""); 
  };

  const handleKeyDownMecanico = (e) => {
    if (e.key === 'Enter') {
      agregarMecanico();
    }
  };

  const toggleReparacion = (falla) => {
    if (itemsReparados.includes(falla)) {
      setItemsReparados(itemsReparados.filter((item) => item !== falla));
    } else {
      setItemsReparados([...itemsReparados, falla]);
    }
  };

  const guardarOrden = (estadoFinal) => {
    // POKA-YOKE: Atrapamos el nombre que quedó escrito pero al que no le dieron "+ Añadir"
    let responsablesFinales = [...mecanicosAsignados];
    const nombrePendiente = mecanicoInput.trim();
    
    if (nombrePendiente !== "" && !responsablesFinales.includes(nombrePendiente)) {
      responsablesFinales.push(nombrePendiente);
    }

    // Ahora validamos con la lista final
    if (responsablesFinales.length === 0) {
      alert("Por favor, indica qué mecánico está realizando el trabajo.");
      return;
    }
    
    const fechaActual = new Date().toLocaleString("es-CL");

    const ordenesActualizadas = ordenes.map((o) => {
      if (o.id === ordenActiva.id) {
        return {
          ...o,
          estado: estadoFinal,
          responsables: responsablesFinales, // Guardamos la lista consolidada
          reparaciones: itemsReparados,
          adicionales: trabajoAdicional,
          fechaResolucion: estadoFinal === "Resuelto" ? fechaActual : o.fechaResolucion
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
              list="lista-nombres"
              placeholder="Toca para buscar o escribir nombre..." 
              value={mecanicoInput}
              onChange={(e) => setMecanicoInput(e.target.value)}
              onKeyDown={handleKeyDownMecanico}
              style={styles.inputGrande}
            />
            <datalist id="lista-nombres">
              {nombresMecanicos.map((nombre) => (
                <option key={nombre} value={nombre} />
              ))}
            </datalist>
            <button onClick={agregarMecanico} style={styles.btnAgregar}>+ Añadir</button>
          </div>
          
          {mecanicosAsignados.length > 0 && (
            <div style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <strong>Asignados:</strong> 
              {mecanicosAsignados.map((mec, index) => (
                <span key={index} style={styles.etiquetaMecanicoActivo}>👤 {mec}</span>
              ))}
            </div>
          )}
        </div>

        {/* PASO 2: CHECKLIST Y EXTRAS */}
        <div style={styles.section}>
          <h3>2. Reparaciones realizadas</h3>
          <p style={{ color: "#666", marginBottom: "15px" }}>Toca las fallas que ya reparaste:</p>
          
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

          <div style={{ marginTop: "20px", paddingTop: "15px", borderTop: "1px dashed #ccc" }}>
            <strong>➕ Trabajos extras no reportados (Opcional)</strong>
            <textarea 
              placeholder="Ej: Se cambió también un foco trasero que estaba quemado..."
              value={trabajoAdicional}
              onChange={(e) => setTrabajoAdicional(e.target.value)}
              style={styles.textArea}
            />
          </div>
        </div>

        {/* PASO 3: BOTONES DE RESOLUCIÓN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={() => guardarOrden("Pendiente")} style={styles.btnPausar}>
            ⏸️ GUARDAR AVANCE (DEJAR PENDIENTE)
          </button>
          
          <button onClick={() => guardarOrden("Resuelto")} style={styles.btnResolver}>
            ✅ FINALIZAR TRABAJO (RESOLVER ORDEN)
          </button>
        </div>
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
          ordenesFiltradas.map((orden) => {
            const tareasCompletadas = orden.reparaciones?.length || 0;
            const totalTareas = orden.fallasReportadas.length;
            const isPendiente = orden.estado === "Pendiente";
            
            return (
              <div key={orden.id} style={{...styles.tarjetaOrden, borderLeft: isPendiente ? "6px solid #ff9800" : "6px solid #4caf50"}} onClick={() => isPendiente ? abrirOrden(orden) : null}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    ...styles.tagId,
                    backgroundColor: isPendiente ? "#fff3e0" : "#e8f5e9",
                    color: isPendiente ? "#e65100" : "#2e7d32",
                    border: isPendiente ? "1px solid #ffb74d" : "1px solid #81c784"
                  }}>
                    {orden.id}
                  </span>
                  <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Bus: {orden.bus}</span>
                </div>
                
                <div style={{ marginTop: "15px" }}>
                  <strong>🚨 Fallas reportadas ({tareasCompletadas}/{totalTareas} resueltas):</strong>
                  <ul style={{ margin: "10px 0", paddingLeft: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {orden.fallasReportadas.map((f, i) => {
                      const isReparada = orden.reparaciones?.includes(f);
                      return (
                        <li key={i} style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "8px",
                          color: isReparada ? "#2e7d32" : "#555"
                        }}>
                          <span style={{ fontSize: "1.1rem" }}>{isReparada ? "✅" : "🕒"}</span>
                          <span style={{ textDecoration: isReparada ? "line-through" : "none" }}>{f}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {orden.adicionales && (
                   <p style={{ fontSize: "0.95rem", color: "#666", fontStyle: "italic", marginTop: "5px" }}>
                     + Trabajos extras registrados
                   </p>
                )}
                
                {!isPendiente ? (
                  <div style={styles.infoResolucion}>
                    <p><strong>Reparado por:</strong> {orden.responsables.join(", ")}</p>
                    <p><strong>Fecha:</strong> {orden.fechaResolucion}</p>
                  </div>
                ) : (
                  <button style={{
                    ...styles.btnAbrir, 
                    backgroundColor: tareasCompletadas > 0 ? "#ff9800" : "#2196f3"
                  }}>
                    {tareasCompletadas > 0 ? "Continuar Trabajo ➔" : "Abrir para Resolver ➔"}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// --- ESTILOS EN LÍNEA ---
const styles = {
  container: { maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh" },
  contenedorFiltros: { display: "flex", gap: "10px", marginBottom: "20px" },
  btnFiltro: { flex: 1, padding: "15px", fontSize: "1.2rem", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  listaOrdenes: { display: "flex", flexDirection: "column", gap: "15px" },
  tarjetaOrden: { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", cursor: "pointer" },
  tagId: { padding: "6px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "0.9rem" },
  btnAbrir: { width: "100%", padding: "15px", marginTop: "15px", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  btnVolver: { padding: "10px 15px", backgroundColor: "#ccc", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  section: { backgroundColor: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  inputGrande: { flex: 1, padding: "15px", fontSize: "1.1rem", borderRadius: "8px", border: "1px solid #ccc" },
  btnAgregar: { padding: "0 20px", backgroundColor: "#1565c0", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer" },
  etiquetaMecanicoActivo: { backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "8px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "1rem" },
  listaFallas: { display: "flex", flexDirection: "column", gap: "10px" },
  btnChecklist: { display: "flex", alignItems: "center", padding: "15px", borderRadius: "8px", border: "2px solid #ddd", cursor: "pointer", gap: "15px", transition: "all 0.2s ease", width: "100%" },
  textArea: { width: "100%", minHeight: "80px", padding: "15px", marginTop: "10px", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" },
  btnPausar: { width: "100%", padding: "15px", backgroundColor: "#ff9800", color: "white", fontSize: "1.1rem", fontWeight: "bold", border: "none", borderRadius: "10px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" },
  btnResolver: { width: "100%", padding: "20px", backgroundColor: "#4caf50", color: "white", fontSize: "1.3rem", fontWeight: "bold", border: "none", borderRadius: "10px", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.2)" },
  infoResolucion: { marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #eee", fontSize: "0.95rem", color: "#555" }
};