const express = require('express')
const { spot, spotImage, Review, User, Booking, ReviewImage } = require('../../db/models')
const { requireAuth, restoreUser } = require('../../utils/auth');
const { Op } = require('sequelize');

const router = express.Router()

router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params
    const spotImage = await spotImage.findByPk(imageId)

	if (!spotImage) {
		return res.status(404).json({ message: "spot Image couldn't be found" });
	}

	const spot = await spot.findByPk(spotImage.spotId);
	if(!spot){
		return res.status(403).json({
				message:"Forbidden"
		})
}

if(req.user.id !== spot.ownerId){
		return res.status(403).json({
				message:"Forbidden"
		})
}

	await spotImage.destroy();
	res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;