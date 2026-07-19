import { useState, useEffect, useRef } from "react";
import { Flame, Search, Zap, Users, Award, MessageCircle, Target, Sprout, TrendingUp, Star, Trophy, Microscope, Lock, Bot, ClipboardList, Home, CheckCircle, FileText, GraduationCap } from "lucide-react";

// Demo mode switch: when true, only Agency is unlocked; the other 3 pillars show locked on Dashboard/Splash
const IS_DEMO_MODE = true;

const QUESTIONS = [
  { id:"IN1",  text:"I __________ wait for someone to tell me what to do next on a team project.", skill:"Initiative", inverse:true },
  { id:"IN2",  text:"I __________ look for problems that need fixing before they are pointed out to me.", skill:"Initiative", inverse:false },
  { id:"IN3",  text:"I __________ start working on optional learning modules outside of my required classes.", skill:"Initiative", inverse:false },
  { id:"IN4",  text:"I __________ hesitate to take on extra responsibilities even if I have spare time.", skill:"Initiative", inverse:true },
  { id:"IN5",  text:"I __________ propose new ideas or workflows during team brainstorming sessions.", skill:"Initiative", inverse:false },
  { id:"IN6",  text:"I __________ prefer tasks where the exact directions are already mapped out for me.", skill:"Initiative", inverse:true },

  { id:"AD1",  text:"When a project specification changes midway, I __________ get frustrated and slow down.", skill:"Adaptability", inverse:true },
  { id:"AD2",  text:"I __________ adjust my working style easily when joining a brand new development team.", skill:"Adaptability", inverse:false },
  { id:"AD3",  text:"I __________ struggle to learn new software tools or frameworks if they feel unfamiliar.", skill:"Adaptability", inverse:true },
  { id:"AD4",  text:"I __________ treat unexpected project roadblocks as opportunities to learn something new.", skill:"Adaptability", inverse:false },
  { id:"AD5",  text:"When my initial engineering assumption is proven wrong, I __________ pivot without delay.", skill:"Adaptability", inverse:false },
  { id:"AD6",  text:"I __________ feel uncomfortable when forced to work with ambiguous or incomplete data.", skill:"Adaptability", inverse:true },

  { id:"LC1",  text:"My career success is __________ going to be the direct result of good luck or timing.", skill:"Locus of Control", inverse:true },
  { id:"LC2",  text:"I __________ believe that my personal work ethic determines my performance outcomes.", skill:"Locus of Control", inverse:false },
  { id:"LC3",  text:"When a team project fails, I __________ blame the circumstances rather than my choices.", skill:"Locus of Control", inverse:true },
  { id:"LC4",  text:"I __________ feel in complete control over my academic path and career development.", skill:"Locus of Control", inverse:false },
  { id:"LC5",  text:"I __________ believe that hard work can overcome a lack of natural technical talent.", skill:"Locus of Control", inverse:false },
  { id:"LC6",  text:"I __________ feel like an outside force is dictating how my group assignments turn out.", skill:"Locus of Control", inverse:true },

  { id:"IT1",  text:"I __________ accept a professor's technical statement without verifying the logic myself.", skill:"Independent Thinking", inverse:true },
  { id:"IT2",  text:"I __________ research alternative perspectives before making a final design decision.", skill:"Independent Thinking", inverse:false },
  { id:"IT3",  text:"I __________ conform to the popular opinion of the group just to avoid configuration arguments.", skill:"Independent Thinking", inverse:true },
  { id:"IT4",  text:"I __________ cross-reference code solutions instead of copying them blindly from the web.", skill:"Independent Thinking", inverse:false },
  { id:"IT5",  text:"I __________ formulate my own unique critiques regarding engineering ethics or design patterns.", skill:"Independent Thinking", inverse:false },
  { id:"IT6",  text:"I __________ find it difficult to defend an unpopular stance during an architectural review.", skill:"Independent Thinking", inverse:true },

  { id:"GO1",  text:"I __________ set concrete milestone targets for my personal development projects.", skill:"Goal Orientation", inverse:false },
  { id:"GO2",  text:"I __________ struggle to see how my daily coursework connects to my long-term career path.", skill:"Goal Orientation", inverse:true },
  { id:"GO3",  text:"I __________ track my progress periodically when working toward a professional certification.", skill:"Goal Orientation", inverse:false },
  { id:"GO4",  text:"I __________ abandon my personal self-improvement targets within a couple of weeks.", skill:"Goal Orientation", inverse:true },
  { id:"GO5",  text:"I __________ build structured, daily execution schedules to handle heavy project loads.", skill:"Goal Orientation", inverse:false },
  { id:"GO6",  text:"I __________ wait until graduation deadlines approach before thinking about my portfolio.", skill:"Goal Orientation", inverse:true }
];

const FREQ = [
  { label:"Never",     labelEs:"Nunca",      pos:1,  inv:10 },
  { label:"Rarely",    labelEs:"Raramente",  pos:2,  inv:7  },
  { label:"Sometimes", labelEs:"A veces",    pos:4,  inv:4  },
  { label:"Often",     labelEs:"Seguido",    pos:7,  inv:2  },
  { label:"Always",    labelEs:"Siempre",    pos:10, inv:1  },
];

const BADGES = [
  { key:"assessment", name:"Catalyst Mindset",  nameEs:"Mente Catalizadora",    Icon:Zap,           desc:"Completed the Agency baseline assessment",       descEs:"Completaste la evaluacion de Agencia",   how:"Complete the 30-question assessment",           howEs:"Completa la evaluacion de 30 preguntas"       },
  { key:"coaching",   name:"Autonomy Seeker",   nameEs:"Buscador de Autonomia", Icon:MessageCircle, desc:"Had a strategic career alignment conversation", descEs:"Tuviste una conversacion estrategica",    how:"Exchange at least 3 messages with your coach",  howEs:"Intercambia al menos 3 mensajes con tu coach" },
  { key:"goal",       name:"Action Taker",      nameEs:"Forjador de Accion",    Icon:Target,        desc:"Committed to a tactical agency SMART goal",      descEs:"Estableciste una meta SMART de accion",  how:"Set a SMART goal and mark it complete",         howEs:"Establece una meta SMART y marcala completa"  },
];

const SKILLS = ["Initiative","Adaptability","Locus of Control","Independent Thinking","Goal Orientation"];

const TIERS = [
  { label:"Development Opportunity", labelEs:"Oportunidad de Desarrollo", min:0,   max:29.99, color:"#e74c3c", Icon:Sprout,     note:"This is an area to step up. Your coach can help you establish immediate project initiative metrics here.", noteEs:"Esta es un area de crecimiento. Tu coach puede ayudarte." },
  { label:"Below Average",           labelEs:"Bajo Promedio",             min:30,  max:54.99, color:"#e67e22", Icon:TrendingUp, note:"You have baseline traction. Defining targeted personal milestone ownership will help build your agency score.", noteEs:"Estas ganando impulso. Una meta SMART puede ayudarte a avanzar." },
  { label:"Above Average",           labelEs:"Sobre Promedio",            min:55,  max:74.99, color:"#27ae60", Icon:Star,       note:"Solid level of personal ownership. Let's design an advanced goal to help push your industry positioning further.", noteEs:"Base solida. Considera una meta SMART." },
  { label:"Leadership",              labelEs:"Liderazgo",                 min:75,  max:89.99, color:"#1a35d4", Icon:Trophy,     note:"Outstanding initiative profile. Think about how you can leverage this drive to direct technical group operations.", noteEs:"Estas liderando el camino." },
  { label:"Outlier",                 labelEs:"Atipico",                   min:90,  max:100,   color:"#8e44ad", Icon:Microscope, note:"Remarkable strategic drive. Ensure this independent mindset balances effectively with cross-functional advice.", noteEs:"Puntaje notable - vale la pena reflexionar." },
];

const ALL_PILLARS = [
  { key:"Awareness",  label:"Awareness",  labelEs:"Conciencia",  Icon:Search, color:"#b026d4", desc:"How well do I know myself?",           descEs:"Que tan bien me conozco?" },
  { key:"Agency",     label:"Agency",     labelEs:"Agencia",     Icon:Zap,    color:"#1a35d4", desc:"What drives me to act?",               descEs:"Que me impulsa a actuar?" },
  { key:"Resilience", label:"Resilience", labelEs:"Resiliencia", Icon:Flame,  color:"#c0392b", desc:"What sustains me through difficulty?", descEs:"Que me sostiene en la dificultad?" },
  { key:"Connection", label:"Connection", labelEs:"Conexion",    Icon:Users,  color:"#0a8a5a", desc:"Who am I for others?",                 descEs:"Quien soy para los demas?" },
];

const USER_STORE = {};

// Agency's pillar color (used for pillar-specific UI inside AgencyHub and its Certificate)
const RC   = "#1a35d4";
const GRAD = "linear-gradient(135deg,#2a4ff0,#0d1f8a)";

// Ingenium brand palette (used for the shell: splash, login, dashboard)
const PLUM   = "#b026d4";
const INDIGO = "#1a35d4";
const BRAND_GRAD = "linear-gradient(135deg,#b026d4,#1a35d4)";
const BRAND_DARK_BG = "linear-gradient(150deg,#07071a 0%,#1a0530 45%,#2a0a6e 100%)";

const FONT = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const getTier  = pct => TIERS.find(t => pct >= t.min && pct <= t.max) || TIERS[0];
const shuffle  = a => [...a].sort(() => Math.random() - 0.5);
const scoreQ   = (idx, inv) => idx == null ? 0 : (inv ? FREQ[idx].inv : FREQ[idx].pos);
const getVerCode = (name, university) => {
  const str = name + university + "Agency" + new Date().getFullYear();
  let hash = 0;
  for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
  return "CA-AGE-" + Math.abs(hash).toString(36).toUpperCase().slice(0, 6);
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

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
        <t.Icon size={13} color={t.color} />
        <span style={{ fontSize:12, fontWeight:700, color:t.color }}>{lang==="en"?t.label:t.labelEs}</span>
      </div>
      {showNote && <div style={{ fontSize:12, color:"#444", marginTop:10, lineHeight:1.7, fontStyle:"italic", padding:"10px 14px", background:t.color+"10", borderRadius:10, borderLeft:"3px solid "+t.color }}>{lang==="en"?t.note:t.noteEs}</div>}
    </div>
  );
}

function Bar({ pct, h, color }) {
  const ht = h || 6;
  const c = color || RC;
  const grad = "linear-gradient(90deg,"+c+","+c+"aa)";
  return (
    <div style={{ height:ht, background:"#f0e8e8", borderRadius:ht, overflow:"hidden" }}>
      <div style={{ width:pct+"%", height:"100%", background:grad, borderRadius:ht, transition:"width .6s" }} />
    </div>
  );
}

// ── Certificate (Agency-specific — uses the pillar's own gradient, not the brand one) ──
function Certificate({ user, result, lang, onClose }) {
  const verCode = getVerCode(user.name, user.university);
  const dateStr = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const handlePrint = () => { window.print(); };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(7,7,26,.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, backdropFilter:"blur(6px)", padding:"20px" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:16, maxWidth:620, width:"100%", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 30px 80px rgba(0,0,0,.45)", display:"flex", flexDirection:"column" }}>
        <div id="cert" style={{ padding:"44px 52px", background:"#fff", position:"relative", overflow:"hidden", fontFamily:FONT }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:6, background:GRAD }} />
          <div style={{ position:"absolute", right:-60, bottom:-60, width:240, height:240, borderRadius:"50%", background:RC+"06", pointerEvents:"none" }} />
          <div style={{ position:"absolute", right:-20, bottom:-20, width:140, height:140, borderRadius:"50%", background:RC+"08", pointerEvents:"none" }} />

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:36 }}>
            <div>
              <div style={{ fontSize:9, letterSpacing:5, color:INDIGO, textTransform:"uppercase", marginBottom:2 }}>Character Aarc</div>
              <div style={{ fontSize:9, letterSpacing:2, color:"#aaa", textTransform:"uppercase" }}>by Ingenium</div>
            </div>
            <Zap size={30} color={RC} />
          </div>

          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ fontSize:10, letterSpacing:6, color:"#aaa", textTransform:"uppercase", marginBottom:20 }}>Certificate of Completion</div>
            <div style={{ fontSize:13, color:"#888", marginBottom:10, fontStyle:"italic" }}>This is to certify that</div>
            <div style={{ fontSize:34, fontWeight:700, color:"#07071a", marginBottom:4, letterSpacing:.5 }}>{user.name}</div>
            <div style={{ fontSize:13, color:"#888", marginBottom:24 }}>{user.university}</div>
            <div style={{ width:64, height:1.5, background:"linear-gradient(90deg,transparent,"+RC+",transparent)", margin:"0 auto 24px" }} />
            <div style={{ fontSize:13, color:"#555", marginBottom:6 }}>has successfully completed the</div>
            <div style={{ fontSize:26, fontWeight:700, color:RC, marginBottom:4 }}>Agency Pillar</div>
            <div style={{ fontSize:13, color:"#555", marginBottom:24, lineHeight:1.7 }}>of the Character Aarc Human Skills Development Program,<br/>demonstrating independent commitment to career readiness and tactical goal structures.</div>

            <div style={{ display:"flex", justifyContent:"center", gap:7, flexWrap:"wrap", marginBottom:24 }}>
              {SKILLS.map(sk => <div key={sk} style={{ fontSize:11, padding:"4px 12px", borderRadius:20, background:RC+"0e", color:RC, border:"1px solid "+RC+"28", fontWeight:600 }}>{sk}</div>)}
            </div>

            <div style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"12px 22px", borderRadius:12, background:"#f4f1fc", border:"1px solid #dbd4f0" }}>
              <Award size={18} color={INDIGO} />
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:9, color:"#888", textTransform:"uppercase", letterSpacing:2, marginBottom:2 }}>NACE Career Readiness Competency</div>
                <div style={{ fontSize:14, fontWeight:700, color:INDIGO }}>Professionalism</div>
              </div>
            </div>
          </div>

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

          <div style={{ textAlign:"center", marginTop:18 }}>
            <div style={{ fontSize:10, color:"#ccc", letterSpacing:1 }}>Verification ID: {verCode}</div>
          </div>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:4, background:GRAD }} />
        </div>

        <div style={{ padding:"16px 20px", borderTop:"1px solid #f0e8e8", display:"flex", gap:10 }}>
          <button onClick={handlePrint} style={{ fontFamily:FONT, background:GRAD, color:"#fff", border:"none", borderRadius:10, padding:"11px 24px", cursor:"pointer", fontSize:13, fontWeight:700, flex:2, boxShadow:"0 4px 14px rgba(26,53,212,.3)" }}>
            {lang==="en"?"Save as PDF / Print":"Guardar como PDF / Imprimir"}
          </button>
          <button onClick={onClose} style={{ fontFamily:FONT, background:"transparent", color:RC, border:"2px solid "+RC, borderRadius:10, padding:"11px 18px", cursor:"pointer", fontSize:13, fontWeight:700, flex:1 }}>
            {lang==="en"?"Close":"Cerrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Splash Screen (app shell — brand plum/indigo) ─────────────────────────────
function SplashScreen({ lang, setLang, onContinue }) {
  const mobile = window.innerWidth < 620;
  return (
    <div style={{ fontFamily:FONT, minHeight:"100vh", background:BRAND_DARK_BG, color:"#fff", display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
      <style>{STYLES}</style>
      {[300,500,700].map((s,i)=><div key={i} style={{ position:"absolute", borderRadius:"50%", border:"1px solid rgba(255,255,255,.05)", width:s, height:s, top:(10+i*15)+"%", left:(-10+i*30)+"%", pointerEvents:"none" }} />)}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px "+(mobile?18:36)+"px", position:"relative", zIndex:1 }}>
        <div style={{ minWidth:0 }}>
          <div style={{ display:"inline-block", fontSize:mobile?14:16, fontWeight:800, letterSpacing:3, paddingLeft:3, paddingRight:3, background:BRAND_GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Ingenium</div>
          <div style={{ fontSize:9, color:"rgba(255,255,255,.45)", letterSpacing:2, paddingLeft:3, whiteSpace:"nowrap" }}>Character Aarc</div>
        </div>
        <button onClick={()=>setLang(l=>l==="en"?"es":"en")} style={{ fontFamily:FONT, background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.15)", borderRadius:20, padding:"5px 14px", cursor:"pointer", fontSize:12, color:"rgba(255,255,255,.7)", flexShrink:0, marginLeft:10 }}>
          {lang==="en"?"Español":"English"}
        </button>
      </div>

      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:mobile?"30px 22px":"40px 36px", textAlign:"center", position:"relative", zIndex:1 }}>
        <div className="fu" style={{ animationDelay:"0s", marginBottom:16 }}>
          <div style={{ display:"inline-block", fontSize:11, letterSpacing:4, color:PLUM, textTransform:"uppercase", padding:"6px 18px", borderRadius:20, border:"1px solid "+PLUM+"50", background:PLUM+"12", marginBottom:20 }}>
            {lang==="en"?"For University Engineering Students":"Para Estudiantes de Ingenieria Universitaria"}
          </div>
          <div style={{ fontSize:mobile?28:44, fontWeight:800, lineHeight:1.2, marginBottom:16, maxWidth:680 }}>
            {lang==="en" ? "Take command of your professional path." : "Toma el control de tu camino profesional."}
          </div>
          <div style={{ fontSize:mobile?14:16, color:"rgba(255,255,255,.65)", lineHeight:1.8, maxWidth:540, marginBottom:32 }}>
            {lang==="en"
              ? "The Agency module tracks initiative, critical judgment, and strategic goals — one part of the four-pillar Character Aarc framework."
              : "El modulo de Agencia evalua la iniciativa, el juicio critico y las metas estrategicas, uno de los cuatro pilares de Character Aarc."}
          </div>
        </div>

        <div className="fu" style={{ animationDelay:".1s", display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, maxWidth:500, width:"100%", marginBottom:32 }}>
          {ALL_PILLARS.map(p=>{
            const isLocked = IS_DEMO_MODE && p.key !== "Agency";
            return (
              <div key={p.key} style={{ background:"rgba(255,255,255,.06)", borderRadius:14, padding:"14px 16px", border:"1px solid rgba(255,255,255,.1)", display:"flex", alignItems:"center", gap:10, textAlign:"left", opacity:isLocked?.55:1 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:p.color+"22", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {isLocked ? <Lock size={16} color={p.color} /> : <p.Icon size={18} color={p.color} />}
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{lang==="en"?p.label:p.labelEs}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", lineHeight:1.4 }}>{lang==="en"?p.desc:p.descEs}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="fu" style={{ animationDelay:".15s", display:"flex", gap:mobile?16:32, marginBottom:36, flexWrap:"wrap", justifyContent:"center" }}>
          {[
            { stat:"91%",      label:lang==="en"?"of employers prioritise human skills over GPA":"de empleadores priorizan habilidades humanas sobre el GPA" },
            { stat:lang==="en"?"4 Pillars":"4 Pilares", label:lang==="en"?"mapped to NACE Career Readiness Competencies":"mapeados a las Competencias NACE" },
            { stat:"~8 min",   label:lang==="en"?"per pillar assessment":"por evaluacion de pilar" },
          ].map((s,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:mobile?22:28, fontWeight:700, color:"#fff", marginBottom:4 }}>{s.stat}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", maxWidth:120, lineHeight:1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="fu" style={{ animationDelay:".2s", display:"flex", flexDirection:"column", alignItems:"center", gap:12, width:"100%", maxWidth:360 }}>
          <button onClick={onContinue} style={{ fontFamily:FONT, background:BRAND_GRAD, color:"#fff", border:"none", borderRadius:14, padding:"15px 40px", cursor:"pointer", fontSize:16, fontWeight:700, width:"100%", boxShadow:"0 8px 28px rgba(176,38,212,.4)", letterSpacing:.5 }}>
            {lang==="en"?"Get Started":"Comenzar"}
          </button>
        </div>
      </div>

      <div style={{ padding:"16px "+(mobile?18:36)+"px", borderTop:"1px solid rgba(255,255,255,.06)", display:"flex", justifyContent:"center", position:"relative", zIndex:1 }}>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.25)", letterSpacing:2, textTransform:"uppercase" }}>
          {lang==="en"?"Developing Human-Centred Graduates":"Formando Graduados Centrados en las Personas"}
        </div>
      </div>
    </div>
  );
}

// ── Login (app shell — brand plum/indigo) ─────────────────────────────────────
function LoginScreen({ lang, setLang, onLogin }) {
  const [isUp, setIsUp] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", password:"", university:"" });
  const inp = { width:"100%", border:"1.5px solid #dbd4f0", borderRadius:10, padding:"11px 14px", fontSize:14, outline:"none", boxSizing:"border-box", marginBottom:10, background:"#f9f7fe", color:"#07071a", fontFamily:FONT };
  return (
    <div style={{ fontFamily:FONT, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:BRAND_DARK_BG, overflow:"hidden", position:"relative" }}>
      <style>{STYLES}</style>
      {[200,360,520].map((s,i) => <div key={i} style={{ position:"absolute", borderRadius:"50%", border:"1px solid rgba(176,38,212,.12)", width:s, height:s, top:(15+i*20)+"%", left:(5+i*24)+"%", pointerEvents:"none" }} />)}
      <div className="pop" style={{ background:"#fff", borderRadius:24, padding:"42px 38px", maxWidth:420, width:"92%", boxShadow:"0 30px 80px rgba(0,0,0,.45)", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:26 }}>
          <div style={{ display:"inline-block", fontSize:10, letterSpacing:5, color:PLUM, textTransform:"uppercase", marginBottom:6, paddingLeft:2 }}>Character Aarc</div>
          <div style={{ display:"inline-block", fontSize:28, fontWeight:700, letterSpacing:3, paddingLeft:3, paddingRight:3, background:BRAND_GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Ingenium</div>
          <div style={{ fontSize:12, color:"#6a6a8a", marginTop:5, fontStyle:"italic" }}>{lang==="en"?"Developing Human-Centred Graduates":"Formando Graduados Centrados en las Personas"}</div>
          <div style={{ display:"inline-block", marginTop:10, fontSize:11, padding:"4px 14px", borderRadius:20, background:"#eee", color:"#777", fontWeight:600, border:"1px solid #ddd" }}>
            {lang==="en"?"Demo - Agency Pillar":"Demo - Pilar Agencia"}
          </div>
        </div>
        <div style={{ fontSize:16, fontWeight:700, color:"#1a1a2e", marginBottom:14 }}>{isUp?(lang==="en"?"Create Account":"Crear Cuenta"):(lang==="en"?"Sign In":"Iniciar Sesion")}</div>
        <input style={inp} placeholder={lang==="en"?"Full name":"Nombre completo"} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        {isUp && <input style={inp} placeholder={lang==="en"?"University":"Universidad"} value={form.university} onChange={e=>setForm({...form,university:e.target.value})} />}
        <input style={inp} placeholder={lang==="en"?"Email address":"Correo electronico"} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input style={inp} placeholder={lang==="en"?"Password":"Contrasena"} type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&onLogin(form,isUp)} />
        <button onClick={()=>onLogin(form,isUp)} style={{ fontFamily:FONT, background:BRAND_GRAD, color:"#fff", border:"none", borderRadius:11, padding:"13px", cursor:"pointer", fontSize:14, fontWeight:700, width:"100%", marginTop:2, boxShadow:"0 4px 18px rgba(176,38,212,.3)" }}>
          {isUp?(lang==="en"?"Create Account":"Crear Cuenta"):(lang==="en"?"Sign In":"Iniciar Sesion")}
        </button>
        <p style={{ textAlign:"center", fontSize:12, color:"#888", marginTop:13, cursor:"pointer" }} onClick={()=>setIsUp(!isUp)}>
          {isUp?(lang==="en"?"Already have an account? ":"Ya tienes cuenta? "):(lang==="en"?"No account? ":"Sin cuenta? ")}
          <span style={{ color:PLUM, fontWeight:700 }}>{isUp?(lang==="en"?"Sign In":"Inicia Sesion"):(lang==="en"?"Sign Up":"Registrate")}</span>
        </p>
        <div style={{ textAlign:"center", marginTop:8 }}>
          <button onClick={()=>setLang(l=>l==="en"?"es":"en")} style={{ background:"transparent", border:"1px solid #dbd4f0", borderRadius:20, padding:"4px 12px", cursor:"pointer", fontSize:12, color:"#888", fontFamily:FONT }}>{lang==="en"?"Español":"English"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard (app shell — brand plum/indigo) ─────────────────────────────────
function DashboardScreen({ user, lang, setLang, agencyScore, badgesEarned, onEnter, onLogout }) {
  const mobile = window.innerWidth < 620;
  const earned = Object.values(badgesEarned).filter(Boolean).length;
  return (
    <div style={{ fontFamily:FONT, minHeight:"100vh", background:"#f4f1fc" }}>
      <style>{STYLES}</style>
      <nav style={{ background:"rgba(255,255,255,.96)", borderBottom:"1px solid #dbd4f0", padding:"0 "+(mobile?14:26)+"px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56, position:"sticky", top:0, zIndex:20, boxShadow:"0 2px 14px rgba(26,53,212,.06)" }}>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:mobile?14:17, fontWeight:700, color:"#1a1a2e", letterSpacing:2, paddingLeft:1 }}>Ingenium</div>
          <div style={{ fontSize:9, color:PLUM, fontStyle:"italic", letterSpacing:1, paddingLeft:1, whiteSpace:"nowrap" }}>Character Aarc</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0, marginLeft:10 }}>
          <button onClick={()=>setLang(l=>l==="en"?"es":"en")} style={{ fontFamily:FONT, background:"transparent", border:"1px solid #ddd", borderRadius:20, padding:"4px 11px", cursor:"pointer", fontSize:11, color:"#888" }}>{lang==="en"?"ES":"EN"}</button>
          <button onClick={onLogout} style={{ fontFamily:FONT, background:"transparent", border:"none", color:"#c0392b", cursor:"pointer", fontSize:12 }}>{lang==="en"?"Sign Out":"Salir"}</button>
        </div>
      </nav>
      <div style={{ maxWidth:780, margin:"0 auto", padding:"28px "+(mobile?14:22)+"px" }}>
        <div className="fu" style={{ background:"linear-gradient(150deg,#1a35d4,#4a1a8a,#b026d4)", borderRadius:20, padding:mobile?"20px 18px":"28px 32px", marginBottom:28, color:"#fff", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:-30, top:-30, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,.06)", pointerEvents:"none" }} />
          <div style={{ position:"relative" }}>
            <div style={{ fontSize:10, letterSpacing:3, opacity:.75, textTransform:"uppercase", marginBottom:5 }}>{lang==="en"?"Welcome back":"Bienvenido de nuevo"}</div>
            <div style={{ fontSize:mobile?22:28, fontWeight:700 }}>{user.name}</div>
            <div style={{ fontSize:12, opacity:.8, marginTop:2 }}>{user.university}</div>
            <div style={{ display:"flex", gap:12, marginTop:16, flexWrap:"wrap" }}>
              <div style={{ background:"rgba(255,255,255,.18)", borderRadius:12, padding:"10px 18px", textAlign:"center" }}>
                <div style={{ fontSize:26, fontWeight:700 }}>{agencyScore?"1":"0"}/4</div>
                <div style={{ fontSize:10, opacity:.85 }}>{lang==="en"?"Pillars Done":"Pilares"}</div>
              </div>
              <div style={{ background:"rgba(255,255,255,.18)", borderRadius:12, padding:"10px 18px", textAlign:"center" }}>
                <div style={{ fontSize:26, fontWeight:700 }}>{earned}/{BADGES.length}</div>
                <div style={{ fontSize:10, opacity:.85 }}>{lang==="en"?"Badges Earned":"Insignias"}</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize:10, letterSpacing:3, color:"#8a8aa0", textTransform:"uppercase", marginBottom:14, paddingLeft:2 }}>{lang==="en"?"Your AARC Pillars":"Tus Pilares AARC"}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:mobile?12:16 }}>
          {ALL_PILLARS.map((p,idx) => {
            const isAge = p.key==="Agency";
            const isLocked = IS_DEMO_MODE && !isAge;
            const sc = isAge ? agencyScore : null;
            return (
              <div key={p.key} className="fu" onClick={isAge?onEnter:undefined}
                style={{ animationDelay:(idx*.07)+"s", background:"#fff", borderRadius:20, border:isAge?"1.5px solid "+p.color+"35":"1.5px solid #e4defa", padding:mobile?"20px 16px":"26px 22px", cursor:isAge?"pointer":"default", fontFamily:FONT, boxShadow:isAge?"0 4px 22px "+p.color+"14":"none", position:"relative", overflow:"hidden", opacity:isLocked?.52:1, transition:"transform .18s, box-shadow .18s" }}
                onMouseEnter={e=>{if(isAge){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 32px "+p.color+"28";}}}
                onMouseLeave={e=>{if(isAge){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 22px "+p.color+"14";}}}>
                {isLocked && <div style={{ position:"absolute", top:14, right:14 }}><Lock size={15} color="#c8c0e8" /></div>}
                {isAge && <div style={{ position:"absolute", top:12, right:14, fontSize:10, padding:"3px 9px", borderRadius:20, background:RC+"18", color:RC, fontWeight:700, border:"1px solid "+RC+"30" }}>DEMO</div>}
                <div style={{ width:mobile?42:48, height:mobile?42:48, borderRadius:12, background:isLocked?"#f0edfa":p.color+"18", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
                  <p.Icon size={mobile?20:22} color={isLocked?"#c8c0e8":p.color} />
                </div>
                <div style={{ fontSize:mobile?14:16, fontWeight:700, color:isLocked?"#bbb":"#07071a", marginBottom:3 }}>{lang==="en"?p.label:p.labelEs}</div>
                <div style={{ fontSize:11, color:isLocked?"#ccc":"#888", lineHeight:1.5, marginBottom:12 }}>{lang==="en"?p.desc:p.descEs}</div>
                {isAge && sc ? (
                  <>
                    <div style={{ fontSize:11, color:"#27ae60", fontWeight:600, marginBottom:5 }}>{lang==="en"?"Done - Evaluation Complete":"Listo - Evaluacion Completa"}</div>
                    <Bar pct={sc.pct} h={4} color={RC} />
                  </>
                ) : isAge ? (
                  <div style={{ display:"inline-block", fontSize:10, padding:"4px 12px", borderRadius:20, background:RC+"14", color:RC, fontWeight:700 }}>{lang==="en"?"Tap to begin":"Tocar para comenzar"}</div>
                ) : (
                  <div style={{ display:"inline-block", fontSize:10, padding:"4px 12px", borderRadius:20, background:"#f0edfa", color:"#c8c0e8", fontWeight:600 }}>{lang==="en"?"Coming soon":"Proximamente"}</div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop:20, padding:"14px 18px", borderRadius:14, background:"#eff6ff", border:"1px solid #bfdbfe", fontSize:13, color:"#1e40af", lineHeight:1.65, textAlign:"center" }}>
          {lang==="en"
            ? "This is a demo of the Agency pillar. In the full Character Aarc program, all four AARC pillars unlock progressively across two academic years."
            : "Esta es una demo del pilar Agencia. En el programa completo, los cuatro pilares se desbloquean progresivamente."}
        </div>
        <div style={{ textAlign:"center", marginTop:24, paddingBottom:8 }}>
          <div style={{ fontSize:11, color:"#ccc", letterSpacing:2, textTransform:"uppercase", marginBottom:3 }}>Ingenium · Character Aarc</div>
          <div style={{ fontSize:11, color:"#ddd", fontStyle:"italic" }}>{lang==="en"?"Developing Human-Centred Graduates":"Formando Graduados Centrados en las Personas"}</div>
        </div>
      </div>
    </div>
  );
}

// ── Agency Hub (pillar-specific content) ──────────────────────────────────────
function AgencyHub({ user, lang, setLang, onBack, agencyScore, setAgencyScore, badgesEarned, setBadgesEarned }) {
  const [tab, setTab]             = useState("overview");
  const [shuffled, setShuffled]   = useState([]);
  const [answers, setAnswers]     = useState({});
  const [currentQ, setCurrentQ]   = useState(0);
  const [result, setResult]       = useState(agencyScore || null);
  const [messages, setMessages]   = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [goalDone, setGoalDone]   = useState(false);
  const [showCert, setShowCert]   = useState(false);
  const chatEndRef = useRef(null);
  const mobile = window.innerWidth < 620;

  const rd           = result;
  const userMsgCount = messages.filter(m=>m.role==="user").length;

  useEffect(()=>{ if(chatEndRef.current) chatEndRef.current.scrollIntoView({behavior:"smooth"}); },[messages]);
  useEffect(()=>{ if(userMsgCount>=3 && !badgesEarned.coaching) setBadgesEarned(b=>({...b,coaching:true})); },[userMsgCount]);

  const goToIntro      = () => { setResult(null); setTab("intro"); };
  const beginQuestions = () => { setShuffled(shuffle(QUESTIONS)); setAnswers({}); setCurrentQ(0); setTab("assess"); };

  const submitAssess = () => {
    const st={},sc={};
    let total=0;
    shuffled.forEach(q=>{ const s=scoreQ(answers[q.id],q.inverse); total+=s; if(!st[q.skill]){st[q.skill]=0;sc[q.skill]=0;} st[q.skill]+=s; sc[q.skill]++; });
    const pct=Math.round((total/(shuffled.length*10))*100);
    const skills={};
    Object.keys(st).forEach(sk=>{ skills[sk]=Math.round((st[sk]/(sc[sk]*10))*100); });
    const computed={pct,skills};
    setResult(computed); setAgencyScore(computed); setBadgesEarned(b=>({...b,assessment:true})); setTab("results");
  };

  const openCoach = () => {
    if(messages.length===0){
      const sc=rd?"Your score is "+rd.pct+"/100 ("+getTier(rd.pct).label+").":"Complete the assessment first for personalised insights!";
      const msg=lang==="en"?"Hi! I'm your Agency coach. Agency asks: what drives me to take proactive action? "+sc+" I can help you reflect and build a tactical SMART goal. What would you like to explore?":"¡Hola! Soy tu coach de Agencia. "+sc+" ¿Que meta estrategica te gustaria explorar?";
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pillarKey: "Agency",
          currentScores: rd,
          messages: next.map(m => ({ role: m.role, content: m.content })),
          lang
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages([...next, { role: "assistant", content: "Error: " + (data.error || "Could not connect") }]);
      } else {
        setMessages([...next, { role: "assistant", content: data.content || "..." }]);
      }
    } catch(e){ setMessages([...next,{role:"assistant",content:"Network error: "+e.message}]); }
    setChatLoading(false);
  };

  const answered = shuffled.filter(x=>answers[x.id]!==undefined).length;
  const progPct  = shuffled.length>0?Math.round((answered/shuffled.length)*100):0;

  const SMART_PROMPTS = rd
    ? (lang==="en" ? ["Map out an Agency SMART goal","Break down my baseline score","How do I improve accountability?"] : ["Ayudame con una meta SMART","Analiza mi puntaje","Como mejoro mi iniciativa?"])
    : (lang==="en" ? ["Tell me about Agency","Why does this pillar matter?","What should I expect?"]       : ["Cuentame sobre Agencia","Por que importa este pilar?","Que debo esperar?"]);

  const card ={background:"#fff",borderRadius:18,padding:mobile?18:26,marginBottom:16,border:"1px solid #cbd5e1",boxShadow:"0 2px 16px rgba(26,53,212,.03)"};
  const btnPri={fontFamily:FONT,background:GRAD,color:"#fff",border:"none",borderRadius:12,padding:"13px 22px",cursor:"pointer",fontSize:14,fontWeight:700,width:"100%",boxShadow:"0 4px 16px rgba(26,53,212,.2)"};
  const btnOut={fontFamily:FONT,background:"transparent",color:RC,border:"2px solid "+RC,borderRadius:10,padding:"9px 18px",cursor:"pointer",fontSize:13,fontWeight:700};
  const btnSm ={fontFamily:FONT,background:GRAD,color:"#fff",border:"none",borderRadius:9,padding:"10px 18px",cursor:"pointer",fontSize:13,fontWeight:700};
  const inpSt ={fontFamily:FONT,width:"100%",border:"1.5px solid #cbd5e1",borderRadius:10,padding:"11px 14px",fontSize:14,outline:"none",boxSizing:"border-box",background:"#f8fafc",color:"#07071a"};
  const tabBtn=k=>({fontFamily:FONT,background:tab===k?"#fff":"rgba(255,255,255,.2)",color:tab===k?RC:"#fff",border:"none",borderRadius:"8px 8px 0 0",padding:mobile?"7px 10px":"9px 18px",cursor:"pointer",fontSize:mobile?11:13,fontWeight:tab===k?700:500,transition:"all .18s",whiteSpace:"nowrap",flexShrink:0,display:"flex",alignItems:"center",gap:5,justifyContent:"center"});

  return (
    <div style={{ fontFamily:FONT, minHeight:"100vh", background:"#f8fafc" }}>
      <style>{STYLES}</style>

      {showCert && rd && <Certificate user={user} result={rd} lang={lang} onClose={()=>setShowCert(false)} />}

      <div style={{ background:GRAD, position:"sticky", top:0, zIndex:20, boxShadow:"0 4px 24px rgba(26,53,212,.3)" }}>
        <div style={{ maxWidth:740, margin:"0 auto", padding:"0 "+(mobile?14:24)+"px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:14, paddingBottom:mobile?10:14, gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0, flex:1 }}>
              <button onClick={onBack} style={{ fontFamily:FONT, background:"rgba(255,255,255,.2)", border:"none", borderRadius:8, padding:"5px 12px", color:"#fff", cursor:"pointer", fontSize:12, flexShrink:0 }}>{lang==="en"?"Back":"Atras"}</button>
              <Zap size={20} color="#fff" style={{ flexShrink:0 }} />
              <div style={{ minWidth:0, overflow:"hidden" }}>
                <div style={{ fontSize:mobile?15:17, fontWeight:700, color:"#fff", whiteSpace:"nowrap" }}>{lang==="en"?"Agency":"Agencia"}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.8)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{lang==="en"?"What drives me to act?":"Que me impulsa a actuar?"}</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
              {rd&&<div style={{ background:"rgba(255,255,255,.22)", borderRadius:10, padding:"5px 12px", color:"#fff", fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>Score: {rd.pct}</div>}
              <button onClick={()=>setLang(l=>l==="en"?"es":"en")} style={{ fontFamily:FONT, background:"rgba(255,255,255,.2)", border:"none", borderRadius:16, padding:"4px 11px", cursor:"pointer", fontSize:11, color:"#fff", fontWeight:600, flexShrink:0 }}>{lang==="en"?"ES":"EN"}</button>
            </div>
          </div>
          <div style={{ display:"flex", gap:3, overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
            {[["overview",Home,lang==="en"?"Overview":"Inicio"],["assess",ClipboardList,lang==="en"?"Assessment":"Evaluacion"],["coach",Bot,"Coach"],["credentials",Award,lang==="en"?"Credentials":"Credenciales"]].map(([k,Ic,lbl])=>(
              <button key={k} onClick={()=>k==="assess"?goToIntro():k==="coach"?openCoach():setTab(k)} style={tabBtn(k)}><Ic size={14} /> {lbl}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:740, margin:"0 auto", padding:"24px "+(mobile?14:24)+"px" }}>

        {/* OVERVIEW */}
        {tab==="overview" && (
          <div className="fu">
            <div style={{ ...card, background:"linear-gradient(135deg,#1a35d408,#fff)", borderLeft:"5px solid "+RC }}>
              <div style={{ fontSize:11, letterSpacing:3, color:RC, textTransform:"uppercase", marginBottom:6 }}>Character Aarc - Agency Pillar</div>
              <div style={{ fontSize:mobile?20:26, fontWeight:700, color:"#07071a", lineHeight:1.2, marginBottom:8 }}>{lang==="en"?"What drives me to act?":"Que me impulsa a actuar?"}</div>
              <div style={{ fontSize:14, color:"#666", fontStyle:"italic", lineHeight:1.7, marginBottom:14 }}>{lang==="en"?"Agency is choosing your response to every situation.":"La agencia es elegir tu respuesta ante cada situacion."}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {SKILLS.map(sk=><div key={sk} style={{ fontSize:11, padding:"4px 12px", borderRadius:20, background:RC+"0e", color:RC, fontWeight:600, border:"1px solid "+RC+"20" }}>{sk}</div>)}
              </div>
            </div>
            {rd?(
              <div style={{ ...card, background:"linear-gradient(135deg,"+RC+"06,#fff)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, marginBottom:3 }}>{lang==="en"?"Your Reflection Score":"Tu Puntaje de Reflexion"}</div>
                    <div style={{ fontSize:11, color:"#999", fontStyle:"italic" }}>{lang==="en"?"For self-reflection only - not tied to credentials":"Solo para tu reflexion"}</div>
                  </div>
                  <div style={{ fontSize:38, fontWeight:700, color:RC }}>{rd.pct}<span style={{ fontSize:16, color:"#aaa" }}>/100</span></div>
                </div>
                <Bar pct={rd.pct} h={7} color={RC} />
                <div style={{ marginTop:14 }}><TierBadge pct={rd.pct} lang={lang} showNote={true} /></div>
              </div>
            ):(
              <div style={{ ...card, textAlign:"center", padding:"30px 24px" }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}><ClipboardList size={40} color={RC} /></div>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>{lang==="en"?"Ready to discover your Agency profile?":"Listo para descubrir tu perfil de Agencia?"}</div>
                <div style={{ fontSize:13, color:"#888", marginBottom:18 }}>30 {lang==="en"?"questions - ~8 minutes":"preguntas - ~8 minutos"}</div>
                <button style={{ ...btnPri, width:"auto", padding:"13px 36px" }} onClick={goToIntro}>{lang==="en"?"Start Assessment":"Comenzar Evaluacion"}</button>
              </div>
            )}
            <div style={{ display:"grid", gridTemplateColumns:mobile?"1fr":"1fr 1fr", gap:12 }}>
              <button style={btnPri} onClick={goToIntro}>{rd?(lang==="en"?"Retake Assessment":"Repetir"):(lang==="en"?"Start Assessment":"Comenzar")}</button>
              <button style={{ ...btnPri, background:"linear-gradient(135deg,#050b30,#020617)" }} onClick={openCoach}>{lang==="en"?"Talk to Your Coach":"Habla con tu Coach"}</button>
            </div>
          </div>
        )}

        {/* INTRO */}
        {tab==="intro" && (
          <div className="fu">
            <div style={{ ...card, background:"linear-gradient(135deg,#1a35d404,#fff)", borderLeft:"5px solid "+RC }}>
              <div style={{ textAlign:"center", marginBottom:24 }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
                  <div style={{ width:72, height:72, borderRadius:20, background:RC+"14", display:"flex", alignItems:"center", justifyContent:"center" }}><Zap size={36} color={RC} /></div>
                </div>
                <div style={{ fontSize:11, letterSpacing:3, color:RC, textTransform:"uppercase", marginBottom:8 }}>Character Aarc - Agency Pillar</div>
                <div style={{ fontSize:mobile?22:28, fontWeight:700, color:"#07071a", marginBottom:8 }}>{lang==="en"?"What drives me to act?":"Que me impulsa a actuar?"}</div>
              </div>
              <div style={{ background:"#f8fafc", borderRadius:14, padding:"18px 20px", marginBottom:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#07071a", marginBottom:14 }}>{lang==="en"?"You will explore 5 skills:":"Exploraras 5 habilidades:"}</div>
                {SKILLS.map((sk,i)=>(
                  <div key={sk} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                    <div style={{ width:26, height:26, borderRadius:8, background:GRAD, color:"#fff", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</div>
                    <span style={{ fontSize:13, color:"#07071a" }}>{sk}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <button style={{ ...btnOut, flex:1 }} onClick={()=>setTab("overview")}>{lang==="en"?"Back":"Volver"}</button>
                <button style={{ ...btnPri, flex:2, marginTop:0 }} onClick={beginQuestions}>{lang==="en"?"Begin Assessment":"Comenzar Evaluacion"}</button>
              </div>
            </div>
          </div>
        )}

        {/* ASSESSMENT */}
        {tab==="assess" && shuffled.length>0 && (
          <div className="fu">
            <div style={{ ...card, padding:"16px 20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div style={{ fontSize:12, color:"#999" }}>{answered} {lang==="en"?"of":"de"} {shuffled.length}</div>
                <div style={{ fontSize:20, fontWeight:700, color:RC }}>{progPct}%</div>
              </div>
              <Bar pct={progPct} h={7} color={RC} />
            </div>
            <div key={currentQ} style={{ ...card, border:"1px solid "+RC+"28" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div style={{ fontSize:11, color:"#aaa", letterSpacing:2, textTransform:"uppercase" }}>{lang==="en"?"Question":"Pregunta"} {currentQ+1}</div>
                <div style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:RC+"12", color:RC, fontWeight:600 }}>{shuffled[currentQ].skill}</div>
              </div>
              <div style={{ fontSize:mobile?15:17, fontWeight:600, color:"#07071a", lineHeight:1.75, marginBottom:20 }}>{shuffled[currentQ].text}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                {FREQ.map((f,idx)=>{ const sel=answers[shuffled[currentQ].id]===idx; return (
                  <button key={idx} onClick={()=>setAnswers(a=>({...a,[shuffled[currentQ].id]:idx}))} style={{ fontFamily:FONT, textAlign:"left", padding:"12px 18px", borderRadius:11, border:sel?"2px solid "+RC:"1px solid #cbd5e1", background:sel?RC+"14":"#fff", color:sel?RC:"#07071a", cursor:"pointer", fontSize:14, fontWeight:sel?700:400, transition:"all .14s" }}>
                    {lang==="en"?f.label:f.labelEs}
                  </button>
                ); })}
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ ...btnOut, opacity: currentQ === 0 ? 0.4 : 1 }} onClick={()=>currentQ>0&&setCurrentQ(q=>q-1)}>{lang==="en"?"Prev":"Ant."}</button>
              <button style={btnOut} onClick={()=>setTab("overview")}>{lang==="en"?"Save & Exit":"Guardar"}</button>
              {currentQ<shuffled.length-1
                ?<button style={btnSm} onClick={()=>setCurrentQ(q=>q+1)}>{lang==="en"?"Next":"Sig."}</button>
                :<button style={{ ...btnSm, opacity: answered < shuffled.length ? 0.55 : 1 }} onClick={answered>=shuffled.length?submitAssess:undefined}>{lang==="en"?"Submit":"Enviar"}</button>
              }
            </div>
          </div>
        )}

        {/* RESULTS */}
        {tab==="results" && rd && (
          <div className="fu">
            <div style={{ ...card, textAlign:"center", background:"linear-gradient(135deg,"+RC+"14,#fff)", border:"1px solid "+RC+"28" }}>
              <div className="pop" style={{ display:"flex", justifyContent:"center", marginBottom:8 }}><CheckCircle size={48} color={RC} /></div>
              <div style={{ fontSize:11, letterSpacing:3, color:RC, textTransform:"uppercase", marginTop:6 }}>Agency - {lang==="en"?"Reflection Score":"Puntaje de Reflexion"}</div>
              <div className="pop" style={{ fontSize:mobile?60:76, fontWeight:700, color:RC, lineHeight:1, margin:"10px 0", animationDelay:".1s" }}>{rd.pct}<span style={{ fontSize:22, color:"#bbb" }}>/100</span></div>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}><TierBadge pct={rd.pct} lang={lang} showNote={true} /></div>
            </div>
            <div style={card}>
              <div style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>{lang==="en"?"Skill Breakdown":"Desglose de Habilidades"}</div>
              {Object.entries(rd.skills).map(([sk,pct])=>(
                <div key={sk} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                    <span style={{ fontSize:13, fontWeight:600 }}>{sk}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}><TierBadge pct={pct} lang={lang} /><span style={{ fontSize:14, fontWeight={700} color:RC }}>{pct}</span></div>
                  </div>
                  <Bar pct={pct} h={6} color={RC} />
                </div>
              ))}
            </div>
            <div style={{ ...card, background:GRAD, border:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <FileText size={30} color="#fff" style={{ flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:4 }}>{lang==="en"?"Your certificate is ready":"Tu certificado esta listo"}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,.8)", lineHeight:1.6 }}>{lang==="en"?"Download or print your Agency Certificate to share your achievement.":"Descarga o imprime tu Certificado de Agencia."}</div>
                </div>
                <button onClick={()=>setShowCert(true)} style={{ fontFamily:FONT, background:"rgba(255,255,255,.2)", color:"#fff", border:"1.5px solid rgba(255,255,255,.4)", borderRadius:10, padding:"10px 18px", cursor:"pointer", fontSize:13, fontWeight:700, whiteSpace:"nowrap" }}>
                  {lang==="en"?"View Certificate":"Ver Certificado"}
                </button>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <button style={btnOut} onClick={goToIntro}>{lang==="en"?"Retake":"Repetir"}</button>
              <button style={btnPri} onClick={openCoach}>{lang==="en"?"Talk to Coach":"Hablar con Coach"}</button>
            </div>
          </div>
        )}

        {/* COACH */}
        {tab==="coach" && (
          <div className="fu" style={card}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{ width:46, height:46, borderRadius:14, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Bot size={22} color="#fff" /></div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:16, fontWeight:700 }}>{lang==="en"?"Agency Coach":"Coach de Agencia"}</div>
                <div style={{ fontSize:12, color:"#999" }}>{lang==="en"?"Reflection and SMART goal support":"Apoyo en metas de accion estrategica"}</div>
              </div>
              {rd&&<div style={{ marginLeft:"auto", flexShrink:0 }}><TierBadge pct={rd.pct} lang={lang} /></div>}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
              {SMART_PROMPTS.map((p,i)=>(
                <button key={i} onClick={()=>sendMsg(p)} style={{ fontFamily:FONT, background:RC+"10", color:RC, border:"1px solid "+RC+"28", borderRadius:20, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:600 }}>{p}</button>
              ))}
            </div>
            {!rd && <div style={{ fontSize:11, color:"#94a3b8", fontStyle:"italic", marginTop:-8, marginBottom:14 }}>{lang==="en"?"Complete the assessment for score-specific coaching.":"Completa la evaluacion para coaching especifico."}</div>}
            <div style={{ height:340, overflowY:"auto", background:"#f1f5f9", borderRadius:14, padding:14, marginBottom:12, display:"flex", flexDirection:"column", gap:10 }}>
              {messages.length===0&&<div style={{ textAlign:"center", color:"#94a3b8", fontSize:13, marginTop:60 }}>{lang==="en"?"Tap a prompt above or type to start...":"Toca un prompt arriba para iniciar..."}</div>}
              {messages.map((m,i)=>(
                <div key={i} style={{ alignSelf:m.role==="user"?"flex-end":"flex-start", background:m.role==="user"?GRAD:"#fff", color:m.role==="user"?"#fff":"#07071a", borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"11px 16px", maxWidth:"80%", fontSize:14, lineHeight:1.7, boxShadow:"0 2px 8px rgba(26,53,212,.04)" }}>{m.content}</div>
              ))}
              {chatLoading&&<div style={{ alignSelf:"flex-start", background:"#fff", borderRadius:"18px 18px 18px 4px", padding:"12px 16px", display:"flex", gap:6 }}>
                {[0,1,2].map(i=><div key={i} style={{ width:8, height:8, borderRadius:"50%", background:RC, animation:"pulse .9s ease-in-out infinite", animationDelay:(i*.2)+"s" }} />)}
              </div>}
              <div ref={chatEndRef} />
            </div>
            <div style={{ display:"flex", gap:10, marginBottom:12 }}>
              <input style={{ ...inpSt, flex:1 }} placeholder={lang==="en"?"Ask your Agency coach...":"Pregunta a tu coach..."} value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} />
              <button style={btnSm} onClick={()=>sendMsg()}>{lang==="en"?"Send":"Enviar"}</button>
            </div>
            {goalDone?(
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:12, background:"#e8f5e9", border:"1px solid #a5d6a7" }}>
                <Target size={20} color="#2e7d32" style={{ flexShrink:0 }} />
                <span style={{ fontSize:13, fontWeight:700, color:"#2e7d32" }}>{lang==="en"?"SMART goal completed - Action Taker badge earned!":"Meta SMART completada - Insignia obtenida!"}</span>
              </div>
            ):userMsgCount>=2?(
              <div style={{ padding:"14px 16px", borderRadius:12, background:"#fff8e1", border:"1px solid #ffe082" }}>
                <div style={{ fontSize:12, color:"#8a6800", marginBottom:10, lineHeight:1.6 }}>{lang==="en"?"Once you have set a SMART goal with your coach, mark it complete below.":"Una vez que hayas establecido una meta SMART, marcala completa abajo."}</div>
                <button onClick={()=>{setGoalDone(true);setBadgesEarned(b=>({...b,goal:true}));}} style={{ fontFamily:FONT, background:"linear-gradient(135deg,#f39c12,#e67e22)", color:"#fff", border:"none", borderRadius:10, padding:"10px 20px", cursor:"pointer", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:7 }}><Target size={15} /> {lang==="en"?"Mark SMART goal complete":"Marcar meta SMART completa"}</button>
              </div>
            ):(
              <div style={{ padding:"11px 16px", borderRadius:12, background:"#f1f5f9", border:"1px solid #e2e8f0", fontSize:12, color:"#94a3b8", textAlign:"center" }}>{lang==="en"?"Chat with your coach to set a SMART goal, then mark it complete for your badge.":"Chatea con tu coach para estructurar metas profesionales."}</div>
            )}
          </div>
        )}

        {/* CREDENTIALS */}
        {tab==="credentials" && (
          <div className="fu">
            <div style={{ ...card, textAlign:"center", background:"linear-gradient(135deg,"+RC+"0e,#fff)" }}>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}><Award size={34} color={RC} /></div>
              <div style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>{lang==="en"?"Agency Credentials":"Credenciales de Agencia"}</div>
              <div style={{ fontSize:13, color:"#888" }}>{lang==="en"?"Earned through effort - never through scores":"Ganadas por esfuerzo, nunca por puntaje"}</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {BADGES.map(b=>{ const earned=b.key==="assessment"?badgesEarned.assessment:b.key==="coaching"?badgesEarned.coaching:badgesEarned.goal||false; return (
                <div key={b.key} style={{ display:"flex", alignItems:"center", gap:16, padding:"18px 20px", borderRadius:16, background:earned?"linear-gradient(135deg,"+RC+"0e,#fff)":"#f8fafc", border:earned?"1px solid "+RC+"28":"1px solid #e2e8f0" }}>
                  <div style={{ width:52, height:52, borderRadius:14, background:earned?RC+"14":"#eee", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <b.Icon size={24} color={earned?RC:"#ccc"} />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:earned?"#07071a":"#bbb", marginBottom:3 }}>{lang==="en"?b.name:b.nameEs}{earned?" - earned":""}</div>
                    <div style={{ fontSize:12, color:"#888", marginBottom:4 }}>{lang==="en"?b.desc:b.descEs}</div>
                    {!earned&&<div style={{ fontSize:11, color:"#aaa", fontStyle:"italic" }}>{lang==="en"?"How to earn: "+b.how:"Como obtener: "+b.howEs}</div>}
                  </div>
                  {earned&&<div style={{ fontSize:11, padding:"5px 14px", borderRadius:20, background:GRAD, color:"#fff", fontWeight:700, whiteSpace:"nowrap" }}>{lang==="en"?"Earned":"Obtenida"}</div>}
                </div>
              ); })}
            </div>
            {rd ? (
              <div style={{ ...card, marginTop:4, background:GRAD, border:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
                  <FileText size={30} color="#fff" style={{ flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:4 }}>{lang==="en"?"Agency Certificate":"Certificado de Agencia"}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.8)", lineHeight:1.6 }}>{lang==="en"?"Your personalised certificate is ready. Download it, print it, or share it.":"Tu certificado personalizado esta listo."}</div>
                  </div>
                  <button onClick={()=>setShowCert(true)} style={{ fontFamily:FONT, background:"rgba(255,255,255,.2)", color:"#fff", border:"1.5px solid rgba(255,255,255,.4)", borderRadius:10, padding:"10px 18px", cursor:"pointer", fontSize:13, fontWeight:700, whiteSpace:"nowrap" }}>
                    {lang==="en"?"View & Download":"Ver y Descargar"}
                  </button>
                </div>
              </div>
            ):(
              <div style={{ ...card, marginTop:4, background:"#f8fafc", border:"1px solid #e2e8f0", textAlign:"center", opacity:.6 }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}><FileText size={26} color="#ccc" /></div>
                <div style={{ fontSize:14, fontWeight:700, color:"#aaa", marginBottom:4 }}>{lang==="en"?"Agency Certificate":"Certificado de Agencia"}</div>
                <div style={{ fontSize:12, color:"#bbb" }}>{lang==="en"?"Complete the assessment to unlock your certificate":"Completa la evaluacion para desbloquear tu certificado"}</div>
              </div>
            )}
            <div style={{ ...card, background:"linear-gradient(135deg,"+RC+"06,#fff)" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#07071a", marginBottom:4 }}>{lang==="en"?"NACE Career Readiness Credential":"Credencial NACE de Preparacion Profesional"}</div>
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderRadius:14, background:rd?"linear-gradient(135deg,"+RC+"0e,#fff)":"#f4f1fc", border:rd?"1px solid "+RC+"30":"1px solid #dbd4f0", marginTop:10 }}>
                <Award size={28} color={rd?RC:"#ccc"} style={{ flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:rd?RC:"#aaa", display:"inline-block", padding:"4px 13px", borderRadius:20, background:rd?RC+"14":"#ebebeb", border:"1px solid "+(rd?RC+"30":"#ddd") }}>Professionalism{rd?" - earned":""}</div>
                </div>
              </div>
            </div>
            <div style={{ padding:"18px 20px", borderRadius:16, background:"#f4f1fc", border:"1px solid #dbd4f0", display:"flex", alignItems:"center", gap:16 }}>
              <GraduationCap size={30} color="#c8c0e8" style={{ flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#aaa", marginBottom:3 }}>Career & Self Development</div>
                <div style={{ fontSize:12, color:"#bbb", marginBottom:4, lineHeight:1.6 }}>{lang==="en"?"The overarching NACE competency - awarded when all four AARC pillars are complete.":"La competencia NACE global."}</div>
                <div style={{ fontSize:11, color:"#bbb", fontStyle:"italic" }}>{lang==="en"?"Demo: 1/4 pillars available":"Demo: 1/4 pilares disponibles"}</div>
              </div>
            </div>
            {!rd&&<button style={{ ...btnPri, marginTop:4 }} onClick={goToIntro}>{lang==="en"?"Start Assessment to Unlock":"Comenzar Evaluacion para Desbloquear"}</button>}
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
  const [lang, setLang]                 = useState("en");
  const [page, setPage]                 = useState("splash");
  const [user, setUser]                 = useState(null);
  const [agencyScore, setAgencyScore]   = useState(null);
  const [badgesEarned, setBadgesEarned] = useState({ assessment:false, coaching:false, goal:false });

  const handleLogin = (form, isUp) => {
    if (!form.email || !form.password) return;
    if (isUp) USER_STORE[form.email] = { name: form.name || form.email.split("@")[0], university: form.university || "My University" };
    const stored = USER_STORE[form.email];
    const name       = (stored&&stored.name)       || form.name || form.email.split("@")[0];
    const university = (stored&&stored.university) || "My University";
    setUser({ name, email:form.email, university });
    setPage("dashboard");
  };

  if (page==="splash")  return <SplashScreen lang={lang} setLang={setLang} onContinue={()=>setPage("login")} />;
  if (page==="login")   return <LoginScreen lang={lang} setLang={setLang} onLogin={handleLogin} />;
  if (page==="agency")  return <AgencyHub user={user} lang={lang} setLang={setLang} onBack={()=>setPage("dashboard")} agencyScore={agencyScore} setAgencyScore={setAgencyScore} badgesEarned={badgesEarned} setBadgesEarned={setBadgesEarned} />;
  return <DashboardScreen user={user} lang={lang} setLang={setLang} agencyScore={agencyScore} badgesEarned={badgesEarned} onEnter={()=>setPage("agency")} onLogout={()=>{setUser(null);setPage("splash");}} />;
}