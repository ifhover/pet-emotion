export function getRealIp(req: Request): undefined | string {
  const result =
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    (req['socket'] as any).remoteAddress ||
    (req['ip'] as any);
  return Array.isArray(result) ? result[0] : result;
}
