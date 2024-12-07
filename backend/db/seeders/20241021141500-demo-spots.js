'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const cabins = [
      {
        name: 'Lakeside Retreat',
        address: 'Acadia National Park',
        city: 'Bar Harbor',
        state: 'Maine',
        zipCode: '04609',
        price: 250.00,
        description: 'A beautiful lakeside cabin with stunning views of the surrounding forest.',
        ownerId: 1,
        lat: 44.3380,
        lng: -68.2733,
        images: [
          {
            url: 'https://www.ncrivers.com/images/kennebec_thum01b.jpg',
            preview: true
          },
          {
            url: 'https://www.ncrivers.com/images/kennebec_thum02b.jpg',
            preview: false
          },
          {
            url: 'https://www.ncrivers.com/images/kennebec_thum03b.jpg',
            preview: false
          },
          {
            url: 'https://www.ncrivers.com/images/kennebec_thum04b.jpg',
            preview: false
          },
          {
            url: 'https://www.ncrivers.com/images/kennebec_thum05b.jpg',
            preview: false
          },
          {
            url: 'https://www.ncrivers.com/images/kennebec_thum06b.jpg',
            preview: false
          },
          {
            url: 'https://www.ncrivers.com/images/kennebec_thum07b.jpg',
            preview: false
          }
        ],
        numReviews: 5,
        avgStarRating: 4.5
      },
      {
          name: 'Mountain Escape',
          address: 'Mount Katahdin, Maine',
          city: 'Millinocket',
          state: 'Maine',
          zipCode: '04462',
          price: 275.00,
          description: 'Secluded mountain cabin with hiking trails and panoramic views.',
          ownerId: 2,
          lat: 45.9069,
          lng: -68.3624,
          numReviews: 3,
          avgStarRating: 4.2,
          images: [
            { url: 'https://www.ncrivers.com/images/katahdin_thum01b.jpg', preview: true },
            { url: 'https://www.ncrivers.com/images/katahdin_thum02b.jpg', preview: false },
            { url: 'https://www.ncrivers.com/images/katahdin_thum03b.jpg', preview: false }
          ]
        },
        {
          name: 'Coastal Haven',
          address: 'Bar Harbor, Maine',
          city: 'Bar Harbor',
          state: 'Maine',
          zipCode: '04609',
          price: 350.00,
          description: 'Coastal retreat with access to beaches and local dining.',
          ownerId: 3,
          lat: 44.3879,
          lng: -68.2039,
          numReviews: 4,
          avgStarRating: 4.3,
          images: [
            { url: 'https://www.ncrivers.com/images/barharbor_thum01b.jpg', preview: true },
            { url: 'https://www.ncrivers.com/images/barharbor_thum02b.jpg', preview: false },
            { url: 'https://www.ncrivers.com/images/barharbor_thum03b.jpg', preview: false }
          ]
        },
        {
          name: 'Forest Hideaway',
          address: 'Shawnee Peak, Maine',
          city: 'Bridgton',
          state: 'Maine',
          zipCode: '04009',
          price: 220.00,
          description: 'A peaceful cabin nestled in the forest, perfect for nature lovers.',
          ownerId: 4,
          lat: 44.0944,
          lng: -70.5895,
          numReviews: 2,
          avgStarRating: 4.1,
          images: [
            { url: 'https://www.ncrivers.com/images/shawnee_thum01b.jpg', preview: true }
          ]
        },
        {
          name: 'Riverbend Cabin',
          address: 'West Forks, Maine',
          city: 'West Forks',
          state: 'Maine',
          zipCode: '04985',
          price: 180.00,
          description: 'Charming riverside cabin ideal for fishing and relaxing.',
          ownerId: 5,
          lat: 45.4573,
          lng: -69.7064,
          numReviews: 1,
          avgStarRating: 4.0,
          images: [
            { url: 'https://www.ncrivers.com/images/westforks_thum01b.jpg', preview: true }
          ]
        },
        {
          name: 'Sunny Shores Cabin',
          address: 'Rangeley, Maine',
          city: 'Rangeley',
          state: 'Maine',
          zipCode: '04970',
          price: 300.00,
          description: 'Cabin with direct lakefront access and a spacious deck.',
          ownerId: 6,
          lat: 44.9481,
          lng: -70.6251,
          numReviews: 3,
          avgStarRating: 4.2,
          images: [
            { url: 'https://www.ncrivers.com/images/rangeley_thum01b.jpg', preview: true }
          ]
        },
        {
          name: 'Wilderness Retreat',
          address: 'Moosehead Lake, Maine',
          city: 'Greenville',
          state: 'Maine',
          zipCode: '04441',
          price: 400.00,
          description: 'Luxury cabin with lake views and plenty of outdoor activities.',
          ownerId: 7,
          lat: 45.9261,
          lng: -69.6332,
          numReviews: 4,
          avgStarRating: 4.5,
          images: [
            { url: 'https://www.ncrivers.com/images/moosehead_thum01b.jpg', preview: true }
          ]
        },
        {
          name: 'Snowy Ridge Cabin',
          address: 'Sugarloaf, Maine',
          city: 'Carrabassett Valley',
          state: 'Maine',
          zipCode: '04947',
          price: 325.00,
          description: 'Ski-in/ski-out cabin with a cozy fireplace and mountain views.',
          ownerId: 8,
          lat: 45.0854,
          lng: -70.2980,
          numReviews: 2,
          avgStarRating: 4.3,
          images: [
            { url: 'https://www.ncrivers.com/images/sugarloaf_thum01b.jpg', preview: true }
          ]
        },
        {
          name: 'Quiet Cove Cabin',
          address: 'Penobscot Bay, Maine',
          city: 'Belfast',
          state: 'Maine',
          zipCode: '04915',
          price: 230.00,
          description: 'A peaceful retreat in a private cove with access to the bay.',
          ownerId: 9,
          lat: 44.5594,
          lng: -68.2341,
          numReviews: 1,
          avgStarRating: 4.0,
          images: [
            { url: 'https://www.ncrivers.com/images/penobscot_thum01b.jpg', preview: true }
          ]
        },
        {
          name: 'Rustic Pines Cabin',
          address: 'Lincoln Lakes, Maine',
          city: 'Lincoln',
          state: 'Maine',
          zipCode: '04457',
          price: 250.00,
          description: 'Rustic cabin surrounded by pine trees, perfect for a weekend getaway.',
          ownerId: 10,
          lat: 44.4701,
          lng: -69.3356,
          numReviews: 3,
          avgStarRating: 4.2,
          images: [
            { url: 'https://www.ncrivers.com/images/lincoln_thum01b.jpg', preview: true }
          ]
        }
      ];
      

    // Add timestamps dynamically
    const timestampedCabins = cabins.map(cabin => ({
      ...cabin,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Cabins', timestampedCabins, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cabins', null, {});
  }
};

