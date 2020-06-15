const express = require("express");
const db = require("../data/dbConfig.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const accounts = await db("accounts");
    res.status(200).json(accounts);
  } catch (e) {
    res.status(500).json({ message: "Unable to get accounts" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const account = await db("accounts").where({ id });

    if (account.length === 0) {
      return res
        .status(400)
        .json({ message: "The specified id does not exist " });
    }

    res.status(200).json(account[0]);
  } catch (e) {
    res.status(500).json({ message: "Unable to get account" });
  }
});

router.post("/", async (req, res) => {
  const { name, budget } = req.body;
  if (!name || !budget) {
    return res.status(400).json({ message: "Name and budget are required" });
  }

  try {
    const [id] = await db("accounts").insert({ name, budget });
    const account = await db("accounts").where({ id });
    res.status(201).json(account[0]);
  } catch (e) {
    res.status(500).json({ message: "Unable to create account" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, budget } = req.body;
  const changes = {};

  if (!name && !budget) {
    return res
      .status(400)
      .json({ message: "Missing required field name or budget" });
  }

  if (name) {
    changes.name = name;
  }

  if (budget) {
    changes.budget = budget;
  }

  try {
    const account = await db("accounts").where({ id });

    if (account.length === 0) {
      return res
        .status(400)
        .json({ message: "The specified id does not exist " });
    }

    await db("accounts")
      .where({ id })
      .update(changes);

    let updatedAccount = { ...account[0], ...changes };
    res.status(200).json(updatedAccount);
  } catch (e) {
    res.status(500).json({ message: "Unable to update account" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const account = await db("accounts").where({ id });

    if (account.length === 0) {
      return res
        .status(400)
        .json({ message: "The specified id does not exist " });
    }

    await db("accounts")
      .where({ id })
      .del();
    res.status(200).json(account);
  } catch (e) {
    res.status(500).json({ message: "Unable to remove account" });
  }
});

module.exports = router;
