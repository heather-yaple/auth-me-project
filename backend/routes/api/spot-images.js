const router = require('express').Router();
const models = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { isLoggedIn } = require('../../utils/endpoint-validation');

router.delete('/:imageId', requireAuth, isLoggedIn, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't delete spot image!";
    const spotImage = await models.SpotImage.findByPk(
        req.params.imageId,
        { include: { model: models.Spot } }
    );
    if (!spotImage) {
        err.status = 404;
        err.message = "Spot Image couldn't be found";
        next(err);
    } else if (req.user.id !== spotImage.Spot.ownerId) {
        req.throwErr = true;
        return isLoggedIn(req, res, next);
    }

    await spotImage.destroy();
    res.status(200).json({
        message: "Successfully deleted"
    })
});

module.exports = router;