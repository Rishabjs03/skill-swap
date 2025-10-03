"use client";
import React from "react";

export default function Background() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #fff 40%, #7c3aed 100%)",
        }}
      />
    </div>
  );
}
