import express from "express";
import "express-async-errors";

import validator from "express-validator";
import validate from "../utils/valid.js";
import prisma from "../utils/db.js";

const { body, param } = validator;
const router = express.Router();

// router.post("/add", validate([body("name").isString()]), async (req, res) => {
//   const post = await prisma.author.create({
//     data: req.body,
//   });
//   res.json(post);
// });

export default router;
