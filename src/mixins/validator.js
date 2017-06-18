const rules = {};

rules.required = (value, b) => {
  rules.required.reason = 'cannot be empty';
  if (!b) return true;

  if (Array.isArray(value)) {
    return !!value.length;
  }

  if (value === undefined || value === null || value === false) {
    return false;
  }

  return !!String(value).length;
};

rules.min = (value, min) => {
  rules.min.reason = `cannot be less than ${min} characters`;

  if (value === undefined || value === null) {
    return false;
  }
  return String(value).length >= min;
};

rules.date = (value, b) => {
  rules.date.reason = 'must be a valid date';
  if (!b) return true;

  if (value === undefined || value === null) {
    return false;
  }
  return /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(value);
};

rules.dateMax = (value, max) => {
  rules.min.reason = `cannot be greater than ${max}`;

  if (value === undefined || value === null) {
    return false;
  }
  return new Date(value).getTime() <= max.getTime();
};

rules.max = (value, max) => {
  rules.max.reason = `cannot be more than ${max} characters`;

  if (value === undefined || value === null) {
    return false;
  }
  return String(value).length <= max;
};

rules.email = (value, b) => {
  rules.email.reason = "doesn't look like a valid email address";
  if (!b) return true;

  if (value === undefined || value === null) {
    return false;
  }
  return /\S+@\S+\.\S+/.test(value);
};

rules.fileSize = (file, b) => {
  rules.email.reason = 'file size exceeds limit of 10MB';
  if (!b) return true;


  if (file.size > 1e+7) { // > 10 MB
    return false;
  }
  return true;
};

rules.notSame = (value, other) => {
  rules.notSame.reason = 'cannot be same as old';
  if (value === undefined || value === null || other === undefined || other === null) {
    return false;
  }
  return value != other;
};

rules.match = (value, other) => {
  rules.match.reason = 'do not match';
  if (value === undefined || value === null || other === undefined || other === null) {
    return false;
  }

  return value === other;
};

export default {
  methods: {
    validate(value, opts) {
      let keys = Object.keys(opts);
      let valid = false;

      for (let i = 0; i < keys.length; i++) {
        let rule = keys[i];
        valid = rules[rule](value, opts[rule]);
        if (!valid) {
          return {
            valid,
            rule,
            message: rules[rule].reason,
          };
        }
      }

      return { valid };
    },
  },
};
