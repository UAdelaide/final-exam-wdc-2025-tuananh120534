router.get('/mydogs', async (req, res) => {
  try {
    const ownerId = req.session.user?.user_id;

    if (!ownerId) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    const [rows] = await db.query('SELECT dog_id, name FROM Dogs WHERE owner_id = ?', [ownerId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching owner\'s dogs:', err);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});
