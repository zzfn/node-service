export function toHump(name) {
  return name.replace(/_(\w)/g, function(all, letter){
    return letter.toUpperCase();
  });
}
