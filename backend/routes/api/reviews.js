//backend/routes/api/reviews.js

const express = require('express');
const { Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { validateReview } = require('../../utils/validation');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  try {
    const reviews = await Review.findAll({
      where: { userId },
      include: [
        // Include the Spot associated with the review
        {
          model: Spot,
          attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'price'
          ],
          include: [
            {
              model: SpotImage,
              as: 'SpotImages',
              attributes: ['url'],
              where: { preview: true },
              required: false
            }
          ]
        },
        // Include the User who wrote the review
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        // Include ReviewImages associated with the review
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    // Process the reviews to include previewImage and format the response
    const reviewsList = reviews.map(review => {
      const reviewJSON = review.toJSON();

      // Handle previewImage for Spot
      if (reviewJSON.Spot && reviewJSON.Spot.SpotImages && reviewJSON.Spot.SpotImages.length > 0) {
        reviewJSON.Spot.previewImage = reviewJSON.Spot.SpotImages[0].url;
      } else {
        reviewJSON.Spot.previewImage = null;
      }
      // Remove SpotImages from Spot
      delete reviewJSON.Spot.SpotImages;

      return reviewJSON;
    });

    res.json({ Reviews: reviewsList });
  } catch (err) {
    next(err);
  }
});


router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
  const { review, stars } = req.body;
  const reviewId = parseInt(req.params.reviewId);

  try {
    const existingReview = await Review.findByPk(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (existingReview.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this review" });
    }

    existingReview.review = review;
    existingReview.stars = stars;
    await existingReview.save();

    res.json(existingReview);
  } catch (err) {
    next(err);
  }
});

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
  const reviewId = parseInt(req.params.reviewId);

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.destroy();
    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
});

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const { url } = req.body;
    const { reviewId } = req.params;
    const userId = req.user.id;
  
    try {
      const review = await Review.findByPk(reviewId);
  
      if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
      }
  
      if (review.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
  
      const imageCount = await ReviewImage.count({ where: { reviewId } });
  
      if (imageCount >= 10) {
        return res.status(403).json({
          message: 'Maximum number of images for this resource was reached',
        });
      }
  
      const newImage = await ReviewImage.create({
        reviewId,
        url,
      });
  
      res.status(201).json({
        id: newImage.id,
        url: newImage.url,
      });
    } catch (error) {
      next(error);
    }
  });
  


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

module.exports = router;