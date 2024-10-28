import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { accountType } from '../../types/User.types';
import { reviewSchema } from './review.model';

const userSchema = new mongoose.Schema(
  {
    account_type: {
      type: String,
      enum: Object.values(accountType),
      required: true,
    },
    accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    email: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile_number: {
      type: String,
    },
    nationality: {
      type: String,
    },
    dob: {
      type: Date,
    },
    job: {
      type: String,
    },
    years_of_experience: {
      type: Number,
    },
    previous_work: {
      type: [String],
    },
    website: {
      type: String,
    },
    hotline: {
      type: String,
    },
    company_profile: {
      type: [String],
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    wallet: {
      type: Number,
    },
    profile_pic: {
      type: { type: Schema.Types.ObjectId, ref: 'attachment' },
    },
    reviews: {
      type: [reviewSchema],
    },
    average_rating: {
      type: Number,
    },
    modified_by: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

export const User = model('User', userSchema);
