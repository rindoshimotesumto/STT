import torch
from transformers import WhisperForConditionalGeneration, WhisperProcessor
from peft import PeftModel


BASE_MODEL = input("Base model path... ")
LORA_MODEL = input("Lora model path... ")
OUT_MODEL = input("Out model path... ")


def main():
    processor = WhisperProcessor.from_pretrained(LORA_MODEL)

    base_model = WhisperForConditionalGeneration.from_pretrained(
        BASE_MODEL,
        torch_dtype=torch.float16,
    )

    model = PeftModel.from_pretrained(base_model, LORA_MODEL)
    model = model.merge_and_unload()

    model.save_pretrained(OUT_MODEL)
    processor.save_pretrained(OUT_MODEL)

    print(f"Saved merged model to: {OUT_MODEL}")


if __name__ == "__main__":
    main()
