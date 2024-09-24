const express = require('express');
const { Spot, Review, Booking, SpotImage, ReviewImage, User, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { validateSpot, validateReview, validateBooking } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router()

router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const newSpot = await Spot.create({
            ownerId: req.user.id,
            address,
            city, 
            state, 
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        res.status(201).json(newSpot);
    } catch (err) {
        next(err);
    }
});

//Add a review to a spot
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const { review, stars } = req.body;
    const spotId = parseInt(req.params.spotId);
    const userId = req.user.id;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const existingReview = await Review.findOne({
            where: { userId, spotId }
        });

        if (existingReview) {
            return res.status(403).json({ message: "User already has a review for this spot" });
        }

        const newReview = await Review.create({
            userId,
            spotId,
            review,
            stars
        });

        res.status(201).json(newReview);
    } catch (err) {
        next(err);
    }
});

// Get all reviews by spot id
router.get('/:spotId/reviews', async (req, res, next) => {
    const spotId = parseInt(req.params.spotId);
  
    try {
      // Check if the spot exists
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }
  
      const reviews = await Review.findAll({
        where: { spotId },
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
          },
          {
            model: ReviewImage,
            attributes: ['id', 'url'],
          },
        ],
      });
  
      // Process the reviews to include previewImage and format the response
      const reviewsList = await Promise.all(
        reviews.map(async (review) => {
          const reviewJSON = review.toJSON();
  
          // Fetch the preview image for the spot
          const previewImage = await SpotImage.findOne({
            where: {
              spotId: reviewJSON.spotId,
              preview: true,
            },
            attributes: ['url'],
          });
  
          reviewJSON.Spot = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            price: spot.price,
            previewImage: previewImage ? previewImage.url : null,
          };
  
          return reviewJSON;
        })
      );
  
      res.json({ Reviews: reviewsList });
    } catch (err) {
      next(err);
    }
  });


//add a booking to a spot
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const spotId = parseInt(req.params.spotId);
    const userId = req.user.id;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId === userId) {
            return res.status(403).json({ message: "You can't book your own spot" });
        }

        const conflictingBooking = await Booking.findOne({
            where: {
                spotId,
                [Op.or]: [
                    { startDate: { [Op.between]: [startDate, endDate] } },
                    { endDate: { [Op.between]: [startDate, endDate] } },
                    {
                        [Op.and]: [
                            { startDate: { [Op.lte]: startDate } },
                            { endDate: { [Op.gte]: endDate } }
                        ]
                    }
                ]
            }
        });

        if (conflictingBooking) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            });
        }

        const newBooking = await Booking.create({
            spotId,
            userId,
            startDate,
            endDate
        });

        res.status(201).json(newBooking);
    } catch (err) {
        next(err);
    }
});

  
  // Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    const userId = req.user.id;
  
    try {
      const spot = await Spot.findByPk(spotId);
  
      // Check if spot exists
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }
  
      // Check ownership
      if (spot.ownerId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      // Create new SpotImage
      const newImage = await SpotImage.create({
        spotId,
        url,
        preview
      });
  
      // Return the required response
      res.status(201).json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
      });
    } catch (error) {
      next(error);
    }
  });

  // Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
  
    try {
      const spots = await Spot.findAll({
        where: { ownerId: userId },
        attributes: {
          include: [
            // Calculate avgRating
            [
              sequelize.literal(`(
                SELECT AVG("Reviews"."stars")
                FROM "Reviews"
                WHERE "Reviews"."spotId" = "Spot"."id"
              )`),
              'avgRating'
            ]
          ]
        },
        include: [
          {
            model: SpotImage,
            as: 'SpotImages',
            attributes: ['url', 'preview'],
            required: false
          }
        ]
      });
  
      // Process spots to include previewImage
      const spotsList = spots.map(spot => {
        const spotJSON = spot.toJSON();
  

        const previewImage = spotJSON.SpotImages.find(image => image.preview);
        spotJSON.previewImage = previewImage ? previewImage.url : null;
  
      
        delete spotJSON.SpotImages;
  
        if (spotJSON.avgRating) {
          spotJSON.avgRating = Number(spotJSON.avgRating).toFixed(1);
        } else {
          spotJSON.avgRating = null;
        }
  
        return spotJSON;
      });
  
      res.json({ Spots: spotsList });
    } catch (error) {
      next(error);
    }
  });
  

 // Get all Spots with Query Filters
router.get('/', async (req, res, next) => {
    let {
      page = 1,
      size = 20,
      minLat,
      maxLat,
      minLng,
      maxLng,
      minPrice,
      maxPrice
    } = req.query;
  
    page = parseInt(page);
    size = parseInt(size);
  
    const errors = {};
    if (isNaN(page) || page < 1) {
      errors.page = "Page must be greater than or equal to 1";
    }
    if (isNaN(size) || size < 1 || size > 20) {
      errors.size = "Size must be between 1 and 20";
    }
    if (minLat && isNaN(parseFloat(minLat))) {
      errors.minLat = "Minimum latitude is invalid";
    }
    if (maxLat && isNaN(parseFloat(maxLat))) {
      errors.maxLat = "Maximum latitude is invalid";
    }
    if (minLng && isNaN(parseFloat(minLng))) {
      errors.minLng = "Minimum longitude is invalid";
    }
    if (maxLng && isNaN(parseFloat(maxLng))) {
      errors.maxLng = "Maximum longitude is invalid";
    }
    if (minPrice && (isNaN(parseFloat(minPrice)) || parseFloat(minPrice) < 0)) {
      errors.minPrice = "Minimum price must be a positive number";
    }
    if (maxPrice && (isNaN(parseFloat(maxPrice)) || parseFloat(maxPrice) < 0)) {
      errors.maxPrice = "Maximum price must be a positive number";
    }
  
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Bad Request",
        errors
      });
    }
  
    const where = {};
  
    if (minLat) where.lat = { [Op.gte]: parseFloat(minLat) };
    if (maxLat) where.lat = { ...(where.lat || {}), [Op.lte]: parseFloat(maxLat) };
    if (minLng) where.lng = { [Op.gte]: parseFloat(minLng) };
    if (maxLng) where.lng = { ...(where.lng || {}), [Op.lte]: parseFloat(maxLng) };
    if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...(where.price || {}), [Op.lte]: parseFloat(maxPrice) };
  
    try {
      // Fetch spots with their average ratings and preview images
      const spots = await Spot.findAll({
        where,
        attributes: {
          include: [
            // Calculate avgRating
            [
              sequelize.literal(`(
                SELECT AVG("Reviews"."stars")
                FROM "Reviews"
                WHERE "Reviews"."spotId" = "Spot"."id"
              )`),
              'avgRating'
            ],
            // Get previewImage
            [
              sequelize.literal(`(
                SELECT "url"
                FROM "SpotImages"
                WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true
                LIMIT 1
              )`),
              'previewImage'
            ]
          ]
        },
        limit: size,
        offset: (page - 1) * size
      });
  
      res.json({
        Spots: spots,
        page,
        size
      });
    } catch (error) {
      next(error);
    }
  });

  // Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    const { spotId } = req.params;
  
    try {
      const spot = await Spot.findByPk(spotId, {
        include: [
          {
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
          },
          {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: Review,
            attributes: []
          }
        ],
        attributes: {
          include: [
            [sequelize.fn('COUNT', sequelize.col('Reviews.id')), 'numReviews'],
            [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgStarRating']
          ]
        },
        group: ['Spot.id', 'SpotImages.id', 'Owner.id']
      });
  
      // Check if spot exists
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }
  
      res.json(spot);
    } catch (error) {
      next(error);
    }
  });
  
  // Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const { spotId } = req.params;
    const userId = req.user.id;
    const {
      address, city, state, country, lat, lng, name, description, price
    } = req.body;
  
    try {
      const spot = await Spot.findByPk(spotId);
  
      // Check if spot exists
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }
  
      // Check ownership
      if (spot.ownerId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      // Update spot
      await spot.update({
        address, city, state, country, lat, lng, name, description, price
      });
  
      res.json(spot);
    } catch (error) {
      next(error);
    }
  });
  
  
// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const userId = req.user.id;
  
    try {
      const spot = await Spot.findByPk(spotId);
  
      // Check if spot exists
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }
  
      // Check ownership
      if (spot.ownerId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      // Delete spot
      await spot.destroy();
  
      res.json({ message: "Successfully deleted" });
    } catch (error) {
      next(error);
    }
  });


  // Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const userId = req.user.id;
  
    try {
      const spot = await Spot.findByPk(spotId);
  
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }
  
      let bookings;
  
      if (spot.ownerId === userId) {
        // If the current user is the owner, include all booking details and user info
        bookings = await Booking.findAll({
          where: { spotId },
          include: [
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        });
      } else {
        // If not the owner, only include limited booking details
        bookings = await Booking.findAll({
          where: { spotId },
          attributes: ['spotId', 'startDate', 'endDate']
        });
      }
  
      res.json({ Bookings: bookings });
    } catch (error) {
      next(error);
    }
  });

  
  
module.exports = router