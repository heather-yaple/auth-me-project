'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert seed data
    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        hashedPassword: 'hashedpassword1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'janesmith@example.com',
        hashedPassword: 'hashedpassword2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alicejohnson@example.com',
        hashedPassword: 'hashedpassword3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Bob',
        lastName: 'Brown',
        email: 'bobbrown@example.com',
        hashedPassword: 'hashedpassword4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Charlie',
        lastName: 'Davis',
        email: 'charliedavis@example.com',
        hashedPassword: 'hashedpassword5',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Emily',
        lastName: 'Wilson',
        email: 'emilywilson@example.com',
        hashedPassword: 'hashedpassword6',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Frank',
        lastName: 'Harris',
        email: 'frankharris@example.com',
        hashedPassword: 'hashedpassword7',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Grace',
        lastName: 'Clark',
        email: 'graceclark@example.com',
        hashedPassword: 'hashedpassword8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Hank',
        lastName: 'Miller',
        email: 'hankmiller@example.com',
        hashedPassword: 'hashedpassword9',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Ivy',
        lastName: 'Martinez',
        email: 'ivymartinez@example.com',
        hashedPassword: 'hashedpassword10',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Remove seed data
    await queryInterface.bulkDelete('Users', null, {});
  }
};

