import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CustomSelect = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  // Закриття випадаючого списку при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary mb-1">
          {label}
        </label>
      )}

      {/* Кнопка виклику меню */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-sans rounded-xs bg-light-bg dark:bg-dark-bg border transition-all duration-150 cursor-pointer ${
          isOpen
            ? 'border-dark-accent ring-1 ring-dark-accent/30'
            : 'border-light-border dark:border-dark-border hover:border-dark-accent/60'
        } text-light-textPrimary dark:text-dark-textPrimary`}
      >
        <span className="truncate font-medium">{selectedOption.label}</span>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-light-textSecondary dark:text-dark-textSecondary transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-dark-accent' : ''
          }`} 
        />
      </button>

      {/* Кастомне красиве меню */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xs shadow-xl py-1 max-h-56 overflow-y-auto no-scrollbar">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-sans text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-dark-accent/15 text-dark-accent font-bold'
                    : 'text-light-textPrimary dark:text-dark-textPrimary hover:bg-light-bg dark:hover:bg-dark-bg'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-dark-accent shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};