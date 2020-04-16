import sys
import os
import json
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

params = {"ytick.color": "b",
          "xtick.color": "b",
          "axes.labelcolor": "b",
          "axes.edgecolor": "b",
          "axes.titlecolor": "w"}
plt.rcParams.update(params)

if __name__ == '__main__':

    '''
    Formating:
    <currency> [close | open | high | low]
    '''
    # arg_dict = {
    #     'open': '1. open',
    #     'high': '2. high',
    #     'low': '3. low',
    #     'close': '4. close',
    # 
    # plot_list = [arg_dict[arg] for arg in sys.argv[2:]]

    currency = sys.argv[1]
    market = sys.argv[2]

    with open(f'commands/currency/{currency}_{market}.json', mode='r') as data_file:
        data_dict = json.load(data_file)
        time_series = data_dict[f'Time Series (Digital Currency Daily)']

        data = []
        for k, v in time_series.items():
            # determine what data we need to plot
            datetime_object = datetime.strptime(k, '%Y-%m-%d')
            # row = [datetime_object]
            # for p in plot_list:
            #     row.append(float(v[p]))
            # data.append(row)
            data.append([datetime_object, float(
                v[f'4a. close ({market})']), float(v['4b. close (USD)'])])

        # cols = ['time'].extend(plot)
        df = pd.DataFrame(
            data, columns=['time', f'close ({market})', 'close (USD)'])
        df.set_index('time')

        ax = df.plot(kind='line', x='time', y=[
                     f'close ({market})', 'close (USD)'], title=f'{currency.upper()} Daily on {market}')
        ax.set_facecolor('#333333')
        ax.set_xlabel("Time")
        ax.set_ylabel("Close")

        plt.savefig(
            f'commands/currency/{currency}_{market}.png', transparent=True)
