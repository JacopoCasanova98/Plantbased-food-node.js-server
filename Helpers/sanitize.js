function sanitizeInput(value) {
    if (typeof value === 'string' && /^[a-zA-Z0-9]+$/.test(value)) {
      return value;
    }
    return '';
  }
  
  module.exports = sanitizeInput;
