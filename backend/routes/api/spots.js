const router = require('express').Router();
const models = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op } = models.Sequelize;
const {
    isLoggedIn,
    prepareSubqStatement,
    allSpotsValidation,
    createSpotValidation,
    createReviewValidation
} = require('../../utils/endpoint-validation');
const { formatBookingDates, hasNoBookingOverlap } = require('../../utils/booking-dates');

// Helper function for handling errors
const handleError = (next, status, message) => {
    const err = new Error(message);
    err.status = status;
    next(err);
};

// Get all spots
router.get('/', allSpotsValidation, async (req, res, next) => {
    try {
        const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
        const pagination = { limit: size, offset: size * (page - 1) };
        const where = {};

        // Building the where clause based on query parameters
        if (minLat || maxLat) {
            where.lat = { ...where.lat, ...(minLat && { [Op.gte]: minLat }), ...(maxLat && { [Op.lte]: maxLat }) };
        }
        if (minLng || maxLng) {
            where.lng = { ...where.lng, ...(minLng && { [Op.gte]: minLng }), ...(maxLng && { [Op.lte]: maxLng }) };
        }
        if (minPrice || maxPrice) {
            where.price = { ...where.price, ...(minPrice && { [Op.gte]: minPrice }), ...(maxPrice && { [Op.lte]: maxPrice }) };
        }

        // Use prepared statements to handle SQLite vs PostgreSQL differences
        const subq = prepareSubqStatement();
        subq.avgRating = `( SELECT AVG("stars") FROM "${subq.schema}Reviews" AS "Review" WHERE "Review"."spotId" = "Spot"."id" )`;
        subq.previewImage = `( SELECT "url" FROM "${subq.schema}SpotImages" AS "SpotImage" WHERE "SpotImage"."spotId" = "Spot"."id" AND "SpotImage"."preview" = true )`;

        // Fetch all spots
        const spots = await models.Spot.findAll({
            attributes: {
                include: [
                    [models.sequelize.literal(subq.statement('avgRating')), 'avgRating'],
                    [models.sequelize.literal(subq.statement('previewImage')), 'previewImage']
                ]
            },
            ...pagination,
            where
        });

        const allSpots = spots.map(spot => {
            const spotJson = spot.toJSON();
            return {
                ...spotJson,
                avgRating: spotJson.avgRating || 0,
                previewImage: spotJson.previewImage || 'no preview image'
            };
        });

        res.status(200).json({ Spots: allSpots, page, size });
    } catch (error) {
        next(error);
    }
});

// Get all Spots owned by the current user
router.get('/current', requireAuth, isLoggedIn, async (req, res, next) => {
    try {
        const subq = prepareSubqStatement();
        subq.avgRating = `( SELECT AVG("stars") FROM "${subq.schema}Reviews" AS "Review" WHERE "Review"."spotId" = "Spot"."id" )`;
        subq.previewImage = `( SELECT "url" FROM "${subq.schema}SpotImages" AS "SpotImage" WHERE "SpotImage"."spotId" = "Spot"."id" AND "SpotImage"."preview" = true )`;

        const spots = await models.Spot.findAll({
            where: { ownerId: req.user.id },
            attributes: {
                include: [
                    [models.sequelize.literal(subq.statement('avgRating')), 'avgRating'],
                    [models.sequelize.literal(subq.statement('previewImage')), 'previewImage']
                ]
            }
        });

        const allSpots = spots.map(spot => {
            const spotJson = spot.toJSON();
            return {
                ...spotJson,
                avgRating: spotJson.avgRating || 0,
                previewImage: spotJson.previewImage || 'no preview image'
            };
        });

        res.status(200).json({ Spots: allSpots });
    } catch (error) {
        next(error);
    }
});

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    try {
        const id = parseInt(req.params.spotId, 10);
        if (!Number.isInteger(id)) {
            return handleError(next, 404, "Spot couldn't be found");
        }

        const subq = prepareSubqStatement();
        subq.numReviews = `( SELECT COUNT("id") FROM "${subq.schema}Reviews" AS "Review" WHERE "Review"."spotId" = "Spot"."id" )`;
        subq.avgStarRating = `( SELECT AVG("stars") FROM "${subq.schema}Reviews" AS "Review" WHERE "Review"."spotId" = "Spot"."id" )`;

        const spot = await models.Spot.findOne({
            where: { id },
            attributes: {
                include: [
                    [models.sequelize.literal(subq.statement('numReviews')), 'numReviews'],
                    [models.sequelize.literal(subq.statement('avgStarRating')), 'avgStarRating']
                ]
            },
            include: [
                { model: models.Review, attributes: [] },
                { model: models.SpotImage, attributes: ['id', 'url', 'preview'] },
                { model: models.User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] }
            ]
        });

        if (!spot) {
            return handleError(next, 404, "Spot couldn't be found");
        }

        const spotJson = spot.toJSON();
        spotJson.avgStarRating = spotJson.avgStarRating || 0;
        res.status(200).json(spotJson);
    } catch (error) {
        next(error);
    }
});

// Get all bookings for a spot based on the spot's id
router.get('/:spotId/bookings', async (req, res, next) => {
    try {
        const { ownerId } = await models.Spot.findByPk(req.params.spotId, { attributes: ['ownerId'] });
        const bookingProps = ['spotId', 'startDate', 'endDate'];
        const userProps = [];

        if (req.user.id === ownerId) {
            bookingProps.push('id', 'userId', 'createdAt', 'updatedAt');
            userProps.push('id', 'firstName', 'lastName');
        }

        const bookings = await models.Booking.findAll({
            where: { spotId: req.params.spotId },
            include: [{ model: models.User, attributes: userProps }],
            attributes: bookingProps
        });

        if (!bookings) {
            return handleError(next, 404, "Spot couldn't be found");
        }

        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
});

// Create a booking from a spot based on the spot's id
router.post('/:spotId/bookings', isLoggedIn, async (req, res, next) => {
    try {
        const { startDate: start, endDate: end } = req.body;
        const { startDate, endDate } = formatBookingDates({ start, end });

        const pastBookings = await models.Booking.findAll({
            where: { spotId: req.params.spotId }
        });

        const isValidBookingDate = startDate < endDate;
        const isAllowedToBook = hasNoBookingOverlap(pastBookings, startDate, endDate);

        if (!isValidBookingDate || !isAllowedToBook) {
            return res.status(400).json({ message: "Incompatible booking days" });
        }

        const newBooking = await models.Booking.create({
            spotId: Number(req.params.spotId),
            userId: req.user.id,
            startDate,
            endDate
        });

        res.status(200).json(newBooking);
    } catch (error) {
        next(error);
    }
});

// Get all reviews by a spot's id
router.get('/:spotId/reviews', requireAuth, async (req, res, next) => {
    try {
        const spot = await models.Spot.findByPk(req.params.spotId);
        if (!spot) {
            return handleError(next, 404, "Spot couldn't be found");
        }

        const reviews = await models.Review.findAll({
            where: { spotId: req.params.spotId },
            include: [
                { model: models.User, attributes: ['id', 'firstName', 'lastName'] },
                { model: models.ReviewImage, attributes: ['id', 'url'] }
            ]
        });

        res.status(200).json({ Reviews: reviews });
    } catch (error) {
        next(error);
    }
});

// Create a spot
router.post('/', requireAuth, isLoggedIn, createSpotValidation, async (req, res, next) => {
    try {
        const spot = await models.Spot.create({ ownerId: req.user.id, ...req.body });
        res.status(201).json(spot);
    } catch (error) {
        next(error);
    }
});

// Create a review for a spot
router.post('/:spotId/reviews', requireAuth, createReviewValidation, async (req, res, next) => {
    try {
        const existingReview = await models.Review.findOne({
            where: { spotId: req.params.spotId, userId: req.user.id }
        });

        if (existingReview) {
            return handleError(next, 403, "User already has a review for this spot");
        }

        const newReview = await models.Review.create({ userId: req.user.id, spotId: req.params.spotId, ...req.body });
        res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
});

// Add an image to a spot
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    try {
        const { spotId } = req.params;
        const { url, preview } = req.body;

        const spot = await models.Spot.findByPk(spotId);
        if (!spot || spot.ownerId !== req.user.id) {
            return handleError(next, 404, "Spot couldn't be found");
        }

        const image = await models.SpotImage.create({ spotId, url, preview });
        res.status(201).json(image);
    } catch (error) {
        next(error);
    }
});

// Edit a spot
router.put('/:spotId', requireAuth, async (req, res, next) => {
    try {
        const spot = await models.Spot.findByPk(req.params.spotId);
        if (!spot || spot.ownerId !== req.user.id) {
            return handleError(next, 404, "Spot couldn't be found");
        }

        await spot.update(req.body);
        res.status(200).json(spot);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

