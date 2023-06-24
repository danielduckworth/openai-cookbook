from utils import get_embedding
from flask import jsonify
from config import *
from flask import current_app

import openai

from config import *

TOP_K = 10


def get_answer_from_files(question, session_id, pinecone_index):
    logging.info(f"Getting answer for question: {question}")

    search_query_embedding = get_embedding(question, EMBEDDINGS_MODEL)

    try:
        query_response = pinecone_index.query(
            namespace=session_id,
            top_k=TOP_K,
            include_values=False,
            include_metadata=True,
            vector=search_query_embedding,
        )
        logging.info(
            f"[get_answer_from_files] received query response from Pinecone: {query_response}")

        files_string = ""
        file_text_dict = current_app.config["file_text_dict"]

        for i in range(len(query_response.matches)):
            result = query_response.matches[i]
            file_chunk_id = result.id
            score = result.score
            filename = result.metadata["filename"]
            file_text = file_text_dict.get(file_chunk_id)
            file_string = f"###\n\"{filename}\"\n{file_text}\n"
            if score < COSINE_SIM_THRESHOLD and i > 0:
                logging.info(
                    f"[get_answer_from_files] score {score} is below threshold {COSINE_SIM_THRESHOLD} and i is {i}, breaking")
                break
            files_string += file_string
        
        # Note: this is not the proper way to use the ChatGPT conversational format, but it works for now
        messages = [
            {
                "role": "system",
                "content": f"Given a description of an occupation, try to \
                    classify it into an ISCO-08 Unit Group with a 4-digit \
                    code using the content of the file extracts below. If you \
                    cannot classify it into a Unit Group because the \
                    descriptionis too crude, try to classify it into a 3-digit \
                    Minor Group or 2-digit Sub-major Group.\n\n"
                f"If the described occupation is not contained in the files \
                    use one of the following auxiliary codes:\n"
                f"9701: Home duties (e.g., parent staying home to care for \
                    children).\n"
                f"9702: Studies (any secondary, post-secondary or tertiary \
                    institutions).\n"
                f"9703: Social beneficiary (e.g., unemployed, retired etc).\n"
                f'9704: Unknown ("I don\'t know" or a similar description).\n'
                f'9705: Vague (i.e., a description other than "I don\'t know" that is unclear or ambiguous to the extent that two or more Sub-major Groups apply, or so poorly expressed that it cannot be interpreted).\n\n'
                f'If the description is not related to an occupation and cannot be classified into an auxiliary code, respond with "That\'s not a valid description of an occupation."\n\n'
                f"In the cases where you can find the occupation, first give the 4-digit Unit Group, 3-digit Minor Group, or 2-digit "
                f"Sub-major Group code and name of the group. Then explain how you found the group from the source and use the exact "
                f"filename of the source file you mention. Do not make up a group code. Do not make up the names of any other files "
                f"other than those mentioned in the files context. Give the answer in markdown format.\n\n "
                f"Use the following format:\n\n"
                f"Description: <question>\n\n"
                f'Files:\n<###\n"filename 1"\nfile text>\n<###\n"filename 2"\nfile text>...\n\n'
                f'Answer: <answer or "That is not a valid description.">\n\n'
                f"Description: ${question}\n\n"
                f"Files:\n${files_string}\n\n"
                f"Answer:",
            },
        ]

        response = openai.ChatCompletion.create(
            messages=messages,
            model=GENERATIVE_MODEL,
            max_tokens=1000,
            temperature=0,
        )

        choices = response["choices"]  # type: ignore
        answer = choices[0].message.content.strip()

        logging.info(f"[get_answer_from_files] answer: {answer}")

        return jsonify({"answer": answer})

    except Exception as e:
        logging.info(f"[get_answer_from_files] error: {e}")
        return str(e)
