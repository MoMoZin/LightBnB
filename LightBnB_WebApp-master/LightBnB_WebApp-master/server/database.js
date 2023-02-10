const properties = require('./json/properties.json');
const users = require('./json/users.json');

//Database connection
const { Pool } = require('pg');
const pool = new Pool({
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`SELECT * FROM users WHERE email=$1;
  `, [email.toLowerCase()])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => console.log(err.message));
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`SELECT * FROM users WHERE id=$1;
  `, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => console.log(err.message));
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool.query(`
  INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;
  `, [user.name, user.email, user.password])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => console.log(err.message));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(` 
  SELECT properties.* 
  FROM reservations 
  JOIN properties ON properties.id = property_id
  WHERE guest_id = $1 LIMIT $2;
  `, [guest_id, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => console.log(err.message));
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
   SELECT properties.*, avg(property_reviews.rating) as average_rating
   FROM properties
   LEFT JOIN property_reviews ON properties.id = property_id
   `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  // C1
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    if (queryParams.length === 1) {
      queryString += `WHERE `;
    } else {
      queryString += `AND `;
    }
    queryString += `owner_id = $${queryParams.length} `;
  }

  // C2
  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    if (queryParams.length === 1) {
      queryString += `WHERE `;
    } else {
      queryString += `AND `;
    }
    queryString += `cost_per_night >= $${queryParams.length} `;
  }
  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    if (queryParams.length === 1) {
      queryString += `WHERE `;
    } else {
      queryString += `AND `;
    }
    queryString += `cost_per_night <= $${queryParams.length} `;
  }

  queryString += `GROUP BY properties.id `;

  // C3
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(rating) >= $${queryParams.length} `;
  }

  // 4
  queryParams.push(limit);
  queryString += `   
   ORDER BY cost_per_night
   LIMIT $${queryParams.length};
   `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
    .then((result) => {
      console.log(result.rows.length);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
  // console.log("property: ", property);
  const keys = Object.keys(property);
  const values = Object.values(property);
  console.log("keys: ", keys);
  let columns = "";
  let valuePlaceHolder = "";
  let i = 1;
  keys.forEach(key => {
    columns += key.replace("'", "");
    columns += ",";

    valuePlaceHolder += `$${i},`;
    i++;
  });
  // console.log("columns: ", columns);
  // console.log("columns: ", columns);
  columns = columns.slice(0, -1);
  valuePlaceHolder = valuePlaceHolder.slice(0, -1);
  // console.log("columns: ", columns);
  const queryString = `
  INSERT INTO properties 
  (${columns}) 
  VALUES (${valuePlaceHolder}) RETURNING *;
  `;

  console.log("queryString: ", queryString);
  console.log("values: ", values);
  return pool.query(queryString, values)
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => console.log(err.message));

};
exports.addProperty = addProperty;


