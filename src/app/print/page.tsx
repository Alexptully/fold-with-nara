import type { Metadata } from "next";
import { PrintDeck } from "@/components/deck/PrintDeck";

export const metadata: Metadata = { title: "Print the deck" };

export default function PrintPage() {
  return <PrintDeck />;
}
