import re


def regexify_pattern(simple_pattern):
    if simple_pattern is None:
        return None

    simple_pattern = simple_pattern.replace("X", "[A-Z*]")
    simple_pattern = re.sub(r"(\d+)-(\d+)", r"{\1,\2}", simple_pattern)
    # Replace numbers in string as long as they have not already been put in curly braces (by previous regexp)
    simple_pattern = re.sub(r"(\d+)(?![\d,]*})", r"{\1}", simple_pattern)

    return simple_pattern


def search_records(records, pattern):
    """
    Does not currently match "wildcards"/STOP codons in sequences. A RegExp such as: [R\*][R\*][A-Z\*]{33}[R\*][A-Z\*]
    does the job, but is too difficult to manually construct. Is there any way to automate the construction of that?

    :param records:
    :param pattern:
    :return:
    """
    if records is None or pattern is None:
        return None

    exp = re.compile(pattern, flags=re.IGNORECASE)
    matches = {}

    for record in records:
        match = list(exp.finditer(record.sequence))
        if len(match) > 0:
            matches[record.id] = list(
                map(
                    lambda m: {
                        "span": {"start": m.span()[0], "end": m.span()[1]},
                        "match": str(m.group()),
                    },
                    match,
                )
            )

    return matches
