// test/spot-model/test.js
const { spot, User } = require('../../db/models');

// Mock the database with beforeAll, afterAll, and individual test cases
beforeAll(async () => {
    // Set up any necessary data before tests run
});

afterAll(async () => {
    // Clean up the database after all tests have run
    await spot.destroy({ where: {}, truncate: true });
});

describe('spot Model Tests', () => {
    let testspot;

    const SpotDetails = {
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
    };

    test('Insert a new spot', async () => {
        testspot = await spot.create(SpotDetails);
        expect(testspot).toBeDefined();
        expect(testspot.id).toBeGreaterThan(0);
        console.log('Inserted the first spot no problem');
    });

    test('Insert the same spot, should receive an error', async () => {
        try {
            await spot.create(SpotDetails);
        } catch (e) {
            expect(e).toBeDefined();
            expect(e.message).toContain('duplicate key value violates unique constraint');
            console.log('Caught expected error:', e.message);
        }
    });

    test('Check lat/lng values', async () => {
        const spot = await spot.findByPk(testspot.id);
        expect(spot.lat).toBe(SpotDetails.lat);
        expect(spot.lng).toBe(SpotDetails.lng);
    });

    test('Ensure spots.ownerId is associated with Users.id', async () => {
        const spot = await spot.findByPk(testspot.id, {
            include: User,
        });
        expect(spot.User).toBeDefined();
        expect(spot.ownerId).toBe(spot.User.id);
    });
});
