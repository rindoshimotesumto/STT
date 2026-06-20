from src.service.nums_normalizer import UzbekNumberNormalizer

uzbek_number_normalizer = UzbekNumberNormalizer()

tests = [
        "bir ming yuz uch",
        "bir ming yuz uchta olma oldim",
        "uchta olma oldim",
        "uchtadan bering",
        "birinchi vagon",
        "ikkinchi joy",
        "uchinchi xona",
        "o'ninchi sinf",
        "yigirmanchi vagon",
        "uchdan bir qismi",
        "o'ndan to'qqiz",
        "yuzdan yigirma besh",
        "telefon raqamim to'qson sakkiz million yetti yuz ming besh yuz o'n ikki",
    ]

for text in tests:
    print(f"{text} => {uzbek_number_normalizer.normalize(text)}")