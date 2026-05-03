export function maskPhone(phone) {
  if (!phone) return null;
  const str = phone.replace(/\s+/g, '');
  if (str.length < 10) return phone;
  
  const ccPart = str.substring(0, 4);
  const nextTwo = str.substring(4, 6);
  const lastFour = str.substring(str.length - 4);
  return `${ccPart} ${nextTwo} *** ${lastFour}`;
}

export function maskDob(date) {
  if (!date) return null;
  const d = new Date(date);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${month} **, ${year}`;
}
