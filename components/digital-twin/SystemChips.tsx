'use client';

import React from 'react';
import type { MotionValue } from 'framer-motion';
import { SystemKey } from '../../lib/systems';
import { SYSTEMS } from '../../lib/systems';

interface SystemChipsProps {
  activeKey: MotionValue<SystemKey>;
}

export default function SystemChips({ activeKey }: SystemChipsProps) {
  return (
    <div className='flex gap-2 overflow-x-auto pb-4 scrollbar-hide'>
      {SYSTEMS.map((system, index) => {
        const isActive = index === 0; // Пока показываем первую систему как активную

        return (
          <div
            key={system.key}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap
              transition-all duration-300 cursor-pointer
              ${
                isActive
                  ? 'bg-accent/20 border border-accent text-accent'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }
            `}
            style={{
              borderColor: isActive ? system.color : undefined,
              color: isActive ? system.color : undefined,
            }}
          >
            <div
              className='w-2 h-2 rounded-full'
              style={{ backgroundColor: system.color }}
            />
            {system.icon}
            <span className='text-sm font-medium'>{system.label}</span>
          </div>
        );
      })}
    </div>
  );
}
