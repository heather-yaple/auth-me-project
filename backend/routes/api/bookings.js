const router = require('express').Router();
const models = require('../../db/models');
const { formatBookingDates, hasNoBookingOverlap } = require('../../utils/booking-dates');

// Get current user's bookings
router.get('/current', async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {
        const bookings = await models.Booking.findAll({
            where: { userId: user.id },
            include: [{ model: models.Spot }]
        });

        return res.status(200).json({
            bookings, // Ensure consistent naming for the response
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Edit a booking
router.put('/:bookingId', async (req, res) => {
    const { startDate: start, endDate: end } = req.body;

    try {
        const { startDate, endDate } = formatBookingDates({ start, end });
        const isValidBookingDate = startDate < endDate;

        const booking = await models.Booking.findByPk(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({
                message: "Booking couldn't be found"
            });
        }

        // Check if user is authenticated and owns the booking
        const user = req.user;
        if (!user || user.id !== booking.userId) {
            return res.status(403).json({
                message: "Cannot change a booking owned by another user!",
                errors: {
                    username: "userId does not match booking ID"
                }
            });
        }

        const isAllowedToBook = hasNoBookingOverlap([booking], startDate, endDate);
        if (!isValidBookingDate || !isAllowedToBook) {
            return res.status(403).json({
                message: "Error: booking dates are invalid or overlap with an existing booking"
            });
        }

        if (startDate) {
            booking.startDate = startDate;
        }
        if (endDate) {
            booking.endDate = endDate;
        }

        await booking.save();
        return res.status(200).json(booking);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Delete a booking
router.delete('/:bookingId', async (req, res) => {
    try {
        const booking = await models.Booking.findByPk(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({
                message: "Booking couldn't be found"
            });
        }

        // Check if user is authenticated and owns the booking
        const user = req.user;
        if (!user || user.id !== booking.userId) {
            return res.status(403).json({
                message: "Cannot change a booking owned by another user!",
                errors: {
                    username: "userId does not match booking ID"
                }
            });
        }

        await booking.destroy();
        return res.status(200).json({
            message: "Successfully deleted"
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Delete a spot (if still needed for testing, consider commenting out or moving)
router.delete('/spot/:spotId', async (req, res) => {
    try {
        const spot = await models.Spot.findByPk(Number(req.params.spotId));
        if (!spot) {
            return res.status(404).json({
                message: "Spot not found"
            });
        }

        await spot.destroy();
        return res.json({
            message: "Spot deleted",
            Spot: spot
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
