import React from 'react';
import { Zap, Battery, BatteryCharging, Cpu, Home, Wrench, ShieldAlert, Monitor } from 'lucide-react';

export default function ProductImage({ 
  product, 
  categorySlug, 
  className = "w-full h-full object-contain",
  imageClassName = "" 
}) {
  const cat = categorySlug || product?.categoryId || '';
  const name = product?.name || '';
  
  // Custom styled vector representations for crisp product visuals
  const renderVisual = () => {
    if (cat === 'online-ups' || name.toLowerCase().includes('ups') || name.toLowerCase().includes('liebert') || name.toLowerCase().includes('smart-ups')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg">
          <div className="relative w-28 h-36 md:w-32 md:h-44 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-md shadow-lg border border-slate-700 p-2 flex flex-col justify-between">
            {/* Front Panel LCD */}
            <div className="bg-slate-950 border border-slate-700 rounded p-1.5 flex flex-col gap-1">
              <div className="flex justify-between items-center text-[7px] text-emerald-400 font-mono">
                <span className="flex items-center gap-0.5"><Zap className="w-2.5 h-2.5" /> 230V</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-4/5"></div>
              </div>
            </div>

            {/* Grill / Ventilation */}
            <div className="space-y-1 my-auto">
              <div className="h-0.5 bg-slate-700 rounded-full w-full"></div>
              <div className="h-0.5 bg-slate-700 rounded-full w-4/5 mx-auto"></div>
              <div className="h-0.5 bg-slate-700 rounded-full w-full"></div>
              <div className="h-0.5 bg-slate-700 rounded-full w-3/4 mx-auto"></div>
            </div>

            {/* Brand badge on unit */}
            <div className="text-center pt-1 border-t border-slate-700/60">
              <span className="text-[9px] font-black tracking-widest text-slate-300 uppercase">
                {product?.brandName || 'ONLINE UPS'}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (cat === 'smf-batteries' || name.toLowerCase().includes('smf') || name.toLowerCase().includes('quanta') || name.toLowerCase().includes('amaron')) {
      const isAmaron = name.toLowerCase().includes('amaron');
      const isLuminous = name.toLowerCase().includes('luminous');
      const bgCard = isAmaron ? 'from-emerald-700 to-emerald-900 border-emerald-600' : isLuminous ? 'from-blue-700 to-blue-900 border-blue-600' : 'from-slate-800 to-slate-950 border-slate-700';

      return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg">
          <div className={`relative w-36 h-28 md:w-44 md:h-32 bg-gradient-to-b ${bgCard} rounded-md shadow-md border p-2 flex flex-col justify-between text-white`}>
            {/* Terminals */}
            <div className="flex justify-between px-3 -mt-3.5">
              <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow flex items-center justify-center text-[7px] font-bold">+</div>
              <div className="w-3 h-3 bg-slate-800 rounded-full border-2 border-white shadow flex items-center justify-center text-[7px] font-bold">-</div>
            </div>

            <div className="text-center mt-2">
              <span className="text-xs md:text-sm font-black tracking-wider uppercase block">
                {product?.brandName || 'SMF VRLA'}
              </span>
              <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded text-white inline-block mt-0.5">
                {product?.capacity || '150Ah / 12V'}
              </span>
            </div>

            <div className="text-[7px] text-white/80 text-center tracking-tight font-medium">
              SEALED MAINTENANCE FREE • HEAVY DUTY
            </div>
          </div>
        </div>
      );
    }

    if (cat === 'tubular-batteries' || name.toLowerCase().includes('tubular') || name.toLowerCase().includes('exide')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg">
          <div className="relative w-36 h-32 md:w-44 md:h-36 bg-gradient-to-b from-white to-slate-100 rounded-md shadow-md border-2 border-red-600 p-2 flex flex-col justify-between">
            {/* Top red header bar with 6 caps */}
            <div className="bg-red-600 -mx-2 -mt-2 p-1 rounded-t flex justify-around items-center">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-2 h-2.5 bg-yellow-400 rounded-sm border border-yellow-600 shadow-xs"></div>
              ))}
            </div>

            <div className="text-center my-auto">
              <span className="text-base md:text-lg font-black text-red-600 tracking-tighter uppercase font-mono block">
                {product?.brandName || 'EXIDE'}
              </span>
              <span className="text-[10px] font-extrabold text-slate-800 tracking-tight block">
                INVA TUBULAR • {product?.capacity || '150Ah'}
              </span>
              <span className="text-[8px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                Deep Cycle Life
              </span>
            </div>

            <div className="text-[7px] text-center text-slate-500 font-semibold border-t pt-1">
              HADI HIGH PRESSURE DIE CAST SPINE
            </div>
          </div>
        </div>
      );
    }

    if (cat === 'home-inverter' || name.toLowerCase().includes('inverter')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg">
          <div className="relative w-36 h-24 md:w-44 md:h-28 bg-gradient-to-r from-slate-100 via-white to-slate-200 rounded-md shadow-md border border-slate-300 p-2 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-[9px] font-black text-slate-800 uppercase">
                {product?.brandName || 'SINE WAVE'}
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>

            {/* Display screen */}
            <div className="bg-slate-900 text-emerald-400 font-mono text-[9px] px-2 py-1 rounded flex justify-between items-center">
              <span>UPS ON</span>
              <span>230V OUT</span>
            </div>

            <div className="flex justify-between items-center text-[8px] text-slate-600 font-medium">
              <span>DSP PURE SINE WAVE</span>
              <span className="font-bold text-blue-600">{product?.capacity || '1100VA'}</span>
            </div>
          </div>
        </div>
      );
    }

    if (cat === 'stabilizer' || name.toLowerCase().includes('stabilizer')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg">
          <div className="relative w-32 h-28 md:w-36 md:h-32 bg-white rounded-md shadow-md border-2 border-slate-300 p-2 flex flex-col justify-between">
            <div className="text-center font-bold text-[9px] text-slate-700">
              AUTOMATIC VOLTAGE STABILIZER
            </div>
            {/* Digital Voltage Display */}
            <div className="bg-red-950 text-red-500 font-mono text-center font-bold text-xs py-1 rounded border border-red-800">
              220 V
            </div>
            <div className="flex justify-between text-[7px] font-bold text-emerald-700">
              <span>INPUT: 90-300V</span>
              <span>HIGH/LOW CUT</span>
            </div>
          </div>
        </div>
      );
    }

    if (cat === 'small-backups' || name.toLowerCase().includes('small') || name.toLowerCase().includes('600va')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg">
          <div className="relative w-24 h-32 md:w-28 md:h-36 bg-slate-900 rounded shadow-md border border-slate-700 p-2 flex flex-col justify-between text-white">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mx-auto shadow-sm"></div>
            <div className="text-center my-auto">
              <span className="text-[10px] font-bold text-slate-300 block">{product?.brandName || 'DESKTOP'}</span>
              <span className="text-[8px] text-slate-400">600VA / 360W</span>
            </div>
            <div className="text-[7px] text-center text-slate-500 font-mono">AVR PROTECTION</div>
          </div>
        </div>
      );
    }

    if (cat === 'lithium-ups-batteries' || name.toLowerCase().includes('lithium')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg">
          <div className="relative w-36 h-28 md:w-44 md:h-32 bg-gradient-to-r from-emerald-900 to-slate-900 rounded-md shadow-md border border-emerald-500 p-2 flex flex-col justify-between text-white">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-emerald-400">LiFePO4 51.2V</span>
              <span className="text-[7px] bg-emerald-600 px-1 rounded">BMS ACTIVE</span>
            </div>
            <div className="text-center font-black text-sm text-white">
              {product?.capacity || '5.12 kWh'}
            </div>
            <div className="text-[7px] text-slate-300 text-center font-mono">
              6000+ CYCLES • 10 YR LIFE
            </div>
          </div>
        </div>
      );
    }

    if (cat === 'ups-services') {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-sky-50 to-blue-100 rounded-lg">
          <div className="relative w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center text-blue-800">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md mb-2">
              <Wrench className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase text-center text-[#0f2b48]">Certified Engineer</span>
          </div>
        </div>
      );
    }

    // Default icon container
    return (
      <div className="w-full h-full flex items-center justify-center p-4 bg-slate-50 rounded-lg">
        <Zap className="w-12 h-12 text-[#16a34a]" />
      </div>
    );
  };

  return (
    <div className={`relative flex items-center justify-center overflow-hidden select-none ${className}`}>
      {renderVisual()}
    </div>
  );
}
