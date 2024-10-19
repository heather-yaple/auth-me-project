const { Spot, User } = require('../../db/models');

// Test index for Spots_address_city_state_country
const test1 = async () => {
    // See all spots
    const spots = await Spot.findAll();
    console.log(spots);
    const spotDetails = {
        ownerId: 1,
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'App Academy',
        description: 'Place where web developers are created',
        price: 123,
    }
    // Insert the first spot
    const spot = await Spot.create(spotDetails);
    if (spot) {
        console.log('Inserted the first spot no problem');
    }
    // Insert the same spot, should receive an error
    try {
        const newSpot = await Spot.create(spotDetails);
    } catch(e) {
        console.log(e.message);
    }
}
test1();


// Test index for Spots_lat_lng


// Test Spots.ownerId is associated with Users.id