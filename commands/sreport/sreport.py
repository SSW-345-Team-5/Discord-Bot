import sys
import os
import docx
import json
import pdfkit
from docxtpl import DocxTemplate, InlineImage
from datetime import datetime


if __name__ == "__main__":
    ticker = sys.argv[1]

    in_file = "commands/sreport/report.docx"
    out_file_docx = f"commands/sreport/{ticker}_report.docx"

    doc = DocxTemplate(in_file)

    graph_size = docx.shared.Inches(4)

    date = datetime.now().strftime("%m/%d/%y")

    time = datetime.now().strftime("%H:%M:%S")

    intraday_graph = InlineImage(
        doc, f'commands/intraday/{ticker}.png', graph_size)

    intraday_close = intraday_open = intraday_high = intraday_volume = intraday_avg_price = intraday_delta = 0

    intraday_low = sys.maxsize

    with open(f'commands/intraday/{ticker}.json', mode='r') as data_file:
        data_dict = json.load(data_file)
        interval = data_dict["Meta Data"]["4. Interval"]
        time_series = data_dict[f'Time Series ({interval})']
        keys = list(time_series.keys())

        intraday_close = float(time_series[keys[0]]["4. close"])
        intraday_open = round(
            float(time_series[keys[len(time_series)-1]]["1. open"]), 2)

        for timestamp, data in time_series.items():

            if float(data["2. high"]) > intraday_high:
                intraday_high = float(data["2. high"])

            if float(data["3. low"]) < intraday_low:
                intraday_low = float(data["3. low"])

            intraday_volume += int(data["5. volume"])

            intraday_avg_price += float(data["4. close"])


        intraday_avg_price /= len(time_series)
        intraday_avg_price = round(intraday_avg_price, 2)
        intraday_delta = round(intraday_close - intraday_open, 2)

    monthly_graph = InlineImage(
        doc, f'commands/monthly/{ticker}.png', graph_size)

    context = {'ticker': ticker.upper(), 'date': date, 'time': time, 'intraday_graph': intraday_graph, 'intraday_open': intraday_open, 'intraday_close': intraday_close, 'intraday_high': intraday_high, 'intraday_low': intraday_low, 'intraday_delta': intraday_delta, 'intraday_avg': intraday_avg_price, 'intraday_vol': intraday_volume,
               'monthly_graph': monthly_graph}

    doc.render(context)
    doc.save(out_file_docx)


"""
"Global Quote": {
        "01. symbol": "IBM",
        "02. open": "120.4800",
        "03. high": "122.9200",
        "04. low": "120.1672",
        "05. price": "121.5000",
        "06. volume": "5538597",
        "07. latest trading day": "2020-04-09",
        "08. previous close": "119.2900",
        "09. change": "2.2100",
        "10. change percent": "1.8526%"
"""