export function setValueIfNotNull(value, valueToSet) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }
  }
  if (value === {}) {
    return null;
  }
  let isNull = false;
  switch (value) {
    case 0:
    case null:
    case undefined:
    case false:
    case "":
      isNull = true;
      break;
    default:
      break;
  }

  if (isNull) {
    return null;
  }
  return valueToSet;
}
