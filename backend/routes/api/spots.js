const express = require('express');
const Sequelize  = require('sequelize');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { cabin, Review, User, cabinImage, ReviewImage, Booking } = require('../../db/models');
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

const fetchcabins = async (req, res, next) => {
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

  const allcabins = await cabin.findAll({...queryOptions});
  const detailedcabin = await Promise.all(allcabins.map(async (cabin) => {

    const reviewsLength = await Review.count({
      where: {
        cabinId: cabin.id,
      },
    });

    const starsColumn = await Review.sum("stars", {
      where: {
        cabinId: cabin.id,
      },
    });

    let avgRating;

    if (starsColumn === null) avgRating = 0;
    else avgRating = (starsColumn / reviewsLength).toFixed(1);

    const previewImage = await cabinImage.findAll({
      where: {
        cabinId: cabin.id,
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
      id: cabin.id,
      ownerId: cabin.ownerId,
      address: cabin.address,
      city: cabin.city,
      state: cabin.state,
      country: cabin.country,
      lat: parseFloat(cabin.lat),
      lng: parseFloat(cabin.lng),
      name: cabin.name,
      description: cabin.description,
      price: parseFloat(cabin.price),
      createdAt: cabin.createdAt,
      updatedAt: cabin.updatedAt,
      avgRating: avgRating,
      previewImage: imageSearch
    };
  }));
  req.detailedcabin = detailedcabin;
  req.pagination = {
    page: Number(page),
    size: Number(size),
  };

  next();
} catch (error) {
  console.error('Error fetching cabins:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}};

const validatecabins = [
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

router.get('/', paginationValidation, fetchcabins, (req, res) => {
  const { detailedcabin, pagination } = req;
  res.status(200).json({ cabins: detailedcabin, ...pagination });
});

router.get('/current', requireAuth, fetchcabins, async (req, res) => {
  const { detailedcabin } = req;
  const userCurrent = req.user.id;
    const usercabins = detailedcabin.filter(cabin => cabin.ownerId === userCurrent);
  res.status(200).json({ cabins: usercabins });
});

router.get('/:cabinId', fetchcabins, async (req, res) => {
  const { cabinId } = req.params;
  const { detailedcabin } = req;
    const cabinById = detailedcabin.find((cabin) => cabin.id == cabinId);

    if (!cabinById) {
      return res.status(404).json({ error: 'cabin not found' });
    }

    const relatedReviews = await Review.findAll({
      where: {
        cabinId: cabinById.id,
      }
    });

    const relatedImages = await cabinImage.findAll({
      where: {
        cabinId: cabinById.id,
      },
      attributes: {
        exclude: ['cabinId', 'createdAt', 'updatedAt'],
      },
    });

    const relatedOwner = await User.findByPk(cabinById.ownerId, {
      attributes: ['id', 'firstName', 'lastName'],
    });

  const response = {
        id: cabinById.id,
        ownerId: cabinById.ownerId,
        address: cabinById.address,
        city: cabinById.city,
        state: cabinById.state,
        country: cabinById.country,
        lat: parseFloat(cabinById.lat),
        lng: parseFloat(cabinById.lng),
        name: cabinById.name,
        description: cabinById.description,
        price: parseFloat(cabinById.price),
        createdAt: cabinById.createdAt,
        updatedAt: cabinById.updatedAt,
        numReviews: relatedReviews.length,
        avgStarRating: cabinById.avgRating,
        cabinImages: relatedImages,
        Owner: relatedOwner,
      }
  return res.status(200).json(response);
});

router.post('/', requireAuth, validatecabins, async (req, res) => {
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

    const newValidcabin = await cabin.create({
      ...req.body,
      ownerId: userId,
    });

  return res.status(201).json(newValidcabin);
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

router.post("/:cabinId/images", requireAuth, async (req, res) => {
  const { cabinId } = req.params;
  const { url, preview } = req.body;
  const currentUser = req.user.id;

  const cabin = await cabin.findByPk(cabinId);
  if (!cabin) {
    return res.status(404).json({ message: "cabin couldn't be found" });
  };
  if(cabin.ownerId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
  } else {

  const newcabinImage = await cabinImage.create({ cabinId: cabinId, url, preview });

  res.status(200).json({
    id: newcabinImage.id,
    url: newcabinImage.url,
    preview: newcabinImage.preview
});
}
});

router.put("/:cabinId", requireAuth, validatecabins, async (req, res) => {
  const { cabinId } = req.params;
  const currentUser = req.user.id;
try {
  const cabin = await cabin.findByPk(cabinId);
  if (!cabin) {
    return res.status(404).json({ message: "cabin couldn't be found" });
  };
  if(cabin.ownerId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
};
  await cabin.update(req.body);

  const updatedcabin = await cabin.findByPk(cabinId);

  return res.status(200).json(updatedcabin);
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

router.delete("/:cabinId", requireAuth, async (req, res) => {
  const { cabinId } = req.params;
  const currentUser = req.user.id;

  const cabin = await cabin.findByPk(cabinId);
  if (!cabin) {
    return res.status(404).json({ message: "cabin couldn't be found" });
  };
  if(cabin.ownerId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
};
await cabin.destroy();

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

router.get('/:cabinId/reviews', async (req, res) => {
	const cabinId = req.params.cabinId;

	const cabin = await cabin.findByPk(cabinId);

	if (!cabin) {
		return res.status(404).json({ message: "cabin couldn't be found" });
	}

  const reviewsBycabinId = await Review.findAll({
    where: {
      cabinId: cabinId,
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

  res.status(200).json({ Reviews: reviewsBycabinId });
});

router.post('/:cabinId/reviews', requireAuth, validateReview, async (req, res) => {
  const { cabinId } = req.params;
  const { review, stars } = req.body
  const currentUser = req.user.id;

  if (!currentUser) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
  }

  try{
    const existingReview = await Review.findOne({
      where: { cabinId: cabinId, userId: currentUser },
    });

    if (existingReview) {
      return res.status(500).json({ message: "User already has a review for this cabin" });
    }

    const existingcabin = await cabin.findOne({
      where: { id: cabinId },
    });

    if (!existingcabin) {
      return res.status(404).json({ message: "cabin couldn't be found" });
    }

  const newReview = await Review.create({ userId: currentUser, cabinId: cabinId, review, stars });

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

router.get('/:cabinsId/bookings', requireAuth, async (req, res, next) => {
  const { cabinsId } = req.params;
  const { startDate, endDate } = req.body;
  const currentUser = req.user.id;

const cabin = await cabin.findByPk(cabinsId);
  if (!cabin) {
    return res.status(404).json({ message: "cabin couldn't be found" });
};

if(cabin.ownerId !== currentUser){
  const notTheOwner = await Booking.findAll({
    where: {
      cabinId: cabin.id
    },
    attributes: ['cabinId', 'startDate', 'endDate']
  });
  res.status(200).json({ Bookings: notTheOwner });
};

if(cabin.ownerId === currentUser){
  const theOwner = await Booking.findAll({
    where: {
      cabinId: cabin.id
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

router.post('/:cabinId/bookings', requireAuth, validDates, async (req, res) => {
  const { cabinId } = req.params;
  const { startDate, endDate } = req.body;
  const currentUser = req.user.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!currentUser) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
  }

    const cabin = await cabin.findByPk(cabinId);
    if (!cabin) {
      return res.status(404).json({ message: "cabin couldn't be found" });
    }

    if (cabin.ownerId === currentUser) {
      return res.status(403).json({ message: 'Unable to Process this Request: This is your property.' });
    }

    const existingBooking = await Booking.findOne({
      where: {
        cabinId: cabinId,
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
        "message": "Sorry, this cabin is already booked for the specified dates",
        "errors": {
          "startDate": "Start date conflicts with an existing booking",
          "endDate": "End date conflicts with an existing booking"
        }
      });
    }

    const successfulBooking = await Booking.create({
      cabinId,
      userId: currentUser,
      startDate,
      endDate,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(200).json(successfulBooking);
});

module.exports = router;