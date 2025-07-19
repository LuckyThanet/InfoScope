import { Router } from "express";
import { insertCase } from "../controller/insert-controller";
import { getHistory } from "../controller/getHistory-controller";
import { getResult } from "../controller/getResults-controller";
import { deleteCaseById } from "../controller/deleteCase-controller";
import { startInvestigation } from "../controller/startInvestigate-controller";

const router = Router();

router.get("/insert", insertCase);

router.post("/history", getHistory);

router.get("/result/:id", getResult);

router.delete('/delete', deleteCaseById);

router.post('/investigate', startInvestigation);

export default router;