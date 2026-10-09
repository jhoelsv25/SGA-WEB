export function cleanDescription(desc: string): string {
  if (!desc) return "";
  return desc
    .replace(/\s*\((RF-[^)]*|P-[^)]*)\)/gi, "")
    .replace(/\s*\(\s*\)/g, "")
    .trim();
}
