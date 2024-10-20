// backend/utils/booking-dates.js

/**
 * Formats booking dates by creating Date objects with specified times.
 * @param {Object} dates - Object containing start and end date strings.
 * @param {string} dates.start - Start date string.
 * @param {string} dates.end - End date string.
 * @returns {Object} - An object with formatted startDate and endDate.
 */
const formatBookingDates = ({ start, end }) => {
    const startDate = new Date(`${start}T15:00:00`);
    const endDate = new Date(`${end}T11:00:00`);

    if (isNaN(startDate) || isNaN(endDate)) {
        throw new Error('Invalid date format. Please provide valid start and end date strings.');
    }

    return {
        startDate,
        endDate,
    };
};

/**
 * Checks if there is no overlap with past bookings.
 * @param {Array} pastBookings - Array of past booking objects with startDate and endDate properties.
 * @param {Date} startDate - Proposed start date for the new booking.
 * @param {Date} endDate - Proposed end date for the new booking.
 * @returns {boolean} - True if there is no overlap, false otherwise.
 */
const hasNoBookingOverlap = (pastBookings, startDate, endDate) => {
    return pastBookings.every(b => {
        const endOverlap = b.endDate > startDate;
        const startOverlap = b.startDate < endDate;
        return !(endOverlap && startOverlap);
    });
};

/**
 * Validates booking dates to ensure the start date is before the end date.
 * @param {Date} startDate - Proposed start date for the booking.
 * @param {Date} endDate - Proposed end date for the booking.
 * @returns {boolean} - True if valid, false otherwise.
 */
const validateBookingDates = (startDate, endDate) => {
    return startDate < endDate;
};

module.exports = {
    formatBookingDates,
    hasNoBookingOverlap, 
    validateBookingDates
};
