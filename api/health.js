const { KEY, CORS } = require('../lib/prompt');

module.exports = function handler(req, res) {
  Object.keys(CORS).forEach(k => res.setHeader(k, CORS[k]));
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  res.status(200).json({ ready: true, ai: Boolean(KEY), service: 'form54-translate' });
};
