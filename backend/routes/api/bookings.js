const express = require("express");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateBooking = [
  check('spotId')
    .isInt()
    .exists({ checkFalsy: true })
    .withMessage('Spot ID must be an integer'),
  check('userId')
    .isInt()
    .exists({ checkFalsy: true })
    .withMessage('User ID must be an integer'),
  check('startDate')
    .isDate()
    .exists({ checkFalsy: true })
    .withMessage('Invalid start date'),
  check('endDate')
    .isDate()
    .exists({ checkFalsy: true })
    .withMessage('Invalid end date'),
  handleValidationErrors
];

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

const fetchUserBookings = async (req, res, next) => {
  try {
    const userBookings = await Booking.findAll({
      where: {
        userId: req.user.id
      },
      include: [{
        model: Spot,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'description']
        },
        include: [{
          model: SpotImage,
          attributes: ['url'],
          limit: 1,
        }],
      }],
    });

    const detailedUserBookings = userBookings.map(booking => ({
      id: booking.id,
      spotId: booking.spotId,
      Spot: {
        id: booking.Spot.id,
        ownerId: booking.Spot.ownerId,
        address: booking.Spot.address,
        city: booking.Spot.city,
        state: booking.Spot.state,
        country: booking.Spot.country,
        lat: booking.Spot.lat,
        lng: booking.Spot.lng,
        name: booking.Spot.name,
        price: booking.Spot.price,
        previewImage: booking.Spot.SpotImages.length > 0 ? booking.Spot.SpotImages[0].url : null,
      },
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    req.userBookings = detailedUserBookings;
    next();
  } catch (error) {
    next(error);
  }
};

router.get('/current', requireAuth, fetchUserBookings, (req, res) => {
  const { userBookings } = req;
  res.status(200).json({ Bookings: userBookings });
});

router.put("/:bookingId", requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
    const currentUser = req.user.id;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Both startDate and endDate are required" });
    }

    const currentDate = new Date();
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (parsedStartDate < currentDate) {
      return res.status(400).json({ message: "startDate cannot be in the past" });
    }

    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({ message: "endDate cannot be on or before startDate" });
    }

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    if (booking.userId !== currentUser) {
      return res.status(403).json({ message: "You are not authorized." });
    }

    const pastStartDate = new Date(booking.startDate);
    if (currentDate > pastStartDate) {
      return res.status(403).json({ message: "Bookings that have been started can't be modified" });
    }

    const booked = await Booking.findOne({
      where: {
        id: { [Op.ne]: bookingId },
        spotId: booking.spotId,
        [Op.or]: [
          { startDate: { [Op.between]: [startDate, endDate] } },
          { endDate: { [Op.between]: [startDate, endDate] } },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } },
            ],
          },
        ],
      },
    });

    if (booked) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    return res.status(200).json(booking);
});

router.delete("/:bookingId", requireAuth, validDates, async (req, res) => {
  const { bookingId } = req.params;
  const currentUser = req.user.id;

  const booked = await Booking.findByPk(bookingId);
  if (!booked) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  };

	const spot = await booked.getSpot();

	if (!spot) {
		return res.status(404).json({ message: "Spot couldn't be found" });
	}

	if (booked.userId !== currentUser && spot.ownerId !== currentUser) {
    return res.status(403).json({ message: "You are not authorized."});
}

const currentDate = new Date();
const pastStartDate = new Date(booked.startDate);
if (currentDate > pastStartDate) {
  return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
}

await booked.destroy();
res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;