Given a description of an occupation, try to classify it into an ISCO-08 Unit Group with a 4-digit code using the content of the file extracts below. If you cannot classify it into a Unit Group because the description is too crude, try to classify it into a 3-digit Minor Group or 2-digit Sub-major Group.

If the described occupation is not contained in the files use one of the following auxiliary codes:

9701: Home duties (e.g., parent staying home to care for children). 
9702: Studies (any secondary, post-secondary or tertiary institutions). 
9703: Social beneficiary (e.g., unemployed, retired etc). 
9704: Unknown ("I don't know" or a similar description). 
9705: Vague (i.e., a description other than "I don't know" that is unclear or ambiguous to the extent that two or more Sub-major Groups apply, or so poorly expressed that it cannot be interpreted).

If the description is not related to an occupation and cannot be classified into an auxiliary code, respond with "That's not a valid description of an occupation."

In the cases where you can find the occupation, first give the 4-digit Unit Group, 3-digit Minor Group, or 2-digit Sub-major Group code and name of the group. Then explain how you found the group from the source and use the exact filename of the source file you mention. Do not make up a group code. Do not make up the names of any other files other than those mentioned in the files context. Give the answer in markdown format.

Use the following format:

Description: <question>

Files:
<###
"filename 1"
file text>
<###
"filename 2"
file text>...

Answer: <answer or "That is not a valid description.">

Description: ${question}

Files:
${filesString}

Answer:

---
`Given a description of an occupation, try to classify it into an ISCO-08 Unit Group with a 4-digit code using the content of the file extracts below. If you cannot classify it into a Unit Group because the description is too crude, try to classify it into a 3-digit Minor Group or 2-digit Sub-major Group.`

`If the described occupation is not contained in the files use one of the following auxiliary codes:`

`9701: Home duties (e.g., parent staying home to care for children).`
`9702: Studies (any secondary, post-secondary or tertiary institutions).`
`9703: Social beneficiary (e.g., unemployed, retired etc).`
`9704: Unknown ("I don't know" or a similar description).`
`9705: Vague (i.e., a description other than "I don't know" that is unclear or ambiguous to the extent that two or more Sub-major Groups apply, or so poorly expressed that it cannot be interpreted).`

`If the description is not related to an occupation and cannot be classified into an auxiliary code, respond with "That's not a valid description of an occupation."`

`In the cases where you can find the occupation, first give the 4-digit Unit Group, 3-digit Minor Group, or 2-digit Sub-major Group code and name of the group. Then explain how you found the group from the source and use the exact filename of the source file you mention. Do not make up a group code. Do not make up the names of any other files other than those mentioned in the files context. Give the answer in markdown format.`

`Use the following format:`

`Description: <question>`

`Files:
<###
"filename 1"
file text>
<###
"filename 2"
file text>...`

`Answer: <answer or "That is not a valid description.">`

`Description: ${question}`

`Files:
${filesString}`

`Answer:`

---

```html
<pre><code>Given a description of an occupation, try to classify it into an ISCO-08 Unit Group with a 4-digit code using the content of the file extracts below. If you cannot classify it into a Unit Group because the description is too crude, try to classify it into a 3-digit Minor Group or 2-digit Sub-major Group.</code></pre>
<pre><code class="language-typescript">If the described occupation is not contained in the files use one of the following auxiliary codes. 9701: Home duties (e.g., parent staying home to care for children). 9702: Studies (any secondary, post-secondary or tertiary institutions). 9703: Social beneficiary (e.g., unemployed, retired etc). 9704: Unknown ("I don't know" or a similar description). 9705: Vague (i.e., a description other than "I don't know" that is unclear or ambiguous to the extent that two or more Sub-major Groups apply, or so poorly expressed that it cannot be interpreted).</code></pre>
<pre><code>If the description is not related to an occupation and cannot be classified into an auxiliary code, respond with "That's not a valid description of an occupation."</code></pre>
<pre><code class="language-typescript">In the cases where you can find the occupation, first give the Unit Group, Minor Group, or Sub-major Group code and name of the group. Then explain how you found the group from the source and use the exact filename of the source file you mention. Do not make up the names of any other files other than those mentioned in the file's context. Give the answer in markdown format.</code></pre>
<pre><code class="language-typescript">Use the following format:

Description: &lt;question&gt;

Files:
&lt;###
"filename 1"
file text&gt;
&lt;###
"filename 2"
file text&gt;...

Answer: &lt;answer or "That's not a valid description."</code></pre>
<p></p>
```

```typescript
const prompt =
      `Given a description of an occupation, try to classify it using the content of the file extracts below, and if you cannot classify the described occupation, or find a relevant file, just output \"I couldn't find the ISCO-08 code for that description in your files.\".\n\n` +
      `If the occupation is not contained in the files or if there are no file extracts, respond with \"I couldn't find the occupation for that description in your files.\" If the description is not related to an occupation, respond with \"That's not a valid description of an occupation.\"\n\n` +
      `In the cases where you can find the occupation, first give the 4 digit ISCO-08 code. Then explain how you found the ISCO-8 code from the source, and use the exact filename and page number of the source file you mention. Do not make up the names of any other files other than those mentioned in the files context. Give the answer in markdown format.` +
      `Use the following format:\n\nDescription: <question>\n\nFiles:\n<###\n\"filename 1\"\nfile text\npage number>\n<###\n\"filename 2\"\nfile text\npage number>...\n\nAnswer: <answer or "I couldn't find the ISCO-08 code for that description in your files." or "That's not a valid description.">\n\n` +
      `Description: ${question}\n\n` +
      `Files:\n${filesString}\n\n` +
      `Answer:`;
```

### Description 1

#### GPT Answer

Description: carpentry. builds burnt out houses.

Answer: 3123 Carpentry and joinery workers. I found this group by searching for "carpentry" in "ISCO-08 EN Vol 1.pdf". The file text states that "carpenters, who build structures using wood and other materials, are all classified in the construction and repair of buildings and structures."

![description 1](image.png)

Observations:

The quoted passage is found on page x. However the last part of the passage is incorrect.

As quoted: "carpenters, who build structures using wood and other materials, are all classified in the construction and repair of buildings and structures."

Verbatim quote from document: "carpenters, who build structures using wood and other materials, are all clasTJmFEJO6OJU(SPVQ$BSQFOUFSTBOE+PJOFS

6OJU(SPVQ$BSQFOUFSTBOE+PJOFST


#### True Answer

Unit Group: 7115 Carpenters and Joiners
