const router = require('express').Router();
const models = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { isLoggedIn, prepareSubqStatement, createReviewValidation } = require('../../utils/endpoint-validation');

router.get('/current', requireAuth, isLoggedIn, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't get all reviews";

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

// router.get('/user/:userId', async (req, res, next) => {
//     const reviews = await models.Review.findAll({
//         where: { userId: req.params.userId },
//         include: [
//             { model: Spot }
//         ]
//     });
//     res.status(200).json(reviews);
// })

router.post('/:reviewId/images', requireAuth, isLoggedIn, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't add an image to a review!";

    const review = await models.Review.findByPk(req.params.reviewId);
    if (!review) {
        err.message = "Review couldn't be found";
        err.status = 404;
        next(err);
    } else if (req.user.id !== review.userId) {
        req.throwErr = true;
        return isLoggedIn(req, res, next);
    }
    
    const reviewImage = await models.ReviewImage.create({
        reviewId: Number(req.params.reviewId),
        ...req.body
    });
    if (!reviewImage) {
        err.message = "Forbidden";
        err.status = 403;
        next(err);
    }
    res.status(201).json({ id: reviewImage.id, url: reviewImage.url });
});

router.put('/:reviewId', requireAuth, isLoggedIn, createReviewValidation, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't edit a review!";
    const review = await models.Review.findByPk(req.params.reviewId);
    if (!review) {
        err.status = 404;
        err.message = "Review couldn't be found";
        next(err);
    } else if (req.user.id !== review.userId) {
        req.throwErr = true;
        return isLoggedIn(req, res, next);
    }

    for (const [k, v] of Object.entries({ review: req.body.review, stars: req.body.stars })) {
        if (v) {
            review[k] = v;
        }
    }
    try {
        await review.save();
    } catch (e) {
        // errorResults.errors = { review, stars };
        err.status = 400;
        err.message = e.message;
        return next(err);
    }
    res.status(200).json(review);
});

router.delete('/:reviewId', requireAuth, isLoggedIn, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't delete a review!";

    const review = await models.Review.findByPk(req.params.reviewId);
    if (!review) {
        err.message = "Review couldn't be found"
        err.status = 404;
        next(err);
    } else if (req.user.id !== review.userId) {
        req.throwErr = true;
        return isLoggedIn(req, res, next);
    }
    await review.destroy();
    res.status(200).json({ message: "Successfully deleted" });
})
module.exports = router;