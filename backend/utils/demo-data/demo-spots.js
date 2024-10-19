const demoSpots = [
    {
        ownerId: 2, // jane.smith
        spots: [
            {
                address: "456 Mountain Rd",
                city: "Rangeley",
                state: "Maine",
                country: "USA",
                lat: 44.9490,
                lng: -70.6285,
                name: "Cozy Mountain Cabin",
                description: "Enjoy a peaceful retreat in this cozy cabin surrounded by nature.",
                price: 200
            }
        ]
    },
    {
        ownerId: 3, // alice.johnson
        spots: [
            {
                address: "321 Pine Hill Dr",
                city: "Bethel",
                state: "Maine",
                country: "USA",
                lat: 44.4541,
                lng: -70.7945,
                name: "Lakeside Lodge",
                description: "A beautiful lodge with stunning lake views.",
                price: 180
            },
            {
                address: "987 Maple View Ave",
                city: "Camden",
                state: "Maine",
                country: "USA",
                lat: 44.2088,
                lng: -69.0618,
                name: "Mountain View Retreat",
                description: "Relax in this retreat with breathtaking mountain views.",
                price: 220
            }
        ]
    },
    {
        ownerId: 5, // charlie.davis
        spots: [
            {
                address: "246 Birch St",
                city: "Sugarloaf",
                state: "Maine",
                country: "USA",
                lat: 45.0935,
                lng: -70.3007,
                name: "Ski-In/Ski-Out Condo",
                description: "A modern condo right at the ski slopes.",
                price: 90
            },
            {
                address: "369 Cedar Dr",
                city: "Bridgton",
                state: "Maine",
                country: "USA",
                lat: 44.0583,
                lng: -70.6352,
                name: "Elegant Mountain Cabin",
                description: "An elegant cabin with all the amenities for a perfect getaway.",
                price: 130
            }
        ]
    },
    {
        ownerId: 6, // diana.miller
        spots: [
            {
                address: "975 Spruce Blvd",
                city: "Mount Desert",
                state: "Maine",
                country: "USA",
                lat: 44.3516,
                lng: -68.2489,
                name: "Charming Cottage Near Acadia",
                description: "A charming cottage just minutes from Acadia National Park.",
                price: 160
            }
        ]
    },
    {
        ownerId: 1, // john.doe
        spots: [
            {
                address: "123 Stone Mountain Rd",
                city: "Gorham",
                state: "Maine",
                country: "USA",
                lat: 43.4028,
                lng: -70.4840,
                name: "Cozy Getaway in the Woods",
                description: "A beautiful and cozy home nestled in the woods.",
                price: 150
            }
        ]
    },
    {
        ownerId: 8, // frank.martinez
        spots: [
            {
                address: "852 River Bend Ln",
                city: "West Forks",
                state: "Maine",
                country: "USA",
                lat: 45.4625,
                lng: -70.4350,
                name: "Rustic Riverfront Cabin",
                description: "A trendy cabin right by the river for outdoor enthusiasts.",
                price: 210
            }
        ]
    },
    {
        ownerId: 4, // bob.brown
        spots: [
            {
                address: "135 Wildflower Ln",
                city: "Newry",
                state: "Maine",
                country: "USA",
                lat: 44.4790,
                lng: -70.7250,
                name: "Charming Woodland Retreat",
                description: "A quaint retreat with beautiful woodland surroundings.",
                price: 120
            }
        ]
    },
    {
        ownerId: 9, // grace.hernandez
        spots: [
            {
                address: "258 Fern Dr",
                city: "Standish",
                state: "Maine",
                country: "USA",
                lat: 43.6856,
                lng: -70.6460,
                name: "Lovely Guest House",
                description: "A lovely guest house with private amenities.",
                price: 110
            }
        ]
    },
    {
        ownerId: 10, // heidi.lopez
        spots: [
            {
                address: "741 Snowy Hill Rd",
                city: "Kingfield",
                state: "Maine",
                country: "USA",
                lat: 44.7431,
                lng: -70.3030,
                name: "Elegant Mountain Flat",
                description: "An elegant flat in a picturesque mountain setting.",
                price: 240
            }
        ]
    },
    {
        ownerId: 11, // ivan.gonzalez
        spots: [
            {
                address: "123 Mountain View Ct",
                city: "Harrison",
                state: "Maine",
                country: "USA",
                lat: 44.0305,
                lng: -70.5754,
                name: "Charming Lake House",
                description: "A charming house right on the lake, perfect for summer fun.",
                price: 250
            }
        ]
    },
    {
        ownerId: 12, // judy.wilson
        spots: [
            {
                address: "654 Hilltop Blvd",
                city: "Fryeburg",
                state: "Maine",
                country: "USA",
                lat: 44.0193,
                lng: -70.9108,
                name: "Modern Family Cabin",
                description: "A spacious cabin with a backyard and scenic views.",
                price: 300
            }
        ]
    },
    {
        ownerId: 13, // karl.anderson
        spots: [
            {
                address: "321 Maple Ln",
                city: "Norway",
                state: "Maine",
                country: "USA",
                lat: 44.2067,
                lng: -70.5931,
                name: "Comfortable Mountain Apartment",
                description: "A comfortable apartment in a serene mountain area.",
                price: 120
            }
        ]
    },
    {
        ownerId: 14, // lara.thomas
        spots: [
            {
                address: "135 Pine Rd",
                city: "Oquossoc",
                state: "Maine",
                country: "USA",
                lat: 44.9660,
                lng: -70.6261,
                name: "Spacious Mountain Loft",
                description: "A spacious loft with stunning mountain views.",
                price: 170
            },
            {
                address: "246 Timberline Ave",
                city: "Carrabassett Valley",
                state: "Maine",
                country: "USA",
                lat: 45.1988,
                lng: -70.3875,
                name: "Luxury Mountain Suite",
                description: "A luxury suite in a prime location for skiing.",
                price: 350
            }
        ]
    },
    {
        ownerId: 15, // luis.clark
        spots: [
            {
                address: "777 Ski Resort Dr",
                city: "Sugarloaf",
                state: "Maine",
                country: "USA",
                lat: 45.0953,
                lng: -70.2989,
                name: "Charming Ski Lodge",
                description: "A charming lodge set near the ski slopes.",
                price: 300
            }
        ]
    },
    {
        ownerId: 16, // nancy.adams
        spots: [
            {
                address: "321 Sunrise Ave",
                city: "Rockland",
                state: "Maine",
                country: "USA",
                lat: 44.1044,
                lng: -69.1152,
                name: "Beachfront Mountain Villa",
                description: "A stunning villa with beautiful beach and mountain views.",
                price: 400
            }
        ]
    },
    {
        ownerId: 7, // emily.jones
        spots: [
            {
                address: "789 Forest Hill Rd",
                city: "Greenville",
                state: "Maine",
                country: "USA",
                lat: 45.4642,
                lng: -69.6064,
                name: "Luxury Forest Cabin",
                description: "A luxury cabin with breathtaking forest views.",
                price: 280
            },
            {
                address: "321 Valley View St",
                city: "Sebago",
                state: "Maine",
                country: "USA",
                lat: 43.7513,
                lng: -70.5852,
                name: "Stylish Studio in the Mountains",
                description: "A stylish studio perfect for solo travelers in the mountains.",
                price: 150
            }
        ]
    }
];

const oldSpots = [
    {
        ownerId: 17, // olivia.lee
        spots: [
            {
                address: "456 Mountain Rd",
                city: "Rangeley",
                state: "Maine",
                country: "USA",
                lat: 44.9490,
                lng: -70.6285,
                name: "Cozy Mountain Cabin",
                description: "Enjoy a peaceful retreat in this comfy cabin surrounded by nature.",
                price: 200
            }
        ]
    }
];

module.exports = {
    demoSpots,
    oldSpots,
};
