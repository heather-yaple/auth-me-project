const { sequelize } = require('../models'); // Sequelize instance
const demoBookings = require('../../utils/demo-data/demo-bookings.js');
const demoReviewImages = require('../../utils/demo-data/demo-reviewImages');
const demoReviews = require('../../utils/demo-data/demo-reviews');
const demoSpotImages = require('../../utils/demo-data/demo-spotImages');
const demoSpots = require('../../utils/demo-data/demo-spots');
const { demoUsers } = require('../../utils/demo-data/demo-users.js'); // Import users

const { Booking, ReviewImage, Review, SpotImage, Spot, User } = require('../models'); // Import models

const seedDatabase = async () => {
    try {
        // Reset the database
        await sequelize.sync({ force: true }); // Warning: This will drop existing tables!

        // Seed Users
        await User.bulkCreate(demoUsers, { individualHooks: true });

        // Seed Spots
        await Spot.bulkCreate(demoSpots);

        // Seed Spot Images
        await SpotImage.bulkCreate(demoSpotImages);

        // Seed Bookings
        await Booking.bulkCreate(demoBookings);

        // Seed Reviews
        await Review.bulkCreate(demoReviews);

        // Seed Review Images
        await ReviewImage.bulkCreate(demoReviewImages);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

seedDatabase().then(() => {
    console.log("Seeding complete!");
    process.exit(); // Close the process after seeding
});
