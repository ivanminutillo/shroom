import nlp from "compromise";
const eventTypes = ["work", "cite", "consume", "use", "exchange", "transfer"];

const getFirstREAVerb = sentence => {
  let actions = sentence.verbs().conjugate();
  let infAct = actions.map(act => act.Infinitive);
  let unique = [...new Set(infAct)];
  let first = matchEventTypes(unique);
  return first;
};

const matchEventTypes = verbs => {
  let found = verbs.filter(element => eventTypes.includes(element));
  return found[0];
};

const getAmount = sentence => {
  let values = sentence
    .values()
    .values()
    .numbers();
  let found = values.map(el => el.toString());
  return found[0];
};

const getUnit = sentence => {
  let output = sentence
    .match("#Noun")
    .terms()
    .data()
    .filter(o => o.bestTag === "Unit");
  if (output.length > 0) {
    return output[0].text;
  } else {
    return null;
  }
};

const smartSentence = input => {
  let s = nlp(input);
  if (s.has("^bot .")) {
    let command = s.after("^bot");
    return command;
  } else {
    return null;
  }
};

export const findAction = input => {
  let s = smartSentence(input);
  if (s !== null) {
    let verb = getFirstREAVerb(s);
    let value = getAmount(s);
    let unit = getUnit(s);
    return {
      verb: verb,
      value: value,
      unit: unit
    };
  } else
    return {
      verb: null,
      value: null,
      unit: null
    };
};
