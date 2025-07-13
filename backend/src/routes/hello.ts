import { Router } from "express";
import { getHello } from "../controller/hello";
import { getWhoisInfo } from "../controller/whois.controller";

const router = Router();

router.get("/hello", getHello);

router.get("/whois/:domain", getWhoisInfo);

export default router;