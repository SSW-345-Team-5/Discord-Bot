import sys
import os
import json
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

params = {"ytick.color": "b",
          "xtick.color": "b",
          "axes.labelcolor": "b",
          "axes.edgecolor": "b"}
plt.rcParams.update(params)

if __name__ == '__main__':

    if len(sys.argv) != 2:
        sys.exit(1)


    ticker = sys.argv[1]

    with open(f'commands/stocks/{ticker}_intraday.json', mode='r') as data_file:
        data_dict = json.load(data_file)
        interval = data_dict["Meta Data"]["4. Interval"]
        time_series = data_dict[f'Time Series ({interval})']

        data = []
        for k, v in time_series.items():
            datetime_object = datetime.strptime(k, '%Y-%m-%d %H:%M:%S')
            data.append([datetime_object, float(v['4. close'])])

        df = pd.DataFrame(data, columns=['time', 'close'])
        df.set_index('time')

        ax = df.plot(kind='line', x='time', y=['close'], title=f'{ticker.upper()} Intraday Data')
        ax.set_facecolor('#333333')
        ax.set_xlabel("Time")
        ax.set_ylabel("Close")

        plt.savefig(
            f'commands/stocks/{ticker}_intraday.png', transparent=True)
