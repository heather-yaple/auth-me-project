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
        reviewText: 'Amazing cabin with a beautiful view of the bay. Had the best time here!',
        reviewImages: [
          { url: 'https://www.airbnb.com/rooms/48067864?s=67&unique_share_id=de09404f-ac72-4ff1-8531-617b1bcc1a31&source_impression_id=p3_1733530944_P3GdO2Oyvub_EX1R&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1130407315' },  // Assuming the image is stored as a URL
          { url: 'https://www.airbnb.com/rooms/48067864?s=67&unique_share_id=de09404f-ac72-4ff1-8531-617b1bcc1a31&source_impression_id=p3_1733530944_P3GdO2Oyvub_EX1R&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1143000153' }
        ],  // Assuming the images are stored as a JSON array
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1,
        userId: 2,
        rating: 4,
        reviewText: 'The cabin was wonderful, but we wish the kitchen was a bit bigger.',
        reviewImages: [
          {url: 'https://www.airbnb.com/rooms/48067864?s=67&unique_share_id=de09404f-ac72-4ff1-8531-617b1bcc1a31&source_impression_id=p3_1733530944_P3GdO2Oyvub_EX1R&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1143000153'},    

        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1,
        userId: 3,
        rating: 5,
        reviewText: 'Perfect getaway for a weekend. Loved every second of it.',
        reviewImages: [
          {url: 'https://www.airbnb.com/rooms/48067864?s=67&unique_share_id=de09404f-ac72-4ff1-8531-617b1bcc1a31&source_impression_id=p3_1733530944_P3GdO2Oyvub_EX1R&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1143000153'},    
          
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Reviews for Cabin 2 (Mountain Escape)
      {
        spotId: 2,
        userId: 4,
        rating: 5,
        reviewText: 'Beautiful cabin with stunning mountain views. Would definitely stay again!',
        reviewImages: [
          {url: 'https://www.airbnb.com/rooms/48067864?s=67&unique_share_id=de09404f-ac72-4ff1-8531-617b1bcc1a31&source_impression_id=p3_1733530944_P3GdO2Oyvub_EX1R&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1143000153'},    
          
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        userId: 5,
        rating: 3,
        reviewText: 'The cabin was cozy but the road leading up was a bit too steep.',
        reviewImages: [
          {url: 'https://www.airbnb.com/rooms/48067864?s=67&unique_share_id=de09404f-ac72-4ff1-8531-617b1bcc1a31&source_impression_id=p3_1733530944_P3GdO2Oyvub_EX1R&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1143000153'},    
          
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        userId: 6,
        rating: 4,
        reviewText: 'Nice cabin, although the hot tub wasn’t as hot as we hoped.',
        reviewImages: [
          {url: 'https://www.airbnb.com/rooms/48067864?s=67&unique_share_id=de09404f-ac72-4ff1-8531-617b1bcc1a31&source_impression_id=p3_1733530944_P3GdO2Oyvub_EX1R&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1143000153'},    
          
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Reviews for Cabin 3 (Lakeside Retreat)
      {
        spotId: 3,
        userId: 7,
        rating: 5,
        reviewText: 'This was the most peaceful stay we’ve had. The lake view was serene.',
        reviewImages: [
          {url: 'https://www.airbnb.com/rooms/48067864?s=67&unique_share_id=de09404f-ac72-4ff1-8531-617b1bcc1a31&source_impression_id=p3_1733530944_P3GdO2Oyvub_EX1R&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1143000153'},    
          
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        userId: 8,
        rating: 4,
        reviewText: 'Great place to stay, although the Wi-Fi signal was weak.',
        reviewImages: [
          {url: 'https://www.airbnb.com/rooms/48067864?s=67&unique_share_id=de09404f-ac72-4ff1-8531-617b1bcc1a31&source_impression_id=p3_1733530944_P3GdO2Oyvub_EX1R&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1143000153'},    
          
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        userId: 9,
        rating: 5,
        reviewText: 'Loved every moment at Lakeside Retreat. Highly recommend it.',
        reviewImages: [
          {url: 'https://www.airbnb.com/rooms/48067864?s=67&unique_share_id=de09404f-ac72-4ff1-8531-617b1bcc1a31&source_impression_id=p3_1733530944_P3GdO2Oyvub_EX1R&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1143000153'},    
          
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Reviews for Cabin 4 (Forest Hideaway)
      {
        spotId: 4,
        userId: 10,
        rating: 4,
        reviewText: 'Great cabin in the forest. Very peaceful, but a bit isolated.',
        reviewImages: [
          {url: 'https://www.airbnb.com/rooms/48067864?s=67&unique_share_id=de09404f-ac72-4ff1-8531-617b1bcc1a31&source_impression_id=p3_1733530944_P3GdO2Oyvub_EX1R&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1143000153'},    
          
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 4,
        userId: 1,
        rating: 3,
        reviewText: 'The cabin was nice, but it was hard to find in the dark.',
        reviewImages: [
          {url: 'https://www.airbnb.com/rooms/48067864?s=67&unique_share_id=de09404f-ac72-4ff1-8531-617b1bcc1a31&source_impression_id=p3_1733530944_P3GdO2Oyvub_EX1R&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1143000153'},    
          
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 4,
        userId: 2,
        rating: 5,
        reviewText: 'Perfect spot for a weekend retreat. Loved the quiet atmosphere.',
        reviewImages: [
          {url: 'https://www.airbnb.com/rooms/48067864?s=67&unique_share_id=de09404f-ac72-4ff1-8531-617b1bcc1a31&source_impression_id=p3_1733530944_P3GdO2Oyvub_EX1R&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1143000153'},    
          
        ],
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

