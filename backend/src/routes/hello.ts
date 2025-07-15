import { Router } from "express";
import { getHello } from "../controller/hello";
import { getWhoisInfo } from "../controller/whois.controller";
import { getWmn } from "../controller/whatmyname.controller";
import { checkPasswordHibp } from "../controller/hibp.controller";


const router = Router();

router.get("/hello", getHello);

router.get("/whois/:domain", getWhoisInfo);

router.get("/wmn/:account", getWmn);

router.get("/hibp/:password", checkPasswordHibp);

export default router;