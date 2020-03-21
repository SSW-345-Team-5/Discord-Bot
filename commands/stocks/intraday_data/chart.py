import sys
import os
import json
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

params = {"ytick.color": "w",
          "xtick.color": "w",
          "axes.labelcolor": "w",
          "axes.edgecolor": "w"}
plt.rcParams.update(params)

if __name__ == '__main__':

    '''
    Formating:
    <ticker> [close | open | high | low]
    '''
    # arg_dict = {
    #     'open': '1. open',
    #     'high': '2. high',
    #     'low': '3. low',
    #     'close': '4. close',
    # }

    if len(sys.argv) != 2:
        sys.exit(1)
    
    # plot_list = [arg_dict[arg] for arg in sys.argv[2:]]

    ticker = sys.argv[1]
    with open(f'commands/stocks/intraday_data/{ticker}.json', mode='r') as data_file:
        data_dict = json.load(data_file)
        interval = data_dict["Meta Data"]["4. Interval"]
        time_series = data_dict[f'Time Series ({interval})']

        data = []
        for k, v in time_series.items():
            # determine what data we need to plot
            datetime_object = datetime.strptime(
                k, '%Y-%m-%d %H:%M:%S')
            # row = [datetime_object]
            # for p in plot_list:
            #     row.append(float(v[p]))
            # data.append(row)
            data.append([datetime_object, float(v['4. close'])])

        # cols = ['time'].extend(plot)
        df = pd.DataFrame(data, columns=['time', 'close'])
        df.set_index('time')

        ax = df.plot(kind='line', x='time', y=['close'])
        ax.set_facecolor('#333333')
        ax.set_xlabel("time")
        ax.set_ylabel("close")

        
        plt.savefig(
            f'commands/stocks/intraday_data/{ticker}.png', transparent=True)
        