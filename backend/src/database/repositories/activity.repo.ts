import { ObjectId } from 'mongodb';
import { Activity } from '../models/activity.model';
import { ActivityType } from '../../types/Activity.types';
import Validator from '../../utils/Validator.utils';

class ActivityRepo {
  async getActivityById(id: string) {
    Validator.validateId(id, 'Invalid activity ID');
    return await Activity.findById(id).populate('tags');
  }

  async createActivity(activity: ActivityType) {
    return await Activity.create(activity);
  }

  async updateActivity(id: string, activity: ActivityType) {
    Validator.validateId(id, 'Invalid activity ID');
    return await Activity.findByIdAndUpdate(id, activity);
  }

  async deleteActivity(id: string) {
    Validator.validateId(id, 'Invalid activity ID');
    return await Activity.deleteOne({ _id: new ObjectId(id) });
  }

  async getAllActivities(attributeName?: string, attributeValue?: RegExp | string) {
    const query = attributeName && attributeValue ? { [attributeName]: attributeValue } : {};
    return await Activity.find(query).populate('tags');
  }

  async getActivitiesByCreator(creator: string) {
    return await Activity.find({ created_by: creator });
  }
}

export default new ActivityRepo();
