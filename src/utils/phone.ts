const phoneRegex = /^[0-9]{10}$/;


export function isValidPhone(phone: string) {
  return phoneRegex.test(phone);
}