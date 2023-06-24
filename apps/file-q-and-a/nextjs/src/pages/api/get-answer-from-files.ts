import type { NextApiRequest, NextApiResponse } from "next";

import { completionStream } from "../../services/openai";
import { FileChunk } from "../../types/file";

type Data = {
  answer?: string;
  error?: string;
};

const MAX_FILES_LENGTH = 2000 * 3;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Only accept POST requests
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const fileChunks = req.body.fileChunks as FileChunk[];

  const question = req.body.question as string;

  if (!Array.isArray(fileChunks)) {
    res.status(400).json({ error: "fileChunks must be an array" });
    return;
  }

  if (!question) {
    res.status(400).json({ error: "question must be a string" });
    return;
  }

  try {
    const filesString = fileChunks
      .map((fileChunk) => `###\n\"${fileChunk.filename}\"\n${fileChunk.text}`)
      .join("\n")
      .slice(0, MAX_FILES_LENGTH);

    const prompt2 =
      `Given a description of an occupation, try to classify it using the content of the file extracts below, and if you cannot classify the described occupation, or find a relevant file, just output \"I couldn't find the ISCO-08 code for that description in your files.\".\n\n` +
      `If the occupation is not contained in the files or if there are no file extracts, respond with \"I couldn't find the occupation for that description in your files.\" If the description is not related to an occupation, respond with \"That's not a valid description of an occupation.\"\n\n` +
      `In the cases where you can find the occupation, first give the 4 digit ISCO-08 code. Then explain how you found the ISCO-8 code from the source, and use the exact filename and page number of the source file you mention. Do not make up the names of any other files other than those mentioned in the files context. Give the answer in markdown format.` +
      `Use the following format:\n\nDescription: <question>\n\nFiles:\n<###\n\"filename 1\"\nfile text\npage number>\n<###\n\"filename 2\"\nfile text\npage number>...\n\nAnswer: <answer or "I couldn't find the ISCO-08 code for that description in your files." or "That's not a valid description.">\n\n` +
      `Description: ${question}\n\n` +
      `Files:\n${filesString}\n\n` +
      `Answer:`;

      const prompt =
      `Given a description of an occupation, try to classify it into an ISCO-08 Unit Group with a 4-digit code using the content of the file extracts below. If you cannot classify it into a Unit Group because the description is too crude, try to classify it into a 3-digit Minor Group or 2-digit Sub-major Group.\n\n` +
      `If the described occupation is not contained in the files use one of the following auxiliary codes:\n` +
      `9701: Home duties (e.g., parent staying home to care for children).\n` +
      `9702: Studies (any secondary, post-secondary or tertiary institutions).\n` +
      `9703: Social beneficiary (e.g., unemployed, retired etc).\n` +
      `9704: Unknown (\"I don't know\" or a similar description).\n` +
      `9705: Vague (i.e., a description other than \"I don't know\" that is unclear or ambiguous to the extent that two or more Sub-major Groups apply, or so poorly expressed that it cannot be interpreted).\n\n` +
      `If the description is not related to an occupation and cannot be classified into an auxiliary code, respond with \"That's not a valid description of an occupation.\"\n` +
      `In the cases where you can find the occupation, first give the 4-digit Unit Group, 3-digit Minor Group, or 2-digit Sub-major Group code and name of the group. Then explain how you found the group from the source and use the exact filename of the source file you mention. Do not make up a group code. Do not make up the names of any other files other than those mentioned in the files context. Give the answer in markdown format.\n\n` +
      `Use the following format:\n\n` +
      `Description: <question>\n\n` +
      `Files:\n<###\n\"filename 1\"\nfile text>\n<###\n\"filename 2\"\nfile text>...\n\n` +
      `Answer: <answer or \"That is not a valid description.\">\n\n` +
      `Description: ${question}\n\n` +
      `Files:\n${filesString}\n\n` +
      `Answer:`;

    const stream = completionStream({
      prompt,
    });

    // Set the response headers for streaming
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });

    // Write the data from the stream to the response
    for await (const data of stream) {
      res.write(data);
    }

    // End the response when the stream is done
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
