export const formatPrice = (price: number) => {
    if (!price) return "0";
  return (
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      style: "currency",
      currency: "USD",
    }).format(price) 
  );
};
