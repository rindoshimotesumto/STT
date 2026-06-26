import re
from typing import Optional


class UzbekNumberNormalizer:
    def __init__(self) -> None:
        self.units = {
            "nol": 0,
            "no'l": 0,
            "noʻl": 0,
            "bir": 1,
            "ikki": 2,
            "uch": 3,
            "to'rt": 4,
            "tort": 4,
            "to‘rt": 4,
            "toʻrt": 4,
            "besh": 5,
            "olti": 6,
            "yetti": 7,
            "sakkiz": 8,
            "to'qqiz": 9,
            "toqqiz": 9,
            "to‘qqiz": 9,
            "toʻqqiz": 9,
        }

        self.tens = {
            "o'n": 10,
            "on": 10,
            "o‘n": 10,
            "oʻn": 10,
            "yigirma": 20,
            "o'ttiz": 30,
            "ottiz": 30,
            "o‘ttiz": 30,
            "oʻttiz": 30,
            "qirq": 40,
            "ellik": 50,
            "oltmish": 60,
            "yetmish": 70,
            "sakson": 80,
            "to'qson": 90,
            "toqson": 90,
            "to‘qson": 90,
            "toʻqson": 90,
        }

        self.scales = {
            "yuz": 100,
            "ming": 1000,
            "million": 1_000_000,
            "milliard": 1_000_000_000,
        }

        self.number_words = set(self.units) | set(self.tens) | set(self.scales)

        self.ta_words = {
            "bitta": "bir",
            "birta": "bir",
            "ikkita": "ikki",
            "uchta": "uch",
            "to'rtta": "to'rt",
            "tortta": "tort",
            "to‘rtta": "to‘rt",
            "toʻrtta": "toʻrt",
            "beshta": "besh",
            "oltita": "olti",
            "yettita": "yetti",
            "sakkizta": "sakkiz",
            "to'qqizta": "to'qqiz",
            "toqqizta": "toqqiz",
            "to‘qqizta": "to‘qqiz",
            "toʻqqizta": "toʻqqiz",
            "o'nta": "o'n",
            "onta": "on",
            "o‘nta": "o‘n",
            "oʻnta": "oʻn",
            "yigirmata": "yigirma",
            "o'ttizta": "o'ttiz",
            "ottizta": "ottiz",
            "qirqta": "qirq",
            "ellikta": "ellik",
            "oltmishda": "oltmish",
            "yetmishta": "yetmish",
            "saksonta": "sakson",
            "to'qsonta": "to'qson",
            "toqsonta": "toqson",
            "yuzta": "yuz",
            "mingta": "ming",
        }

        self.tadan_words = {
            "bittadan": "bir",
            "birtadan": "bir",
            "ikkitadan": "ikki",
            "uchtadan": "uch",
            "to'rttadan": "to'rt",
            "torttadan": "tort",
            "beshtadan": "besh",
            "oltitadan": "olti",
            "yettitadan": "yetti",
            "sakkiztadan": "sakkiz",
            "to'qqiztadan": "to'qqiz",
            "toqqiztadan": "toqqiz",
            "o'ntadan": "o'n",
            "ontadan": "on",
            "yigirmatadan": "yigirma",
            "o'ttiztadan": "o'ttiz",
            "ottiztadan": "ottiz",
            "qirqtadan": "qirq",
            "elliktadan": "ellik",
            "oltmishdan": "oltmish",
            "yetmishtadan": "yetmish",
            "saksontadan": "sakson",
            "to'qsontadan": "to'qson",
            "toqsontadan": "toqson",
            "yuztadan": "yuz",
            "mingtadan": "ming",
        }

        self.ordinal_words = {
            "birinchi": ("bir", "inchi"),
            "ikkinchi": ("ikki", "nchi"),
            "uchinchi": ("uch", "inchi"),
            "to'rtinchi": ("to'rt", "inchi"),
            "tortinchi": ("tort", "inchi"),
            "beshinchi": ("besh", "inchi"),
            "oltinchi": ("olti", "nchi"),
            "yettinchi": ("yetti", "nchi"),
            "sakkizinchi": ("sakkiz", "inchi"),
            "to'qqizinchi": ("to'qqiz", "inchi"),
            "toqqizinchi": ("toqqiz", "inchi"),
            "o'ninchi": ("o'n", "inchi"),
            "oninchi": ("on", "inchi"),
            "yigirmanchi": ("yigirma", "nchi"),
            "o'ttizinchi": ("o'ttiz", "inchi"),
            "ottizinchi": ("ottiz", "inchi"),
            "qirqinchi": ("qirq", "inchi"),
            "elliginchi": ("ellik", "inchi"),
            "oltmishinchi": ("oltmish", "inchi"),
            "yetmishinchi": ("yetmish", "inchi"),
            "saksoninchi": ("sakson", "inchi"),
            "to'qsoninchi": ("to'qson", "inchi"),
            "toqsoninchi": ("toqson", "inchi"),
            "yuzinchi": ("yuz", "inchi"),
            "minginchi": ("ming", "inchi"),
        }

        self.dan_words = {
            "birdan": "bir",
            "ikkidan": "ikki",
            "uchdan": "uch",
            "to'rtdan": "to'rt",
            "tortdan": "tort",
            "beshdan": "besh",
            "oltidan": "olti",
            "yettidan": "yetti",
            "sakkizdan": "sakkiz",
            "to'qqizdan": "to'qqiz",
            "toqqizdan": "toqqiz",
            "o'ndan": "o'n",
            "ondan": "on",
            "yigirmadan": "yigirma",
            "o'ttizdan": "o'ttiz",
            "ottizdan": "ottiz",
            "qirqdan": "qirq",
            "ellikdan": "ellik",
            "oltmishdan": "oltmish",
            "yetmishdan": "yetmish",
            "saksondan": "sakson",
            "to'qsondan": "to'qson",
            "toqsondan": "toqson",
            "yuzdan": "yuz",
            "mingdan": "ming",
        }

    def clean_token(self, token: str) -> str:
        return (
            token.lower()
            .replace("`", "'")
            .replace("’", "'")
            .strip()
        )

    def tokenize(self, text: str) -> list[str]:
        return re.findall(r"\w+['‘ʻ]?\w*|[^\w\s]", text, flags=re.UNICODE)

    def is_punctuation(self, token: str) -> bool:
        return bool(re.fullmatch(r"[^\w\s]+", token, flags=re.UNICODE))

    def is_number_word(self, token: str) -> bool:
        return self.clean_token(token) in self.number_words

    def parse_number(self, words: list[str]) -> Optional[int]:
        total = 0
        current = 0
        found = False

        for raw_word in words:
            word = self.clean_token(raw_word)

            if word in self.units:
                current += self.units[word]
                found = True

            elif word in self.tens:
                current += self.tens[word]
                found = True

            elif word == "yuz":
                if current == 0:
                    current = 1
                current *= 100
                found = True

            elif word in ("ming", "million", "milliard"):
                scale = self.scales[word]

                if current == 0:
                    current = 1

                total += current * scale
                current = 0
                found = True

            else:
                return None

        if not found:
            return None

        return total + current

    def flush_number_buffer(self, result: list[str], buffer: list[str]) -> None:
        if not buffer:
            return

        value = self.parse_number(buffer)

        if value is None:
            result.extend(buffer)
        else:
            result.append(str(value))

    def try_fraction(self, tokens: list[str], start: int) -> Optional[tuple[str, int]]:
        current = self.clean_token(tokens[start])

        if current not in self.dan_words:
            return None

        denominator = self.parse_number([self.dan_words[current]])

        if denominator is None or denominator == 0:
            return None

        numerator_buffer: list[str] = []
        index = start + 1

        while index < len(tokens):
            token = self.clean_token(tokens[index])

            if self.is_number_word(token):
                numerator_buffer.append(token)
                index += 1
            else:
                break

        if not numerator_buffer:
            return None

        numerator = self.parse_number(numerator_buffer)

        if numerator is None:
            return None

        return f"{numerator}/{denominator}", index

    def normalize(self, text: str) -> str:
        tokens = self.tokenize(text)

        result: list[str] = []
        buffer: list[str] = []

        index = 0

        while index < len(tokens):
            token = tokens[index]
            low = self.clean_token(token)

            fraction = self.try_fraction(tokens, index)

            if fraction:
                self.flush_number_buffer(result, buffer)
                buffer = []

                fraction_text, new_index = fraction
                result.append(fraction_text)

                index = new_index
                continue

            if low in self.ordinal_words:
                base_word, suffix = self.ordinal_words[low]
                buffer.append(base_word)

                value = self.parse_number(buffer)

                if value is not None:
                    result.append(f"{value}-{suffix}")
                else:
                    result.extend(buffer)

                buffer = []
                index += 1
                continue

            if low in self.ta_words:
                buffer.append(self.ta_words[low])

                value = self.parse_number(buffer)

                if value is not None:
                    result.append(str(value))
                    result.append("ta")
                else:
                    result.extend(buffer)

                buffer = []
                index += 1
                continue

            if low in self.tadan_words:
                buffer.append(self.tadan_words[low])

                value = self.parse_number(buffer)

                if value is not None:
                    result.append(str(value))
                    result.append("tadan")
                else:
                    result.extend(buffer)

                buffer = []
                index += 1
                continue

            if self.is_number_word(low):
                buffer.append(low)
                index += 1
                continue

            self.flush_number_buffer(result, buffer)
            buffer = []

            result.append(token)
            index += 1

        self.flush_number_buffer(result, buffer)

        return self.detokenize(result)

    def detokenize(self, tokens: list[str]) -> str:
        output = ""

        for token in tokens:
            if self.is_punctuation(token):
                output = output.rstrip() + token + " "
            else:
                output += token + " "

        return output.strip()


class RussianNumberNormalizer:
    UNITS = {
        "ноль": 0,
        "один": 1, "одна": 1, "одно": 1,
        "два": 2, "две": 2,
        "три": 3,
        "четыре": 4,
        "пять": 5,
        "шесть": 6,
        "семь": 7,
        "восемь": 8,
        "девять": 9,

        "десять": 10,
        "одиннадцать": 11,
        "двенадцать": 12,
        "тринадцать": 13,
        "четырнадцать": 14,
        "пятнадцать": 15,
        "шестнадцать": 16,
        "семнадцать": 17,
        "восемнадцать": 18,
        "девятнадцать": 19,
    }

    TENS = {
        "двадцать": 20,
        "тридцать": 30,
        "сорок": 40,
        "пятьдесят": 50,
        "шестьдесят": 60,
        "семьдесят": 70,
        "восемьдесят": 80,
        "девяносто": 90,
    }

    HUNDREDS = {
        "сто": 100,
        "двести": 200,
        "триста": 300,
        "четыреста": 400,
        "пятьсот": 500,
        "шестьсот": 600,
        "семьсот": 700,
        "восемьсот": 800,
        "девятьсот": 900,
    }

    SCALES = {
        "тысяча": 1000,
        "тысячи": 1000,
        "тысяч": 1000,

        "миллион": 1_000_000,
        "миллиона": 1_000_000,
        "миллионов": 1_000_000,

        "миллиард": 1_000_000_000,
        "миллиарда": 1_000_000_000,
        "миллиардов": 1_000_000_000,
    }

    NUMBER_WORDS = set(UNITS) | set(TENS) | set(HUNDREDS) | set(SCALES)

    def normalize(self, text: str) -> str:
        tokens = self.tokenize(text)

        result: list[str] = []
        buffer: list[str] = []

        for token in tokens:
            word = self.clean_token(token)

            if word in self.NUMBER_WORDS:
                buffer.append(word)
                continue

            self.flush_number_buffer(result, buffer)
            buffer = []

            result.append(token)

        self.flush_number_buffer(result, buffer)

        return self.detokenize(result)

    def clean_token(self, token: str) -> str:
        return token.lower().strip()

    def tokenize(self, text: str) -> list[str]:
        return re.findall(r"\w+|[^\w\s]", text, flags=re.UNICODE)

    def is_punctuation(self, token: str) -> bool:
        return bool(re.fullmatch(r"[^\w\s]+", token, flags=re.UNICODE))

    def parse_number(self, words: list[str]) -> int | None:
        total = 0
        current = 0
        found = False

        for raw_word in words:
            word = self.clean_token(raw_word)

            if word in self.UNITS:
                current += self.UNITS[word]
                found = True

            elif word in self.TENS:
                current += self.TENS[word]
                found = True

            elif word in self.HUNDREDS:
                current += self.HUNDREDS[word]
                found = True

            elif word in self.SCALES:
                scale = self.SCALES[word]

                if current == 0:
                    current = 1

                total += current * scale
                current = 0
                found = True

            else:
                return None

        if not found:
            return None

        return total + current

    def flush_number_buffer(self, result: list[str], buffer: list[str]) -> None:
        if not buffer:
            return

        value = self.parse_number(buffer)

        if value is None:
            result.extend(buffer)
        else:
            result.append(str(value))

    def detokenize(self, tokens: list[str]) -> str:
        output = ""

        for token in tokens:
            if self.is_punctuation(token):
                output = output.rstrip() + token + " "
            else:
                output += token + " "

        return output.strip()


class NumberNormalizer:
    def __init__(self) -> None:
        self.uz = UzbekNumberNormalizer()
        self.ru = RussianNumberNormalizer()

    def normalize(self, text: str, lang: str) -> str:
        if lang == "uz":
            return self.uz.normalize(text)

        if lang == "ru":
            return self.ru.normalize(text)

        return text
