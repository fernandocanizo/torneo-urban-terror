const rfr = require('rfr');
const bcryptjs = require('bcryptjs');

const baseModel = rfr('/app/db/models/baseModel');


const bm = baseModel('users');

const getCost = () => {
  // This code will benchmark your server to determine how high of a cost
  // you can afford. You want to set the highest cost that you can
  // without slowing down you server too much. 8-10 is a good baseline,
  // and more is good if your servers are fast enough. The code below
  // aims for ≤ 50 milliseconds stretching time, which is a good baseline
  // for systems handling interactive logins.

  const timeTarget = 50; // 50 milliseconds
  // Note: bcryptjs has a setup time cost which is reflected on the first
  // calculation if you choose a lower value, an insecure cost will pass
  // the test
  let cost = 10;
  let start;
  let end;

  do {
    cost++;
    start = Date.now();
    bcryptjs.hashSync('string to encode', bcryptjs.genSaltSync(cost));
    end = Date.now();
  } while ((end - start) < timeTarget);

  // cost should be between 04 and 31
  // Also since `bcryptjs` is 30% slower than its analogous C++ binding
  // bcrypt, add that to the cost
  cost = Math.round(cost * .3 + cost);
  return (cost > 31) ? 31 : cost;
};

const hashPassword = async password => {
  const saltLength = getCost();
  return await bcryptjs.hash(password, saltLength);
};

const create = async (userData, transaction) => {
  const aux = Object.assign({}, userData);
  aux.password = await hashPassword(userData.password);
  return await bm.insert(aux, transaction);
};

const changePassword = async ({ email, newPassword }) => {
  return await bm.update({
    filter: {
      email,
    },
    to: {
      password: await hashPassword(newPassword),
    },
  });
};

const checkPassword = async ({ email, password }) => {
  const user = await bm
    .getFirstBy({ email });
  if (!user) {
    return false;
  }

  const isValidPassword = await bcryptjs.compare(
    password,
    user.password,
  );

  if (isValidPassword) {
    return {
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.fk_role,
    };
  } else {
    return false;
  }
};


module.exports = {
  ...bm,
  create,
  changePassword,
  checkPassword,
};
