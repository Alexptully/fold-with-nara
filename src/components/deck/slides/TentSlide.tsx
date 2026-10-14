"use client";

import { TentExterior, TentPlan } from "@/components/art/Tent";
import { tent } from "@/content/content";
import { KeyValueList, SlideShell } from "../primitives";
import type { SlideProps } from "../types";

export function TentSlide({ step }: SlideProps) {
  return (
    <SlideShell heading={tent.heading}>
      <div className="absolute left-16 top-[150px] h-[700px] w-[1100px]">
        <TentExterior jp={tent.signJp} en={tent.signEn} />
      </div>
      <div className="absolute right-20 top-[160px] h-[600px] w-[580px]">
        <TentPlan labels={tent.plan} show={step >= 2} />
      </div>
      <div className="absolute left-24 right-24 top-[860px]">
        <KeyValueList rows={tent.facts} keyWidth={140} size="small" perRow={2} />
      </div>
    </SlideShell>
  );
}
