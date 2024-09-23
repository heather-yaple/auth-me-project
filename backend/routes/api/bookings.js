const express = require('express');
const { Booking, Spot, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { validateBooking } = require('../../utils/validation');

const router = express.Router();

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

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        const conflictingBooking = await Booking.findOne({
            where: {
                spotId,
                [Op.or]: [
                    { startDate: { [Op.between]: [parsedStartDate, parsedEndDate] } },
                    { endDate: { [Op.between]: [parsedStartDate, parsedEndDate] } },
                    {
                        [Op.and]: [
                            { startDate: { [Op.lte]: parsedStartDate } },
                            { endDate: { [Op.gte]: parsedEndDate } }
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
            startDate: parsedStartDate,
            endDate: parsedEndDate
        });

        res.status(201).json(newBooking);
    } catch (err) {
        next(err);
    }
});
module.exports = router;