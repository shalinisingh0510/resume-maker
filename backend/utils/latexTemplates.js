const escapeLatex = (value = '') =>
  String(value)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');

const buildLatexTemplate = ({ title = 'Resume Template', accentHex = '2563eb' } = {}) => `\\documentclass[11pt]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage[hidelinks]{hyperref}
\\usepackage{enumitem}
\\usepackage{xcolor}
\\definecolor{accent}{HTML}{${accentHex}}
\\setlist[itemize]{leftmargin=1.2em, itemsep=0.2em, topsep=0.2em}
\\pagestyle{empty}

\\begin{document}
\\begin{center}
    {\\LARGE \\textbf{Your Name}} \\\\
    \\vspace{4pt}
    \\href{mailto:you@email.com}{you@email.com} \\;|\\; +1 000 000 0000 \\;|\\; City, Country \\\\
    \\href{https://linkedin.com/in/yourprofile}{linkedin.com/in/yourprofile}
\\end{center}

\\vspace{6pt}
{\\large \\textcolor{accent}{\\textbf{${escapeLatex(title)}}}}

\\vspace{8pt}
\\textbf{Professional Summary} \\\\
Results-driven professional with strong execution, communication, and problem-solving skills.

\\vspace{8pt}
\\textbf{Experience} \\\\
\\textbf{Company Name} \\hfill Jan 2022 -- Present \\\\
\\textit{Role Title} \\\\
\\begin{itemize}
  \\item Led high-impact initiatives and improved process efficiency.
  \\item Collaborated cross-functionally to deliver measurable outcomes.
\\end{itemize}

\\vspace{6pt}
\\textbf{Education} \\\\
\\textbf{University Name} \\hfill 2018 -- 2022 \\\\
Bachelor's Degree in Field

\\vspace{6pt}
\\textbf{Skills} \\\\
Languages: JavaScript, Python, SQL \\\\
Tools: Git, Docker, AWS

\\end{document}
`;

module.exports = { buildLatexTemplate };
