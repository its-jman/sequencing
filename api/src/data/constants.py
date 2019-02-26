REMOVED_FIELDS = ["_cls"]
RENAMED_FIELDS = {"_id": "id"}

ALPHABET = {
    "A": {"name": "Alanine", "abr": "Ala", "freq": 0.074},
    "C": {"name": "Cysteine", "abr": "Cys", "freq": 0.042},
    "D": {"name": "Aspartic Acid", "abr": "Asp", "freq": 0.044},
    "E": {"name": "Glutamic Acid", "abr": "Glu", "freq": 0.059},
    "F": {"name": "Phenylalanine", "abr": "Phe", "freq": 0.033},
    "G": {"name": "Glycine", "abr": "Gly", "freq": 0.058},
    "H": {"name": "Histidine", "abr": "His", "freq": 0.037},
    "I": {"name": "Isoleucine", "abr": "Ile", "freq": 0.074},
    "K": {"name": "Lysine", "abr": "Lys", "freq": 0.029},
    "L": {"name": "Leucine", "abr": "Leu", "freq": 0.038},
    "M": {"name": "Methionine", "abr": "Met", "freq": 0.076},
    "N": {"name": "Asparagine", "abr": "Asn", "freq": 0.072},
    "P": {"name": "Proline", "abr": "Pro", "freq": 0.018},
    "Q": {"name": "Glutamine", "abr": "Gln", "freq": 0.040},
    "R": {"name": "Arginine", "abr": "Arg", "freq": 0.050},
    "S": {"name": "Serine", "abr": "Ser", "freq": 0.081},
    "T": {"name": "Threonine", "abr": "Thr", "freq": 0.062},
    "W": {"name": "Tryptophan", "abr": "Trp", "freq": 0.013},
    "Y": {"name": "Tyrosine", "abr": "Tyr", "freq": 0.033},
    "V": {"name": "Valine", "abr": "Val", "freq": 0.068},
    # Amino acids ambiguity codes:
    # "B": {"name": "Asparagine/Aspartic Acid", "abr": "Asx"},
    # "Z": {"name": "Glutamine/Glutamic Acid", "abr": "Glx"},
}

# This is all valid letters for a record. If you want to allow records with all characters is another question.
VALID_ALPHABET = set([*ALPHABET.keys(), "*", "."])
