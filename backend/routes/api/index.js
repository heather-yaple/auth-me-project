const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require("../../utils/auth.js");
const cabinsRouter = require('./cabins.js');
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js');
const cabinImgsRouter = require('./cabin-images.js');
const reviewImgsRouter = require('./review-images.js');


router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/cabins', cabinsRouter);
router.use('/reviews', reviewsRouter);
router.use('/bookings', bookingsRouter);
router.use('/cabin-images', cabinImgsRouter);
router.use('/review-images', reviewImgsRouter);


router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});



module.exports = router;