// test/cabin-model/test.js
const { cabin, User } = require('../../db/models');

// Mock the database with beforeAll, afterAll, and individual test cases
beforeAll(async () => {
    // Set up any necessary data before tests run
});

afterAll(async () => {
    // Clean up the database after all tests have run
    await cabin.destroy({ where: {}, truncate: true });
});

describe('cabin Model Tests', () => {
    let testcabin;

    const cabinDetails = {
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

    test('Insert a new cabin', async () => {
        testcabin = await cabin.create(cabinDetails);
        expect(testcabin).toBeDefined();
        expect(testcabin.id).toBeGreaterThan(0);
        console.log('Inserted the first cabin no problem');
    });

    test('Insert the same cabin, should receive an error', async () => {
        try {
            await cabin.create(cabinDetails);
        } catch (e) {
            expect(e).toBeDefined();
            expect(e.message).toContain('duplicate key value violates unique constraint');
            console.log('Caught expected error:', e.message);
        }
    });

    test('Check lat/lng values', async () => {
        const cabin = await cabin.findByPk(testcabin.id);
        expect(cabin.lat).toBe(cabinDetails.lat);
        expect(cabin.lng).toBe(cabinDetails.lng);
    });

    test('Ensure cabins.ownerId is associated with Users.id', async () => {
        const cabin = await cabin.findByPk(testcabin.id, {
            include: User,
        });
        expect(cabin.User).toBeDefined();
        expect(cabin.ownerId).toBe(cabin.User.id);
    });
});
