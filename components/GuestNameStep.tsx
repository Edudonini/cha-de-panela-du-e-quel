"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FourPointStar } from "@/components/vintage/FourPointStar";

interface GuestNameStepProps {
  onNameChange: (name: string) => void;
  initialName?: string;
}

export function GuestNameStep({ onNameChange, initialName }: GuestNameStepProps) {
  const [name, setName] = useState(initialName || "");

  useEffect(() => {
    const savedName = localStorage.getItem("guest_name");
    if (savedName) {
      setName(savedName);
      onNameChange(savedName);
    }
  }, [onNameChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    localStorage.setItem("guest_name", newName);
    onNameChange(newName);
  };

  return (
    <Card className="relative overflow-visible">
      {/* Decoração de cantos */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#722F37]" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#722F37]" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#722F37]" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#722F37]" />

      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <FourPointStar size={10} color="rose" />
          <CardTitle className="text-[#722F37]">Qual é o seu nome?</CardTitle>
          <FourPointStar size={10} color="rose" />
        </div>
        <CardDescription>
          Vamos usar seu nome para personalizar sua experiência
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Label htmlFor="guest-name" className="font-display text-sm text-[#2D2926]">
            Nome
          </Label>
          <Input
            id="guest-name"
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={handleChange}
            className="w-full text-center md:text-left"
          />
        </div>
      </CardContent>
    </Card>
  );
}
