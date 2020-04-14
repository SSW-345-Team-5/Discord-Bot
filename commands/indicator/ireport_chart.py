import sys
import os
import docx
import json
import pdfkit
import pandas as pd
import matplotlib.pyplot as plt
from docxtpl import DocxTemplate, InlineImage
from datetime import datetime


if __name__ == "__main__":
    # Ticker
    ticker = sys.argv[1]
    time_interval = sys.argv[2]
    series_type = sys.argv[3]

    # Header
    date = datetime.now().strftime("%m/%d/%y")
    time = datetime.now().strftime("%H:%M:%S")

    # File Paths
    in_file = "commands/indicator/ireport.docx"
    out_file_docx = f"commands/indicator/{ticker}_ireport.docx"

    doc = DocxTemplate(in_file)

    graph_size = docx.shared.Inches(3.75)

    # Context
    context = {'ticker': ticker.upper(), 'date': date, 'time': time, 'time_interval': time_interval.capitalize(),
               'series_type': series_type.capitalize()}

    # Indicator Dictionary & Graph Generation
    ind_dict = ["SMA", "EMA", "MACD", "RSI", "CCI"]

    for indicator in ind_dict:
        with open(f'commands/indicator/{ticker}_{time_interval}_{series_type}_{indicator}.json', mode='r') as data_file:
            data_dict = json.load(data_file)
            time_series = data_dict[f'Technical Analysis: {indicator}']

            low = sys.maxsize
            high = 0
            avg = 0

            data = []

            # For every data entry
            for timestamp, entry in time_series.items():
                # Graph Population
                datetime_object = datetime.strptime(timestamp, '%Y-%m-%d')
                data.append(
                    [datetime_object, float(entry[f'{indicator}'])])

                # Numerical Value Calculation
                data_point = round(float(entry[f'{indicator}']), 2)

                if data_point > high:
                    high = data_point
                if data_point < low:
                    low = data_point

                avg += data_point

            avg = round(avg / len(time_series), 2)

            df = pd.DataFrame(data, columns=['time', f'{indicator}'])
            df.set_index('time')

            ax = df.plot(kind='line', x='time', y=[
                         f'{indicator}'], title=f'{ticker.upper()}: {time_interval.upper()} {indicator} ({series_type.upper()})')
            ax.set_facecolor('#333333')
            ax.set_xlabel("Time")
            ax.set_ylabel(f'{indicator}')

            graph = f'commands/indicator/{ticker}_{indicator}.png'

            plt.savefig(
                graph, transparent=True)

            # Context Updating
            context[f'{indicator.lower()}_label'] = data_dict["Meta Data"]["2: Indicator"]
            context[f'{indicator.lower()}_low'] = low
            context[f'{indicator.lower()}_high'] = high
            context[f'{indicator.lower()}_avg'] = avg
            context[f'{indicator.lower()}_png'] = InlineImage(
                doc, graph, graph_size)

    doc.render(context)
    doc.save(out_file_docx)

    # Clean Up
    for indicator in ind_dict:
        os.remove(
            f'commands/indicator/{ticker}_{time_interval}_{series_type}_{indicator}.json')
        os.remove(f'commands/indicator/{ticker}_{indicator}.png')
