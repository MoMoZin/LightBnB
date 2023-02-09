SELECT reservations.id, title, cost_per_night,start_date ,avg (rating) as average_rating
FROM reservations
JOIN properties
  ON properties.id = property_id
JOIN property_reviews
  ON reservations.property_id = property_reviews.property_id
WHERE reservations.guest_id = 1
GROUP BY reservations.id, title, cost_per_night
ORDER BY start_date
LIMIT 10