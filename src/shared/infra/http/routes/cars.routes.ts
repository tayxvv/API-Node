import { CreateCarController } from "@modules/cars/useCases/createCar/CreateCarController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ListAvailableCarsController } from "@modules/cars/useCases/listAvailableCars/ListAvailableCarsController";
import { CreateCarSpecificationController } from "@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController";
import { UploadCarImageController } from "@modules/cars/useCases/uploadCarImage/UploadCarImageController";
import multer from "multer";
import uploadConfig from '../../../../config/upload';


const carsRoutes = Router();

const createCarController = new CreateCarController();

const listAvailableCarsController = new ListAvailableCarsController();

const createCarsSpecificationController = new CreateCarSpecificationController();

const uploadCarImageController = new UploadCarImageController();

const upload = multer(uploadConfig.upload("./tmp/avatar"));

carsRoutes.post("/", ensureAuthenticated, ensureAdmin, createCarController.handle);

carsRoutes.get("/available", listAvailableCarsController.handle);

carsRoutes.post("/specifications/:id", createCarsSpecificationController.handle);

carsRoutes.post("/images", ensureAuthenticated, ensureAdmin, upload.array("images"), uploadCarImageController.handle());

export { carsRoutes };