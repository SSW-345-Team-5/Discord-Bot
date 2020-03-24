import sys
import os
import docx
import pdfkit
from docxtpl import DocxTemplate, InlineImage


if __name__ == "__main__":
    ticker = sys.argv[1]

    in_file = "commands/report/report.docx"
    out_file_docx = f"commands/report/{ticker}_report.docx"
    # out_file_pdf = f"commands/report/{ticker}_report.pdf"

    doc = DocxTemplate(in_file)

    graph_size = docx.shared.Inches(4)

    # os.chdir("commands/intraday")
    # print(os.getcwd())

    intraday_graph = InlineImage(
        doc, f'commands/intraday/{ticker}.png', graph_size)

    context = {'ticker': ticker.upper(), 'intraday_graph': intraday_graph}
    doc.render(context)
    doc.save(out_file_docx)

    # pdfkit.from_file(out_file_docx, out_file_pdf)