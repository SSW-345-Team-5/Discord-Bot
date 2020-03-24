import sys
import os
import docx
from docxtpl import DocxTemplate, InlineImage


if __name__ == "__main__":
    doc = DocxTemplate("report.docx")

    ticker = sys.argv[1]

    graph_size = docx.shared.Inches(4)

    # os.chdir("../intraday_data")
    # print(os.getcwd())
    intraday_graph = InlineImage(doc, f'../intraday_data/{ticker}.png', graph_size)

    context = {'ticker': ticker.upper(), 'intraday_graph': intraday_graph}
    doc.render(context)
    doc.save(f"{ticker}_report.docx")

