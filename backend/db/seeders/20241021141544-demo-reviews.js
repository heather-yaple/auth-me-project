'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', [
      // Reviews for Cabin 1 (Cottage on the Bay)
      {
        spotId: 1,  // Assuming the spot ID is 1 for this cabin
        userId: 1,  // Assuming userId 1 is associated with this review
        rating: 5,
        comment: 'Amazing cabin with a beautiful view of the bay. Had the best time here!',
        reviewImages: JSON.stringify(['image1.jpg', 'image2.jpg']),  // Assuming the images are stored as a JSON array
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1,
        userId: 2,
        rating: 4,
        comment: 'The cabin was wonderful, but we wish the kitchen was a bit bigger.',
        reviewImages: JSON.stringify(['image3.jpg', 'image4.jpg']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1,
        userId: 3,
        rating: 5,
        comment: 'Perfect getaway for a weekend. Loved every second of it.',
        reviewImages: JSON.stringify(['image5.jpg']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Reviews for Cabin 2 (Mountain Escape)
      {
        spotId: 2,
        userId: 4,
        rating: 5,
        comment: 'Beautiful cabin with stunning mountain views. Would definitely stay again!',
        reviewImages: JSON.stringify(['image6.jpg', 'image7.jpg']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        userId: 5,
        rating: 3,
        comment: 'The cabin was cozy but the road leading up was a bit too steep.',
        reviewImages: JSON.stringify(['image8.jpg']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        userId: 6,
        rating: 4,
        comment: 'Nice cabin, although the hot tub wasn’t as hot as we hoped.',
        reviewImages: JSON.stringify(['image9.jpg']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Reviews for Cabin 3 (Lakeside Retreat)
      {
        spotId: 3,
        userId: 7,
        rating: 5,
        comment: 'This was the most peaceful stay we’ve had. The lake view was serene.',
        reviewImages: JSON.stringify(['image10.jpg', 'image11.jpg']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        userId: 8,
        rating: 4,
        comment: 'Great place to stay, although the Wi-Fi signal was weak.',
        reviewImages: JSON.stringify(['image12.jpg']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        userId: 9,
        rating: 5,
        comment: 'Loved every moment at Lakeside Retreat. Highly recommend it.',
        reviewImages: JSON.stringify(['image13.jpg']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Reviews for Cabin 4 (Forest Hideaway)
      {
        spotId: 4,
        userId: 10,
        rating: 4,
        comment: 'Great cabin in the forest. Very peaceful, but a bit isolated.',
        reviewImages: JSON.stringify(['image14.jpg']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 4,
        userId: 1,
        rating: 3,
        comment: 'The cabin was nice, but it was hard to find in the dark.',
        reviewImages: JSON.stringify(['image15.jpg']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 4,
        userId: 2,
        rating: 5,
        comment: 'Perfect spot for a weekend retreat. Loved the quiet atmosphere.',
        reviewImages: JSON.stringify(['image16.jpg', 'image17.jpg']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Add additional reviews for remaining cabins (5–10) following the same pattern...

    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};

