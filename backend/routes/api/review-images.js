const express = require('express')
const { spot, spotImage, Review, User, Booking, ReviewImage } = require('../../db/models')
const { requireAuth, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation')
const { Op } = require('sequelize');
const { check } = require('express-validator');

const router = express.Router()

router.delete('/:imageId', requireAuth, async (req, res) => {
	const { imageId } = req.params

	const reviewImage = await ReviewImage.findByPk(imageId)
	if (!reviewImage) {
		return res.status(404).json({ message: "Review Image couldn't be found" });
	}

	const review = await Review.findByPk(reviewImage.reviewId);

	if(!review){
		return res.status(403).json({
				message:"Forbidden"
		})
}

if(req.user.id !== review.userId){
		return res.status(403).json({
				message:"Forbidden"
		})
}

	await reviewImage.destroy();
	return res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;