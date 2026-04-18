const clientPromise = require('./mongodb');

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('security_bot');
  const collection = db.collection('configs');

  const { guildId } = req.query;

  if (req.method === 'GET') {
    // Lấy config
    if (!guildId) return res.status(400).json({ error: 'Missing guildId' });
    const config = await collection.findOne({ guildId });
    return res.status(200).json(config || { error: 'Not found' });
  }

  if (req.method === 'POST') {
    // Cập nhật config
    const { update } = req.body;
    if (!guildId || !update) return res.status(400).json({ error: 'Missing data' });
    
    await collection.updateOne(
      { guildId },
      { $set: update },
      { upsert: true }
    );
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
