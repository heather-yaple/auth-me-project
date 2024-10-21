const express = require("express");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateReview = [
  check('review')
    .isString()
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors,
];

const fetchUserReviews = async (req, res, next) => {
  try {
    const allSpots = await Spot.findAll({});
    const detailedSpot = await Promise.all(allSpots.map(async (spot) => {
      const previewImage = await SpotImage.findOne({
        where: {
          spotId: spot.id,
        },
        attributes: ['url'],
      });

      const imageSearch = previewImage ? previewImage.url : null;

      const response = {
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
        field: {
          previewImage: imageSearch,
        },
      };

      return response;
    }));

    const userReviews = await Review.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'description'],
          },
          include: [
            {
              model: SpotImage,
              attributes: ['url'],
            }
          ]
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    const reviews = userReviews.map((userReview) => {
      let json = userReview.toJSON();
      let spotImages = json.Spot && json.Spot.SpotImages;

      if (spotImages && spotImages.length > 0) {
        json.Spot.previewImage = spotImages[0].url;
      } else {
        json.Spot.previewImage = null;
      }
      delete json.Spot.SpotImages;
      return json;
    });

    req.userReviews = reviews;
    if (req.userReviews[0] && req.userReviews[0].Spot) {
      req.userReviews[0].Spot.previewImage = req.userReviews[0].Spot.previewImage;
    }
    next();
  } catch (error) {
    next(error);
  }
};


const countAttachedImages = async (req, res, next) => {
  const { reviewId } = req.params;

  const imageCount = await ReviewImage.count({
    where: { reviewId },
  });

  if (imageCount >= 10) {
    return res.status(403).json({ message: 'Maximum number of images for this resource was reached' });
  }
  next();
};

router.get('/current', requireAuth, fetchUserReviews, async (req, res) => {
  const { userReviews } = req;
  const currentUser = req.user.id;

  const unauthorizedReview = userReviews.find(review => review.userId !== currentUser);
  if (unauthorizedReview) {
    return res.status(403).json({ message: "You are not authorized." });
  }

  res.status(200).json({ Reviews: userReviews });
});

router.post('/:reviewId/images', requireAuth, countAttachedImages, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const currentUser = req.user.id;

  const reviewAuth = await Review.findByPk(reviewId);
  if (!reviewAuth) {
    return res.status(404).json({ message: "Review couldn't be found" });
  };
  if(reviewAuth.userId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
};

  const newImage = await ReviewImage.create({
    reviewId: reviewId,
    url,
  });

  res.status(200).json({
    id: newImage.id,
    url: newImage.url
})
});

router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const currentUser = req.user.id;
try {
  const reviews = await Review.findByPk(reviewId);
  if (!reviews) {
    return res.status(404).json({ message: "Review couldn't be found" });
  };
  if(reviews.userId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
};
  await reviews.update(req.body);

  const updatedReview = await Review.findByPk(reviewId);

  return res.status(200).json(updatedReview);
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

router.delete("/:reviewId", requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const currentUser = req.user.id;

  const reviews = await Review.findByPk(reviewId);
  if (!reviews) {
    return res.status(404).json({ message: "Review couldn't be found" });
  };
  if(reviews.userId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
};
await reviews.destroy();

return res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;