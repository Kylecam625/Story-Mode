export function calculateTrustChange(): number {
  return Math.floor(Math.random() * 11) - 5; // Random number between -5 and 5
}

export function updateRelationship(
  relation: { trust: number },
  trustChange: number
): { trust: number } {
  return {
    ...relation,
    trust: Math.max(0, Math.min(100, relation.trust + trustChange))
  };
}

export function formatRelationshipChange(name: string, change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${name}(${sign}${change} Trust)`;
}