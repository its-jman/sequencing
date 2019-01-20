import re
import json

from operator import attrgetter
from Bio import SeqIO


def gen_pattern(pattern: str):
    pattern = pattern.replace("X", "[A-Z]")
    pattern = pattern.replace("33", "{33}")
    pattern = pattern.replace("34", "{34}")

    return re.compile(pattern)


AMINO_PATTERN = re.compile("\(([0-9]*) amino acids\)")
PATTERNS = map(
    lambda pattern: {
        "name": pattern,
        "re": gen_pattern(pattern),
        "file": open("./output/%s" % pattern, "w"),
        "sum": 0,
        "out": {"len": -1, "records": {}},
    },
    [
        "RRX33RXR",
        "RRX34RXR",
        "RXRX33RR",
        "RXRX34RR",
        "GGX33GXG",
        "AAX33AXA",
        "LLX33LXL",
        "MMX33MXM",
        "FFX33FXF",
        "WWX33WXW",
        "KKX33KXK",
        "QQX33QXQ",
        "EEX33EXE",
        "SSX33SXS",
        "PPX33PXP",
        "VVX33VXV",
        "IIX33IXI",
        "CCX33CXC",
        "YYX33YXY",
        "HHX33HXH",
        "NNX33NXN",
        "DDX33DXD",
        "TTX33TXT",
    ],
)
PATTERNS = list(PATTERNS)


def load_source(filename):
    out = list(SeqIO.parse(filename, "fasta"))
    print(len(out))
    return sorted(out, key=attrgetter("id"))


def test_pattern(pattern, record):
    out = pattern["re"].finditer(str(record.seq))
    out = list(out)

    if len(out) > 0:
        pattern["out"]["records"][record.id] = {}
        record_out = pattern["out"]["records"][record.id]

        record_out["record"] = {
            "description": record.description,
            "len": len(record.seq),
            "seq": str(record.seq),
        }

        record_out["matches"] = []
        for i in range(len(out)):
            o = out[i]
            record_out["matches"].append(
                {"span": str(o.span()), "match": str(o.group())}
            )
            # fp.write("%s: %s\n" % (o.span(), o.group()))
        # fp.write("\n\n")
        return True
    return False


def main():
    data = load_source("./all.fasta")
    for record in data:
        amino_num_value = AMINO_PATTERN.findall(record.description)[0]

        for pattern in PATTERNS:
            if test_pattern(pattern, record):
                pattern["sum"] += int(amino_num_value)

    # Cleanup
    for pattern in PATTERNS:
        pattern["out"]["len"] = pattern["sum"]
        json.dump(pattern["out"], pattern["file"])
        # pattern["file"].write("Sum: %i" % pattern["sum"])
        # pattern["file"].close()


main()
