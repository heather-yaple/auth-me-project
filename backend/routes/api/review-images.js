const router = require('express').Router();
const models = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;

    // Find the review image by ID, including the associated review for user validation
    const reviewImage = await models.ReviewImage.findOne({
        where: { id: imageId },
        include: {
            model: models.Review,
            attributes: ['userId'], // Only fetch the userId for validation
        }
    });

    if (!reviewImage) {
        return res.status(404).json({
            title: "Couldn't delete a review image!",
            message: "Review Image couldn't be found"
        });
    }

    // Check if the logged-in user is the owner of the review
    if (req.user.id !== reviewImage.Review.userId) {
        return res.status(403).json({
            title: "Forbidden",
            message: "You do not have permission to delete this review image."
        });
    }

    // Proceed to delete the review image
    await reviewImage.destroy();
    return res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;
