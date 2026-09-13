export const LOGIN_ID_MIN_LENGTH = 4;
export const LOGIN_ID_MAX_LENGTH = 20;
export const SIGNUP_PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;
export const NICKNAME_MIN_LENGTH = 2;
export const NICKNAME_MAX_LENGTH = 12;

export const LOGIN_ID_PATTERN = /^[A-Za-z0-9_]+$/;
export const NICKNAME_PATTERN = /^[\p{L}\p{N}_ ]+$/u;

export const isLoginIdLengthValid = (value) => {
  const length = value.trim().length;
  return length >= LOGIN_ID_MIN_LENGTH && length <= LOGIN_ID_MAX_LENGTH;
};

export const isLoginIdCharacterValid = (value) =>
  !value.trim() || LOGIN_ID_PATTERN.test(value.trim());

export const isSignupPasswordLengthValid = (value) =>
  value.length >= SIGNUP_PASSWORD_MIN_LENGTH && value.length <= PASSWORD_MAX_LENGTH;

// Login keeps backward compatibility with accounts created under the old minimum-length rule.
export const isLoginPasswordLengthValid = (value) =>
  value.length >= 1 && value.length <= PASSWORD_MAX_LENGTH;

export const isNicknameLengthValid = (value) => {
  const length = value.trim().length;
  return length >= NICKNAME_MIN_LENGTH && length <= NICKNAME_MAX_LENGTH;
};

export const isNicknameCharacterValid = (value) =>
  !value.trim() || NICKNAME_PATTERN.test(value.trim());
