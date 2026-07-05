export default async function handler(req, res) {
  // 1. Enforce Airtight Global CORS security rules
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    // 2. Bulletproof Body Parsing Protection
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    
    if (!body) {
      throw new Error("Incoming request data payload is empty or unparsed.");
    }

    const { pillarKey, currentScores, messages, lang } = body;
    const sc = currentScores ? `${pillarKey}: ${currentScores.pct}/100` : "Assessment not yet completed";
    
    // 3. Dynamic Coaching System Framework Alignment
    let systemInstruction = "";
    if (lang === "en") {
      systemInstruction = `You are a warm, deeply encouraging expert coach for the ${pillarKey} pillar of Ingenium's Character Aarc program. Student score context: ${sc}. Your core framework is to never give direct solutions. Guide the student step-by-step through a Specific, Measurable, Achievable, Relevant, Time-bound (SMART) goal sequence. Crucial constraint: Ask exactly ONE question per turn to keep cognitive load minimal. Keep responses under 3 sentences total. Always finish with a clear, open-ended question.`;
    } else {
      systemInstruction = `Eres un coach experto, cálido y empático para el pilar ${pillarKey} del programa Character Aarc de Ingenium. Contexto del estudiante: ${sc}. Tu regla principal es nunca dar soluciones directas. Guía al estudiante paso a paso para construir una meta SMART, haciendo una sola pregunta a la vez. Respuestas cortas (máximo 3 frases). Termina siempre con una pregunta reflexiva abierta.`;
    }

    // 4. Execute Secure Request to Together AI US Infrastructure Clusters
    const aiResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        //  THE FIXED SERVERLESS LINE:
	model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', 
        messages: [
          { role: 'system', content: systemInstruction },
          ...messages
        ],
        temperature: 0.4,
        max_tokens: 350
      })
    });

    const data = await aiResponse.json();

    // 5. Send Strict Native JSON Outputs back to the browser screen
    res.setHeader('Content-Type', 'application/json');
    
    if (!aiResponse.ok) {
      res.statusCode = aiResponse.status;
      res.end(JSON.stringify({ error: data.error?.message || "Together AI Gateway Error Encountered" }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ content: data.choices[0].message.content }));

  } catch (error) {
    console.error("Critical Live Runtime Crash Intercepted:", error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: `Server Crash Isolation: ${error.message}` }));
  }
}