const express = require('express')
const { cabin, cabinImage, Review, User, Booking, ReviewImage } = require('../../db/models')
const { requireAuth, restoreUser } = require('../../utils/auth');
const { Op } = require('sequelize');

const router = express.Router()

router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params
    const cabinImage = await cabinImage.findByPk(imageId)

	if (!cabinImage) {
		return res.status(404).json({ message: "cabin Image couldn't be found" });
	}

	const cabin = await cabin.findByPk(cabinImage.cabinId);
	if(!cabin){
		return res.status(403).json({
				message:"Forbidden"
		})
}

if(req.user.id !== cabin.ownerId){
		return res.status(403).json({
				message:"Forbidden"
		})
}

	await cabinImage.destroy();
	res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;