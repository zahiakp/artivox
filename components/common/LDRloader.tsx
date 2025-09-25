import React from "react";
import { tailspin } from "ldrs";
import { hexColor } from "../../app/data/branding";

function LDRloader() {
  tailspin.register();
  return (
    <div className="w-full flex items-center justify-center">
    <l-tailspin size="40" stroke="5" speed="0.9" color={hexColor||"#f97316"}></l-tailspin>
    </div>
  );
}

export default LDRloader;
