import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Terminal, 
  Trash2, 
  FileText, 
  ShieldAlert, 
  Compass, 
  Wrench, 
  Cat, 
  Activity,
  Heart,
  User,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  timestamp: string;
  text: string;
  suggestedActions?: Array<{ label: string; actionCode: string }>;
}

export const RescueCopilotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m_1",
      sender: "copilot",
      timestamp: "2026-07-06T22:00:00-07:00",
      text: "Welcome to the PurrSignal Tactical Copilot Terminal. I am your specialized rescue operations consultant. Select one of the quick dispatch templates on the left or type your query regarding feral traps, emergency medicine, property clearance, or meteorology risk analysis.",
      suggestedActions: [
        { label: "View Trapping Best Practices", actionCode: "trapping" },
        { label: "Analyze Storm Drain Risk Factors", actionCode: "weather" }
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Dynamic AI Smart Simulation responses
    setTimeout(() => {
      const query = textToSend.toLowerCase();
      let aiResponse = "";
      let suggestions: ChatMessage['suggestedActions'] = [];

      if (query.includes('trap') || query.includes('cage') || query.includes('lure')) {
        aiResponse = "TACTICAL BRIEFING: LURING & TRAPPING FERAL/INJURED FELINES\n\n1. EQUIPMENT: Prefer standard Tru-Catch gravity trap or double-door trap over spring-loaded systems. For injured cats, a standard drop-trap triggered by pull-string is superior because it won't snap shut on their limbs or tail.\n2. BAIT SELECTION: Avoid dry food. Use warm, fragrant, oil-heavy foods. Mackerel, sardines in oil, or warm tuna are highly effective. Place a small trail leading into the door and 80% of the bait behind the trip-plate.\n3. CALMING ENVIRONMENTS: Drape a dark towel or blanket over 90% of the cage. Leave only the entry visible. Cats will enter a dark 'safe tunnel' much more willingly than exposed bare wire cages.\n4. SECURITY: Once tripped, immediately cover the cage completely. This reduces light, lowers heart rates, and prevents severe snout lacerations from wire panic.";
        suggestions = [
          { label: "Draft Owner Contact Message", actionCode: "owner" },
          { label: "Warming & Triage Advice", actionCode: "warming" }
        ];
      } else if (query.includes('drain') || query.includes('flood') || query.includes('weather') || query.includes('storm')) {
        aiResponse = "HYDROLOGY RISK ADVISORY: STORM DRAIN EXTRICTATIONS\n\n1. CURRENT WEATHER CHECK: Moderate rain has high surface wash implications for narrow municipal pipe lines. Flooding threshold in primary catch basins is roughly 1.5 inches/hour.\n2. TACTICAL RETRIEVAL: Cats fleeing water will back deep into the lateral concrete lines. Do not chase them directly—this triggers severe flight panic and wedge risk. Deploy an active light source (laser pointer reflection) or call out with gentle high-frequency vocal clicks to lead them toward the transport trap.\n3. LEGALITY: Bypassing storm grates on public streets should be logged with municipal works emergency dispatcher. Bypassing on private parking lots requires landlord notification.";
        suggestions = [
          { label: "Draft Landlord Clearance Form", actionCode: "landlord" },
          { label: "View Trapping Best Practices", actionCode: "trapping" }
        ];
      } else if (query.includes('landlord') || query.includes('owner') || query.includes('permission') || query.includes('property')) {
        aiResponse = "COMMUNICATION PROTOCOL: PRIVATE PROPERTY ENTRY AUTHORIZATION\n\nHere is a drafted message you can text/email to the facility coordinator or landlord:\n\n\"Subject: Emergency Animal Recovery Sighting Code\n\nDear [Property Manager/Landlord],\n\nMy name is [Name], representing the PurrSignal Rescue Network. We have verified a trapped and injured cat inside your security fencing [under the pallets/bins]. \n\nWe are equipped with professional, non-destructive safety nets and humane transport cages. We do not require keys or security clearances if a volunteer can be accompanied by an on-site supervisor for just 15 minutes. Our goal is to prevent property disruption and retrieve the animal cleanly.\n\nPlease contact us immediately at [Phone]. Every hour is critical to prevent hydration shock. Thank you.\"\n\n(AI confidence score: 96% structured resolution)";
        suggestions = [
          { label: "Analyze Storm Drain Risk Factors", actionCode: "weather" }
        ];
      } else if (query.includes('flyer') || query.includes('lost') || query.includes('marshmallow')) {
        aiResponse = "PUBLIC COMMUNICATIONS DEPLOYMENT: NEIGHBORHOOD FLYER DESIGN\n\nHere is a optimized text template for community flyers:\n\n\"[URGENT] LOST FLUFFY WHITE CAT: 'MARSHMALLOW'\n\n- DESCRIPTION: Pure White Persian. Blue eyes, extremely fluffy tail. Wearing a pink breakaway collar with a small bell.\n- ESCAPED FROM: 342 Pinecrest Rd on Monday evening during the storm. \n- BEHAVIOR NOTE: Very skittish, DO NOT CHASE or call loudly. He will bolt. He is likely hiding in dark, dry understructures (under decks, porches, storage sheds, behind trash bins).\n- CONTACT: If sighted, please IMMEDIATELY text a photo/location to [Phone]. Do not attempt capture yourself.\"\n\nAI RECOMMENDATION: Place scent items (his dirty litter box, his blanket, or owner's worn clothing) on the porch. Felines can track home scents from up to 1.5 miles.";
        suggestions = [
          { label: "Warming & Triage Advice", actionCode: "warming" }
        ];
      } else {
        aiResponse = "COORDINATION INTEL ANALYZER:\n\n- query received: '" + textToSend + "'\n- analysis status: Parsed and cataloged.\n\nTactical advice for cat crises:\n1. Keep voices very low on approach. Loud voices spike cortisol and cause cats to squeeze into dangerous, unreachable wall gaps or holes.\n2. Always scan for microchips with an ISO-compliant reader at triage stations.\n3. Keep high-protein, calorie-dense liquid nutrients (e.g., tiki cat velvet mousse) handy. Dehydrated felines need immediate electrolytes and digestible fats.";
        suggestions = [
          { label: "Humane Trapping Instructions", actionCode: "trapping" },
          { label: "Storm Hydrology Factors", actionCode: "weather" }
        ];
      }

      const copilotMsg: ChatMessage = {
        id: `c_${Date.now()}`,
        sender: 'copilot',
        timestamp: new Date().toISOString(),
        text: aiResponse,
        suggestedActions: suggestions
      };

      setMessages(prev => [...prev, copilotMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "m_init",
        sender: "copilot",
        timestamp: new Date().toISOString(),
        text: "Terminal reset complete. Secure operations line ready. Ask a question regarding feline rescue, weather impact, bait, or property clearance."
      }
    ]);
  };

  return (
    <div id="copilot-terminal-container" className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-slate-950 text-white font-mono">
      
      {/* LEFT TEMPLATE WIDGET PANELS (4 cols) */}
      <div className="w-full md:w-80 lg:w-96 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between h-1/3 md:h-full overflow-y-auto">
        
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-extrabold tracking-wider text-amber-500 uppercase flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              Operational Templates
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Select a scenario to populate the AI consultation terminal.</p>
          </div>

          <div className="space-y-2.5">
            {/* Template 1 */}
            <button
              id="template-trap-advice"
              onClick={() => handleSendMessage("Formulate trapped cage advice for a limping gray tabby behind a locked commercial fence")}
              className="w-full p-3 bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800 rounded-xl text-left transition-colors flex items-start gap-2.5 group"
            >
              <div className="p-1.5 bg-slate-900 border border-slate-800 text-amber-400 rounded group-hover:bg-slate-850">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-200 group-hover:text-amber-400">Trapped Cage Instructions</div>
                <div className="text-[9px] text-slate-500 mt-0.5 truncate">Advice on luring skittish injured tabbys</div>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-600 mt-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Template 2 */}
            <button
              id="template-landlord-msg"
              onClick={() => handleSendMessage("Draft landlord clearance text to access backyard security pallets for cat recovery")}
              className="w-full p-3 bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800 rounded-xl text-left transition-colors flex items-start gap-2.5 group"
            >
              <div className="p-1.5 bg-slate-900 border border-slate-800 text-indigo-400 rounded group-hover:bg-slate-850">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-200 group-hover:text-indigo-400">Landlord Access Form</div>
                <div className="text-[9px] text-slate-500 mt-0.5 truncate">Text to request yard clearance bypass</div>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-600 mt-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Template 3 */}
            <button
              id="template-weather-risk"
              onClick={() => handleSendMessage("Synthesize flood and storm drain risk report for cats with rain expected in 2 hours")}
              className="w-full p-3 bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800 rounded-xl text-left transition-colors flex items-start gap-2.5 group"
            >
              <div className="p-1.5 bg-slate-900 border border-slate-800 text-rose-400 rounded group-hover:bg-slate-850">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-200 group-hover:text-rose-400">Storm Drain Risk Matrix</div>
                <div className="text-[9px] text-slate-500 mt-0.5 truncate">Hydrology checks for sewer emergencies</div>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-600 mt-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Template 4 */}
            <button
              id="template-owner-flyer"
              onClick={() => handleSendMessage("Draft neighborhood lost flyer text for 'Marshmallow' white Persian cat")}
              className="w-full p-3 bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800 rounded-xl text-left transition-colors flex items-start gap-2.5 group"
            >
              <div className="p-1.5 bg-slate-900 border border-slate-800 text-teal-400 rounded group-hover:bg-slate-850">
                <Cat className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-200 group-hover:text-teal-400">Lost Cat Flyer Template</div>
                <div className="text-[9px] text-slate-500 mt-0.5 truncate">Flyer wording to place around Pinecrest</div>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-600 mt-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 mt-4 bg-slate-900/40">
          <button
            id="copilot-btn-clear"
            onClick={clearChat}
            className="w-full py-2 bg-slate-950 hover:bg-red-950/30 text-slate-500 hover:text-red-400 border border-slate-800 hover:border-red-900/50 rounded-lg text-[10px] uppercase font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Terminal Logs
          </button>
        </div>

      </div>

      {/* CHAT CONSOLE STAGE (8 cols) */}
      <div className="flex-1 flex flex-col justify-between bg-slate-950 h-2/3 md:h-full">
        
        {/* Terminal Header */}
        <div className="p-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-100">PurrSignal AI Copilot Station v2.4</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">ENCRYPTED SAT-LINK ACTIVE</span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            
            return (
              <div 
                id={`copilot-msg-${m.id}`}
                key={m.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 ${
                  isUser 
                    ? 'bg-slate-900 border-slate-800 text-amber-400' 
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/5'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 animate-pulse" />}
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                  <div className={`p-4 rounded-2xl border text-xs leading-relaxed whitespace-pre-wrap ${
                    isUser 
                      ? 'bg-slate-900 border-slate-800/80 text-slate-100' 
                      : 'bg-slate-900/60 border-slate-800/40 text-slate-300 shadow-sm shadow-slate-950/20'
                  }`}>
                    {m.text}
                  </div>

                  {/* Suggestions triggers */}
                  {!isUser && m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1 pl-1">
                      {m.suggestedActions.map((s, idx) => (
                        <button
                          id={`suggested-action-${idx}`}
                          key={idx}
                          onClick={() => {
                            const prompts: Record<string, string> = {
                              trapping: "Tell me more about humane trapping best practices",
                              weather: "What are the core storm drain flooding water level parameters?",
                              owner: "Draft me a generic lost cat owner contact message",
                              warming: "How do I deal with shivering hypothermic felines?",
                              landlord: "Help me draft a yard bypass text for building landlords"
                            };
                            handleSendMessage(prompts[s.actionCode] || s.label);
                          }}
                          className="px-3 py-1 bg-slate-900 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 text-[10px] rounded-lg text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-slate-900/40 border border-slate-800/40 p-4 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span>AI Copilot is formulating advice...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-4 border-t border-slate-900 bg-slate-950/80 backdrop-blur"
        >
          <div className="flex gap-2">
            <input
              id="copilot-text-input"
              type="text"
              required
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Copilot: 'best cat baits', 'how to bypass padlocks', 'shivering triage'..."
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            
            <button
              id="btn-copilot-send"
              type="submit"
              className="px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <Send className="w-4 h-4" />
              Execute
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};
