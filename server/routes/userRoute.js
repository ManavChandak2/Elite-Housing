import express from 'express';
import { 
    bookVisit, 
    cancelBooking, 
    createUser, 
    getAllBookings, 
    getAllFav, 
    toFav 
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/bookVisit/:id', bookVisit);
router.post('/allBookings', getAllBookings);
router.post('/cancelBooking/:id', cancelBooking);
router.post('/toFav/:id', toFav);
router.post('/allFav', getAllFav);

export default router;
