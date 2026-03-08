import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, FileText, Home, Building2, TreePine,
  Waves, Dumbbell, ParkingCircle, Wifi, UtensilsCrossed,
  Ban, Volume2, Clock, Dog, Cigarette, Baby,
  Copy, Check, Download,
} from 'lucide-react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LeadCaptureModal from '../../components/LeadCaptureModal';
import { useLeadCapture } from '../../hooks/useLeadCapture';

const propertyTypes = [
  { id: 'apartment', label: 'Apartment', icon: Building2 },
  { id: 'house', label: 'House', icon: Home },
  { id: 'villa', label: 'Villa', icon: TreePine },
];

const amenities = [
  { id: 'pool', label: 'Pool', icon: Waves },
  { id: 'gym', label: 'Gym', icon: Dumbbell },
  { id: 'parking', label: 'Parking', icon: ParkingCircle },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'kitchen', label: 'Kitchen', icon: UtensilsCrossed },
  { id: 'baby_equipment', label: 'Baby Equipment', icon: Baby },
];

const rules = [
  { id: 'no_smoking', label: 'No Smoking', icon: Cigarette },
  { id: 'no_pets', label: 'No Pets', icon: Dog },
  { id: 'quiet_hours', label: 'Quiet Hours', icon: Volume2 },
  { id: 'no_parties', label: 'No Parties', icon: Ban },
  { id: 'check_in_time', label: 'Check-in/out Times', icon: Clock },
];

function generateRules(
  propertyType: string,
  selectedAmenities: string[],
  selectedRules: string[],
  propertyName: string,
  maxGuests: number
): string {
  const type = propertyTypes.find((p) => p.id === propertyType)?.label || 'Property';
  const name = propertyName.trim() || `Our ${type}`;

  let text = `HOUSE RULES - ${name.toUpperCase()}\n`;
  text += '='.repeat(40) + '\n\n';

  text += `Welcome to ${name}! We are delighted to have you as our guest. `;
  text += `To ensure a pleasant stay for everyone, please observe the following house rules.\n\n`;

  text += `GENERAL INFORMATION\n`;
  text += '-'.repeat(30) + '\n';
  text += `- Property type: ${type}\n`;
  text += `- Maximum guests: ${maxGuests}\n`;
  text += `- Please treat the property with respect and care\n`;
  text += `- Report any damage or issues immediately to your host\n\n`;

  if (selectedRules.includes('check_in_time')) {
    text += `CHECK-IN & CHECK-OUT\n`;
    text += '-'.repeat(30) + '\n';
    text += `- Check-in: 3:00 PM - 10:00 PM\n`;
    text += `- Check-out: by 11:00 AM\n`;
    text += `- Early check-in or late check-out may be available upon request\n`;
    text += `- Please ensure all windows and doors are locked upon departure\n\n`;
  }

  if (selectedRules.includes('quiet_hours')) {
    text += `QUIET HOURS\n`;
    text += '-'.repeat(30) + '\n';
    text += `- Quiet hours are from 10:00 PM to 8:00 AM\n`;
    text += `- Please keep noise levels to a minimum during these hours\n`;
    text += `- Be considerate of neighbors at all times\n\n`;
  }

  if (selectedRules.includes('no_smoking')) {
    text += `SMOKING POLICY\n`;
    text += '-'.repeat(30) + '\n';
    text += `- Smoking is strictly prohibited inside the ${type.toLowerCase()}\n`;
    text += `- Smoking is only permitted in designated outdoor areas\n`;
    text += `- A cleaning fee of $250 will be charged for violations\n\n`;
  }

  if (selectedRules.includes('no_pets')) {
    text += `PET POLICY\n`;
    text += '-'.repeat(30) + '\n';
    text += `- Pets are not allowed on the premises\n`;
    text += `- Service animals are welcome with prior notification\n`;
    text += `- Unauthorized pets may result in additional cleaning fees\n\n`;
  }

  if (selectedRules.includes('no_parties')) {
    text += `EVENTS & GATHERINGS\n`;
    text += '-'.repeat(30) + '\n';
    text += `- Parties and events are strictly prohibited\n`;
    text += `- The maximum number of guests on the premises must not exceed ${maxGuests}\n`;
    text += `- Unregistered visitors are not permitted overnight\n\n`;
  }

  if (selectedAmenities.length > 0) {
    text += `AMENITIES & USAGE\n`;
    text += '-'.repeat(30) + '\n';

    if (selectedAmenities.includes('pool')) {
      text += `\nPool:\n`;
      text += `  - Pool hours: 8:00 AM - 10:00 PM\n`;
      text += `  - No diving allowed\n`;
      text += `  - Children must be supervised at all times\n`;
      text += `  - Please shower before entering the pool\n`;
      text += `  - No glass containers in the pool area\n`;
    }

    if (selectedAmenities.includes('gym')) {
      text += `\nGym:\n`;
      text += `  - Available 24/7 for registered guests\n`;
      text += `  - Please wipe down equipment after use\n`;
      text += `  - Use at your own risk\n`;
    }

    if (selectedAmenities.includes('parking')) {
      text += `\nParking:\n`;
      text += `  - One designated parking space included\n`;
      text += `  - Do not block other vehicles or common areas\n`;
      text += `  - The host is not responsible for vehicle damage or theft\n`;
    }

    if (selectedAmenities.includes('wifi')) {
      text += `\nWi-Fi:\n`;
      text += `  - Network name and password are provided in the welcome packet\n`;
      text += `  - Please do not share credentials with non-guests\n`;
    }

    if (selectedAmenities.includes('kitchen')) {
      text += `\nKitchen:\n`;
      text += `  - Fully equipped for your convenience\n`;
      text += `  - Please wash all dishes before departure\n`;
      text += `  - Dispose of food waste in designated bins\n`;
      text += `  - Do not leave appliances unattended while in use\n`;
    }

    if (selectedAmenities.includes('baby_equipment')) {
      text += `\nBaby Equipment:\n`;
      text += `  - High chair and crib available upon request\n`;
      text += `  - Please inspect all equipment before use\n`;
      text += `  - Report any issues immediately\n`;
    }

    text += '\n';
  }

  text += `SAFETY & SECURITY\n`;
  text += '-'.repeat(30) + '\n';
  text += `- Emergency contacts are posted near the main entrance\n`;
  text += `- First aid kit is located in the main bathroom\n`;
  text += `- Fire extinguisher is located in the kitchen\n`;
  text += `- Please keep all doors locked when away from the property\n`;
  text += `- Do not share access codes or keys with anyone\n\n`;

  text += `WASTE & RECYCLING\n`;
  text += '-'.repeat(30) + '\n';
  text += `- Please separate recyclables from general waste\n`;
  text += `- Trash collection days: consult the information folder\n`;
  text += `- Large items must not be placed in regular bins\n\n`;

  text += `Thank you for respecting these rules and helping us maintain\n`;
  text += `a wonderful experience for all guests. Enjoy your stay!\n\n`;
  text += `- The ${name} Team\n`;

  return text;
}

function ToggleChip({
  selected, label, icon: Icon, onClick,
}: { selected: boolean; label: string; icon: typeof Home; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
        selected
          ? 'bg-brand-accent/10 border-brand-accent/40 text-brand-accent'
          : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

export default function HouseRulesGenerator() {
  const [propertyType, setPropertyType] = useState('apartment');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['wifi', 'kitchen']);
  const [selectedRules, setSelectedRules] = useState<string[]>(['no_smoking', 'quiet_hours', 'check_in_time']);
  const [propertyName, setPropertyName] = useState('');
  const [maxGuests, setMaxGuests] = useState(6);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const lead = useLeadCapture('house-rules-generator');

  const toggleAmenity = useCallback((id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }, []);

  const toggleRule = useCallback((id: string) => {
    setSelectedRules((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }, []);

  const rulesText = generateRules(propertyType, selectedAmenities, selectedRules, propertyName, maxGuests);

  const handleGenerate = () => {
    setGenerated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rulesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const gated = lead.triggerGate({
      propertyType,
      selectedAmenities,
      selectedRules,
      propertyName,
      maxGuests,
    });
    if (!gated) {
      downloadFile();
    }
  };

  const downloadFile = () => {
    const blob = new Blob([rulesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `house-rules-${propertyName.trim().toLowerCase().replace(/\s+/g, '-') || 'property'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onLeadSubmit = async () => {
    const ok = await lead.submitLead();
    if (ok) downloadFile();
  };

  return (
    <div className="min-h-screen bg-midnight-900 text-white">
      <SEO
        title="Free AI House Rules Generator for Airbnb | Professional Property Rules"
        description="Generate professional, guest-ready house rules for your Airbnb, villa, or vacation rental. Customize for your property type, amenities, and policies. Free instant download."
        canonical="/tools/house-rules"
      />
      <Navbar />

      <LeadCaptureModal
        show={lead.showGate}
        email={lead.email}
        onEmailChange={lead.setEmail}
        onSubmit={onLeadSubmit}
        onClose={lead.closeGate}
        submitting={lead.submitting}
        error={lead.error}
        title="Download Your House Rules"
        description="Enter your email to download your personalized house rules document. We'll also share tips on automating your pricing with PricEye."
      />

      <div className="pt-24 lg:pt-32 pb-20">
        <div className="section-container">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            All Tools
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mb-12"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium tracking-wide uppercase mb-4">
              House Rules Generator
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold font-heading mb-3">
              Professional House Rules in{' '}
              <span className="text-gradient-brand">30 Seconds</span>
            </h1>
            <p className="text-slate-400">
              Select your property type, amenities, and policies. We generate a professional,
              guest-ready house rules document you can use immediately.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 space-y-8"
            >
              <div>
                <label className="text-sm text-slate-400 mb-3 block">Property Name (optional)</label>
                <input
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="e.g. Sunset Villa, Cozy Loft..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/25 transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-3 block">Property Type</label>
                <div className="flex flex-wrap gap-3">
                  {propertyTypes.map((pt) => (
                    <ToggleChip
                      key={pt.id}
                      selected={propertyType === pt.id}
                      label={pt.label}
                      icon={pt.icon}
                      onClick={() => setPropertyType(pt.id)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center justify-between text-sm text-slate-400 mb-3">
                  <span>Max Guests</span>
                  <span className="text-white font-semibold">{maxGuests}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Number(e.target.value))}
                  className="w-full accent-brand-accent h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-accent [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-brand-accent/30"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-3 block">Amenities</label>
                <div className="flex flex-wrap gap-3">
                  {amenities.map((a) => (
                    <ToggleChip
                      key={a.id}
                      selected={selectedAmenities.includes(a.id)}
                      label={a.label}
                      icon={a.icon}
                      onClick={() => toggleAmenity(a.id)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-3 block">Rules & Policies</label>
                <div className="flex flex-wrap gap-3">
                  {rules.map((r) => (
                    <ToggleChip
                      key={r.id}
                      selected={selectedRules.includes(r.id)}
                      label={r.label}
                      icon={r.icon}
                      onClick={() => toggleRule(r.id)}
                    />
                  ))}
                </div>
              </div>

              <button onClick={handleGenerate} className="w-full btn-primary justify-center">
                Generate House Rules
                <FileText className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {generated ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold font-heading">Your House Rules</h2>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopy}
                          className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                        <button
                          onClick={handleDownload}
                          className="text-sm text-brand-accent hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-accent/10 border border-brand-accent/30"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-xl p-6 max-h-[500px] overflow-y-auto">
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                        {rulesText}
                      </pre>
                    </div>

                    <div className="glass-card p-5 text-center border-brand-accent/20 bg-brand-accent/5">
                      <p className="text-sm text-slate-400 mb-3">
                        House rules set expectations. Dynamic pricing sets your revenue.
                      </p>
                      <Link to="/signup" className="btn-primary inline-flex text-sm">
                        Try PricEye AI Free
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    className="glass-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-500/10 to-cyan-500/10 border border-sky-500/20 flex items-center justify-center mb-6">
                      <FileText className="w-10 h-10 text-sky-400/50" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-300 mb-2">
                      Your House Rules Preview
                    </h3>
                    <p className="text-slate-500 text-sm max-w-sm">
                      Configure your property details on the left and click "Generate"
                      to create your professional house rules document.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
