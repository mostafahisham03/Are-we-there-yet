import { ObjectId } from 'mongodb';
import { ValidationException } from '../exceptions/ValidationException';

class Validator {
  static validateId(id: string, msg: string): boolean {
    if (!ObjectId.isValid(id)) {
      throw new ValidationException(msg);
    }

    return true;
  }

  static validatePassword(password: string): boolean {
    if (password === undefined || password.length < 8) {
      throw new ValidationException('Password must be at least 8 characters long');
    }

    if (!password.match(/[0-9]/g)) {
      throw new ValidationException('Password must contain at least one number');
    }

    return true;
  }
}

export default Validator;
