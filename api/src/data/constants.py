REMOVED_FIELDS = ["_cls"]

ALPHABET = {
    "A": {"name": "Alanine", "abr": "Ala"},
    "C": {"name": "Cysteine", "abr": "Cys"},
    "D": {"name": "Aspartic Acid", "abr": "Asp"},
    "E": {"name": "Glutamic Acid", "abr": "Glu"},
    "F": {"name": "Phenylalanine", "abr": "Phe"},
    "G": {"name": "Glycine", "abr": "Gly"},
    "H": {"name": "Histidine", "abr": "His"},
    "I": {"name": "Isoleucine", "abr": "Ile"},
    "K": {"name": "Lysine", "abr": "Lys"},
    "L": {"name": "Leucine", "abr": "Leu"},
    "M": {"name": "Methionine", "abr": "Met"},
    "N": {"name": "Asparagine", "abr": "Asn"},
    "P": {"name": "Proline", "abr": "Pro"},
    "Q": {"name": "Glutamine", "abr": "Gln"},
    "R": {"name": "Arginine", "abr": "Arg"},
    "S": {"name": "Serine", "abr": "Ser"},
    "T": {"name": "Threonine", "abr": "Thr"},
    "V": {"name": "Valine", "abr": "Val"},
    "W": {"name": "Tryptophan", "abr": "Trp"},
    "Y": {"name": "Tyrosine", "abr": "Tyr"},
    # Amino acids ambiguity codes:
    "B": {"name": "Asparagine/Aspartic Acid", "abr": "Asx"},
    "Z": {"name": "Glutamine/Glutamic Acid", "abr": "Glx"},
}

# This is all valid letters for a record. If you want to allow records with all characters is another question.
VALID_ALPHABET = set([*ALPHABET.keys(), "*", "."])
