const bcrypt = require("bcryptjs");
const demoUsers = [
  { username: 'mike.jones', email: 'mike.jones@example.com', hashedPassword: bcrypt.hashSync('securePass1'), firstName: 'Mike', lastName: 'Jones' },
  { username: 'sara.connor', email: 'sara.connor@example.com', hashedPassword: bcrypt.hashSync('securePass2'), firstName: 'Sara', lastName: 'Connor' },
  { username: 'bob.smith', email: 'bob.smith@example.com', hashedPassword: bcrypt.hashSync('securePass3'), firstName: 'Bob', lastName: 'Smith' },
  { username: 'laura.stone', email: 'laura.stone@example.com', hashedPassword: bcrypt.hashSync('securePass4'), firstName: 'Laura', lastName: 'Stone' },
  { username: 'tom.clark', email: 'tom.clark@example.com', hashedPassword: bcrypt.hashSync('securePass5'), firstName: 'Tom', lastName: 'Clark' },
  { username: 'nina.lee', email: 'nina.lee@example.com', hashedPassword: bcrypt.hashSync('securePass6'), firstName: 'Nina', lastName: 'Lee' },
  { username: 'adam.brown', email: 'adam.brown@example.com', hashedPassword: bcrypt.hashSync('securePass7'), firstName: 'Adam', lastName: 'Brown' },
  { username: 'cathy.james', email: 'cathy.james@example.com', hashedPassword: bcrypt.hashSync('securePass8'), firstName: 'Cathy', lastName: 'James' },
  { username: 'paul.white', email: 'paul.white@example.com', hashedPassword: bcrypt.hashSync('securePass9'), firstName: 'Paul', lastName: 'White' },
  { username: 'kathy.miller', email: 'kathy.miller@example.com', hashedPassword: bcrypt.hashSync('securePass10'), firstName: 'Kathy', lastName: 'Miller' },
  { username: 'george.perez', email: 'george.perez@example.com', hashedPassword: bcrypt.hashSync('securePass11'), firstName: 'George', lastName: 'Perez' },
  { username: 'julia.martin', email: 'julia.martin@example.com', hashedPassword: bcrypt.hashSync('securePass12'), firstName: 'Julia', lastName: 'Martin' },
  { username: 'luke.wood', email: 'luke.wood@example.com', hashedPassword: bcrypt.hashSync('securePass13'), firstName: 'Luke', lastName: 'Wood' },
  { username: 'zoe.davis', email: 'zoe.davis@example.com', hashedPassword: bcrypt.hashSync('securePass14'), firstName: 'Zoe', lastName: 'Davis' },
  { username: 'max.brown', email: 'max.brown@example.com', hashedPassword: bcrypt.hashSync('securePass15'), firstName: 'Max', lastName: 'Brown' },
  { username: 'rita.green', email: 'rita.green@example.com', hashedPassword: bcrypt.hashSync('securePass16'), firstName: 'Rita', lastName: 'Green' },
  { username: 'victor.rivera', email: 'victor.rivera@example.com', hashedPassword: bcrypt.hashSync('securePass17'), firstName: 'Victor', lastName: 'Rivera' },
  { username: 'chloe.bell', email: 'chloe.bell@example.com', hashedPassword: bcrypt.hashSync('securePass18'), firstName: 'Chloe', lastName: 'Bell' },
  { username: 'tyler.harris', email: 'tyler.harris@example.com', hashedPassword: bcrypt.hashSync('securePass19'), firstName: 'Tyler', lastName: 'Harris' },
  { username: 'olivia.morris', email: 'olivia.morris@example.com', hashedPassword: bcrypt.hashSync('securePass20'), firstName: 'Olivia', lastName: 'Morris' },
  { username: 'henry.carter', email: 'henry.carter@example.com', hashedPassword: bcrypt.hashSync('securePass21'), firstName: 'Henry', lastName: 'Carter' },
  { username: 'daisy.thompson', email: 'daisy.thompson@example.com', hashedPassword: bcrypt.hashSync('securePass22'), firstName: 'Daisy', lastName: 'Thompson' },
  { username: 'peter.james', email: 'peter.james@example.com', hashedPassword: bcrypt.hashSync('securePass23'), firstName: 'Peter', lastName: 'James' },
  { username: 'lisa.morris', email: 'lisa.morris@example.com', hashedPassword: bcrypt.hashSync('securePass24'), firstName: 'Lisa', lastName: 'Morris' },
  { username: 'shawn.james', email: 'shawn.james@example.com', hashedPassword: bcrypt.hashSync('securePass25'), firstName: 'Shawn', lastName: 'James' },
  { username: 'grace.brown', email: 'grace.brown@example.com', hashedPassword: bcrypt.hashSync('securePass26'), firstName: 'Grace', lastName: 'Brown' },
  { username: 'eddie.james', email: 'eddie.james@example.com', hashedPassword: bcrypt.hashSync('securePass27'), firstName: 'Eddie', lastName: 'James' },
  { username: 'faye.peters', email: 'faye.peters@example.com', hashedPassword: bcrypt.hashSync('securePass28'), firstName: 'Faye', lastName: 'Peters' },
  { username: 'harry.smith', email: 'harry.smith@example.com', hashedPassword: bcrypt.hashSync('securePass29'), firstName: 'Harry', lastName: 'Smith' },
  { username: 'kim.simmons', email: 'kim.simmons@example.com', hashedPassword: bcrypt.hashSync('securePass30'), firstName: 'Kim', lastName: 'Simmons' },
];

const oldUsers = [
  {
    email: 'oldDemo@user.io',
    username: 'Old-Demo',
    hashedPassword: bcrypt.hashSync('oldPassword1'),
    firstName: 'Old',
    lastName: 'Demo',
  },
  {
    email: 'legacy1@user.io',
    username: 'LegacyUser1',
    hashedPassword: bcrypt.hashSync('oldPassword2'),
    firstName: 'Legacy',
    lastName: 'User1',
  },
  {
    email: 'legacy2@user.io',
    username: 'LegacyUser2',
    hashedPassword: bcrypt.hashSync('oldPassword3'),
    firstName: 'Legacy',
    lastName: 'User2',
  }
];

module.exports = {
  demoUsers,
  oldUsers
};
