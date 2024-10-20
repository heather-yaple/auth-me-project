const router = require('express').Router();
const models = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { isLoggedIn, prepareSubqStatement, createReviewValidation } = require('../../utils/endpoint-validation');

// Helper function to handle errors
const handleError = (res, message, status) => {
    return res.status(status).json({ message });
};

router.get('/current', requireAuth, isLoggedIn, async (req, res) => {
    const subq = prepareSubqStatement();
    subq.previewImage = `(
        SELECT "url" FROM "${subq.schema}SpotImages" AS "SpotImage"
        WHERE
            "SpotImage"."preview" = true
            AND
            "SpotImage"."spotId" = "Spot"."id"
    )`;

    const reviews = await models.Review.findAll({
        where: { userId: req.user.id },
        include: [
            { model: models.User, attributes: ['id', 'firstName', 'lastName'] },
            {
                model: models.Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt'],
                    include: [[models.sequelize.literal(subq.statement('previewImage')), 'previewImage']]
                },
            },
            { model: models.ReviewImage, attributes: ['id', 'url'] }
        ]
    });

    res.status(200).json({ Reviews: reviews });
});

router.post('/:reviewId/images', requireAuth, isLoggedIn, async (req, res, next) => {
    const review = await models.Review.findByPk(req.params.reviewId);
    if (!review) {
        return handleError(res, "Review couldn't be found", 404);
    } 
    if (req.user.id !== review.userId) {
        return handleError(res, "You do not have permission to add an image to this review", 403);
    }

    const reviewImage = await models.ReviewImage.create({
        reviewId: Number(req.params.reviewId),
        ...req.body
    });
    
    res.status(201).json({ id: reviewImage.id, url: reviewImage.url });
});

router.put('/:reviewId', requireAuth, isLoggedIn, createReviewValidation, async (req, res, next) => {
    const review = await models.Review.findByPk(req.params.reviewId);
    if (!review) {
        return handleError(res, "Review couldn't be found", 404);
    }
    if (req.user.id !== review.userId) {
        return handleError(res, "You do not have permission to edit this review", 403);
    }

    // Update review fields if they exist in the request
    Object.entries({ review: req.body.review, stars: req.body.stars }).forEach(([k, v]) => {
        if (v) review[k] = v;
    });

    try {
        await review.save();
        res.status(200).json(review);
    } catch (e) {
        return handleError(res, e.message, 400);
    }
});

router.delete('/:reviewId', requireAuth, isLoggedIn, async (req, res, next) => {
    const review = await models.Review.findByPk(req.params.reviewId);
    if (!review) {
        return handleError(res, "Review couldn't be found", 404);
    }
    if (req.user.id !== review.userId) {
        return handleError(res, "You do not have permission to delete this review", 403);
    }

    await review.destroy();
    res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;
