export function getFirstLastInitials(name: string): string {
  const words = name.trim().split(' ');
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
export function getMergedName(name: string): string {
  const words = name.trim().split(" ");
  return words.map(word => word.trim()).join("+");
}