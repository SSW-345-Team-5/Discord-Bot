import sys
import os
import docx
import json
import pdfkit
from docxtpl import DocxTemplate, InlineImage
from datetime import datetime


if __name__ == "__main__":
    # Stock Ticker
    ticker = sys.argv[1]

    # File paths
    in_file = "commands/stocks/report.docx"
    out_file_docx = f"commands/stocks/{ticker}_sreport.docx"

    doc = DocxTemplate(in_file)

    graph_size = docx.shared.Inches(4)

    # Header
    date = datetime.now().strftime("%m/%d/%y")

    time = datetime.now().strftime("%H:%M:%S")

    # Quote Data
    quote_open = quote_high = quote_low = quote_price = quote_volume = quote_last_day = quote_last_close = quote_change = quote_change_percent = 0

    with open(f'commands/stocks/{ticker}_quote.json', mode='r') as data_file:
        data_dict = json.load(data_file)
        quote = data_dict["Global Quote"]

        quote_open = round(float(quote["02. open"]), 2)
        quote_high = round(float(quote["03. high"]), 2)
        quote_low = round(float(quote["04. low"]), 2)
        quote_price = round(float(quote["05. price"]), 2)
        quote_volume = quote["06. volume"]
        quote_last_day = quote["07. latest trading day"]
        quote_last_close = round(float(quote["08. previous close"]), 2)
        quote_change = round(float(quote["09. change"]), 2)
        quote_change_percent = quote["10. change percent"]

    # Intraday Data
    intraday_graph = InlineImage(
        doc, f'commands/stocks/{ticker}_intraday.png', graph_size)

    intraday_close = intraday_open = intraday_high = intraday_volume = intraday_avg_price = intraday_change = 0

    intraday_low = sys.maxsize

    with open(f'commands/stocks/{ticker}_intraday.json', mode='r') as data_file:
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
        intraday_change = round(intraday_close - intraday_open, 2)

    # Monthly Data
    monthly_graph = InlineImage(
        doc, f'commands/stocks/{ticker}_monthly.png', graph_size)

    monthly_close = monthly_open = monthly_high = monthly_volume = monthly_avg_price = monthly_change = 0

    monthly_low = sys.maxsize

    with open(f'commands/stocks/{ticker}_monthly.json', mode='r') as data_file:
        data_dict = json.load(data_file)
        time_series = data_dict['Monthly Time Series']
        keys = list(time_series.keys())

        monthly_close = float(time_series[keys[0]]["4. close"])
        monthly_open = round(
            float(time_series[keys[len(time_series)-1]]["1. open"]), 2)

        for timestamp, data in time_series.items():

            if float(data["2. high"]) > monthly_high:
                monthly_high = float(data["2. high"])

            if float(data["3. low"]) < monthly_low:
                monthly_low = float(data["3. low"])

            monthly_volume += int(data["5. volume"])

            monthly_avg_price += float(data["4. close"])

        monthly_avg_price /= len(time_series)
        monthly_avg_price = round(monthly_avg_price, 2)
        monthly_change = round(monthly_close - monthly_open, 2)
        

    context = {'ticker': ticker.upper(), 'date': date, 'time': time, 'quote_open': quote_open, 'quote_price1': quote_price, 'quote_high': quote_high, 'quote_low': quote_low,
               'quote_volume': quote_volume, 'quote_last_day': quote_last_day, 'quote_last_close': quote_last_close, 'quote_change': quote_change,
               'quote_change_percent': quote_change_percent,  'intraday_graph': intraday_graph, 'intraday_open': intraday_open,
               'intraday_close': intraday_close, 'intraday_high': intraday_high, 'intraday_low': intraday_low, 'intraday_change': intraday_change,
               'intraday_avg_price': intraday_avg_price, 'intraday_volume': intraday_volume, 'monthly_graph': monthly_graph, 'monthly_open': monthly_open,
               'monthly_close': monthly_close, 'monthly_high': monthly_high, 'monthly_low': monthly_low, 'monthly_change': monthly_change,
               'monthly_avg_price': monthly_avg_price, 'monthly_volume': monthly_volume}

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
