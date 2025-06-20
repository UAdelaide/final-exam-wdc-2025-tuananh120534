router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.execute('SELECT * FROM Users WHERE username = ? AND password = ?', [username, password]);

  if (rows.length > 0) {
    const user = rows[0];
    req.session.user = { id: user.user_id, username: user.username, role: user.role };

    if (user.role === 'owner') {
      res.redirect('/owner');
    } else if (user.role === 'walker') {
      res.redirect('/walker');
    }
  } else {
    res.status(401).send('Invalid credentials');
  }
});
