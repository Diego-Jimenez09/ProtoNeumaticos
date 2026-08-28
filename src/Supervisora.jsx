import React, { useState, useMemo, useEffect } from "react";

// --- LISTAS MAESTRAS ---
const busesList = [
  "354","356","376","377","378","379","383","386","387","388","389",
  "390","391","392","393","394","395","396","397","398","399","400",
  "401","402","403","404","405","406","407","408","409","410","411",
  "412","413","414","415","416","417","418","419","420","421","422",
  "423","424","425","426","427","428"
];

const mecanicosList = ["Luis Linares", "Juan Ferrada", "Carlos Sanchez", "Ricardo Padilla", "Sebastián Villagran", "Cecil Iturrieta"];
const choferesList = ["Roberto Gomez", "Andres Tapia", "Carlos Muñoz", "Pedro Perez", "Manuel Rojas", "Reinaldo", "Alejandro", "Pilin"];
const fallasComunes = ["Foco quemado", "Ruido al frenar", "Asiento no reclina", "Fuga de aire", "Luz trocha no funciona", "Falla de motor", "Espejo trizado"];
const motivosPinchazo = ["Pinchazo", "Reventó", "Se desinfló", "Otro motivo"];

// --- NOMBRES DE MESES PARA EL FILTRO ---
const nombresMeses = {
  "01": "Enero", "02": "Febrero", "03": "Marzo", "04": "Abril", "05": "Mayo", "06": "Junio",
  "07": "Julio", "08": "Agosto", "09": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre"
};

// --- GENERADOR DE DATOS SIMULADOS ---
const generarDatosMock = (tipo) => {
  const datos = [];
  const totalCasos = 120;
  const inicio = new Date(2026, 5, 1); 
  const fin = new Date(2026, 7, 31); 

  for (let i = 1; i <= totalCasos; i++) {
    const randomTime = inicio.getTime() + Math.random() * (fin.getTime() - inicio.getTime());
    const fechaRandom = new Date(randomTime);
    const mes = String(fechaRandom.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaRandom.getDate()).padStart(2, '0');
    
    const isPendiente = Math.random() > 0.6;
    const busRandom = busesList[Math.floor(Math.random() * busesList.length)];
    const choferRandom = choferesList[Math.floor(Math.random() * choferesList.length)];

    if (tipo === "TALLER") {
      const numFallas = Math.floor(Math.random() * 3) + 1;
      const fallas = [];
      for(let j=0; j<numFallas; j++) fallas.push(fallasComunes[Math.floor(Math.random() * fallasComunes.length)]);
      
      let mecanicos = [];
      if (!isPendiente) {
        const numMecanicos = Math.random() > 0.7 ? 2 : 1; 
        for(let m=0; m<numMecanicos; m++) {
          const randomMec = mecanicosList[Math.floor(Math.random() * mecanicosList.length)];
          if(!mecanicos.includes(randomMec)) mecanicos.push(randomMec);
        }
      }
      
      let reparaciones = [];
      if (!isPendiente) {
        reparaciones = Math.random() > 0.3 ? [...fallas] : [fallas[0]]; 
      } else {
        reparaciones = (numFallas > 1 && Math.random() > 0.7) ? [fallas[0]] : []; 
      }
      
      const detallesAdicionales = !isPendiente && Math.random() > 0.7 ? "Se ajustó además un cableado suelto en el motor." : "";
      
      datos.push({
        id: `OT-${String(i).padStart(3, '0')}`,
        bus: busRandom,
        fechaOriginal: fechaRandom,
        fecha: `2026-${mes}-${dia}`,
        mesFiltro: `2026-${mes}`,
        hora: `${String(fechaRandom.getHours()).padStart(2,'0')}:${String(fechaRandom.getMinutes()).padStart(2,'0')}`,
        chofer: choferRandom,
        fallas: fallas,
        reparaciones: reparaciones,
        estado: isPendiente ? "Pendiente" : "Resuelto",
        mecanicos: mecanicos,
        detallesAdicionales: detallesAdicionales
      });
    } else {
      datos.push({
        id: `P-${String(i).padStart(3, '0')}`,
        bus: busRandom,
        fechaOriginal: fechaRandom,
        fecha: `2026-${mes}-${dia}`,
        mesFiltro: `2026-${mes}`,
        hora: `${String(fechaRandom.getHours()).padStart(2,'0')}:${String(fechaRandom.getMinutes()).padStart(2,'0')}`,
        chofer: choferRandom,
        neumaticos: [String(Math.floor(Math.random() * 8) + 1)],
        motivo: motivosPinchazo[Math.floor(Math.random() * motivosPinchazo.length)],
        monto: Math.floor(Math.random() * 50000) + 10000,
        estado: isPendiente ? "Pendiente" : "Aprobado",
        foto: "📄 [Boleta_Adjunta.jpg]"
      });
    }
  }
  return datos.sort((a, b) => b.fechaOriginal - a.fechaOriginal);
};

export default function GestoraPanel() {
  const [vistaActiva, setVistaActiva] = useState("TALLER"); 
  const [solicitudesTaller, setSolicitudesTaller] = useState([]);
  const [reportesPinchazos, setReportesPinchazos] = useState([]);

  useEffect(() => {
    setSolicitudesTaller(generarDatosMock("TALLER"));
    setReportesPinchazos(generarDatosMock("CARRETERA"));
  }, []);

  const [casoActivo, setCasoActivo] = useState(null);

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroDia, setFiltroDia] = useState("");
  const [filtroBus, setFiltroBus] = useState(""); // Cambiado a Máquina/Bus

  const limpiarFiltros = () => {
    setFiltroEstado("Todos");
    setFiltroMes("");
    setFiltroDia("");
    setFiltroBus("");
  };

  const baseData = vistaActiva === "TALLER" ? solicitudesTaller : reportesPinchazos;

  const mesesDisponibles = [...new Set(baseData.map(item => item.mesFiltro))].sort().reverse();
  const diasDisponibles = filtroMes 
    ? [...new Set(baseData.filter(item => item.mesFiltro === filtroMes).map(item => item.fecha))].sort().reverse() 
    : [];

  const getFilteredData = (data) => {
    return data.filter(item => {
      const matchEstado = filtroEstado === "Todos" || item.estado === filtroEstado;
      const matchMes = filtroMes === "" || item.mesFiltro === filtroMes;
      const matchDia = filtroDia === "" || item.fecha === filtroDia;
      const matchBus = filtroBus === "" || item.bus === filtroBus;
      return matchEstado && matchMes && matchDia && matchBus;
    });
  };

  const currentData = getFilteredData(baseData);

  const kpiData = useMemo(() => {
    return {
      total: baseData.length,
      pendientes: baseData.filter(x => x.estado === "Pendiente").length,
      resueltas: baseData.filter(x => x.estado !== "Pendiente").length
    };
  }, [baseData]);

  const rectificarTaller = (id) => {
    setSolicitudesTaller(prev => prev.map(s => s.id === id ? { ...s, estado: "Pendiente" } : s));
    setCasoActivo(null);
  };

  const aprobarPinchazo = (id) => {
    setReportesPinchazos(prev => prev.map(p => p.id === id ? { ...p, estado: "Aprobado" } : p));
    setCasoActivo(null);
  };

  // --- COMPONENTE DE INSIGNIA (BADGE) ---
  const StatusBadge = ({ estado, resueltas, totales }) => {
    const isPendiente = estado === "Pendiente";
    const texto = isPendiente ? `PENDIENTE (${resueltas}/${totales})` : `RESUELTO (${resueltas}/${totales})`;
    
    return (
      <span style={{
        padding: "6px 14px", 
        borderRadius: "20px", 
        fontSize: "0.85rem", 
        fontWeight: "800", 
        display: "inline-block",
        whiteSpace: "nowrap",
        backgroundColor: isPendiente ? "#fff8e1" : "#e0f2f1", 
        color: isPendiente ? "#8d6e63" : "#00695c",
        border: `2px solid ${isPendiente ? "#ffca28" : "#26a69a"}`
      }}>
        {texto}
      </span>
    );
  };

  // --- RENDERIZADO DEL DETALLE ---
  if (casoActivo) {
    const isTaller = vistaActiva === "TALLER";
    const tareasCompletadas = isTaller ? (casoActivo.reparaciones?.length || 0) : 0;
    const totalTareas = isTaller ? casoActivo.fallas.length : 1;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Revisión de Caso: {isTaller ? casoActivo.id : `Bus ${casoActivo.bus} - Carretera`}</h2>
          <button style={styles.btnSecundario} onClick={() => setCasoActivo(null)}>⬅ Volver al Listado</button>
        </div>

        <div style={styles.cardFormulario}>
          <div style={styles.grid2Col}>
            <div>
              <p style={styles.labelDetalle}>Fecha y Hora</p>
              <p style={styles.valorDetalle}>📅 {casoActivo.fecha} | 🕒 {casoActivo.hora}</p>
            </div>
            <div>
              <p style={styles.labelDetalle}>Conductor</p>
              <p style={styles.valorDetalle}>👤 {casoActivo.chofer}</p>
            </div>
            <div>
              <p style={styles.labelDetalle}>N° de Máquina</p>
              <p style={styles.valorDetalle}>🚌 Bus {casoActivo.bus}</p>
            </div>
            <div>
              <p style={styles.labelDetalle}>Estado General</p>
              <StatusBadge estado={casoActivo.estado} resueltas={isTaller ? tareasCompletadas : (casoActivo.estado === "Aprobado" ? 1 : 0)} totales={totalTareas} />
            </div>
          </div>

          <hr style={styles.divisor}/>

          {isTaller ? (
            <>
              <p style={styles.labelDetalle}>Fallas Reportadas por Conductor</p>
              <ul style={{ paddingLeft: "0", listStyle: "none", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {casoActivo.fallas.map((f, i) => {
                  const isReparada = casoActivo.reparaciones && casoActivo.reparaciones.includes(f);
                  return (
                    <li key={i} style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "10px", color: isReparada ? "#166534" : "#4b5563" }}>
                      <span>{isReparada ? "✅" : "🕒"}</span>
                      <span style={{ textDecoration: isReparada ? "line-through" : "none", fontWeight: isReparada ? "bold" : "normal" }}>{f}</span>
                    </li>
                  );
                })}
              </ul>

              {casoActivo.detallesAdicionales && (
                <div style={styles.cajaExtra}>
                  <p style={styles.labelDetalle}>👤 Reparaciones Adicionales</p>
                  <p style={{ fontSize: "1.1rem", margin: "10px 0 0 0", color: "#111827" }}>
                    {casoActivo.detallesAdicionales}
                  </p>
                </div>
              )}
              
              <p style={styles.labelDetalle}>Atendido por</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
                {casoActivo.mecanicos.length > 0 ? (
                  casoActivo.mecanicos.map((mec, index) => (
                    <span key={index} style={styles.badgeMecanico}>👤 {mec}</span>
                  ))
                ) : (
                  <span style={{ color: "#6b7280", fontStyle: "italic", fontSize: "1.1rem" }}>Ningún mecánico asignado todavía</span>
                )}
              </div>
              
              {casoActivo.estado === "Resuelto" && (
                <button style={styles.btnPeligro} onClick={() => rectificarTaller(casoActivo.id)}>
                  ⚠️ Rectificar Trabajo (Devolver a Pendiente)
                </button>
              )}
            </>
          ) : (
            <>
              <div style={styles.grid2Col}>
                <div>
                  <p style={styles.labelDetalle}>Rueda(s) Afectada(s)</p>
                  <p style={styles.valorDetalle}>Posición: {casoActivo.neumaticos.join(", ")}</p>
                </div>
                <div>
                  <p style={styles.labelDetalle}>Motivo</p>
                  <p style={styles.valorDetalle}>{casoActivo.motivo}</p>
                </div>
                <div>
                  <p style={styles.labelDetalle}>Monto Declarado</p>
                  <p style={styles.valorDetalle}>${casoActivo.monto.toLocaleString('es-CL')}</p>
                </div>
              </div>
              
              <div style={styles.cajaEvidencia}>
                <p>📷 <strong>Evidencia:</strong> {casoActivo.foto}</p>
              </div>

              {casoActivo.estado === "Pendiente" ? (
                <button style={styles.btnPrimarioDetalle} onClick={() => aprobarPinchazo(casoActivo.id)}>
                  ✅ Aprobar Gasto y Registrar
                </button>
              ) : (
                <p style={{ color: "#166534", fontWeight: "bold", padding: "10px", backgroundColor: "#dcfce7", borderRadius: "8px", textAlign: "center" }}>
                  ✓ Registro revisado y aprobado.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // --- RENDERIZADO DEL PANEL PRINCIPAL (LISTADO) ---
  return (
    <div style={styles.container}>
      
      <div style={styles.navTabs}>
        <button 
          style={{...styles.navTab, ...(vistaActiva === "TALLER" ? styles.navTabActiva : {})}}
          onClick={() => { setVistaActiva("TALLER"); limpiarFiltros(); }}
        >
          📋 Solicitudes de Choferes (Taller)
        </button>
        <button 
          style={{...styles.navTab, ...(vistaActiva === "CARRETERA" ? styles.navTabActiva : {})}}
          onClick={() => { setVistaActiva("CARRETERA"); limpiarFiltros(); }}
        >
          🛞 Pinchazos en Carretera
        </button>
      </div>

      <div style={styles.header}>
        <div>
          <h2 style={{ margin: "0 0 5px 0", color: "#111827" }}>
            {vistaActiva === "TALLER" ? "Solicitudes del Formulario Público" : "Reportes de Ruta"}
          </h2>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.95rem" }}>
            Gestión de fallas y repuestos reportados por conductores
          </p>
        </div>
      </div>

      <div style={styles.kpiRow}>
        <div style={styles.kpiCard}>
          <p style={styles.kpiLabel}>TOTAL RECIBIDAS</p>
          <div style={styles.kpiValueRow}>
            <span style={styles.kpiNumber}>{kpiData.total}</span>
            <span style={{ fontSize: "1.5rem" }}>📋</span>
          </div>
        </div>
        <div style={{...styles.kpiCard, border: "1px solid #fde68a", backgroundColor: "#fffbeb"}}>
          <p style={styles.kpiLabel}>PENDIENTES</p>
          <div style={styles.kpiValueRow}>
            <span style={{...styles.kpiNumber, color: "#d97706"}}>{kpiData.pendientes}</span>
            <span style={{ fontSize: "1.5rem" }}>🕒</span>
          </div>
        </div>
        <div style={{...styles.kpiCard, border: "1px solid #bbf7d0", backgroundColor: "#f0fdf4"}}>
          <p style={styles.kpiLabel}>{vistaActiva === "TALLER" ? "RESUELTAS" : "APROBADAS"}</p>
          <div style={styles.kpiValueRow}>
            <span style={{...styles.kpiNumber, color: "#166534"}}>{kpiData.resueltas}</span>
            <span style={{ fontSize: "1.5rem" }}>✅</span>
          </div>
        </div>
      </div>

      <div style={styles.filterRow}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button style={{...styles.pillBtn, ...(filtroEstado === "Todos" ? styles.pillActivo : {})}} onClick={() => setFiltroEstado("Todos")}>Todas</button>
          <button style={{...styles.pillBtn, ...(filtroEstado === "Pendiente" ? styles.pillActivo : {})}} onClick={() => setFiltroEstado("Pendiente")}>Pendientes</button>
          <button style={{...styles.pillBtn, ...(filtroEstado === (vistaActiva === "TALLER" ? "Resuelto" : "Aprobado") ? styles.pillActivo : {})}} onClick={() => setFiltroEstado(vistaActiva === "TALLER" ? "Resuelto" : "Aprobado")}>
            {vistaActiva === "TALLER" ? "Resueltas" : "Aprobadas"}
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          
          <select 
            style={styles.selectDropdown} 
            value={filtroBus} 
            onChange={(e) => setFiltroBus(e.target.value)}
          >
            <option value="">🚌 Filtrar por Máquina...</option>
            {busesList.map(bus => (
              <option key={bus} value={bus}>Bus {bus}</option>
            ))}
          </select>

          <select 
            style={styles.selectDropdown} 
            value={filtroMes} 
            onChange={(e) => { setFiltroMes(e.target.value); setFiltroDia(""); }}
          >
            <option value="">📆 Filtrar por Mes...</option>
            {mesesDisponibles.map(mesStr => {
              const [year, month] = mesStr.split("-");
              return <option key={mesStr} value={mesStr}>{`${nombresMeses[month]} ${year}`}</option>
            })}
          </select>
          
          {filtroMes && (
            <select 
              style={styles.selectDropdown} 
              value={filtroDia} 
              onChange={(e) => setFiltroDia(e.target.value)}
            >
              <option value="">📅 Todos los días...</option>
              {diasDisponibles.map(diaStr => {
                const day = diaStr.split("-")[2];
                return <option key={diaStr} value={diaStr}>Día {day}</option>
              })}
            </select>
          )}
          
          <button style={styles.btnLimpiar} onClick={limpiarFiltros}>🔄 Limpiar Filtros</button>
        </div>
      </div>

      <div style={styles.listContainer}>
        {/* CABECERA AJUSTADA PARA DAR MÁS ESPACIO A ESTADO Y ACCIÓN */}
        <div style={styles.tableHeader}>
          <div style={{ flex: 1, minWidth: "100px" }}>{vistaActiva === "TALLER" ? "OT / BUS" : "FOLIO / BUS"}</div>
          <div style={{ flex: 2, minWidth: "150px" }}>CONDUCTOR & FECHA</div>
          <div style={{ flex: 3, minWidth: "180px" }}>{vistaActiva === "TALLER" ? "DESCRIPCIÓN DE FALLAS" : "DETALLE PINCHAZO"}</div>
          <div style={{ flex: 1.5, minWidth: "170px", textAlign: "center", paddingRight: "10px" }}>ESTADO GENERAL</div>
          <div style={{ flex: 1, minWidth: "130px", textAlign: "right" }}>ACCIÓN</div>
        </div>

        {currentData.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>No se encontraron registros para los filtros seleccionados.</p>
        ) : (
          currentData.map((item) => {
            const isTaller = vistaActiva === "TALLER";
            const tareasCompletadas = isTaller ? (item.reparaciones?.length || 0) : 0;
            const totalTareas = isTaller ? item.fallas.length : 1;
            
            return (
              <div key={item.id} style={styles.tableRow}>
                
                <div style={{ flex: 1, minWidth: "100px", marginBottom: "10px" }}>
                  <span style={styles.textoFolio}>#{item.id.replace("OT-", "").replace("P-", "")}</span>
                  <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Bus {item.bus}</div>
                </div>

                <div style={{ flex: 2, minWidth: "150px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>👤</span> <span style={{ fontWeight: "500" }}>{item.chofer}</span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "4px" }}>
                    📅 {item.fecha} | {item.hora}
                  </div>
                </div>

                <div style={{ flex: 3, minWidth: "180px", marginBottom: "10px" }}>
                  {isTaller ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {item.fallas.map((f, i) => {
                        const isReparada = item.reparaciones && item.reparaciones.includes(f);
                        return (
                           <span key={i} style={{...styles.tagFalla, color: isReparada ? "#166534" : "#1e40af", backgroundColor: isReparada ? "#dcfce7" : "#dbeafe", borderColor: isReparada ? "#bbf7d0" : "#bfdbfe" }}>
                             {isReparada ? "✅" : "🕒"} {f}
                           </span>
                        );
                      })}
                      {item.detallesAdicionales && (
                        <span style={{...styles.tagFalla, backgroundColor: "#f3f4f6", borderColor: "#d1d5db", color: "#4b5563"}}>
                          👤 Extra Taller
                        </span>
                      )}
                    </div>
                  ) : (
                    <div>
                      <span style={styles.tagFalla}>Rueda {item.neumaticos.join(", ")}</span>
                      <span style={{ fontSize: "0.9rem", color: "#4b5563", marginLeft: "10px" }}>{item.motivo} - ${item.monto.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* COLUMNA DE ESTADO CON MÁS ESPACIO Y PADDING */}
                <div style={{ flex: 1.5, minWidth: "170px", textAlign: "center", marginBottom: "10px", paddingRight: "15px" }}>
                  <StatusBadge estado={item.estado} resueltas={isTaller ? tareasCompletadas : (item.estado === "Aprobado" ? 1 : 0)} totales={totalTareas} />
                </div>

                {/* COLUMNA DEL BOTÓN FORZADA HACIA LA DERECHA */}
                <div style={{ flex: 1, minWidth: "130px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  <button style={styles.btnPrimario} onClick={() => setCasoActivo(item)}>
                    Revisar
                  </button>
                </div>
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
  container: { maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "'Inter', sans-serif, system-ui", backgroundColor: "#f3f4f6", minHeight: "100vh" },
  
  navTabs: { display: "flex", gap: "10px", marginBottom: "25px", borderBottom: "1px solid #e5e7eb", paddingBottom: "10px", flexWrap: "wrap" },
  navTab: { padding: "12px 20px", fontSize: "1.05rem", backgroundColor: "transparent", color: "#6b7280", border: "1px solid #d1d5db", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" },
  navTabActiva: { backgroundColor: "#2563eb", color: "white", border: "1px solid #2563eb" },
  
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" },
  
  kpiRow: { display: "flex", gap: "20px", marginBottom: "25px", flexWrap: "wrap" },
  kpiCard: { flex: "1 1 0", minWidth: "180px", backgroundColor: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  kpiLabel: { fontSize: "0.85rem", fontWeight: "bold", color: "#6b7280", letterSpacing: "0.05em", margin: "0 0 10px 0" },
  kpiValueRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  kpiNumber: { fontSize: "2.5rem", fontWeight: "800", color: "#111827", margin: 0, lineHeight: 1 },
  
  filterRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" },
  pillBtn: { padding: "8px 16px", borderRadius: "20px", border: "none", backgroundColor: "#e5e7eb", color: "#374151", fontWeight: "600", cursor: "pointer", transition: "0.2s" },
  pillActivo: { backgroundColor: "#2563eb", color: "white" },
  
  selectDropdown: { padding: "10px 15px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "0.95rem", outline: "none", backgroundColor: "white", cursor: "pointer", minWidth: "170px" },
  btnLimpiar: { padding: "10px 15px", backgroundColor: "#f3f4f6", color: "#4b5563", border: "1px solid #d1d5db", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "0.2s" },
  
  listContainer: { backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  tableHeader: { display: "flex", padding: "16px 20px", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", fontSize: "0.8rem", fontWeight: "700", color: "#6b7280", letterSpacing: "0.05em", flexWrap: "wrap", gap: "10px" },
  tableRow: { display: "flex", padding: "20px", borderBottom: "1px solid #f3f4f6", alignItems: "center", flexWrap: "wrap", gap: "10px", transition: "background-color 0.2s", ":hover": { backgroundColor: "#f9fafb" } },
  
  textoFolio: { color: "#2563eb", fontWeight: "700", fontSize: "0.95rem", marginBottom: "4px", display: "inline-block" },
  tagFalla: { display: "inline-block", backgroundColor: "#dbeafe", color: "#1e40af", padding: "6px 10px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "600", border: "1px solid #bfdbfe" },
  
  btnPrimario: { padding: "10px 25px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "0.95rem", transition: "0.2s" },
  btnPrimarioDetalle: { width: "100%", padding: "16px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontSize: "1.05rem", fontWeight: "bold", cursor: "pointer", marginTop: "20px" },
  btnSecundario: { padding: "10px 15px", backgroundColor: "white", border: "1px solid #d1d5db", borderRadius: "8px", cursor: "pointer", fontWeight: "600", color: "#374151" },
  btnPeligro: { width: "100%", padding: "16px", backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #f87171", borderRadius: "8px", fontSize: "1.05rem", fontWeight: "bold", cursor: "pointer", marginTop: "20px" },
  
  cardFormulario: { backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb" },
  grid2Col: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "25px" },
  labelDetalle: { fontSize: "0.85rem", fontWeight: "bold", color: "#6b7280", margin: "0 0 5px 0", textTransform: "uppercase" },
  valorDetalle: { fontSize: "1.15rem", fontWeight: "500", color: "#111827", margin: 0 },
  divisor: { margin: "30px 0", border: "none", borderTop: "1px solid #e5e7eb" },
  cajaExtra: { marginBottom: "25px", padding: "20px", backgroundColor: "#f3f4f6", borderLeft: "4px solid #4b5563", borderRadius: "8px" },
  cajaEvidencia: { marginTop: "25px", marginBottom: "30px", padding: "30px", backgroundColor: "#f9fafb", border: "2px dashed #d1d5db", textAlign: "center", borderRadius: "12px" },
  badgeMecanico: { backgroundColor: "#e5e7eb", color: "#374151", padding: "6px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "1rem", border: "1px solid #d1d5db" }
};