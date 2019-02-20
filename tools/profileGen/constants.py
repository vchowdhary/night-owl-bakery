# File directory constants
NAMEFILE_DIR = "lib/";
OUTPUT_DIR = "../../data/";

############################ User profile constants ############################
ORIGINS = [
    "AK",
    "AL",
    "AR",
    "AZ",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "IA",
    "ID",
    "IL",
    "IN",
    "KS",
    "KY",
    "LA",
    "MA",
    "MD",
    "ME",
    "MI",
    "MN",
    "MO",
    "MS",
    "MT",
    "NC",
    "ND",
    "NE",
    "NH",
    "NJ",
    "NM",
    "NV",
    "NY",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VA",
    "VT",
    "WA",
    "WI",
    "WV",
    "WY"
];

# Possible Likert scale types
LIKERTS = [
    "valuesFriendship",
    "valuesFamily",
    "valuesCommunity",
    "valuesSelf",
    "valuesFaith",
    "valuesEducation",
    "valuesHealth",
    "valuesStrength"
];

# Semantic differential types
SEMDIFFS = [
    "dogCat",
    "donutMunchkins",
    "cakePie",
    "steelersPirates"
];


############################### CSV header constants ###########################
# Output CSV header names
HEADERS = [
    "id",
    "nameFirst",
    "nameLast",
    "origin"
];
# Generate likert and semDiff headers based on constants
for likertVal in LIKERTS:
    likertHeader = "likert." + likertVal;
    HEADERS.append(likertHeader)
for semDiffVal in SEMDIFFS:
    semDiffHeader = "semDiff." + semDiffVal;
    HEADERS.append(semDiffHeader)

# Headers for matching CSV
MATCHING_HEADERS = [
    "employerID",
    "employeeID",
    "score"
];
