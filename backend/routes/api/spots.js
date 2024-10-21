const express = require('express');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check, validationResult, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const paginationValidation = [
query('page')
  .optional()
  .isInt({ min:1 })
  .withMessage("Page must be greater than or equal to 1"),
query('size')
  .optional()
  .isInt({ min:1 })
  .withMessage("Size must be greater than or equal to 1"),
query('maxLat')
  .optional()
  .isFloat({ min: -90, max: 90 })
  .withMessage("Maximum latitude is invalid"),
query('minLat')
  .optional()
  .isFloat({ min: -180, max: 180 })
  .withMessage("Minimum latitude is invalid"),
query('minLng')
  .optional()
  .isFloat({ min: -180, max: 180 })
  .withMessage("Maximum longitude is invalid"),
query('maxLng')
  .optional()
  .isFloat({ min: -180, max: 180 })
  .withMessage("Minimum longitude is invalid"),
query('minPrice')
  .optional()
  .isFloat({ min: 0 })
  .withMessage("Minimum price must be greater than or equal to 0"),
query('maxPrice')
  .optional()
  .isFloat({ min: 0 })
  .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors
];

const fetchSpots = async (req, res, next) => {
try {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  const queryOptions = {
    where: {},
  };

  if (!page || isNaN(parseInt(page))) page = 1;
  if (!size || isNaN(parseInt(size))) size = 20;

  queryOptions.limit = size;
  queryOptions.offset = size * (page - 1);

if (minLat) {
  queryOptions.where.lat = { [Op.gte]: parseFloat(minLat) };
}
if (maxLat) {
  queryOptions.where.lat = { [Op.lte]: parseFloat(maxLat) };
}

if (minLat && maxLat) {
  queryOptions.where.lat = {
    [Op.and]: [
      { [Op.gte]: parseFloat(minLat) },
      { [Op.lte]: parseFloat(maxLat) },
    ],
  };
} else if (minLat) {
  queryOptions.where.lat = { [Op.gte]: parseFloat(minLat) };
} else if (maxLat) {
  queryOptions.where.lat = { [Op.lte]: parseFloat(maxLat) };
}

if (minPrice) {
  queryOptions.where.price = { [Op.gte]: parseFloat(minPrice) };
}
if (maxPrice) {
  queryOptions.where.price = { [Op.lte]: parseFloat(maxPrice) };
}

  const allSpots = await Spot.findAll({...queryOptions});
  const detailedSpot = await Promise.all(allSpots.map(async (spot) => {

    const reviewsLength = await Review.count({
      where: {
        spotId: spot.id,
      },
    });

    const starsColumn = await Review.sum("stars", {
      where: {
        spotId: spot.id,
      },
    });

    let avgRating;

    if (starsColumn === null) avgRating = 0;
    else avgRating = (starsColumn / reviewsLength).toFixed(1);

    const previewImage = await SpotImage.findAll({
      where: {
        spotId: spot.id,
      },
         attributes: ["url"],
      });

      let imageSearch;

      if (previewImage.length > 0) {
        imageSearch = previewImage.find(image => image.url).dataValues.url;
      } else {
        imageSearch = null;
      }

    return {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: parseFloat(spot.lat),
      lng: parseFloat(spot.lng),
      name: spot.name,
      description: spot.description,
      price: parseFloat(spot.price),
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: avgRating,
      previewImage: imageSearch
    };
  }));
  req.detailedSpot = detailedSpot;
  req.pagination = {
    page: Number(page),
    size: Number(size),
  };

  next();
} catch (error) {
  console.error('Error fetching spots:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}};

const validateSpots = [
  check('address')
    .isString()
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check('city')
    .isString()
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check('state')
    .isString()
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  check('country')
    .isString()
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check('lat')
    .isDecimal()
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check('lng')
    .isDecimal()
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  check('name')
    .isString()
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage("Name must be less than 50 characters"),
  check('description')
    .isString()
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check('price')
    .isDecimal()
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors
];

router.get('/', paginationValidation, fetchSpots, (req, res) => {
  const { detailedSpot, pagination } = req;
  res.status(200).json({ Spots: detailedSpot, ...pagination });
});

router.get('/current', requireAuth, fetchSpots, async (req, res) => {
  const { detailedSpot } = req;
  const userCurrent = req.user.id;
    const userSpots = detailedSpot.filter(spot => spot.ownerId === userCurrent);
  res.status(200).json({ Spots: userSpots });
});

router.get('/:spotId', fetchSpots, async (req, res) => {
  const { spotId } = req.params;
  const { detailedSpot } = req;
    const spotById = detailedSpot.find((spot) => spot.id == spotId);

    if (!spotById) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    const relatedReviews = await Review.findAll({
      where: {
        spotId: spotById.id,
      }
    });

    const relatedImages = await SpotImage.findAll({
      where: {
        spotId: spotById.id,
      },
      attributes: {
        exclude: ['spotId', 'createdAt', 'updatedAt'],
      },
    });

    const relatedOwner = await User.findByPk(spotById.ownerId, {
      attributes: ['id', 'firstName', 'lastName'],
    });

  const response = {
        id: spotById.id,
        ownerId: spotById.ownerId,
        address: spotById.address,
        city: spotById.city,
        state: spotById.state,
        country: spotById.country,
        lat: parseFloat(spotById.lat),
        lng: parseFloat(spotById.lng),
        name: spotById.name,
        description: spotById.description,
        price: parseFloat(spotById.price),
        createdAt: spotById.createdAt,
        updatedAt: spotById.updatedAt,
        numReviews: relatedReviews.length,
        avgStarRating: spotById.avgRating,
        SpotImages: relatedImages,
        Owner: relatedOwner,
      }
  return res.status(200).json(response);
});

router.post('/', requireAuth, validateSpots, async (req, res) => {
try{
  const userId = req.user.id;
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    const newValidSpot = await Spot.create({
      ...req.body,
      ownerId: userId,
    });

  return res.status(201).json(newValidSpot);
} catch (error) {
  if (error instanceof Sequelize.ValidationError) {
    const validationErrors = handleValidationErrors(error.errors);
    return res.status(400).json({
      message: 'Bad Request',
      errors: validationErrors,
    });
  }
}
});

router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const currentUser = req.user.id;

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  };
  if(spot.ownerId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
  } else {

  const newSpotImage = await SpotImage.create({ spotId: spotId, url, preview });

  res.status(200).json({
    id: newSpotImage.id,
    url: newSpotImage.url,
    preview: newSpotImage.preview
});
}
});

router.put("/:spotId", requireAuth, validateSpots, async (req, res) => {
  const { spotId } = req.params;
  const currentUser = req.user.id;
try {
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  };
  if(spot.ownerId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
};
  await spot.update(req.body);

  const updatedSpot = await Spot.findByPk(spotId);

  return res.status(200).json(updatedSpot);
} catch (error) {
  if (error instanceof Sequelize.ValidationError) {
    const validationErrors = handleValidationErrors(error.errors);
    return res.status(400).json({
      message: 'Bad Request',
      errors: validationErrors,
    });
  }
}
});

router.delete("/:spotId", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const currentUser = req.user.id;

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  };
  if(spot.ownerId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
};
await spot.destroy();

return res.status(200).json({ message: "Successfully deleted" });
});

const validateReview = [
  check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
  check('stars')
      .exists({ checkFalsy: true })
      .isInt({ min: 1, max: 5})
      .withMessage('Stars must be an integer from 1 to 5')
  ];

router.get('/:spotId/reviews', async (req, res) => {
	const spotId = req.params.spotId;

	const spot = await Spot.findByPk(spotId);

	if (!spot) {
		return res.status(404).json({ message: "Spot couldn't be found" });
	}

  const reviewsBySpotId = await Review.findAll({
    where: {
      spotId: spotId,
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  });

  res.status(200).json({ Reviews: reviewsBySpotId });
});

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
  const { spotId } = req.params;
  const { review, stars } = req.body
  const currentUser = req.user.id;

  if (!currentUser) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
  }

  try{
    const existingReview = await Review.findOne({
      where: { spotId: spotId, userId: currentUser },
    });

    if (existingReview) {
      return res.status(500).json({ message: "User already has a review for this spot" });
    }

    const existingSpot = await Spot.findOne({
      where: { id: spotId },
    });

    if (!existingSpot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

  const newReview = await Review.create({ userId: currentUser, spotId: spotId, review, stars });

    res.status(201).json(newReview);
  }
  catch(error){
      return res.status(400).json({
          "message": "Bad Request",
          "errors": {
            "review": "Review text is required",
            "stars": "Stars must be an integer from 1 to 5",
          }
        })
  }
});

router.get('/:spotsId/bookings', requireAuth, async (req, res, next) => {
  const { spotsId } = req.params;
  const { startDate, endDate } = req.body;
  const currentUser = req.user.id;

const spot = await Spot.findByPk(spotsId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
};

if(spot.ownerId !== currentUser){
  const notTheOwner = await Booking.findAll({
    where: {
      spotId: spot.id
    },
    attributes: ['spotId', 'startDate', 'endDate']
  });
  res.status(200).json({ Bookings: notTheOwner });
};

if(spot.ownerId === currentUser){
  const theOwner = await Booking.findAll({
    where: {
      spotId: spot.id
    },
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    }]
  });
  res.status(200).json({ Bookings: theOwner });
};
});

const validDates = [
  check('startDate')
    .exists({ checkFalsy: true })
    .custom((value, { req }) => {
      if (new Date(value) < new Date()) {
        throw new Error("startDate cannot be in the past");
      }
      return true;
    }),
  check('endDate')
    .exists({ checkFalsy: true })
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error("endDate cannot be on or before startDate");
      }
      return true;
    }),
  handleValidationErrors
];

router.post('/:spotId/bookings', requireAuth, validDates, async (req, res) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const currentUser = req.user.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!currentUser) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
  }

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === currentUser) {
      return res.status(403).json({ message: 'Unable to Process this Request: This is your property.' });
    }

    const existingBooking = await Booking.findOne({
      where: {
        spotId: spotId,
        [Op.or]: [
          {
            startDate: { [Op.between]: [startDate, endDate] }
          },
          {
            endDate: { [Op.between]: [startDate, endDate] }
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } }
            ]
          }
        ]
      }
    });
    if (existingBooking) {
      return res.status(403).json({
        "message": "Sorry, this spot is already booked for the specified dates",
        "errors": {
          "startDate": "Start date conflicts with an existing booking",
          "endDate": "End date conflicts with an existing booking"
        }
      });
    }

    const successfulBooking = await Booking.create({
      spotId,
      userId: currentUser,
      startDate,
      endDate,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(200).json(successfulBooking);
});

module.exports = router;