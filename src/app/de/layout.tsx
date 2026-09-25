// Segment /de: tresc po niemiecku. Root layout (src/app/layout.tsx) ma na sztywno
// <html lang="pl"> i nie da sie go zmienic w zagniezdzonym layoucie bez
// przebudowy na route groups (rewolucja poza zakresem) - dlatego jezyk
// oznaczamy atrybutem lang="de" na kontenerze segmentu (WCAG 3.1.2 - jezyk
// fragmentu). PRAWNIK/DEV: jesli /de ma sie rozrosnac, rozwazyc route groups
// z osobnym root layoutem <html lang="de">.
export default function DeLayout({ children }: { children: React.ReactNode }) {
  return <div lang="de">{children}</div>
}
