const router = require('express').Router();
const models = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { isLoggedIn } = require('../../utils/endpoint-validation');

router.delete('/:imageId', requireAuth, isLoggedIn, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't delete a review image!";
    
    const reviewImage = await models.ReviewImage.findOne({
        where: { id: req.params.imageId },
        include: {
            model: models.Review,
        }
    });
    // console.log(reviewImage);
    // const reviewImage = await models.ReviewImage.destroy({
    //     where: { id: req.params.imageId },
    //     include: {
    //         model: models.Review,
    //         attributes: ['userId']
    //     }
    // });
    if (!reviewImage) {
        err.status = 404;
        err.message = "Review Image couldn't be found";
        return next(err);
    } else if (req.user.id !== reviewImage.Review.userId) {
        req.throwErr = true;
        return isLoggedIn(req, res, next);
    }
    await reviewImage.destroy();
    res.status(200).json({ message: "Successfully deleted" })
});

module.exports = router;