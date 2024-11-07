import { Router } from 'express';
import {
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  createActivity,
  getActivitiesByCreator,
} from '../controllers/activity.controller';
import BookingController from '../controllers/booking.controller';

const activityRouter = Router();

activityRouter.post('/bookings', BookingController.bookActivity);

activityRouter.get('/', getAllActivities);
activityRouter.get('/mine', getActivitiesByCreator);
activityRouter.get('/:id', getActivityById);
activityRouter.post('/', createActivity);
activityRouter.put('/:id', updateActivity);
activityRouter.delete('/:id', deleteActivity);

export default activityRouter;