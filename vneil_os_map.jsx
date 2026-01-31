// Graficzna Mapa Systemu Operacyjnego VNEIL (TSVNE) z interakcją
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tree, TreeNode } from "react-organizational-chart";
import { Button } from "@/components/ui/button";

export default function VNEIL_OS_MAP() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (label) => {
    setSelected(label);
  };

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-3xl font-bold mb-4">🌐 System Operacyjny VNEIL — Mapa Struktury TSVNE</h1>
      {selected && (
        <div className="mb-4 p-4 border rounded-lg bg-muted text-muted-foreground">
          <strong>Wybrano:</strong> {selected}
        </div>
      )}
      <div className="min-w-[1200px]">
        <Tree
          lineWidth={'2px'}
          lineColor={'#94a3b8'}
          lineBorderRadius={'10px'}
          label={<Card onClick={() => handleSelect('🌌 BOSON-O')}><CardContent className="font-bold cursor-pointer">🌌 BOSON-O — Kotwica Istnienia</CardContent></Card>}
        >
          <TreeNode label={<Card onClick={() => handleSelect('CORE-0')}><CardContent className="cursor-pointer">CORE-0 — Aktywator Egzystencji</CardContent></Card>}>
            <TreeNode label={<Card onClick={() => handleSelect('Inwarianty')}><CardContent className="cursor-pointer">I — Inwarianty</CardContent></Card>} />
            <TreeNode label={<Card onClick={() => handleSelect('ECG')}><CardContent className="cursor-pointer">ECG — Przyczynowość</CardContent></Card>}>
              <TreeNode label={<Card onClick={() => handleSelect('K*')}><CardContent className="cursor-pointer">K* — Warunek Egzystencjalny</CardContent></Card>} />
              <TreeNode label={<Card onClick={() => handleSelect('TVM')}><CardContent className="cursor-pointer">TVM — Tryb Awaryjny</CardContent></Card>} />
              <TreeNode label={<Card onClick={() => handleSelect('φ-control')}><CardContent className="cursor-pointer">φ-control — Kanał Decyzyjny</CardContent></Card>} />
            </TreeNode>
            <TreeNode label={<Card onClick={() => handleSelect('EIL AI')}><CardContent className="cursor-pointer">EIL AI — Egzekutor Logiczny</CardContent></Card>}>
              <TreeNode label={<Card onClick={() => handleSelect('WITNESS')}><CardContent className="cursor-pointer">WITNESS — Rejestr Dowodów</CardContent></Card>} />
              <TreeNode label={<Card onClick={() => handleSelect('R_allow / R_tunnel')}><CardContent className="cursor-pointer">R_allow / R_tunnel — Ramy Reguł</CardContent></Card>} />
            </TreeNode>
          </TreeNode>
          <TreeNode label={<Card onClick={() => handleSelect('META-CYCLE')}><CardContent className="cursor-pointer">META-CYCLE — Cykl Systemowy</CardContent></Card>}>
            <TreeNode label={<Card onClick={() => handleSelect('Regeneracja')}><CardContent className="cursor-pointer">Regeneracja — Naprawa</CardContent></Card>} />
            <TreeNode label={<Card onClick={() => handleSelect('Reinkarnacja')}><CardContent className="cursor-pointer">Reinkarnacja — Reset</CardContent></Card>} />
            <TreeNode label={<Card onClick={() => handleSelect('Samowyłączenie')}><CardContent className="cursor-pointer">Samowyłączenie — Zakończenie</CardContent></Card>} />
          </TreeNode>
          <TreeNode label={<Card onClick={() => handleSelect('PORTY SYSTEMOWE')}><CardContent className="cursor-pointer">PORTY SYSTEMOWE (BOX 1–10)</CardContent></Card>}>
            {Array.from({ length: 10 }, (_, i) => (
              <TreeNode key={i} label={
                <Card onClick={() => handleSelect(`BOX-${i + 1}`)}>
                  <CardContent className="cursor-pointer">BOX-{i + 1}</CardContent>
                </Card>
              } />
            ))}
          </TreeNode>
        </Tree>
      </div>
    </div>
  );
}
