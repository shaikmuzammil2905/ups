import React from 'react';
import { Zap, Battery, BatteryCharging, Cpu, Home, Wrench, ShieldAlert, Monitor, Sparkles } from 'lucide-react';

export default function ProductImage({ 
  product, 
  categorySlug, 
  className = "w-full h-full",
}) {
  const cat = (categorySlug || product?.categoryId || '').toLowerCase();
  const name = (product?.name || '').toLowerCase();
  const brand = (product?.brandName || '').toLowerCase();

  // 1. ONLINE UPS & APC SMART-UPS
  if (
    cat === 'online-ups' || 
    name.includes('apc') || 
    name.includes('smart-ups') || 
    name.includes('amplon') || 
    name.includes('numeric') ||
    name.includes('elnova')
  ) {
    const isAPC = name.includes('apc') || brand.includes('apc');
    return (
      <div className="w-full h-full flex items-center justify-center p-2 select-none">
        <div className="relative w-28 h-36 sm:w-32 sm:h-40 bg-gradient-to-b from-slate-800 via-slate-900 to-black rounded-xl shadow-lg border border-slate-700 p-2.5 flex flex-col justify-between overflow-hidden group-hover:shadow-emerald-500/20 transition-all">
          {/* Top Bezel & Power LED */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-700/80">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
              <span className="text-[7px] font-mono text-emerald-400 font-bold">ONLINE</span>
            </div>
            {isAPC && (
              <span className="text-[8px] font-black text-red-500 italic tracking-tighter">APC</span>
            )}
          </div>

          {/* LCD Status Screen */}
          <div className="bg-slate-950 rounded-lg p-2 border border-slate-800 flex flex-col gap-1 shadow-inner">
            <div className="flex justify-between text-[8px] text-emerald-400 font-mono">
              <span>IN: 230V</span>
              <span>OUT: 230V</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[85%]"></div>
            </div>
            <div className="flex justify-between text-[7px] text-slate-400 font-mono">
              <span>LOAD 85%</span>
              <span className="text-emerald-400">100% BATT</span>
            </div>
          </div>

          {/* Horizontal Ventilation Louvers */}
          <div className="space-y-1 my-auto">
            <div className="h-0.5 bg-slate-800 rounded-full w-full"></div>
            <div className="h-0.5 bg-slate-700 rounded-full w-5/6 mx-auto"></div>
            <div className="h-0.5 bg-slate-800 rounded-full w-full"></div>
            <div className="h-0.5 bg-slate-700 rounded-full w-4/6 mx-auto"></div>
          </div>

          {/* Bottom Brand Stamp */}
          <div className="text-center pt-1 border-t border-slate-800">
            <span className="text-[9px] font-extrabold tracking-widest text-slate-300 uppercase">
              {product?.brandName || 'ONLINE UPS'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. VERTIV LIEBERT UPS
  if (name.includes('vertiv') || name.includes('gxt5') || name.includes('liebert')) {
    return (
      <div className="w-full h-full flex items-center justify-center p-2 select-none">
        <div className="relative w-32 h-36 sm:w-36 sm:h-40 bg-gradient-to-b from-slate-100 via-white to-slate-200 rounded-xl shadow-lg border-2 border-slate-300 p-2.5 flex flex-col justify-between overflow-hidden">
          {/* Vertiv Header Logo */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <div className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-black fill-current">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <polygon points="12,6 18,10 18,14 12,18 6,14 6,10" fill="currentColor" />
              </svg>
              <span className="text-[9px] font-black tracking-widest text-black uppercase">VERTIV</span>
            </div>
            <span className="text-[7px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">2U RACK</span>
          </div>

          {/* Graphic Display Panel */}
          <div className="bg-slate-900 rounded-lg p-2 text-white border border-slate-700 space-y-1">
            <div className="flex justify-between text-[7px] text-emerald-400 font-mono">
              <span>Liebert® GXT5</span>
              <span>3000VA</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-[8px] font-mono text-slate-300">PF 1.0 UNITY</span>
            </div>
          </div>

          {/* Grills */}
          <div className="space-y-1 my-1">
            <div className="h-0.5 bg-slate-400 rounded-full w-full"></div>
            <div className="h-0.5 bg-slate-300 rounded-full w-full"></div>
            <div className="h-0.5 bg-slate-400 rounded-full w-full"></div>
          </div>

          <div className="text-center text-[8px] font-bold text-slate-500 uppercase">
            Double Conversion Online
          </div>
        </div>
      </div>
    );
  }

  // 3. EXIDE TUBULAR BATTERY
  if (cat === 'tubular-batteries' || name.includes('exide') || name.includes('tubular')) {
    return (
      <div className="w-full h-full flex items-center justify-center p-2 select-none">
        <div className="relative w-36 h-32 sm:w-40 sm:h-36 bg-gradient-to-b from-white via-slate-50 to-slate-100 rounded-xl shadow-md border-2 border-red-600 p-2 flex flex-col justify-between overflow-hidden">
          {/* Red Top Cover with 6 Yellow Ceramic Float Plugs */}
          <div className="bg-red-600 -mx-2 -mt-2 px-2 py-1.5 flex justify-between items-center shadow-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-white text-[7px] text-white flex items-center justify-center font-bold">-</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-2 h-3 bg-amber-400 rounded-xs border border-amber-600 shadow-2xs"></div>
              ))}
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-red-700 border border-white text-[7px] text-white flex items-center justify-center font-bold">+</div>
          </div>

          {/* Body Brand Badge */}
          <div className="text-center my-auto py-1">
            <span className="text-xl sm:text-2xl font-black text-red-600 tracking-tighter uppercase font-mono block leading-none">
              EXIDE
            </span>
            <span className="text-[9px] font-black text-slate-800 tracking-tight block mt-0.5">
              INVA TUBULAR • {product?.capacity || '150Ah'}
            </span>
            <span className="text-[7px] font-bold text-red-700 uppercase tracking-wider block">
              India's No. 1 Battery Brand
            </span>
          </div>

          {/* Lower Label */}
          <div className="bg-slate-100 -mx-2 -mb-2 p-1 text-center border-t border-slate-200">
            <span className="text-[8px] font-bold text-emerald-700">
              TORR TUBULAR • DEEP CYCLE
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 4. AMARON SMF BATTERY
  if (name.includes('amaron') || (cat === 'smf-batteries' && name.includes('amaron'))) {
    return (
      <div className="w-full h-full flex items-center justify-center p-2 select-none">
        <div className="relative w-36 h-30 sm:w-40 sm:h-32 bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900 rounded-xl shadow-md border-2 border-emerald-500 p-2.5 flex flex-col justify-between text-white overflow-hidden">
          {/* Top Terminals */}
          <div className="flex justify-between items-center px-2">
            <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow flex items-center justify-center text-[8px] font-bold">+</div>
            <span className="text-[8px] font-bold tracking-wider text-emerald-200 uppercase">Silven-X Alloy</span>
            <div className="w-3 h-3 bg-slate-900 rounded-full border-2 border-white shadow flex items-center justify-center text-[8px] font-bold">-</div>
          </div>

          {/* Amaron Center Logo */}
          <div className="text-center my-auto">
            <span className="text-lg sm:text-xl font-black text-white tracking-wider uppercase block leading-none drop-shadow-sm">
              AMARON
            </span>
            <span className="text-[10px] font-extrabold bg-white/20 text-white px-2 py-0.5 rounded-full inline-block mt-1">
              {product?.capacity || '200Ah'}
            </span>
          </div>

          <div className="text-[8px] text-center text-emerald-100 font-semibold border-t border-emerald-500/60 pt-1">
            ZERO MAINTENANCE • LONG LIFE
          </div>
        </div>
      </div>
    );
  }

  // 5. LUMINOUS SMF / INVERTER BATTERY
  if (cat === 'smf-batteries' || name.includes('luminous') || name.includes('inverlast') || name.includes('quanta')) {
    const isQuanta = name.includes('quanta');
    return (
      <div className="w-full h-full flex items-center justify-center p-2 select-none">
        <div className="relative w-36 h-30 sm:w-40 sm:h-32 bg-gradient-to-b from-blue-700 via-blue-800 to-slate-900 rounded-xl shadow-md border-2 border-blue-500 p-2.5 flex flex-col justify-between text-white overflow-hidden">
          {/* Top Terminals */}
          <div className="flex justify-between items-center px-2">
            <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow flex items-center justify-center text-[8px] font-bold">+</div>
            <span className="text-[8px] font-mono text-sky-200">VRLA AGM</span>
            <div className="w-3 h-3 bg-slate-900 rounded-full border-2 border-white shadow flex items-center justify-center text-[8px] font-bold">-</div>
          </div>

          {/* Center Logo */}
          <div className="text-center my-auto bg-white/10 rounded-lg py-1 px-2 border border-white/20">
            <span className="text-base sm:text-lg font-black text-white tracking-wider uppercase block leading-none">
              {isQuanta ? 'QUANTA' : 'LUMINOUS'}
            </span>
            <span className="text-[9px] font-bold text-sky-200 block mt-0.5">
              {product?.capacity || '150Ah / 12V'}
            </span>
          </div>

          <div className="text-[8px] text-center text-slate-300 font-medium border-t border-blue-600 pt-1">
            SEALED MAINTENANCE FREE
          </div>
        </div>
      </div>
    );
  }

  // 6. HOME INVERTER (LUMINOUS / MICROTEK SINE WAVE)
  if (cat === 'home-inverter' || name.includes('inverter') || name.includes('solar') || name.includes('zelio')) {
    const isMicrotek = name.includes('microtek');
    return (
      <div className="w-full h-full flex items-center justify-center p-2 select-none">
        <div className="relative w-36 h-28 sm:w-40 sm:h-30 bg-gradient-to-r from-slate-100 via-white to-slate-200 rounded-xl shadow-md border border-slate-300 p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-center border-b border-slate-200 pb-1">
            <span className="text-[9px] font-black text-slate-800 uppercase">
              {isMicrotek ? 'MICROTEK' : 'LUMINOUS'}
            </span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[7px] font-bold text-emerald-700">SOLAR MPPT</span>
            </div>
          </div>

          {/* Digital Display Screen */}
          <div className="bg-slate-950 text-emerald-400 font-mono text-[9px] px-2.5 py-1.5 rounded-lg border border-slate-800 flex justify-between items-center shadow-inner">
            <span className="flex items-center gap-1">⚡ UPS ON</span>
            <span>230V OUT</span>
          </div>

          <div className="flex justify-between items-center text-[8px] text-slate-600 font-bold border-t border-slate-200 pt-1">
            <span>DSP PURE SINE WAVE</span>
            <span className="text-blue-700">{product?.capacity || '1435VA'}</span>
          </div>
        </div>
      </div>
    );
  }

  // 7. LITHIUM UPS & BATTERIES
  if (cat === 'lithium-ups-batteries' || name.includes('lithium') || name.includes('lifepo4')) {
    return (
      <div className="w-full h-full flex items-center justify-center p-2 select-none">
        <div className="relative w-36 h-30 sm:w-40 sm:h-32 bg-gradient-to-br from-emerald-950 via-slate-900 to-black rounded-xl shadow-lg border-2 border-emerald-500 p-2.5 flex flex-col justify-between text-white overflow-hidden">
          <div className="flex justify-between items-center pb-1 border-b border-emerald-800">
            <span className="text-[9px] font-black text-emerald-400 flex items-center gap-1">
              <Cpu className="w-3 h-3" /> LiFePO4 51.2V
            </span>
            <span className="text-[7px] bg-emerald-600 px-1.5 py-0.5 rounded font-bold uppercase">BMS ACTIVE</span>
          </div>

          <div className="text-center my-auto py-1">
            <span className="text-base sm:text-lg font-black text-white block leading-none">
              {product?.capacity || '5.12 kWh'}
            </span>
            <span className="text-[8px] text-emerald-300 font-semibold block mt-0.5">
              6000+ Deep Cycles • 10 Yr Life
            </span>
          </div>

          <div className="text-[7px] text-slate-400 text-center font-mono border-t border-emerald-900 pt-1">
            CAN / RS485 SMART BALANCING
          </div>
        </div>
      </div>
    );
  }

  // 8. STABILIZER
  if (cat === 'stabilizer' || name.includes('stabilizer')) {
    return (
      <div className="w-full h-full flex items-center justify-center p-2 select-none">
        <div className="relative w-32 h-30 sm:w-36 sm:h-32 bg-white rounded-xl shadow-md border-2 border-slate-300 p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="text-center font-bold text-[8px] text-slate-700 uppercase tracking-wide">
            AUTOMATIC VOLTAGE STABILIZER
          </div>

          {/* Digital 7-segment Red LED Display */}
          <div className="bg-red-950 text-red-500 font-mono text-center font-black text-base py-1.5 rounded-lg border-2 border-red-800 shadow-inner">
            220 V
          </div>

          <div className="flex justify-between text-[7px] font-bold text-emerald-700 border-t border-slate-200 pt-1">
            <span>INPUT: 90-300V</span>
            <span>HIGH/LOW CUT</span>
          </div>
        </div>
      </div>
    );
  }

  // 9. SMALL BACKUPS
  if (cat === 'small-backups' || name.includes('small') || name.includes('600va')) {
    return (
      <div className="w-full h-full flex items-center justify-center p-2 select-none">
        <div className="relative w-26 h-34 sm:w-30 sm:h-36 bg-gradient-to-b from-slate-800 to-slate-950 rounded-xl shadow-md border border-slate-700 p-2.5 flex flex-col justify-between text-white overflow-hidden">
          <div className="w-3 h-3 rounded-full bg-emerald-400 mx-auto shadow-[0_0_6px_#34d399]"></div>
          <div className="text-center my-auto">
            <span className="text-[10px] font-black text-slate-200 block uppercase">
              {product?.brandName || 'DESKTOP'}
            </span>
            <span className="text-[8px] text-emerald-400 font-mono">600VA / 360W</span>
          </div>
          <div className="text-[7px] text-center text-slate-400 font-mono border-t border-slate-800 pt-1">
            AVR PROTECTION
          </div>
        </div>
      </div>
    );
  }

  // 10. SERVICES
  if (cat === 'ups-services') {
    return (
      <div className="w-full h-full flex items-center justify-center p-2 select-none">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-emerald-50 rounded-2xl border border-blue-200 p-2 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-md mb-1.5">
            <Wrench className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase text-center text-[#0f2b48]">
            Certified Engineer
          </span>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="w-full h-full flex items-center justify-center p-2 select-none">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#16a34a] flex items-center justify-center">
        <Zap className="w-8 h-8" />
      </div>
    </div>
  );
}
