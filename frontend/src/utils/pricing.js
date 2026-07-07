export const LOW_STOCK_THRESHOLD = 8;
export const CRITICAL_STOCK_THRESHOLD = 5;

export function getVariation(previousPrice, currentPrice) {
  if (previousPrice <= 0) {
    return 0;
  }

  return ((currentPrice - previousPrice) / previousPrice) * 100;
}

export function getStatus(product) {
  const variation = getVariation(product.previousPrice, product.currentPrice);

  if (variation > 10) {
    return {
      tone: "critical",
      label: "Critico",
      variation,
    };
  }

  if (variation > 0) {
    return {
      tone: "warning",
      label: "Atencion",
      variation,
    };
  }

  return {
    tone: "stable",
    label: "Estable",
    variation,
  };
}

export function isLowStock(stock) {
  return stock <= LOW_STOCK_THRESHOLD;
}

export function isCriticalStock(stock) {
  return stock <= CRITICAL_STOCK_THRESHOLD;
}
