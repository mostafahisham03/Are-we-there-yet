import { Request, Response } from 'express';
import MuseumRepo from '../database/repositories/museum.repo';
import { logger } from '../middlewares/logger.middleware';
import { ResponseStatusCodes } from '../types/ResponseStatusCodes.types';
import mongoose from 'mongoose';
import currencyConverterService from '../services/currencyConverter.service';

const getAllMuseums = async (req: Request, res: Response) => {
  try {
    let museums = await MuseumRepo.getAllMuseums();

    const currency: string = await req.currency.currency;
    museums = await Promise.all(
      museums.map(async (museum) => {
        if (museum.ticket_prices?.foreigner) {
          museum.ticket_prices.foreigner = await currencyConverterService.convertPrice(
            museum.ticket_prices?.foreigner,
            currency
          );
        }
        if (museum.ticket_prices?.native) {
          museum.ticket_prices.native = await currencyConverterService.convertPrice(
            museum.ticket_prices?.native,
            currency
          );
        }
        if (museum.ticket_prices?.student) {
          museum.ticket_prices.student = await currencyConverterService.convertPrice(
            museum.ticket_prices?.student,
            currency
          );
        }
        return museum;
      })
    );

    const response = {
      message: 'Museums fetched successfully',
      data: { museums: museums },
      currency: currency,
    };

    res.status(ResponseStatusCodes.OK).json(response);
  } catch (error: any) {
    logger.error(`Error fetching museums: ${error.message}`);
    res.status(ResponseStatusCodes.BAD_REQUEST).json({ message: error.message, data: [] });
  }
};

const getMuseumsCreatedByUser = async (req: Request, res: Response) => {
  try {
    const museums = await MuseumRepo.getMuseumsByCreator(req.user.userId);
    const response = {
      message: 'Museums fetched successfully',
      data: { museums: museums },
    };

    res.status(ResponseStatusCodes.OK).json(response);
  } catch (error: any) {
    logger.error(`Error fetching museums: ${error.message}`);
    res.status(ResponseStatusCodes.BAD_REQUEST).json({ message: error.message, data: [] });
  }
};

const findMuseumById = async (req: Request, res: Response) => {
  try {
    const museum = await MuseumRepo.findMuseumById(req.params.id);
    const response = {
      message: 'Museum fetched successfully',
      data: { museum: museum },
    };

    res.status(ResponseStatusCodes.OK).json(response);
  } catch (error: any) {
    logger.error(`Error fetching museum: ${error.message}`);
    res.status(ResponseStatusCodes.BAD_REQUEST).json({ message: error.message, data: [] });
  }
};

const findMuseumsByTags = async (req: Request, res: Response) => {
  try {
    let tagIds: string[] = [];

    if (typeof req.query.tagIds === 'string') {
      tagIds = req.query.tagIds.split(','); // Split the string by commas
    } else if (Array.isArray(req.query.tagIds)) {
      tagIds = (req.query.tagIds as string[]).map((tagId) => tagId.toString());
    }

    if (!tagIds.length) {
      throw new Error('Invalid or missing tagIds parameter');
    }

    const objectIds = tagIds.map((id) => new mongoose.Types.ObjectId(id)); // Convert to ObjectId
    const museums = await MuseumRepo.findMuseumsByTags(objectIds);
    res.json(museums);
  } catch (error: any) {
    logger.error(`Error fetching museums by tags: ${error.message}`);
    res.status(ResponseStatusCodes.BAD_REQUEST).json({ message: error.message, data: [] });
  }
};

const createMuseum = async (req: Request, res: Response) => {
  const museum = req.body;
  museum.created_by = req.user.userId;

  try {
    const newMuseum = await MuseumRepo.createMuseum(museum);
    const response = {
      message: 'Museum created successfully',
      data: { museumId: newMuseum._id },
    };

    res.status(ResponseStatusCodes.CREATED).json(response);
  } catch (error: any) {
    logger.error(`Error creating museum: ${error.message}`);
    res.status(ResponseStatusCodes.BAD_REQUEST).json({ message: error.message, data: [] });
  }
};

const updateMuseum = async (req: Request, res: Response) => {
  try {
    const updatedMuseum = await MuseumRepo.updateMuseum(req.params.id, req.body);
    const response = {
      message: 'Update Museum',
      data: { museum: updatedMuseum },
    };

    res.json(response);
  } catch (error: any) {
    logger.error(`Error updating museum: ${error.message}`);
    res.status(ResponseStatusCodes.BAD_REQUEST).json({ message: error.message, data: [] });
  }
};

const deleteMuseum = async (req: Request, res: Response) => {
  try {
    const deleteRes = await MuseumRepo.deleteMuseum(req.params.id);
    const response = {
      message: 'Museum deleted successfully',
      data: { museum: deleteRes },
    };

    res.status(ResponseStatusCodes.OK).json(response);
  } catch (error: any) {
    logger.error(`Error deleting museum: ${error.message}`);
    res.status(ResponseStatusCodes.BAD_REQUEST).json({ message: error.message, data: [] });
  }
};

export {
  getAllMuseums,
  findMuseumById,
  findMuseumsByTags,
  createMuseum,
  updateMuseum,
  deleteMuseum,
  getMuseumsCreatedByUser,
};
