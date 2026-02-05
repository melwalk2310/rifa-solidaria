import React, { useState, useEffect } from 'react';
import { 
  Heart, Landmark, Smartphone, ClipboardList, CheckCircle2, 
  Copy, XCircle, Lock, User, Phone, Tv, Stethoscope, 
  ShieldCheck, ArrowRight, ChevronDown, Sparkles, DollarSign, Loader2 
} from 'lucide-react';

/**
 * RIFA SOLIDARIA LEYLA SALCEDO - VERSIÓN FINAL CORREGIDA
 * Story Branding: Dignidad, Esperanza Clínica y Acción Colectiva.
 */

const App = () => {
  // --- CONFIGURACIÓN DE ENDPOINT ---
  const getApiUrl = () => {
    const path = '/.netlify/functions/tickets';
    try {
      if (typeof window !== 'undefined' && window.location.origin && !window.location.origin.startsWith('blob:')) {
        return new URL(path, window.location.origin).toString();
      }
    } catch (e) {
      return path;
    }
    return path;
  };
  
  const API_URL = getApiUrl();

  // --- ESTADOS ---
  const [soldTickets, setSoldTickets] = useState([]); 
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const totalTickets = 300;
  const beneficiary = {
    name: "Leyla Salcedo",
    whatsapp: "584141386410",
    bank: {
      entity: "Banesco",
      phone: "04141386410",
      id_raw: "12067611"
    }
  };

  // --- SINCRONIZACIÓN CON NEON DB ---
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setSoldTickets(data.sold || []);
      }
    } catch (error) {
      console.error("Error al conectar con Neon:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const persistChange = async (number, isAdding) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number,
          action: isAdding ? 'sell' : 'release',
          password: adminPassword
        })
      });
      if (!response.ok) throw new Error("Error en servidor");
    } catch (error) {
      console.error("No se pudo guardar en Neon:", error);
      fetchTickets();
    }
  };

  // --- LÓGICA DE INTERACCIÓN ---
  const toggleSelection = (number) => {
    if (soldTickets.includes(number)) return;
    if (selectedTickets.includes(number)) {
      setSelectedTickets(selectedTickets.filter(n => n !== number));
    } else {
      setSelectedTickets([...selectedTickets, number]);
    }
  };

  const toggleSoldStatus = (number) => {
    if (!isAdminMode) return;
    const isAdding = !soldTickets.includes(number);
    
    if (isAdding) setSoldTickets([...soldTickets, number]);
    else setSoldTickets(soldTickets.filter(n => n !== number));

    persistChange(number, isAdding);
  };

  const copyToClipboard = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const canConfirm = selectedTickets.length > 0 && buyerName.trim() !== "" && buyerPhone.trim() !== "";

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* INYECCIÓN DE ESTILOS CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e11d48; border-radius: 10px; }
        .bg-vibrant-header { background: linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb923c 100%); }
      `}} />

      {/* 1. HERO: HISTORIA Y ESENCIA */}
      <header className="relative pt-20 pb-24 px-6 overflow-hidden bg-vibrant-header shadow-inner">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          <div className="relative inline-block group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto transition-transform duration-700 group-hover:scale-105">
              <img src="leyla.png" alt="Leyla Salcedo" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
              <User className="text-white/50 hidden" size={60} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white text-rose-600 p-3 rounded-full shadow-2xl border-2 border-rose-500">
              <Heart size={20} fill="currentColor" />
            </div>
          </div>
          <div className="space-y-4 text-white">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none drop-shadow-2xl">Unidos por <br/> Leyla Salcedo</h1>
            <div className="inline-block px-8 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-[10px] font-black uppercase tracking-[0.4em] shadow-lg">V-12.067.611 • Propósito Médico</div>
          </div>
          <p className="text-rose-50 max-w-xl mx-auto leading-relaxed font-bold text-lg md:text-xl italic drop-shadow-md">"Transformamos la solidaridad en pasos hacia la recuperación. Tu aporte hace posible los estudios especializados de nuestra madre."</p>
          <ChevronDown className="mx-auto text-white animate-bounce mt-8 opacity-50" size={32} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 -mt-16 relative z-20 space-y-16 pb-40">
        
        {/* 2. EL PREMIO */}
        <section className="bg-white p-10 rounded-[4rem] shadow-[0_30px_80px_rgba(225,29,72,0.15)] border border-rose-50 flex flex-col items-center space-y-8 text-center">
          <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl"><Sparkles size={16} /> Gran Sorteo Especial</div>
          <div className="w-full relative group">
            <div className="relative bg-slate-50 rounded-[3.5rem] p-10 aspect-video flex items-center justify-center border border-slate-100 overflow-hidden shadow-inner">
              <img src="tv.png" alt="Premio TV" className="max-h-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] transition-transform group-hover:scale-105 duration-1000" onError={(e) => { e.target.src = 'https://via.placeholder.com/800x500?text=Smart+TV+32'; }} />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">Insignia 32" Smart TV</h3>
            <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Amazon Fire TV Integrado • Nuevo de Paquete</p>
          </div>
        </section>

        {/* 3. DATOS DEL PARTICIPANTE */}
        <section className="bg-white p-12 rounded-[4rem] shadow-2xl shadow-slate-100 border border-slate-50 space-y-10 relative overflow-hidden text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-rose-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-rose-200"><User size={32} /></div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tight">Registro</h3>
              <p className="text-sm text-slate-400 font-bold mt-2 uppercase tracking-widest">Identifícate para participar</p>
            </div>
          </div>
          <div className="grid gap-8 relative z-10">
            <div className="space-y-3 group text-left">
              <label className="text-[11px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em]">Nombre Completo</label>
              <input type="text" placeholder="Ej: María Pérez" className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] py-6 px-10 text-lg outline-none focus:border-rose-500 font-bold text-slate-700" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
            </div>
            <div className="space-y-3 group text-left">
              <label className="text-[11px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em]">WhatsApp</label>
              <input type="tel" placeholder="Ej: 0414..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] py-6 px-10 text-lg outline-none focus:border-rose-500 font-bold text-slate-700" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} />
            </div>
          </div>
        </section>

        {/* 4. TALONARIO DINÁMICO */}
        <section className="space-y-12">
          <div className="flex flex-wrap items-center justify-between gap-8 px-6">
            <div><h3 className="text-4xl font-black text-slate-900 leading-none tracking-tighter">Talonario</h3><p className="text-sm text-slate-400 font-bold mt-3 text-center md:text-left">Toca los números disponibles para seleccionarlos.</p></div>
            <div className="flex gap-5 text-[10px] font-black uppercase tracking-widest bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mx-auto md:mx-0">
              <span className="flex items-center gap-2 font-bold"><div className="w-4 h-4 bg-white border-2 border-slate-200 rounded-sm"></div> Libre</span>
              <span className="flex items-center gap-2 text-rose-600 font-bold"><div className="w-4 h-4 bg-rose-600 rounded-md"></div> Mío</span>
              <span className="flex items-center gap-2 text-slate-950 font-black"><div className="w-4 h-4 bg-slate-950 rounded-md flex items-center justify-center text-[8px] text-white font-bold">X</div> Vendido</span>
            </div>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar p-10 bg-white rounded-[4rem] border border-slate-100 shadow-2xl relative">
            {loading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex items-center justify-center rounded-[4rem]"><Loader2 size={48} className="text-rose-500 animate-spin" /></div>}
            {[...Array(totalTickets)].map((_, i) => {
              const num = i + 1;
              const isSold = soldTickets.includes(num);
              const isSelected = selectedTickets.includes(num);
              return (
                <button key={num} onClick={() => isAdminMode ? toggleSoldStatus(num) : toggleSelection(num)} className={`aspect-square flex items-center justify-center rounded-2xl text-[11px] font-black transition-all duration-300 relative ${isSold ? 'bg-slate-950 text-white border-2 border-slate-950 scale-95 shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] cursor-not-allowed opacity-90' : isSelected ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-2xl shadow-rose-200 scale-115 z-10' : 'bg-white text-slate-400 border border-slate-100 hover:border-rose-400 hover:text-rose-600 shadow-sm active:scale-90'} ${isAdminMode ? 'ring-4 ring-blue-500 ring-offset-2' : ''}`}>{num.toString().padStart(3, '0')}{isSold && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="text-white text-3xl font-light opacity-60 leading-none">×</span></div>}</button>
              );
            })}
          </div>
        </section>

        {/* 5. RESUMEN Y ACCIÓN */}
        <section className="pb-40 text-center">
          <div className="bg-slate-900 text-white p-14 rounded-[5rem] shadow-[0_50px_100px_rgba(225,29,72,0.15)] space-y-12 border-b-[24px] border-rose-600 relative overflow-hidden">
            {selectedTickets.length > 0 ? (
              <div className="relative z-10 space-y-12">
                <div className="space-y-4"><p className="text-[12px] font-black uppercase text-rose-500 tracking-[0.5em]">Números Reservados</p><p className="text-[9rem] font-black tracking-tighter leading-none text-white drop-shadow-2xl">{selectedTickets.length}</p></div>
                <div className="flex flex-wrap justify-center gap-4 max-h-40 overflow-y-auto px-10 custom-scrollbar">{selectedTickets.sort((a,b)=>a-b).map(n => (<span key={n} className="bg-white/10 border border-white/5 px-6 py-4 rounded-[2rem] font-black text-rose-400 text-2xl italic shadow-2xl">#{n.toString().padStart(3, '0')}</span>))}</div>
                <div className="space-y-4 pt-8"><button onClick={() => setIsModalOpen(true)} disabled={!canConfirm} className={`w-full py-8 rounded-[3rem] font-black text-3xl transition-all flex items-center justify-center gap-5 shadow-2xl ${canConfirm ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-600/50 active:scale-95 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}>CONTINUAR <ArrowRight size={32} /></button>{!canConfirm && <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest animate-pulse">Completa tus datos para confirmar</p>}</div>
              </div>
            ) : (
              <div className="py-24 space-y-8 opacity-20 italic"><ClipboardList size={100} className="mx-auto text-rose-500" /><p className="text-3xl font-bold leading-tight">Tu selección aparecerá aquí. <br/>Toca los números arriba.</p></div>
            )}
          </div>
        </section>

      </main>

      {/* MODAL DE PAGO (ZELLE INCLUIDO) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[4.5rem] p-12 sm:p-16 shadow-3xl transform animate-in zoom-in duration-500 relative border border-rose-100 my-8">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-12 right-12 text-slate-300 hover:text-rose-600 transition-colors"><XCircle size={48} /></button>
            <div className="text-center mb-10">
              <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border-2 border-rose-100 shadow-2xl shadow-rose-50"><Landmark size={48} /></div>
              <h2 className="text-4xl font-black text-slate-900 leading-none tracking-tight">Cerrar Reserva</h2>
              <p className="text-rose-500 font-black uppercase tracking-widest text-[11px] mt-6">Opciones de Pago Solidario</p>
            </div>
            <div className="space-y-6 mb-12">
              <div className="bg-rose-50/50 p-8 rounded-[3rem] border-2 border-rose-100 space-y-6 shadow-inner text-center">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Banesco • Pago Móvil</p>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-rose-50 space-y-4">
                  <div><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Teléfono</p><p className="text-3xl font-black text-slate-800 tracking-tighter leading-none mb-2 text-center">04141386410</p><button onClick={() => copyToClipboard("04141386410")} className="w-full py-2 bg-rose-50 text-rose-600 rounded-lg font-black text-[10px] uppercase flex items-center justify-center gap-2">Copiar Teléfono</button></div>
                  <div className="pt-2 text-center"><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center font-bold">Cédula</p><p className="text-3xl font-black text-slate-800 tracking-tighter leading-none mb-2 text-center">12.067.611</p><button onClick={() => copyToClipboard("12067611")} className="w-full py-2 bg-rose-50 text-rose-600 rounded-lg font-black text-[10px] uppercase flex items-center justify-center gap-2">Copiar Cédula</button></div>
                </div>
              </div>
              <div className="bg-blue-50/50 p-8 rounded-[3rem] border-2 border-blue-100 space-y-4 shadow-inner text-center">
                <div className="flex items-center justify-center gap-2 text-blue-600 font-black uppercase text-[10px] tracking-widest mb-2"><DollarSign size={16} /> Pago vía Zelle</div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-blue-50 space-y-3"><p className="text-slate-600 font-bold text-sm leading-relaxed text-center">El correo es <span className="text-blue-600 font-black underline underline-offset-4 decoration-blue-200">rotativo</span>.</p><p className="text-xs text-slate-400 italic text-center">Solicita los datos activos al enviar tu comprobante por WhatsApp.</p></div>
              </div>
            </div>
            <button onClick={() => { const text = encodeURIComponent(`¡Hola! Soy ${buyerName}. He reservado los números: ${selectedTickets.join(', ')} para Leyla Salcedo. Envío el comprobante. (Solicito datos de Zelle si aplica)`); window.open(`https://wa.me/${beneficiary.whatsapp}?text=${text}`); }} className="w-full bg-green-500 hover:bg-green-600 text-white py-8 rounded-[3rem] font-black text-2xl transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95"><Smartphone size={32} /> REPORTAR WHATSAPP</button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="py-40 text-center border-t border-slate-100 bg-white space-y-16">
        <div className="flex justify-center gap-24 text-rose-200"><Heart size={48} fill="currentColor" /><ShieldCheck size={48} /><Stethoscope size={48} /></div>
        <div className="max-w-sm mx-auto text-center">
          {!isAdminMode ? (
            <button onClick={() => setShowAdminLogin(!showAdminLogin)} className="text-[12px] font-black text-slate-300 uppercase tracking-[0.8em] hover:text-rose-500 transition-colors">Gestión Administrativa</button>
          ) : (
            <div className="space-y-8"><div className="bg-blue-600 text-white px-12 py-5 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-2xl animate-pulse">Modo Edición Activo</div><button onClick={() => setIsAdminMode(false)} className="text-slate-400 text-[11px] font-bold underline uppercase tracking-widest">Finalizar Gestión</button></div>
          )}
          {showAdminLogin && !isAdminMode && (
            <div className="mt-12 p-12 bg-white border border-slate-200 rounded-[4rem] shadow-2xl space-y-8 animate-in slide-in-from-top-10 duration-500">
              <input type="password" placeholder="Contraseña Gestión" className="w-full px-10 py-6 rounded-[2rem] border-2 border-slate-100 text-center text-2xl outline-none focus:border-rose-500 font-black text-slate-700" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
              <button onClick={() => { if(adminPassword === "leyla2026") { setIsAdminMode(true); setShowAdminLogin(false); setAdminPassword(""); } else { alert("Acceso denegado"); } }} className="w-full bg-slate-950 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95">ENTRAR</button>
            </div>
          )}
        </div>
        <p className="text-[11px] font-black text-slate-200 uppercase tracking-[1em]">Salud • Unión • Transparencia</p>
      </footer>
    </div>
  );
};

export default App;