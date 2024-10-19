const demoUsers = require('./demo-users');
const demoSpots = require('./demo-spots');
const demoReviews = require('./demo-reviews');
const demoBookings = require('./demo-bookings');
const demoSpotImages = require('./demo-spotImages');
const demoReviewImages = require('./demo-reviewImages');

const exportDemos = {
    demoUsers: demoUsers.demoUsers,
    demoSpots: demoSpots.demoSpots,
    demoReviews: demoReviews.demoReviews,
    demoBookings: demoBookings.demoBookings,
    demoSpotImages: demoSpotImages.demoSpotImages,
    demoReviewImages: demoReviewImages.demoReviewImages,
    // demoUsers: demoUsers.oldUsers,
    // demoSpots: demoSpots.oldSpots,
    // demoReviews: demoReviews.oldReviews,
    // demoBookings: demoBookings.oldBookings,
    // demoSpotImages: demoSpotImages.oldSpotImages,
    // demoReviewImages: demoReviewImages.oldReviewImages,
}
// console.log(exportDemos.demoUsers);
module.exports = exportDemos;