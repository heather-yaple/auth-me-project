const demoSpotImages = [
    { spotId: 1, images: [
        { url: "kitchen1.png", preview: true },
        { url: "livingroom1.png" },
        { url: "diningroom1.png" }
    ]},
    { spotId: 2, images: [
        { url: "bathroom1.png", preview: true },
        { url: "bedroom1.png" },
        { url: "garden1.png" },
        { url: "pool1.png" }
    ]},
    { spotId: 3, images: [
        { url: "kitchen2.png", preview: true },
        { url: "bathroom2.png" }
    ]},
    { spotId: 4, images: [
        { url: "livingroom2.png", preview: true },
        { url: "balcony1.png" },
        { url: "garage1.png" }
    ]},
    { spotId: 5, images: [
        { url: "bedroom2.png", preview: true },
        { url: "bathroom3.png" }
    ]},
    { spotId: 6, images: [
        { url: "kitchen3.png", preview: true },
        { url: "diningroom2.png" },
        { url: "patio1.png" }
    ]},
    { spotId: 7, images: [
        { url: "livingroom3.png", preview: true }
    ]},
    { spotId: 8, images: [
        { url: "garden2.png", preview: true },
        { url: "bathroom4.png" },
        { url: "bedroom3.png" }
    ]},
    { spotId: 9, images: [
        { url: "kitchen4.png", preview: true },
        { url: "diningroom3.png" },
        { url: "office1.png" }
    ]},
    { spotId: 10, images: [
        { url: "balcony2.png", preview: true }
    ]},
    { spotId: 11, images: [
        { url: "garage2.png", preview: true },
        { url: "garden3.png" }
    ]},
    { spotId: 12, images: [
        { url: "livingroom4.png", preview: true },
        { url: "diningroom4.png" }
    ]},
    { spotId: 13, images: [
        { url: "kitchen5.png", preview: true },
        { url: "bathroom5.png" }
    ]},
    { spotId: 14, images: [
        { url: "bedroom4.png", preview: true },
        { url: "garage3.png" },
        { url: "patio2.png" }
    ]},
    { spotId: 15, images: [
        { url: "kitchen6.png", preview: true },
        { url: "livingroom5.png" },
        { url: "diningroom5.png" }
    ]},
    { spotId: 16, images: [
        { url: "bathroom6.png", preview: true }
    ]},
    { spotId: 17, images: [
        { url: "garden4.png", preview: true },
        { url: "balcony3.png" }
    ]},
    { spotId: 18, images: [
        { url: "office2.png", preview: true },
        { url: "kitchen7.png" }
    ]},
    { spotId: 19, images: [
        { url: "bedroom5.png", preview: true },
        { url: "bathroom7.png" }
    ]},
    { spotId: 20, images: [
        { url: "livingroom6.png", preview: true },
        { url: "diningroom6.png" }
    ]},
    // Additional images to reach 200 total
    { spotId: 1, images: [
        { url: "kitchen1_2.png" },
        { url: "livingroom1_2.png", preview: true },
        { url: "diningroom1_2.png" }
    ]},
    { spotId: 2, images: [
        { url: "bathroom1_2.png", preview: true },
        { url: "garden1_2.png" }
    ]},
    { spotId: 3, images: [
        { url: "kitchen2_2.png", preview: true },
        { url: "livingroom2_2.png" }
    ]},
    { spotId: 4, images: [
        { url: "bathroom2_2.png", preview: true },
        { url: "diningroom2_2.png" }
    ]},
    { spotId: 5, images: [
        { url: "kitchen3_2.png", preview: true }
    ]},
    { spotId: 6, images: [
        { url: "livingroom3_2.png" },
        { url: "balcony1_2.png", preview: true }
    ]},
    { spotId: 7, images: [
        { url: "diningroom3_2.png", preview: true }
    ]},
    { spotId: 8, images: [
        { url: "garden2_2.png" },
        { url: "bathroom4_2.png", preview: true }
    ]},
    { spotId: 9, images: [
        { url: "kitchen4_2.png" },
        { url: "diningroom4_2.png", preview: true }
    ]},
    { spotId: 10, images: [
        { url: "livingroom4_2.png", preview: true }
    ]},
    { spotId: 11, images: [
        { url: "garage2_2.png" },
        { url: "garden3_2.png", preview: true }
    ]},
    { spotId: 12, images: [
        { url: "livingroom5_2.png", preview: true }
    ]},
    { spotId: 13, images: [
        { url: "kitchen5_2.png", preview: true },
        { url: "bathroom5_2.png" }
    ]},
    { spotId: 14, images: [
        { url: "bedroom4_2.png", preview: true }
    ]},
    { spotId: 15, images: [
        { url: "kitchen6_2.png", preview: true }
    ]},
    { spotId: 16, images: [
        { url: "livingroom6_2.png", preview: true },
        { url: "diningroom6_2.png" }
    ]},
    { spotId: 17, images: [
        { url: "garden4_2.png", preview: true }
    ]},
    { spotId: 18, images: [
        { url: "office2_2.png", preview: true }
    ]},
    { spotId: 19, images: [
        { url: "bedroom5_2.png", preview: true }
    ]},
    { spotId: 20, images: [
        { url: "livingroom7.png", preview: true },
        { url: "diningroom7.png" }
    ]}
];

const oldSpotImages = [
    {
      spotId: 1,
      images: [
        { url: 'living-room-1.png' },
        { url: 'living-room-2.png' },
        { url: 'bedroom-1.png' },
        { url: 'bedroom-2.png' },
        { url: 'bedroom-3.png' },
        { url: 'bathroom-1.png' },
        { url: 'bathroom-2.png' },
        { url: 'front-1.png', preview: true },
      ]
    },
    {
      spotId: 2,
      images: [
        { url: 'living-room-1.png' },
        { url: 'living-room-2.png' },
        { url: 'bedroom-1.png' },
        { url: 'bedroom-2.png' },
        { url: 'bathroom-1.png' },
        { url: 'front-1.png', preview: true },
      ]
    },
    {
      spotId: 3,
      images: [
        { url: 'living-room-1.png' },
        { url: 'living-room-2.png' },
        { url: 'bedroom-1.png' },
        { url: 'bedroom-2.png' },
        { url: 'bedroom-3.png' },
        { url: 'bathroom-1.png' },
        { url: 'bathroom-2.png' },
        { url: 'front-1.png', preview: true },
      ]
    },
    {
      spotId: 4,
      images: [
        { url: 'living-room-1.png' },
        { url: 'living-room-2.png' },
        { url: 'bedroom-1.png' },
        { url: 'bedroom-2.png' },
        { url: 'bedroom-3.png' },
        { url: 'bathroom-1.png' },
        { url: 'bathroom-2.png' },
        { url: 'front-1.png', preview: true },
      ]
    },
    {
      spotId: 5,
      images: [
        { url: 'living-room-1.png' },
        { url: 'living-room-2.png' },
        { url: 'bedroom-1.png' },
        { url: 'bedroom-2.png' },
        { url: 'bedroom-3.png' },
        { url: 'bathroom-1.png' },
        { url: 'bathroom-2.png' },
        { url: 'front-1.png', preview: true },
      ]
    },
    {
      spotId: 6,
      images: [
        { url: 'living-room-1.png' },
        { url: 'living-room-2.png' },
        { url: 'bedroom-1.png' },
        { url: 'bedroom-2.png' },
        { url: 'bedroom-3.png' },
        { url: 'bathroom-1.png' },
        { url: 'bathroom-2.png' },
        { url: 'front-1.png', preview: true },
      ]
    },
];

module.exports = {
    demoSpotImages,
    oldSpotImages
};