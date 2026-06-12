import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  { id:"CI1",  text:"I __________ give up on a project to start a new project.", skill:"Grit", inverse:true },
  { id:"CI2",  text:"I __________ struggle to keep long-term project commitments.", skill:"Grit", inverse:true },
  { id:"CI3",  text:"I __________ let new interests distract me from current ones.", skill:"Grit", inverse:true },
  { id:"PE1",  text:"Setbacks __________ discourage me.", skill:"Grit", inverse:true },
  { id:"PE4",  text:"I __________ stop participating in a hobby if I am not good at it right away.", skill:"Grit", inverse:true },
  { id:"PE5",  text:"I __________ give up on a hobby if someone tells me I am not good at it.", skill:"Grit", inverse:true },
  { id:"SCB4", text:"I __________ choose projects that align with my values.", skill:"Purposefulness", inverse:false },
  { id:"SCB5", text:"I __________ connect my values to projects I work on.", skill:"Purposefulness", inverse:false },
  { id:"SCB6", text:"I __________ relate my work to my core principles.", skill:"Purposefulness", inverse:false },
  { id:"MP1",  text:"I __________ connect the work I do to a greater purpose.", skill:"Purposefulness", inverse:false },
  { id:"MP5",  text:"I __________ find a way to make my project have a greater impact.", skill:"Purposefulness", inverse:false },
  { id:"MP6",  text:"The impact of my work __________ has deep significance to me.", skill:"Purposefulness", inverse:false },
  { id:"APT2", text:"I __________ imagine positive outcomes for myself.", skill:"Hopefulness", inverse:false },
  { id:"APT4", text:"I __________ have difficulty identifying what is good in my life.", skill:"Hopefulness", inverse:true },
  { id:"APT7", text:"I __________ look for the positive when I am disappointed.", skill:"Hopefulness", inverse:false },
  { id:"PO4",  text:"I __________ believe that things will end well.", skill:"Hopefulness", inverse:false },
  { id:"PO6",  text:"I __________ have faith that a bad situation will get better.", skill:"Hopefulness", inverse:false },
  { id:"PO7",  text:"Challenges __________ lessen my excitement for the future.", skill:"Hopefulness", inverse:true },
  { id:"CS2",  text:"I __________ use different strategies to help me manage my stress.", skill:"Stress Management", inverse:false },
  { id:"CS3",  text:"I __________ know what techniques help me destress.", skill:"Stress Management", inverse:false },
  { id:"CS6",  text:"I __________ utilize multiple methods to manage my stress.", skill:"Stress Management", inverse:false },
  { id:"RH4",  text:"When I am overworked, I would __________ do anything to avoid asking for help.", skill:"Stress Management", inverse:true },
  { id:"RH5",  text:"If I am too stressed, I __________ reach out to people that can help me.", skill:"Stress Management", inverse:false },
  { id:"RH6",  text:"When overwhelmed with a group project, I __________ reach out to my team for help.", skill:"Stress Management", inverse:false },
  { id:"ITT1", text:"I __________ have difficulty finding things I am thankful for.", skill:"Gratitude", inverse:true },
  { id:"ITT4", text:"I __________ struggle to see past my problems and see the positive.", skill:"Gratitude", inverse:true },
  { id:"ITT6", text:"I am __________ unaware of what there is to be thankful for.", skill:"Gratitude", inverse:true },
  { id:"APG1", text:"I am __________ purposeful about finding things to be appreciative of.", skill:"Gratitude", inverse:false },
  { id:"APG2", text:"I __________ look for things to be grateful for.", skill:"Gratitude", inverse:false },
  { id:"APG3", text:"I __________ take the time to reflect on all the things I am thankful for.", skill:"Gratitude", inverse:false },
];

const FREQ = [
  { label:"Never",     labelEs:"Nunca",      pos:1,  inv:10 },
  { label:"Rarely",    labelEs:"Raramente",  pos:2,  inv:7  },
  { label:"Sometimes", labelEs:"A veces",    pos:4,  inv:4  },
  { label:"Often",     labelEs:"Seguido",    pos:7,  inv:2  },
  { label:"Always",    labelEs:"Siempre",    pos:10, inv:1  },
];

const BADGES = [
  { key:"assessment", name:"Flame Keeper",      nameEs:"Guardian de la Llama",  icon:"🔥", desc:"Completed the Resilience assessment",            descEs:"Completaste la evaluacion",             how:"Complete the 30-question assessment",           howEs:"Completa la evaluacion de 30 preguntas"       },
  { key:"coaching",   name:"Reflection Seeker", nameEs:"Buscador de Reflexion", icon:"💬", desc:"Had a meaningful coaching conversation",          descEs:"Tuviste una conversacion significativa",    how:"Exchange at least 3 messages with your coach",  howEs:"Intercambia al menos 3 mensajes con tu coach" },
  { key:"goal",       name:"Goal Maker",        nameEs:"Constructor de Metas",  icon:"🎯", desc:"Completed a SMART goal cycle with your coach",   descEs:"Completaste un ciclo de meta SMART",        how:"Set a SMART goal and mark it complete",         howEs:"Establece una meta SMART y marcala completa"  },
];

const SKILLS = ["Grit","Purposefulness","Hopefulness","Stress Management","Gratitude"];

const TIERS = [
  { label:"Development Opportunity", labelEs:"Oportunidad de Desarrollo", min:0,   max:29.99, color:"#e74c3c", icon:"🌱", note:"This is an area to grow. Your coach can help you build a SMART goal here.",                                                                                        noteEs:"Esta es un area de crecimiento. Tu coach puede ayudarte." },
  { label:"Below Average",           labelEs:"Bajo Promedio",             min:30,  max:54.99, color:"#e67e22", icon:"📈", note:"You are building momentum. A focused SMART goal can move you forward.",                                                                                              noteEs:"Estas ganando impulso. Una meta SMART puede ayudarte a avanzar." },
  { label:"Above Average",           labelEs:"Sobre Promedio",            min:55,  max:74.99, color:"#27ae60", icon:"⭐", note:"Solid foundation. Consider a SMART goal to reach the next level.",                                                                                                    noteEs:"Base solida. Considera una meta SMART." },
  { label:"Leadership",              labelEs:"Liderazgo",                 min:75,  max:89.99, color:"#1a35d4", icon:"🏆", note:"You are leading the way. Think about how to use this strength to support others.",                                                                                    noteEs:"Estas liderando el camino." },
  { label:"Outlier",                 labelEs:"Atipico",                   min:90,  max:100,   color:"#8e44ad", icon:"🔬", note:"Remarkable score - worth reflecting on. Outlier results can reflect genuine strength, but also rigidity or overconfidence. Ask your coach to explore this.",         noteEs:"Puntaje notable - vale la pena reflexionar." },
];

const ALL_PILLARS = [
  { key:"Awareness",  label:"Awareness",  labelEs:"Conciencia",  icon:"🔍", color:"#b026d4", desc:"How well do I know myself?",           descEs:"Que tan bien me conozco?",         locked:true  },
  { key:"Agency",     label:"Agency",     labelEs:"Agencia",     icon:"⚡", color:"#1a35d4", desc:"What drives me to act?",               descEs:"Que me impulsa a actuar?",         locked:true  },
  { key:"Resilience", label:"Resilience", labelEs:"Resiliencia", icon:"🔥", color:"#c0392b", desc:"What sustains me through difficulty?", descEs:"Que me sostiene en la dificultad?", locked:false },
  { key:"Connection", label:"Connection", labelEs:"Conexion",    icon:"🤝", color:"#0a8a5a", desc:"Who am I for others?",                 descEs:"Quien soy para los demas?",        locked:true  },
];

const USER_STORE = {};
const RC   = "#c0392b";
const GRAD = "linear-gradient(135deg,#e04030,#7d2618)";

const getTier  = pct => TIERS.find(t => pct >= t.min && pct <= t.max) || TIERS[0];
const shuffle  = a => [...a].sort(() => Math.random() - 0.5);
const scoreQ   = (idx, inv) => idx == null ? 0 : (inv ? FREQ[idx].inv : FREQ[idx].pos);
const getVerCode = (name, university) => {
  const str = name + university + "Resilience" + new Date().getFullYear();
  let hash = 0;
  for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
  return "CA-RES-" + Math.abs(hash).toString(36).toUpperCase().slice(0, 6);
};

const STYLES = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes popIn  { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
  @keyframes pulse  { 0%,100%{opacity:.35;transform:scale(.75)} 50%{opacity:1;transform:scale(1)} }
  .fu  { animation:fadeUp .28s ease both }
  .pop { animation:popIn .32s cubic-bezier(.34,1.56,.64,1) both }
  @media print {
    body * { visibility:hidden !important; }
    #cert, #cert * { visibility:visible !important; }
    #cert { position:fixed !important; top:0 !important; left:0 !important; width:100% !important; height:100% !important; padding:40px !important; box-sizing:border-box !important; }
  }
`;

function TierBadge({ pct, lang, showNote }) {
  const t = getTier(pct);
  return (
    <div>
      <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 13px", borderRadius:20, background:t.color+"22", border:"1.5px solid "+t.color+"50" }}>
        <span style={{ fontSize:12 }}>{t.icon}</span>
        <span style={{ fontSize:12, fontWeight:700, color:t.color }}>{lang==="en"?t.label:t.labelEs}</span>
      </div>
      {showNote && <div style={{ fontSize:12, color:"#444", marginTop:10, lineHeight:1.7, fontStyle:"italic", padding:"10px 14px", background:t.color+"10", borderRadius:10, borderLeft:"3px solid "+t.color }}>{lang==="en"?t.note:t.noteEs}</div>}
    </div>
  );
}

function Bar({ pct, h }) {
  const ht = h || 6;
  return (
    <div style={{ height:ht, background:"#f0e8e8", borderRadius:ht, overflow:"hidden" }}>
      <div style={{ width:pct+"%", height:"100%", background:GRAD, borderRadius:ht, transition:"width .6s" }} />
    </div>
  );
}

// ── Certificate ───────────────────────────────────────────────────────────────
function Certificate({ user, result, lang, onClose }) {
  const verCode = getVerCode(user.name, user.university);
  const dateStr = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(7,7,26,.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, backdropFilter:"blur(6px)", padding:"20px" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:16, maxWidth:620, width:"100%", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 30px 80px rgba(0,0,0,.45)", display:"flex", flexDirection:"column" }}>

        {/* Certificate body */}
        <div id="cert" style={{ padding:"44px 52px", background:"#fff", position:"relative", overflow:"hidden", fontFamily:"Georgia,serif" }}>
          {/* Top accent */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:6, background:GRAD }} />

          {/* Watermark circle */}
          <div style={{ position:"absolute", right:-60, bottom:-60, width:240, height:240, borderRadius:"50%", background:RC+"06", pointerEvents:"none" }} />
          <div style={{ position:"absolute", right:-20, bottom:-20, width:140, height:140, borderRadius:"50%", background:RC+"08", pointerEvents:"none" }} />

          {/* Header row */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:36 }}>
            <div>
              <div style={{ fontSize:9, letterSpacing:5, color:RC, textTransform:"uppercase", marginBottom:2 }}>Character Aarc</div>
              <div style={{ fontSize:9, letterSpacing:2, color:"#aaa", textTransform:"uppercase" }}>by Ingenium</div>
            </div>
            <div style={{ fontSize:32 }}>🔥</div>
          </div>

          {/* Certificate title */}
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ fontSize:10, letterSpacing:6, color:"#aaa", textTransform:"uppercase", marginBottom:20 }}>Certificate of Completion</div>
            <div style={{ fontSize:13, color:"#888", marginBottom:10, fontStyle:"italic" }}>This is to certify that</div>
            <div style={{ fontSize:34, fontWeight:700, color:"#07071a", marginBottom:4, letterSpacing:.5 }}>{user.name}</div>
            <div style={{ fontSize:13, color:"#888", marginBottom:24 }}>{user.university}</div>
            <div style={{ width:64, height:1.5, background:"linear-gradient(90deg,transparent,"+RC+",transparent)", margin:"0 auto 24px" }} />
            <div style={{ fontSize:13, color:"#555", marginBottom:6 }}>has successfully completed the</div>
            <div style={{ fontSize:26, fontWeight:700, color:RC, marginBottom:4 }}>Resilience Pillar</div>
            <div style={{ fontSize:13, color:"#555", marginBottom:24, lineHeight:1.7 }}>of the Character Aarc Human Skills Development Program,<br/>demonstrating commitment to growth through self-assessment and coaching.</div>

            {/* Skills */}
            <div style={{ display:"flex", justifyContent:"center", gap:7, flexWrap:"wrap", marginBottom:24 }}>
              {SKILLS.map(sk => (
                <div key={sk} style={{ fontSize:11, padding:"4px 12px", borderRadius:20, background:RC+"0e", color:RC, border:"1px solid "+RC+"28", fontWeight:600 }}>{sk}</div>
              ))}
            </div>

            {/* NACE */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"12px 22px", borderRadius:12, background:"#f4f1fc", border:"1px solid #dbd4f0" }}>
              <span style={{ fontSize:20 }}>🏅</span>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:9, color:"#888", textTransform:"uppercase", letterSpacing:2, marginBottom:2 }}>NACE Career Readiness Competency</div>
                <div style={{ fontSize:14, fontWeight:700, color:"#1a35d4" }}>Professionalism</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", borderTop:"1px solid #f0e8e8", paddingTop:22, marginTop:8 }}>
            <div>
              <div style={{ fontSize:13, color:"#555", fontWeight:600, marginBottom:2 }}>{dateStr}</div>
              <div style={{ fontSize:10, color:"#bbb", letterSpacing:1, textTransform:"uppercase" }}>Date of Completion</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ width:140, borderBottom:"1.5px solid #333", marginBottom:6 }} />
              <div style={{ fontSize:13, fontWeight:700, color:"#07071a" }}>Character Aarc Coach</div>
              <div style={{ fontSize:11, color:"#888" }}>Ingenium</div>
            </div>
          </div>

          {/* Verification */}
          <div style={{ textAlign:"center", marginTop:18 }}>
            <div style={{ fontSize:10, color:"#ccc", letterSpacing:1 }}>Verification ID: {verCode}</div>
          </div>

          {/* Bottom accent */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:4, background:GRAD }} />
        </div>

        {/* Actions */}
        <div style={{ padding:"16px 20px", borderTop:"1px solid #f0e8e8", display:"flex", gap:10 }}>
          <button onClick={handlePrint} style={{ fontFamily:"Georgia,serif", background:GRAD, color:"#fff", border:"none", borderRadius:10, padding:"11px 24px", cursor:"pointer", fontSize:13, fontWeight:700, flex:2, boxShadow:"0 4px 14px rgba(192,57,43,.3)" }}>
            {lang==="en"?"Save as PDF / Print":"Guardar como PDF / Imprimir"} ↓
          </button>
          <button onClick={onClose} style={{ fontFamily:"Georgia,serif", background:"transparent", color:RC, border:"2px solid "+RC, borderRadius:10, padding:"11px 18px", cursor:"pointer", fontSize:13, fontWeight:700, flex:1 }}>
            {lang==="en"?"Close":"Cerrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Splash Screen ─────────────────────────────────────────────────────────────
function SplashScreen({ lang, setLang, onContinue }) {
  const mobile = window.innerWidth < 620;
  return (
    <div style={{ fontFamily:"Georgia,serif", minHeight:"100vh", background:"linear-gradient(160deg,#07071a 0%,#1a0530 50%,#3a0a10 100%)", color:"#fff", display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
      <style>{STYLES}</style>

      {/* Background circles */}
      {[300,500,700].map((s,i)=><div key={i} style={{ position:"absolute", borderRadius:"50%", border:"1px solid rgba(255,255,255,.04)", width:s, height:s, top:(10+i*15)+"%", left:(-10+i*30)+"%", pointerEvents:"none" }} />)}

      {/* Nav */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px "+(mobile?18:36)+"px", position:"relative", zIndex:1 }}>
        <div>
          <div style={{ fontSize:mobile?14:16, fontWeight:700, letterSpacing:3, background:"linear-gradient(135deg,#e04030,#b026d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Ingenium</div>
          <div style={{ fontSize:9, color:"rgba(255,255,255,.4)", letterSpacing:2 }}>Character Aarc</div>
        </div>
        <button onClick={()=>setLang(l=>l==="en"?"es":"en")} style={{ fontFamily:"Georgia,serif", background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.15)", borderRadius:20, padding:"5px 14px", cursor:"pointer", fontSize:12, color:"rgba(255,255,255,.7)" }}>
          {lang==="en"?"Espanol":"English"}
        </button>
      </div>

      {/* Hero */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:mobile?"30px 22px":"40px 36px", textAlign:"center", position:"relative", zIndex:1 }}>

        <div className="fu" style={{ animationDelay:"0s", marginBottom:16 }}>
          <div style={{ display:"inline-block", fontSize:11, letterSpacing:4, color:RC, textTransform:"uppercase", padding:"6px 18px", borderRadius:20, border:"1px solid "+RC+"50", background:RC+"12", marginBottom:20 }}>
            {lang==="en"?"For University Engineering Students":"Para Estudiantes de Ingenieria Universitaria"}
          </div>
          <div style={{ fontSize:mobile?28:44, fontWeight:700, lineHeight:1.2, marginBottom:16, maxWidth:680 }}>
            {lang==="en"
              ? "Technical skills get you the interview. Human skills get you the career."
              : "Las habilidades tecnicas te consiguen la entrevista. Las humanas, la carrera."}
          </div>
          <div style={{ fontSize:mobile?14:16, color:"rgba(255,255,255,.65)", lineHeight:1.8, maxWidth:540, marginBottom:32 }}>
            {lang==="en"
              ? "Employers consistently rank communication, resilience, and leadership as the skills that separate good engineers from great ones. Character Aarc is a structured program that helps you develop and credential these skills alongside your degree."
              : "Los empleadores califican constantemente la comunicacion, la resiliencia y el liderazgo como las habilidades que distinguen a los buenos ingenieros de los grandes. Character Aarc es un programa estructurado que te ayuda a desarrollar y acreditar estas habilidades junto con tu carrera."}
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="fu" style={{ animationDelay:".1s", display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, maxWidth:500, width:"100%", marginBottom:32 }}>
          {ALL_PILLARS.map(p=>(
            <div key={p.key} style={{ background:"rgba(255,255,255,.06)", borderRadius:14, padding:"14px 16px", border:"1px solid rgba(255,255,255,.1)", display:"flex", alignItems:"center", gap:10, textAlign:"left" }}>
              <span style={{ fontSize:22 }}>{p.icon}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{lang==="en"?p.label:p.labelEs}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", lineHeight:1.4 }}>{lang==="en"?p.desc:p.descEs}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="fu" style={{ animationDelay:".15s", display:"flex", gap:mobile?16:32, marginBottom:36, flexWrap:"wrap", justifyContent:"center" }}>
          {[
            { stat:lang==="en"?"91%":"91%",   label:lang==="en"?"of employers prioritise human skills over GPA":"de empleadores priorizan habilidades humanas sobre el GPA" },
            { stat:lang==="en"?"4 Pillars":"4 Pilares", label:lang==="en"?"mapped to NACE Career Readiness Competencies":"mapeados a las Competencias NACE" },
            { stat:lang==="en"?"~8 min":"~8 min", label:lang==="en"?"per pillar assessment":"por evaluacion de pilar" },
          ].map((s,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:mobile?22:28, fontWeight:700, color:"#fff", marginBottom:4 }}>{s.stat}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", maxWidth:120, lineHeight:1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="fu" style={{ animationDelay:".2s", display:"flex", flexDirection:"column", alignItems:"center", gap:12, width:"100%", maxWidth:360 }}>
          <button onClick={onContinue} style={{ fontFamily:"Georgia,serif", background:GRAD, color:"#fff", border:"none", borderRadius:14, padding:"15px 40px", cursor:"pointer", fontSize:16, fontWeight:700, width:"100%", boxShadow:"0 8px 28px rgba(192,57,43,.45)", letterSpacing:.5 }}>
            {lang==="en"?"Get Started":"Comenzar"} →
          </button>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.35)" }}>
            {lang==="en"?"Free for students · No IT setup required":"Gratis para estudiantes · Sin configuracion de IT"}
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div style={{ padding:"16px "+(mobile?18:36)+"px", borderTop:"1px solid rgba(255,255,255,.06)", display:"flex", justifyContent:"center", position:"relative", zIndex:1 }}>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.25)", letterSpacing:2, textTransform:"uppercase" }}>
          {lang==="en"?"Developing Human-Centred Graduates":"Formando Graduados Centrados en las Personas"}
        </div>
      </div>
    </div>
  );
}
function LoginScreen({ lang, setLang, onLogin }) {
  const [isUp, setIsUp] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", password:"", university:"" });
  const inp = { width:"100%", border:"1.5px solid #dbd4f0", borderRadius:10, padding:"11px 14px", fontSize:14, outline:"none", boxSizing:"border-box", marginBottom:10, background:"#f9f7fe", color:"#07071a", fontFamily:"Georgia,serif" };
  return (
    <div style={{ fontFamily:"Georgia,serif", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(150deg,#07071a 0%,#2a0a1e 45%,#5a1010 100%)", overflow:"hidden", position:"relative" }}>
      <style>{STYLES}</style>
      {[200,360,520].map((s,i) => <div key={i} style={{ position:"absolute", borderRadius:"50%", border:"1px solid rgba(220,80,60,.12)", width:s, height:s, top:(15+i*20)+"%", left:(5+i*24)+"%", pointerEvents:"none" }} />)}
      <div className="pop" style={{ background:"#fff", borderRadius:24, padding:"42px 38px", maxWidth:420, width:"92%", boxShadow:"0 30px 80px rgba(0,0,0,.45)", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:26 }}>
          <div style={{ fontSize:10, letterSpacing:5, color:RC, textTransform:"uppercase", marginBottom:6 }}>Character Aarc</div>
          <div style={{ fontSize:28, fontWeight:700, letterSpacing:3, background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Ingenium</div>
          <div style={{ fontSize:12, color:"#6a6a8a", marginTop:5, fontStyle:"italic" }}>{lang==="en"?"Developing Human-Centred Graduates":"Formando Graduados Centrados en las Personas"}</div>
          <div style={{ display:"inline-block", marginTop:10, fontSize:11, padding:"4px 14px", borderRadius:20, background:RC+"12", color:RC, fontWeight:600, border:"1px solid "+RC+"30" }}>
            {lang==="en"?"Demo - Resilience Pillar":"Demo - Pilar Resiliencia"}
          </div>
        </div>
        <div style={{ fontSize:16, fontWeight:700, color:"#1a1a2e", marginBottom:14 }}>{isUp?(lang==="en"?"Create Account":"Crear Cuenta"):(lang==="en"?"Sign In":"Iniciar Sesion")}</div>
        <input style={inp} placeholder={lang==="en"?"Full name":"Nombre completo"} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        {isUp && <input style={inp} placeholder={lang==="en"?"University":"Universidad"} value={form.university} onChange={e=>setForm({...form,university:e.target.value})} />}
        <input style={inp} placeholder={lang==="en"?"Email address":"Correo electronico"} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input style={inp} placeholder={lang==="en"?"Password":"Contrasena"} type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&onLogin(form,isUp)} />
        <button onClick={()=>onLogin(form,isUp)} style={{ fontFamily:"Georgia,serif", background:GRAD, color:"#fff", border:"none", borderRadius:11, padding:"13px", cursor:"pointer", fontSize:14, fontWeight:700, width:"100%", marginTop:2, boxShadow:"0 4px 18px rgba(192,57,43,.35)" }}>
          {isUp?(lang==="en"?"Create Account":"Crear Cuenta"):(lang==="en"?"Sign In":"Iniciar Sesion")}
        </button>
        <p style={{ textAlign:"center", fontSize:12, color:"#888", marginTop:13, cursor:"pointer" }} onClick={()=>setIsUp(!isUp)}>
          {isUp?(lang==="en"?"Already have an account? ":"Ya tienes cuenta? "):(lang==="en"?"No account? ":"Sin cuenta? ")}
          <span style={{ color:RC, fontWeight:700 }}>{isUp?(lang==="en"?"Sign In":"Inicia Sesion"):(lang==="en"?"Sign Up":"Registrate")}</span>
        </p>
        <div style={{ textAlign:"center", marginTop:8 }}>
          <button onClick={()=>setLang(l=>l==="en"?"es":"en")} style={{ background:"transparent", border:"1px solid #dbd4f0", borderRadius:20, padding:"4px 12px", cursor:"pointer", fontSize:12, color:"#888", fontFamily:"Georgia,serif" }}>{lang==="en"?"Espanol":"English"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardScreen({ user, lang, setLang, resilienceScore, badgesEarned, onEnter, onLogout }) {
  const mobile = window.innerWidth < 620;
  const earned = Object.values(badgesEarned).filter(Boolean).length;
  return (
    <div style={{ fontFamily:"Georgia,serif", minHeight:"100vh", background:"#fdf8f8" }}>
      <style>{STYLES}</style>
      <nav style={{ background:"rgba(255,255,255,.96)", borderBottom:"1px solid #edddd8", padding:"0 "+(mobile?14:26)+"px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56, position:"sticky", top:0, zIndex:20, boxShadow:"0 2px 14px rgba(192,57,43,.07)" }}>
        <div>
          <div style={{ fontSize:mobile?14:17, fontWeight:700, color:"#1a1a2e", letterSpacing:2 }}>Ingenium</div>
          <div style={{ fontSize:9, color:RC, fontStyle:"italic", letterSpacing:1 }}>Character Aarc</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={()=>setLang(l=>l==="en"?"es":"en")} style={{ fontFamily:"Georgia,serif", background:"transparent", border:"1px solid #ddd", borderRadius:20, padding:"4px 11px", cursor:"pointer", fontSize:11, color:"#888" }}>{lang==="en"?"ES":"EN"}</button>
          <button onClick={onLogout} style={{ fontFamily:"Georgia,serif", background:"transparent", border:"none", color:RC, cursor:"pointer", fontSize:12 }}>{lang==="en"?"Sign Out":"Salir"}</button>
        </div>
      </nav>
      <div style={{ maxWidth:780, margin:"0 auto", padding:"28px "+(mobile?14:22)+"px" }}>
        <div className="fu" style={{ background:GRAD, borderRadius:20, padding:mobile?"20px 18px":"28px 32px", marginBottom:28, color:"#fff", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:-30, top:-30, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,.06)", pointerEvents:"none" }} />
          <div style={{ position:"relative" }}>
            <div style={{ fontSize:10, letterSpacing:3, opacity:.75, textTransform:"uppercase", marginBottom:5 }}>{lang==="en"?"Welcome back":"Bienvenido de nuevo"}</div>
            <div style={{ fontSize:mobile?22:28, fontWeight:700 }}>{user.name}</div>
            <div style={{ fontSize:12, opacity:.8, marginTop:2 }}>{user.university}</div>
            <div style={{ display:"flex", gap:12, marginTop:16, flexWrap:"wrap" }}>
              <div style={{ background:"rgba(255,255,255,.18)", borderRadius:12, padding:"10px 18px", textAlign:"center" }}>
                <div style={{ fontSize:26, fontWeight:700 }}>{resilienceScore?"1":"0"}/4</div>
                <div style={{ fontSize:10, opacity:.85 }}>{lang==="en"?"Pillars Done":"Pilares"}</div>
              </div>
              <div style={{ background:"rgba(255,255,255,.18)", borderRadius:12, padding:"10px 18px", textAlign:"center" }}>
                <div style={{ fontSize:26, fontWeight:700 }}>{earned}/{BADGES.length}</div>
                <div style={{ fontSize:10, opacity:.85 }}>{lang==="en"?"Badges Earned":"Insignias"}</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize:10, letterSpacing:3, color:"#aaa", textTransform:"uppercase", marginBottom:14 }}>{lang==="en"?"Your AARC Pillars":"Tus Pilares AARC"}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:mobile?12:16 }}>
          {ALL_PILLARS.map((p,idx) => {
            const isRes = p.key==="Resilience";
            const sc    = isRes ? resilienceScore : null;
            return (
              <div key={p.key} className="fu" onClick={isRes?onEnter:undefined}
                style={{ animationDelay:(idx*.07)+"s", background:"#fff", borderRadius:20, border:isRes?"1.5px solid "+p.color+"35":"1.5px solid #ecdcdc", padding:mobile?"20px 16px":"26px 22px", cursor:isRes?"pointer":"default", fontFamily:"Georgia,serif", boxShadow:isRes?"0 4px 22px "+p.color+"14":"none", position:"relative", overflow:"hidden", opacity:p.locked?.52:1, transition:"transform .18s, box-shadow .18s" }}
                onMouseEnter={e=>{if(isRes){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 32px "+p.color+"28";}}}
                onMouseLeave={e=>{if(isRes){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 22px "+p.color+"14";}}}>
                {p.locked && <div style={{ position:"absolute", top:12, right:14, fontSize:16 }}>🔒</div>}
                {isRes && <div style={{ position:"absolute", top:12, right:14, fontSize:10, padding:"3px 9px", borderRadius:20, background:RC+"18", color:RC, fontWeight:700, border:"1px solid "+RC+"30" }}>DEMO</div>}
                <div style={{ fontSize:mobile?28:34, marginBottom:10 }}>{p.icon}</div>
                <div style={{ fontSize:mobile?14:16, fontWeight:700, color:p.locked?"#bbb":"#07071a", marginBottom:3 }}>{lang==="en"?p.label:p.labelEs}</div>
                <div style={{ fontSize:11, color:p.locked?"#ccc":"#888", lineHeight:1.5, marginBottom:12 }}>{lang==="en"?p.desc:p.descEs}</div>
                {isRes && sc ? (
                  <>
                    <div style={{ fontSize:11, color:"#27ae60", fontWeight:600, marginBottom:5 }}>Done - Assessment Complete</div>
                    <Bar pct={sc.pct} h={4} />
                  </>
                ) : isRes ? (
                  <div style={{ display:"inline-block", fontSize:10, padding:"4px 12px", borderRadius:20, background:RC+"14", color:RC, fontWeight:700 }}>{lang==="en"?"Tap to begin":"Tocar para comenzar"} →</div>
                ) : (
                  <div style={{ display:"inline-block", fontSize:10, padding:"4px 12px", borderRadius:20, background:"#f0e8e8", color:"#ccc", fontWeight:600 }}>{lang==="en"?"Coming soon":"Proximamente"}</div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop:20, padding:"14px 18px", borderRadius:14, background:"#fff8f0", border:"1px solid #ffe0cc", fontSize:13, color:"#b36200", lineHeight:1.65, textAlign:"center" }}>
          {lang==="en"
            ? "This is a demo of the Resilience pillar. In the full Character Aarc program, all four AARC pillars unlock progressively across two academic years."
            : "Esta es una demo del pilar Resiliencia. En el programa completo, los cuatro pilares se desbloquean progresivamente."}
        </div>
        <div style={{ textAlign:"center", marginTop:24, paddingBottom:8 }}>
          <div style={{ fontSize:11, color:"#ccc", letterSpacing:2, textTransform:"uppercase", marginBottom:3 }}>Ingenium · Character Aarc</div>
          <div style={{ fontSize:11, color:"#ddd", fontStyle:"italic" }}>{lang==="en"?"Developing Human-Centred Graduates":"Formando Graduados Centrados en las Personas"}</div>
        </div>
      </div>
    </div>
  );
}

// ── Resilience Hub ────────────────────────────────────────────────────────────
function ResilienceHub({ user, lang, setLang, onBack, resilienceScore, setResilienceScore, badgesEarned, setBadgesEarned }) {
  const [tab, setTab]             = useState("overview");
  const [shuffled, setShuffled]   = useState([]);
  const [answers, setAnswers]     = useState({});
  const [currentQ, setCurrentQ]   = useState(0);
  const [result, setResult]       = useState(resilienceScore || null);
  const [messages, setMessages]   = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [goalDone, setGoalDone]   = useState(false);
  const [showCert, setShowCert]   = useState(false);
  const chatEndRef = useRef(null);
  const mobile = window.innerWidth < 620;

  const rd           = result;
  const userMsgCount = messages.filter(m=>m.role==="user").length;
  const coachingDone = userMsgCount >= 3;

  useEffect(()=>{ if(chatEndRef.current) chatEndRef.current.scrollIntoView({behavior:"smooth"}); },[messages]);
  useEffect(()=>{ if(userMsgCount>=3 && !badgesEarned.coaching) setBadgesEarned(b=>({...b,coaching:true})); },[userMsgCount]);

  const goToIntro    = () => { setResult(null); setTab("intro"); };
  const beginQuestions = () => { setShuffled(shuffle(QUESTIONS)); setAnswers({}); setCurrentQ(0); setTab("assess"); };

  const submitAssess = () => {
    const st={},sc={};
    let total=0;
    shuffled.forEach(q=>{ const s=scoreQ(answers[q.id],q.inverse); total+=s; if(!st[q.skill]){st[q.skill]=0;sc[q.skill]=0;} st[q.skill]+=s; sc[q.skill]++; });
    const pct=Math.round((total/(shuffled.length*10))*100);
    const skills={};
    Object.keys(st).forEach(sk=>{ skills[sk]=Math.round((st[sk]/(sc[sk]*10))*100); });
    const computed={pct,skills};
    setResult(computed); setResilienceScore(computed); setBadgesEarned(b=>({...b,assessment:true})); setTab("results");
  };

  const buildPrompt = () => {
    const sc=rd?"Resilience: "+rd.pct+"/100 ("+getTier(rd.pct).label+")":"Assessment not yet completed";
    const sk=rd?Object.entries(rd.skills).map(([k,v])=>k+": "+v).join(", "):"";
    if(lang==="en") return "You are a warm expert coach for the Resilience pillar of Ingenium's Character Aarc program. Resilience asks: What sustains me through difficulty? Tagline: Resilience is not bouncing back - it is growing forward. Student score: "+sc+(sk?". Skills: "+sk:"")+". Scores are for self-reflection only and never tied to credentials. Score tiers: Development Opportunity (0-29), Below Average (30-54), Above Average (55-74), Leadership (75-89), Outlier (90-100). For Outlier scores gently invite reflection. SMART Goal Coaching: When asked, guide step-by-step through Specific, Measurable, Achievable, Relevant, Time-bound - one question at a time. Be concise (3-4 sentences), warm, practical.";
    return "Eres coach del pilar Resiliencia del programa Character Aarc de Ingenium. Puntaje: "+sc+(sk?". Habilidades: "+sk:"")+". Para metas SMART guia paso a paso. Se conciso, calido y practico.";
  };

  const openCoach = () => {
    if(messages.length===0){
      const sc=rd?"Your score is "+rd.pct+"/100 ("+getTier(rd.pct).label+") - a starting point for reflection, not a grade.":"Complete the assessment first for personalised insights!";
      const msg=lang==="en"?"Hi! I am your Resilience coach. Resilience is not bouncing back - it is growing forward. "+sc+" I can help you reflect and set a SMART goal. What would you like to explore?":"Hola! Soy tu coach de Resiliencia. "+sc+" Que te gustaria explorar?";
      setMessages([{role:"assistant",content:msg}]);
    }
    setTab("coach");
  };

  const sendMsg = async input => {
    const content=input||chatInput;
    if(!content.trim()||chatLoading) return;
    const um={role:"user",content};
    const next=[...messages,um];
    setMessages(next); setChatInput(""); setChatLoading(true);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:buildPrompt(),messages:next.map(m=>({role:m.role,content:m.content}))})});
      const data=await res.json();
      if(!res.ok) setMessages([...next,{role:"assistant",content:"Error: "+(data?.error?.message||"Could not connect")}]);
      else setMessages([...next,{role:"assistant",content:data.content?data.content.map(b=>b.text||"").join(""):"..."}]);
    } catch(e){ setMessages([...next,{role:"assistant",content:"Network error: "+e.message}]); }
    setChatLoading(false);
  };

  const answered     = shuffled.filter(x=>answers[x.id]!==undefined).length;
  const progPct      = shuffled.length>0?Math.round((answered/shuffled.length)*100):0;
  const SMART_PROMPTS= lang==="en"?["Help me set a SMART goal","What does my score mean?","Where should I focus first?"]:["Ayudame con una meta SMART","Que significa mi puntaje?","Donde debo enfocarme?"];

  const card ={background:"#fff",borderRadius:18,padding:mobile?18:26,marginBottom:16,border:"1px solid #f0dede",boxShadow:"0 2px 16px rgba(192,57,43,.06)"};
  const btnPri={fontFamily:"Georgia,serif",background:GRAD,color:"#fff",border:"none",borderRadius:12,padding:"13px 22px",cursor:"pointer",fontSize:14,fontWeight:700,width:"100%",boxShadow:"0 4px 16px rgba(192,57,43,.32)"};
  const btnOut={fontFamily:"Georgia,serif",background:"transparent",color:RC,border:"2px solid "+RC,borderRadius:10,padding:"9px 18px",cursor:"pointer",fontSize:13,fontWeight:700};
  const btnSm ={fontFamily:"Georgia,serif",background:GRAD,color:"#fff",border:"none",borderRadius:9,padding:"10px 18px",cursor:"pointer",fontSize:13,fontWeight:700};
  const inpSt ={fontFamily:"Georgia,serif",width:"100%",border:"1.5px solid #e8d8d8",borderRadius:10,padding:"11px 14px",fontSize:14,outline:"none",boxSizing:"border-box",background:"#fdf8f8",color:"#07071a"};
  const tabBtn=k=>({fontFamily:"Georgia,serif",background:tab===k?"#fff":"rgba(255,255,255,.2)",color:tab===k?RC:"#fff",border:"none",borderRadius:"8px 8px 0 0",padding:mobile?"7px 10px":"9px 18px",cursor:"pointer",fontSize:mobile?11:13,fontWeight:tab===k?700:500,transition:"all .18s",whiteSpace:"nowrap"});

  return (
    <div style={{ fontFamily:"Georgia,serif", minHeight:"100vh", background:"#fdf8f8" }}>
      <style>{STYLES}</style>

      {showCert && rd && <Certificate user={user} result={rd} lang={lang} onClose={()=>setShowCert(false)} />}

      <div style={{ background:GRAD, position:"sticky", top:0, zIndex:20, boxShadow:"0 4px 24px rgba(192,57,43,.4)" }}>
        <div style={{ maxWidth:740, margin:"0 auto", padding:"0 "+(mobile?14:24)+"px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:14, paddingBottom:mobile?10:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <button onClick={onBack} style={{ fontFamily:"Georgia,serif", background:"rgba(255,255,255,.2)", border:"none", borderRadius:8, padding:"5px 12px", color:"#fff", cursor:"pointer", fontSize:12 }}>{lang==="en"?"Back":"Atras"}</button>
              <span style={{ fontSize:22 }}>🔥</span>
              <div>
                <div style={{ fontSize:mobile?15:17, fontWeight:700, color:"#fff" }}>{lang==="en"?"Resilience":"Resiliencia"}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.8)" }}>{lang==="en"?"What sustains me through difficulty?":"Que me sostiene en la dificultad?"}</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              {rd&&<div style={{ background:"rgba(255,255,255,.22)", borderRadius:10, padding:"5px 12px", color:"#fff", fontSize:12, fontWeight:600 }}>Score: {rd.pct}</div>}
              <button onClick={()=>setLang(l=>l==="en"?"es":"en")} style={{ fontFamily:"Georgia,serif", background:"rgba(255,255,255,.2)", border:"none", borderRadius:16, padding:"4px 11px", cursor:"pointer", fontSize:11, color:"#fff", fontWeight:600 }}>{lang==="en"?"ES":"EN"}</button>
            </div>
          </div>
          <div style={{ display:"flex", gap:3, overflowX:"auto" }}>
            {[["overview","🏠",lang==="en"?"Overview":"Inicio"],["assess","📋",lang==="en"?"Assessment":"Evaluacion"],["coach","🤖","Coach"],["credentials","🏅",lang==="en"?"Credentials":"Credenciales"]].map(([k,ic,lbl])=>(
              <button key={k} onClick={()=>k==="assess"?goToIntro():k==="coach"?openCoach():setTab(k)} style={tabBtn(k)}>{ic} {lbl}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:740, margin:"0 auto", padding:"24px "+(mobile?14:24)+"px" }}>

        {/* OVERVIEW */}
        {tab==="overview" && (
          <div className="fu">
            <div style={{ ...card, background:"linear-gradient(135deg,#e0403012,#fff)", borderLeft:"5px solid "+RC }}>
              <div style={{ fontSize:11, letterSpacing:3, color:RC, textTransform:"uppercase", marginBottom:6 }}>Character Aarc - Resilience Pillar</div>
              <div style={{ fontSize:mobile?20:26, fontWeight:700, color:"#07071a", lineHeight:1.2, marginBottom:8 }}>{lang==="en"?"What sustains me through difficulty?":"Que me sostiene en la dificultad?"}</div>
              <div style={{ fontSize:14, color:"#666", fontStyle:"italic", lineHeight:1.7, marginBottom:14 }}>{lang==="en"?"Resilience is not bouncing back - it is growing forward.":"La resiliencia no es rebotar, es crecer hacia adelante."}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {SKILLS.map(sk=><div key={sk} style={{ fontSize:11, padding:"4px 12px", borderRadius:20, background:RC+"0e", color:RC, fontWeight:600, border:"1px solid "+RC+"20" }}>{sk}</div>)}
              </div>
            </div>
            {rd?(
              <div style={{ ...card, background:"linear-gradient(135deg,"+RC+"10,#fff)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, marginBottom:3 }}>{lang==="en"?"Your Reflection Score":"Tu Puntaje de Reflexion"}</div>
                    <div style={{ fontSize:11, color:"#999", fontStyle:"italic" }}>{lang==="en"?"For self-reflection only - not tied to credentials":"Solo para tu reflexion"}</div>
                  </div>
                  <div style={{ fontSize:38, fontWeight:700, color:RC }}>{rd.pct}<span style={{ fontSize:16, color:"#aaa" }}>/100</span></div>
                </div>
                <Bar pct={rd.pct} h={7} />
                <div style={{ marginTop:14 }}><TierBadge pct={rd.pct} lang={lang} showNote={true} /></div>
              </div>
            ):(
              <div style={{ ...card, textAlign:"center", padding:"30px 24px" }}>
                <div style={{ fontSize:44, marginBottom:10 }}>📋</div>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>{lang==="en"?"Ready to discover your Resilience profile?":"Listo para descubrir tu perfil?"}</div>
                <div style={{ fontSize:13, color:"#888", marginBottom:18 }}>30 {lang==="en"?"questions - ~8 minutes":"preguntas - ~8 minutos"}</div>
                <button style={{ ...btnPri, width:"auto", padding:"13px 36px" }} onClick={goToIntro}>{lang==="en"?"Start Assessment":"Comenzar Evaluacion"} →</button>
              </div>
            )}
            <div style={{ display:"grid", gridTemplateColumns:mobile?"1fr":"1fr 1fr", gap:12 }}>
              <button style={btnPri} onClick={goToIntro}>{rd?(lang==="en"?"Retake Assessment":"Repetir"):(lang==="en"?"Start Assessment":"Comenzar")}</button>
              <button style={{ ...btnPri, background:"linear-gradient(135deg,#1a35d4,#0d1f8a)" }} onClick={openCoach}>{lang==="en"?"Talk to Your Coach":"Habla con tu Coach"} 🤖</button>
            </div>
          </div>
        )}

        {/* INTRO */}
        {tab==="intro" && (
          <div className="fu">
            <div style={{ ...card, background:"linear-gradient(135deg,#e0403008,#fff)", borderLeft:"5px solid "+RC }}>
              <div style={{ textAlign:"center", marginBottom:24 }}>
                <div style={{ fontSize:52, marginBottom:12 }}>🔥</div>
                <div style={{ fontSize:11, letterSpacing:3, color:RC, textTransform:"uppercase", marginBottom:8 }}>Character Aarc - Resilience Pillar</div>
                <div style={{ fontSize:mobile?22:28, fontWeight:700, color:"#07071a", marginBottom:8 }}>{lang==="en"?"What sustains me through difficulty?":"Que me sostiene en la dificultad?"}</div>
                <div style={{ fontSize:14, color:"#666", fontStyle:"italic", lineHeight:1.7 }}>{lang==="en"?"Resilience is not bouncing back - it is growing forward.":"La resiliencia no es rebotar, es crecer hacia adelante."}</div>
              </div>

              <div style={{ background:"#fdf5f5", borderRadius:14, padding:"18px 20px", marginBottom:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#07071a", marginBottom:14 }}>{lang==="en"?"You will explore 5 skills:":"Exploraras 5 habilidades:"}</div>
                {SKILLS.map((sk,i)=>(
                  <div key={sk} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                    <div style={{ width:26, height:26, borderRadius:8, background:GRAD, color:"#fff", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</div>
                    <span style={{ fontSize:13, color:"#07071a" }}>{sk}</span>
                  </div>
                ))}
              </div>

              <div style={{ background:"linear-gradient(135deg,#1a35d408,#fff)", borderRadius:14, padding:"18px 20px", border:"1px solid #1a35d420", marginBottom:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#07071a", marginBottom:14 }}>{lang==="en"?"What you will earn:":"Lo que obtienes:"}</div>
                {[
                  { icon:"🔥", text:lang==="en"?"Flame Keeper badge for completing this assessment":"Insignia Guardian de la Llama" },
                  { icon:"🏅", text:lang==="en"?"Professionalism - NACE Career Readiness Credential":"Credencial NACE: Profesionalismo" },
                  { icon:"📄", text:lang==="en"?"Character Aarc Resilience Certificate (downloadable)":"Certificado de Resiliencia Character Aarc (descargable)" },
                ].map((item,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:i<2?10:0 }}>
                    <span style={{ fontSize:20, flexShrink:0 }}>{item.icon}</span>
                    <span style={{ fontSize:13, color:"#555" }}>{item.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ textAlign:"center", fontSize:12, color:"#aaa", marginBottom:20 }}>
                {lang==="en"?"30 questions - approximately 8 minutes":"30 preguntas - aproximadamente 8 minutos"}
              </div>

              <div style={{ display:"flex", gap:12 }}>
                <button style={{ ...btnOut, flex:1 }} onClick={()=>setTab("overview")}>{lang==="en"?"Back":"Volver"}</button>
                <button style={{ ...btnPri, flex:2, marginTop:0 }} onClick={beginQuestions}>{lang==="en"?"Begin Assessment":"Comenzar Evaluacion"} →</button>
              </div>
            </div>
          </div>
        )}

        {/* ASSESSMENT */}
        {tab==="assess" && shuffled.length>0 && (
          <div className="fu">
            <div style={{ ...card, padding:"16px 20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div style={{ fontSize:12, color:"#999" }}>{answered} {lang==="en"?"of":"de"} {shuffled.length} {lang==="en"?"answered":"respondidas"}</div>
                <div style={{ fontSize:20, fontWeight:700, color:RC }}>{progPct}%</div>
              </div>
              <Bar pct={progPct} h={7} />
            </div>
            <div key={currentQ} style={{ ...card, border:"1px solid "+RC+"28" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div style={{ fontSize:11, color:"#aaa", letterSpacing:2, textTransform:"uppercase" }}>{lang==="en"?"Question":"Pregunta"} {currentQ+1} {lang==="en"?"of":"de"} {shuffled.length}</div>
                <div style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:RC+"12", color:RC, fontWeight:600 }}>{shuffled[currentQ].skill}</div>
              </div>
              <div style={{ fontSize:mobile?15:17, fontWeight:600, color:"#07071a", lineHeight:1.75, marginBottom:20 }}>{shuffled[currentQ].text}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                {FREQ.map((f,idx)=>{ const sel=answers[shuffled[currentQ].id]===idx; return (
                  <button key={idx} onClick={()=>setAnswers(a=>({...a,[shuffled[currentQ].id]:idx}))} style={{ fontFamily:"Georgia,serif", textAlign:"left", padding:"12px 18px", borderRadius:11, border:sel?"2px solid "+RC:"1px solid #edd8d8", background:sel?RC+"14":"#fff", color:sel?RC:"#07071a", cursor:"pointer", fontSize:14, fontWeight:sel?700:400, transition:"all .14s" }}>
                    {lang==="en"?f.label:f.labelEs}
                  </button>
                ); })}
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ ...btnOut, opacity:currentQ===0?.4:1 }} onClick={()=>currentQ>0&&setCurrentQ(q=>q-1)}>← {lang==="en"?"Prev":"Ant."}</button>
              <button style={btnOut} onClick={()=>setTab("overview")}>{lang==="en"?"Save & Exit":"Guardar"}</button>
              {currentQ<shuffled.length-1
                ?<button style={btnSm} onClick={()=>setCurrentQ(q=>q+1)}>{lang==="en"?"Next":"Sig."} →</button>
                :<button style={{ ...btnSm, opacity:answered<shuffled.length?.55:1 }} onClick={answered>=shuffled.length?submitAssess:undefined}>{lang==="en"?"Submit":"Enviar"} ✓</button>
              }
            </div>
          </div>
        )}

        {/* RESULTS */}
        {tab==="results" && rd && (
          <div className="fu">
            <div style={{ ...card, textAlign:"center", background:"linear-gradient(135deg,"+RC+"14,#fff)", border:"1px solid "+RC+"28" }}>
              <div className="pop" style={{ fontSize:58, marginBottom:4 }}>✅</div>
              <div style={{ fontSize:11, letterSpacing:3, color:RC, textTransform:"uppercase", marginTop:6 }}>Resilience - {lang==="en"?"Reflection Score":"Puntaje de Reflexion"}</div>
              <div className="pop" style={{ fontSize:mobile?60:76, fontWeight:700, color:RC, lineHeight:1, margin:"10px 0", animationDelay:".1s" }}>
                {rd.pct}<span style={{ fontSize:22, color:"#bbb" }}>/100</span>
              </div>
              <div style={{ fontSize:11, color:"#aaa", fontStyle:"italic", marginBottom:14 }}>{lang==="en"?"For your reflection - not a grade":"Para tu reflexion - no es una calificacion"}</div>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}><TierBadge pct={rd.pct} lang={lang} showNote={true} /></div>
            </div>
            <div style={card}>
              <div style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>{lang==="en"?"Skill Breakdown":"Desglose de Habilidades"}</div>
              {Object.entries(rd.skills).map(([sk,pct])=>(
                <div key={sk} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                    <span style={{ fontSize:13, fontWeight:600 }}>{sk}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}><TierBadge pct={pct} lang={lang} /><span style={{ fontSize:14, fontWeight:700, color:RC }}>{pct}</span></div>
                  </div>
                  <Bar pct={pct} h={6} />
                </div>
              ))}
            </div>
            <div style={{ ...card, background:"linear-gradient(135deg,#e04030,#7d2618)", border:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ fontSize:36 }}>📄</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:4 }}>{lang==="en"?"Your certificate is ready":"Tu certificado esta listo"}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,.8)", lineHeight:1.6 }}>{lang==="en"?"Download or print your Resilience Certificate to share your achievement.":"Descarga o imprime tu Certificado de Resiliencia."}</div>
                </div>
                <button onClick={()=>setShowCert(true)} style={{ fontFamily:"Georgia,serif", background:"rgba(255,255,255,.2)", color:"#fff", border:"1.5px solid rgba(255,255,255,.4)", borderRadius:10, padding:"10px 18px", cursor:"pointer", fontSize:13, fontWeight:700, whiteSpace:"nowrap" }}>
                  {lang==="en"?"View Certificate":"Ver Certificado"} 📄
                </button>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <button style={btnOut} onClick={goToIntro}>{lang==="en"?"Retake":"Repetir"}</button>
              <button style={btnPri} onClick={openCoach}>{lang==="en"?"Talk to Coach":"Hablar con Coach"} 🤖</button>
            </div>
          </div>
        )}

        {/* COACH */}
        {tab==="coach" && (
          <div className="fu" style={card}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{ width:46, height:46, borderRadius:14, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🤖</div>
              <div>
                <div style={{ fontSize:16, fontWeight:700 }}>{lang==="en"?"Resilience Coach":"Coach de Resiliencia"}</div>
                <div style={{ fontSize:12, color:"#999" }}>{lang==="en"?"Reflection and SMART goal support":"Reflexion y apoyo con metas SMART"}</div>
              </div>
              {rd&&<div style={{ marginLeft:"auto" }}><TierBadge pct={rd.pct} lang={lang} /></div>}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
              {SMART_PROMPTS.map((p,i)=>(
                <button key={i} onClick={()=>sendMsg(p)} style={{ fontFamily:"Georgia,serif", background:RC+"10", color:RC, border:"1px solid "+RC+"28", borderRadius:20, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:600 }}>{p}</button>
              ))}
            </div>
            <div style={{ height:340, overflowY:"auto", background:"#fdf5f5", borderRadius:14, padding:14, marginBottom:12, display:"flex", flexDirection:"column", gap:10 }}>
              {messages.length===0&&<div style={{ textAlign:"center", color:"#ccc", fontSize:13, marginTop:60 }}>{lang==="en"?"Tap a prompt above or type to start...":"Toca un prompt o escribe para comenzar..."}</div>}
              {messages.map((m,i)=>(
                <div key={i} style={{ alignSelf:m.role==="user"?"flex-end":"flex-start", background:m.role==="user"?GRAD:"#fff", color:m.role==="user"?"#fff":"#07071a", borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"11px 16px", maxWidth:"80%", fontSize:14, lineHeight:1.7, boxShadow:"0 2px 8px rgba(192,57,43,.09)" }}>{m.content}</div>
              ))}
              {chatLoading&&<div style={{ alignSelf:"flex-start", background:"#fff", borderRadius:"18px 18px 18px 4px", padding:"12px 16px", display:"flex", gap:6 }}>
                {[0,1,2].map(i=><div key={i} style={{ width:8, height:8, borderRadius:"50%", background:RC, animation:"pulse .9s ease-in-out infinite", animationDelay:(i*.2)+"s" }} />)}
              </div>}
              <div ref={chatEndRef} />
            </div>
            <div style={{ display:"flex", gap:10, marginBottom:12 }}>
              <input style={{ ...inpSt, flex:1 }} placeholder={lang==="en"?"Ask your Resilience coach...":"Pregunta a tu coach..."} value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} />
              <button style={btnSm} onClick={()=>sendMsg()}>{lang==="en"?"Send":"Enviar"}</button>
            </div>
            {goalDone?(
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:12, background:"#e8f5e9", border:"1px solid #a5d6a7" }}>
                <span style={{ fontSize:22 }}>🎯</span>
                <span style={{ fontSize:13, fontWeight:700, color:"#2e7d32" }}>{lang==="en"?"SMART goal completed - Goal Maker badge earned!":"Meta SMART completada - Insignia obtenida!"}</span>
              </div>
            ):userMsgCount>=2?(
              <div style={{ padding:"14px 16px", borderRadius:12, background:"#fff8e1", border:"1px solid #ffe082" }}>
                <div style={{ fontSize:12, color:"#8a6800", marginBottom:10, lineHeight:1.6 }}>{lang==="en"?"Once you have set a SMART goal with your coach, mark it complete below.":"Una vez que hayas establecido una meta SMART, marcala completa abajo."}</div>
                <button onClick={()=>{setGoalDone(true);setBadgesEarned(b=>({...b,goal:true}));}} style={{ fontFamily:"Georgia,serif", background:"linear-gradient(135deg,#f39c12,#e67e22)", color:"#fff", border:"none", borderRadius:10, padding:"10px 20px", cursor:"pointer", fontSize:13, fontWeight:700 }}>🎯 {lang==="en"?"Mark SMART goal complete":"Marcar meta SMART completa"}</button>
              </div>
            ):(
              <div style={{ padding:"11px 16px", borderRadius:12, background:"#f5f5f5", border:"1px solid #e0e0e0", fontSize:12, color:"#999", textAlign:"center" }}>{lang==="en"?"Chat with your coach to set a SMART goal, then mark it complete for your badge.":"Chatea con tu coach para establecer una meta SMART y ganar tu insignia."}</div>
            )}
          </div>
        )}

        {/* CREDENTIALS */}
        {tab==="credentials" && (
          <div className="fu">
            <div style={{ ...card, textAlign:"center", background:"linear-gradient(135deg,"+RC+"0e,#fff)" }}>
              <div style={{ fontSize:38, marginBottom:8 }}>🏅</div>
              <div style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>{lang==="en"?"Resilience Credentials":"Credenciales de Resiliencia"}</div>
              <div style={{ fontSize:13, color:"#888" }}>{lang==="en"?"Earned through effort - never through scores":"Ganadas por esfuerzo, nunca por puntaje"}</div>
            </div>

            <div style={{ ...card, background:"#fffbf0", border:"1px solid #ffe0a0", fontSize:13, color:"#8a6500", lineHeight:1.7 }}>
              {lang==="en"?"Each badge recognises a genuine act of effort: showing up, reflecting, and committing to growth.":"Cada insignia reconoce un acto genuino de esfuerzo: presentarte, reflexionar y comprometerte con el crecimiento."}
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {BADGES.map(b=>{ const earned=b.key==="assessment"?badgesEarned.assessment:b.key==="coaching"?badgesEarned.coaching:badgesEarned.goal||false; return (
                <div key={b.key} style={{ display:"flex", alignItems:"center", gap:16, padding:"18px 20px", borderRadius:16, background:earned?"linear-gradient(135deg,"+RC+"0e,#fff)":"#faf5f5", border:earned?"1px solid "+RC+"28":"1px solid #ecdcdc" }}>
                  <div style={{ fontSize:36, filter:earned?"none":"grayscale(1) opacity(.35)" }}>{b.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:earned?"#07071a":"#bbb", marginBottom:3 }}>{lang==="en"?b.name:b.nameEs} {earned?"✓":"🔒"}</div>
                    <div style={{ fontSize:12, color:"#888", marginBottom:4 }}>{lang==="en"?b.desc:b.descEs}</div>
                    {!earned&&<div style={{ fontSize:11, color:"#aaa", fontStyle:"italic" }}>{lang==="en"?"How to earn: "+b.how:"Como obtener: "+b.howEs}</div>}
                  </div>
                  {earned&&<div style={{ fontSize:11, padding:"5px 14px", borderRadius:20, background:GRAD, color:"#fff", fontWeight:700, whiteSpace:"nowrap" }}>{lang==="en"?"Earned":"Obtenida"}</div>}
                </div>
              ); })}
            </div>

            {/* Certificate card */}
            {rd ? (
              <div style={{ ...card, marginTop:4, background:GRAD, border:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
                  <div style={{ fontSize:36 }}>📄</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:4 }}>{lang==="en"?"Resilience Certificate":"Certificado de Resiliencia"}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.8)", lineHeight:1.6 }}>{lang==="en"?"Your personalised certificate is ready. Download it, print it, or share it.":"Tu certificado personalizado esta listo. Descargalo, imprimelo o compartelo."}</div>
                  </div>
                  <button onClick={()=>setShowCert(true)} style={{ fontFamily:"Georgia,serif", background:"rgba(255,255,255,.2)", color:"#fff", border:"1.5px solid rgba(255,255,255,.4)", borderRadius:10, padding:"10px 18px", cursor:"pointer", fontSize:13, fontWeight:700, whiteSpace:"nowrap" }}>
                    {lang==="en"?"View & Download":"Ver y Descargar"} →
                  </button>
                </div>
              </div>
            ):(
              <div style={{ ...card, marginTop:4, background:"#f4f1fc", border:"1px solid #dbd4f0", textAlign:"center", opacity:.6 }}>
                <div style={{ fontSize:28, marginBottom:8 }}>📄</div>
                <div style={{ fontSize:14, fontWeight:700, color:"#aaa", marginBottom:4 }}>{lang==="en"?"Resilience Certificate":"Certificado de Resiliencia"}</div>
                <div style={{ fontSize:12, color:"#bbb" }}>{lang==="en"?"Complete the assessment to unlock your certificate":"Completa la evaluacion para desbloquear tu certificado"}</div>
              </div>
            )}

            {/* NACE */}
            <div style={{ ...card, background:"linear-gradient(135deg,"+RC+"06,#fff)" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#07071a", marginBottom:4 }}>{lang==="en"?"NACE Career Readiness Credential":"Credencial NACE de Preparacion Profesional"}</div>
              <div style={{ fontSize:11, color:"#888", fontStyle:"italic", marginBottom:14, lineHeight:1.6 }}>{lang==="en"?"Mapped to the NACE framework used by universities and employers across the US.":"Corresponde al marco NACE utilizado por universidades y empleadores."}</div>
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderRadius:14, background:rd?"linear-gradient(135deg,"+RC+"0e,#fff)":"#f4f1fc", border:rd?"1px solid "+RC+"30":"1px solid #dbd4f0" }}>
                <div style={{ fontSize:30, filter:rd?"none":"grayscale(1) opacity(.35)" }}>🏅</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:rd?RC:"#aaa", display:"inline-block", padding:"4px 13px", borderRadius:20, background:rd?RC+"14":"#ebebeb", border:"1px solid "+(rd?RC+"30":"#ddd") }}>
                    Professionalism {rd?"✓":"🔒"}
                  </div>
                  {!rd&&<div style={{ fontSize:11, color:"#aaa", fontStyle:"italic", marginTop:6 }}>{lang==="en"?"Complete the assessment to unlock":"Completa la evaluacion para desbloquear"}</div>}
                </div>
                {rd&&<div style={{ fontSize:10, padding:"5px 13px", borderRadius:20, background:GRAD, color:"#fff", fontWeight:700, whiteSpace:"nowrap" }}>Awarded</div>}
              </div>
            </div>

            {/* Career & Self Development */}
            <div style={{ padding:"18px 20px", borderRadius:16, background:"#f4f1fc", border:"1px solid #dbd4f0", display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ fontSize:36, filter:"grayscale(1) opacity(.35)" }}>🎓</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#aaa", marginBottom:3 }}>Career & Self Development 🔒</div>
                <div style={{ fontSize:12, color:"#bbb", marginBottom:4, lineHeight:1.6 }}>{lang==="en"?"The overarching NACE competency - awarded when all four AARC pillars are complete.":"La competencia NACE global - otorgada al completar los cuatro pilares AARC."}</div>
                <div style={{ fontSize:11, color:"#bbb", fontStyle:"italic" }}>{lang==="en"?"Demo: 1/4 pillars available":"Demo: 1/4 pilares disponibles"}</div>
              </div>
            </div>

            {!rd&&<button style={{ ...btnPri, marginTop:4 }} onClick={goToIntro}>{lang==="en"?"Start Assessment to Unlock":"Comenzar Evaluacion para Desbloquear"} →</button>}
          </div>
        )}

        <div style={{ textAlign:"center", marginTop:28, paddingBottom:10 }}>
          <div style={{ fontSize:11, color:"#ccc", letterSpacing:2, textTransform:"uppercase", marginBottom:3 }}>Ingenium · Character Aarc</div>
          <div style={{ fontSize:11, color:"#ddd", fontStyle:"italic" }}>{lang==="en"?"Developing Human-Centred Graduates":"Formando Graduados Centrados en las Personas"}</div>
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang]                       = useState("en");
  const [page, setPage]                       = useState("splash");
  const [user, setUser]                       = useState(null);
  const [resilienceScore, setResilienceScore] = useState(null);
  const [badgesEarned, setBadgesEarned]       = useState({ assessment:false, coaching:false, goal:false });

  const handleLogin = (form, isUp) => {
    if (!form.email || !form.password) return;
    if (isUp) USER_STORE[form.email] = { name: form.name || form.email.split("@")[0], university: form.university || "My University" };
    const stored = USER_STORE[form.email];
    const name       = (stored&&stored.name)       || form.name || form.email.split("@")[0];
    const university = (stored&&stored.university) || "My University";
    setUser({ name, email:form.email, university });
    setPage("dashboard");
  };

  if (page==="splash")      return <SplashScreen lang={lang} setLang={setLang} onContinue={()=>setPage("login")} />;
  if (page==="login")       return <LoginScreen lang={lang} setLang={setLang} onLogin={handleLogin} />;
  if (page==="resilience")  return <ResilienceHub user={user} lang={lang} setLang={setLang} onBack={()=>setPage("dashboard")} resilienceScore={resilienceScore} setResilienceScore={setResilienceScore} badgesEarned={badgesEarned} setBadgesEarned={setBadgesEarned} />;
  return <DashboardScreen user={user} lang={lang} setLang={setLang} resilienceScore={resilienceScore} badgesEarned={badgesEarned} onEnter={()=>setPage("resilience")} onLogout={()=>{setUser(null);setPage("splash");}} />;
}
