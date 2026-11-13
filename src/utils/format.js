export const formatNaira = (value) =>
  `₦${Number(value || 0).toLocaleString('en-NG')}`;
