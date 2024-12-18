export function compareBy(a, b, direction) {
  if (direction === "asc") {
    return compare(a, b);
  } else {
    return compare(b, a);
  }
}

export function compare(a, b) {
  if (typeof a === 'undefined' && typeof b === 'undefined') {
      return 0;
  } 
  else if (typeof a === 'undefined') {
    return -1;
  }
  else if (typeof b === 'undefined') {
    return 1;
  }

  if (typeof a === "string") {
    return a.localeCompare(b);
  } else if(typeof a === "number") {
    return a - b;
  } else {
    return 0;
  }
}