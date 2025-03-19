import express from 'express';
import { 
    bookVisit, 
    cancelBooking, 
    createUser, 
    getAllBookings, 
    getAllFav, 
    toFav 
} from '../controllers/userController.js';
import jwtCheck from '../config/auth0.js';

const router = express.Router();

router.post('/register', jwtCheck, createUser);
router.post('/bookVisit/:id', jwtCheck, bookVisit);
router.post('/allBookings', getAllBookings);
router.post('/cancelBooking/:id', jwtCheck, cancelBooking);
router.post('/toFav/:id', jwtCheck, toFav);
router.post('/allFav', jwtCheck, getAllFav);

export default router;
