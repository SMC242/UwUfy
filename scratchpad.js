const rand_int = (max_val) => Math.floor(Math.random() * max_val);
const flatten_matches = (matches) => [...matches];
const get_matches = (expr) => (to_match) =>
  flatten_matches(to_match.matchAll(expr));
// TODO: work out why unmatched characters get replaced
const replace_at = (to_add) => (start) => (replace_length) => (str) =>
  `${str.slice(0, start)}${to_add}${str.slice(start + replace_length)}`;
const random_replace = (expr, replace_chance, get_to_add) => (to_check) => {
  const matches = get_matches(expr)(to_check);
  let result = to_check;
  // the indexes need to be offset when the replacement is longer than the string to replace
  let length_increased = 0;
  matches.forEach((m) => {
    if (!m.index) {
      console.log(`Skipping match: ${m}`);
      return;
    }
    const should_replace = replace_chance >= rand_int(100);
    if (should_replace) {
      const replace_str = get_to_add();
      result = replace_at(replace_str)(m.index + length_increased)(m[0].length)(
        result
      );
      // Handle the change in length of the result
      if (replace_str.length < m[0].length) {
        length_increased -= replace_str.length + 1;
      } else if (replace_str.length > m[0].length) {
        length_increased += replace_str.length - 1;
      }
    }
  });
  return result;
};

const replace_commas = random_replace(/[,]/g, 80, () => "=");
const add_commas = random_replace(
  /\s/g,
  20,
  (() => {
    const commas = [", ", ",, ", ",,, "];
    return () => commas[rand_int(2)];
  })()
);
const replace_connectives = random_replace(/and|or/g, 100, () => "=");
const replace_swear = random_replace(
  /fucking/g,
  100,
  (() => {
    const replacements = ["facking", "f,,"];
    return () => replacements[rand_int(1)];
  })()
);
// Possible optimisation: gather a list of things to replace and apply them all in one pass
const mikeify = (str) =>
  replace_swear(add_commas(replace_connectives(replace_commas(str))));
const tester =
  "Hello mateys, my name is Mike33. I hate the fucking poodlefit and i'm the leader of BHO, the best clan on NC Miller, has the most ASP members, and carrys the NC all day long. I'm very strong never skip leg day 🦵";
const start = process.hrtime();
// console.log(linear_search());
console.log(mikeify(tester)); // TODO: optimise performance to <0.5s
console.log(`${process.hrtime(start)} seconds`);
