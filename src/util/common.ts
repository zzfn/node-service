export function toHump(name) {
  return name.replace(/_(\w)/g, (all, letter) => {
    return letter.toUpperCase();
  });
}
