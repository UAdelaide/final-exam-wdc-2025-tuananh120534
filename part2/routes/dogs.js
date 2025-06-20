// GET /api/dogs/mydogs - returns dogs owned by logged-in user
router.get('/mydogs', async (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'owner') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const [rows] = await db.query(
      `SELECT dog_id, name FROM Dogs WHERE owner_id = ?`,
      [user.user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});
