const fs = require("fs");
const path = require("path");

const readFasta = (fasta) => {
  const records = fasta.split("\n>");

  return records.map((record) => {
    const lines = record.split("\n");

    return {
      header: lines[0].replace(/^>/, ""),
      sequence: lines.splice(1).join("")
    };
  });
};

const allRaw = fs.readFileSync(path.join(__dirname, "../demo/all.fasta"), "utf8");
const all = readFasta(allRaw);

const allLengths = all.map((item) => {
  const isValid = typeof item.sequence === "string";
  return isValid ? item.sequence.length : 0;
});

const maxLength = Math.max(...allLengths);
const max = all[allLengths.indexOf(maxLength)];
console.log(JSON.stringify(max));
