const rand_int = (max_val) => Math.floor(Math.random() * max_val);
const flatten_matches = (matches) => [...matches];
const get_matches = (expr) => (to_match) =>
  flatten_matches(to_match.matchAll(expr));
const replace_at = (to_add) => (start) => (str) =>
  str.slice(0, start) + to_add + str.slice(start + to_add.length);
const random_replace = (expr) => (replace_chance) => (to_add) => (to_check) => {
  const matches = get_matches(expr)(to_check);
  let result = to_check;
  matches.forEach((m) => {
    if (!m.index) {
      console.log(`Skipping match: ${m}`);
      return;
    }
    result =
      replace_chance >= rand_int(100)
        ? replace_at(to_add)(m.index)(to_check)
        : result;
  });
  return result;
};

const tester =
  "Hello mateys, my name is Mike33. I hate the fucking poodlefit and am the leader of BHO which is the best clan on NC Miller, has the most ASP members, and carrys the NC. I'm very strong and never skip leg day 🦵";
const replace_commas = random_replace(/[,]/g)(100)(" = ");
console.log(replace_commas(tester));
// matches -> take {replace_chance} portion of matches -> replace those
const linear_tester =
  "Hello mateys, my name is Mike33. I hate the fucking poodlefit and am the leader of BHO which is the best clan on NC Miller, has the most ASP members, and carrys the NC. I'm very strong and never skip leg day :leg:Hello mateys, my name is Mike33. I hate the fucking poodlefit and am the leader of BHO which is the best clan on NC Miller, has the most ASP members, and carrys the NC. I'm very strong and never skip leg day :leg:Hello mateys, my name is Mike33. I hate the fucking poodlefit and am the leader of BHO which is the best clan on NC Miller, has the most ASP members, and carrys the NC. I'm very strong and never skip leg day :leg:Hello mateys, my name is Mike33. I hate the fucking poodlefit and am the leader of BHO which is the best clan on NC Miller, has the most ASP members, and carrys the NC. I'm very strong and never skip leg day :leg:Hello mateys, my name is Mike33. I hate the fucking poodlefit and am the leader of BHO which is the best clan on NC Miller, has the most ASP members, and carrys the NC. I'm very strong and never skip leg day :leg:Hello mateys, my name is Mike33. I hate the fucking poodlefit and am the leader of BHO which is the best clan on NC Miller, has the most ASP members, and carrys the NC. I'm very strong and never skip leg day :leg:Hello mateys, my name is Mike33. I hate the fucking poodlefit and am the leader of BHO which is the best clan on NC Miller, has the most ASP members, and carrys the NC. I'm very strong and never skip leg day :leg:Hello mateys, my name is Mike33. I hate the fucking poodlefit and am the leader of BHO which is the best clan on NC Miller, has the most ASP members, and carrys the NC. I'm very strong and never skip leg day :leg:Hello mateys, my name is Mike33. I hate the fucking poodlefit and am the leader of BHO which is the best clan on NC Miller, has the most ASP members, and carrys the NC. I'm very strong and never skip leg day :leg:Hello mateys, my name is Mike33. I hate the fucking poodlefit and am the leader of BHO which is the best clan";

function linear_search() {
  let indexes = {
    " ": [],
    ",": [],
  };
  for (const [index, char] of Object.entries(linear_tester)) {
    switch (char) {
      case " ":
        indexes[" "].push(parseInt(index));
        break;
      case ",":
        indexes[","].push(parseInt(index));
        break;
    }
  }
  return indexes;
}

const start = process.hrtime();
console.log(linear_search());
console.log(`${process.hrtime(start)} seconds`);
