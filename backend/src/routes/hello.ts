import { Router } from "express";
import { getHello } from "../controller/hello";
import { getWhoisInfo } from "../controller/whois.controller";
import { getWmn } from "../controller/whatmyname.controller";
import { checkPasswordHibp } from "../controller/hibp.controller";


const router = Router();

router.get("/hello", getHello);

router.post("/whois", getWhoisInfo);

router.post("/wmn", getWmn);

router.post("/hibp", checkPasswordHibp);

export default router;