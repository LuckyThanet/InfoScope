import { Router } from "express";
import { getHello } from "../controller/hello";
import { getWhoisInfo } from "../controller/whois.controller";
import { getWmn } from "../controller/whatmyname.controller";
import { checkPasswordHibp } from "../controller/hibp.controller";
import { insertCase } from "../controller/insert-controller";
import { getHistory } from "../controller/getHistory-controller";
import { getResult } from "../controller/getResults-controller";
import { deleteCaseById } from "../controller/deleteCase-controller";
import { start } from "node:repl";
import { startInvestigation } from "../controller/startInvestigate-controller";

const router = Router();

router.get("/hello", getHello);

router.post("/whois", getWhoisInfo);

router.post("/wmn", getWmn);

router.post("/hibp", checkPasswordHibp);

router.get("/insert", insertCase);

router.post("/history", getHistory);

router.get("/result/:id", getResult);

router.delete('/delete/:id', deleteCaseById);

router.post('/investigate', startInvestigation);

export default router;