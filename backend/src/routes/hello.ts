import { Router } from "express";
import { getHello } from "../controller/hello";

const router = Router();

router.get("/hello", getHello);

export default router;