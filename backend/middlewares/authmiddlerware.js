router.get("/me", protect, async (req, res) => {
    res.status(200).json({ user: req.user });
  });
  