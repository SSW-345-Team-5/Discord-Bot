import sys
import os
import json
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

params = {"ytick.color": "#4687d2",
          "xtick.color": "#4687d2",
          "axes.labelcolor": "#90b8e4",
          "axes.edgecolor": "#90b8e4",
          "axes.titlecolor": "#90b8e4"}
plt.rcParams.update(params)

if __name__ == '__main__':

    if len(sys.argv) != 2:
        sys.exit(1)


    ticker = sys.argv[1]
    with open(f'commands/stocks/{ticker}_monthly.json', mode='r') as data_file:
        data_dict = json.load(data_file)

        time_series = data_dict['Monthly Time Series']

        data = []
        for k, v in time_series.items():
            datetime_object = datetime.strptime(
                k, '%Y-%m-%d')
            data.append([datetime_object, float(
                v['4. close']), float(v['3. low']), float(v['2. high']), float(v['1. open'])])

        df = pd.DataFrame(data, columns=['time', 'close', 'low', 'high', 'open'])
        df.set_index('time')

        ax = df.plot(kind='line', x='time', y=['close','low', 'high', 'open'], title=f'{ticker.upper()} Monthly Data')
        ax.set_facecolor('#333333')
        ax.set_xlabel("time")
        ax.set_ylabel("price")

        plt.savefig(
            f'commands/stocks/{ticker}_monthly.png', transparent=True)
