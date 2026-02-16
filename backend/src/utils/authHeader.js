export const getBearerToken = (authorizationHeader) => {
  if (!authorizationHeader || typeof authorizationHeader !== 'string') {
    return null;
  }

  const [type, token, ...rest] = authorizationHeader.trim().split(/\s+/);
  if (rest.length > 0 || type !== 'Bearer' || !token) {
    return null;
  }

  return token;
};
