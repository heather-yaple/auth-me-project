const router = require('express').Router();
const models = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { isLoggedIn } = require('../../utils/endpoint-validation');

// Helper function to handle errors
const handleError = (res, message, status) => {
    return res.status(status).json({ message });
};

router.delete('/:imageId', requireAuth, isLoggedIn, async (req, res) => {
    const spotImage = await models.SpotImage.findByPk(req.params.imageId, {
        include: { model: models.Spot }
    });

    if (!spotImage) {
        return handleError(res, "Spot Image couldn't be found", 404);
    }
    if (req.user.id !== spotImage.Spot.ownerId) {
        return handleError(res, "You do not have permission to delete this image", 403);
    }

    await spotImage.destroy();
    res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;
