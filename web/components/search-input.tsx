'use client';

import { useEffect, useRef, useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setLocal(value);
  }, [value]);

  function handleChange(v: string) {
    setLocal(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(v), 300);
  }

  return (
    <input
      type="text"
      value={local}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      className="px-3 py-1.5 text-sm border border-gray-300 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
  );
}
