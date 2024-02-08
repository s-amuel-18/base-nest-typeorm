export enum ContentTypeNotification {
  // * Buy trips
  reservationCreated = 'reservation-created',
  expiredReservationTrip = 'expired-reservation-trip',
  reminderReservationAboutToExpire = 'reminder-reservation-about-to-expire',
  reservePaymentWithInsufficientFund = 'reserve-payment-with-insufficient-fund',
  tripReservationPaid = 'trip-reservation-paid',

  // * Notifications
  newNotification = 'new-notification',
}
